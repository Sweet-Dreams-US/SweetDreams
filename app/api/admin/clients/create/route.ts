/**
 * Admin: create a client + their first site, optionally sending the
 * agreement in the same call.
 *
 * Auth: standalone admin session cookie (same as all /admin pages).
 * Partial failure is recoverable: if the site insert or the send fails the
 * client row persists and the response says exactly what happened, so the
 * admin can finish from the client detail page instead of re-entering data.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { DB_MODES, type DbMode } from '@/lib/clients/constants';
import { sendAgreementForSite } from '@/lib/agreements/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface CreateBody {
  business_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  source_lead_id?: string;
  site?: {
    name?: string;
    domain?: string;
    hosting_price_cents?: number;
    update_hours_per_quarter?: number | null;
    build_price_cents?: number;
    billing_anchor_day?: number;
    db_mode?: string;
  };
  send_agreement?: boolean;
}

export async function POST(request: NextRequest) {
  if (!verifySession(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: CreateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const businessName = (body.business_name ?? '').trim();
  const contactName = (body.contact_name ?? '').trim();
  const email = (body.email ?? '').trim().toLowerCase();
  const phone = (body.phone ?? '').trim();
  const site = body.site ?? {};

  if (!businessName || !contactName) {
    return NextResponse.json(
      { ok: false, error: 'business_name and contact_name are required' },
      { status: 400 }
    );
  }
  if (!email || !email.includes('@') || email.length > 320) {
    return NextResponse.json({ ok: false, error: 'valid email required' }, { status: 400 });
  }

  const hostingPriceCents = site.hosting_price_cents;
  if (
    typeof hostingPriceCents !== 'number' ||
    !Number.isInteger(hostingPriceCents) ||
    hostingPriceCents < 0
  ) {
    return NextResponse.json(
      { ok: false, error: 'site.hosting_price_cents must be a non negative integer' },
      { status: 400 }
    );
  }

  const buildPriceCents = site.build_price_cents ?? 0;
  if (!Number.isInteger(buildPriceCents) || buildPriceCents < 0) {
    return NextResponse.json(
      { ok: false, error: 'site.build_price_cents must be a non negative integer' },
      { status: 400 }
    );
  }

  const updateHours =
    site.update_hours_per_quarter === null || site.update_hours_per_quarter === undefined
      ? null
      : site.update_hours_per_quarter;
  if (updateHours !== null && (!Number.isInteger(updateHours) || updateHours < 0)) {
    return NextResponse.json(
      { ok: false, error: 'site.update_hours_per_quarter must be a non negative integer' },
      { status: 400 }
    );
  }

  const anchorDay = site.billing_anchor_day ?? 1;
  if (anchorDay !== 1 && anchorDay !== 15) {
    return NextResponse.json(
      { ok: false, error: 'site.billing_anchor_day must be 1 or 15' },
      { status: 400 }
    );
  }

  const dbMode = (site.db_mode ?? 'shared') as DbMode;
  if (!DB_MODES.includes(dbMode)) {
    return NextResponse.json({ ok: false, error: 'invalid site.db_mode' }, { status: 400 });
  }

  // Bad lead ids should not sink client creation — just drop the reference.
  const sourceLeadId =
    body.source_lead_id && UUID_RE.test(body.source_lead_id) ? body.source_lead_id : null;

  const supabase = createServiceRoleClient();

  const { data: clientRow, error: clientErr } = await supabase
    .from('clients')
    .insert({
      business_name: businessName,
      contact_name: contactName,
      email,
      phone: phone || null,
      source_lead_id: sourceLeadId,
    })
    .select('id')
    .single();
  if (clientErr || !clientRow) {
    console.error('[admin/clients/create] client insert failed:', clientErr);
    return NextResponse.json(
      { ok: false, error: clientErr?.message ?? 'client insert failed' },
      { status: 500 }
    );
  }

  const { data: siteRow, error: siteErr } = await supabase
    .from('sites')
    .insert({
      client_id: clientRow.id,
      name: (site.name ?? '').trim() || businessName,
      domain: (site.domain ?? '').trim() || null,
      hosting_price_cents: hostingPriceCents,
      update_hours_per_quarter: updateHours,
      build_price_cents: buildPriceCents,
      billing_anchor_day: anchorDay,
      db_mode: dbMode,
    })
    .select('id')
    .single();
  if (siteErr || !siteRow) {
    console.error('[admin/clients/create] site insert failed:', siteErr);
    return NextResponse.json(
      {
        ok: false,
        client_id: clientRow.id,
        error: `client created but site insert failed: ${siteErr?.message ?? 'unknown'}`,
      },
      { status: 500 }
    );
  }

  if (!body.send_agreement) {
    return NextResponse.json({ ok: true, client_id: clientRow.id, site_id: siteRow.id });
  }

  const sent = await sendAgreementForSite(supabase, siteRow.id);
  if (!sent.ok) {
    return NextResponse.json({
      ok: true,
      client_id: clientRow.id,
      site_id: siteRow.id,
      send_error: sent.error,
    });
  }
  return NextResponse.json({
    ok: true,
    client_id: clientRow.id,
    site_id: siteRow.id,
    agreement_id: sent.agreement_id,
    signing_url: sent.signing_url,
    email_ok: sent.email_ok,
  });
}
