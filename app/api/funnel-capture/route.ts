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
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      undefined;

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

    // 6. Send and inspect the result (never silent — see file header).
    const sent = await resend.emails.send(emailData);
    if (sent.error) {
      console.error('[funnel-capture] Resend send failed:', sent.error, {
        funnel,
        email,
      });
      return NextResponse.json(
        { error: 'Failed to send. Please try again later.' },
        { status: 500 }
      );
    }

    console.log(
      `[funnel-capture] Lead captured (${ctx.label}) from ${fullName} <${email}> — id=${sent.data?.id}`
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[funnel-capture] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to send. Please try again later.' },
      { status: 500 }
    );
  }
}
