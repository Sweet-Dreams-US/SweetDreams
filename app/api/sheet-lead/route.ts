/**
 * Google Sheets → lead pipeline bridge.
 *
 * Meta Instant Form leads land in a Google Sheet (Meta's native integration).
 * A time-driven Apps Script on that sheet POSTs each new row here, and we run
 * the SAME downstream as the website funnels:
 *   team email  →  Supabase marketing_leads  →  D&N Website Demo Factory.
 *
 * We do NOT fire a Meta CAPI Lead here — Meta already counts Instant Form
 * submissions natively, so that would double-count.
 *
 * Auth: shared secret in the `x-sheet-secret` header (SHEET_LEAD_SECRET),
 * compared in constant time. Fails closed if the env var is missing.
 *
 * Required env:
 *   SHEET_LEAD_SECRET  — matches the SECRET in the Apps Script
 *   DEMO_LEAD_SECRET   — (already set) D&N demo factory intake auth
 */

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SHEET_SECRET = process.env.SHEET_LEAD_SECRET;
const DEMO_LEAD_ENDPOINT =
  process.env.DEMO_LEAD_ENDPOINT ||
  'https://www.nightmaresturntodreams.com/api/leads/demo';
const DEMO_LEAD_SECRET = process.env.DEMO_LEAD_SECRET;
const FUNNEL = 'free-website'; // routes to the demo factory like /free-website

function secretOk(provided: string | null): boolean {
  if (!SHEET_SECRET || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(SHEET_SECRET);
  return a.length === b.length && timingSafeEqual(a, b);
}

const str = (v: unknown): string => (v == null ? '' : String(v).trim());

/** "Fencing Business WebOutOfDateFreeDemo - Copy" → "Fencing" */
function tradeFromAdName(adName: string): string {
  if (!adName) return '';
  const before = adName.split(/\s+business\b/i)[0].trim();
  return before || adName.trim();
}

export async function POST(request: NextRequest) {
  if (!secretOk(request.headers.get('x-sheet-secret'))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const email = str(body.email);
  if (!email) return NextResponse.json({ ok: true, skipped: 'no email' });

  const leadId = str(body.id);
  const fullName = str(body.full_name);
  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const firstName = nameParts.shift() ?? '';
  const lastName = nameParts.join(' ');
  const phone = str(body.phone_number);
  const business = str(body.company_name);
  const website = str(body.website);
  const adName = str(body.ad_name);
  const trade = tradeFromAdName(adName) || str(body.job_title);

  // Same dedup scheme as the webhook path, so re-syncs never double-process.
  const dedupKey = leadId
    ? `ig_lead_${leadId}`
    : `sheet_${email}_${str(body.created_time)}`;

  const supabase = createServiceRoleClient();

  try {
    const { data: existing } = await supabase
      .from('marketing_leads')
      .select('id')
      .eq('meta_event_id', dedupKey)
      .limit(1);
    if (existing && existing.length) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
  } catch (e) {
    console.error('[sheet-lead] dedup check failed (continuing):', e);
  }

  // 1) Team email
  const rows: Array<[string, string]> = (
    [
      ['Business', business],
      ['Trade', trade],
      ['Current website', website],
      ['Name', fullName],
      ['Email', email],
      ['Phone', phone],
      ['Ad', adName],
    ] as Array<[string, string]>
  ).filter(([, v]) => v && v.trim() !== '');
  const rowsHtml = rows
    .map(([k, v]) => `<p style="margin:8px 0;"><strong>${k}:</strong> ${v}</p>`)
    .join('');

  try {
    const sent = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Lead — Meta Instant Form (Free Website Demo) — ${fullName || email}`,
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h1 style="font-size:22px;margin:0 0 6px;">New Instant-Form Lead</h1>
          <p style="display:inline-block;background:#4a90e2;color:#fff;padding:8px 14px;border-radius:8px;font-size:13px;margin:0 0 8px;">
            Meta Instant Form · Free Website Demo
          </p>
          <p style="color:#666;margin:0 0 24px;">They want their new site built before paying. Research the business, build the spec, send the link.</p>
          <div style="background:#f7f8fa;padding:22px;border-radius:10px;">${rowsHtml}</div>
          <p style="color:#9aa3af;font-size:12px;margin-top:24px;">Captured from a Meta lead ad.</p>
        </div>
      `,
    });
    if (sent.error) console.error('[sheet-lead] Resend failed (lead still saved):', sent.error);
  } catch (mailErr) {
    console.error('[sheet-lead] Resend threw (lead still saved):', mailErr);
  }

  // 2) Supabase — durable record
  try {
    const { error: dbError } = await supabase.from('marketing_leads').insert({
      source_domain: 'sweetdreams.us',
      funnel: FUNNEL,
      first_name: firstName || null,
      last_name: lastName || null,
      email,
      phone: phone || null,
      business_name: business || null,
      what_you_do: trade || null,
      extra: {
        source: 'meta-instant-form (sheet)',
        leadgen_id: leadId || null,
        ad_id: str(body.ad_id) || null,
        ad_name: adName || null,
        adset_name: str(body.adset_name) || null,
        campaign_name: str(body.campaign_name) || null,
        form_name: str(body.form_name) || null,
        current_website: website || null,
        job_title: str(body.job_title) || null,
        platform: str(body.platform) || null,
        is_organic: str(body.is_organic) || null,
        lead_status: str(body.lead_status) || null,
      },
      meta_event_id: dedupKey,
      referer: 'meta-instant-form-sheet',
    });
    if (dbError) console.error('[sheet-lead] marketing_leads insert failed:', dbError);
  } catch (dbErr) {
    console.error('[sheet-lead] marketing_leads insert error:', dbErr);
  }

  // 3) D&N Website Demo Factory — triggers research + demo build
  if (!DEMO_LEAD_SECRET) {
    console.warn('[sheet-lead] DEMO_LEAD_SECRET not set — skipping demo forward');
  } else if (!business) {
    console.warn('[sheet-lead] No business name — skipping demo forward', { email });
  } else {
    try {
      const demoRes = await fetch(DEMO_LEAD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Lead-Secret': DEMO_LEAD_SECRET,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          business_name: business,
          what_you_do: trade || website,
          source: 'sweetdreams.us / meta-instant-form',
          funnel: FUNNEL,
          source_url: website || 'https://sweetdreams.us/free-website',
        }),
      });
      if (!demoRes.ok) {
        const errBody = await demoRes.text().catch(() => '');
        console.error('[sheet-lead] D&N demo forward failed', {
          status: demoRes.status,
          body: errBody.slice(0, 300),
        });
      } else {
        console.log('[sheet-lead] Lead forwarded to D&N demo factory', { email });
      }
    } catch (err) {
      console.error('[sheet-lead] D&N demo forward error:', err);
    }
  }

  return NextResponse.json({ ok: true });
}
