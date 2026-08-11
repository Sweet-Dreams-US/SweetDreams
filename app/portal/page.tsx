/**
 * Portal dashboard.
 *
 * Reads through the USER-scoped SSR client so Row Level Security is the
 * boundary: this page can only ever see the clients, sites, agreements,
 * updates, and requests linked to the logged-in account.
 */
import { formatInTimeZone } from 'date-fns-tz';
import { createClient } from '@/utils/supabase/server';
import {
  SITE_STATUS_LABELS,
  SITE_STATUS_PORTAL_COPY,
  analyticsIncludedAtPrice,
  formatPriceCents,
  type SiteStatus,
} from '@/lib/clients/constants';
import { upcomingChargeDate } from '@/lib/clients/billing';
import { currentQuarterWindow, hoursUsedInWindow } from '@/lib/clients/quarters';
import { BUSINESS_TZ } from '@/lib/agreements/service';
import PortalBillingCard from './PortalBillingCard';
import PortalSiteCard, { type CardSite } from './PortalSiteCard';
import styles from './portal.module.css';

export const dynamic = 'force-dynamic';

interface PortalSite {
  id: string;
  name: string;
  status: string;
  live_url: string | null;
  preview_url: string | null;
  go_live_date: string | null;
  hosting_price_cents: number;
  update_hours_per_quarter: number | null;
  billing_anchor_day: number;
  analytics_addon: boolean;
  billing_starts_on: string | null;
}

interface PortalAgreement {
  id: string;
  site_id: string;
  status: string;
}

interface PortalClient {
  id: string;
  business_name: string;
  contact_name: string;
  payment_method_saved_at: string | null;
  sites: PortalSite[];
  agreements: PortalAgreement[];
}

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string; welcome?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const params = await searchParams;

  const { data } = await supabase
    .from('clients')
    .select(
      `id, business_name, contact_name, payment_method_saved_at,
       sites (id, name, status, live_url, preview_url, go_live_date, hosting_price_cents, update_hours_per_quarter, billing_anchor_day, analytics_addon, billing_starts_on),
       agreements (id, site_id, status)`
    )
    .eq('auth_user_id', user?.id ?? '')
    .is('archived_at', null)
    .order('created_at', { ascending: true });

  const clients = ((data as unknown as PortalClient[] | null) ?? []).map((c) => ({
    ...c,
    sites: c.sites ?? [],
    agreements: c.agreements ?? [],
  }));

  if (clients.length === 0) {
    return (
      <div className={styles.empty}>
        <h1 className={styles.pageTitle}>Welcome</h1>
        <p className={styles.emptyText}>
          No website account is linked to this login yet. If you just signed
          your agreement, give it a minute and refresh. Otherwise email{' '}
          <a href="mailto:cole@sweetdreams.us">cole@sweetdreams.us</a> and we
          will get you connected.
        </p>
      </div>
    );
  }

  const siteIds = clients.flatMap((c) => c.sites.map((s) => s.id));
  const [{ data: updatesData }, { data: requestsData }] = await Promise.all([
    supabase
      .from('site_updates')
      .select('id, site_id, created_at, title, summary, hours_used')
      .in('site_id', siteIds.length ? siteIds : ['00000000-0000-0000-0000-000000000000'])
      .order('created_at', { ascending: false }),
    supabase
      .from('update_requests')
      .select('id, site_id, created_at, title, details, status, preview_url')
      .in('site_id', siteIds.length ? siteIds : ['00000000-0000-0000-0000-000000000000'])
      .order('created_at', { ascending: false }),
  ]);

  const allUpdates = (updatesData ?? []) as {
    id: string;
    site_id: string;
    created_at: string;
    title: string;
    summary: string;
    hours_used: number | string | null;
  }[];
  const allRequests = (requestsData ?? []) as {
    id: string;
    site_id: string;
    created_at: string;
    title: string;
    details: string | null;
    status: string;
    preview_url: string | null;
  }[];

  const firstName = clients[0].contact_name?.split(' ')[0] ?? '';
  const hasSigned = clients.some((c) => c.agreements.some((a) => a.status === 'signed'));
  const paymentSaved = clients.some((c) => c.payment_method_saved_at);

  return (
    <div>
      <h1 className={styles.pageTitle}>{firstName ? `Hi ${firstName}` : 'Your website'}</h1>

      {params.welcome === '1' && (
        <p className={styles.billingSaved}>
          Your account is created and you are signed in as{' '}
          <strong>{user?.email}</strong>. Use that email to log in anytime.
        </p>
      )}
      {params.billing === 'saved' && (
        <p className={styles.billingSaved}>
          Payment method saved. You will not be charged until your website is live.
        </p>
      )}
      {params.billing === 'error' && (
        <p className={styles.error}>
          Something went wrong saving your payment method. Please try again or
          email cole@sweetdreams.us.
        </p>
      )}

      {hasSigned && !paymentSaved && <PortalBillingCard />}

      {clients.map((client) => (
        <section key={client.id} className={styles.clientBlock}>
          {clients.length > 1 && (
            <h2 className={styles.businessName}>{client.business_name}</h2>
          )}

          {client.sites.map((site) => {
            const status = site.status as SiteStatus;
            const signedAgreement = client.agreements.find(
              (a) => a.status === 'signed' && a.site_id === site.id
            );
            const isLive = status === 'live';
            const nextCharge = isLive
              ? upcomingChargeDate(site.billing_anchor_day, site.billing_starts_on)
              : null;
            const quarter = isLive ? currentQuarterWindow(site.go_live_date) : null;
            const siteUpdates = allUpdates.filter((u) => u.site_id === site.id);

            const card: CardSite = {
              id: site.id,
              name: site.name,
              status,
              statusLabel: SITE_STATUS_LABELS[status] ?? site.status,
              statusCopy: SITE_STATUS_PORTAL_COPY[status] ?? '',
              live_url: site.live_url,
              preview_url: site.preview_url,
              agreementId: signedAgreement?.id ?? null,
              monthlyDisplay: formatPriceCents(site.hosting_price_cents),
              anchorDayDisplay: site.billing_anchor_day === 15 ? '15th' : '1st',
              nextChargeDisplay: nextCharge
                ? formatInTimeZone(nextCharge, BUSINESS_TZ, 'MMMM d, yyyy')
                : null,
              paymentOnFile: Boolean(client.payment_method_saved_at),
              hoursIncluded: site.update_hours_per_quarter ?? 0,
              hoursUsed: quarter ? hoursUsedInWindow(siteUpdates, quarter) : null,
              quarterEndsDisplay: quarter
                ? formatInTimeZone(quarter.end, BUSINESS_TZ, 'MMMM d')
                : null,
              analyticsIncluded:
                analyticsIncludedAtPrice(site.hosting_price_cents) || site.analytics_addon,
              updates: siteUpdates.map((u) => ({
                id: u.id,
                created_at: u.created_at,
                title: u.title,
                summary: u.summary,
                hours_used: u.hours_used,
              })),
              requests: allRequests
                .filter((r) => r.site_id === site.id)
                .map((r) => ({
                  id: r.id,
                  created_at: r.created_at,
                  title: r.title,
                  details: r.details,
                  status: r.status,
                  preview_url: r.preview_url,
                })),
            };

            return <PortalSiteCard key={site.id} site={card} />;
          })}
        </section>
      ))}
    </div>
  );
}
