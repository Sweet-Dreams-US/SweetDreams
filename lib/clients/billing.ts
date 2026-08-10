/**
 * Go-live billing math.
 *
 * Rule (Cole): hosting is never charged before launch. When the admin marks
 * a site live, the subscription trials until the first 1st or 15th STRICTLY
 * AFTER the live date, then bills monthly on that same day forever.
 *   live on the 12th -> first charge the 15th
 *   live on the 1st  -> first charge the 15th
 *   live on the 15th -> first charge the 1st of next month
 * Both anchor days are <= 28, so the billing day never drifts with month
 * lengths.
 */
import { formatInTimeZone } from 'date-fns-tz';
import { BUSINESS_TZ } from '@/lib/agreements/service';
import {
  ANALYTICS_ADDON_PRICE_CENTS,
  analyticsIncludedAtPrice,
} from './constants';

export interface BillingAnchor {
  /** YYYY-MM-DD of the first charge */
  isoDate: string;
  anchorDay: 1 | 15;
  /** Unix seconds for Stripe trial_end (midday on the anchor date) */
  trialEndUnix: number;
}

export function nextBillingAnchor(now: Date = new Date()): BillingAnchor {
  const y = Number(formatInTimeZone(now, BUSINESS_TZ, 'yyyy'));
  const m = Number(formatInTimeZone(now, BUSINESS_TZ, 'M'));
  const d = Number(formatInTimeZone(now, BUSINESS_TZ, 'd'));

  let anchorYear = y;
  let anchorMonth = m;
  let anchorDay: 1 | 15;
  if (d < 15) {
    anchorDay = 15;
  } else {
    anchorDay = 1;
    anchorMonth = m === 12 ? 1 : m + 1;
    anchorYear = m === 12 ? y + 1 : y;
  }

  const isoDate = `${anchorYear}-${String(anchorMonth).padStart(2, '0')}-${String(
    anchorDay
  ).padStart(2, '0')}`;
  // Midday Eastern (~17:00 UTC); the exact hour only decides when in the
  // day Stripe runs the first charge.
  const trialEndUnix = Math.floor(
    Date.UTC(anchorYear, anchorMonth - 1, anchorDay, 17, 0, 0) / 1000
  );

  return { isoDate, anchorDay, trialEndUnix };
}

/** Hosting + selected addons, in cents. */
export function monthlyTotalCents(site: {
  hosting_price_cents: number;
  analytics_addon: boolean;
}): number {
  const addon =
    !analyticsIncludedAtPrice(site.hosting_price_cents) && site.analytics_addon
      ? ANALYTICS_ADDON_PRICE_CENTS
      : 0;
  return site.hosting_price_cents + addon;
}
