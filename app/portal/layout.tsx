/**
 * Client portal chrome: minimal header (wordmark + sign out) around all
 * /portal pages. The marketing Nav/Footer are suppressed via SiteChrome's
 * bare routes. Middleware guarantees an authed session on every page here
 * except /portal/login.
 */
import type { Metadata } from 'next';
import PortalSignOut from './PortalSignOut';
import styles from './portal.module.css';

export const metadata: Metadata = {
  title: 'Client Portal | Sweet Dreams',
  robots: { index: false, follow: false },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <a href="/portal" className={styles.brand}>
          SWEET DREAMS<span className={styles.brandDot}>.</span>
          <span className={styles.brandSub}>Client Portal</span>
        </a>
        <PortalSignOut />
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        Questions? Email{' '}
        <a href="mailto:cole@sweetdreams.us">cole@sweetdreams.us</a>
      </footer>
    </div>
  );
}
