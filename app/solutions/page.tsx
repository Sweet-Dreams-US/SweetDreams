'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import styles from './solutions.module.css';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/* ---------- the three routes ---------- */
const CHOICES: {
  kicker: string;
  title: string;
  blurb: string;
  href: string;
  cta: string;
  variant: string;
}[] = [
  {
    kicker: 'Build & automate',
    title: 'Software',
    blurb:
      'A website that sells, or AI workflows we build with your team to run the busywork. Start with one, add the other.',
    href: '/software',
    cta: 'Explore software',
    variant: styles.cardBlue,
  },
  {
    kicker: 'Get seen',
    title: 'Media Production',
    blurb:
      'Video and content that makes you unforgettable, brand films, commercials, and social shot to look premium.',
    href: '/services/media-production',
    cta: 'Explore media',
    variant: styles.cardRed,
  },
  {
    kicker: 'See the work',
    title: 'Portfolio',
    blurb:
      "Just want to see what we make? Browse everything, the films, the sites, the whole reel.",
    href: '/work',
    cta: 'Browse the work',
    variant: styles.cardNeutral,
  },
];

/* ---------- lead capture for the undecided ---------- */
const steps: FunnelStep[] = [
  {
    question: "First, what's your {name}?",
    cta: 'Continue',
    fields: [
      { name: 'firstName', placeholder: 'First name', required: true, half: true },
      { name: 'lastName', placeholder: 'Last name', required: true, half: true },
    ],
  },
  {
    question: 'Tell us about your {business}',
    cta: 'Continue',
    fields: [
      { name: 'businessName', placeholder: 'Business name', required: true },
      { name: 'detail', placeholder: 'What are you trying to solve?', required: true },
    ],
  },
  {
    question: 'Where do we {reach you}?',
    cta: 'Point me the right way',
    fields: [
      { name: 'email', placeholder: 'Email', type: 'email', required: true },
      { name: 'phone', placeholder: 'Phone (optional)', type: 'tel' },
    ],
  },
];

export default function SolutionsPage() {
  const root = useRef<HTMLDivElement>(null);
  const bgWord = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from(`.${styles.headInner} > *`, {
        y: 44,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.from(`.${styles.card}`, {
        y: 56,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.cards}`, start: 'top 82%' },
      });

      gsap.utils.toArray<HTMLElement>(`.${styles.reveal}`).forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 84%' },
        });
      });

      if (bgWord.current) {
        gsap.to(bgWord.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={styles.page}>
      {/* contained ghost word */}
      <div ref={bgWord} className={styles.bgWord} aria-hidden="true">
        START
      </div>

      <div className={styles.content}>
        {/* ================= HEADER ================= */}
        <header className={styles.head}>
          <div className={`${styles.shell} ${styles.headInner}`}>
            <p className={styles.kicker}>Not sure what you need?</p>
            <h1 className={styles.headline}>
              Not sure where to start?
              <br />
              <span className={styles.accent}>Let&apos;s point you</span> the right way.
            </h1>
            <p className={styles.sub}>
              Tell us where you are and we&apos;ll aim you at the fastest win, software,
              media, or just the proof. Pick a lane below, or let us decide with you.
            </p>
          </div>
        </header>

        {/* ================= THREE CHOICES ================= */}
        <section className={styles.cardsSection}>
          <div className={styles.shell}>
            <div className={styles.cards}>
              {CHOICES.map((c, i) => (
                <Link key={c.href} href={c.href} className={`${styles.card} ${c.variant}`}>
                  <span className={styles.cardNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.cardKicker}>{c.kicker}</span>
                  <h2 className={styles.cardTitle}>{c.title}</h2>
                  <p className={styles.cardBlurb}>{c.blurb}</p>
                  <span className={styles.cardCta}>
                    {c.cta}
                    <span className={styles.cardArrow} aria-hidden="true">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= UNDECIDED, LEAD CAPTURE ================= */}
        <section className={styles.capture}>
          <div className={styles.shell}>
            <div className={styles.captureWrap}>
              <div className={`${styles.capturePitch} ${styles.reveal}`}>
                <p className={styles.kicker}>Still on the fence?</p>
                <h2 className={styles.captureHead}>
                  Tell us the goal.
                  <br />
                  We&apos;ll map the fit.
                </h2>
                <p className={styles.captureLede}>
                  Not every business knows whether it needs a new site, a content engine, or
                  a system behind the scenes. Give us two minutes and we&apos;ll tell you
                  where your money moves the needle, honestly, even if it isn&apos;t with us.
                </p>
                <ul className={styles.pitchList}>
                  <li>A straight read on what you actually need first</li>
                  <li>The one move that unlocks the most growth</li>
                  <li>No pressure, no cost to get pointed the right way</li>
                </ul>
                <p className={styles.orCall}>
                  Rather just talk?{' '}
                  <Link href="/book" className={styles.orCallLink}>
                    Book a call →
                  </Link>
                </p>
              </div>

              <div className={styles.captureHost}>
                <FunnelForm
                  funnel="consulting"
                  steps={steps}
                  successTitle="Got it."
                  successBody="We'll reach out and help you figure out the right fit."
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
