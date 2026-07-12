/**
 * Meta Lead Ads webhook — receives Instant Form (lead ad) submissions and
 * feeds them into the SAME pipeline as the website funnels:
 *   team email  →  Supabase marketing_leads  →  D&N Website Demo Factory.
 *
 * Why this exists: Meta's Instant Form UI only offers CRM partners + Google
 * Sheets. The raw lead webhook is configured at the App/Page level (Graph API
 * `leadgen` subscription), and the lead body must be fetched with a Page token
 * using the `leadgen_id` Meta sends — which is what this route does.
 *
 * Meta does NOT send the form answers in the webhook — only a `leadgen_id`.
 * We fetch the full field_data from the Graph API, map it, then run the same
 * downstream as funnel-capture. We do NOT fire a CAPI Lead here: Meta already
 * counts Instant Form submissions natively, so a CAPI event would double-count.
 *
 * Security: every POST is HMAC-verified against the App Secret
 * (X-Hub-Signature-256) before we trust or fetch anything.
 *
 * Required env:
 *   META_APP_SECRET           — verifies the webhook signature
 *   META_LEADGEN_VERIFY_TOKEN — the GET handshake token (also set in the App)
 *   META_PAGE_ACCESS_TOKEN    — long-lived Page token w/ leads_retrieval
 *   DEMO_LEAD_SECRET          — (shared with funnel-capture) D&N intake auth
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const APP_SECRET = process.env.META_APP_SECRET;
const VERIFY_TOKEN = process.env.META_LEADGEN_VERIFY_TOKEN;
const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const GRAPH_VERSION = 'v23.0';

const DEMO_LEAD_ENDPOINT =
  process.env.DEMO_LEAD_ENDPOINT ||
  'https://www.nightmaresturntodreams.com/api/leads/demo';
const DEMO_LEAD_SECRET = process.env.DEMO_LEAD_SECRET;

// Instant-form leads are treated as free-website (spec build) leads so they
// route to the demo factory just like the website /free-website funnel.
const FUNNEL = 'free-website';

interface LeadFieldEntry {
  name: string;
  values: string[];
}

// ---- GET: Meta webhook verification handshake -----------------------------
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get('hub.mode');
  const token = params.get('hub.verify_token');
  const challenge = params.get('hub.challenge');

  if (mode === 'subscribe' && VERIFY_TOKEN && token === VERIFY_TOKEN) {
    return new NextResponse(challenge ?? '', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

// ---- Signature verification (constant-time) -------------------------------
function verifySignature(rawBody: string, header: string | null): boolean {
  if (!APP_SECRET || !header) return false;
  const expected =
    'sha256=' + createHmac('sha256', APP_SECRET).update(rawBody).digest('hex');
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// ---- Map Meta field_data to our lead shape --------------------------------
function mapFields(fieldData: LeadFieldEntry[]) {
  const first = (pred: (name: string) => boolean): string => {
    const f = fieldData.find((x) => pred((x.name || '').toLowerCase()));
    return (f?.values?.[0] ?? '').trim();
  };
  // Keep every raw answer so nothing is ever lost, even if a mapping misses.
  const raw: Record<string, string> = {};
  for (const f of fieldData) raw[f.name] = (f.values ?? []).join(', ');

  const email = first((n) => n.includes('email'));
  const phone = first((n) => n.includes('phone'));
  let firstName = first((n) => n.includes('first_name'));
  let lastName = first((n) => n.includes('last_name'));
  const fullName = first((n) => n === 'full_name' || n.includes('full_name'));
  if (!firstName && fullName) {
    const parts = fullName.split(/\s+/);
    firstName = parts.shift() ?? '';
    if (!lastName) lastName = parts.join(' ');
  }
  const business = first((n) => n.includes('business'));
  const website = first((n) => n.includes('website') || n.includes('site'));
  const trade = first(
    (n) => n.includes('trade') || n.includes('what_do') || n.includes('do_you_do')
  );

  return { email, phone, firstName, lastName, business, website, trade, raw };
}

// ---- Fetch the full lead from the Graph API -------------------------------
async function fetchLead(
  leadgenId: string
): Promise<{ field_data: LeadFieldEntry[]; ad_id?: string; form_id?: string } | null> {
  if (!PAGE_TOKEN) {
    console.error('[meta-leadgen] META_PAGE_ACCESS_TOKEN not set — cannot fetch lead');
    return null;
  }
  try {
    const url =
      `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(leadgenId)}` +
      `?fields=field_data,ad_id,form_id,created_time&access_token=${encodeURIComponent(PAGE_TOKEN)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[meta-leadgen] Graph fetch failed', {
        status: res.status,
        body: body.slice(0, 300),
      });
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('[meta-leadgen] Graph fetch error:', err);
    return null;
  }
}

async function processLead(leadgenId: string) {
  const lead = await fetchLead(leadgenId);
  if (!lead) return;

  const { email, phone, firstName, lastName, business, website, trade, raw } =
    mapFields(lead.field_data ?? []);
  const fullName = `${firstName} ${lastName}`.trim();

  if (!email) {
    console.warn('[meta-leadgen] Lead has no email — skipping', { leadgenId });
    return;
  }

  const dedupKey = `ig_lead_${leadgenId}`;
  const supabase = createServiceRoleClient();

  // Idempotency: Meta can redeliver a webhook. Skip if we already have it.
  try {
    const { data: existing } = await supabase
      .from('marketing_leads')
      .select('id')
      .eq('meta_event_id', dedupKey)
      .limit(1);
    if (existing && existing.length) {
      console.log('[meta-leadgen] Duplicate leadgen_id — already processed', { leadgenId });
      return;
    }
  } catch (e) {
    console.error('[meta-leadgen] Dedup check failed (continuing):', e);
  }

  // 1) Team email
  const rows: Array<[string, string]> = [
    ['Business', business],
    ['Trade', trade],
    ['Current website', website],
    ['Name', fullName],
    ['Email', email],
    ['Phone', phone],
  ].filter(([, v]) => v && v.trim() !== '') as Array<[string, string]>;
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
          <p style="color:#9aa3af;font-size:12px;margin-top:24px;">
            Captured from a Meta lead ad${lead.ad_id ? ` (ad ${lead.ad_id})` : ''}.
          </p>
        </div>
      `,
    });
    if (sent.error) {
      console.error('[meta-leadgen] Resend failed (lead still saved):', sent.error);
    }
  } catch (mailErr) {
    console.error('[meta-leadgen] Resend threw (lead still saved):', mailErr);
  }

  // 2) Supabase — durable record (source of truth)
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
        source: 'meta-instant-form',
        leadgen_id: leadgenId,
        ad_id: lead.ad_id ?? null,
        form_id: lead.form_id ?? null,
        current_website: website || null,
        answers: raw,
      },
      meta_event_id: dedupKey,
      referer: 'meta-instant-form',
    });
    if (dbError) console.error('[meta-leadgen] marketing_leads insert failed:', dbError);
  } catch (dbErr) {
    console.error('[meta-leadgen] marketing_leads insert error:', dbErr);
  }

  // 3) D&N Website Demo Factory — kicks off research + demo build
  if (!DEMO_LEAD_SECRET) {
    console.warn('[meta-leadgen] DEMO_LEAD_SECRET not set — skipping demo forward');
  } else if (!business) {
    console.warn('[meta-leadgen] No business name — skipping demo forward', { email });
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
        console.error('[meta-leadgen] D&N demo forward failed', {
          status: demoRes.status,
          body: errBody.slice(0, 300),
        });
      } else {
        console.log('[meta-leadgen] Lead forwarded to D&N demo factory', { email });
      }
    } catch (err) {
      console.error('[meta-leadgen] D&N demo forward error:', err);
    }
  }
}

// ---- POST: leadgen events -------------------------------------------------
export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!verifySignature(rawBody, request.headers.get('x-hub-signature-256'))) {
    console.warn('[meta-leadgen] Invalid or missing signature — rejecting');
    return new NextResponse('Invalid signature', { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: true });
  }

  const payload = body as {
    object?: string;
    entry?: Array<{ changes?: Array<{ field?: string; value?: { leadgen_id?: string } }> }>;
  };
  if (payload.object !== 'page') return NextResponse.json({ ok: true });

  const leadgenIds: string[] = [];
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field === 'leadgen' && change.value?.leadgen_id) {
        leadgenIds.push(change.value.leadgen_id);
      }
    }
  }

  // Process sequentially (low volume). Errors are swallowed so Meta always
  // gets a 200 and doesn't retry-storm; each lead is independently logged.
  for (const id of leadgenIds) {
    try {
      await processLead(id);
    } catch (err) {
      console.error('[meta-leadgen] processLead error:', err, { leadgenId: id });
    }
  }

  return NextResponse.json({ ok: true });
}
