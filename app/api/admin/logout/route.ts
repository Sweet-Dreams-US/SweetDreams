import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/admin-session';

/** Clear the admin session cookie and redirect to the login page. */
export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url), 303);
  res.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}

// Allow GET too so a simple <a href="/api/admin/logout"> works as a logout link.
export async function GET(req: NextRequest) {
  return POST(req);
}
