'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Renders the main-site chrome (Nav + Footer) around page content — except
 * on distraction-free funnel/landing routes, where every extra link is an
 * exit and hurts conversion (the Acquisition.com formula: no nav, one job).
 *
 * Nav and Footer are passed in as already-rendered nodes from the SERVER
 * root layout so this client wrapper never has to import them directly
 * (Footer is a server component) — it just decides whether to include them.
 */
const BARE_ROUTES = ['/free-website', '/free-software', '/content-roadmap'];

export default function SiteChrome({
  nav,
  footer,
  children,
}: {
  nav: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`)
  );

  return (
    <>
      {!bare && nav}
      <main className="min-h-screen">{children}</main>
      {!bare && footer}
    </>
  );
}
