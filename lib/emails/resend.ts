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

// Email addresses — all forms send to both
export const ADMIN_EMAIL = ['cole@sweetdreams.us', 'jayvalleo@sweetdreams.us'];
export const FROM_EMAIL = 'Sweet Dreams Solutions <noreply@sweetdreamsmusic.com>';
