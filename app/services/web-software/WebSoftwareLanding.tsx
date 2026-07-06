'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import FunnelReel from '@/components/funnel/FunnelReel';
import styles from './webSoftware.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';
const poster = (id: string, t = '1s') =>
  `${CF}/${id}/thumbnails/thumbnail.jpg?time=${t}&height=600`;

/* ---- capture form config (identical across the four service pages) ---- */
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
    cta: 'Build mine free',
    fields: [
      { name: 'email', placeholder: 'Email', type: 'email', required: true },
      { name: 'phone', placeholder: 'Phone (optional)', type: 'tel' },
    ],
  },
];

/* ---- offerings ---- */
const OFFERINGS: { title: string; how: string }[] = [
  {
    title: 'Custom Websites',
    how: 'Hand-coded, fast, and unique — your sharpest first impression, built to look nothing like a template.',
  },
  {
    title: 'Web Apps',
    how: 'Booking, portals, and dashboards that do real work — the back office your brand actually runs on.',
  },
  {
    title: 'E-Commerce',
    how: 'An online store engineered to convert, not just exist — every screen earns the next click.',
  },
  {
    title: 'Custom Software',
    how: 'CRMs and internal tools shaped to how you operate — the back office fitted to your workflow.',
  },
  {
    title: 'Automation & AI',
    how: 'Kill the busywork — let software handle the repetitive parts so your team ships the real work.',
  },
  {
    title: 'SEO & Speed',
    how: 'Core Web Vitals and clean structure so you get found and stay fast — a first impression that loads instantly.',
  },
];

/* ---- proof of work ---- */
type Proof = {
  name: string;
  tag: string;
  videoId: string;
  href: string;
  time?: string;
};
const PROOF: Proof[] = [
  { name: 'MC Racing', tag: 'mcracingfortwayne.com', videoId: '1ab82de79e003fc0c37afc0a27fedbc4', href: '/work/web-mcracing' },
  { name: 'Prime Dealer Fund', tag: 'primedealerfund.com', videoId: '652911e44eafee84d9efa47dad31eac5', href: '/work/web-primedealerfund' },
  { name: 'Creator Space', tag: 'creatorspacefw.com', videoId: '37a027a19196653d4ef79b6c2f5f5758', href: '/work/web-creatorspace' },
  { name: 'MindSquire', tag: 'mindsquire.com', videoId: '4db4384638b438d0f2c3fb9b60a48606', href: '/work/web-mindsquire' },
  { name: 'Industrial Bakery', tag: 'industrialbakeryequipment.com', videoId: '33850e02411be4ba7cb880ef7af52dce', href: '/work/web-industrialbakery' },
  { name: 'Sweet Dreams', tag: 'sweetdreams.us', videoId: '2e09ff39e945e08cf28ced40197bf836', href: '/work/web-sweetdreams' },
];

export default function WebSoftwareLanding() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // mark ready so CSS knows JS is driving
      root.current?.classList.add(styles.isReady);

      if (prefersReduced) {
        gsap.set(`.${styles.reveal}`, { opacity: 1, y: 0 });
        return;
      }

      // Hero: staggered load-in
      gsap.from(`.${styles.heroTag}`, { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out' });
      gsap.from(`.${styles.heroTitle}`, { y: 40, opacity: 0, duration: 0.8, delay: 0.08, ease: 'power3.out' });
      gsap.from(`.${styles.heroSub}`, { y: 28, opacity: 0, duration: 0.7, delay: 0.2, ease: 'power3.out' });
      gsap.from(`.${styles.ctaRow}`, { y: 24, opacity: 0, duration: 0.7, delay: 0.32, ease: 'power3.out' });
      gsap.from(`.${styles.offerStrip}`, { y: 24, opacity: 0, duration: 0.7, delay: 0.44, ease: 'power3.out' });

      // Parallax drift on the big background word
      gsap.to(`.${styles.bgWord}`, {
        yPercent: 22,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });

      // Generic reveal-on-scroll for anything tagged .reveal
      gsap.utils.toArray<HTMLElement>(`.${styles.reveal}`).forEach((el) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          }
        );
      });

      // Offering cards — staggered rise
      gsap.from(`.${styles.offerCard}`, {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.offerGrid}`, start: 'top 78%' },
      });

      // Browser mockups — scale + slide in as they enter
      gsap.utils.toArray<HTMLElement>(`.${styles.browser}`).forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 70, scale: 0.94, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            delay: (i % 2) * 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={styles.page}>
      <div className={styles.topRule} />
      <div className={styles.bgWord} aria-hidden="true">
        WEB
      </div>

      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.shell}>
          <span className={styles.heroTag}>
            <span className={styles.dotLive} />
            Web &amp; Software — Fort Wayne
          </span>

          <h1 className={styles.heroTitle}>
            We build the <span className={styles.hl}>site</span> before you pay a
            dollar.
          </h1>

          <p className={styles.heroSub}>
            Tell us about your business and we hand-code a{' '}
            <b>real, clickable spec website</b> — then send you the live link.{' '}
            <b>Professional photo and video of your business come with the finished
            product.</b> Your sharpest first impression and your back office, engineered
            to fit.
          </p>

          <div className={styles.ctaRow}>
            <a href="#start" className={styles.ctaPrimary}>
              Build mine free <span className={styles.arrow}>→</span>
            </a>
            <a href="#proof" className={styles.ctaSecondary}>
              See real builds
            </a>
          </div>

          <div className={styles.offerStrip}>
            <span className={styles.offerStripLabel}>Free spec website</span>
            <span className={styles.offerStripText}>
              A live, clickable site built for <b>your</b> business before any invoice.
              If you love it, we finish it — <b>pro photo &amp; video included</b>. No
              deposit, no risk.
            </span>
          </div>
        </div>
      </section>

      {/* ============ OFFERINGS ============ */}
      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={`${styles.sectionHead} ${styles.reveal}`}>
            <span className={styles.sectionIndex}>01 / Build</span>
            <h2 className={styles.sectionTitle}>
              What we <span className={styles.hl}>engineer</span>
            </h2>
            <p className={styles.sectionLede}>
              Every layer of your digital presence, hand-built to be your sharpest first
              impression and back office — never a template, never bloated.
            </p>
          </div>

          <div className={styles.offerGrid}>
            {OFFERINGS.map((o, i) => (
              <article className={styles.offerCard} key={o.title}>
                <span className={styles.offerNum}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.offerTitle}>{o.title}</h3>
                <p className={styles.offerHow}>{o.how}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROOF ============ */}
      <section className={styles.section} id="proof">
        <div className={styles.shell}>
          <div className={`${styles.sectionHead} ${styles.reveal}`}>
            <span className={styles.sectionIndex}>02 / Proof</span>
            <h2 className={styles.sectionTitle}>
              Real sites, <span className={styles.hl}>live</span> today
            </h2>
            <p className={styles.sectionLede}>
              Not mockups — shipped, clickable builds for real Fort Wayne businesses.
              Tap any window to open the case study.
            </p>
          </div>

          <div className={styles.proofGrid}>
            {PROOF.map((p, i) => {
              const isFeature = i === 0;
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  className={`${styles.browser} ${isFeature ? styles.proofFeature : ''}`}
                >
                  <div className={styles.browserBar}>
                    <div className={styles.dots}>
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className={styles.urlBar}>
                      <span className={styles.urlLock}>▲</span>
                      <span className={styles.urlText}>https://{p.tag}</span>
                    </div>
                  </div>

                  <div className={styles.screenWrap}>
                    {isFeature ? (
                      // hero clip autoplays muted/looping (HLS via hls.js)
                      <FunnelReel videoId={p.videoId} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className={styles.screenShot}
                        src={poster(p.videoId, p.time ?? '1s')}
                        alt={`${p.name} — ${p.tag}`}
                        loading="lazy"
                      />
                    )}
                  </div>

                  <div className={styles.proofMeta}>
                    <div>
                      <p className={styles.proofName}>{p.name}</p>
                      <p className={styles.proofUrl}>{p.tag}</p>
                    </div>
                    <span className={styles.proofVisit}>
                      View build <span className={styles.arrow}>↗</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CAPTURE FORM ============ */}
      <section className={styles.formSection} id="start">
        <div className={styles.shell}>
          <div className={styles.formWrap}>
            <div className={`${styles.formPitch} ${styles.reveal}`}>
              <p className={styles.formEyebrow}>03 / Start free</p>
              <h2 className={styles.formTitle}>
                Get your <span className={styles.hl}>spec site</span> built.
              </h2>
              <p className={styles.formBlurb}>
                Three quick questions. We build a real, clickable site for your business
                and send the live link — media included — before you spend a dollar.
              </p>
              <ul className={styles.checkList}>
                <li className={styles.checkItem}>
                  <span className={styles.checkMark}>✓</span>
                  A real, clickable spec site — not a mockup
                </li>
                <li className={styles.checkItem}>
                  <span className={styles.checkMark}>✓</span>
                  Professional photo &amp; video of your business, included
                </li>
                <li className={styles.checkItem}>
                  <span className={styles.checkMark}>✓</span>
                  See it live first — pay only if you love it
                </li>
              </ul>
            </div>

            <div className={styles.reveal}>
              <FunnelForm
                funnel="web-software"
                steps={steps}
                successTitle="You're in."
                successBody="We'll build a real, clickable spec site — media included — and send you the live link."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ CLOSING ============ */}
      <section className={styles.closing}>
        <div className={styles.shell}>
          <h2 className={styles.closingLine}>
            See it live <span className={styles.hl}>before</span> you pay.
          </h2>
          <a href="#start" className={styles.closingCta}>
            Build mine free <span className={styles.arrow}>→</span>
          </a>
          <p className={styles.closingFine}>
            Sweet Dreams Solutions — hand-coded in Fort Wayne, Indiana.
          </p>
        </div>
      </section>
    </div>
  );
}
