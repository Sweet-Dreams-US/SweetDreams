'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/software/software.module.css';
import { STAT_CARDS, CHART, CHART_DAYS, CHART_PEAK, TXNS } from '@/app/software/data';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type PlatformMockupProps = {
  /** Sidebar brand name. Neutral by default — the platform is never named to the client. */
  brand?: string;
  /** Single-letter mark in the sidebar logo. Defaults to the brand's first letter. */
  mark?: string;
  /** URL shown in the browser chrome. */
  url?: string;
};

/**
 * The dark, browser-chrome-framed operations dashboard. Pure visual proof of
 * "the kind of system we build to run your business behind the scenes." It is
 * deliberately unnamed. Carries its own dark tokens (see `.mockup` in the CSS)
 * so it renders correctly anywhere inside a `.page`, and animates its own bar
 * chart on scroll.
 */
export default function PlatformMockup({
  brand = 'Operations',
  mark,
  url = 'yourbusiness.com/app/overview',
}: PlatformMockupProps) {
  const root = useRef<HTMLDivElement>(null);
  const logoMark = mark ?? brand.charAt(0).toUpperCase();

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-bar]', {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-chart]', start: 'top 82%' },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.mockup} data-reveal ref={root}>
      <div className={styles.chrome}>
        <div className={styles.chromeDots} aria-hidden="true">
          <span className={`${styles.chromeDot} ${styles.chromeDotR}`} />
          <span className={`${styles.chromeDot} ${styles.chromeDotY}`} />
          <span className={`${styles.chromeDot} ${styles.chromeDotG}`} />
        </div>
        <div className={styles.chromeBar}>
          <span className={styles.chromeLock} aria-hidden="true">🔒</span>
          <span className={styles.chromeUrl}>
            <b>{url}</b>
          </span>
        </div>
      </div>

      <div className={styles.dash}>
        {/* sidebar */}
        <aside className={styles.side} aria-hidden="true">
          <div className={styles.sideBrand}>
            <span className={styles.sideLogo}>{logoMark}</span>
            <span className={styles.sideBrandName}>{brand}</span>
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
                  className={`${styles.statDelta} ${s.down ? styles.statDeltaDown : ''}`}
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
                      className={`${styles.barFill} ${h === CHART_PEAK ? styles.barPeak : ''}`}
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
                    className={`${styles.tStatus} ${t.pending ? styles.tPending : styles.tPaid}`}
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
  );
}
