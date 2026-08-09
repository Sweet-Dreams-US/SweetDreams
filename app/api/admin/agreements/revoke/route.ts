/**
 * Admin: revoke a sent agreement (kills all its live links). Signed
 * agreements can never be revoked (they are immutable). Resets the site
 * back to draft if it was waiting on this agreement.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!verifySession(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: { agreement_id?: string; reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  if (!body.agreement_id || typeof body.agreement_id !== 'string') {
    return NextResponse.json({ ok: false, error: 'missing agreement_id' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: agreement, error } = await supabase
    .from('agreements')
    .select('id, status, site_id')
    .eq('id', body.agreement_id)
    .single();
  if (error || !agreement) {
    return NextResponse.json({ ok: false, error: 'agreement not found' }, { status: 404 });
  }
  if (agreement.status === 'signed') {
    return NextResponse.json(
      { ok: false, error: 'signed agreements cannot be revoked' },
      { status: 400 }
    );
  }

  if (agreement.status === 'sent') {
    const { error: updErr } = await supabase
      .from('agreements')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoke_reason:
          typeof body.reason === 'string' ? body.reason.slice(0, 500) : null,
      })
      .eq('id', agreement.id)
      .eq('status', 'sent');
    if (updErr) {
      return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
    }
  }

  // Kill every live link for this agreement (both purposes). Idempotent.
  const { error: tokErr } = await supabase
    .from('agreement_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('agreement_id', agreement.id)
    .is('used_at', null)
    .is('revoked_at', null);
  if (tokErr) {
    return NextResponse.json({ ok: false, error: tokErr.message }, { status: 500 });
  }

  await supabase
    .from('sites')
    .update({ status: 'draft', status_updated_at: new Date().toISOString() })
    .eq('id', agreement.site_id)
    .eq('status', 'agreement_sent');

  return NextResponse.json({ ok: true });
}
