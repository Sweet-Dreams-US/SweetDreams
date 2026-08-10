'use client';

/**
 * Portal banner asking the client to save their payment method after
 * signing. Saved, never charged — billing starts when the site goes live.
 */
import { useState } from 'react';
import styles from './portal.module.css';

export default function PortalBillingCard() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function startCheckout() {
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/portal/billing/checkout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.url) {
        setError(data.error || 'Could not open the payment page. Please try again.');
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.billingCard}>
      <div>
        <p className={styles.billingTitle}>One last step: add your payment method</p>
        <p className={styles.billingText}>
          Your card or bank is saved securely with Stripe and is{' '}
          <strong>not charged now</strong>. Hosting billing only starts once
          we both confirm your website is ready and it goes live, on the 1st
          or the 15th after launch.
        </p>
        {error && <p className={styles.error}>{error}</p>}
      </div>
      <button
        type="button"
        className={styles.primaryBtn}
        style={{ width: 'auto', marginTop: 0 }}
        onClick={startCheckout}
        disabled={busy}
      >
        {busy ? 'Opening...' : 'Add Payment Method'}
      </button>
    </div>
  );
}
