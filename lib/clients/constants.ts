/**
 * Client management constants — site statuses, hosting tiers, formatting.
 *
 * Single source for the /admin/clients UIs, the portal, and the client APIs.
 * Route files must only export handlers, so shared constants live here.
 */

/**
 * Fort Wayne is Eastern time. Lives here (dependency-free) so client
 * components can import it without pulling the email send path in;
 * lib/agreements/service re-exports it for its existing callers.
 */
export const BUSINESS_TZ = 'America/Indiana/Indianapolis';

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
  key: 'essential' | 'growth' | 'pro';
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
    key: 'essential',
    label: 'Essential',
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

/* ------------------------------------------------------------------------ */
/* Demo approval queue                                                      */
/* ------------------------------------------------------------------------ */

/**
 * A demo is not done when it deploys. It is done when the client has opened
 * it. Every step between those two points is its own status with its own
 * timestamp so /admin/demos can surface anything aging past 48 hours.
 *
 * Ladder (who moves it):
 *   none -> building (Claude) -> ready_for_review (Claude: deployed, SSO off,
 *   verified loading) -> approved (COLE, in /admin/demos only) -> sent
 *   (Claude after sending, or the send-welcome route) -> viewed (welcome
 *   page, when the client opens it). changes_requested is Cole's "not yet"
 *   and loops back through ready_for_review.
 *
 * Claude never writes 'approved'. That is the whole point of the queue.
 */
export const DEMO_STATUSES = [
  'none',
  'building',
  'ready_for_review',
  'approved',
  'sent',
  'viewed',
  'changes_requested',
] as const;

export type DemoStatus = (typeof DEMO_STATUSES)[number];

export const DEMO_STATUS_LABELS: Record<DemoStatus, string> = {
  none: 'No demo',
  building: 'Building',
  ready_for_review: 'Ready for review',
  approved: 'Approved · queued to send',
  sent: 'Sent',
  viewed: 'Viewed by client',
  changes_requested: 'Changes requested',
};

/**
 * What the /admin/demos card can ask /api/admin/demos/update to do. The body
 * never carries a raw demo_status; the route maps each action to one.
 */
export const DEMO_ACTIONS = ['approve', 'request_changes', 'dismiss'] as const;
export type DemoAction = (typeof DEMO_ACTIONS)[number];

/** Statuses that appear on /admin/demos. */
export const DEMO_QUEUE_STATUSES: readonly DemoStatus[] = [
  'building',
  'ready_for_review',
  'approved',
  'sent',
  'changes_requested',
];

/** Statuses that mean Cole still has to look; drives the "N demos waiting on you" counter. */
export const DEMO_WAITING_STATUSES: readonly DemoStatus[] = ['ready_for_review'];

/** Age thresholds in whole days since demo_built_at. Past 2 days the close rate drops hard. */
export const DEMO_AGE_AMBER_DAYS = 2;
export const DEMO_AGE_RED_DAYS = 3;

export type DemoAgeTone = 'ok' | 'amber' | 'red';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Whole days since builtAt (floor); null when builtAt is null/invalid.
 * UTC millisecond math, so the answer never depends on the server's time
 * zone, and never negative: a build stamped slightly in the future reads
 * as 0 days. now defaults to new Date().
 */
export function demoAgeDays(
  builtAtIso: string | null | undefined,
  now: Date = new Date()
): number | null {
  if (!builtAtIso) return null;
  const builtMs = new Date(builtAtIso).getTime();
  const nowMs = now.getTime();
  if (Number.isNaN(builtMs) || Number.isNaN(nowMs)) return null;
  const days = Math.floor((nowMs - builtMs) / DAY_MS);
  return days < 0 ? 0 : days;
}

/** null (no build date) reads as ok; the age pill says "no build date" instead. */
export function demoAgeTone(days: number | null): DemoAgeTone {
  if (days === null) return 'ok';
  if (days >= DEMO_AGE_RED_DAYS) return 'red';
  if (days >= DEMO_AGE_AMBER_DAYS) return 'amber';
  return 'ok';
}

/**
 * The "N demos waiting on you, oldest is X days" line. Pass the ages of the
 * rows whose demo_status is in DEMO_WAITING_STATUSES. Rows with no build
 * date still count as waiting; they just can never be the oldest.
 */
export function demoQueueCounter(waitingAges: Array<number | null>): {
  count: number;
  oldestDays: number | null;
  red: boolean;
} {
  let oldestDays: number | null = null;
  for (const age of waitingAges) {
    if (age === null) continue;
    if (oldestDays === null || age > oldestDays) oldestDays = age;
  }
  return {
    count: waitingAges.length,
    oldestDays,
    red: oldestDays !== null && oldestDays >= DEMO_AGE_RED_DAYS,
  };
}

/**
 * Plain-text draft of the message that goes to the client with their demo
 * link. Shown on the /admin/demos card with a Copy button so sending is one
 * paste into an email or a text. No markdown; under ~90 words.
 */
export function buildDemoSendMessage(input: {
  contactName: string;
  businessName: string;
  demoUrl: string;
  adminUrl?: string | null;
  passcode?: string | null;
}): string {
  const firstName = (input.contactName ?? '').trim().split(/\s+/)[0] || 'there';
  const adminUrl = input.adminUrl?.trim() ?? '';
  const passcode = input.passcode?.trim() ?? '';

  const paragraphs: string[] = [
    `Hi ${firstName},`,
    `We built a free demo website for ${input.businessName} so you can see exactly what we would make for you.`,
    input.demoUrl,
  ];

  if (adminUrl) {
    const adminLines = [`Your demo admin panel: ${adminUrl}`];
    if (passcode) adminLines.push(`Passcode: ${passcode}`);
    paragraphs.push(adminLines.join('\n'));
  }

  paragraphs.push(
    'Reply with anything you want changed. Once it is live, hosting is the only cost.',
    'Cole\nSweet Dreams · sweetdreams.us'
  );

  return paragraphs.join('\n\n');
}
