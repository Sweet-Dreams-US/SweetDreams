/**
 * Leadpipe webhook receiver.
 *
 * Architecture:
 *   Leadpipe SaaS → POST /api/leadpipe/webhook (this route)
 *                  → verify HMAC signature
 *                  → persist row in public.leadpipe_leads (Sweet Dreams Supabase)
 *                  → respond 200 ASAP so Leadpipe doesn't retry
 *
 * Downstream consumer:
 *   nightmaresturntodreams.com admin dashboard reads leadpipe_leads from
 *   the same Supabase project (using its own Supabase client + service
 *   role key).
 *
 * Multi-tenant note:
 *   Multiple pixels (sweetdreams.us today, future Sweet Dreams properties
 *   later) can all POST here. The `pixelId` and `domain` fields in the
 *   payload identify the source, which we persist as source_pixel /
 *   source_domain on each row. Filter by source_domain on the admin side
 *   to scope per-property.
 *
 * Env vars required:
 *   LEADPIPE_WEBHOOK_SECRET   — shared secret used by Leadpipe to sign
 *                                payloads. Generate a 64-char random
 *                                string, paste it into the Leadpipe
 *                                webhook config AND into Vercel env vars.
 *   SUPABASE_SERVICE_ROLE_KEY — already configured for other API routes.
 *   NEXT_PUBLIC_SUPABASE_URL  — already configured.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

// Common Leadpipe signature header names — we'll try each. If Leadpipe
// uses a different header, add it to this list. The first one present
// in the request wins.
const POSSIBLE_SIG_HEADERS = [
  'x-leadpipe-signature',
  'x-leadpipe-hmac-sha256',
  'x-signature',
  'leadpipe-signature',
];

function getRawSignature(req: NextRequest): { header: string; value: string } | null {
  for (const name of POSSIBLE_SIG_HEADERS) {
    const value = req.headers.get(name);
    if (value) return { header: name, value };
  }
  return null;
}

/**
 * Verifies an HMAC-SHA256 signature using a timing-safe comparison.
 * Leadpipe documentation didn't include the exact format at time of build,
 * so this accepts either a raw hex digest or a `sha256=<hex>` prefix
 * (the GitHub-webhook convention). Update once the real format is known.
 */
function verifySignature(rawBody: string, signatureValue: string, secret: string): boolean {
  // Strip optional `sha256=` prefix
  const provided = signatureValue.startsWith('sha256=')
    ? signatureValue.slice('sha256='.length)
    : signatureValue;

  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');

  // Both buffers must be equal length for timingSafeEqual
  const a = Buffer.from(provided, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Safely pluck a nested field — returns null if any intermediate key is missing.
function pick<T = unknown>(obj: unknown, path: string[]): T | null {
  let cur: unknown = obj;
  for (const k of path) {
    if (cur && typeof cur === 'object' && k in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[k];
    } else {
      return null;
    }
  }
  return (cur ?? null) as T | null;
}

export async function POST(req: NextRequest) {
  // 1. Pull the raw body once — needed for signature verification AND parsing.
  const rawBody = await req.text();

  // 2. Verify the signature (or skip in dev if no secret configured).
  const secret = process.env.LEADPIPE_WEBHOOK_SECRET;
  if (secret) {
    const sig = getRawSignature(req);
    if (!sig) {
      return NextResponse.json(
        { ok: false, error: 'Missing signature header' },
        { status: 401 }
      );
    }
    if (!verifySignature(rawBody, sig.value, secret)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }
  } else {
    // No secret configured — log loudly. This is fine for initial setup
    // testing but should NEVER be the production state.
    console.warn(
      '[leadpipe webhook] LEADPIPE_WEBHOOK_SECRET not set — accepting request without signature verification. Set the env var before going live.'
    );
  }

  // 3. Parse the JSON body.
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  // 4. Extract the flattened columns. Every field is optional except
  //    the source/event identifiers — Leadpipe sends partial payloads.
  const sourcePixel = pick<string>(payload, ['pixelId']) ?? '';
  const sourceDomain = pick<string>(payload, ['domain']) ?? '';
  const eventType = pick<string>(payload, ['event']) ?? 'unknown';

  if (!sourcePixel || !sourceDomain) {
    return NextResponse.json(
      { ok: false, error: 'Missing pixelId or domain' },
      { status: 400 }
    );
  }

  const eventAtRaw = pick<string>(payload, ['timestamp']);
  const eventAt = eventAtRaw ? new Date(eventAtRaw).toISOString() : null;

  // 5. Persist via service role (bypasses RLS — this table is sensitive
  //    and not exposed to anon clients).
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('leadpipe_leads').insert({
    source_pixel: sourcePixel,
    source_domain: sourceDomain,
    event_type: eventType,
    event_at: eventAt,

    visitor_id: pick(payload, ['visitor', 'id']),
    page_views: pick(payload, ['visitor', 'pageViews']),
    pages_visited: pick(payload, ['visitor', 'pages']),

    contact_name: pick(payload, ['contact', 'name']),
    contact_title: pick(payload, ['contact', 'title']),
    contact_email: pick(payload, ['contact', 'email']),
    contact_phone: pick(payload, ['contact', 'phone']),
    contact_linkedin: pick(payload, ['contact', 'linkedIn']),

    company_name: pick(payload, ['company', 'name']),
    company_domain: pick(payload, ['company', 'domain']),
    company_industry: pick(payload, ['company', 'industry']),
    company_size: pick(payload, ['company', 'size']),
    company_city: pick(payload, ['company', 'city']),
    company_state: pick(payload, ['company', 'state']),

    intent_score: pick(payload, ['intent', 'score']),
    intent_topics: pick(payload, ['intent', 'topics']),

    raw_payload: payload,
  });

  if (error) {
    console.error('[leadpipe webhook] DB insert failed', error);
    // Return 500 so Leadpipe retries — better to double-process than lose data.
    return NextResponse.json(
      { ok: false, error: 'DB insert failed' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

// Optional GET endpoint for liveness checks / verifying the URL is up
// before registering the webhook with Leadpipe.
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'Leadpipe webhook receiver',
    site: 'sweetdreams.us',
    sink: 'public.leadpipe_leads',
  });
}
