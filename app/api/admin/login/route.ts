/**
 * Admin login endpoint.
 *
 * Reads `password` + `return` from the form POST body, validates the
 * password against ADMIN_PASSWORD (timing-safe compare), and on success
 * sets the signed session cookie + redirects to the return path.
 *
 * On failure, redirects to /admin/login?error=1 so the user sees a
 * generic "incorrect password" message (no enumeration).
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  issueSession,
  verifyAdminPassword,
} from '@/lib/admin-session';

// Only allow returning to internal paths (no open-redirect to external sites)
function safeReturnPath(raw: string | null): string {
  if (!raw) return '/admin/leads';
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/admin/leads';
  return raw;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = (form.get('password') as string) || '';
  const returnTo = safeReturnPath(form.get('return') as string | null);

  if (!verifyAdminPassword(password)) {
    const url = new URL(`/admin/login`, req.url);
    url.searchParams.set('error', '1');
    if (returnTo !== '/admin/leads') url.searchParams.set('return', returnTo);
    return NextResponse.redirect(url, 303);
  }

  const token = issueSession();
  const res = NextResponse.redirect(new URL(returnTo, req.url), 303);
  res.cookies.set(ADMIN_COOKIE_NAME, token, adminCookieOptions());
  return res;
}
