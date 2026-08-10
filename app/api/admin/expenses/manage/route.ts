/**
 * Admin: create or delete site expense entries.
 * recurring=true creates a monthly template (materialized at month close);
 * otherwise a dated actual entry (month defaults to the current month).
 */
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '@/lib/clients/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Body {
  action?: 'create' | 'delete';
  id?: string;
  site_id?: string;
  category?: string;
  description?: string;
  amount_cents?: number;
  recurring?: boolean;
  month?: string;
}

export async function POST(request: NextRequest) {
  if (!verifySession(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  if (body.action === 'delete') {
    if (!body.id) return NextResponse.json({ ok: false, error: 'missing id' }, { status: 400 });
    const { error } = await supabase.from('site_expenses').delete().eq('id', body.id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (!body.site_id || typeof body.site_id !== 'string') {
    return NextResponse.json({ ok: false, error: 'missing site_id' }, { status: 400 });
  }
  if (!EXPENSE_CATEGORIES.includes(body.category as ExpenseCategory)) {
    return NextResponse.json({ ok: false, error: 'invalid category' }, { status: 400 });
  }
  if (
    typeof body.amount_cents !== 'number' ||
    !Number.isInteger(body.amount_cents) ||
    body.amount_cents < 0
  ) {
    return NextResponse.json({ ok: false, error: 'invalid amount' }, { status: 400 });
  }

  const recurring = body.recurring === true;
  let month: string | null = null;
  if (!recurring) {
    if (body.month && /^\d{4}-\d{2}$/.test(body.month)) month = `${body.month}-01`;
    else month = new Date().toISOString().slice(0, 8) + '01';
  }

  const { error } = await supabase.from('site_expenses').insert({
    site_id: body.site_id,
    category: body.category,
    description:
      typeof body.description === 'string' ? body.description.slice(0, 500) : null,
    amount_cents: body.amount_cents,
    recurring,
    month,
  });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
