'use client';

import Link from 'next/link';
import styles from './PartnerWithUs.module.css';

// Sweet Spot Partnerships pitch — 4-step engagement model with an
// application-only CTA. White section intentionally contrasts with
// the dark sections around it so partnerships feel like a distinct
// "premium" offer separate from the project-by-project services.
const STEPS = [
  {
    num: '01',
    title: 'WE LEARN YOUR BUSINESS',
    description:
      'Customers, margins, bottlenecks, offers. We study the whole engine before we touch it.',
  },
  {
    num: '02',
    title: 'WE BUILD THE SYSTEMS',
    description:
      'Media engine. Marketing stack. Custom software. Whatever your growth actually needs.',
  },
  {
    num: '03',
    title: 'WE SHIP AND SHARPEN',
    description:
      'Launch fast. Measure everything. Optimize monthly. No deliverables that sit in a folder.',
  },
  {
    num: '04',
    title: 'YOU GROW, WE EARN',
    description:
      'No retainers. No hourly traps. We earn when you earn.',
  },
];

export default function PartnerWithUs() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>PARTNER WITH US.</h2>
          <p className={styles.subheader}>
            For the businesses that don&apos;t just want a project. They want a team that wins when they win.
          </p>
          <p className={styles.intro}>
            Our Sweet Spot Partnerships go deeper than contracts. We embed into your business and
            tie our fees to your growth. Ours doesn&apos;t work unless yours does.
          </p>
        </div>

        {/* Four-step partnership model */}
        <div className={styles.steps}>
          {STEPS.map((step) => (
            <article key={step.num} className={styles.step}>
              <div className={styles.stepNumber}>{step.num}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <p className={styles.ctaNote}>Limited slots. By application only.</p>
          <Link href="/partnerships" className={styles.ctaButton}>
            APPLY FOR A PARTNERSHIP
          </Link>
        </div>
      </div>
    </section>
  );
}
