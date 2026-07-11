'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import styles from './VideoHero.module.css';

// Heaven in Fort Wayne, aerial drone piece as the living background.
const HERO_VIDEO_ID = 'd8c34ebf7e9bb7a150feaa29cd60a9a6';
const HERO_IFRAME_SRC = `https://customer-w6h9o08eg118alny.cloudflarestream.com/${HERO_VIDEO_ID}/iframe?muted=true&autoplay=true&loop=true&controls=false`;

// The word that cycles inside the headline. Keep each single-line + punchy.
const ROTATING = ['UNFORGETTABLE', 'MOVE', 'CONVERT', 'SCALE'];
const MARQUEE = [
  'BRAND FILMS',
  'WEBSITES',
  'DREAM SUITE',
  'AI AUTOMATIONS',
  'SOCIAL CONTENT',
  'AERIAL',
  'COMMERCIALS',
  'EVENT COVERAGE',
];

export default function VideoHero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !rootRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Entrance
      if (!prefersReduced) {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.from(`.${styles.eyebrow}`, { y: 18, opacity: 0, duration: 0.6, ease: 'power3.out' })
          .from(
            `.${styles.lineInner}`,
            { yPercent: 120, duration: 1, stagger: 0.12, ease: 'power4.out' },
            '-=0.25'
          )
          .from(`.${styles.sub}`, { y: 22, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45')
          .from(
            `.${styles.ctas} > *`,
            { y: 18, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
            '-=0.45'
          )
          .from(`.${styles.marquee}`, { opacity: 0, duration: 0.8 }, '-=0.2');
      }

      // Rotating word, a vertical slider through ROTATING (+ a duplicate first
      // word appended for a seamless loop reset).
      const inner = rootRef.current!.querySelector(`.${styles.rotatorInner}`) as HTMLElement | null;
      if (inner && !prefersReduced) {
        const count = ROTATING.length; // items = count + 1 (dup)
        const stepPct = 100 / (count + 1);
        const tl = gsap.timeline({ repeat: -1 });
        for (let i = 1; i <= count; i++) {
          tl.to(inner, { yPercent: -stepPct * i, duration: 0.55, ease: 'power3.inOut' }, `+=1.5`);
        }
        tl.set(inner, { yPercent: 0 });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} ref={rootRef}>
      {/* Living background */}
      <div className={styles.videoWrap} aria-hidden="true">
        <iframe
          className={styles.videoBg}
          src={HERO_IFRAME_SRC}
          title="Sweet Dreams aerial reel"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          loading="eager"
          tabIndex={-1}
        />
        <div className={styles.scrim} />
        <div className={styles.grain} />
      </div>

      {/* Content */}
      <div className={styles.inner}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          FORT WAYNE · MEDIA + SOFTWARE
        </span>

        <h1 className={styles.headline}>
          <span className={styles.line}>
            <span className={styles.lineInner}>WE MAKE BRANDS</span>
          </span>
          <span className={styles.line}>
            <span className={styles.lineInner}>
              <span className={styles.rotator} aria-label="unforgettable">
                <span className={styles.rotatorInner}>
                  {[...ROTATING, ROTATING[0]].map((w, i) => (
                    <span className={styles.rotatorWord} key={i}>
                      {w}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </span>
        </h1>

        <p className={styles.sub}>
          A creative agency and software studio under one roof. Cinematic media
          production and custom platforms, built to grow the business behind the brand.
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

      {/* Moving marquee */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span className={styles.marqueeItem} key={i}>
              {m}
              <span className={styles.marqueeDot}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
