/**
 * Meta Conversions API relay for top-of-funnel, NON-PII events fired from
 * the browser (currently ViewContent). The browser fires the same event via
 * fbq with a shared eventID; this route mirrors it server-side so it survives
 * ad blockers / iOS, and Meta dedupes the pair.
 *
 * Why a separate route from funnel-capture / book-call:
 *   - Those routes carry PII (email/phone) and fire Lead/Schedule from a
 *     trusted server context. This route only accepts an allow-list of
 *     non-PII events, so a hostile caller can't forge Leads or leak data.
 *   - ViewContent has no form submit to hang off of, so the browser has to
 *     tell us it happened.
 *
 * Match keys (fbp/fbc/ip/ua) are read from the request by sendMetaEvent — the
 * client sends no identifiers, only which event + the dedup id + source url.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendMetaEvent } from '@/lib/meta-capi';

// Only these browser-fired events are accepted. Lead/Schedule are NOT here —
// they must come from their own trusted routes with verified input.
const ALLOWED_EVENTS = new Set(['ViewContent']);

// Tiny in-memory per-IP limiter so this can't be spammed to inflate counts.
// Resets on cold start — fine for a soft cap on a low-value event.
const hits = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 40;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { eventName, eventId, funnel, contentName, sourceUrl } = body ?? {};

    if (typeof eventName !== 'string' || !ALLOWED_EVENTS.has(eventName)) {
      return NextResponse.json({ error: 'Event not allowed' }, { status: 400 });
    }

    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';

    // Over the cap → look successful, send nothing (don't punish the client).
    if (isRateLimited(ip)) return NextResponse.json({ ok: true });

    const customData: Record<string, string | number> = {};
    if (funnel) customData.funnel = String(funnel);
    if (contentName) customData.content_name = String(contentName);
    customData.content_category = 'funnel';

    await sendMetaEvent({
      eventName,
      eventId: typeof eventId === 'string' ? eventId : undefined,
      request,
      sourceUrl: typeof sourceUrl === 'string' ? sourceUrl : undefined,
      customData,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Never fail the client over an analytics ping.
    console.error('[meta-event] Unexpected error (non-fatal):', err);
    return NextResponse.json({ ok: true });
  }
}
