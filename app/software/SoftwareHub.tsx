'use client';

import { useRef } from 'react';
import Link from 'next/link';
import WebsiteShowcase from '@/components/web/WebsiteShowcase';
import TopOfferBar from '@/components/TopOfferBar';
import PlatformMockup from '@/components/software/PlatformMockup';
import AiPipeline from '@/components/software/AiPipeline';
import BigStats from '@/components/software/BigStats';
import { useReveals } from '@/components/software/useReveals';
import { BUILDS, VALUES, CAPS } from './data';
import styles from './software.module.css';

export default function SoftwareHub() {
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

      {/* Contained ghost word */}
      <span className={styles.bgWord} data-bgword aria-hidden="true">
        SOFTWARE
      </span>

      {/* Masthead */}
      <div className={styles.wrap}>
        <div className={styles.masthead}>
          <span className={styles.mastheadMark}>Sweet Dreams, Software</span>
          <span className={styles.mastheadNote}>Software / Fort Wayne</span>
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
              Software, Fort Wayne
            </p>
            <h1 className={styles.headline}>
              We build your website, then we put{' '}
              <span className={styles.hl}>AI to work</span>.
            </h1>
            <p className={styles.subhead}>
              Two things run a modern business: a website that actually{' '}
              <b>sells</b>, and <b>AI</b> that handles the busywork behind it. We
              build the site first, then teach your team and build the AI
              workflows that fit how you work. One team, both.
            </p>

            <div className={styles.ctaRow}>
              <a href="#websites" className={styles.ctaPrimary}>
                See how it works
                <span className={styles.ctaArrow}>↓</span>
              </a>
              <Link href="/book" className={styles.ctaSecondary}>
                Book a call
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* 2-part progress rail */}
            <nav className={styles.rail} id="start" aria-label="What we build">
              <div className={styles.railInner}>
                <a href="#websites" className={styles.railStep}>
                  <span className={styles.railArrow} aria-hidden="true">↘</span>
                  <span className={styles.railNum}>01</span>
                  <p className={styles.railLabel}>Websites</p>
                  <p className={styles.railHint}>A site that sells, media included.</p>
                </a>
                <a href="#ai" className={styles.railStep}>
                  <span className={styles.railArrow} aria-hidden="true">↘</span>
                  <span className={styles.railNum}>02</span>
                  <p className={styles.railLabel}>AI Workflows</p>
                  <p className={styles.railHint}>Put AI to work on the busywork.</p>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* ======================== WEBSITES ======================== */}
      <section className={styles.section} id="websites">
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              Websites
            </p>
            <h2 className={styles.sectionTitle}>
              A website that sells, <span className={styles.hl}>media included</span>.
            </h2>
            <p className={styles.sectionLede}>
              Your foundation. A premium, hand built brand site with a built in
              funnel, real SEO, and professional photo and video, engineered to
              turn attention into booked business from the day it launches.
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

          {/* Real builds, smart-video previews (name only, no link) */}
          <div className={styles.showcaseHost} data-reveal>
            <WebsiteShowcase projects={BUILDS} />
          </div>

          {/* Deep-dive link */}
          <Link href="/websites" className={styles.handoff} data-reveal>
            <span className={styles.handoffArrow} aria-hidden="true">→</span>
            <p className={styles.handoffText}>
              See how we <span className={styles.hl}>build websites</span>
            </p>
          </Link>
        </div>
      </section>

      {/* ===================== AI WORKFLOWS ====================== */}
      <section className={styles.autoStage} id="ai">
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              AI Workflows
            </p>
            <h2 className={styles.sectionTitle}>
              We put <span className={styles.hl}>AI to work</span> in your business.
            </h2>
            <p className={styles.sectionLede}>
              We work hands on with your team, teach them to use AI, then build
              the workflows that fit how you actually work, day to day, so the
              busywork runs itself. Start with a few hours and scale as it pays
              off. Your team owns every workflow we build.
            </p>
          </div>

          <AiPipeline />
          <BigStats />

          <p className={styles.autoCopy} data-reveal>
            Built with your team, not around them, the AI workflows that fit{' '}
            <span className={styles.hl}>how you actually work</span>.
          </p>

          <Link href="/ai" className={styles.handoff} data-reveal>
            <span className={styles.handoffArrow} aria-hidden="true">→</span>
            <p className={styles.handoffText}>
              Explore <span className={styles.hl}>AI Workflows</span>
            </p>
          </Link>
        </div>
      </section>

      {/* ================= THE SYSTEM BEHIND IT ================= */}
      <section className={styles.suiteStage} id="systems">
        <div className={styles.suiteGlow} aria-hidden="true" />
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              The system behind it
            </p>
            <h2 className={styles.sectionTitle}>
              We build the <span className={styles.hl}>system</span> that runs it.
            </h2>
            <p className={styles.sectionLede}>
              To run all of this, we build the operations system behind your own
              site. Bookings, customers, money, and marketing, all under your
              brand, in one place. You never manage it as a separate product, it
              is simply how your business runs.
            </p>
          </div>

          {/* Grouped capabilities: RUN / MONEY / GROW */}
          <div className={styles.capGrid} data-stagger>
            {CAPS.map((c) => (
              <div className={styles.capCol} key={c.group}>
                <div className={styles.capHead}>
                  <span className={styles.capDot} />
                  <p className={styles.capTitle}>{c.group}</p>
                </div>
                <ul className={styles.capList}>
                  {c.items.map((it) => (
                    <li className={styles.capRow} key={it}>
                      <span className={styles.capTick} aria-hidden="true">▸</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <PlatformMockup brand="Operations" />

          {/* Ownership + CTA */}
          <div className={styles.ownRow} data-reveal>
            <div>
              <p className={styles.ownTitle}>
                You own it, your <span className={styles.hl}>brand</span>, your{' '}
                <span className={styles.hl}>domain</span>, your{' '}
                <span className={styles.hl}>data</span>.
              </p>
              <p className={styles.ownSub}>
                No rented dashboards, no data held hostage. It is built into the
                software you already own, so the whole operation stays yours.
              </p>
            </div>
            <Link href="/free-software" className={styles.ctaOnDark}>
              See a live demo built on your business
              <span className={styles.ctaArrow}>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================== CLOSING ======================== */}
      <section className={styles.closing}>
        <div className={styles.closingGlow} aria-hidden="true" />
        <div className={styles.wrap}>
          <p className={styles.closingKicker} data-reveal>
            Two products. One team.
          </p>
          <h2 className={styles.closingLine} data-reveal>
            A site that sells. AI that does the{' '}
            <span className={styles.hl}>busywork</span>.
          </h2>
          <p className={styles.closingSub} data-reveal>
            We build the website that brings the business in, then put AI to work
            on everything behind it. Let&apos;s map where to start.
          </p>
          <div className={styles.closingCtas} data-reveal>
            <Link href="/book" className={styles.ctaLight}>
              Book a call
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <Link href="/free-software" className={styles.ctaGhost}>
              See a live demo
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
