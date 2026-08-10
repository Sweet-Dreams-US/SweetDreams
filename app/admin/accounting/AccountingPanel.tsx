'use client';

/**
 * Interactive half of /admin/accounting: month close, payout history with
 * Mark Paid, and the expense ledger (add + delete).
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  EXPENSE_CATEGORIES,
  BUILDER_LABELS,
  formatPriceCents,
  type Builder,
} from '@/lib/clients/constants';
import styles from '../clients/clients.module.css';

export interface PanelSite {
  id: string;
  name: string;
}

export interface PanelPayout {
  id: string;
  month: string;
  payee: string;
  amount_cents: number;
  status: string;
  paid_at: string | null;
}

export interface PanelExpense {
  id: string;
  site_name: string;
  category: string;
  description: string | null;
  amount_cents: number;
  recurring: boolean;
  month: string | null;
}

export default function AccountingPanel({
  sites,
  payouts,
  expenses,
  defaultMonth,
}: {
  sites: PanelSite[];
  payouts: PanelPayout[];
  expenses: PanelExpense[];
  defaultMonth: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [closeMonth, setCloseMonth] = useState(defaultMonth);

  const [expSite, setExpSite] = useState(sites[0]?.id ?? '');
  const [expCategory, setExpCategory] = useState('vercel');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expRecurring, setExpRecurring] = useState(false);
  const [expMonth, setExpMonth] = useState(defaultMonth);

  async function post(url: string, body: unknown) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        setError(data.error || 'request failed');
        return null;
      }
      return data;
    } catch {
      setError('network error');
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function runClose() {
    const data = await post('/api/admin/accounting/close', { month: closeMonth });
    if (!data) return;
    const parts: string[] = [];
    if (data.payouts_created?.length) parts.push(`Payouts created: ${data.payouts_created.join(', ')}`);
    if (data.payouts_already_existed?.length) parts.push(`Already closed: ${data.payouts_already_existed.join(', ')}`);
    if (data.materialized_recurring) parts.push(`${data.materialized_recurring} recurring cost(s) booked`);
    if (data.unassigned_sites?.length) parts.push(`NO BUILDER SET (skipped): ${data.unassigned_sites.join(', ')}`);
    setNotice(parts.join(' · ') || 'Nothing to close.');
    router.refresh();
  }

  async function markPaid(id: string) {
    const data = await post('/api/admin/payouts/mark-paid', { payout_id: id });
    if (data) router.refresh();
  }

  async function addExpense() {
    const cents = Math.round(parseFloat(expAmount || '0') * 100);
    if (!expSite || !Number.isFinite(cents) || cents <= 0) {
      setError('Pick a site and enter an amount.');
      return;
    }
    const data = await post('/api/admin/expenses/manage', {
      action: 'create',
      site_id: expSite,
      category: expCategory,
      amount_cents: cents,
      description: expDesc,
      recurring: expRecurring,
      month: expRecurring ? undefined : expMonth,
    });
    if (data) {
      setExpAmount('');
      setExpDesc('');
      setNotice('Expense added.');
      router.refresh();
    }
  }

  async function deleteExpense(id: string) {
    const data = await post('/api/admin/expenses/manage', { action: 'delete', id });
    if (data) router.refresh();
  }

  const payeeLabel = (p: string) =>
    p === 'business' ? 'Business (35%)' : `${BUILDER_LABELS[p as Builder] ?? p} (65%)`;

  return (
    <div>
      {(notice || error) && (
        <div className={error ? styles.errorBox : styles.copyBox}>{error || notice}</div>
      )}

      <div className={styles.card}>
        <p className={styles.cardTitle}>Close a month</p>
        <p className={styles.muted} style={{ margin: '0 0 12px' }}>
          Books each recurring cost for the month and creates the payout rows:
          65% of each site to its builder, 35% to the business. Safe to run
          twice — closed months never change.
        </p>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Month</label>
            <input
              className={styles.input}
              type="month"
              value={closeMonth}
              onChange={(e) => setCloseMonth(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.submitRow}>
          <button type="button" className={styles.primaryAction} disabled={busy} onClick={runClose}>
            Close {closeMonth}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Payout history</p>
        {payouts.length === 0 ? (
          <p className={styles.muted}>No months closed yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table} style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Payee</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td className={styles.muted}>{p.month.slice(0, 7)}</td>
                    <td>{payeeLabel(p.payee)}</td>
                    <td className={styles.name}>{formatPriceCents(p.amount_cents)}</td>
                    <td>
                      {p.status === 'paid' ? (
                        <span className={styles.portalYes}>
                          paid {p.paid_at ? p.paid_at.slice(0, 10) : ''}
                        </span>
                      ) : (
                        <span className={styles.agreementViewed}>owed</span>
                      )}
                    </td>
                    <td>
                      {p.status === 'owed' && (
                        <button
                          type="button"
                          className={styles.copyBtn}
                          disabled={busy}
                          onClick={() => markPaid(p.id)}
                        >
                          Mark paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Add an expense</p>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Site</label>
            <select className={styles.select} value={expSite} onChange={(e) => setExpSite(e.target.value)}>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Category</label>
            <select className={styles.select} value={expCategory} onChange={(e) => setExpCategory(e.target.value)}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Amount ($)</label>
            <input className={styles.input} type="number" min="0" step="0.01" value={expAmount}
              onChange={(e) => setExpAmount(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Description</label>
            <input className={styles.input} value={expDesc} onChange={(e) => setExpDesc(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Type</label>
            <div className={styles.radioRow}>
              <label>
                <input type="checkbox" checked={expRecurring} onChange={(e) => setExpRecurring(e.target.checked)} />
                Recurring monthly
              </label>
            </div>
          </div>
          {!expRecurring && (
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Month</label>
              <input className={styles.input} type="month" value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)} />
            </div>
          )}
        </div>
        <div className={styles.submitRow}>
          <button type="button" className={styles.secondaryBtn} disabled={busy} onClick={addExpense}>
            Add Expense
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Expense ledger</p>
        {expenses.length === 0 ? (
          <p className={styles.muted}>No expenses recorded yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table} style={{ minWidth: 760 }}>
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>When</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id}>
                    <td className={styles.name}>{e.site_name}</td>
                    <td><span className={styles.sourceBadge}>{e.category}</span></td>
                    <td>{formatPriceCents(e.amount_cents)}{e.recurring ? '/mo' : ''}</td>
                    <td className={styles.muted}>
                      {e.recurring ? 'recurring template' : (e.month ?? '').slice(0, 7)}
                    </td>
                    <td className={styles.muted}>{e.description ?? ''}</td>
                    <td>
                      <button type="button" className={styles.dangerBtn} disabled={busy}
                        onClick={() => deleteExpense(e.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
