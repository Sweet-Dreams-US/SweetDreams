/**
 * Admin: Clients — the post-agreement pipeline (clients + sites + agreements).
 *
 * Server component, service-role read, standalone admin cookie auth
 * (same pattern as /admin/inquiries). Each row links to the client detail
 * page where agreements are sent and statuses move.
 */
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import {
  SITE_STATUSES,
  SITE_STATUS_LABELS,
  formatPriceCents,
  type SiteStatus,
} from '@/lib/clients/constants';
import styles from './clients.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SiteRow {
  id: string;
  name: string;
  status: string;
  hosting_price_cents: number;
  live_url: string | null;
}

interface AgreementRow {
  id: string;
  status: string;
  created_at: string;
  first_viewed_at: string | null;
  signed_at: string | null;
}

interface ClientRow {
  id: string;
  created_at: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  auth_user_id: string | null;
  archived_at: string | null;
  sites: SiteRow[];
  agreements: AgreementRow[];
}

function agreementState(agreements: AgreementRow[]): {
  label: string;
  className: string;
} {
  if (agreements.some((a) => a.status === 'signed')) {
    return { label: 'Signed', className: styles.agreementSigned };
  }
  const sent = agreements.filter((a) => a.status === 'sent');
  if (sent.length > 0) {
    return sent.some((a) => a.first_viewed_at)
      ? { label: 'Sent · viewed', className: styles.agreementViewed }
      : { label: 'Sent', className: '' };
  }
  if (agreements.length > 0) return { label: 'Revoked', className: '' };
  return { label: 'None', className: '' };
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const cookieStore = await cookies();
  if (!verifySession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect('/admin/login?return=/admin/clients');
  }

  const params = await searchParams;
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('clients')
    .select(
      'id, created_at, business_name, contact_name, email, phone, auth_user_id, archived_at, sites (id, name, status, hosting_price_cents, live_url), agreements (id, status, created_at, first_viewed_at, signed_at)'
    )
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .limit(500);

  const all = ((data as unknown as ClientRow[] | null) ?? []).map((c) => ({
    ...c,
    sites: c.sites ?? [],
    agreements: c.agreements ?? [],
  }));

  const counts: Record<string, number> = { all: all.length };
  for (const s of SITE_STATUSES) counts[s] = 0;
  for (const c of all) {
    for (const s of c.sites) counts[s.status] = (counts[s.status] ?? 0) + 1;
  }

  const activeStatus =
    params.status && (SITE_STATUSES as readonly string[]).includes(params.status)
      ? params.status
      : null;

  const rows = activeStatus
    ? all.filter((c) => c.sites.some((s) => s.status === activeStatus))
    : all;

  const liveCount = counts.live ?? 0;
  const signedPlus =
    (counts.signed ?? 0) +
    (counts.building ?? 0) +
    (counts.client_review ?? 0) +
    (counts.approved ?? 0) +
    (counts.awaiting_payment ?? 0);

  return (
    <div className={styles.page}>
      <nav className={styles.topNav}>
        <Link href="/admin/demos" className={styles.navLink}>Demos</Link>
        <span className={`${styles.navLink} ${styles.navLinkActive}`}>Clients</span>
        <Link href="/admin/accounting" className={styles.navLink}>Accounting</Link>
        <Link href="/admin/inquiries" className={styles.navLink}>Free Website Inquiries</Link>
        <Link href="/admin/leads" className={styles.navLink}>Leadpipe Visitors</Link>
        <a href="/api/admin/logout" className={styles.navLink}>Sign out</a>
      </nav>

      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>CLIENT PIPELINE</p>
          <h1 className={styles.title}>Clients</h1>
          <p className={styles.subtitle}>
            Every business under agreement (or headed there). Open a client to send
            their agreement, move their site through the pipeline, and manage their
            portal access.
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{counts.all}</span>
            <span className={styles.statLabel}>Clients</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{signedPlus}</span>
            <span className={styles.statLabel}>In Progress</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{liveCount}</span>
            <span className={styles.statLabel}>Live</span>
          </div>
        </div>
      </header>

      <div className={styles.actionsRow}>
        <Link href="/admin/clients/new" className={styles.primaryAction}>
          + New Client
        </Link>
      </div>

      <nav className={styles.filterBar} aria-label="Filter by site status">
        <span className={styles.filterLabel}>Site status:</span>
        <Link
          className={`${styles.chip} ${!activeStatus ? styles.chipActive : ''}`}
          href="/admin/clients"
        >
          All ({counts.all})
        </Link>
        {SITE_STATUSES.map((s) => (
          <Link
            key={s}
            className={`${styles.chip} ${activeStatus === s ? styles.chipActive : ''}`}
            href={`/admin/clients?status=${s}`}
          >
            {SITE_STATUS_LABELS[s]} ({counts[s] ?? 0})
          </Link>
        ))}
      </nav>

      {error ? (
        <div className={styles.errorBox}>DB error: {error.message}</div>
      ) : rows.length === 0 ? (
        <div className={styles.empty}>
          No clients yet. Convert an inquiry or create one with New Client.
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Business</th>
                <th>Contact</th>
                <th>Sites</th>
                <th>Agreement</th>
                <th>Portal</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const agr = agreementState(c.agreements);
                return (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/admin/clients/${c.id}`} className={styles.biz}>
                        {c.business_name}
                      </Link>
                    </td>
                    <td>
                      <div className={styles.name}>{c.contact_name}</div>
                      <a className={styles.email} href={`mailto:${c.email}`}>
                        {c.email}
                      </a>
                      {c.phone && <div className={styles.muted}>{c.phone}</div>}
                    </td>
                    <td>
                      {c.sites.length === 0 && <span className={styles.muted}>none</span>}
                      {c.sites.map((s) => (
                        <div key={s.id}>
                          <span
                            className={`${styles.pill} ${styles[`pill_${s.status as SiteStatus}`] ?? ''}`}
                          >
                            {SITE_STATUS_LABELS[s.status as SiteStatus] ?? s.status}
                          </span>
                          <span className={styles.muted}>
                            {formatPriceCents(s.hosting_price_cents)}/mo
                          </span>
                        </div>
                      ))}
                    </td>
                    <td>
                      <span className={`${styles.agreementState} ${agr.className}`}>
                        {agr.label}
                      </span>
                    </td>
                    <td>
                      {c.auth_user_id ? (
                        <span className={styles.portalYes}>linked ✓</span>
                      ) : (
                        <span className={styles.portalNo}>not yet</span>
                      )}
                    </td>
                    <td className={styles.muted}>{fmtDate(c.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <footer className={styles.footer}>
        <p>
          Source of truth: Supabase <code>clients</code> / <code>sites</code> /{' '}
          <code>agreements</code>. Portal accounts are created when clients sign.
        </p>
      </footer>
    </div>
  );
}
