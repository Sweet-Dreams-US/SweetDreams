'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import styles from './marketing.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';
const poster = (id: string, time = 1) =>
  `${CF}/${id}/thumbnails/thumbnail.jpg?time=${time}s&height=600`;

/* ---- Capture form config (shared across all four pages) ---- */
const steps: FunnelStep[] = [
  {
    question: "What's your {name}?",
    cta: "Let's start",
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
      { name: 'whatYouDo', placeholder: 'What do you do?', required: true },
    ],
  },
  {
    question: 'Where do we {reach you}?',
    cta: 'Get my plan',
    fields: [
      { name: 'email', placeholder: 'Email', type: 'email', required: true },
      { name: 'phone', placeholder: 'Phone (optional)', type: 'tel' },
    ],
  },
];

/* ---- Offerings ---- */
const OFFERINGS: { name: string; how: string }[] = [
  { name: 'Google & Meta Ads', how: 'Put your offer in front of people ready to buy.' },
  { name: 'Local SEO', how: 'Own the map pack and the searches that matter.' },
  { name: 'Email Automation', how: 'Flows that nurture and win back on autopilot.' },
  { name: 'Social Management', how: 'Content and engagement handled end to end.' },
  { name: 'Funnels & CRO', how: 'Landing pages and funnels tuned to convert.' },
  { name: 'Reporting', how: 'Clear numbers so you always know what is working.' },
];

/* ---- Proof of work (real projects) ---- */
interface Proof {
  name: string;
  tag: string;
  videoId: string;
  time?: number;
  href: string;
  feature?: boolean;
}
const PROOF: Proof[] = [
  {
    name: 'Coleman Oil-Change Campaign',
    tag: 'Paid Social',
    videoId: '7943215ed685238e8ca63bc3617f807d',
    time: 8,
    href: '/work/coleman-back-to-the-future-commercial',
    feature: true,
  },
  {
    name: 'Coleman Hiring Funnel',
    tag: 'Recruiting Ads',
    videoId: '313f0b9be3d81f11e7d239fd08a34d38',
    time: 8,
    href: '/work/coleman-onboarding-series',
  },
  {
    name: 'Cinema Drone',
    tag: 'Lead-Gen Ad',
    videoId: '7d5f758e9ad94d17703b2f7842ca309b',
    href: '/work/cinema-drone-ad',
  },
  {
    name: 'Nissan of Elgin Launch',
    tag: 'Announcement',
    videoId: '66f28edb4b5c20354896a437b7be5220',
    time: 5,
    href: '/work/nissan-elgin-acquisition-recap',
  },
  {
    name: 'Revive Gym Content',
    tag: 'Social Reel',
    videoId: '62ea7c66a3ad77eadd83bd89c01f98c2',
    href: '/content-roadmap',
  },
  {
    name: 'Breastie Box Campaign',
    tag: 'Nonprofit Push',
    videoId: 'cd386f606ba61022ba3e608f684b3c80',
    time: 15,
    href: '/work/breastie-box-brand-film',
  },
];

/* ---- Animated count-up stats ---- */
interface Stat {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}
const STATS: Stat[] = [
  { to: 4, suffix: 'x', label: 'Average return clients see on ad spend' },
  { prefix: '$', to: 0, decimals: 0, label: 'The plan costs you nothing to start' },
  { to: 100, suffix: '%', label: 'Fort Wayne-based team, no guesswork' },
];

export default function MarketingPage() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      // Hero headline + copy rise
      gsap.from(`.${styles.freeTag}`, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
      gsap.from(`.${styles.heroTitle}`, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.05,
        ease: 'power3.out',
      });
      gsap.from([`.${styles.heroSub}`, `.${styles.heroCtas}`], {
        y: 26,
        opacity: 0,
        duration: 0.7,
        delay: 0.2,
        stagger: 0.1,
        ease: 'power3.out',
      });

      // Accent underline swipe under the highlighted hero word
      gsap.fromTo(
        `.${styles.heroTitle} .${styles.hl}`,
        { '--swipe': 0 },
        {
          '--swipe': 1,
          duration: 0.9,
          delay: 0.7,
          ease: 'power2.out',
        }
      );

      // Stat cards + count-up
      gsap.from(`.${styles.statCard}`, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.statBar}`, start: 'top 85%' },
      });

      const counters =
        root.current?.querySelectorAll<HTMLElement>('[data-count]') ?? [];
      counters.forEach((el) => {
        const to = Number(el.dataset.count ?? '0');
        const decimals = Number(el.dataset.decimals ?? '0');
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals);
          },
        });
      });

      // Big background word parallax drift
      gsap.utils.toArray<HTMLElement>(`.${styles.bgWord}`).forEach((word) => {
        gsap.to(word, {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: word,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Offerings header
      gsap.from(
        [
          `.${styles.offerings} .${styles.sectionKicker}`,
          `.${styles.offerings} .${styles.sectionTitle}`,
          `.${styles.offerings} .${styles.sectionLede}`,
        ],
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: `.${styles.offerings}`,
            start: 'top 78%',
          },
        }
      );

      // Offering rows slide in
      gsap.from(`.${styles.offerRow}`, {
        x: -40,
        opacity: 0,
        duration: 0.55,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: `.${styles.offerList}`,
          start: 'top 80%',
        },
      });

      gsap.from(`.${styles.benefitLine}`, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: `.${styles.benefitLine}`,
          start: 'top 88%',
        },
      });

      // Proof header + cards
      gsap.from(
        [
          `.${styles.proof} .${styles.sectionKicker}`,
          `.${styles.proof} .${styles.sectionTitle}`,
          `.${styles.proof} .${styles.sectionLede}`,
        ],
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: `.${styles.proof}`, start: 'top 78%' },
        }
      );
      gsap.from(`.${styles.proofCard}`, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: `.${styles.proofGrid}`,
          start: 'top 82%',
        },
      });

      // Form pitch
      gsap.from(
        [`.${styles.formPitch} > *`, `.${styles.formHolder}`],
        {
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: `.${styles.formGrid}`,
            start: 'top 78%',
          },
        }
      );

      // Closer
      gsap.from(`.${styles.closerInner} > *`, {
        y: 34,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: `.${styles.closer}`,
          start: 'top 82%',
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.page} ref={root}>
      {/* ============================ HERO ============================ */}
      <section className={styles.hero}>
        <span className={`${styles.bgWord} ${styles.bgWordHero}`} aria-hidden="true">
          GROWTH
        </span>
        <div className={styles.heroInner}>
          <span className={styles.freeTag}>
            <span className={styles.freeTagArrow}>↑</span>
            Free marketing plan · no cost
          </span>

          <h1 className={styles.heroTitle}>
            Get found by the people ready to{' '}
            <span className={styles.hl}>buy</span>
          </h1>

          <p className={styles.heroSub}>
            We audit where your customers actually are and map the campaigns to
            reach them. <b>Free plan, no cost, no obligation</b> — then we run the
            engine that turns attention into revenue.
          </p>

          <div className={styles.heroCtas}>
            <a href="#start" className={styles.ctaPrimary}>
              Get my free plan
              <span className={styles.ctaArrow}>↗</span>
            </a>
            <a href="#work" className={styles.ctaSecondary}>
              See the work
            </a>
          </div>
        </div>

        {/* Animated stat counters */}
        <div className={styles.statBar}>
          {STATS.map((s, i) => (
            <div className={styles.statCard} key={i}>
              <div className={styles.statNum}>
                {s.prefix}
                <span
                  data-count={s.to}
                  data-decimals={s.decimals ?? 0}
                >
                  {(s.to).toFixed(s.decimals ?? 0)}
                </span>
                {s.suffix && <span className={styles.statSuffix}>{s.suffix}</span>}
              </div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================= OFFERINGS ========================= */}
      <section className={styles.offerings}>
        <div className={styles.sectionInner}>
          <p className={styles.sectionKicker}>What we run for you</p>
          <h2 className={styles.sectionTitle}>The full growth engine</h2>
          <p className={styles.sectionLede}>
            Every channel handled under one roof — each one built to make your
            brand found by, and chosen by, the people ready to buy.
          </p>

          <div className={styles.offerList}>
            {OFFERINGS.map((o, i) => (
              <div className={styles.offerRow} key={o.name}>
                <span className={styles.offerNum}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.offerName}>{o.name}</h3>
                <p className={styles.offerHow}>
                  <span className={styles.arrow}>↑</span>
                  {o.how}
                </p>
              </div>
            ))}
          </div>

          <div className={styles.benefitLine}>
            <p className={styles.benefitBig}>
              The point of all of it: get{' '}
              <span className={styles.hl}>
                found by, and chosen by, the people ready to buy
              </span>
              .
            </p>
            <span className={styles.benefitArrowBig} aria-hidden="true">
              ↑
            </span>
          </div>
        </div>
      </section>

      {/* ========================= PROOF ============================= */}
      <section className={styles.proof} id="work">
        <span className={styles.bgWord} aria-hidden="true">
          GROWTH
        </span>
        <div className={styles.sectionInner}>
          <p className={styles.sectionKicker}>Proof, not promises</p>
          <h2 className={styles.sectionTitle}>Campaigns that moved the numbers</h2>
          <p className={styles.sectionLede}>
            Real work for real Fort Wayne-area brands — ads, funnels, and content
            built to convert.
          </p>

          <div className={styles.proofGrid}>
            {PROOF.map((p) => (
              <Link
                href={p.href}
                key={p.name}
                className={`${styles.proofCard} ${
                  p.feature ? styles.proofCardFeature : ''
                }`}
              >
                <div className={styles.proofMediaWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.proofThumb}
                    src={poster(p.videoId, p.time)}
                    alt={p.name}
                    loading="lazy"
                  />
                  <span className={styles.proofOverlay} />
                </div>
                <div className={styles.proofMeta}>
                  <span className={styles.proofTag}>{p.tag}</span>
                  <h3 className={styles.proofName}>
                    {p.name}
                    <span className={styles.proofNameArrow}>↗</span>
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FORM / CAPTURE ======================== */}
      <section className={styles.formSection} id="start">
        <span className={`${styles.bgWord} ${styles.bgWordForm}`} aria-hidden="true">
          GROWTH
        </span>
        <div className={styles.formGrid}>
          <div className={styles.formPitch}>
            <p className={styles.sectionKicker}>Your free marketing plan</p>
            <h2 className={styles.formPitchTitle}>
              We map it. <span className={styles.hl}>You grow.</span>
            </h2>
            <p className={styles.formPitchSub}>
              Tell us about your business and we&apos;ll audit where your customers
              actually are, then hand you the campaign plan to reach them — at no
              cost.
            </p>

            <ul className={styles.offerChecks}>
              <li className={styles.offerCheckItem}>
                <span className={styles.offerCheckMark}>✓</span>
                Where your buyers actually spend their attention
              </li>
              <li className={styles.offerCheckItem}>
                <span className={styles.offerCheckMark}>✓</span>
                The exact channels and campaigns to reach them
              </li>
              <li className={styles.offerCheckItem}>
                <span className={styles.offerCheckMark}>✓</span>
                What to run first for the fastest return
              </li>
            </ul>

            <span className={styles.formNoCost}>
              <span aria-hidden="true">↑</span> Free · no obligation
            </span>
          </div>

          <div className={styles.formHolder}>
            <FunnelForm
              funnel="marketing"
              steps={steps}
              successTitle="Your plan is coming."
              successBody="We'll put together a marketing plan for your business and reach out shortly."
            />
          </div>
        </div>
      </section>

      {/* ========================== CLOSER ========================== */}
      <section className={styles.closer}>
        <div className={styles.closerInner}>
          <h2 className={styles.closerTitle}>Momentum starts with one plan.</h2>
          <p className={styles.closerSub}>
            No cost, no lock-in — just a clear map to the customers ready to buy.
          </p>
          <a href="#start" className={styles.closerCta}>
            Get my free marketing plan
            <span className={styles.ctaArrow}>↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}
