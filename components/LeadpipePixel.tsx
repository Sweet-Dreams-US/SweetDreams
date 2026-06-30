'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const PIXEL_SRC =
  'https://leadpipe.aws53.cloud/p/cb92e2bc-5759-4c6b-be4f-bed4c19d1677.js';
const OPT_OUT_KEY = 'sd_no_track';

/**
 * Loads the Leadpipe identification pixel for real visitors — but NOT for
 * the Sweet Dreams team.
 *
 * Why: Leadpipe resolves visitors by IP, and our own browsing was getting
 * (mis)identified — e.g. an internal visit resolved to a stranger's email.
 * That polluted the lead list AND, via one malformed identification, once
 * deactivated the delivery webhook entirely.
 *
 * Opt out on any device/browser by loading the site once with `?notrack=1`.
 * The choice persists in localStorage. Re-enable with `?notrack=0`.
 *
 * Excluded paths (/admin, /api, etc.) are still configured on the pixel
 * itself in the Leadpipe dashboard; this is an additional, per-device gate.
 */
export default function LeadpipePixel() {
  // Start false so server render and first client paint agree (no hydration
  // mismatch); the effect flips it on for allowed visitors after mount.
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('notrack') === '1') localStorage.setItem(OPT_OUT_KEY, '1');
      if (params.get('notrack') === '0') localStorage.removeItem(OPT_OUT_KEY);
      setAllowed(localStorage.getItem(OPT_OUT_KEY) !== '1');
    } catch {
      // localStorage blocked (private mode, etc.) — default to tracking on.
      setAllowed(true);
    }
  }, []);

  if (!allowed) return null;

  return (
    <Script
      id="leadpipe-pixel"
      src={PIXEL_SRC}
      strategy="afterInteractive"
    />
  );
}
