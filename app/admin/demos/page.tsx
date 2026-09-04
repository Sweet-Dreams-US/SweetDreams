/**
 * Admin: Demo Approval Queue — every demo between "deployed" and "the client
 * has opened it", on one screen, each with its age in days.
 *
 * A demo is not done when it deploys; it is done when the client has seen it.
 * Claude moves rows to ready_for_review through the Supabase connector and
 * later from approved to sent. This page (via /api/admin/demos/update) is the
 * ONLY place `approved` can be set — that is the whole point of the queue.
 *
 * Server component, service-role read, standalone admin cookie auth
 * (same pattern as /admin/clients).
 */
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import {
  DEMO_AGE_AMBER_DAYS,
  DEMO_AGE_RED_DAYS,
  DEMO_QUEUE_STATUSES,
  DEMO_STATUS_LABELS,
  DEMO_WAITING_STATUSES,
  buildDemoSendMessage,
  demoAgeDays,
  demoAgeTone,
  demoQueueCounter,
  type DemoAgeTone,
  type DemoStatus,
} from '@/lib/clients/constants';
import DemoQueue, { type DemoQueueRow } from './DemoQueue';
import shared from '../clients/clients.module.css';
import styles from './demos.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SiteRow {
  id: string;
  name: string;
  status: string;
  demo_url: string | null;
  demo_status: string;
  demo_admin_url: string | null;
  demo_passcode: string | null;
  demo_built_at: string | null;
  demo_approved_at: string | null;
  demo_sent_at: string | null;
  demo_first_viewed_at: string | null;
  demo_notes: string | null;
  vercel_project_id: string | null;
  github_repo: string | null;
  clients: {
    id: string;
    business_name: string;
    contact_name: string;
    email: string;
    phone: string | null;
  } | null;
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

export default async function DemosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const cookieStore = await cookies();
  if (!verifySession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect('/admin/login?return=/admin/demos');
  }

  const params = await searchParams;
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('sites')
    .select(
      'id, name, status, demo_url, demo_status, demo_admin_url, demo_passcode, demo_built_at, demo_approved_at, demo_sent_at, demo_first_viewed_at, demo_notes, vercel_project_id, github_repo, clients (id, business_name, contact_name, email, phone)'
    )
    .in('demo_status', DEMO_QUEUE_STATUSES)
    .order('demo_built_at', { ascending: false, nullsFirst: false })
    .limit(500);

  // One clock for every age on the page so the counter and the pills agree.
  const now = new Date();

  const all: DemoQueueRow[] = ((data as unknown as SiteRow[] | null) ?? []).map((r) => {
    const client = r.clients;
    const businessName = client?.business_name || r.name;
    const contactName = client?.contact_name ?? '';
    const ageDays = demoAgeDays(r.demo_built_at, now);
    return {
      id: r.id,
      siteName: r.name,
      siteStatus: r.status,
      demoStatus: r.demo_status as DemoStatus,
      demoUrl: r.demo_url,
      adminUrl: r.demo_admin_url,
      passcode: r.demo_passcode,
      builtAt: r.demo_built_at,
      approvedAt: r.demo_approved_at,
      sentAt: r.demo_sent_at,
      firstViewedAt: r.demo_first_viewed_at,
      notes: r.demo_notes,
      vercelProjectId: r.vercel_project_id,
      githubRepo: r.github_repo,
      clientId: client?.id ?? null,
      businessName,
      contactName,
      email: client?.email ?? null,
      phone: client?.phone ?? null,
      ageDays,
      ageTone: demoAgeTone(ageDays),
      draftMessage: r.demo_url
        ? buildDemoSendMessage({
            contactName,
            businessName,
            demoUrl: r.demo_url,
            adminUrl: r.demo_admin_url,
            passcode: r.demo_passcode,
          })
        : null,
    };
  });

  const counts: Record<string, number> = { all: all.length };
  for (const s of DEMO_QUEUE_STATUSES) counts[s] = 0;
  for (const r of all) counts[r.demoStatus] = (counts[r.demoStatus] ?? 0) + 1;

  const counter = demoQueueCounter(
    all.filter((r) => DEMO_WAITING_STATUSES.includes(r.demoStatus)).map((r) => r.ageDays)
  );
  const counterTone: DemoAgeTone = counter.red
    ? 'red'
    : counter.oldestDays !== null && counter.oldestDays >= DEMO_AGE_AMBER_DAYS
      ? 'amber'
      : 'ok';
  const counterText =
    counter.count === 0
      ? 'Nothing is waiting on you.'
      : counter.oldestDays === null
        ? `${plural(counter.count, 'demo')} waiting on you, oldest has no build date.`
        : counter.oldestDays === 0
          ? `${plural(counter.count, 'demo')} waiting on you, oldest is under a day.`
          : `${plural(counter.count, 'demo')} waiting on you, oldest is ${plural(counter.oldestDays, 'day')}.`;

  const activeStatus =
    params.status && (DEMO_QUEUE_STATUSES as readonly string[]).includes(params.status)
      ? (params.status as DemoStatus)
      : null;

  // With no filter, demos sent back to the builder get their own section at
  // the top and the rest is the queue. With a filter, one flat list as before.
  const changesRows = all.filter((r) => r.demoStatus === 'changes_requested');
  const otherRows = all.filter((r) => r.demoStatus !== 'changes_requested');
  const showChanges = !activeStatus && changesRows.length > 0;
  const rows = activeStatus ? all.filter((r) => r.demoStatus === activeStatus) : otherRows;

  return (
    <div className={shared.page}>
      <nav className={shared.topNav}>
        <span className={`${shared.navLink} ${shared.navLinkActive}`}>Demos</span>
        <Link href="/admin/clients" className={shared.navLink}>Clients</Link>
        <Link href="/admin/inquiries" className={shared.navLink}>Free Website Inquiries</Link>
        <Link href="/admin/accounting" className={shared.navLink}>Accounting</Link>
        <Link href="/admin/leads" className={shared.navLink}>Leadpipe Visitors</Link>
        <a href="/api/admin/logout" className={shared.navLink}>Sign out</a>
      </nav>

      <header className={shared.header}>
        <div>
          <p className={shared.kicker}>DEMO APPROVAL QUEUE</p>
          <h1 className={shared.title}>Demos</h1>
          <p className={shared.subtitle}>
            A demo is done when the client has opened it, not when it deploys.
          </p>
        </div>
        <div className={shared.stats}>
          <div className={shared.stat}>
            <span className={`${shared.statNum} ${styles[`tone_${counterTone}`] ?? ''}`}>
              {counter.count}
            </span>
            <span className={shared.statLabel}>Waiting</span>
          </div>
          <div className={shared.stat}>
            <span className={shared.statNum}>{counts.approved ?? 0}</span>
            <span className={shared.statLabel}>Approved · to send</span>
          </div>
          <div className={shared.stat}>
            <span className={shared.statNum}>{counts.sent ?? 0}</span>
            <span className={shared.statLabel}>Sent · not viewed</span>
          </div>
          <div className={shared.stat}>
            <span className={shared.statNum}>{counts.changes_requested ?? 0}</span>
            <span className={shared.statLabel}>Changes requested</span>
          </div>
          <div className={shared.stat}>
            <span className={shared.statNum}>{counts.building ?? 0}</span>
            <span className={shared.statLabel}>Building</span>
          </div>
        </div>
      </header>

      <section
        className={`${styles.counter} ${styles[`counter_${counterTone}`] ?? ''}`}
        role="status"
        aria-live="polite"
      >
        <p className={styles.counterText}>{counterText}</p>
        <p className={styles.counterSub}>
          Amber at {DEMO_AGE_AMBER_DAYS} days, red at {DEMO_AGE_RED_DAYS}. Approve or request
          changes here; Claude sends approved demos. A demo leaves this list only when the
          client opens it.
        </p>
      </section>

      {/* The chips are the page's only navigation, so they stay in one place
          under the counter and "All (N)" visibly governs both sections below. */}
      <nav className={shared.filterBar} aria-label="Filter by demo status">
        <span className={shared.filterLabel}>Demo status:</span>
        <Link
          className={`${shared.chip} ${!activeStatus ? shared.chipActive : ''}`}
          href="/admin/demos"
        >
          All ({counts.all})
        </Link>
        {DEMO_QUEUE_STATUSES.map((s) => (
          <Link
            key={s}
            className={`${shared.chip} ${activeStatus === s ? shared.chipActive : ''}`}
            href={`/admin/demos?status=${s}`}
          >
            {DEMO_STATUS_LABELS[s]} ({counts[s] ?? 0})
          </Link>
        ))}
      </nav>

      {error ? (
        <div className={shared.errorBox}>DB error: {error.message}</div>
      ) : showChanges ? (
        <>
          <section
            className={`${styles.section} ${styles.sectionChanges}`}
            aria-labelledby="demos-changes-heading"
          >
            <h2 id="demos-changes-heading" className={styles.sectionKicker}>
              Changes requested · waiting on the builder
            </h2>
            <p className={styles.sectionSub}>
              Open the demo&rsquo;s folder, run Prompt C, redeploy, then it comes back as
              Ready for review.
            </p>
            <DemoQueue rows={changesRows} />
          </section>

          <section className={styles.section} aria-labelledby="demos-queue-heading">
            <h2 id="demos-queue-heading" className={styles.sectionKicker}>
              Queue
            </h2>
            <DemoQueue
              rows={rows}
              activeStatus={activeStatus}
              emptyText="Nothing else in the queue."
            />
          </section>
        </>
      ) : (
        <DemoQueue rows={rows} activeStatus={activeStatus} />
      )}

      <footer className={shared.footer}>
        <p>
          Source of truth: Supabase <code>sites.demo_status</code>. Claude moves rows to{' '}
          <code>ready_for_review</code> and from <code>approved</code> to <code>sent</code>{' '}
          through the Supabase connector; <code>approved</code> is set only on this page.
          Sending the demo invite from a client page also stamps <code>sent</code>.
        </p>
      </footer>
    </div>
  );
}
