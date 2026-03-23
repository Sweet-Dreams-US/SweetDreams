import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for handling redirects
 * - Old URLs → current pages (301)
 * - Auth/profile routes → sweetdreamsmusic.com (301)
 * - Music booking routes → sweetdreamsmusic.com (301)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old artist profile pages
  if (pathname === '/seeyouinmydreams' || pathname === '/seeyouinmydreams/') {
    return NextResponse.redirect(new URL('https://sweetdreamsmusic.com'), 301);
  }

  // Redirect music booking success to music site
  if (pathname.startsWith('/music/booking')) {
    return NextResponse.redirect(new URL('https://sweetdreamsmusic.com'), 301);
  }

  return NextResponse.next();
}

// Configure which paths trigger the middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public/).*)',
  ],
};
