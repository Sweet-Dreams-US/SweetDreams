/**
 * Public: set the portal password right after signing.
 *
 * Only reachable with a single-use account_setup token, which is only ever
 * minted inside a successful signature for a BRAND NEW account — so
 * password-without-signature is impossible, and existing accounts can never
 * be overwritten from here.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { hashToken } from '@/lib/agreements/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: { setup_token?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const setupToken = typeof body.setup_token === 'string' ? body.setup_token : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!setupToken) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 410 });
  }
  if (password.length < 8 || password.length > 200) {
    return NextResponse.json(
      { ok: false, error: 'Password must be at least 8 characters.' },
      { status: 400 }
    );
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
    console.error('[agreement/set-password] claim failed:', claimErr);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
  if (!claimed || claimed.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'This setup link is no longer valid. Use the emailed link or Forgot Password on the portal login page.',
      },
      { status: 410 }
    );
  }

  const { data: agr } = await supabase
    .from('agreements')
    .select('client_id, clients (email, auth_user_id)')
    .eq('id', claimed[0].agreement_id)
    .single();
  const client = (
    agr as unknown as {
      clients: { email: string; auth_user_id: string | null } | null;
    } | null
  )?.clients;
  if (!client?.auth_user_id) {
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }

  const { error: updErr } = await supabase.auth.admin.updateUserById(
    client.auth_user_id,
    { password }
  );
  if (updErr) {
    console.error('[agreement/set-password] updateUserById failed:', updErr);
    return NextResponse.json(
      { ok: false, error: 'Could not set your password. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, email: client.email });
}
