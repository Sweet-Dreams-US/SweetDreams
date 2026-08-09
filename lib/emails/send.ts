/**
 * Central email sender.
 *
 * Why this exists: `resend.emails.send()` does NOT throw on API errors —
 * it returns `{ data, error }`, and most existing call sites never check
 * `error`, silently dropping mail. Every new email goes through this
 * wrapper so failures are always surfaced in logs and to callers.
 */
import type { ReactElement } from 'react';
import { resend, FROM_EMAIL } from './resend';

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail({
  to,
  subject,
  react,
  replyTo,
}: SendEmailInput): Promise<SendEmailResult> {
  const recipients = Array.isArray(to) ? to : [to];
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipients,
      subject,
      react,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) {
      console.error(
        `[sendEmail] Resend error for "${subject}" to ${recipients.join(', ')}:`,
        error
      );
      return { ok: false, error: error.message ?? String(error) };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error(
      `[sendEmail] threw for "${subject}" to ${recipients.join(', ')}:`,
      err
    );
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
