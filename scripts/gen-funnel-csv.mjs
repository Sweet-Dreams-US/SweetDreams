/**
 * Generates docs/funnel-ad-links.csv from lib/funnel-niches.json.
 * One row per (niche × funnel) with the exact header text shown on the page
 * and the ad-ready URL (?niche=<slug>). Run: node scripts/gen-funnel-csv.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const niches = JSON.parse(
  readFileSync(join(root, 'lib', 'funnel-niches.json'), 'utf8')
);

const BASE = 'https://sweetdreams.us';
const funnels = [
  { key: 'w', label: 'Free Website', path: '/free-website' },
  { key: 'c', label: 'Free Content Plan', path: '/content-roadmap' },
  { key: 's', label: 'Free Software Demo', path: '/free-software' },
];

const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;

const rows = [['Category', 'Niche', 'Funnel', 'Header', 'URL'].map(esc).join(',')];
for (const n of niches) {
  for (const f of funnels) {
    const url = `${BASE}${f.path}?niche=${n.slug}`;
    rows.push([n.category, n.name, f.label, n[f.key], url].map(esc).join(','));
  }
}

mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs', 'funnel-ad-links.csv'), rows.join('\n') + '\n', 'utf8');
console.log(`Wrote ${rows.length - 1} rows to docs/funnel-ad-links.csv`);
