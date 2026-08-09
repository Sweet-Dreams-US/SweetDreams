/**
 * Admin: send (or resend) the agreement for a site.
 *
 * New send renders the latest template; resend reuses the stored snapshot,
 * revokes old links, and mints a fresh one. Refuses once signed.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { sendAgreementForSite } from '@/lib/agreements/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!verifySession(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: { site_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  if (!body.site_id || typeof body.site_id !== 'string') {
    return NextResponse.json({ ok: false, error: 'missing site_id' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const result = await sendAgreementForSite(supabase, body.site_id);
  const { status, ...rest } = result;
  return NextResponse.json(rest, { status });
}
