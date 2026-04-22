'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './WhatWeDo.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Four pillars. Color tokens match the Solutions tabs + Work filters
// so the whole site reads as one visual system.
// Funnel routing per pillar:
// - Media: portfolio is the proof. Send to /work?filter=business —
//   from there users enter project pages which have their own CTAs.
// - Marketing: the pitch lives on /solutions (Marketing tab). That
//   page carries the strategy story and its own funnel.
// - Software: /solutions#web — perception + backend automation pitch,
//   which then funnels through project showcases.
// - Consulting: the partnership page IS the consulting funnel.
const PILLARS = [
  {
    num: '01',
    title: 'MEDIA',
    description:
      'Brand films, commercials, social video, aerials, event coverage. Cinema cameras, full post production, and stories built to sell.',
    ctaLabel: 'See Work',
    ctaHref: '/work?filter=business',
    colorClass: 'colorRed',
  },
  {
    num: '02',
    title: 'MARKETING',
    description:
      'Full funnel strategy, Google Ads, Meta Ads, local SEO, and email. Campaigns built to measure, not just run.',
    ctaLabel: 'Get a Plan',
    ctaHref: '/solutions#marketing',
    colorClass: 'colorYellow',
  },
  {
    num: '03',
    title: 'SOFTWARE',
    description:
      'Custom websites and web apps, every one hand coded from scratch. Fast, secure, and built to grow with you.',
    ctaLabel: 'Start a Build',
    ctaHref: '/solutions#web',
    colorClass: 'colorBlue',
  },
  {
    num: '04',
    title: 'STRATEGY',
    description:
      'Brand positioning, offer refinement, and content systems. Frameworks that compound instead of expire.',
    ctaLabel: 'Book a Call',
    ctaHref: '/partnerships',
    colorClass: 'colorGreen',
  },
] as const;

export default function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !cardsRef.current) return;

    const isMobile = window.innerWidth <= 768;
    const cards = cardsRef.current.querySelectorAll(`.${styles.card}`);

    const ctx = gsap.context(() => {
      // Each card slides in from the left and fades up a bit, staggered.
      // Triggers earlier on mobile so users don't have to scroll past
      // to see the reveal.
      gsap.set(cards, { x: -60, opacity: 0 });
      gsap.to(cards, {
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: isMobile ? 'top 90%' : 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>WHAT WE DO</h2>
          <p className={styles.subtitle}>
            4 connected strategies that all compliment each other.
          </p>
        </div>

        {/* Cards */}
        <div className={styles.cards} ref={cardsRef}>
          {PILLARS.map((pillar) => (
            <article
              key={pillar.num}
              className={`${styles.card} ${styles[pillar.colorClass]}`}
            >
              <span className={styles.cardNumber} aria-hidden="true">
                {pillar.num}
              </span>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{pillar.title}</h3>
                <p className={styles.cardDescription}>{pillar.description}</p>
                <Link href={pillar.ctaHref} className={styles.cardButton}>
                  {pillar.ctaLabel}
                  <span className={styles.cardButtonArrow}>&rarr;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
