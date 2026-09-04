'use client';

/**
 * Interactive half of /admin/demos: one card per demo with a live preview,
 * the links Cole needs to hand over, the draft send message, and the three
 * decisions only Cole makes (approve, request changes, prune). Every
 * server-changing action POSTs to /api/admin/demos/update and ends with
 * router.refresh() so the server component re-renders fresh data.
 */
import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';
import {
  DEMO_STATUS_LABELS,
  type DemoAgeTone,
  type DemoStatus,
} from '@/lib/clients/constants';
import styles from './demos.module.css';

/** Flat, serializable card row built server-side in page.tsx. */
export interface DemoQueueRow {
  id: string;
  siteName: string;
  siteStatus: string;
  demoStatus: DemoStatus;
  demoUrl: string | null;
  adminUrl: string | null;
  passcode: string | null;
  builtAt: string | null;
  approvedAt: string | null;
  sentAt: string | null;
  firstViewedAt: string | null;
  notes: string | null;
  vercelProjectId: string | null;
  clientId: string | null;
  businessName: string;
  contactName: string;
  email: string | null;
  phone: string | null;
  /** Whole days since builtAt, computed server-side so it matches the counter. */
  ageDays: number | null;
  ageTone: DemoAgeTone;
  draftMessage: string | null;
}

type DemoAction = 'approve' | 'request_changes' | 'dismiss';

const TZ = 'America/Indiana/Indianapolis';
const IFRAME_SANDBOX =
  'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox';

function fmtStamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return formatInTimeZone(d, TZ, "MMM d 'at' h:mm a");
}

function fmtShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return formatInTimeZone(d, TZ, 'MMM d');
}

export default function DemoQueue({
  rows,
  activeStatus = null,
}: {
  rows: DemoQueueRow[];
  /** The page's ?status= filter, so the empty state can say what is empty. */
  activeStatus?: DemoStatus | null;
}) {
  if (rows.length === 0) {
    return (
      <div className={styles.empty}>
        {activeStatus ? (
          <>
            No demos in &ldquo;{DEMO_STATUS_LABELS[activeStatus]}&rdquo;.{' '}
            <Link href="/admin/demos" className={styles.emptyLink}>
              Show all
            </Link>
          </>
        ) : (
          'No demos in the queue.'
        )}
      </div>
    );
  }
  return (
    <div className={styles.grid}>
      {rows.map((row) => (
        <DemoCard key={row.id} row={row} />
      ))}
    </div>
  );
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  async function copy() {
    let next: 'copied' | 'failed' = 'failed';
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      try {
        await navigator.clipboard.writeText(text);
        next = 'copied';
      } catch {
        next = 'failed';
      }
    }
    setState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 1500);
  }

  return (
    <button
      type="button"
      className={`${styles.copyBtn} ${state === 'copied' ? styles.copyBtnDone : ''}`}
      onClick={copy}
      aria-live="polite"
    >
      {state === 'copied' ? 'Copied ✓' : state === 'failed' ? 'Copy failed' : label}
    </button>
  );
}

function DemoCard({ row }: { row: DemoQueueRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [changesOpen, setChangesOpen] = useState(false);
  const [changesText, setChangesText] = useState('');

  const canApprove =
    row.demoStatus === 'ready_for_review' || row.demoStatus === 'changes_requested';
  const canRequestChanges =
    row.demoStatus === 'ready_for_review' || row.demoStatus === 'approved';
  const isWaiting = row.demoStatus === 'ready_for_review';
  const isChanges = row.demoStatus === 'changes_requested';

  const draftId = `demo-draft-${row.id}`;
  const changesId = `demo-changes-${row.id}`;

  // Buttons stay disabled from the click until the refreshed server data
  // lands, so the card never shows its old status with live buttons.
  const disabled = busy || pending;

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function post(action: DemoAction, notes?: string): Promise<boolean> {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/demos/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          notes === undefined
            ? { site_id: row.id, action }
            : { site_id: row.id, action, notes }
        ),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || 'Something went wrong.');
        return false;
      }
      return true;
    } catch {
      setError('Network error.');
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function approve() {
    if (await post('approve')) {
      setChangesOpen(false);
      setChangesText('');
      refresh();
    }
  }

  async function saveChanges() {
    const notes = changesText.trim();
    if (!notes) return;
    if (await post('request_changes', notes)) {
      setChangesOpen(false);
      setChangesText('');
      refresh();
    }
  }

  async function dismiss() {
    if (
      !window.confirm(
        `Remove "${row.businessName}" from the demo queue?\n\nThis sets its demo status back to none. Use it for rows that are not really demos.`
      )
    ) {
      return;
    }
    if (await post('dismiss')) refresh();
  }

  const cardTone =
    isWaiting && row.ageTone !== 'ok' ? (styles[`card_${row.ageTone}`] ?? '') : '';

  const stamps: string[] = [];
  if (row.builtAt) stamps.push(`Built ${fmtStamp(row.builtAt)}`);
  if (row.approvedAt) stamps.push(`Approved ${fmtStamp(row.approvedAt)}`);
  if (row.sentAt) stamps.push(`Sent ${fmtStamp(row.sentAt)}`);
  if (row.firstViewedAt) stamps.push(`Viewed ${fmtStamp(row.firstViewedAt)}`);

  return (
    <article className={`${styles.card} ${cardTone}`} aria-labelledby={`demo-biz-${row.id}`}>
      <div className={styles.cardHead}>
        <div className={styles.who}>
          {row.clientId ? (
            <Link
              id={`demo-biz-${row.id}`}
              href={`/admin/clients/${row.clientId}`}
              className={styles.biz}
            >
              {row.businessName}
            </Link>
          ) : (
            <span id={`demo-biz-${row.id}`} className={styles.biz}>
              {row.businessName}
            </span>
          )}
          <div className={styles.contact}>
            {row.contactName || 'No contact on file'}
            {row.email && (
              <>
                {' · '}
                <a href={`mailto:${row.email}`}>{row.email}</a>
              </>
            )}
            {row.phone && <>{` · ${row.phone}`}</>}
          </div>
          {row.siteName && row.siteName !== row.businessName && (
            <div className={styles.siteName}>Site: {row.siteName}</div>
          )}
        </div>
        <div className={styles.badges}>
          <span className={`${styles.pill} ${styles[`status_${row.demoStatus}`] ?? ''}`}>
            {DEMO_STATUS_LABELS[row.demoStatus] ?? row.demoStatus}
          </span>
          <span
            className={`${styles.age} ${styles[`age_${row.ageTone}`] ?? ''}`}
            title={row.builtAt ? `Built ${fmtStamp(row.builtAt)}` : 'No build date recorded'}
          >
            {row.ageDays !== null && row.builtAt ? (
              <>
                <strong>{row.ageDays}d</strong>
                <span className={styles.ageBuilt}>built {fmtShort(row.builtAt)}</span>
              </>
            ) : (
              <strong>no build date</strong>
            )}
          </span>
        </div>
      </div>

      <div>
        {row.demoUrl ? (
          <div className={styles.previewBox}>
            <iframe
              className={styles.previewFrame}
              src={row.demoUrl}
              title={`Demo preview: ${row.businessName}`}
              loading="lazy"
              sandbox={IFRAME_SANDBOX}
              referrerPolicy="no-referrer"
              tabIndex={-1}
            />
          </div>
        ) : (
          <div className={styles.previewEmpty}>No demo URL yet</div>
        )}
        <p className={styles.previewCaption}>
          Preview at 50% scale. If it is blank or shows a Vercel sign-in page, Vercel
          Authentication is still on for that project — use Open full screen to check.
        </p>
      </div>

      <dl className={styles.links}>
        <div className={styles.linkRow}>
          <dt>Demo</dt>
          <dd>
            {row.demoUrl ? (
              <>
                <a href={row.demoUrl} target="_blank" rel="noopener noreferrer">
                  {row.demoUrl}
                </a>
                <CopyButton text={row.demoUrl} />
              </>
            ) : (
              <span className={styles.muted}>not set</span>
            )}
          </dd>
        </div>
        {row.adminUrl && (
          <>
            <div className={styles.linkRow}>
              <dt>Admin</dt>
              <dd>
                <a href={row.adminUrl} target="_blank" rel="noopener noreferrer">
                  {row.adminUrl}
                </a>
                <CopyButton text={row.adminUrl} />
              </dd>
            </div>
            <div className={styles.linkRow}>
              <dt>Passcode</dt>
              <dd>
                {row.passcode ? (
                  <>
                    <code className={styles.code}>{row.passcode}</code>
                    <CopyButton text={row.passcode} />
                  </>
                ) : (
                  <span className={styles.muted}>no passcode · one click</span>
                )}
              </dd>
            </div>
          </>
        )}
        {row.vercelProjectId && (
          <div className={styles.linkRow}>
            <dt>Vercel</dt>
            <dd>
              <span className={styles.muted}>{row.vercelProjectId}</span>
            </dd>
          </div>
        )}
      </dl>

      {row.notes && (
        <div className={`${styles.notes} ${isChanges ? styles.notesChanges : ''}`}>
          <p className={styles.blockLabel}>{isChanges ? 'Changes requested' : 'Notes'}</p>
          <p className={styles.notesText}>{row.notes}</p>
        </div>
      )}

      {row.draftMessage && (
        <div>
          <div className={styles.blockHead}>
            <label htmlFor={draftId} className={styles.blockLabel}>
              Draft send message
            </label>
            <CopyButton text={row.draftMessage} label="Copy message" />
          </div>
          <textarea
            id={draftId}
            className={styles.textarea}
            rows={7}
            readOnly
            value={row.draftMessage}
          />
        </div>
      )}

      {stamps.length > 0 && (
        <p className={styles.stamps}>
          {stamps.map((s, i) => (
            <span key={s}>
              {i > 0 && <span className={styles.stampSep}>·</span>}
              {s}
            </span>
          ))}
        </p>
      )}

      {error && (
        <div className={styles.cardError} role="alert">
          {error}
        </div>
      )}

      <div className={styles.actions}>
        {canApprove && (
          <button
            type="button"
            className={styles.primaryBtn}
            disabled={disabled || !row.demoUrl}
            title={row.demoUrl ? undefined : 'Needs a demo URL before it can be approved'}
            onClick={approve}
          >
            Approve &amp; queue for send
          </button>
        )}
        {canRequestChanges && (
          <button
            type="button"
            className={styles.secondaryBtn}
            disabled={disabled}
            aria-expanded={changesOpen}
            aria-controls={changesId}
            onClick={() => setChangesOpen((open) => !open)}
          >
            Request changes
          </button>
        )}
        {row.demoUrl && (
          <a
            className={styles.secondaryBtn}
            href={row.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open full screen ↗
          </a>
        )}
        {disabled && <span className={styles.busyTag}>saving…</span>}
        <button
          type="button"
          className={styles.textBtn}
          disabled={disabled}
          onClick={dismiss}
          title="Removes this row from the demo queue (demo status back to none). Use it to prune backfilled rows that are not real demos."
        >
          Not a demo
        </button>
      </div>

      {changesOpen && canRequestChanges && (
        <div className={styles.changesBox}>
          <label htmlFor={changesId} className={styles.blockLabel}>
            What needs to change?
          </label>
          <textarea
            id={changesId}
            className={styles.textarea}
            rows={4}
            maxLength={2000}
            autoFocus
            value={changesText}
            placeholder="Be specific: which section, what is wrong, what it should be."
            onChange={(e) => setChangesText(e.target.value)}
          />
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryBtn}
              disabled={disabled || changesText.trim().length === 0}
              onClick={saveChanges}
            >
              Save request
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              disabled={disabled}
              onClick={() => {
                setChangesOpen(false);
                setChangesText('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
