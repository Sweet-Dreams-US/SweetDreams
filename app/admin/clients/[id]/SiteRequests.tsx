'use client';

/**
 * Admin: the update request queue for one site, plus posting the plain
 * English updates the client reads. Completing a request logs the hours
 * that draw down their quarterly allowance (only counted once live).
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../clients.module.css';

export interface AdminRequest {
  id: string;
  site_id: string;
  created_at: string;
  title: string;
  details: string | null;
  status: string;
  preview_url: string | null;
  admin_notes: string | null;
}

export interface AdminUpdate {
  id: string;
  site_id: string;
  created_at: string;
  title: string;
  summary: string;
  hours_used: number | string | null;
}

const STATUSES = ['new', 'in_progress', 'preview_ready', 'done', 'declined'] as const;

export default function SiteRequests({
  siteId,
  requests,
  updates,
}: {
  siteId: string;
  requests: AdminRequest[];
  updates: AdminUpdate[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [completing, setCompleting] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', summary: '', hours: '0.5' });
  const [postOpen, setPostOpen] = useState(false);

  async function post(body: Record<string, unknown>) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/admin/requests/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        setError(data.error || 'request failed');
        return null;
      }
      router.refresh();
      return data;
    } catch {
      setError('network error');
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function saveField(requestId: string, patch: Record<string, unknown>) {
    await post({ action: 'update', request_id: requestId, ...patch });
  }

  async function complete(requestId: string | null) {
    if (form.title.trim().length < 3 || form.summary.trim().length < 3) {
      setError('Give the update a short title and a plain English summary.');
      return;
    }
    const data = await post({
      action: requestId ? 'complete' : 'post',
      request_id: requestId ?? undefined,
      site_id: siteId,
      title: form.title,
      summary: form.summary,
      hours_used: Number(form.hours || '0'),
    });
    if (data) {
      setForm({ title: '', summary: '', hours: '0.5' });
      setCompleting(null);
      setPostOpen(false);
      setNotice(
        data.email_ok === false
          ? 'Update posted, but the client email failed to send.'
          : 'Update posted and emailed to the client.'
      );
    }
  }

  const open = requests.filter((r) => r.status !== 'done' && r.status !== 'declined');
  const closed = requests.filter((r) => r.status === 'done' || r.status === 'declined');

  return (
    <div style={{ marginTop: 18 }}>
      <p className={styles.fieldLabel} style={{ marginBottom: 8 }}>
        Update requests ({open.length} open)
      </p>

      {(notice || error) && (
        <div className={error ? styles.errorBox : styles.copyBox}>{error || notice}</div>
      )}

      {requests.length === 0 && (
        <p className={styles.muted}>No requests from this client yet.</p>
      )}

      {[...open, ...closed].map((r) => (
        <div key={r.id} className={styles.card} style={{ marginBottom: 10 }}>
          <div className={styles.formGrid}>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <span className={styles.kvValue}>{r.title}</span>
              {r.details && <span className={styles.muted}>{r.details}</span>}
              <span className={styles.muted}>
                asked {new Date(r.created_at).toLocaleDateString('en-US')}
              </span>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Status</label>
              <select
                className={styles.select}
                value={r.status}
                disabled={busy}
                onChange={(e) => saveField(r.id, { status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Preview URL (client sees this)</label>
              <input
                className={styles.input}
                defaultValue={r.preview_url ?? ''}
                placeholder="https://...vercel.app"
                onBlur={(e) => {
                  if (e.target.value !== (r.preview_url ?? '')) {
                    saveField(r.id, { preview_url: e.target.value });
                  }
                }}
              />
            </div>
          </div>

          {r.status !== 'done' && (
            <div className={styles.submitRow}>
              {completing === r.id ? (
                <div style={{ width: '100%' }}>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Update title</label>
                      <input
                        className={styles.input}
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Hours used</label>
                      <input
                        className={styles.input}
                        type="number"
                        min="0"
                        step="0.25"
                        value={form.hours}
                        onChange={(e) => setForm({ ...form, hours: e.target.value })}
                      />
                    </div>
                    <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                      <label className={styles.fieldLabel}>
                        Plain English summary (this is what the client reads)
                      </label>
                      <input
                        className={styles.input}
                        value={form.summary}
                        placeholder="We added your new summer hours to the homepage."
                        onChange={(e) => setForm({ ...form, summary: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.submitRow}>
                    <button
                      type="button"
                      className={styles.primaryAction}
                      disabled={busy}
                      onClick={() => complete(r.id)}
                    >
                      Post Update + Mark Done
                    </button>
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={() => setCompleting(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => {
                    setCompleting(r.id);
                    setForm({ title: r.title, summary: '', hours: '0.5' });
                  }}
                >
                  Mark done + tell the client
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      <div className={styles.submitRow}>
        {postOpen ? (
          <div style={{ width: '100%' }}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Update title</label>
                <input
                  className={styles.input}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Hours used</label>
                <input
                  className={styles.input}
                  type="number"
                  min="0"
                  step="0.25"
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: e.target.value })}
                />
              </div>
              <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.fieldLabel}>
                  Plain English summary (this is what the client reads)
                </label>
                <input
                  className={styles.input}
                  value={form.summary}
                  placeholder="We made your photos load faster on phones."
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.submitRow}>
              <button
                type="button"
                className={styles.primaryAction}
                disabled={busy}
                onClick={() => complete(null)}
              >
                Post Update
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={() => setPostOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => {
              setPostOpen(true);
              setForm({ title: '', summary: '', hours: '0.5' });
            }}
          >
            + Post an update (no request)
          </button>
        )}
      </div>

      {updates.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <p className={styles.fieldLabel} style={{ marginBottom: 6 }}>
            Posted updates
          </p>
          <ul className={styles.timeline}>
            {updates.map((u) => (
              <li key={u.id}>
                <strong>{u.title}</strong> · {Number(u.hours_used ?? 0)} hr ·{' '}
                {new Date(u.created_at).toLocaleDateString('en-US')}
                <div className={styles.timelineMuted}>{u.summary}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
