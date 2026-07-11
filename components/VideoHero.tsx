'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import styles from './VideoHero.module.css';

// HERO VIDEO — swap videoId for the flagship clip
const HERO_VIDEO_ID = '7d5f758e9ad94d17703b2f7842ca309b';
const HERO_IFRAME_SRC = `https://customer-w6h9o08eg118alny.cloudflarestream.com/${HERO_VIDEO_ID}/iframe?muted=true&autoplay=true&loop=true&controls=false`;

export default function VideoHero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !rootRef.current) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.from(`.${styles.eyebrow}`, {
        y: 18,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
        // Cinematic line rise — each headline line clips up from below
        .from(
          `.${styles.lineInner}`,
          {
            yPercent: 118,
            duration: 1,
            stagger: 0.12,
            ease: 'power4.out',
          },
          '-=0.25'
        )
        .from(
          `.${styles.sub}`,
          { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.4'
        )
        .from(
          `.${styles.ctas} > *`,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.45'
        )
        .from(
          `.${styles.scrollCue}`,
          { opacity: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.2'
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} ref={rootRef}>
      {/* ---- Full-bleed background video ---- */}
      <div className={styles.videoWrap} aria-hidden="true">
        <iframe
          className={styles.videoBg}
          src={HERO_IFRAME_SRC}
          title="Sweet Dreams reel"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          loading="eager"
          tabIndex={-1}
        />
        <div className={styles.scrim} />
        <div className={styles.grain} />
      </div>

      {/* ---- Overlay content ---- */}
      <div className={styles.inner}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          Fort Wayne — Media + Software
        </span>

        <h1 className={styles.headline}>
          <span className={styles.line}>
            <span className={styles.lineInner}>
              We build brands that <span className={styles.accentRed}>move</span>
            </span>
          </span>
          <span className={styles.line}>
            <span className={styles.lineInner}>
              — and the systems that{' '}
              <span className={styles.accentBlue}>run them.</span>
            </span>
          </span>
        </h1>

        <p className={styles.sub}>
          A creative agency and software studio under one roof. Cinematic media
          production and custom platforms — built to grow the business behind
          the brand.
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

      <div className={styles.scrollCue} aria-hidden="true">
        <span className={styles.scrollLine} />
        Scroll
      </div>
    </section>
  );
}
