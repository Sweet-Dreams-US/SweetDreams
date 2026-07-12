/* ============================================================
   Sweet Dreams — Software data
   Shared source of truth for the Software hub (/software), the
   Websites page (/websites), and the AI Workflows page (/ai).
   Pure data + types, no JSX, so every page imports the same set.
   ============================================================ */

/* ---------- Websites: real builds shown as smart-video previews ---------- */
export type WebBuild = { videoId: string; name: string };

export const BUILDS: WebBuild[] = [
  { videoId: '1ab82de79e003fc0c37afc0a27fedbc4', name: 'MC Racing' },
  { videoId: '652911e44eafee84d9efa47dad31eac5', name: 'Prime Dealer Fund' },
  { videoId: '37a027a19196653d4ef79b6c2f5f5758', name: 'Creator Space' },
  { videoId: '4db4384638b438d0f2c3fb9b60a48606', name: 'MindSquire' },
  { videoId: '33850e02411be4ba7cb880ef7af52dce', name: 'Industrial Bakery' },
  { videoId: 'a7969078d27d7d15394978d0c02cc306', name: 'Bite Me Protein' },
  { videoId: 'abc316f410b475f978ab9322b033add6', name: 'Ace Gameroom' },
  { videoId: 'bc21e8ee97ddda1e531072021685955a', name: 'Hot Chicks' },
];

/* ---------- Websites: why it sells ---------- */
export type WebValue = { name: string; how: string };

export const VALUES: WebValue[] = [
  { name: 'Hand coded', how: 'No templates, no page builders. Built line by line to load fast and rank higher.' },
  { name: 'Funnel built', how: 'Every page is engineered to turn a visitor into a booked, qualified lead.' },
  { name: 'SEO from day one', how: 'Structured, fast, and built to be found on Google in your city.' },
  { name: 'Media included', how: 'Pro photo + video, shot for your brand and baked right into the site.' },
  { name: 'Yours to keep', how: 'Your brand, your domain, your code, never held hostage.' },
  { name: 'Managed hosting', how: 'Fast, secure, and monitored. One flat monthly fee, nothing to babysit.' },
];

/* ---------- Platform mockup: capability groups ---------- */
export type CapGroup = { group: string; items: string[] };

export const CAPS: CapGroup[] = [
  { group: 'Run', items: ['Bookings', 'Availability', 'Customers', 'Inquiries', 'POS'] },
  { group: 'Money', items: ['Transactions', 'Expenses', 'Payouts', 'Accounting', 'Payroll'] },
  { group: 'Grow', items: ['Email Marketing', 'Ads', 'Reports'] },
];

/* ---------- Platform mockup: dashboard data ---------- */
export type StatCard = { label: string; value: string; delta: string; down: boolean };

export const STAT_CARDS: StatCard[] = [
  { label: 'Revenue · 30d', value: '$48,250', delta: '+12.4%', down: false },
  { label: 'Bookings', value: '128', delta: '+8 this week', down: false },
  { label: 'New Customers', value: '34', delta: '+5 this week', down: false },
  { label: 'Payouts', value: '$12,400', delta: '→ Cleared', down: true },
];

export const CHART = [46, 58, 52, 70, 63, 82, 74];
export const CHART_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const CHART_PEAK = Math.max(...CHART);

export type Txn = { name: string; service: string; amt: string; status: string; pending: boolean };

export const TXNS: Txn[] = [
  { name: 'Marcus Reed', service: 'Studio Session · 2h', amt: '$240', status: 'Paid', pending: false },
  { name: 'Bite Me Protein', service: 'Wholesale Order', amt: '$1,180', status: 'Paid', pending: false },
  { name: 'Ava Coleman', service: 'Brand Consultation', amt: '$150', status: 'Pending', pending: true },
];

/* ---------- AI pipeline: nodes (coords in the 1000x320 viewBox) ---------- */
export type PNode = { cx: number; cy: number; label: string; labelY: number; hub?: boolean };

export const PNODES: PNode[] = [
  { cx: 60, cy: 210, label: 'INQUIRIES', labelY: 252 },
  { cx: 207, cy: 110, label: 'BOOKINGS', labelY: 72 },
  { cx: 353, cy: 210, label: 'PAYMENTS', labelY: 252 },
  { cx: 500, cy: 110, label: 'AI CORE', labelY: 62, hub: true },
  { cx: 647, cy: 210, label: 'EMAIL + ADS', labelY: 252 },
  { cx: 793, cy: 110, label: 'PAYOUTS', labelY: 72 },
  { cx: 940, cy: 210, label: 'REPORTS', labelY: 252 },
];

export const PIPE_D =
  'M60 210 C133.5 210, 133.5 110, 207 110 ' +
  'C280.5 110, 279.5 210, 353 210 ' +
  'C426.5 210, 426.5 110, 500 110 ' +
  'C573.5 110, 573.5 210, 647 210 ' +
  'C720.5 210, 720.5 110, 793 110 ' +
  'C866.5 110, 866.5 210, 940 210';

/* ---------- AI: count-up stats (illustrative until real numbers land) ---------- */
export type BigStat = {
  to?: number;
  prefix?: string;
  unit?: string;
  staticNum?: string;
  staticUnit?: string;
  label: string;
};

export const BIG_STATS: BigStat[] = [
  { to: 3, unit: '×', label: 'More output from the same team, once AI is built into how they work.' },
  { prefix: '−', to: 40, unit: '%', label: 'Less busywork, the repetitive steps in everyone’s day handed to AI.' },
  { staticNum: '100', staticUnit: '%', label: 'Yours to keep. Every workflow we build with you, your team owns and runs.' },
];
