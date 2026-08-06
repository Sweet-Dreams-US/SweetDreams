/**
 * Admin: update a free-website inquiry's pipeline status / notes.
 *
 * Protected by the same standalone admin session cookie as /admin/* pages
 * (sd_admin_session, verified via lib/admin-session). Service role bypasses
 * RLS to write marketing_leads. Never touches capture/tracking.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const INQUIRY_STATUSES = [
  'new',
  'contacted',
  'building',
  'signed',
  'live',
  'declined',
] as const;

export async function POST(request: NextRequest) {
  if (!verifySession(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: { id?: string; status?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const { id, status, notes } = body;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ ok: false, error: 'missing id' }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (status !== undefined) {
    if (!INQUIRY_STATUSES.includes(status as (typeof INQUIRY_STATUSES)[number])) {
      return NextResponse.json({ ok: false, error: 'invalid status' }, { status: 400 });
    }
    update.status = status;
    update.status_updated_at = new Date().toISOString();
  }
  if (notes !== undefined) {
    update.admin_notes = typeof notes === 'string' ? notes.slice(0, 2000) : null;
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: false, error: 'nothing to update' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('marketing_leads').update(update).eq('id', id);
  if (error) {
    console.error('[admin/leads/status] update failed:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
