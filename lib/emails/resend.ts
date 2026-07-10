import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors
let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set in environment variables');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

// Export a proxy object that initializes Resend only when methods are called
export const resend = {
  get emails() {
    return getResend().emails;
  }
};

// Lead-notification recipients — the Sweet Dreams Solutions business inboxes.
// Overridable via LEAD_NOTIFY_EMAILS (comma-separated) without a code change.
const envRecipients = process.env.LEAD_NOTIFY_EMAILS?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const ADMIN_EMAIL =
  envRecipients && envRecipients.length
    ? envRecipients
    : ['cole@sweetdreams.us', 'jayvalleo@sweetdreams.us'];

// Sender. These ads and landing pages are sweetdreams.us, so lead mail should
// come FROM noreply@sweetdreams.us — aligned with the recipient domain, which
// is the real fix for inbox placement (the music domain was misaligned and
// getting filtered). Flip via LEAD_FROM_EMAIL the moment sweetdreams.us is a
// verified Resend domain. Default stays on the currently-verified music domain
// until then — an unverified from-domain 403s EVERY send.
export const FROM_EMAIL =
  process.env.LEAD_FROM_EMAIL ||
  'Sweet Dreams Solutions <noreply@sweetdreamsmusic.com>';
