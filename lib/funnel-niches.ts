import nichesData from './funnel-niches.json';

/**
 * Niche qualifier lines for the ad-targeted funnel variants.
 *
 * Single source of truth: lib/funnel-niches.json. The three funnel pages
 * read `?niche=<slug>` and swap their qualifier bar text:
 *   /free-website     → w  (website)
 *   /content-roadmap  → c  (content)
 *   /free-software    → s  (software)
 * No param = the generic default already on each page.
 *
 * scripts/gen-funnel-csv.mjs reads the same JSON to emit the ad-links CSV,
 * so the CSV and the live pages can never drift.
 */
export interface FunnelNiche {
  slug: string;
  name: string;
  category: string;
  /** website qualifier */
  w: string;
  /** content qualifier */
  c: string;
  /** software qualifier */
  s: string;
}

export const FUNNEL_NICHES = nichesData as FunnelNiche[];

export const NICHE_BY_SLUG: Record<string, FunnelNiche> = Object.fromEntries(
  FUNNEL_NICHES.map((n) => [n.slug, n])
);
