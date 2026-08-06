'use client';

import { useState } from 'react';
import styles from './inquiries.module.css';

export interface Inquiry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  what_you_do: string | null;
  funnel: string;
  source: string;
  from_ad: boolean;
  status: string;
  admin_notes: string | null;
}

const STATUSES = ['new', 'contacted', 'building', 'signed', 'live', 'declined'] as const;

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function InquiriesTable({ rows }: { rows: Inquiry[] }) {
  if (rows.length === 0) {
    return <div className={styles.empty}>No inquiries match this filter yet.</div>;
  }
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Received</th>
            <th>Business</th>
            <th>Contact</th>
            <th>Source</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <InquiryRow key={r.id} row={r} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InquiryRow({ row }: { row: Inquiry }) {
  const [status, setStatus] = useState(row.status);
  const [notes, setNotes] = useState(row.admin_notes ?? '');
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function save(patch: { status?: string; notes?: string }) {
    setState('saving');
    try {
      const res = await fetch('/api/admin/leads/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row.id, ...patch }),
      });
      if (res.ok) {
        setState('saved');
        setTimeout(() => setState('idle'), 1600);
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  return (
    <tr>
      <td className={styles.muted}>
        <time dateTime={row.created_at} title={row.created_at}>{fmtDate(row.created_at)}</time>
      </td>
      <td>
        <div className={styles.biz}>{row.business_name || '—'}</div>
        {row.what_you_do && <div className={styles.muted}>{row.what_you_do}</div>}
      </td>
      <td>
        {row.name && <div className={styles.name}>{row.name}</div>}
        {row.email && (
          <a className={styles.email} href={`mailto:${row.email}`}>{row.email}</a>
        )}
        {row.phone && <div className={styles.muted}>{row.phone.replace(/^p:/, '')}</div>}
      </td>
      <td>
        <span className={styles.sourceBadge}>{row.source}</span>
        {row.from_ad && <span className={styles.adBadge}>ad</span>}
      </td>
      <td>
        <select
          className={`${styles.statusSelect} ${styles[`st_${status}`] || ''}`}
          value={status}
          onChange={(e) => {
            const next = e.target.value;
            setStatus(next);
            save({ status: next });
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.notesCell}>
        <input
          className={styles.notesInput}
          value={notes}
          placeholder="Add a note…"
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if (notes !== (row.admin_notes ?? '')) save({ notes });
          }}
        />
        <span className={`${styles.saveTag} ${styles[`save_${state}`] || ''}`} aria-live="polite">
          {state === 'saving' ? 'saving…' : state === 'saved' ? 'saved ✓' : state === 'error' ? 'error' : ''}
        </span>
      </td>
    </tr>
  );
}
