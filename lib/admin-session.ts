/**
 * Lightweight admin session — standalone auth for /admin pages.
 *
 * Why this exists separately from Supabase auth:
 *   /login on sweetdreams.us redirects all customer-facing auth to
 *   sweetdreamsmusic.com (by design — that's where bookings live).
 *   The admin lead viewer is a single-user internal tool and shouldn't
 *   force a cross-domain auth dance. This module gives /admin its own
 *   password-gated session with a signed HttpOnly cookie.
 *
 * Cookie format: `<issuedAtSeconds>.<hexHmac>` where HMAC is
 *   HMAC-SHA256(issuedAt, ADMIN_SESSION_SECRET).
 *
 * Required env vars:
 *   ADMIN_PASSWORD        — the password users type at /admin/login
 *   ADMIN_SESSION_SECRET  — 32+ char random string for signing cookies
 */

import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_COOKIE_NAME = 'sd_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'ADMIN_SESSION_SECRET is not set (or too short). Set it in Vercel env vars.'
    );
  }
  return secret;
}

/** Generate a signed session token (value to store in cookie). */
export function issueSession(): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const sig = createHmac('sha256', getSecret())
    .update(String(issuedAt))
    .digest('hex');
  return `${issuedAt}.${sig}`;
}

/** Verify a cookie token; returns true iff signature matches AND not expired. */
export function verifySession(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false;
  const [issuedAtStr, sig] = token.split('.');
  if (!issuedAtStr || !sig) return false;

  const issuedAt = Number(issuedAtStr);
  if (!Number.isFinite(issuedAt)) return false;

  // Reject expired sessions
  const ageSeconds = Math.floor(Date.now() / 1000) - issuedAt;
  if (ageSeconds < 0 || ageSeconds > SESSION_TTL_SECONDS) return false;

  let expected: string;
  try {
    expected = createHmac('sha256', getSecret())
      .update(String(issuedAt))
      .digest('hex');
  } catch {
    return false;
  }

  const a = Buffer.from(sig, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Cookie attribute string suitable for `Set-Cookie` headers. */
export function adminCookieOptions(): {
  httpOnly: true;
  secure: true;
  sameSite: 'lax';
  path: '/';
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}

/** Validate a typed password against ADMIN_PASSWORD using timing-safe compare. */
export function verifyAdminPassword(provided: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length === 0) return false;
  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
