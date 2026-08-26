/**
 * Admin: client detail — contact info, portal account state, each site's
 * pipeline controls + registry fields, and the agreements timeline with
 * send / resend / revoke / password-link actions (in ClientDetailActions).
 */
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import ClientDetailActions, {
  type DetailAgreement,
  type DetailSite,
} from './ClientDetailActions';
import ClientContactCard from './ClientContactCard';
import styles from '../clients.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ClientDetailRow {
  id: string;
  created_at: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  auth_user_id: string | null;
  source_lead_id: string | null;
  admin_notes: string | null;
  stripe_customer_id: string | null;
  payment_method_saved_at: string | null;
  sites: DetailSite[];
  agreements: DetailAgreement[];
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  if (!verifySession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect('/admin/login?return=/admin/clients');
  }

  const { id } = await params;
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('clients')
    .select(
      `id, created_at, business_name, contact_name, email, phone, auth_user_id, source_lead_id, admin_notes, stripe_customer_id, payment_method_saved_at,
       sites (id, name, domain, demo_url, preview_url, drive_url, status, hosting_price_cents, update_hours_per_quarter, build_price_cents, billing_anchor_day, db_mode, db_project_ref, analytics_addon, github_repo, vercel_project_id, live_url, go_live_date, admin_notes, stripe_subscription_id, billing_starts_on, builder),
       agreements (id, site_id, status, template_version, created_at, first_viewed_at, signed_at, signer_name, signer_ip, signed_content_sha256, signature_image, revoked_at, revoke_reason, terminated_at, termination_effective)`
    )
    .eq('id', id)
    .maybeSingle();

  const client = data as unknown as ClientDetailRow | null;
  if (!client) notFound();

  const sites = client.sites ?? [];
  const agreements = (client.agreements ?? []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const siteIds = sites.map((s) => s.id);
  const { data: cancellationsData } = await supabase
    .from('cancellation_requests')
    .select('id, site_id, created_at, reason, status')
    .in('site_id', siteIds.length ? siteIds : ['00000000-0000-0000-0000-000000000000'])
    .order('created_at', { ascending: false });
  const [{ data: requestsData }, { data: updatesData }] = await Promise.all([
    supabase
      .from('update_requests')
      .select('id, site_id, created_at, title, details, status, preview_url, admin_notes')
      .in('site_id', siteIds.length ? siteIds : ['00000000-0000-0000-0000-000000000000'])
      .order('created_at', { ascending: false }),
    supabase
      .from('site_updates')
      .select('id, site_id, created_at, title, summary, hours_used')
      .in('site_id', siteIds.length ? siteIds : ['00000000-0000-0000-0000-000000000000'])
      .order('created_at', { ascending: false }),
  ]);

  return (
    <div className={styles.page}>
      <nav className={styles.topNav}>
        <Link href="/admin/clients" className={styles.navLink}>Clients</Link>
        <Link href="/admin/inquiries" className={styles.navLink}>Free Website Inquiries</Link>
        <a href="/api/admin/logout" className={styles.navLink}>Sign out</a>
      </nav>

      <Link href="/admin/clients" className={styles.backLink}>
        ← All clients
      </Link>

      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>CLIENT</p>
          <h1 className={styles.title}>{client.business_name}</h1>
          <p className={styles.subtitle}>
            {client.contact_name} · {client.email}
            {client.phone ? ` · ${client.phone}` : ''}
          </p>
        </div>
      </header>

      <ClientContactCard
        client={{
          id: client.id,
          business_name: client.business_name,
          contact_name: client.contact_name,
          email: client.email,
          phone: client.phone,
          admin_notes: client.admin_notes,
        }}
        authLinked={Boolean(client.auth_user_id)}
        paymentSaved={Boolean(client.payment_method_saved_at)}
      />

      <ClientDetailActions
        clientId={client.id}
        hasPortalAccount={Boolean(client.auth_user_id)}
        sites={sites}
        agreements={agreements}
        requests={(requestsData ?? []) as never}
        updates={(updatesData ?? []) as never}
        cancellations={(cancellationsData ?? []) as never}
      />

      <footer className={styles.footer}>
        <p>
          Signed agreements are immutable. Changed terms mean revoke + send a new
          agreement, never an edit.
        </p>
      </footer>
    </div>
  );
}
