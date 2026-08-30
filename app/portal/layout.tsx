/**
 * Client portal chrome: minimal header (wordmark + nav + sign out) around all
 * /portal pages. The marketing Nav/Footer are suppressed via SiteChrome's
 * bare routes. Middleware guarantees an authed session on every page here
 * except /portal/login.
 *
 * The Referrals tab only appears for clients with a signed agreement — the
 * RLS policy on agreements only returns signed rows the user owns, so one
 * scoped query answers both "logged in" and "signed".
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import PortalSignOut from './PortalSignOut';
import styles from './portal.module.css';

export const metadata: Metadata = {
  title: 'Client Portal | Sweet Dreams',
  robots: { index: false, follow: false },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let showReferrals = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('agreements')
        .select('id')
        .eq('status', 'signed')
        .limit(1);
      showReferrals = Boolean(data?.length);
    }
  } catch {
    // Chrome must never take the portal down; the nav just stays minimal.
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <a href="/portal" className={styles.brand}>
          SWEET DREAMS<span className={styles.brandDot}>.</span>
          <span className={styles.brandSub}>Client Portal</span>
        </a>
        <div className={styles.headerRight}>
          {showReferrals && (
            <nav className={styles.headerNav}>
              <Link href="/portal" className={styles.navTab}>
                Dashboard
              </Link>
              <Link href="/portal/referrals" className={styles.navTab}>
                Referrals
              </Link>
            </nav>
          )}
          <PortalSignOut />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        Questions? Email{' '}
        <a href="mailto:cole@sweetdreams.us">cole@sweetdreams.us</a>
      </footer>
    </div>
  );
}
