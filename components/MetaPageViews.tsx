'use client';

/**
 * Fires Meta Pixel PageView + a GTM dataLayer event on App Router route
 * changes. The inline pixel snippet in layout.tsx only fires PageView on
 * the initial hard load — client-side navigations are invisible to it,
 * which starves website custom audiences (visitors of /services/*, /book,
 * etc.) of the URL data their rules filter on.
 *
 * The initial load is skipped (the inline snippet already tracked it).
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function MetaPageViews() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    try {
      const w = window as unknown as {
        fbq?: (...args: unknown[]) => void;
        dataLayer?: Record<string, unknown>[];
      };
      if (typeof w.fbq === 'function') w.fbq('track', 'PageView');
      w.dataLayer?.push({ event: 'virtual_pageview', page_path: pathname });
    } catch {
      /* analytics best-effort */
    }
  }, [pathname]);

  return null;
}
