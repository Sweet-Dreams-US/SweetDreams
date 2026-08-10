/**
 * Client management constants — site statuses, hosting tiers, formatting.
 *
 * Single source for the /admin/clients UIs, the portal, and the client APIs.
 * Route files must only export handlers, so shared constants live here.
 */

export const SITE_STATUSES = [
  'draft',
  'demo_sent',
  'agreement_sent',
  'signed',
  'building',
  'client_review',
  'approved',
  'awaiting_payment',
  'live',
  'declined',
  'paused',
  'cancelled',
] as const;

export type SiteStatus = (typeof SITE_STATUSES)[number];

export const SITE_STATUS_LABELS: Record<SiteStatus, string> = {
  draft: 'Draft',
  demo_sent: 'Demo Sent',
  agreement_sent: 'Agreement Sent',
  signed: 'Signed',
  building: 'Building',
  client_review: 'Client Review',
  approved: 'Approved',
  awaiting_payment: 'Awaiting Payment',
  live: 'Live',
  declined: 'Declined',
  paused: 'Paused',
  cancelled: 'Cancelled',
};

/** Plain English status lines shown to clients in the portal. */
export const SITE_STATUS_PORTAL_COPY: Record<SiteStatus, string> = {
  draft: 'We are getting things ready.',
  demo_sent: 'Your demo website is ready to view.',
  agreement_sent: 'Your agreement is ready to sign.',
  signed: 'Agreement signed. Your build is in the queue.',
  building: 'We are building your website right now.',
  client_review: 'Your website is ready for your review.',
  approved: 'Approved. We are preparing your launch.',
  awaiting_payment: 'Hosting setup is the last step before launch.',
  live: 'Your website is live.',
  declined: 'This project is not moving forward.',
  paused: 'This project is paused.',
  cancelled: 'This project has ended.',
};

export const DB_MODES = ['none', 'shared', 'dedicated'] as const;
export type DbMode = (typeof DB_MODES)[number];

export const DB_MODE_LABELS: Record<DbMode, string> = {
  none: 'No database',
  shared: 'Shared (platform database)',
  dedicated: 'Dedicated Supabase project',
};

export interface HostingTier {
  key: 'starter' | 'growth' | 'pro';
  label: string;
  priceCents: number;
  updateHoursPerQuarter: number;
  /** Monthly analytics reports: free at $85+, a $10/mo add on below that. */
  analyticsIncluded: boolean;
  /**
   * Database packaging allowed at this tier. A dedicated Supabase project
   * (~$10/mo extra infra + maintenance) requires the $85+ plans; $50 sites
   * ride the shared platform database via the central lead API.
   */
  allowedDbModes: readonly DbMode[];
}

export const HOSTING_TIERS: readonly HostingTier[] = [
  {
    key: 'starter',
    label: 'Starter',
    priceCents: 5000,
    updateHoursPerQuarter: 3,
    analyticsIncluded: false,
    allowedDbModes: ['none', 'shared'],
  },
  {
    key: 'growth',
    label: 'Growth',
    priceCents: 8500,
    updateHoursPerQuarter: 9,
    analyticsIncluded: true,
    allowedDbModes: ['none', 'shared', 'dedicated'],
  },
  {
    key: 'pro',
    label: 'Pro',
    priceCents: 12500,
    updateHoursPerQuarter: 16,
    analyticsIncluded: true,
    allowedDbModes: ['none', 'shared', 'dedicated'],
  },
];

/** Analytics reports: included at this monthly price and above. */
export const ANALYTICS_INCLUDED_MIN_CENTS = 8500;
export const ANALYTICS_ADDON_PRICE_CENTS = 1000;

export function analyticsIncludedAtPrice(hostingPriceCents: number): boolean {
  return hostingPriceCents >= ANALYTICS_INCLUDED_MIN_CENTS;
}

export const BILLING_ANCHOR_DAYS = [1, 15] as const;

/** Buyout schedule if a client takes the build elsewhere (percent of build value). */
export const BUYOUT_SCHEDULE = [
  { yearLabel: 'Year 1', percent: 100 },
  { yearLabel: 'Year 2', percent: 75 },
  { yearLabel: 'Year 3', percent: 65 },
  { yearLabel: 'Year 4 and beyond', percent: 50 },
] as const;

export const CANCEL_NOTICE_DAYS = 60;

/** Payout model: the builder of a site receives 65% of its monthly revenue. */
export const BUILDERS = ['jay', 'cole'] as const;
export type Builder = (typeof BUILDERS)[number];
export const BUILDER_LABELS: Record<Builder, string> = { jay: 'Jay', cole: 'Cole' };
export const BUILDER_SHARE = 0.65; // business keeps the remaining 35%

export const EXPENSE_CATEGORIES = [
  'vercel',
  'supabase',
  'domain',
  'media',
  'labor',
  'api',
  'software',
  'writeoff',
  'other',
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export function formatPriceCents(cents: number): string {
  const dollars = cents / 100;
  return (
    '$' +
    dollars.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(dollars) ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}
