'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebPreviewVideo from '@/components/web/WebPreviewVideo';
import styles from './WhatWeDo.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// The two avenues Sweet Dreams sells. Each is a full panel with a live
// reel, the pitch, and a route into its hub. Software is the 3-phase
// product ladder; Media is business video/content.
interface Avenue {
  num: string;
  kicker: string;
  title: string;
  lede: string;
  tags: string[];
  videoId: string;
  href: string;
  accentClass: string;
  ariaLabel: string;
}

const AVENUES: Avenue[] = [
  {
    num: '01',
    kicker: 'Software',
    title: 'Platforms that run the business',
    lede: 'A premium animated brand site, then the ops platform that lives inside it, then the AI that connects the pipelines. One ladder, climb it as you grow.',
    tags: ['Websites', 'Dream Suite', 'AI Automations'],
    videoId: '1ab82de79e003fc0c37afc0a27fedbc4',
    href: '/software',
    accentClass: 'blue',
    ariaLabel: 'Software preview reel',
  },
  {
    num: '02',
    kicker: 'Media Production',
    title: 'Content that makes you unforgettable',
    lede: 'Brand films, social, aerial, and event coverage, cinema cameras and full post, built to sell. The work that makes a premium brand look premium.',
    tags: ['Brand Films', 'Social', 'Aerial', 'Events'],
    videoId: 'd08682649901944d9bbec1dcfb8bde88',
    href: '/services/media-production',
    accentClass: 'red',
    ariaLabel: 'Media production preview reel',
  },
];

export default function WhatWeDo() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !rootRef.current) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Section header
      gsap.from(`.${styles.head} > *`, {
        y: 32,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.head}`, start: 'top 82%' },
      });

      // Each panel reveals: media slides in, copy staggers up
      gsap.utils.toArray<HTMLElement>(`.${styles.panel}`).forEach((panel) => {
        const media = panel.querySelector(`.${styles.media}`);
        const copyBits = panel.querySelectorAll(`.${styles.copy} > *`);

        if (media) {
          gsap.from(media, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 78%' },
          });
        }
        gsap.from(copyBits, {
          y: 36,
          opacity: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 72%' },
        });
      });

      // Ghost word parallax drift
      gsap.utils.toArray<HTMLElement>(`.${styles.ghost}`).forEach((word) => {
        gsap.to(word, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: word,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={rootRef}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.head}>
          <span className={styles.kicker}>What we do</span>
          <h2 className={styles.title}>Two ways we move you forward</h2>
          <p className={styles.sub}>
            Sweet Dreams is a media company and a software studio. Pick the
            avenue you need now, most brands end up using both.
          </p>
        </div>

        {/* Two avenue panels */}
        <div className={styles.panels}>
          {AVENUES.map((a) => (
            <article
              key={a.num}
              className={`${styles.panel} ${styles[a.accentClass]}`}
            >
              <span className={styles.ghost} aria-hidden="true">
                {a.kicker.split(' ')[0]}
              </span>

              <div className={styles.media}>
                <div className={styles.mediaFrame}>
                  <WebPreviewVideo
                    videoId={a.videoId}
                    className={styles.reel}
                    ariaLabel={a.ariaLabel}
                    startAt={1}
                  />
                  <span className={styles.mediaGlow} aria-hidden="true" />
                </div>
              </div>

              <div className={styles.copy}>
                <span className={styles.panelNum} aria-hidden="true">
                  {a.num}
                </span>
                <span className={styles.panelKicker}>{a.kicker}</span>
                <h3 className={styles.panelTitle}>{a.title}</h3>
                <p className={styles.panelLede}>{a.lede}</p>

                <ul className={styles.tags}>
                  {a.tags.map((t, i) => (
                    <li key={t} className={styles.tag}>
                      {t}
                      {i < a.tags.length - 1 && (
                        <span className={styles.tagSep} aria-hidden="true">
                          →
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <Link href={a.href} className={styles.explore}>
                  Explore
                  <span className={styles.exploreArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
