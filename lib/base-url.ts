/**
 * Base URL for links we generate (signing links, portal links).
 *
 * Derived from the incoming request's origin so links work on every
 * environment: localhost in dev, the Vercel preview URL on branch
 * deployments, and sweetdreams.us in production. Falls back to the
 * configured SITE_URL if the origin is unavailable.
 */
import type { NextRequest } from 'next/server';
import { SITE_URL } from '@/lib/constants';

export function requestBaseUrl(request: NextRequest): string {
  try {
    const origin = request.nextUrl?.origin;
    if (origin && origin.startsWith('http')) return origin;
  } catch {
    // fall through
  }
  return SITE_URL;
}
