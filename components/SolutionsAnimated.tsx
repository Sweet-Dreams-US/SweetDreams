'use client';

import Link from "next/link";
import styles from "./Solutions.module.css";

// Four Solutions cards — each matches a tab on the /solutions page.
// Color accents follow the same palette used on the Solutions page tabs
// and the Work page filters, so the brand reads as one system.
const SOLUTIONS = [
  {
    key: 'media',
    title: 'MEDIA PRODUCTION',
    tagline: 'Commercial. Brand film. Event.',
    copy: 'Stories that move your brand forward.',
    highlight: "Let's roll cameras.",
    cta: 'EXPLORE MEDIA',
    colorClass: 'colorRed',
  },
  {
    key: 'marketing',
    title: 'MARKETING',
    tagline: 'Social. Paid ads. SEO.',
    copy: 'Turn attention into revenue.',
    highlight: 'Attention you can measure.',
    cta: 'EXPLORE MARKETING',
    colorClass: 'colorYellow',
  },
  {
    key: 'web',
    title: 'WEB & SOFTWARE',
    tagline: 'Custom-coded. Fast. Scalable.',
    copy: 'Websites and tools built to convert.',
    highlight: "Own your stack — don't rent it.",
    cta: 'EXPLORE WEB',
    colorClass: 'colorBlue',
  },
  {
    key: 'consulting',
    title: 'CONSULTING',
    tagline: 'Strategy. Systems. Ops.',
    copy: 'We diagnose the bottleneck, then fix it.',
    highlight: "Clarity beats guesswork.",
    cta: 'EXPLORE CONSULTING',
    colorClass: 'colorGreen',
  },
];

export default function SolutionsAnimated() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.mainText}>READY TO START?</h2>

        <div className={styles.fourGrid}>
          {SOLUTIONS.map((s) => (
            <div
              key={s.key}
              className={`${styles.column} ${styles[s.colorClass] || ''}`}
            >
              <h3 className={styles.columnTitle}>{s.title}</h3>
              <div className={styles.columnDivider}></div>
              <p className={styles.columnText}>{s.tagline}</p>
              <p className={styles.columnText}>{s.copy}</p>
              <p className={styles.columnTextMuted}>&nbsp;</p>
              <p className={styles.columnTextHighlight}>{s.highlight}</p>
              <Link href="/solutions" className={styles.columnButton}>
                {s.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
