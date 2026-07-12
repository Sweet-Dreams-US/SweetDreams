'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/software/software.module.css';
import { BIG_STATS, BigStat } from '@/app/software/data';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type BigStatsProps = { stats?: BigStat[] };

/**
 * The three big count-up stats. Numbers count from zero when scrolled into
 * view; reduced motion leaves them at their final value. Each card carries
 * `data-reveal` so the page-level reveal hook fades it in.
 */
export default function BigStats({ stats = BIG_STATS }: BigStatsProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const counters = root.current?.querySelectorAll<HTMLElement>('[data-count]') ?? [];
      counters.forEach((el) => {
        const to = Number(el.dataset.count ?? '0');
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toString();
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.statBar} ref={root}>
      {stats.map((s, i) => (
        <div className={styles.bigStat} key={i} data-reveal>
          <div className={styles.bigStatNum}>
            {s.prefix}
            {s.staticNum ? (
              <>
                {s.staticNum}
                <span className={styles.unit}>{s.staticUnit}</span>
              </>
            ) : (
              <>
                <span data-count={s.to}>{s.to}</span>
                <span className={styles.unit}>{s.unit}</span>
              </>
            )}
          </div>
          <p className={styles.bigStatLabel}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
