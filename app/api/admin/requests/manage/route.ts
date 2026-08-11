/**
 * Admin: work a client's update request.
 *
 * actions:
 *   update    — set status / preview URL / internal notes
 *   complete  — mark done, post the plain English update the client reads,
 *               log the hours it consumed, and email them
 *   post      — post a standalone update (work done without a request)
 *
 * Hours only draw down the plan allowance once the site is live; the
 * portal computes that from the site's go live date.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { requestBaseUrl } from '@/lib/base-url';
import { sendEmail } from '@/lib/emails/send';
import SiteUpdateClient from '@/lib/emails/site-update-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATUSES = ['new', 'in_progress', 'preview_ready', 'done', 'declined'] as const;

interface Body {
  action?: 'update' | 'complete' | 'post';
  request_id?: string;
  site_id?: string;
  status?: string;
  preview_url?: string | null;
  admin_notes?: string | null;
  title?: string;
  summary?: string;
  hours_used?: number;
  notify?: boolean;
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

  // ---- update: status / preview / notes ----
  if (body.action === 'update') {
    if (!body.request_id) {
      return NextResponse.json({ ok: false, error: 'missing request_id' }, { status: 400 });
    }
    const patch: Record<string, unknown> = {};
    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status as (typeof STATUSES)[number])) {
        return NextResponse.json({ ok: false, error: 'invalid status' }, { status: 400 });
      }
      patch.status = body.status;
    }
    if (body.preview_url !== undefined) {
      const v = (body.preview_url ?? '').toString().trim();
      patch.preview_url = v ? v.slice(0, 500) : null;
    }
    if (body.admin_notes !== undefined) {
      const v = (body.admin_notes ?? '').toString().trim();
      patch.admin_notes = v ? v.slice(0, 2000) : null;
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ ok: false, error: 'nothing to update' }, { status: 400 });
    }
    const { error } = await supabase
      .from('update_requests')
      .update(patch)
      .eq('id', body.request_id);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // ---- complete / post: write the client-visible update ----
  const title = (body.title ?? '').trim();
  const summary = (body.summary ?? '').trim();
  if (title.length < 3 || summary.length < 3) {
    return NextResponse.json(
      { ok: false, error: 'A short title and a plain English summary are required.' },
      { status: 400 }
    );
  }
  const hours = Number(body.hours_used ?? 0);
  if (!Number.isFinite(hours) || hours < 0 || hours > 200) {
    return NextResponse.json({ ok: false, error: 'invalid hours' }, { status: 400 });
  }

  let siteId = body.site_id ?? null;
  if (body.action === 'complete') {
    if (!body.request_id) {
      return NextResponse.json({ ok: false, error: 'missing request_id' }, { status: 400 });
    }
    const { data: req } = await supabase
      .from('update_requests')
      .select('id, site_id')
      .eq('id', body.request_id)
      .single();
    if (!req) {
      return NextResponse.json({ ok: false, error: 'request not found' }, { status: 404 });
    }
    siteId = req.site_id as string;
  }
  if (!siteId) {
    return NextResponse.json({ ok: false, error: 'missing site_id' }, { status: 400 });
  }

  const { data: site } = await supabase
    .from('sites')
    .select('id, name, status, live_url, preview_url, client_id, clients (business_name, contact_name, email)')
    .eq('id', siteId)
    .single();
  if (!site) {
    return NextResponse.json({ ok: false, error: 'site not found' }, { status: 404 });
  }
  const client = (site as unknown as {
    clients: { business_name: string; contact_name: string; email: string } | null;
  }).clients;

  const { error: insErr } = await supabase.from('site_updates').insert({
    site_id: siteId,
    title: title.slice(0, 200),
    summary: summary.slice(0, 4000),
    hours_used: hours,
    request_id: body.action === 'complete' ? body.request_id : null,
  });
  if (insErr) {
    console.error('[admin/requests/manage] update insert failed:', insErr);
    return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
  }

  if (body.action === 'complete') {
    await supabase
      .from('update_requests')
      .update({ status: 'done', completed_at: new Date().toISOString() })
      .eq('id', body.request_id);
  }

  let emailOk: boolean | undefined;
  if (body.notify !== false && client?.email) {
    const isLive = site.status === 'live' && site.live_url;
    const email = await sendEmail({
      to: client.email,
      subject: `We updated the ${client.business_name} website`,
      react: SiteUpdateClient({
        contactName: client.contact_name,
        businessName: client.business_name,
        title,
        summary,
        viewUrl: (isLive ? site.live_url : site.preview_url) as string | null,
        viewLabel: isLive ? 'View Your Website' : 'View the Preview',
        portalUrl: `${requestBaseUrl(request)}/portal`,
      }),
    });
    emailOk = email.ok;
  }

  return NextResponse.json({ ok: true, email_ok: emailOk });
}
