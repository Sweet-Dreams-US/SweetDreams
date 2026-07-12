'use client';

import { useRef } from 'react';
import Link from 'next/link';
import WebsiteShowcase from '@/components/web/WebsiteShowcase';
import TopOfferBar from '@/components/TopOfferBar';
import { useReveals } from '@/components/software/useReveals';
import { BUILDS } from '@/app/software/data';
import styles from '@/app/software/software.module.css';

/* Why it stands out — creative and media forward, we are a media company first. */
const WHY = [
  {
    name: 'Hand coded',
    how: 'Custom from scratch, no templates and no page builders. It looks like nothing else on the internet.',
  },
  {
    name: 'Media included',
    how: 'Pro photo and video, shot for your brand and built right in. We are a media company first.',
  },
  {
    name: 'Designed to stand out',
    how: 'Bold and art directed, built to be remembered, not another look alike template site.',
  },
  {
    name: 'Motion and cinema',
    how: 'Animation, video, and interaction that make people stop scrolling and feel the brand.',
  },
  {
    name: 'Yours to keep',
    how: 'Your brand, your domain, your code, never held hostage.',
  },
  {
    name: 'Fast and found',
    how: 'Hand coded to load fast and still rank in your city on Google.',
  },
];

/* How it works — the free spec build, with our media team on it. */
const STEPS = [
  {
    name: 'Built before you pay',
    how: 'We research your business and design a real demo on your brand first. You see it live before you spend a dollar.',
  },
  {
    name: 'Shot for your brand',
    how: 'Our media team captures the photo and video, so the site is built on real footage of you, not stock.',
  },
  {
    name: 'Launched and yours',
    how: 'Hand coded, fast, and cared for on managed hosting. Your brand, your code, yours to keep.',
  },
];

export default function Websites() {
  const root = useRef<HTMLDivElement>(null);
  useReveals(root);

  return (
    <div ref={root} className={styles.page}>
      <TopOfferBar
        tone="blue"
        label="Website"
        sub="Built before you pay a dollar"
        href="/free-website"
      />

      <span className={styles.bgWord} data-bgword aria-hidden="true">
        WEBSITES
      </span>

      <div className={styles.wrap}>
        <div className={styles.masthead}>
          <span className={styles.mastheadMark}>Sweet Dreams, Websites</span>
          <span className={styles.mastheadNote}>Websites / Fort Wayne</span>
        </div>
        <div className={styles.rule} />
      </div>

      {/* ============================ HERO ============================ */}
      <header className={styles.hero}>
        <div className={styles.heroWash} aria-hidden="true" />
        <div className={styles.wrap}>
          <div className={styles.heroInner} data-hero>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              Websites, Fort Wayne
            </p>
            <h1 className={styles.headline}>
              Websites that <span className={styles.hl}>stand out</span>.
            </h1>
            <p className={styles.subhead}>
              You are a brand worth looking at. We hand code websites that look
              like it: custom design, cinematic photo and video, and motion that
              makes people stop. Shot and built by a media company, and{' '}
              <b>built before you pay a dollar</b>.
            </p>

            <div className={styles.ctaRow}>
              <Link href="/free-website" className={styles.ctaPrimary}>
                Get your free build
                <span className={styles.ctaArrow}>→</span>
              </Link>
              <Link href="/book" className={styles.ctaSecondary}>
                Book a call
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== WHY IT STANDS OUT ===================== */}
      <section className={styles.section} id="why">
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              Why it stands out
            </p>
            <h2 className={styles.sectionTitle}>
              Not a template. A <span className={styles.hl}>statement</span>.
            </h2>
            <p className={styles.sectionLede}>
              We are a media company that builds websites, so yours comes with
              real photo and video and a design made to be remembered. Every site
              is hand coded from scratch, so it can look like nothing else.
            </p>
          </div>

          <div className={styles.valueGrid} data-stagger>
            {WHY.map((v, i) => (
              <div className={styles.valueItem} key={v.name}>
                <span className={styles.valueNum}>{String(i + 1).padStart(2, '0')}</span>
                <p className={styles.valueName}>{v.name}</p>
                <p className={styles.valueHow}>{v.how}</p>
              </div>
            ))}
          </div>

          <div className={styles.showcaseHost} data-reveal>
            <WebsiteShowcase projects={BUILDS} />
          </div>
        </div>
      </section>

      {/* ======================= HOW IT WORKS ======================= */}
      <section className={styles.section} id="how" style={{ paddingTop: 0 }}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              How it works
            </p>
            <h2 className={styles.sectionTitle}>
              You see it live <span className={styles.hl}>first</span>.
            </h2>
            <p className={styles.sectionLede}>
              No big deposit to find out what you are getting. We design a real
              demo on your brand, shoot the media, then you decide.
            </p>
          </div>

          <div className={styles.valueGrid} data-stagger>
            {STEPS.map((s, i) => (
              <div className={styles.valueItem} key={s.name}>
                <span className={styles.valueNum}>{String(i + 1).padStart(2, '0')}</span>
                <p className={styles.valueName}>{s.name}</p>
                <p className={styles.valueHow}>{s.how}</p>
              </div>
            ))}
          </div>

          {/* Quiet AI hint, not the focal point */}
          <p className={styles.aiHint} data-reveal>
            Down the line, we also teach teams to put AI to work.{' '}
            <Link href="/ai">Learn about our AI workflows and education →</Link>
          </p>
        </div>
      </section>

      {/* ======================== CLOSING ======================== */}
      <section className={styles.closing}>
        <div className={styles.closingGlow} aria-hidden="true" />
        <div className={styles.wrap}>
          <p className={styles.closingKicker} data-reveal>
            Built before you pay.
          </p>
          <h2 className={styles.closingLine} data-reveal>
            See your new site <span className={styles.hl}>live</span> first.
          </h2>
          <p className={styles.closingSub} data-reveal>
            We research your business, design a real demo on your brand, shoot the
            media, and send you the link. Then you decide.
          </p>
          <div className={styles.closingCtas} data-reveal>
            <Link href="/free-website" className={styles.ctaLight}>
              Get your free build
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <Link href="/book" className={styles.ctaGhost}>
              Book a call
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
