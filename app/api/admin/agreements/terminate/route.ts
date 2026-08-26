/**
 * Admin: terminate a SIGNED agreement.
 *
 * Per the contract: before the site is officially live either party may end
 * instantly (effective today); once live, a 60 day notice period applies
 * (effective = today + 60 days, hosting continues through it). The signed
 * snapshot stays frozen — only the termination lifecycle fields change.
 * Confirms any pending cancellation request for the site and emails the
 * client a plain notice.
 */
import { NextRequest, NextResponse } from 'next/server';
import { addDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { BUSINESS_TZ } from '@/lib/agreements/service';
import { requestBaseUrl } from '@/lib/base-url';
import { sendEmail } from '@/lib/emails/send';
import AgreementTerminated from '@/lib/emails/agreement-terminated';

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

  const { data } = await supabase
    .from('agreements')
    .select(
      'id, status, terminated_at, site_id, clients (id, business_name, contact_name, email), sites!agreements_site_id_fkey (id, status)'
    )
    .eq('id', body.agreement_id)
    .maybeSingle();
  const agreement = data as unknown as {
    id: string;
    status: string;
    terminated_at: string | null;
    site_id: string;
    clients: { id: string; business_name: string; contact_name: string; email: string } | null;
    sites: { id: string; status: string } | null;
  } | null;

  if (!agreement || !agreement.clients) {
    return NextResponse.json({ ok: false, error: 'agreement not found' }, { status: 404 });
  }
  if (agreement.status !== 'signed') {
    return NextResponse.json(
      { ok: false, error: 'only signed agreements can be terminated (revoke unsigned ones instead)' },
      { status: 400 }
    );
  }
  if (agreement.terminated_at) {
    return NextResponse.json({ ok: false, error: 'already terminated' }, { status: 409 });
  }

  const siteIsLive = agreement.sites?.status === 'live';
  const now = new Date();
  const effective = siteIsLive ? addDays(now, 60) : now;
  const effectiveIso = formatInTimeZone(effective, BUSINESS_TZ, 'yyyy-MM-dd');

  const { error: updErr } = await supabase
    .from('agreements')
    .update({
      terminated_at: now.toISOString(),
      terminated_by: 'admin',
      termination_reason:
        typeof body.reason === 'string' ? body.reason.slice(0, 1000) : null,
      termination_effective: effectiveIso,
    })
    .eq('id', agreement.id);
  if (updErr) {
    console.error('[admin/agreements/terminate] failed:', updErr);
    return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
  }

  await supabase
    .from('sites')
    .update({ status: 'cancelled', status_updated_at: now.toISOString() })
    .eq('id', agreement.site_id);

  await supabase
    .from('cancellation_requests')
    .update({ status: 'confirmed', resolved_at: now.toISOString() })
    .eq('site_id', agreement.site_id)
    .eq('status', 'pending');

  const client = agreement.clients;
  const email = await sendEmail({
    to: client.email,
    subject: `Your Sweet Dreams agreement for ${client.business_name} has ended`,
    react: AgreementTerminated({
      contactName: client.contact_name,
      businessName: client.business_name,
      instant: !siteIsLive,
      effectiveDisplay: formatInTimeZone(effective, BUSINESS_TZ, 'MMMM d, yyyy'),
      portalUrl: `${requestBaseUrl(request)}/portal`,
    }),
  });

  return NextResponse.json({
    ok: true,
    instant: !siteIsLive,
    termination_effective: effectiveIso,
    email_ok: email.ok,
  });
}
