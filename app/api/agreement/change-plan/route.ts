/**
 * Public: the signer wants different options. Validates their (still
 * unused) sign token, revokes the pending agreement + its links, moves the
 * site back to the choosing stage, and mints a fresh welcome link so they
 * land on the plan picker. Their original emailed welcome link (if any)
 * keeps working — this adds a link, it never kills view access.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { checkRateLimit } from '@/lib/spam-filter';
import {
  hashToken,
  mintToken,
  WELCOME_TOKEN_TTL_MS,
} from '@/lib/agreements/tokens';
import { requestBaseUrl } from '@/lib/base-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const clientIp =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    undefined;
  if (clientIp && !checkRateLimit(`chplan:${clientIp}`, 10)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again shortly.' },
      { status: 429 }
    );
  }

  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  const token = typeof body.token === 'string' ? body.token : '';
  if (!token || token.length > 200) {
    return NextResponse.json({ ok: false, error: 'invalid link' }, { status: 410 });
  }

  const supabase = createServiceRoleClient();
  const nowIso = new Date().toISOString();

  const { data } = await supabase
    .from('agreement_tokens')
    .select('agreement_id, used_at, revoked_at, expires_at, agreements (id, status, site_id)')
    .eq('token_hash', hashToken(token))
    .eq('purpose', 'sign')
    .maybeSingle();
  const tok = data as unknown as {
    agreement_id: string;
    used_at: string | null;
    revoked_at: string | null;
    expires_at: string;
    agreements: { id: string; status: string; site_id: string } | null;
  } | null;

  if (
    !tok ||
    !tok.agreements ||
    tok.used_at ||
    tok.revoked_at ||
    new Date(tok.expires_at).getTime() <= Date.now()
  ) {
    return NextResponse.json({ ok: false, error: 'This link is no longer active.' }, { status: 410 });
  }
  if (tok.agreements.status !== 'sent') {
    return NextResponse.json(
      { ok: false, error: 'This agreement is already signed.' },
      { status: 409 }
    );
  }

  const agreementId = tok.agreements.id;
  const siteId = tok.agreements.site_id;

  await supabase
    .from('agreements')
    .update({
      status: 'revoked',
      revoked_at: nowIso,
      revoke_reason: 'client chose to change plan from the signing page',
    })
    .eq('id', agreementId)
    .eq('status', 'sent');
  await supabase
    .from('agreement_tokens')
    .update({ revoked_at: nowIso })
    .eq('agreement_id', agreementId)
    .is('used_at', null)
    .is('revoked_at', null);

  await supabase
    .from('sites')
    .update({ status: 'demo_sent', status_updated_at: nowIso })
    .eq('id', siteId)
    .eq('status', 'agreement_sent');

  const welcome = mintToken();
  const { error: tokErr } = await supabase.from('site_tokens').insert({
    site_id: siteId,
    purpose: 'welcome',
    token_hash: welcome.hash,
    expires_at: new Date(Date.now() + WELCOME_TOKEN_TTL_MS).toISOString(),
  });
  if (tokErr) {
    console.error('[agreement/change-plan] welcome token insert failed:', tokErr);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    welcome_url: `${requestBaseUrl(request)}/welcome/${welcome.raw}`,
  });
}
