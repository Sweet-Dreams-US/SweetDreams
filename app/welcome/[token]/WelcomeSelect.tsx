'use client';

/**
 * Interactive plan picker on the welcome page.
 *
 * If the admin quoted a price that matches a standard tier, that tier is
 * preselected. If the admin set a CUSTOM quote, it appears as its own
 * "Your Quote" card next to the standard tiers so the client sees the
 * comparison transparently and can still switch. Continue creates the
 * agreement with the chosen terms and goes straight to signing.
 */
import { useState } from 'react';
import {
  ANALYTICS_ADDON_PRICE_CENTS,
  HOSTING_TIERS,
  analyticsIncludedAtPrice,
  formatPriceCents,
  type HostingTier,
} from '@/lib/clients/constants';
import styles from './welcome.module.css';

interface Props {
  token: string;
  currentPriceCents: number;
  /** Plans priced below this are hidden for this site (0 = show all). */
  minPriceCents: number;
  currentHours: number | null;
  currentAnalyticsAddon: boolean;
}

type TierChoice = HostingTier['key'] | 'custom';

export default function WelcomeSelect({
  token,
  currentPriceCents,
  minPriceCents,
  currentHours,
  currentAnalyticsAddon,
}: Props) {
  // Some builds require a bigger plan (payment processing and the like); the
  // admin sets a minimum on the site and lower tiers simply do not appear.
  const shownTiers = HOSTING_TIERS.filter((t) => t.priceCents >= minPriceCents);
  const matchedTier = shownTiers.find((t) => t.priceCents === currentPriceCents);
  const hasCustomQuote =
    !HOSTING_TIERS.some((t) => t.priceCents === currentPriceCents) &&
    currentPriceCents > 0;

  const [tierKey, setTierKey] = useState<TierChoice>(
    matchedTier?.key ??
      (hasCustomQuote ? 'custom' : shownTiers[0]?.key ?? 'growth')
  );
  const [analyticsAddon, setAnalyticsAddon] = useState(currentAnalyticsAddon);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const selectedPriceCents =
    tierKey === 'custom'
      ? currentPriceCents
      : (shownTiers.find((t) => t.key === tierKey) ?? shownTiers[0]).priceCents;
  const analyticsIncluded = analyticsIncludedAtPrice(selectedPriceCents);
  const monthlyTotal =
    selectedPriceCents +
    (!analyticsIncluded && analyticsAddon ? ANALYTICS_ADDON_PRICE_CENTS : 0);

  async function continueToAgreement() {
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/welcome/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          tier: tierKey,
          analytics_addon: !analyticsIncluded && analyticsAddon,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.signing_url) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      window.location.href = data.signing_url;
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function planCard(opts: {
    key: TierChoice;
    priceCents: number;
    label: string;
    hours: number;
    included: boolean;
  }) {
    const active = opts.key === tierKey;
    return (
      <button
        key={opts.key}
        type="button"
        className={
          active ? `${styles.planCard} ${styles.planCardActive}` : styles.planCard
        }
        onClick={() => setTierKey(opts.key)}
      >
        {active && <span className={styles.planBadge}>Selected</span>}
        <span className={styles.planPrice}>
          {formatPriceCents(opts.priceCents)}
          <span className={styles.planPer}>/mo</span>
        </span>
        <span className={styles.planName}>{opts.label}</span>
        <ul className={styles.planFeatures}>
          <li>Free custom build + media session</li>
          <li>{opts.hours} update hours every quarter</li>
          <li className={opts.included ? undefined : styles.xItem}>
            {opts.included
              ? 'Analytics reports included'
              : 'Analytics reports not included (+$10/mo to add)'}
          </li>
          <li>Hosting, security, and backups included</li>
        </ul>
      </button>
    );
  }

  return (
    <div className={styles.selectSection}>
      <p className={styles.selectKicker}>Pick your hosting plan</p>
      <p className={styles.selectHint}>
        Every plan includes your free custom build, a media session, hosting,
        security, and care. You can cancel anytime with 60 days notice.
      </p>

      <div className={styles.planGrid}>
        {hasCustomQuote &&
          planCard({
            key: 'custom',
            priceCents: currentPriceCents,
            label: 'Your Quote',
            hours: currentHours ?? 0,
            included: analyticsIncludedAtPrice(currentPriceCents),
          })}
        {shownTiers.map((t) =>
          planCard({
            key: t.key,
            priceCents: t.priceCents,
            label: t.label,
            hours: t.updateHoursPerQuarter,
            included: t.analyticsIncluded,
          })
        )}
      </div>

      {!analyticsIncluded && (
        <label className={styles.addonRow}>
          <input
            type="checkbox"
            checked={analyticsAddon}
            onChange={(e) => setAnalyticsAddon(e.target.checked)}
          />
          <span>
            Add monthly analytics reports for $10/mo (see how many people
            visit your website and what they do)
          </span>
        </label>
      )}

      <div className={styles.totalRow}>
        Your monthly total: <strong>{formatPriceCents(monthlyTotal)}/mo</strong>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="button"
        className={styles.continueBtn}
        onClick={continueToAgreement}
        disabled={busy}
      >
        {busy ? 'Preparing your agreement...' : 'Continue to My Agreement'}
      </button>
      <p className={styles.finePrint}>
        Next you will see your full agreement with these exact terms. Nothing
        is final until you sign it. After signing you will add a payment
        method, and it is not charged until your website is live.
      </p>
    </div>
  );
}
