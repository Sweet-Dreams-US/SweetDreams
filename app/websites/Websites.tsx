'use client';

import { useRef } from 'react';
import Link from 'next/link';
import WebsiteShowcase from '@/components/web/WebsiteShowcase';
import TopOfferBar from '@/components/TopOfferBar';
import { useReveals } from '@/components/software/useReveals';
import { BUILDS, VALUES } from '@/app/software/data';
import styles from '@/app/software/software.module.css';

/* How it works — the differentiator up top: we build it before you pay. */
const STEPS = [
  {
    name: 'Built before you pay',
    how: 'We research your business and build a real demo site first. You see it live, on your brand, before you spend a dollar.',
  },
  {
    name: 'Media included',
    how: 'Professional photo and video, shot for your brand and baked straight into the site. No stock, no filler.',
  },
  {
    name: 'Launched and yours',
    how: 'Hand coded to load fast and rank in your city, managed for one flat monthly fee, and yours to keep, code and all.',
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
              Websites that <span className={styles.hl}>sell</span>.
            </h1>
            <p className={styles.subhead}>
              A premium, hand coded brand site with a built in funnel, real SEO,
              and professional photo and video included. Engineered to turn
              attention into booked business, and <b>built before you pay a
              dollar</b>.
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

      {/* ======================= WHY IT SELLS ======================= */}
      <section className={styles.section} id="why">
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              Why it sells
            </p>
            <h2 className={styles.sectionTitle}>
              Not a template. A <span className={styles.hl}>selling machine</span>.
            </h2>
            <p className={styles.sectionLede}>
              Every site is hand built from scratch, funnel first, so it does one
              job well: turn the people who find you into booked, qualified leads.
            </p>
          </div>

          <div className={styles.valueGrid} data-stagger>
            {VALUES.map((v, i) => (
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
              No big deposit to find out what you are getting. We build a real
              demo on your business, then you decide.
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
            We research your business, build a real demo on your brand, and send
            you the link. Then you decide.
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
