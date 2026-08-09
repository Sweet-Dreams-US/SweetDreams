/**
 * Public: signer chose "email me a link" instead of setting a password
 * inline. Claims the setup token and sends Supabase's own recovery link
 * via our branded email.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { hashToken } from '@/lib/agreements/tokens';
import { SITE_URL } from '@/lib/constants';
import { sendEmail } from '@/lib/emails/send';
import SetPasswordEmail from '@/lib/emails/set-password';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: { setup_token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  const setupToken = typeof body.setup_token === 'string' ? body.setup_token : '';
  if (!setupToken) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 410 });
  }

  const supabase = createServiceRoleClient();
  const nowIso = new Date().toISOString();

  const { data: claimed, error: claimErr } = await supabase
    .from('agreement_tokens')
    .update({ used_at: nowIso })
    .eq('token_hash', hashToken(setupToken))
    .eq('purpose', 'account_setup')
    .is('used_at', null)
    .is('revoked_at', null)
    .gt('expires_at', nowIso)
    .select('agreement_id');
  if (claimErr) {
    console.error('[agreement/skip-password] claim failed:', claimErr);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
  if (!claimed || claimed.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'This setup link is no longer valid.' },
      { status: 410 }
    );
  }

  const { data: agr } = await supabase
    .from('agreements')
    .select('client_id, clients (contact_name, email, auth_user_id)')
    .eq('id', claimed[0].agreement_id)
    .single();
  const client = (
    agr as unknown as {
      clients: {
        contact_name: string;
        email: string;
        auth_user_id: string | null;
      } | null;
    } | null
  )?.clients;
  if (!client?.auth_user_id) {
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }

  const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: client.email,
    options: {
      redirectTo: `${SITE_URL}/auth/callback?next=/portal/set-password`,
    },
  });
  const actionLink = linkData?.properties?.action_link;
  if (linkErr || !actionLink) {
    console.error('[agreement/skip-password] generateLink failed:', linkErr);
    return NextResponse.json(
      { ok: false, error: 'Could not create the email link. Please try again.' },
      { status: 500 }
    );
  }

  const email = await sendEmail({
    to: client.email,
    subject: 'Set your Sweet Dreams portal password',
    react: SetPasswordEmail({
      contactName: client.contact_name,
      actionUrl: actionLink,
    }),
  });

  return NextResponse.json({ ok: true, email_ok: email.ok });
}
