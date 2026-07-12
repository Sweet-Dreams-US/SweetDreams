'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebPreviewVideo from '@/components/web/WebPreviewVideo';
import styles from './CTASection.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Vertical team reel (Cloudflare Stream), reused via WebPreviewVideo.
const REEL_ID = 'a4e77a8138fc0e358032779ae097ac06';

export default function CTASection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !rootRef.current) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Bold, not busy: a quiet fade-up rather than the big line-slide reveal.
      gsap.from(`.${styles.lineInner}`, {
        opacity: 0,
        y: 22,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.title}`, start: 'top 82%' },
      });

      gsap.from([`.${styles.kicker}`, `.${styles.sub}`, `.${styles.ctas}`], {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.content}`, start: 'top 72%' },
      });

      gsap.from(`.${styles.mediaFrame}`, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.media}`, start: 'top 82%' },
      });

      gsap.to(`.${styles.ghost}`, {
        yPercent: -14,
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
    <section className={styles.section} ref={rootRef} data-cursor-hide>
      <span className={styles.ghost} aria-hidden="true">
        DREAM
      </span>

      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.kicker}>
            <span className={styles.kickerDot} />
            Ready when you are
          </span>

          <h2 className={styles.title}>
            <span className={styles.line}>
              <span className={styles.lineInner}>Let&apos;s create</span>
            </span>
            <span className={styles.line}>
              <span className={styles.lineInner}>something that</span>
            </span>
            <span className={styles.line}>
              <span className={`${styles.lineInner} ${styles.accent}`}>
                stands out.
              </span>
            </span>
          </h2>

          <p className={styles.sub}>
            One call. We&apos;ll map the media, the software, or both, and
            exactly what it takes to grow the business behind your brand.
          </p>

          <div className={styles.ctas}>
            <Link href="/book" className={styles.ctaPrimary}>
              Book a call
              <span className={styles.ctaArrow} aria-hidden="true">
                ↗
              </span>
            </Link>
            <Link href="/work" className={styles.ctaSecondary}>
              See our work
            </Link>
          </div>
        </div>

        <div className={styles.media}>
          <div className={styles.mediaFrame}>
            <WebPreviewVideo
              videoId={REEL_ID}
              className={styles.reel}
              ariaLabel="Sweet Dreams team reel"
              startAt={1}
              posterHeight={900}
            />
            <span className={styles.mediaGlow} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
