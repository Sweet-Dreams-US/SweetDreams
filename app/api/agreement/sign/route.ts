/**
 * Public: sign an agreement via a single-use token.
 *
 * Order of operations matters:
 * 1. ATOMIC token claim — one UPDATE with all validity conditions in the
 *    WHERE clause, so two tabs racing can never both sign.
 * 2. Conditional signature write (status must still be 'sent'; 409 for the
 *    race loser).
 * 3. Account provisioning: LINK an existing auth user by email (music
 *    customers share this auth pool — their password is never touched) or
 *    create a fresh one flagged account_type=website_client so the music
 *    profile trigger skips it. Provisioning failure never voids the
 *    signature — the admin can send a password link later.
 * 4. Emails are best effort.
 */
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { formatInTimeZone } from 'date-fns-tz';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { checkRateLimit } from '@/lib/spam-filter';
import {
  hashToken,
  mintToken,
  SETUP_TOKEN_TTL_MS,
} from '@/lib/agreements/tokens';
import { sha256Hex } from '@/lib/agreements/render';
import { SIGN_CONSENTS } from '@/lib/agreements/consents';
import { BUSINESS_TZ } from '@/lib/agreements/service';
import type { AgreementVariables } from '@/lib/agreements/templates';
import { requestBaseUrl } from '@/lib/base-url';
import { ADMIN_EMAIL } from '@/lib/emails/resend';
import { sendEmail } from '@/lib/emails/send';
import AgreementSignedClient from '@/lib/emails/agreement-signed-client';
import AgreementSignedAdmin from '@/lib/emails/agreement-signed-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SignBody {
  token?: string;
  name?: string;
  signature_image?: string;
  consents?: { agree_terms?: boolean; esign_consent?: boolean };
}

const SIGNATURE_PREFIX = 'data:image/png;base64,';
const SIGNATURE_MAX_LENGTH = 300_000; // ~220KB of PNG, far above a normal stroke drawing

function validSignatureImage(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.startsWith(SIGNATURE_PREFIX) &&
    value.length > SIGNATURE_PREFIX.length + 100 &&
    value.length <= SIGNATURE_MAX_LENGTH &&
    /^[A-Za-z0-9+/=]+$/.test(value.slice(SIGNATURE_PREFIX.length))
  );
}

interface AgreementWithClient {
  id: string;
  status: string;
  rendered_text: string;
  variables: AgreementVariables;
  site_id: string;
  client_id: string;
  clients: {
    id: string;
    business_name: string;
    contact_name: string;
    email: string;
    auth_user_id: string | null;
  } | null;
}

export async function POST(request: NextRequest) {
  const clientIp =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    undefined;

  if (clientIp && !checkRateLimit(`sign:${clientIp}`, 10)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again shortly.' },
      { status: 429 }
    );
  }

  let body: SignBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const token = typeof body.token === 'string' ? body.token : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!token || token.length > 200) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 410 });
  }
  if (name.length < 2 || name.length > 200) {
    return NextResponse.json(
      { ok: false, error: 'Please type your full legal name.' },
      { status: 400 }
    );
  }
  if (!validSignatureImage(body.signature_image)) {
    return NextResponse.json(
      { ok: false, error: 'Please draw your signature in the box.' },
      { status: 400 }
    );
  }
  if (body.consents?.agree_terms !== true || body.consents?.esign_consent !== true) {
    return NextResponse.json(
      { ok: false, error: 'Both consent boxes are required to sign.' },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();
  const nowIso = new Date().toISOString();
  const tokenHash = hashToken(token);

  // 1. Atomic single-use claim.
  const { data: claimed, error: claimErr } = await supabase
    .from('agreement_tokens')
    .update({ used_at: nowIso })
    .eq('token_hash', tokenHash)
    .eq('purpose', 'sign')
    .is('used_at', null)
    .is('revoked_at', null)
    .gt('expires_at', nowIso)
    .select('agreement_id');

  if (claimErr) {
    console.error('[agreement/sign] claim failed:', claimErr);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }

  if (!claimed || claimed.length === 0) {
    // Explain the failure to the UI without leaking token existence broadly.
    const { data: t } = await supabase
      .from('agreement_tokens')
      .select('used_at, revoked_at, expires_at, agreements (status)')
      .eq('token_hash', tokenHash)
      .eq('purpose', 'sign')
      .maybeSingle();
    const agrStatus = (t as unknown as { agreements: { status: string } | null } | null)
      ?.agreements?.status;
    if (agrStatus === 'signed') {
      return NextResponse.json({ ok: false, error: 'already_signed' }, { status: 409 });
    }
    if (
      t &&
      !t.used_at &&
      !t.revoked_at &&
      new Date(t.expires_at).getTime() <= Date.now()
    ) {
      return NextResponse.json({ ok: false, error: 'expired' }, { status: 410 });
    }
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 410 });
  }

  const agreementId = claimed[0].agreement_id as string;

  const { data: agrData, error: agrErr } = await supabase
    .from('agreements')
    .select(
      'id, status, rendered_text, variables, site_id, client_id, clients (id, business_name, contact_name, email, auth_user_id)'
    )
    .eq('id', agreementId)
    .single();
  if (agrErr || !agrData) {
    console.error('[agreement/sign] agreement load failed:', agrErr);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
  const agreement = agrData as unknown as AgreementWithClient;
  const client = agreement.clients;
  if (!client) {
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
  if (agreement.status !== 'sent') {
    return NextResponse.json({ ok: false, error: 'already_signed' }, { status: 409 });
  }

  // 2. Write the signature (conditional on status for race safety).
  const signedSha = sha256Hex(agreement.rendered_text);
  const consentsRecord = SIGN_CONSENTS.map((c) => ({
    key: c.key,
    label: c.label,
    checked: true,
  }));

  const { data: signedRows, error: signErr } = await supabase
    .from('agreements')
    .update({
      status: 'signed',
      signed_at: nowIso,
      signer_name: name,
      signer_ip: clientIp ?? null,
      signer_user_agent: request.headers.get('user-agent')?.slice(0, 500) ?? null,
      consents: consentsRecord,
      signed_content_sha256: signedSha,
      signature_image: body.signature_image,
    })
    .eq('id', agreement.id)
    .eq('status', 'sent')
    .select('id');
  if (signErr) {
    console.error('[agreement/sign] signature write failed:', signErr);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
  if (!signedRows || signedRows.length === 0) {
    return NextResponse.json({ ok: false, error: 'already_signed' }, { status: 409 });
  }

  await supabase
    .from('sites')
    .update({ status: 'signed', status_updated_at: nowIso })
    .eq('id', agreement.site_id)
    .in('status', ['draft', 'agreement_sent']);

  // 3. Account provisioning (never fatal to the signature).
  let authUserId = client.auth_user_id;
  let hasExistingAccount = Boolean(authUserId);
  let accountError: string | null = null;

  if (!authUserId) {
    const { data: existingId } = await supabase.rpc('get_auth_user_id_by_email', {
      p_email: client.email,
    });
    if (existingId) {
      authUserId = existingId as string;
      hasExistingAccount = true;
    } else {
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: client.email,
        email_confirm: true,
        password: randomBytes(32).toString('base64url'),
        user_metadata: { account_type: 'website_client', full_name: name },
      });
      if (createErr || !created?.user) {
        console.error('[agreement/sign] account creation failed:', createErr);
        accountError = createErr?.message ?? 'account creation failed';
      } else {
        authUserId = created.user.id;
      }
    }
    if (authUserId) {
      await supabase
        .from('clients')
        .update({ auth_user_id: authUserId })
        .eq('id', client.id);
    }
  }

  // Setup token only for brand-new accounts (existing accounts keep their
  // password; this flow must never offer to overwrite it).
  let setupToken: string | null = null;
  if (authUserId && !hasExistingAccount) {
    const t = mintToken();
    const { error: setupErr } = await supabase.from('agreement_tokens').insert({
      agreement_id: agreement.id,
      purpose: 'account_setup',
      token_hash: t.hash,
      expires_at: new Date(Date.now() + SETUP_TOKEN_TTL_MS).toISOString(),
    });
    if (!setupErr) setupToken = t.raw;
    else console.error('[agreement/sign] setup token insert failed:', setupErr);
  }

  // 4. Confirmation emails (best effort).
  const vars = agreement.variables;
  const signedAtDisplay = formatInTimeZone(
    new Date(),
    BUSINESS_TZ,
    "MMMM d, yyyy 'at' h:mm a zzz"
  );

  await sendEmail({
    to: client.email,
    subject: `Signed: your Sweet Dreams agreement for ${client.business_name}`,
    react: AgreementSignedClient({
      contactName: client.contact_name,
      businessName: client.business_name,
      agreementText: agreement.rendered_text,
      signerName: name,
      signedAtDisplay,
      sha256: signedSha,
      portalUrl: `${requestBaseUrl(request)}/portal`,
    }),
  });

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Signed: ${client.business_name} (${vars.hosting_price}/mo)`,
    react: AgreementSignedAdmin({
      businessName: client.business_name,
      contactName: client.contact_name,
      email: client.email,
      hostingPrice: vars.hosting_price,
      updateHours: vars.update_hours,
      buildPrice: vars.build_price,
      anchorDay: vars.billing_anchor_day,
      signerName: name,
      signedAtDisplay,
      signerIp: clientIp ?? 'unknown',
      adminUrl: `${requestBaseUrl(request)}/admin/clients/${client.id}`,
      accountNote: hasExistingAccount
        ? 'linked to their existing account'
        : authUserId
          ? 'new portal account created'
          : `ACCOUNT CREATION FAILED (${accountError}). Send a password link from admin.`,
    }),
  });

  return NextResponse.json({
    ok: true,
    setup_token: setupToken,
    has_existing_account: hasExistingAccount,
    email: client.email,
  });
}
