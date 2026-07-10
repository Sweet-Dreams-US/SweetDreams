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

// Lead-notification recipients — every form sends here.
// Overridable via LEAD_NOTIFY_EMAILS (comma-separated) without a code change.
// cole@marcuccilli.com is included by default because lead mail to the
// @sweetdreams.us inboxes wasn't being seen (spam / unmonitored mailbox) —
// this is the "I never received a lead email" fix. Keep a monitored inbox
// first so at least one recipient reliably gets every lead.
const envRecipients = process.env.LEAD_NOTIFY_EMAILS?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const ADMIN_EMAIL =
  envRecipients && envRecipients.length
    ? envRecipients
    : ['cole@marcuccilli.com', 'cole@sweetdreams.us', 'jayvalleo@sweetdreams.us'];

// NOTE: sends from the music domain (verified in Resend). It does NOT align
// with sweetdreams.us, which hurts inbox placement — verifying sweetdreams.us
// in Resend and switching this to noreply@sweetdreams.us is the deliverability
// follow-up. Not changed blindly here: an unverified from-domain 403s EVERY send.
export const FROM_EMAIL = 'Sweet Dreams Solutions <noreply@sweetdreamsmusic.com>';
