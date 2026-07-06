/**
 * Meta Conversions API (CAPI) — server-side event sender.
 *
 * Sends events to the SweetDreamsUS dataset (1675521687053415) so
 * conversions still land when ad blockers / iOS kill the browser pixel.
 * Browser + server events carrying the same event_id are deduplicated
 * by Meta automatically.
 *
 * Design rules:
 *   - NEVER throws and NEVER blocks a lead capture: every failure is
 *     logged and swallowed. Losing an ad signal is acceptable; losing
 *     a lead email is not.
 *   - PII (email/phone/name) is SHA-256 hashed before it leaves the
 *     server, per Meta's user_data spec.
 *   - _fbp/_fbc cookies + client IP + user agent are forwarded for
 *     match quality (these are what tie the event back to the ad click).
 *
 * Requires META_CAPI_ACCESS_TOKEN (Events Manager → SweetDreamsUS →
 * Settings → Conversions API → Generate access token). Without it the
 * helper logs a warning and no-ops, so local dev works untouched.
 */

import { createHash } from 'crypto';
import type { NextRequest } from 'next/server';

const PIXEL_ID = process.env.META_PIXEL_ID || '1675521687053415';
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const GRAPH_VERSION = 'v23.0';

const sha256 = (value: string) =>
  createHash('sha256').update(value.trim().toLowerCase()).digest('hex');

/** Meta wants phone as digits with country code — "2605551234" → "12605551234". */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 10) return null;
  return digits.length === 10 ? `1${digits}` : digits;
}

export interface MetaEventInput {
  /** Standard Meta event name: 'Lead', 'Schedule', 'Contact', ... */
  eventName: string;
  /** Shared with the browser fbq call for dedup. Optional for server-only events. */
  eventId?: string;
  /** The incoming request — source of IP, UA, _fbp/_fbc cookies, and referer. */
  request: NextRequest;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  /** Page the event happened on (falls back to the request referer). */
  sourceUrl?: string;
  /** Free-form custom_data, e.g. { funnel: 'free-website' }. */
  customData?: Record<string, string | number>;
}

export async function sendMetaEvent(input: MetaEventInput): Promise<void> {
  try {
    if (!ACCESS_TOKEN) {
      console.warn('[meta-capi] META_CAPI_ACCESS_TOKEN not set — skipping', {
        event: input.eventName,
      });
      return;
    }

    const { request } = input;
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      undefined;
    const userAgent = request.headers.get('user-agent') || undefined;
    const fbp = request.cookies.get('_fbp')?.value;
    const fbc = request.cookies.get('_fbc')?.value;

    const userData: Record<string, unknown> = {};
    if (input.email) userData.em = [sha256(input.email)];
    if (input.phone) {
      const ph = normalizePhone(input.phone);
      if (ph) userData.ph = [sha256(ph)];
    }
    if (input.firstName) userData.fn = [sha256(input.firstName)];
    if (input.lastName) userData.ln = [sha256(input.lastName)];
    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    const event: Record<string, unknown> = {
      event_name: input.eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url:
        input.sourceUrl || request.headers.get('referer') || 'https://sweetdreams.us',
      user_data: userData,
    };
    if (input.eventId) event.event_id = input.eventId;
    if (input.customData) event.custom_data = input.customData;

    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [event], access_token: ACCESS_TOKEN }),
      }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[meta-capi] Send failed', {
        event: input.eventName,
        status: res.status,
        body: body.slice(0, 500),
      });
      return;
    }

    console.log(`[meta-capi] ${input.eventName} sent (event_id=${input.eventId ?? 'n/a'})`);
  } catch (err) {
    // Never let an ad-signal failure break the lead capture.
    console.error('[meta-capi] Unexpected error (non-fatal):', err);
  }
}
