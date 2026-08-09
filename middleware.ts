import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

/**
 * Middleware for handling redirects + client portal auth
 * - Old URLs → current pages (301)
 * - Auth/profile routes → sweetdreamsmusic.com (301)
 * - Music booking routes → sweetdreamsmusic.com (301)
 * - /portal/*: Supabase session gate + cookie refresh (STRICTLY scoped —
 *   no other route pays the auth cost; /agreement/* stays public)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old artist profile pages
  if (pathname === '/seeyouinmydreams' || pathname === '/seeyouinmydreams/') {
    return NextResponse.redirect(new URL('https://sweetdreamsmusic.com'), 301);
  }

  // Redirect music booking success to music site
  if (pathname.startsWith('/music/booking')) {
    return NextResponse.redirect(new URL('https://sweetdreamsmusic.com'), 301);
  }

  // Client portal session gate
  if (pathname === '/portal' || pathname.startsWith('/portal/')) {
    const { supabase, supabaseResponse } = createClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isLogin = pathname === '/portal/login';
    if (!user && !isLogin) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }
    if (user && isLogin) {
      return NextResponse.redirect(new URL('/portal', request.url));
    }
    // Persists refreshed auth cookies on the way through.
    return supabaseResponse;
  }

  return NextResponse.next();
}

// Configure which paths trigger the middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public/).*)',
  ],
};
