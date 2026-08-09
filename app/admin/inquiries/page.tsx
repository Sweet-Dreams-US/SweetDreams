/**
 * Admin: Free Website Inquiries — the marketing_leads pipeline.
 *
 * Server component, service-role read (never reaches the browser). Auth via the
 * standalone admin session cookie (same as /admin/leads). The interactive
 * status + notes controls live in InquiriesTable (client), which POSTs to
 * /api/admin/leads/status. Read-only tracking data is never modified here.
 */
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { INQUIRY_STATUSES } from '@/app/api/admin/leads/status/route';
import InquiriesTable, { type Inquiry } from './InquiriesTable';
import styles from './inquiries.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface LeadRow {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  business_name: string | null;
  what_you_do: string | null;
  referer: string | null;
  fbc: string | null;
  funnel: string;
  status: string | null;
  admin_notes: string | null;
}

function sourceLabel(referer: string | null): string {
  if (referer === 'meta-instant-form' || referer === 'meta-instant-form-sheet') return 'Instant Form';
  if (referer && referer.startsWith('https://')) return 'Website form';
  return referer || 'other';
}

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const cookieStore = await cookies();
  if (!verifySession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect('/admin/login?return=/admin/inquiries');
  }

  const params = await searchParams;
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('marketing_leads')
    .select(
      'id, created_at, first_name, last_name, email, phone, business_name, what_you_do, referer, fbc, funnel, status, admin_notes'
    )
    .order('created_at', { ascending: false })
    .limit(500);

  const all = (data as LeadRow[] | null) ?? [];

  const counts: Record<string, number> = { all: all.length };
  for (const s of INQUIRY_STATUSES) counts[s] = 0;
  for (const r of all) counts[r.status || 'new'] = (counts[r.status || 'new'] ?? 0) + 1;

  const activeStatus =
    params.status && (INQUIRY_STATUSES as readonly string[]).includes(params.status)
      ? params.status
      : null;

  const rows: Inquiry[] = all
    .filter((r) => !activeStatus || (r.status || 'new') === activeStatus)
    .map((r) => ({
      id: r.id,
      created_at: r.created_at,
      name: `${r.first_name ?? ''} ${r.last_name ?? ''}`.trim(),
      email: r.email,
      phone: r.phone,
      business_name: r.business_name,
      what_you_do: r.what_you_do,
      funnel: r.funnel,
      source: sourceLabel(r.referer),
      from_ad: r.fbc != null,
      status: r.status || 'new',
      admin_notes: r.admin_notes,
    }));

  return (
    <div className={styles.page}>
      <nav className={styles.topNav}>
        <span className={`${styles.navLink} ${styles.navLinkActive}`}>Free Website Inquiries</span>
        <Link href="/admin/clients" className={styles.navLink}>Clients</Link>
        <Link href="/admin/leads" className={styles.navLink}>Leadpipe Visitors</Link>
        <a href="/api/admin/logout" className={styles.navLink}>Sign out</a>
      </nav>

      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>PIPELINE</p>
          <h1 className={styles.title}>Free Website Inquiries</h1>
          <p className={styles.subtitle}>
            Everyone who submitted the free-website funnel or a Meta Instant Form. Set each
            one&apos;s status as you work it: contacted, building, signed, live, or declined.
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{counts.all}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{counts.new}</span>
            <span className={styles.statLabel}>New</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{counts.signed + counts.live}</span>
            <span className={styles.statLabel}>Signed + Live</span>
          </div>
        </div>
      </header>

      <nav className={styles.filterBar} aria-label="Filter by status">
        <span className={styles.filterLabel}>Status:</span>
        <a className={`${styles.chip} ${!activeStatus ? styles.chipActive : ''}`} href="/admin/inquiries">
          All ({counts.all})
        </a>
        {INQUIRY_STATUSES.map((s) => (
          <a
            key={s}
            className={`${styles.chip} ${activeStatus === s ? styles.chipActive : ''}`}
            href={`/admin/inquiries?status=${s}`}
          >
            {s} ({counts[s] ?? 0})
          </a>
        ))}
      </nav>

      {error ? (
        <div className={styles.empty}>DB error: {error.message}</div>
      ) : (
        <InquiriesTable rows={rows} />
      )}

      <footer className={styles.footer}>
        <p>Source of truth: Supabase <code>marketing_leads</code>. Status changes save instantly.</p>
      </footer>
    </div>
  );
}
