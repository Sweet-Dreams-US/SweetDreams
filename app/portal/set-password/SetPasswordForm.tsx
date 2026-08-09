'use client';

/**
 * Set a new password from a recovery session (set-password email, forgot
 * password, or admin-sent link). Middleware guarantees a session exists.
 */
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from '../portal.module.css';

export default function SetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: updErr } = await supabase.auth.updateUser({ password });
      if (updErr) {
        setError(
          'Could not update your password. The link may have expired. Use Forgot Password on the login page to get a fresh one.'
        );
        return;
      }
      window.location.href = '/portal';
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.authCard}>
      <h1 className={styles.authTitle}>Set your password</h1>
      <p className={styles.authHint}>
        Choose the password you will use to log in to your client portal.
      </p>

      <form onSubmit={save}>
        <label className={styles.label}>
          New password (at least 8 characters)
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <label className={styles.label}>
          Confirm password
          <input
            className={styles.input}
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.primaryBtn} disabled={busy}>
          {busy ? 'Saving...' : 'Save Password'}
        </button>
      </form>
    </div>
  );
}
