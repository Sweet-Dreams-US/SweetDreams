/**
 * Portal dashboard (Foundation stub).
 *
 * Reads through the USER-scoped SSR client so Row Level Security is the
 * boundary being exercised, not app code: this page can only ever see the
 * clients/sites/signed agreements linked to the logged-in auth user.
 */
import { createClient } from '@/utils/supabase/server';
import {
  SITE_STATUS_LABELS,
  SITE_STATUS_PORTAL_COPY,
  type SiteStatus,
} from '@/lib/clients/constants';
import styles from './portal.module.css';

export const dynamic = 'force-dynamic';

interface PortalSite {
  id: string;
  name: string;
  status: string;
  live_url: string | null;
  domain: string | null;
  go_live_date: string | null;
}

interface PortalAgreement {
  id: string;
  status: string;
  signed_at: string | null;
}

interface PortalClient {
  id: string;
  business_name: string;
  contact_name: string;
  sites: PortalSite[];
  agreements: PortalAgreement[];
}

export default async function PortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('clients')
    .select(
      'id, business_name, contact_name, sites (id, name, status, live_url, domain, go_live_date), agreements (id, status, signed_at)'
    )
    .eq('auth_user_id', user?.id ?? '')
    .is('archived_at', null)
    .order('created_at', { ascending: true });

  const clients = (data ?? []) as unknown as PortalClient[];

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

  return (
    <div>
      <h1 className={styles.pageTitle}>
        Welcome back, {clients[0].contact_name.split(' ')[0]}
      </h1>

      {clients.map((client) => (
        <section key={client.id} className={styles.clientBlock}>
          <h2 className={styles.businessName}>{client.business_name}</h2>

          {client.sites.map((site) => {
            const status = site.status as SiteStatus;
            return (
              <div key={site.id} className={styles.siteCard}>
                <div className={styles.siteHead}>
                  <span className={styles.siteName}>{site.name}</span>
                  <span
                    className={`${styles.statusPill} ${styles['st_' + status] ?? ''}`}
                  >
                    {SITE_STATUS_LABELS[status] ?? site.status}
                  </span>
                </div>
                <p className={styles.statusCopy}>
                  {SITE_STATUS_PORTAL_COPY[status] ?? ''}
                </p>
                {site.live_url && (
                  <a
                    className={styles.liveLink}
                    href={site.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit your live website ↗
                  </a>
                )}
              </div>
            );
          })}

          {client.agreements
            .filter((a) => a.status === 'signed')
            .map((a) => (
              <a
                key={a.id}
                className={styles.agreementLink}
                href={`/portal/agreement/${a.id}`}
              >
                View your signed agreement
              </a>
            ))}
        </section>
      ))}
    </div>
  );
}
