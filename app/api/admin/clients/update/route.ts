/**
 * Admin: edit a client's contact info + notes.
 * Same auth pattern as every admin route. Email changes only affect
 * FUTURE emails/invites — existing auth accounts and signed agreements
 * are never touched from here.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface UpdateBody {
  client_id?: string;
  business_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string | null;
  admin_notes?: string | null;
}

export async function POST(request: NextRequest) {
  if (!verifySession(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: UpdateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  if (!body.client_id || typeof body.client_id !== 'string') {
    return NextResponse.json({ ok: false, error: 'missing client_id' }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  if (body.business_name !== undefined) {
    const v = String(body.business_name).trim();
    if (!v) return NextResponse.json({ ok: false, error: 'business name cannot be empty' }, { status: 400 });
    update.business_name = v.slice(0, 200);
  }
  if (body.contact_name !== undefined) {
    const v = String(body.contact_name).trim();
    if (!v) return NextResponse.json({ ok: false, error: 'contact name cannot be empty' }, { status: 400 });
    update.contact_name = v.slice(0, 200);
  }
  if (body.email !== undefined) {
    const v = String(body.email).trim().toLowerCase();
    if (!v.includes('@') || v.length > 320) {
      return NextResponse.json({ ok: false, error: 'valid email required' }, { status: 400 });
    }
    update.email = v;
  }
  if (body.phone !== undefined) {
    const v = body.phone === null ? '' : String(body.phone).trim();
    update.phone = v ? v.slice(0, 50) : null;
  }
  if (body.admin_notes !== undefined) {
    const v = body.admin_notes === null ? '' : String(body.admin_notes).trim();
    update.admin_notes = v ? v.slice(0, 2000) : null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: false, error: 'nothing to update' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('clients').update(update).eq('id', body.client_id);
  if (error) {
    console.error('[admin/clients/update] failed:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
