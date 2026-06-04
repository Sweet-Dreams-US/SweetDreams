/**
 * Admin login — standalone password gate for /admin/* pages.
 *
 * Uses ADMIN_PASSWORD env var verified inside /api/admin/login.
 * On success, /api/admin/login sets a signed HttpOnly cookie and
 * redirects back to /admin/leads (or wherever you specify via ?return=).
 *
 * Intentionally NOT named `/login` because the customer-facing /login
 * route on sweetdreams.us redirects to sweetdreamsmusic.com.
 */

import styles from './login.module.css';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ return?: string; error?: string }>;
}) {
  const params = await searchParams;
  const returnTo = params.return || '/admin/leads';
  const showError = params.error === '1';

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.kicker}>SWEET DREAMS ADMIN</p>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>
          Internal admin tools — leads, analytics, and pipeline monitoring.
        </p>

        {showError && (
          <div className={styles.error}>
            Incorrect password. Try again.
          </div>
        )}

        <form
          method="POST"
          action="/api/admin/login"
          className={styles.form}
        >
          <input type="hidden" name="return" value={returnTo} />
          <label className={styles.label}>
            <span>Password</span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className={styles.button}>
            Sign in
          </button>
        </form>

        <p className={styles.hint}>
          This is not the customer-facing login. If you&apos;re a Sweet Dreams Music client
          looking to manage bookings, visit{' '}
          <a href="https://sweetdreamsmusic.com/login">sweetdreamsmusic.com/login</a>.
        </p>
      </div>
    </div>
  );
}
