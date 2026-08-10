'use client';

/**
 * Interactive plan picker on the welcome page. The client selects a tier
 * (plus the analytics add on when it is not included), and Continue creates
 * their agreement with the chosen terms and takes them straight to signing.
 */
import { useState } from 'react';
import {
  HOSTING_TIERS,
  formatPriceCents,
  type HostingTier,
} from '@/lib/clients/constants';
import styles from './welcome.module.css';

interface Props {
  token: string;
  currentPriceCents: number;
  currentAnalyticsAddon: boolean;
}

export default function WelcomeSelect({
  token,
  currentPriceCents,
  currentAnalyticsAddon,
}: Props) {
  const preselected =
    HOSTING_TIERS.find((t) => t.priceCents === currentPriceCents)?.key ??
    'growth';
  const [tierKey, setTierKey] = useState<HostingTier['key']>(preselected);
  const [analyticsAddon, setAnalyticsAddon] = useState(currentAnalyticsAddon);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const tier = HOSTING_TIERS.find((t) => t.key === tierKey)!;
  const monthlyTotal =
    tier.priceCents + (!tier.analyticsIncluded && analyticsAddon ? 500 : 0);

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
          analytics_addon: !tier.analyticsIncluded && analyticsAddon,
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

  return (
    <div className={styles.selectSection}>
      <p className={styles.selectKicker}>Pick your hosting plan</p>
      <p className={styles.selectHint}>
        Every plan includes your free custom build, a media session, hosting,
        security, and care. You can cancel anytime with 60 days notice.
      </p>

      <div className={styles.planGrid}>
        {HOSTING_TIERS.map((t) => {
          const active = t.key === tierKey;
          return (
            <button
              key={t.key}
              type="button"
              className={
                active
                  ? `${styles.planCard} ${styles.planCardActive}`
                  : styles.planCard
              }
              onClick={() => setTierKey(t.key)}
            >
              {active && <span className={styles.planBadge}>Selected</span>}
              <span className={styles.planPrice}>
                {formatPriceCents(t.priceCents)}
                <span className={styles.planPer}>/mo</span>
              </span>
              <span className={styles.planName}>{t.label}</span>
              <ul className={styles.planFeatures}>
                <li>Free custom build + media session</li>
                <li>{t.updateHoursPerQuarter} update hours every quarter</li>
                <li>
                  {t.analyticsIncluded
                    ? 'Analytics reports included'
                    : 'Analytics reports +$5/mo'}
                </li>
                <li>
                  {t.allowedDbModes.includes('dedicated')
                    ? 'Private database available'
                    : 'Secure shared platform'}
                </li>
              </ul>
            </button>
          );
        })}
      </div>

      {!tier.analyticsIncluded && (
        <label className={styles.addonRow}>
          <input
            type="checkbox"
            checked={analyticsAddon}
            onChange={(e) => setAnalyticsAddon(e.target.checked)}
          />
          <span>
            Add monthly analytics reports for $5/mo (see how many people visit
            your website and what they do)
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
        is final until you sign it, and you are never charged until your
        website goes live.
      </p>
    </div>
  );
}
