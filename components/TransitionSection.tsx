'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './TransitionSection.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Generational-authenticity positioning. The internet isn't a channel we
// learned, it's the world we grew up in. Same spirit as before, elevated.
const POINTS = [
  {
    num: '01',
    title: 'Native, not adapted',
    body: 'The internet isn’t a platform we studied. It’s the world we were raised in.',
  },
  {
    num: '02',
    title: 'Always current',
    body: 'New tools, new formats, new platforms, 2026’s latest. We ship on them first.',
  },
  {
    num: '03',
    title: 'No legacy drag',
    body: 'No dusty playbooks, no bloated retainers. Just what actually moves the needle now.',
  },
];

export default function TransitionSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !rootRef.current) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Headline lines clip up
      gsap.from(`.${styles.lineInner}`, {
        yPercent: 116,
        duration: 1,
        stagger: 0.12,
        ease: 'power4.out',
        scrollTrigger: { trigger: `.${styles.headline}`, start: 'top 80%' },
      });

      gsap.from(`.${styles.sub}`, {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.sub}`, start: 'top 86%' },
      });

      gsap.from(`.${styles.point}`, {
        y: 40,
        opacity: 0,
        duration: 0.65,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.points}`, start: 'top 82%' },
      });

      // Ghost word parallax
      gsap.to(`.${styles.ghost}`, {
        yPercent: -16,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={rootRef}>
      <span className={styles.ghost} aria-hidden="true">
        NOW
      </span>

      <div className={styles.container}>
        <span className={styles.kicker}>Our edge</span>

        <h2 className={styles.headline}>
          <span className={styles.line}>
            <span className={styles.lineInner}>We were raised</span>
          </span>
          <span className={styles.line}>
            <span className={styles.lineInner}>
              in this <span className={styles.accent}>age.</span>
            </span>
          </span>
        </h2>

        <p className={styles.sub}>
          We stay ahead of the curve because we never had to catch up to it.
          While others adapt, we build with what&apos;s next, and we don&apos;t
          get left behind.
        </p>

        <div className={styles.points}>
          {POINTS.map((p) => (
            <div key={p.num} className={styles.point}>
              <span className={styles.pointNum} aria-hidden="true">
                {p.num}
              </span>
              <h3 className={styles.pointTitle}>{p.title}</h3>
              <p className={styles.pointBody}>{p.body}</p>
            </div>
          ))}
        </div>

        <Link href="/work" className={styles.link}>
          See what that looks like
          <span className={styles.linkArrow} aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
