/**
 * Admin leads viewer — Leadpipe pipeline output.
 *
 * Server component. Runs only on Vercel; the service role key
 * never reaches the browser. Auth: requires a Supabase session with
 * an email in ADMIN_EMAILS (see lib/admin-auth.ts). Non-admins get
 * redirected to /login with a return path.
 *
 * Reads from public.leadpipe_leads, the table written to by
 * /api/leadpipe/webhook. Multi-tenant by source_domain so this same
 * view will show data for any pixel pointing here (currently
 * sweetdreams.us + primedealerfund.com once both webhooks are live).
 *
 * Stopgap before the polished Nightmares admin is built — same SQL +
 * data shape will translate cleanly when that lands.
 */

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import styles from './leads.module.css';

// Don't cache — leads come in continuously.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface LeadRow {
  id: string;
  source_pixel: string;
  source_domain: string;
  event_type: string;
  received_at: string;
  event_at: string | null;
  visitor_id: string | null;
  page_views: number | null;
  pages_visited: unknown;
  contact_name: string | null;
  contact_title: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_linkedin: string | null;
  company_name: string | null;
  company_domain: string | null;
  company_industry: string | null;
  company_size: string | null;
  company_city: string | null;
  company_state: string | null;
  intent_score: number | null;
  intent_topics: unknown;
  raw_payload: unknown;
  outreach_status: string;
  outreach_notes: string | null;
  contacted_at: string | null;
  contacted_by: string | null;
  created_at: string;
  updated_at: string;
}

function intentColor(score: number | null): string {
  if (score === null || score === undefined) return '#888';
  if (score >= 70) return '#28c840';
  if (score >= 40) return '#F4C430';
  return '#e63636';
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string; status?: string }>;
}) {
  // 1. Auth gate — checks the standalone admin session cookie set by
  //    /api/admin/login. NOT the Supabase user session (that's gated to
  //    sweetdreamsmusic.com per middleware).
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifySession(sessionToken)) {
    redirect('/admin/login?return=/admin/leads');
  }

  // 2. Query Leadpipe leads (service role bypasses RLS on this table)
  const params = await searchParams;
  const supabase = createServiceRoleClient();
  let query = supabase
    .from('leadpipe_leads')
    .select('*')
    .order('received_at', { ascending: false })
    .limit(200);

  if (params.domain) query = query.eq('source_domain', params.domain);
  if (params.status) query = query.eq('outreach_status', params.status);

  const { data: leads, error } = await query;
  const rows = (leads as LeadRow[] | null) ?? [];

  // 3. Aggregate stats for the header tiles
  const totals = {
    all: rows.length,
    sweetdreams: rows.filter((r) => r.source_domain === 'sweetdreams.us').length,
    primedealer: rows.filter((r) => r.source_domain === 'primedealerfund.com').length,
    hot: rows.filter((r) => (r.intent_score ?? 0) >= 70).length,
    newCount: rows.filter((r) => r.outreach_status === 'new').length,
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>LEADPIPE PIPELINE</p>
          <h1 className={styles.title}>Inbound Leads</h1>
          <p className={styles.subtitle}>
            Identified visitors from sweetdreams.us &amp; primedealerfund.com — refresh the page to pull the latest.
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{totals.all}</span>
            <span className={styles.statLabel}>Total (last 200)</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{totals.hot}</span>
            <span className={styles.statLabel}>Hot (intent ≥70)</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{totals.newCount}</span>
            <span className={styles.statLabel}>Not yet contacted</span>
          </div>
        </div>
      </header>

      {/* Filters: simple GET-param links so the page stays server-rendered */}
      <nav className={styles.filterBar} aria-label="Filter leads">
        <span className={styles.filterLabel}>Source:</span>
        <FilterChip label="All" href="/admin/leads" active={!params.domain} />
        <FilterChip
          label={`sweetdreams.us (${totals.sweetdreams})`}
          href="/admin/leads?domain=sweetdreams.us"
          active={params.domain === 'sweetdreams.us'}
        />
        <FilterChip
          label={`primedealerfund.com (${totals.primedealer})`}
          href="/admin/leads?domain=primedealerfund.com"
          active={params.domain === 'primedealerfund.com'}
        />

        <span className={styles.filterDivider} />

        <span className={styles.filterLabel}>Status:</span>
        {(['new', 'contacted', 'replied', 'qualified', 'dead'] as const).map((s) => (
          <FilterChip
            key={s}
            label={s}
            href={`/admin/leads?status=${s}${params.domain ? `&domain=${params.domain}` : ''}`}
            active={params.status === s}
          />
        ))}
      </nav>

      {/* Errors / empty / data */}
      {error && (
        <div className={styles.errorBanner}>
          DB error: {error.message}. Check that the leadpipe_leads table exists and SUPABASE_SERVICE_ROLE_KEY is configured.
        </div>
      )}

      {!error && rows.length === 0 && (
        <div className={styles.empty}>
          <h2>No leads yet</h2>
          <p>Either the webhook hasn&apos;t fired yet, or no identifiable visitors have hit the tracked pages.</p>
          <p className={styles.emptyHint}>
            Verify the pipeline:
            <br />
            • <code>GET /api/leadpipe/webhook</code> should return ok
            <br />
            • <code>LEADPIPE_WEBHOOK_SECRET</code> must be set in Vercel env vars
            <br />
            • Webhook must be registered in the Leadpipe dashboard with the same secret
          </p>
        </div>
      )}

      {!error && rows.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Received</th>
                <th>Contact</th>
                <th>Company</th>
                <th>Source</th>
                <th>Intent</th>
                <th>Pages</th>
                <th>Status</th>
                <th>Reach out</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className={styles.cellMuted}>
                    <time dateTime={r.received_at} title={r.received_at}>
                      {formatRelative(r.received_at)}
                    </time>
                  </td>
                  <td>
                    {r.contact_name ? (
                      <>
                        <div className={styles.contactName}>{r.contact_name}</div>
                        {r.contact_title && (
                          <div className={styles.cellMuted}>{r.contact_title}</div>
                        )}
                        {r.contact_email && (
                          <div className={styles.contactEmail}>{r.contact_email}</div>
                        )}
                      </>
                    ) : (
                      <span className={styles.cellMuted}>anonymous</span>
                    )}
                  </td>
                  <td>
                    {r.company_name ? (
                      <>
                        <div className={styles.companyName}>{r.company_name}</div>
                        {(r.company_city || r.company_state) && (
                          <div className={styles.cellMuted}>
                            {[r.company_city, r.company_state].filter(Boolean).join(', ')}
                          </div>
                        )}
                        {r.company_industry && (
                          <div className={styles.cellMuted}>{r.company_industry}</div>
                        )}
                      </>
                    ) : (
                      <span className={styles.cellMuted}>—</span>
                    )}
                  </td>
                  <td>
                    <span className={styles.domainBadge}>{r.source_domain}</span>
                  </td>
                  <td>
                    {r.intent_score !== null ? (
                      <span
                        className={styles.intentChip}
                        style={{ background: intentColor(r.intent_score) }}
                      >
                        {r.intent_score}
                      </span>
                    ) : (
                      <span className={styles.cellMuted}>—</span>
                    )}
                  </td>
                  <td className={styles.cellCenter}>{r.page_views ?? 0}</td>
                  <td>
                    <span className={`${styles.statusPill} ${styles[`status_${r.outreach_status}`] || ''}`}>
                      {r.outreach_status}
                    </span>
                  </td>
                  <td>
                    {r.contact_email && (
                      <a
                        href={`mailto:${r.contact_email}?subject=${encodeURIComponent(
                          `Sweet Dreams — saw you on ${r.source_domain}`
                        )}&body=${encodeURIComponent(
                          `Hi${r.contact_name ? ' ' + r.contact_name.split(' ')[0] : ''},\n\nNoticed you on ${r.source_domain}. Wanted to reach out — what brought you in?\n\nLet me know if there's anything I can help with.\n\nCole\n(260) 615-7467`
                        )}`}
                        className={styles.mailtoBtn}
                      >
                        Email
                      </a>
                    )}
                    {r.contact_linkedin && (
                      <a
                        href={r.contact_linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkedinBtn}
                      >
                        LinkedIn
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className={styles.footer}>
        <p>
          Pipeline:{' '}
          <a href="https://app.leadpipe.com" target="_blank" rel="noopener noreferrer">
            Leadpipe
          </a>{' '}
          → <code>POST /api/leadpipe/webhook</code> → Supabase <code>leadpipe_leads</code> → this page
        </p>
        <p>
          Long-term home: nightmaresturntodreams.com admin (see{' '}
          <code>.claude/LEADPIPE-NIGHTMARES-INTEGRATION-BRIEF.md</code>).
        </p>
        <p>
          <a href="/api/admin/logout">Sign out</a>
        </p>
      </footer>
    </div>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <a className={`${styles.chip} ${active ? styles.chipActive : ''}`} href={href}>
      {label}
    </a>
  );
}
