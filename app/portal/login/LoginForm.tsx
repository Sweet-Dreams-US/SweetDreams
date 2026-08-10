'use client';

/**
 * Portal login: classic email + password against the shared Supabase Auth
 * pool, plus a self serve Forgot Password (Supabase recovery email that
 * lands on /portal/set-password via the auth callback).
 */
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import PasswordField from '@/components/PasswordField';
import styles from '../portal.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  async function logIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: loginErr } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (loginErr) {
        setError('Incorrect email or password.');
        return;
      }
      window.location.href = '/portal';
    } finally {
      setBusy(false);
    }
  }

  async function forgotPassword() {
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Type your email above first, then click Forgot Password.');
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/portal/set-password`,
      });
      // Always confirm — never reveal whether the email has an account.
      setResetSent(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.authCard}>
      <h1 className={styles.authTitle}>Log in to your portal</h1>
      <p className={styles.authHint}>
        Follow your website build, see your live links, and read your signed
        agreement.
      </p>

      <form onSubmit={logIn}>
        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label className={styles.label}>
          Password
          <PasswordField
            className={styles.input}
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}
        {resetSent && (
          <p className={styles.success}>
            If that email has an account, a password reset link is on its way.
          </p>
        )}

        <button type="submit" className={styles.primaryBtn} disabled={busy}>
          {busy ? 'Working...' : 'Log In'}
        </button>
      </form>

      <button
        type="button"
        className={styles.linkBtn}
        onClick={forgotPassword}
        disabled={busy}
      >
        Forgot password?
      </button>

      <p className={styles.authFoot}>
        Client accounts are created when you sign your website agreement.
        Not a client yet?{' '}
        <a href="/free-website">Start with a free website</a> or{' '}
        <a href="/book">book a call</a>.
      </p>
      <p className={styles.authFoot}>
        Music studio client? Your login lives at{' '}
        <a href="https://sweetdreamsmusic.com/login">sweetdreamsmusic.com</a>
      </p>
    </div>
  );
}
