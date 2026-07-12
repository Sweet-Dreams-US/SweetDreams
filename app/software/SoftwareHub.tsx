'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebsiteShowcase from '@/components/web/WebsiteShowcase';
import TopOfferBar from '@/components/TopOfferBar';
import styles from './software.module.css';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/* ---------- Phase 1: real builds shown as smart-video previews ---------- */
const BUILDS = [
  { videoId: '1ab82de79e003fc0c37afc0a27fedbc4', name: 'MC Racing' },
  { videoId: '652911e44eafee84d9efa47dad31eac5', name: 'Prime Dealer Fund' },
  { videoId: '37a027a19196653d4ef79b6c2f5f5758', name: 'Creator Space' },
  { videoId: '4db4384638b438d0f2c3fb9b60a48606', name: 'MindSquire' },
  { videoId: '33850e02411be4ba7cb880ef7af52dce', name: 'Industrial Bakery' },
  { videoId: 'a7969078d27d7d15394978d0c02cc306', name: 'Bite Me Protein' },
  { videoId: 'abc316f410b475f978ab9322b033add6', name: 'Ace Gameroom' },
  { videoId: 'bc21e8ee97ddda1e531072021685955a', name: 'Hot Chicks' },
];

const VALUES = [
  { name: 'Hand-coded', how: 'No templates, no page-builders. Built line by line to load fast and rank higher.' },
  { name: 'Funnel-built', how: 'Every page is engineered to turn a visitor into a booked, qualified lead.' },
  { name: 'SEO from day one', how: 'Structured, fast, and built to be found on Google in your city.' },
  { name: 'Media included', how: 'Pro photo + video, shot for your brand and baked right into the site.' },
  { name: 'Yours to keep', how: 'Your brand, your domain, your code, never held hostage.' },
  { name: 'Managed hosting', how: 'Fast, secure, and monitored. One flat monthly fee, nothing to babysit.' },
];

/* ---------- Phase 2: Dream Suite capability groups ---------- */
const CAPS: { group: string; items: string[] }[] = [
  { group: 'Run', items: ['Bookings', 'Availability', 'Customers', 'Inquiries', 'POS'] },
  { group: 'Money', items: ['Transactions', 'Expenses', 'Payouts', 'Accounting', 'Payroll'] },
  { group: 'Grow', items: ['Email Marketing', 'Ads', 'Reports'] },
];

/* ---------- Phase 2: dashboard mockup data ---------- */
const STAT_CARDS = [
  { label: 'Revenue · 30d', value: '$48,250', delta: '+12.4%', down: false },
  { label: 'Bookings', value: '128', delta: '+8 this week', down: false },
  { label: 'New Customers', value: '34', delta: '+5 this week', down: false },
  { label: 'Payouts', value: '$12,400', delta: '→ Cleared', down: true },
];

const CHART = [46, 58, 52, 70, 63, 82, 74];
const CHART_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const CHART_PEAK = Math.max(...CHART);

const TXNS = [
  { name: 'Marcus Reed', service: 'Studio Session · 2h', amt: '$240', status: 'Paid', pending: false },
  { name: 'Bite Me Protein', service: 'Wholesale Order', amt: '$1,180', status: 'Paid', pending: false },
  { name: 'Ava Coleman', service: 'Brand Consultation', amt: '$150', status: 'Pending', pending: true },
];

/* ---------- Phase 3: pipeline nodes (coords in the 1000x320 viewBox) ---------- */
type PNode = { cx: number; cy: number; label: string; labelY: number; hub?: boolean };
const PNODES: PNode[] = [
  { cx: 60, cy: 210, label: 'INQUIRIES', labelY: 252 },
  { cx: 207, cy: 110, label: 'BOOKINGS', labelY: 72 },
  { cx: 353, cy: 210, label: 'PAYMENTS', labelY: 252 },
  { cx: 500, cy: 110, label: 'AI CORE', labelY: 62, hub: true },
  { cx: 647, cy: 210, label: 'EMAIL + ADS', labelY: 252 },
  { cx: 793, cy: 110, label: 'PAYOUTS', labelY: 72 },
  { cx: 940, cy: 210, label: 'REPORTS', labelY: 252 },
];
const PIPE_D =
  'M60 210 C133.5 210, 133.5 110, 207 110 ' +
  'C280.5 110, 279.5 210, 353 210 ' +
  'C426.5 210, 426.5 110, 500 110 ' +
  'C573.5 110, 573.5 210, 647 210 ' +
  'C720.5 210, 720.5 110, 793 110 ' +
  'C866.5 110, 866.5 210, 940 210';

/* ---------- Phase 3: count-up stats ---------- */
const BIG_STATS: {
  to?: number;
  prefix?: string;
  unit?: string;
  staticNum?: string;
  staticUnit?: string;
  label: string;
}[] = [
  { to: 3, unit: '×', label: 'More output from the same team, the work runs on rails, not on people.' },
  { prefix: '−', to: 40, unit: '%', label: 'Less busywork, the manual steps between your tools simply disappear.' },
  { staticNum: '24', staticUnit: '/7', label: 'Always on. Sales, research, and operations keep moving overnight.' },
];

export default function SoftwareHub() {
  const root = useRef<HTMLDivElement>(null);
  const pipePath = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const nodeEls = gsap.utils.toArray<SVGGElement>('[data-pnode]');

      if (reduce) {
        // Everything visible, pipeline fully drawn, all nodes lit.
        const path = pipePath.current;
        if (path) {
          path.style.strokeDasharray = 'none';
          path.style.strokeDashoffset = '0';
        }
        nodeEls.forEach((el) => el.classList.add(styles.pnodeOn));
        return;
      }

      // Hero entrance
      gsap.from('[data-hero] > *', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power3.out',
      });

      // Background word parallax
      gsap.to('[data-bgword]', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      // Generic reveals
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 44,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%' },
        });
      });

      // Staggered groups
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        gsap.from(group.children, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 84%' },
        });
      });

      // Dashboard bars grow
      gsap.from('[data-bar]', {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-chart]', start: 'top 82%' },
      });

      // ---- Self-drawing AI pipeline + node lighting ----
      const path = pipePath.current;
      if (path && nodeEls.length) {
        const total = path.getTotalLength();

        // Fraction of total length at which each node sits.
        const fracs = nodeEls.map((el) => {
          const cx = Number(el.dataset.cx);
          const cy = Number(el.dataset.cy);
          let best = Infinity;
          let bestLen = 0;
          const samples = 500;
          for (let s = 0; s <= samples; s++) {
            const l = (total * s) / samples;
            const pt = path.getPointAtLength(l);
            const d = (pt.x - cx) ** 2 + (pt.y - cy) ** 2;
            if (d < best) {
              best = d;
              bestLen = l;
            }
          }
          return bestLen / total;
        });

        path.style.strokeDasharray = `${total}`;
        path.style.strokeDashoffset = `${total}`;

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-pipe]',
            start: 'top 74%',
            end: 'bottom 62%',
            scrub: 0.6,
            onUpdate: (self) => {
              const p = self.progress;
              nodeEls.forEach((el, i) => {
                el.classList.toggle(styles.pnodeOn, p >= fracs[i] - 0.02);
              });
            },
          },
        });
      }

      // ---- Count-up stats ----
      const counters =
        root.current?.querySelectorAll<HTMLElement>('[data-count]') ?? [];
      counters.forEach((el) => {
        const to = Number(el.dataset.count ?? '0');
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toString();
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

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
              We build your website, then the system that{' '}
              <span className={styles.hl}>runs your business</span>.
            </h1>
            <p className={styles.subhead}>
              It starts with a website that actually sells. Then it grows into{' '}
              <b>Dream Suite</b>, the operations platform living in your own
              backend, and finally into <b>AI automations</b> that run the
              pipelines for you. One ladder, one system, built to compound.
            </p>

            <div className={styles.ctaRow}>
              <a href="#phases" className={styles.ctaPrimary}>
                See the 3 phases
                <span className={styles.ctaArrow}>↓</span>
              </a>
              <Link href="/book" className={styles.ctaSecondary}>
                Book a call
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* 3-step progress rail */}
            <nav className={styles.rail} id="phases" aria-label="The three phases">
              <div className={styles.railInner}>
                <a href="#websites" className={styles.railStep}>
                  <span className={styles.railArrow} aria-hidden="true">↘</span>
                  <span className={styles.railNum}>01</span>
                  <p className={styles.railLabel}>Websites</p>
                  <p className={styles.railHint}>A site that sells, media included.</p>
                </a>
                <a href="#dream-suite" className={styles.railStep}>
                  <span className={styles.railArrow} aria-hidden="true">↘</span>
                  <span className={styles.railNum}>02</span>
                  <p className={styles.railLabel}>Dream Suite</p>
                  <p className={styles.railHint}>The system that runs the business.</p>
                </a>
                <a href="#automations" className={styles.railStep}>
                  <span className={styles.railArrow} aria-hidden="true">↘</span>
                  <span className={styles.railNum}>03</span>
                  <p className={styles.railLabel}>Automations</p>
                  <p className={styles.railHint}>AI that runs it all for you.</p>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* ==================== PHASE 1, WEBSITES ==================== */}
      <section className={styles.section} id="websites">
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              Phase 01, Websites
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

          {/* Hand-off into phase 2 */}
          <div className={styles.handoff} data-reveal>
            <span className={styles.handoffArrow} aria-hidden="true">→</span>
            <p className={styles.handoffText}>
              Then it grows into <span className={styles.hl}>Dream Suite</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ================== PHASE 2, DREAM SUITE ================== */}
      <section className={styles.suiteStage} id="dream-suite">
        <div className={styles.suiteGlow} aria-hidden="true" />
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              Phase 02, Dream Suite
            </p>
            <h2 className={styles.sectionTitle}>
              The system that <span className={styles.hl}>runs</span> your business.
            </h2>
            <p className={styles.sectionLede}>
              Dream Suite lives in the backend of your own site, one login to run
              the whole operation. Bookings, customers, money, and marketing, all
              under your brand, all in one place.
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

          {/* -------- Styled dashboard mockup -------- */}
          <div className={styles.mockup} data-reveal>
            <div className={styles.chrome}>
              <div className={styles.chromeDots} aria-hidden="true">
                <span className={`${styles.chromeDot} ${styles.chromeDotR}`} />
                <span className={`${styles.chromeDot} ${styles.chromeDotY}`} />
                <span className={`${styles.chromeDot} ${styles.chromeDotG}`} />
              </div>
              <div className={styles.chromeBar}>
                <span className={styles.chromeLock} aria-hidden="true">🔒</span>
                <span className={styles.chromeUrl}>
                  <b>yourbusiness.com</b>/suite/overview
                </span>
              </div>
            </div>

            <div className={styles.dash}>
              {/* sidebar */}
              <aside className={styles.side} aria-hidden="true">
                <div className={styles.sideBrand}>
                  <span className={styles.sideLogo}>D</span>
                  <span className={styles.sideBrandName}>Dream Suite</span>
                </div>

                <div className={styles.sideGroup}>
                  <div className={`${styles.sideItem} ${styles.sideItemActive}`}>
                    <span className={styles.sideBullet} />
                    Overview
                  </div>
                </div>

                <div className={styles.sideGroup}>
                  <p className={styles.sideGroupLabel}>Run</p>
                  {['Bookings', 'Customers', 'Inquiries', 'POS'].map((i) => (
                    <div className={styles.sideItem} key={i}>
                      <span className={styles.sideBullet} />
                      {i}
                    </div>
                  ))}
                </div>

                <div className={styles.sideGroup}>
                  <p className={styles.sideGroupLabel}>Money</p>
                  {['Transactions', 'Payouts', 'Accounting'].map((i) => (
                    <div className={styles.sideItem} key={i}>
                      <span className={styles.sideBullet} />
                      {i}
                    </div>
                  ))}
                </div>

                <div className={styles.sideGroup}>
                  <p className={styles.sideGroupLabel}>Grow</p>
                  {['Email Marketing', 'Ads', 'Reports'].map((i) => (
                    <div className={styles.sideItem} key={i}>
                      <span className={styles.sideBullet} />
                      {i}
                    </div>
                  ))}
                </div>
              </aside>

              {/* main panel */}
              <div className={styles.panel}>
                <div className={styles.panelBar}>
                  <span className={styles.panelTitle}>Overview</span>
                  <div className={styles.panelBarRight}>
                    <span className={styles.panelPill}>Last 30 days</span>
                    <span className={styles.panelAvatar} aria-hidden="true">SD</span>
                  </div>
                </div>

                <div className={styles.statRow}>
                  {STAT_CARDS.map((s) => (
                    <div className={styles.statCard} key={s.label}>
                      <div className={styles.statLabel}>{s.label}</div>
                      <div className={styles.statValue}>{s.value}</div>
                      <div
                        className={`${styles.statDelta} ${
                          s.down ? styles.statDeltaDown : ''
                        }`}
                      >
                        {s.delta}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.panelLower}>
                  {/* bar chart */}
                  <div className={styles.card}>
                    <div className={styles.cardHead}>
                      <span className={styles.cardTitle}>Revenue · last 7 days</span>
                      <span className={styles.cardNote}>▲ 18%</span>
                    </div>
                    <div className={styles.chart} data-chart>
                      {CHART.map((h, i) => (
                        <div className={styles.bar} key={i}>
                          <span
                            className={`${styles.barFill} ${
                              h === CHART_PEAK ? styles.barPeak : ''
                            }`}
                            style={{ height: `${h}%` }}
                            data-bar
                          />
                          <span className={styles.barLabel}>{CHART_DAYS[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* transactions */}
                  <div className={styles.card}>
                    <div className={styles.cardHead}>
                      <span className={styles.cardTitle}>Recent transactions</span>
                    </div>
                    {TXNS.map((t) => (
                      <div className={styles.tRow} key={t.name}>
                        <div>
                          <div className={styles.tName}>{t.name}</div>
                          <div className={styles.tService}>{t.service}</div>
                        </div>
                        <div className={styles.tAmt}>{t.amt}</div>
                        <span
                          className={`${styles.tStatus} ${
                            t.pending ? styles.tPending : styles.tPaid
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ownership + CTA */}
          <div className={styles.ownRow} data-reveal>
            <div>
              <p className={styles.ownTitle}>
                You own it, your <span className={styles.hl}>brand</span>, your{' '}
                <span className={styles.hl}>domain</span>, your{' '}
                <span className={styles.hl}>data</span>.
              </p>
              <p className={styles.ownSub}>
                No rented dashboards, no data held hostage. Dream Suite is built
                into the software you already own, so the whole operation stays
                yours.
              </p>
            </div>
            <Link href="/free-software" className={styles.ctaOnDark}>
              See a live demo built on your business
              <span className={styles.ctaArrow}>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ PHASE 3, AI POWERED AUTOMATIONS ============ */}
      <section className={styles.autoStage} id="automations">
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              Phase 03, AI Powered Business Automations
            </p>
            <h2 className={styles.sectionTitle}>
              Your systems, <span className={styles.hl}>running themselves</span>.
            </h2>
            <p className={styles.sectionLede}>
              Every module from Dream Suite, wired together by AI. An inquiry
              becomes a booking, a booking becomes a payment, a payment triggers
              the follow up. Sales, research, and operations run with fewer
              people in the loop.
            </p>
          </div>

          {/* Self-drawing SVG pipeline */}
          <div className={styles.pipeWrap} data-pipe>
            <svg
              className={styles.pipe}
              viewBox="0 0 1000 320"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="AI pipeline connecting Dream Suite modules"
            >
              <path className={styles.pipeTrack} d={PIPE_D} />
              <path ref={pipePath} className={styles.pipeDraw} d={PIPE_D} />

              {PNODES.map((n) => (
                <g
                  key={n.label}
                  className={n.hub ? styles.pnodeHub : undefined}
                  data-pnode
                  data-cx={n.cx}
                  data-cy={n.cy}
                >
                  <circle
                    className={styles.pnodeRing}
                    cx={n.cx}
                    cy={n.cy}
                    r={n.hub ? 22 : 14}
                  />
                  <circle
                    className={styles.pnodeCore}
                    cx={n.cx}
                    cy={n.cy}
                    r={n.hub ? 8 : 5}
                  />
                  <text
                    className={n.hub ? styles.pnodeLabelHub : styles.pnodeLabel}
                    x={n.cx}
                    y={n.labelY}
                    textAnchor="middle"
                  >
                    {n.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Count-up stats */}
          <div className={styles.statBar}>
            {BIG_STATS.map((s, i) => (
              <div className={styles.bigStat} key={i} data-reveal>
                <div className={styles.bigStatNum}>
                  {s.prefix}
                  {s.staticNum ? (
                    <>
                      {s.staticNum}
                      <span className={styles.unit}>{s.staticUnit}</span>
                    </>
                  ) : (
                    <>
                      <span data-count={s.to}>{s.to}</span>
                      <span className={styles.unit}>{s.unit}</span>
                    </>
                  )}
                </div>
                <p className={styles.bigStatLabel}>{s.label}</p>
              </div>
            ))}
          </div>

          <p className={styles.autoCopy} data-reveal>
            Your systems, running themselves, sales, research, and{' '}
            <span className={styles.hl}>operations with fewer people</span>.
          </p>
        </div>
      </section>

      {/* ======================== CLOSING ======================== */}
      <section className={styles.closing}>
        <div className={styles.closingGlow} aria-hidden="true" />
        <div className={styles.wrap}>
          <p className={styles.closingKicker} data-reveal>
            One ladder. One system.
          </p>
          <h2 className={styles.closingLine} data-reveal>
            Start with a website. Grow into the{' '}
            <span className={styles.hl}>whole system</span>.
          </h2>
          <p className={styles.closingSub} data-reveal>
            We build the site that sells, plug in the platform that runs the
            business, then let AI run the pipelines. Let&apos;s map your first
            phase.
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
