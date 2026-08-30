/**
 * Portal: referral program page. Signed clients only.
 *
 * Shows the client's tracked share link (/free-website?ref=CODE), what THEIR
 * plan earns per live referral (never the whole tier table), and the live
 * progress of everyone who signed up through their link.
 *
 * Reads of the client's own rows go through the RLS-scoped client; the
 * referral activity behind them (leads, referred businesses) is read with the
 * service role and shaped down to safe fields (business name + stage only).
 */
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { SITE_URL } from '@/lib/constants';
import { ensureReferralCode, referralMonthsForPrice } from '@/lib/referrals';
import ReferralShare from './ReferralShare';
import styles from '../portal.module.css';

export const dynamic = 'force-dynamic';

interface RefClient {
  id: string;
  business_name: string;
  sites: { id: string; status: string; hosting_price_cents: number }[];
  agreements: { id: string; status: string }[];
}

interface ActivityRow {
  name: string;
  date: string;
  stage: 'new' | 'progress' | 'live';
  stageLabel: string;
}

const IN_PROGRESS_STATUSES = new Set([
  'signed',
  'building',
  'client_review',
  'approved',
  'awaiting_payment',
]);

async function pageBaseUrl(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    if (host) {
      const proto = h.get('x-forwarded-proto') ?? 'https';
      return `${proto}://${host}`;
    }
  } catch {
    // fall through
  }
  return SITE_URL;
}

export default async function ReferralsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('clients')
    .select(
      `id, business_name,
       sites (id, status, hosting_price_cents),
       agreements (id, status)`
    )
    .eq('auth_user_id', user?.id ?? '')
    .is('archived_at', null)
    .order('created_at', { ascending: true });

  const clients = ((data as unknown as RefClient[] | null) ?? []).map((c) => ({
    ...c,
    sites: c.sites ?? [],
    agreements: c.agreements ?? [],
  }));
  const signedClients = clients.filter((c) =>
    c.agreements.some((a) => a.status === 'signed')
  );

  if (signedClients.length === 0) {
    return (
      <div>
        <h1 className={styles.pageTitle}>Referrals</h1>
        <div className={styles.lockedBox}>
          <p className={styles.lockedTitle}>Referrals unlock after you sign</p>
          <p className={styles.lockedText}>
            Once your agreement is signed, you get a personal link to share.
            Businesses you send our way get their website built free, and you
            earn free hosting when theirs goes live.
          </p>
        </div>
      </div>
    );
  }

  const svc = createServiceRoleClient();
  const baseUrl = await pageBaseUrl();

  // One share link per signed business (almost always exactly one).
  const blocks = [] as {
    client: RefClient;
    code: string | null;
    months: number;
    activity: ActivityRow[];
    monthsEarned: number;
    liveCount: number;
  }[];

  for (const client of signedClients) {
    const code = await ensureReferralCode(svc, client.id);

    const activeSites = client.sites.filter(
      (s) => s.status !== 'cancelled' && s.status !== 'declined'
    );
    const planCents = activeSites.length
      ? Math.max(...activeSites.map((s) => s.hosting_price_cents))
      : 5000;
    const months = referralMonthsForPrice(planCents);

    let activity: ActivityRow[] = [];
    let monthsEarned = 0;
    let liveCount = 0;

    if (code) {
      const { data: leadsData } = await svc
        .from('marketing_leads')
        .select('id, created_at, business_name, first_name, last_name')
        .eq('referred_by_code', code)
        .order('created_at', { ascending: false });
      const leads = (leadsData ?? []) as {
        id: string;
        created_at: string;
        business_name: string | null;
        first_name: string | null;
        last_name: string | null;
      }[];

      const leadIds = leads.map((l) => l.id);
      const { data: convertedData } = leadIds.length
        ? await svc
            .from('clients')
            .select('id, source_lead_id')
            .in('source_lead_id', leadIds)
        : { data: [] };
      const converted = (convertedData ?? []) as {
        id: string;
        source_lead_id: string | null;
      }[];
      const convertedByLead = new Map(
        converted.map((c) => [c.source_lead_id ?? '', c.id])
      );
      const convertedIds = converted.map((c) => c.id);

      const { data: refSitesData } = convertedIds.length
        ? await svc.from('sites').select('client_id, status').in('client_id', convertedIds)
        : { data: [] };
      const refSites = (refSitesData ?? []) as { client_id: string; status: string }[];

      const { data: rewardsData } = await svc
        .from('referral_rewards')
        .select('referred_client_id, months_free, status')
        .eq('referrer_client_id', client.id);
      const rewards = (rewardsData ?? []) as {
        referred_client_id: string;
        months_free: number;
        status: string;
      }[];
      monthsEarned = rewards.reduce((sum, r) => sum + r.months_free, 0);
      const rewardByClient = new Map(rewards.map((r) => [r.referred_client_id, r]));

      activity = leads.map((lead) => {
        const name =
          lead.business_name ||
          `${lead.first_name ?? ''} ${lead.last_name ?? ''}`.trim() ||
          'A business';
        const date = new Date(lead.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const convertedId = convertedByLead.get(lead.id);
        const reward = convertedId ? rewardByClient.get(convertedId) : undefined;
        const clientSites = convertedId
          ? refSites.filter((s) => s.client_id === convertedId)
          : [];

        if (reward || clientSites.some((s) => s.status === 'live')) {
          liveCount++;
          return {
            name,
            date,
            stage: 'live' as const,
            stageLabel: reward
              ? `Website live · you earned ${reward.months_free} months free`
              : 'Website live',
          };
        }
        if (convertedId && clientSites.some((s) => IN_PROGRESS_STATUSES.has(s.status))) {
          return {
            name,
            date,
            stage: 'progress' as const,
            stageLabel: 'Signed on, website in progress',
          };
        }
        return { name, date, stage: 'new' as const, stageLabel: 'Signed up through your link' };
      });
    }

    blocks.push({ client, code, months, activity, monthsEarned, liveCount });
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Referrals</h1>

      {blocks.map(({ client, code, months, activity, monthsEarned, liveCount }) => (
        <section key={client.id} className={styles.clientBlock}>
          {blocks.length > 1 && (
            <h2 className={styles.businessName}>{client.business_name}</h2>
          )}

          <div className={styles.shareCard}>
            <p className={styles.billingTitle}>
              Give a free website, get free hosting
            </p>
            <p className={styles.billingText}>
              Know a business that needs a website? Share your link below. We
              build their website free, just like we did for you, and they only
              pay monthly hosting.
            </p>
            <p className={styles.shareReward}>
              Every referral that goes officially live earns you {months} months
              of hosting free.
            </p>
            {code ? (
              <ReferralShare link={`${baseUrl}/free-website?ref=${code}`} />
            ) : (
              <p className={styles.muted}>
                We could not load your link right now. Refresh the page or email
                cole@sweetdreams.us.
              </p>
            )}
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>How it works</h3>
            <ol className={styles.howList}>
              <li>Share your link with a business owner you know.</li>
              <li>They sign up and we build their website free.</li>
              <li>
                When their website officially goes live, {months} months of
                hosting free are applied to your upcoming bills.
              </li>
            </ol>
          </div>

          <div className={styles.statRow}>
            <div className={styles.statBox}>
              <div className={styles.statNum}>{activity.length}</div>
              <div className={styles.statLabel}>signed up with your link</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNum}>{liveCount}</div>
              <div className={styles.statLabel}>websites live</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNum}>{monthsEarned}</div>
              <div className={styles.statLabel}>free months earned</div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Your referrals</h3>
            {activity.length === 0 ? (
              <p className={styles.muted}>
                No one has used your link yet. Send it to a business owner who
                could use a great website.
              </p>
            ) : (
              <div className={styles.requestList}>
                {activity.map((row, i) => (
                  <div key={i} className={styles.requestRow}>
                    <div>
                      <div className={styles.requestTitle}>{row.name}</div>
                      <div className={styles.requestMeta}>{row.date}</div>
                    </div>
                    <span
                      className={`${styles.refPill} ${
                        row.stage === 'live'
                          ? styles.rfLive
                          : row.stage === 'progress'
                          ? styles.rfProgress
                          : styles.rfNew
                      }`}
                    >
                      {row.stageLabel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
