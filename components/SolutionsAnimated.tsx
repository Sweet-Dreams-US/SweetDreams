'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Solutions.module.css';

// Each pillar becomes a large "tile" that sits in a staggered stack.
// Hovering/focusing a tile shifts it forward and dims the others —
// more cinematic than a flat 2x2 grid, and keeps the page centered.
const SOLUTIONS = [
  {
    key: 'media',
    title: 'MEDIA',
    short: 'Brand films. Commercials. Aerials.',
    highlight: "Let's roll cameras.",
    cta: 'EXPLORE MEDIA',
    colorClass: 'colorRed',
  },
  {
    key: 'marketing',
    title: 'MARKETING',
    short: 'Full funnel. Paid ads. SEO.',
    highlight: 'Attention you can measure.',
    cta: 'EXPLORE MARKETING',
    colorClass: 'colorYellow',
  },
  {
    key: 'web',
    title: 'WEB & SOFTWARE',
    short: 'Custom-coded. Fast. Scalable.',
    highlight: "Own your stack — don't rent it.",
    cta: 'EXPLORE WEB',
    colorClass: 'colorBlue',
  },
  {
    key: 'consulting',
    title: 'CONSULTING',
    short: 'Strategy. Systems. Ops.',
    highlight: 'Clarity beats guesswork.',
    cta: 'EXPLORE CONSULTING',
    colorClass: 'colorGreen',
  },
];

export default function SolutionsAnimated() {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.mainText}>READY TO START?</h2>
        <p className={styles.readySubtitle}>
          Pick your pillar. We&apos;ll run the rest.
        </p>

        {/* Creative staggered stack — tiles alternate offsets so the
            arrangement reads as a wave rather than a rigid grid. */}
        <div className={styles.fanStack}>
          {SOLUTIONS.map((s, idx) => {
            const isHovered = hoveredKey === s.key;
            const isDimmed = hoveredKey !== null && !isHovered;
            const tileClass = [
              styles.fanTile,
              styles[s.colorClass] || '',
              styles[`fanTilePos${idx + 1}`] || '',
              isHovered ? styles.fanTileActive : '',
              isDimmed ? styles.fanTileDimmed : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={s.key}
                className={tileClass}
                onMouseEnter={() => setHoveredKey(s.key)}
                onMouseLeave={() => setHoveredKey(null)}
                onFocus={() => setHoveredKey(s.key)}
                onBlur={() => setHoveredKey(null)}
              >
                <div className={styles.fanTileTop}>
                  <span className={styles.fanTileIndex}>
                    0{idx + 1}
                  </span>
                  <h3 className={styles.fanTileTitle}>{s.title}</h3>
                </div>
                <p className={styles.fanTileShort}>{s.short}</p>
                <p className={styles.fanTileHighlight}>{s.highlight}</p>
                <Link href="/solutions" className={styles.fanTileButton}>
                  {s.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
