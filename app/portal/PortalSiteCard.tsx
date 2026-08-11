'use client';

/**
 * Everything a client needs for one website, in one card: where the build
 * stands, their links, what they pay and when, their included hours, the
 * plain English history of what we changed, a way to ask for more, and
 * their traffic numbers.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './portal.module.css';

export interface CardUpdate {
  id: string;
  created_at: string;
  title: string;
  summary: string;
  hours_used: number | string | null;
}

export interface CardRequest {
  id: string;
  created_at: string;
  title: string;
  details: string | null;
  status: string;
  preview_url: string | null;
}

export interface CardSite {
  id: string;
  name: string;
  status: string;
  statusLabel: string;
  statusCopy: string;
  live_url: string | null;
  preview_url: string | null;
  agreementId: string | null;
  monthlyDisplay: string;
  anchorDayDisplay: string;
  nextChargeDisplay: string | null;
  paymentOnFile: boolean;
  hoursIncluded: number;
  hoursUsed: number | null;
  quarterEndsDisplay: string | null;
  analyticsIncluded: boolean;
  updates: CardUpdate[];
  requests: CardRequest[];
}

const REQUEST_STATUS_COPY: Record<string, string> = {
  new: 'Received',
  in_progress: 'We are working on it',
  preview_ready: 'Ready for you to preview',
  done: 'Done',
  declined: 'Not moving forward',
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface AnalyticsState {
  loading: boolean;
  locked?: boolean;
  visitors?: number;
  pageviews?: number;
  topPages?: { label: string; visitors: number }[];
  message?: string;
}

export default function PortalSiteCard({ site }: { site: CardSite }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsState>({ loading: true });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/portal/analytics?site_id=${site.id}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.ok) {
          setAnalytics({ loading: false, message: 'Traffic numbers are not available right now.' });
          return;
        }
        if (data.locked) {
          setAnalytics({ loading: false, locked: true });
          return;
        }
        const a = data.analytics;
        if (!a?.ok) {
          setAnalytics({
            loading: false,
            message:
              a?.reason === 'not_enabled'
                ? 'We are switching on traffic tracking for your site. Numbers will appear here soon.'
                : 'Traffic numbers are not available right now.',
          });
          return;
        }
        setAnalytics({
          loading: false,
          visitors: a.visitors,
          pageviews: a.pageviews,
          topPages: a.topPages ?? [],
        });
      } catch {
        if (!cancelled) {
          setAnalytics({ loading: false, message: 'Traffic numbers are not available right now.' });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [site.id]);

  async function submitRequest() {
    setError('');
    if (title.trim().length < 3) {
      setError('Tell us in a few words what you would like changed.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/portal/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site_id: site.id, title, details }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not send your request. Please try again.');
        return;
      }
      setTitle('');
      setDetails('');
      setSent(true);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const hoursLeft =
    site.hoursUsed === null ? null : Math.max(0, site.hoursIncluded - site.hoursUsed);

  return (
    <div className={styles.siteCard}>
      <div className={styles.siteHead}>
        <span className={styles.siteName}>{site.name}</span>
        <span className={`${styles.statusPill} ${styles['st_' + site.status] ?? ''}`}>
          {site.statusLabel}
        </span>
      </div>
      <p className={styles.statusCopy}>{site.statusCopy}</p>

      <div className={styles.linkRow}>
        {site.live_url && (
          <a className={styles.liveLink} href={site.live_url} target="_blank" rel="noopener noreferrer">
            Visit your website ↗
          </a>
        )}
        {site.preview_url && (
          <a className={styles.previewLink} href={site.preview_url} target="_blank" rel="noopener noreferrer">
            {site.live_url ? 'Preview of changes ↗' : 'See your site in progress ↗'}
          </a>
        )}
        {site.agreementId && (
          <a className={styles.agreementLink} href={`/portal/agreement/${site.agreementId}`}>
            View your signed agreement
          </a>
        )}
      </div>

      {/* ---- plan + billing ---- */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Your plan</p>
        <div className={styles.factGrid}>
          <div>
            <span className={styles.factLabel}>Monthly hosting</span>
            <span className={styles.factValue}>{site.monthlyDisplay}</span>
          </div>
          <div>
            <span className={styles.factLabel}>Billing day</span>
            <span className={styles.factValue}>the {site.anchorDayDisplay}</span>
          </div>
          <div>
            <span className={styles.factLabel}>Next charge</span>
            <span className={styles.factValue}>
              {site.nextChargeDisplay ?? 'Not until your site is live'}
            </span>
          </div>
          <div>
            <span className={styles.factLabel}>Payment method</span>
            <span className={styles.factValue}>
              {site.paymentOnFile ? 'On file ✓' : 'Not added yet'}
            </span>
          </div>
          <div>
            <span className={styles.factLabel}>Included updates</span>
            <span className={styles.factValue}>{site.hoursIncluded} hours per quarter</span>
          </div>
          <div>
            <span className={styles.factLabel}>Analytics reports</span>
            <span className={styles.factValue}>
              {site.analyticsIncluded ? 'Included' : 'Add for $10/mo'}
            </span>
          </div>
        </div>
        {hoursLeft !== null ? (
          <p className={styles.hoursNote}>
            <strong>{hoursLeft} of {site.hoursIncluded} update hours left</strong> this
            quarter{site.quarterEndsDisplay ? ` (resets ${site.quarterEndsDisplay})` : ''}.
          </p>
        ) : (
          <p className={styles.hoursNote}>
            Your included update hours start once your website goes live. Changes
            during the build are on us.
          </p>
        )}
      </div>

      {/* ---- request an update ---- */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Request a change</p>
        {sent && (
          <p className={styles.success}>
            Got it. We will get to work and you will see it here.
          </p>
        )}
        <label className={styles.label}>
          What would you like changed?
          <input
            className={styles.input}
            value={title}
            placeholder="Add our new summer hours to the homepage"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className={styles.label}>
          Any details (optional)
          <textarea
            className={styles.textarea}
            value={details}
            rows={3}
            placeholder="New hours are 9 to 6 Monday through Friday, closed Sunday."
            onChange={(e) => setDetails(e.target.value)}
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="button" className={styles.primaryBtn} onClick={submitRequest} disabled={busy}>
          {busy ? 'Sending...' : 'Send Request'}
        </button>

        {site.requests.length > 0 && (
          <div className={styles.requestList}>
            {site.requests.map((r) => (
              <div key={r.id} className={styles.requestRow}>
                <div>
                  <span className={styles.requestTitle}>{r.title}</span>
                  <span className={styles.requestMeta}>asked {fmtDate(r.created_at)}</span>
                </div>
                <div className={styles.requestRight}>
                  <span className={`${styles.reqPill} ${styles['rq_' + r.status] ?? ''}`}>
                    {REQUEST_STATUS_COPY[r.status] ?? r.status}
                  </span>
                  {r.preview_url && (
                    <a href={r.preview_url} target="_blank" rel="noopener noreferrer" className={styles.reqPreview}>
                      Preview ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- what we changed ---- */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>What we have updated</p>
        {site.updates.length === 0 ? (
          <p className={styles.muted}>
            Nothing yet. Every change we make will show up here in plain English.
          </p>
        ) : (
          <ul className={styles.updateList}>
            {site.updates.map((u) => (
              <li key={u.id} className={styles.updateItem}>
                <span className={styles.updateDate}>{fmtDate(u.created_at)}</span>
                <span className={styles.updateTitle}>{u.title}</span>
                <span className={styles.updateSummary}>{u.summary}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---- traffic ---- */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Your website traffic</p>
        {analytics.loading ? (
          <p className={styles.muted}>Loading your numbers...</p>
        ) : analytics.locked ? (
          <div className={styles.lockedBox}>
            <p className={styles.lockedTitle}>See who is visiting your website</p>
            <p className={styles.lockedText}>
              Monthly traffic reports show how many people visit, which pages
              they look at, and where they came from. Add them to your plan for
              $10 per month.
            </p>
            <a className={styles.previewLink} href="mailto:cole@sweetdreams.us?subject=Add%20analytics%20reports">
              Add analytics reports
            </a>
          </div>
        ) : analytics.message ? (
          <p className={styles.muted}>{analytics.message}</p>
        ) : (
          <>
            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{analytics.visitors?.toLocaleString()}</span>
                <span className={styles.statLabel}>Visitors (30 days)</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{analytics.pageviews?.toLocaleString()}</span>
                <span className={styles.statLabel}>Page views (30 days)</span>
              </div>
            </div>
            {analytics.topPages && analytics.topPages.length > 0 && (
              <ul className={styles.pageList}>
                {analytics.topPages.map((p) => (
                  <li key={p.label}>
                    <span>{p.label === '/' ? 'Home page' : p.label}</span>
                    <span className={styles.pageCount}>{p.visitors.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
