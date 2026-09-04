/**
 * Admin: Accounting — the money page.
 *
 * Overall numbers (MRR, payout obligations, business share, costs, running
 * balance), per-client profitability with the 65/35 builder split, month
 * close, payout history, and the expense ledger.
 */
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import {
  BUILDER_LABELS,
  BUILDER_SHARE,
  formatPriceCents,
  type Builder,
} from '@/lib/clients/constants';
import AccountingPanel, {
  type PanelExpense,
  type PanelPayout,
  type PanelSite,
} from './AccountingPanel';
import styles from '../clients/clients.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface AcctSite {
  id: string;
  name: string;
  status: string;
  hosting_price_cents: number;
  builder: string | null;
  clients: { business_name: string } | null;
}

interface ExpenseRow {
  id: string;
  site_id: string;
  category: string;
  description: string | null;
  amount_cents: number;
  recurring: boolean;
  month: string | null;
}

export default async function AccountingPage() {
  const cookieStore = await cookies();
  if (!verifySession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect('/admin/login?return=/admin/accounting');
  }

  const supabase = createServiceRoleClient();
  const [{ data: sitesData }, { data: expensesData }, { data: payoutsData }] =
    await Promise.all([
      supabase
        .from('sites')
        .select('id, name, status, hosting_price_cents, builder, clients (business_name)')
        .order('hosting_price_cents', { ascending: false }),
      supabase
        .from('site_expenses')
        .select('id, site_id, category, description, amount_cents, recurring, month')
        .order('created_at', { ascending: false }),
      supabase
        .from('payouts')
        .select('id, month, payee, amount_cents, status, paid_at')
        .order('month', { ascending: false }),
    ]);

  const sites = ((sitesData as unknown as AcctSite[] | null) ?? []);
  const expenses = ((expensesData as unknown as ExpenseRow[] | null) ?? []);
  const payouts = ((payoutsData as unknown as PanelPayout[] | null) ?? []);

  const siteName = (id: string) => sites.find((s) => s.id === id)?.name ?? 'unknown';

  const recurringBySite = new Map<string, number>();
  const oneTimeBySite = new Map<string, number>();
  for (const e of expenses) {
    if (e.recurring) {
      recurringBySite.set(e.site_id, (recurringBySite.get(e.site_id) ?? 0) + e.amount_cents);
    } else {
      oneTimeBySite.set(e.site_id, (oneTimeBySite.get(e.site_id) ?? 0) + e.amount_cents);
    }
  }

  let mrr = 0;
  let builderObligation = 0;
  let businessShare = 0;
  let unassignedRevenue = 0;
  const recurringTotal = [...recurringBySite.values()].reduce((a, b) => a + b, 0);

  const rows = sites.map((s) => {
    const paying = s.status === 'live' && s.hosting_price_cents > 0;
    const revenue = paying ? s.hosting_price_cents : 0;
    const cut = s.builder ? Math.round(revenue * BUILDER_SHARE) : 0;
    const kept = s.builder ? revenue - cut : 0;
    const recurring = recurringBySite.get(s.id) ?? 0;
    const oneTime = oneTimeBySite.get(s.id) ?? 0;
    const net = s.builder ? kept - recurring : revenue - recurring;
    if (paying) {
      mrr += revenue;
      if (s.builder) {
        builderObligation += cut;
        businessShare += kept;
      } else {
        unassignedRevenue += revenue;
      }
    }
    return { s, revenue, cut, kept, recurring, oneTime, net, paying };
  });

  const datedExpensesTotal = expenses
    .filter((e) => !e.recurring)
    .reduce((a, e) => a + e.amount_cents, 0);
  const businessBooked = payouts
    .filter((p) => p.payee === 'business')
    .reduce((a, p) => a + p.amount_cents, 0);
  const balance = businessBooked - datedExpensesTotal;

  const panelSites: PanelSite[] = sites.map((s) => ({ id: s.id, name: s.name }));
  const panelExpenses: PanelExpense[] = expenses.map((e) => ({
    id: e.id,
    site_name: siteName(e.site_id),
    category: e.category,
    description: e.description,
    amount_cents: e.amount_cents,
    recurring: e.recurring,
    month: e.month,
  }));
  const defaultMonth = new Date().toISOString().slice(0, 7);

  return (
    <div className={styles.page}>
      <nav className={styles.topNav}>
        <Link href="/admin/demos" className={styles.navLink}>Demos</Link>
        <Link href="/admin/clients" className={styles.navLink}>Clients</Link>
        <Link href="/admin/inquiries" className={styles.navLink}>Free Website Inquiries</Link>
        <span className={`${styles.navLink} ${styles.navLinkActive}`}>Accounting</span>
        <a href="/api/admin/logout" className={styles.navLink}>Sign out</a>
      </nav>

      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>MONEY</p>
          <h1 className={styles.title}>Accounting</h1>
          <p className={styles.subtitle}>
            Builder gets 65% of each site, the business keeps 35%. Keep every
            site&apos;s costs under the 35% and the business profits. Close each
            month to book costs and payouts, then mark them paid.
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{formatPriceCents(mrr)}</span>
            <span className={styles.statLabel}>Paying MRR</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{formatPriceCents(builderObligation)}</span>
            <span className={styles.statLabel}>Builders 65% / mo</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{formatPriceCents(businessShare)}</span>
            <span className={styles.statLabel}>Business 35% / mo</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{formatPriceCents(recurringTotal)}</span>
            <span className={styles.statLabel}>Recurring Costs / mo</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: balance < 0 ? '#fca5a5' : undefined }}>
              {formatPriceCents(balance)}
            </span>
            <span className={styles.statLabel}>Business Balance</span>
          </div>
        </div>
      </header>

      {unassignedRevenue > 0 && (
        <div className={styles.errorBox}>
          {formatPriceCents(unassignedRevenue)}/mo of paying revenue has NO
          builder assigned — set Jay or Cole on each site (client page) so the
          65/35 split and month close include it.
        </div>
      )}

      <div className={styles.tableWrap} style={{ marginBottom: 18 }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Builder</th>
              <th>Revenue / mo</th>
              <th>Builder 65%</th>
              <th>Business 35%</th>
              <th>Costs / mo</th>
              <th>Net / mo</th>
              <th>One time + writeoffs</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ s, revenue, cut, kept, recurring, oneTime, net, paying }) => (
              <tr key={s.id}>
                <td className={styles.name}>{s.clients?.business_name ?? s.name}</td>
                <td>
                  {s.builder ? (
                    BUILDER_LABELS[s.builder as Builder]
                  ) : paying ? (
                    <span className={styles.agreementViewed}>assign!</span>
                  ) : (
                    <span className={styles.muted}>—</span>
                  )}
                </td>
                <td>{paying ? formatPriceCents(revenue) : <span className={styles.muted}>$0</span>}</td>
                <td className={styles.muted}>{s.builder && paying ? formatPriceCents(cut) : '—'}</td>
                <td className={styles.muted}>{s.builder && paying ? formatPriceCents(kept) : '—'}</td>
                <td className={styles.muted}>{recurring ? formatPriceCents(recurring) + '/mo' : '—'}</td>
                <td style={{ color: net < 0 ? '#fca5a5' : '#86efac', fontWeight: 700 }}>
                  {formatPriceCents(net)}
                </td>
                <td className={styles.muted}>{oneTime ? formatPriceCents(oneTime) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AccountingPanel
        sites={panelSites}
        payouts={payouts}
        expenses={panelExpenses}
        defaultMonth={defaultMonth}
      />

      <footer className={styles.footer}>
        <p>
          Net / mo = business 35% minus recurring costs (or full revenue minus
          costs while no builder is assigned). Balance = booked business shares
          minus all dated expenses.
        </p>
      </footer>
    </div>
  );
}
