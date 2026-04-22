'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './TransitionSection.module.css';

// Three-step process card. Rendered twice (base + inverted layer) so
// the scroll-clip color-flip effect can reveal the inverted version
// over the base as the user scrolls past.
const STEPS = [
  {
    num: '01',
    title: 'LEARN THE BUSINESS',
    description:
      "We get in deep before we build. Your customers, your margins, your edge.",
  },
  {
    num: '02',
    title: 'GROW THE ENGINE',
    description:
      'Media, marketing, software, or strategy. Whatever actually moves the needle.',
  },
  {
    num: '03',
    title: 'OPTIMIZE THE PROCESS',
    description:
      'Measure everything. Automate the systems. Ship fast — no wasted cycles.',
  },
];

function Panel() {
  return (
    <div className={styles.container}>
      <h2 className={styles.mainText}>
        WE WERE RAISED<br />
        IN THIS AGE.
      </h2>
      <p className={styles.subheader}>
        We stay ahead of the curve. 2026&apos;s latest trends. We don&apos;t get left behind.
      </p>

      <div className={styles.stepsList}>
        {STEPS.map((step) => (
          <div key={step.num} className={styles.step}>
            <span className={styles.stepNumber}>{step.num}</span>
            <div className={styles.stepBody}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <p className={styles.tagline}>
        No retainers. No hourly billing. Just results.
      </p>
      <Link href="/solutions" className={styles.button}>
        SEE MORE
      </Link>
    </div>
  );
}

export default function TransitionSection() {
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('transition-section');
      const invertedLayer = document.getElementById('inverted-layer-1');

      if (section && invertedLayer) {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Accelerated so the clip completes at ~50% scroll progress
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const easedProgress = clampedProgress * 2;
        const finalProgress = Math.min(1, easedProgress);

        // Clip from right to left — reveals the inverted (light) version
        const clipPercentage = 100 - (finalProgress * 100);
        invertedLayer.style.clipPath = `inset(0 ${clipPercentage}% 0 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.section} id="transition-section">
      {/* Base layer — black background, white text */}
      <div className={styles.baseLayer}>
        <Panel />
      </div>

      {/* Inverted layer — white background, black text, revealed on scroll */}
      <div className={styles.invertedLayer} id="inverted-layer-1">
        <Panel />
      </div>
    </section>
  );
}
