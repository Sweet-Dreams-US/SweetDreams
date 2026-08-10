/**
 * Admin: close a month.
 *
 * 1. Materializes every recurring expense template into a dated entry for
 *    the month (idempotent via the (template_id, month) unique index).
 * 2. Computes payouts from live, priced, builder-assigned sites:
 *    65% of each site's monthly revenue to its builder, 35% to the
 *    business. One row per payee per month; already-closed months are
 *    never overwritten. Sites without a builder are skipped and reported.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { BUILDER_SHARE, type Builder } from '@/lib/clients/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!verifySession(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: { month?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  if (!body.month || !/^\d{4}-\d{2}$/.test(body.month)) {
    return NextResponse.json({ ok: false, error: 'month must be YYYY-MM' }, { status: 400 });
  }
  const monthDate = `${body.month}-01`;

  const supabase = createServiceRoleClient();

  // 1. Materialize recurring templates for this month.
  const { data: templates } = await supabase
    .from('site_expenses')
    .select('id, site_id, category, description, amount_cents')
    .eq('recurring', true);
  let materialized = 0;
  for (const t of templates ?? []) {
    const { error } = await supabase.from('site_expenses').insert({
      site_id: t.site_id,
      category: t.category,
      description: t.description,
      amount_cents: t.amount_cents,
      recurring: false,
      month: monthDate,
      template_id: t.id,
    });
    if (!error) materialized++;
    // unique (template_id, month) violation = already materialized; fine
  }

  // 2. Compute payouts from builder-assigned revenue.
  const { data: sites } = await supabase
    .from('sites')
    .select('id, name, status, hosting_price_cents, analytics_addon, builder')
    .eq('status', 'live')
    .gt('hosting_price_cents', 0);

  const totals: Record<string, number> = { jay: 0, cole: 0, business: 0 };
  const unassigned: string[] = [];
  for (const s of sites ?? []) {
    const revenue = s.hosting_price_cents as number;
    if (!s.builder) {
      unassigned.push(s.name as string);
      continue;
    }
    const builderCut = Math.round(revenue * BUILDER_SHARE);
    totals[s.builder as Builder] += builderCut;
    totals.business += revenue - builderCut;
  }

  const created: string[] = [];
  const existing: string[] = [];
  for (const payee of ['jay', 'cole', 'business'] as const) {
    if (totals[payee] <= 0) continue;
    const { error } = await supabase.from('payouts').insert({
      month: monthDate,
      payee,
      amount_cents: totals[payee],
      note: `Auto close ${body.month}`,
    });
    if (error) existing.push(payee);
    else created.push(payee);
  }

  return NextResponse.json({
    ok: true,
    month: body.month,
    materialized_recurring: materialized,
    payouts_created: created,
    payouts_already_existed: existing,
    unassigned_sites: unassigned,
    totals,
  });
}
