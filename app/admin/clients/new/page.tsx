/**
 * Admin: New Client — create a client + first site, optionally sending the
 * agreement immediately. Reads ?lead=<marketing_leads id> to prefill from
 * an inquiry (the Convert to Client path).
 */
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import NewClientForm, { type LeadPrefill } from './NewClientForm';
import styles from '../clients.module.css';

export const dynamic = 'force-dynamic';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>;
}) {
  const cookieStore = await cookies();
  if (!verifySession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect('/admin/login?return=/admin/clients/new');
  }

  const params = await searchParams;
  let prefill: LeadPrefill | null = null;

  if (params.lead && UUID_RE.test(params.lead)) {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from('marketing_leads')
      .select('id, first_name, last_name, email, phone, business_name, what_you_do')
      .eq('id', params.lead)
      .maybeSingle();
    if (data) {
      prefill = {
        source_lead_id: data.id,
        business_name: data.business_name ?? '',
        contact_name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
        email: data.email ?? '',
        phone: (data.phone ?? '').replace(/^p:/, ''),
        what_you_do: data.what_you_do ?? '',
      };
    }
  }

  return (
    <div className={styles.page}>
      <nav className={styles.topNav}>
        <Link href="/admin/demos" className={styles.navLink}>Demos</Link>
        <Link href="/admin/clients" className={styles.navLink}>Clients</Link>
        <Link href="/admin/inquiries" className={styles.navLink}>Free Website Inquiries</Link>
        <a href="/api/admin/logout" className={styles.navLink}>Sign out</a>
      </nav>

      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>NEW CLIENT</p>
          <h1 className={styles.title}>Create Client</h1>
          <p className={styles.subtitle}>
            {prefill
              ? `Prefilled from the ${prefill.business_name || 'inquiry'} lead. Pick their plan and send the agreement.`
              : 'Enter the business, pick their hosting plan, and send the agreement. Signing creates their portal account automatically.'}
          </p>
        </div>
      </header>

      <NewClientForm prefill={prefill} />
    </div>
  );
}
