'use client';

/**
 * "Change my plan" on the signing page: cancels this (unsigned) agreement
 * and returns the client to their welcome page to pick different options.
 * The server mints a fresh welcome link from the sign token.
 */
import { useState } from 'react';
import styles from './agreement.module.css';

export default function ChangePlanButton({ token }: { token: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function changePlan() {
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/agreement/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.welcome_url) {
        setError(data.error || 'Could not open plan options. Please try again.');
        return;
      }
      window.location.href = data.welcome_url;
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.changePlanRow}>
      <button
        type="button"
        className={styles.changePlanBtn}
        onClick={changePlan}
        disabled={busy}
      >
        {busy ? 'One moment...' : 'Change my plan or options'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
