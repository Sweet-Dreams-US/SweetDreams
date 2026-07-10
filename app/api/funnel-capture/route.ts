/**
 * Funnel capture endpoint — receives leads from the standalone landing
 * pages (/free-website, /free-software, /content-roadmap).
 *
 * Design choices vs the main contact forms:
 *   - NO Cloudflare Turnstile. These are paid-traffic landing pages where
 *     every extra step costs conversions. Spam is held off with a honeypot
 *     field + the shared spam filter + per-IP rate limiting instead.
 *   - Always emails the team (cole + jayvalleo) so a human can follow up;
 *     the "free thing" (spec site / demo / content plan) is built and sent
 *     manually after, so there is no instant auto-delivery.
 *
 * Resend's send() returns { data, error } and does NOT throw on API errors,
 * so we inspect the result and return 500 on a real failure (never silent).
 */

import { NextRequest, NextResponse } from 'next/server';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/emails/resend';
import { checkForSpam, checkRateLimit } from '@/lib/spam-filter';
import { sendMetaEvent } from '@/lib/meta-capi';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

// D&N Website Demo Factory intake — website-demo leads are forwarded here so
// a demo gets auto-researched + built on the nightmaresturntodreams.com side.
// Only the funnels that actually offer a free spec website are forwarded.
const DEMO_LEAD_ENDPOINT =
  process.env.DEMO_LEAD_ENDPOINT ||
  'https://www.nightmaresturntodreams.com/api/leads/demo';
const DEMO_LEAD_SECRET = process.env.DEMO_LEAD_SECRET;
const DEMO_FUNNELS = new Set(['free-website', 'web-software']);

async function verifyTurnstile(token: string, remoteip?: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    console.error('[funnel-capture] TURNSTILE_SECRET_KEY not configured');
    return false;
  }
  try {
    const form = new FormData();
    form.append('secret', TURNSTILE_SECRET_KEY);
    form.append('response', token);
    if (remoteip) form.append('remoteip', remoteip);
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: form }
    );
    const result = await res.json();
    return result.success === true;
  } catch (err) {
    console.error('[funnel-capture] Turnstile verify error:', err);
    return false;
  }
}

// Human-readable context per funnel for the email subject + body.
const FUNNELS: Record<string, { label: string; offer: string }> = {
  'free-website': {
    label: 'Free Website (spec build)',
    offer: 'They want their new site built before paying. Build the spec, send the link.',
  },
  'free-software': {
    label: 'Free Software Demo',
    offer: 'They want a live demo dashboard for their business. Build the demo, send the link.',
  },
  'content-roadmap': {
    label: 'Social Content System (content roadmap)',
    offer: 'They want their 90-day content roadmap. Send the plan, pitch the system.',
  },
  'media-production': {
    label: 'Media Production (service page)',
    offer: 'They want a free brand content plan. Map what we would shoot, then pitch production.',
  },
  'web-software': {
    label: 'Web & Software (service page)',
    offer: 'They want a free spec website (media included). Build it, send the link.',
  },
  marketing: {
    label: 'Marketing (service page)',
    offer: 'They want a free marketing plan / growth audit. Build the plan, book the call.',
  },
  consulting: {
    label: 'Consulting (service page)',
    offer: 'They want a free strategy audit. Find the bottleneck, book the call.',
  },
};

const FIELD_LABELS: Record<string, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phone: 'Phone',
  businessName: 'Business',
  whatYouDo: 'What they do',
  currentTools: 'Tools they pay for now',
  detail: 'Details',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      funnel,
      honeypot,
      turnstileToken,
      metaEventId, // shared with the browser fbq('track','Lead') for CAPI dedup
      firstName = '',
      lastName = '',
      email = '',
      phone = '',
      ...rest
    } = body ?? {};

    // 1. Honeypot — a real human never fills this hidden field.
    //    Return success so the bot moves on without retrying.
    if (honeypot) {
      console.warn('[funnel-capture] Honeypot tripped — dropping bot submission', {
        funnel,
      });
      return NextResponse.json({ success: true });
    }

    // 1b. Cloudflare Turnstile — verify the human check before anything else.
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      undefined;

    if (!turnstileToken) {
      return NextResponse.json({ error: 'Verification required' }, { status: 400 });
    }
    if (!(await verifyTurnstile(turnstileToken as string, clientIp))) {
      console.warn('[funnel-capture] Invalid Turnstile token', { funnel, email });
      return NextResponse.json({ error: 'Invalid verification' }, { status: 400 });
    }

    // 2. Resolve funnel context (unknown funnel still accepted, labeled raw).
    const ctx = FUNNELS[funnel as string] ?? {
      label: `Unknown funnel (${funnel ?? 'n/a'})`,
      offer: '',
    };

    const fullName = `${firstName} ${lastName}`.trim();

    // 3. Minimal required validation.
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // 4. Rate limit + spam filter (shared with the other forms).
    if (clientIp && !checkRateLimit(clientIp)) {
      console.warn('[funnel-capture] Rate limited', { funnel, email, ip: clientIp });
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const detailValues = Object.entries(rest)
      .map(([k, v]) => `${FIELD_LABELS[k] ?? k}: ${v}`)
      .join(' | ');

    const spamCheck = checkForSpam({
      name: fullName,
      email,
      phone,
      message: detailValues,
      ip: clientIp,
    });
    if (spamCheck.isSpam) {
      console.warn(`[funnel-capture] SPAM BLOCKED: ${spamCheck.reason}`, {
        funnel,
        email,
      });
      // Look successful to the spammer; send nothing.
      return NextResponse.json({ success: true });
    }

    // 5. Build the team notification email.
    const allFields: Record<string, string> = {
      firstName,
      lastName,
      email,
      phone,
      ...rest,
    };
    const rowsHtml = Object.entries(allFields)
      .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
      .map(
        ([k, v]) =>
          `<p style="margin:8px 0;"><strong>${
            FIELD_LABELS[k] ?? k
          }:</strong> ${String(v).replace(/\n/g, '<br>')}</p>`
      )
      .join('');

    const emailData = {
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Lead — ${ctx.label} — ${fullName}`,
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h1 style="font-size:22px;margin:0 0 6px;">New Funnel Lead</h1>
          <p style="display:inline-block;background:#111;color:#fff;padding:8px 14px;border-radius:8px;font-size:13px;margin:0 0 8px;">
            ${ctx.label}
          </p>
          ${ctx.offer ? `<p style="color:#666;margin:0 0 24px;">${ctx.offer}</p>` : ''}
          <div style="background:#f7f8fa;padding:22px;border-radius:10px;">
            ${rowsHtml}
          </div>
          <p style="color:#9aa3af;font-size:12px;margin-top:24px;">
            Captured from the ${ctx.label} landing page on sweetdreams.us.
          </p>
        </div>
      `,
    };

    // 6. Notify the team by email — BEST-EFFORT. Everything below (Supabase,
    //    Meta CAPI, D&N demo forward) runs regardless, so an email failure or
    //    a deliverability problem is logged loudly but NEVER loses a captured
    //    lead. This block used to `return 500` on any Resend error, which
    //    silently dropped the ENTIRE lead — no Supabase row, no demo, no ad
    //    signal — the root cause of "a lead came in but nothing happened".
    try {
      const sent = await resend.emails.send(emailData);
      if (sent.error) {
        console.error(
          '[funnel-capture] Resend send failed (lead still saved below):',
          sent.error,
          { funnel, email }
        );
      } else {
        console.log(
          `[funnel-capture] Lead emailed (${ctx.label}) from ${fullName} <${email}> — id=${sent.data?.id}`
        );
      }
    } catch (mailErr) {
      console.error('[funnel-capture] Resend threw (lead still saved below):', mailErr, {
        funnel,
        email,
      });
    }

    // 7. Persist to Supabase (marketing_leads) — the durable record + the
    //    analytics feed the Dreams & Nightmares platform reads. This is the
    //    source of truth for "did a lead come in", independent of email.
    try {
      const { businessName, whatYouDo, ...extraFields } = rest as Record<string, unknown>;
      const supabase = createServiceRoleClient();
      const { error: dbError } = await supabase.from('marketing_leads').insert({
        funnel: String(funnel ?? 'unknown'),
        first_name: firstName || null,
        last_name: lastName || null,
        email,
        phone: phone || null,
        business_name: (businessName as string) || null,
        what_you_do: (whatYouDo as string) || null,
        extra: Object.keys(extraFields).length ? extraFields : null,
        meta_event_id: typeof metaEventId === 'string' ? metaEventId : null,
        client_ip: clientIp ?? null,
        user_agent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        fbp: request.cookies.get('_fbp')?.value ?? null,
        fbc: request.cookies.get('_fbc')?.value ?? null,
      });
      if (dbError) console.error('[funnel-capture] marketing_leads insert failed:', dbError);
    } catch (dbErr) {
      console.error('[funnel-capture] marketing_leads insert error (non-fatal):', dbErr);
    }

    // 8. Meta Conversions API — server-side Lead, deduped against the
    //    browser fbq('track','Lead') via metaEventId. Never fatal.
    await sendMetaEvent({
      eventName: 'Lead',
      eventId: typeof metaEventId === 'string' ? metaEventId : undefined,
      request,
      email,
      phone,
      firstName,
      lastName,
      customData: { funnel: String(funnel ?? 'unknown'), lead_source: 'funnel' },
    });

    // 9. Website-demo leads → D&N Website Demo Factory intake, so a demo gets
    //    auto-researched + built. Non-fatal: the lead is already saved to
    //    Supabase + Meta above. Awaited (not fire-and-forget) so it finishes
    //    before the serverless function freezes — failures are logged, swallowed.
    if (DEMO_FUNNELS.has(String(funnel))) {
      const restObj = rest as Record<string, unknown>;
      const businessName =
        typeof restObj.businessName === 'string' ? restObj.businessName : '';
      const whatYouDo =
        typeof restObj.whatYouDo === 'string' ? restObj.whatYouDo : '';
      if (!DEMO_LEAD_SECRET) {
        console.warn('[funnel-capture] DEMO_LEAD_SECRET not set — skipping D&N demo forward');
      } else if (!businessName) {
        // The intake requires business_name; skip rather than send a 400.
        console.warn('[funnel-capture] No business name — skipping D&N demo forward', { email });
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
              business_name: businessName,
              what_you_do: whatYouDo,
              source: 'sweetdreams.us',
              funnel: String(funnel),
              source_url:
                request.headers.get('referer') ?? 'https://sweetdreams.us/free-website',
            }),
          });
          if (!demoRes.ok) {
            const errBody = await demoRes.text().catch(() => '');
            console.error('[funnel-capture] D&N demo forward failed', {
              status: demoRes.status,
              body: errBody.slice(0, 300),
            });
          } else {
            console.log('[funnel-capture] Lead forwarded to D&N demo factory', { funnel, email });
          }
        } catch (err) {
          console.error('[funnel-capture] D&N demo forward error (non-fatal):', err);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[funnel-capture] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to send. Please try again later.' },
      { status: 500 }
    );
  }
}
