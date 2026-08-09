'use client';

import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import styles from './portal.module.css';

export default function PortalSignOut() {
  const pathname = usePathname();
  // No session on the login page — hide the button there.
  if (pathname === '/portal/login') return null;

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/portal/login';
  }

  return (
    <button type="button" className={styles.signOut} onClick={signOut}>
      Sign out
    </button>
  );
}
