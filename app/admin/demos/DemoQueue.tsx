'use client';

/**
 * Interactive half of /admin/demos: one card per demo with a live preview,
 * the links Cole needs to hand over (demo, admin, repo + local folder), the
 * draft send message, and the decisions only Cole makes (approve, request
 * changes, reopen a sent demo, prune). Every server-changing action POSTs to
 * /api/admin/demos/update and ends with router.refresh() so the server
 * component re-renders fresh data.
 *
 * "Reopen" on a sent demo is the same request_changes action; the API writes
 * the "Reopened after send" wording. demo_notes is a running history that
 * the API appends to, so the card shows the whole thing with line breaks.
 */
import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';
import {
  BUSINESS_TZ,
  DEMO_STATUS_LABELS,
  type DemoAction,
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
  /** sites.github_repo as stored, e.g. "Sweet-Dreams-US/SkinArtistryByIvyDemo". */
  githubRepo: string | null;
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

const IFRAME_SANDBOX =
  'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox';

/** Where every demo project lives locally (one folder per demo, named after the repo). */
const CLIENTS_FOLDER = '~/Desktop/Sweet Dreams/SweetDreamsUS/SweetDreamsClients';

/** Last path segment of an owner/repo string (a full GitHub URL or a trailing .git also work). */
function repoFolderName(repo: string): string {
  const trimmed = repo.trim().replace(/\/+$/, '').replace(/\.git$/, '');
  const slash = trimmed.lastIndexOf('/');
  return slash === -1 ? trimmed : trimmed.slice(slash + 1);
}

/**
 * The Demo Build Standard puts the admin at /admin, so guess it when
 * demo_admin_url is unset. Parsed, not concatenated: only an http(s) demo_url
 * qualifies, and a query or hash on it is dropped rather than glued in front
 * of /admin. null means "do not show an assumed link".
 */
function assumedAdminUrl(demoUrl: string): string | null {
  let u: URL;
  try {
    u = new URL(demoUrl);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  u.pathname = `${u.pathname.replace(/\/+$/, '')}/admin`;
  u.search = '';
  u.hash = '';
  return u.toString();
}

/**
 * demo_notes as a list of entries. Stamped entries ("[Sep 4, 2026 3:12 PM] ...")
 * are blank-line separated by the API and the SQL contract; whatever sits
 * before the first stamp (backfill, link-check lines) is one entry of its own.
 */
function splitNotes(notes: string): string[] {
  return notes
    .split(/\n\n(?=\[)/)
    .map((e) => e.trim())
    .filter(Boolean);
}

/** An entry Cole wrote that the builder still owes a fix for. */
const OPEN_REQUEST_RE = /^\[[^\]]*\] (?:Changes requested:|Reopened after send\.)/;

function fmtStamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return formatInTimeZone(d, BUSINESS_TZ, "MMM d 'at' h:mm a");
}

function fmtShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return formatInTimeZone(d, BUSINESS_TZ, 'MMM d');
}

export default function DemoQueue({
  rows,
  activeStatus = null,
  emptyText,
}: {
  rows: DemoQueueRow[];
  /** The page's ?status= filter, so the empty state can say what is empty. */
  activeStatus?: DemoStatus | null;
  /** Unfiltered empty state; the page overrides it when another section is showing cards. */
  emptyText?: string;
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
          (emptyText ?? 'No demos in the queue.')
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

/**
 * The demo_notes history, newest entry first, in a capped scroll box that a
 * keyboard user can focus and scroll. With highlightOpen, the most recent
 * "Changes requested" / "Reopened after send" entry is called out as the open
 * request so the ask is the first thing in the box.
 */
function NotesHistory({
  notes,
  label,
  highlightOpen,
}: {
  notes: string;
  label: string;
  highlightOpen: boolean;
}) {
  const entries = splitNotes(notes).reverse();
  const openIndex = highlightOpen ? entries.findIndex((e) => OPEN_REQUEST_RE.test(e)) : -1;
  return (
    <div className={styles.notesText} tabIndex={0} role="region" aria-label={label}>
      {entries.map((entry, i) => (
        <p
          key={`${i}-${entry.slice(0, 40)}`}
          className={`${styles.notesEntry} ${i === openIndex ? styles.notesEntryOpen : ''}`}
        >
          {i === openIndex && <span className={styles.notesEyebrow}>Open request</span>}
          {entry}
        </p>
      ))}
    </div>
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
  const isWaiting = row.demoStatus === 'ready_for_review';
  const isChanges = row.demoStatus === 'changes_requested';
  // A sent demo can be pulled back for more work; that is the same
  // request_changes action, labelled "Reopen" here and worded by the API.
  const isSent = row.demoStatus === 'sent';
  const canRequestChanges =
    row.demoStatus === 'ready_for_review' || row.demoStatus === 'approved' || isSent;

  // demo_admin_url when we have it; otherwise the standard /admin path, flagged as assumed.
  const adminHref =
    row.adminUrl || (row.demoUrl ? assumedAdminUrl(row.demoUrl) : null);

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

  // The full demo_notes history, newest first, line breaks kept. On a
  // changes_requested card it is the point of the card, so it sits under the
  // head, above the preview, with the open request called out; everywhere
  // else it stays below the links.
  const notesBlock = isChanges ? (
    <div className={`${styles.notes} ${styles.notesChanges}`}>
      <p className={styles.blockLabel}>Change history</p>
      {row.notes ? (
        <NotesHistory notes={row.notes} label="Change history" highlightOpen />
      ) : (
        <p className={styles.muted}>No change history recorded.</p>
      )}
    </div>
  ) : row.notes ? (
    <div className={styles.notes}>
      <p className={styles.blockLabel}>Notes</p>
      <NotesHistory notes={row.notes} label="Notes" highlightOpen={false} />
    </div>
  ) : null;

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

      {isChanges && notesBlock}

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
        {adminHref && (
          <div className={styles.linkRow}>
            <dt>Admin</dt>
            <dd>
              <a href={adminHref} target="_blank" rel="noopener noreferrer">
                {adminHref}
              </a>
              {!row.adminUrl && (
                <span
                  className={styles.assumed}
                  title="demo_admin_url is not set; this is the demo URL plus /admin, which is where the Demo Build Standard puts it."
                >
                  (assumed)
                </span>
              )}
              <CopyButton text={adminHref} />
            </dd>
          </div>
        )}
        {row.adminUrl && (
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
        )}
        <div className={`${styles.linkRow} ${row.githubRepo ? styles.repoRow : ''}`}>
          <dt>Repo</dt>
          {row.githubRepo ? (
            <dd className={styles.repoCell}>
              <span className={styles.repoLine}>
                <code className={styles.repo}>{row.githubRepo}</code>
                <CopyButton text={row.githubRepo} />
              </span>
              <span className={styles.hint}>
                Folder: {CLIENTS_FOLDER}/{repoFolderName(row.githubRepo)}/
              </span>
            </dd>
          ) : (
            <dd>
              <span className={styles.muted}>
                not set
                {row.clientId && (
                  <>
                    {' · '}
                    <Link href={`/admin/clients/${row.clientId}`} className={styles.hintLink}>
                      add it on the client page
                    </Link>
                  </>
                )}
              </span>
            </dd>
          )}
        </div>
        {row.vercelProjectId && (
          <div className={styles.linkRow}>
            <dt>Vercel</dt>
            <dd>
              <span className={styles.muted}>{row.vercelProjectId}</span>
            </dd>
          </div>
        )}
      </dl>

      {!isChanges && notesBlock}

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
          // On a changes_requested card the builder owns the next step, so
          // approving the un-fixed demo is a deliberate override, not the
          // loudest button on the card. Same transition either way.
          <button
            type="button"
            className={isChanges ? styles.secondaryBtn : styles.primaryBtn}
            disabled={disabled || !row.demoUrl}
            title={row.demoUrl ? undefined : 'Needs a demo URL before it can be approved'}
            onClick={approve}
          >
            {isChanges ? 'Approve as-is' : 'Approve & queue for send'}
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
            {isSent ? 'Reopen' : 'Request changes'}
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
            {isSent
              ? 'What needs to change? Saving reopens this demo for the builder.'
              : 'What needs to change?'}
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
              {isSent ? 'Reopen with notes' : 'Save request'}
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
