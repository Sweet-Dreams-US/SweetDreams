/**
 * Private client welcome page — /welcome/[token]
 *
 * The pre-agreement page a lead reaches from the demo invite email. Shows
 * their demo website, their brand files, and the hosting plan options;
 * choosing a plan flows straight into the signing page.
 *
 * Unlike signing links, welcome tokens are REUSABLE: the client can come
 * back from the email as many times as they want until the link expires,
 * is revoked, or their agreement is signed.
 */
import type { Metadata } from 'next';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { hashToken } from '@/lib/agreements/tokens';
import WelcomeSelect from './WelcomeSelect';
import styles from './welcome.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your Demo Website | Sweet Dreams',
  robots: { index: false, follow: false },
};

interface WelcomeTokenRow {
  id: string;
  expires_at: string;
  revoked_at: string | null;
  sites: {
    id: string;
    name: string;
    status: string;
    demo_url: string | null;
    drive_url: string | null;
    hosting_price_cents: number;
    min_hosting_price_cents: number;
    update_hours_per_quarter: number | null;
    analytics_addon: boolean;
    demo_status: string;
    demo_first_viewed_at: string | null;
    clients: {
      business_name: string;
      contact_name: string;
    } | null;
  } | null;
}

type PageState = 'valid' | 'expired' | 'invalid' | 'signed';

export default async function WelcomePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createServiceRoleClient();

  const { data } = await supabase
    .from('site_tokens')
    .select(
      'id, expires_at, revoked_at, sites (id, name, status, demo_url, drive_url, hosting_price_cents, min_hosting_price_cents, update_hours_per_quarter, analytics_addon, demo_status, demo_first_viewed_at, clients (business_name, contact_name))'
    )
    .eq('token_hash', hashToken(token))
    .eq('purpose', 'welcome')
    .maybeSingle();

  const row = data as unknown as WelcomeTokenRow | null;
  const site = row?.sites ?? null;
  const client = site?.clients ?? null;

  let signed = false;
  if (site) {
    const { data: signedAgr } = await supabase
      .from('agreements')
      .select('id')
      .eq('site_id', site.id)
      .eq('status', 'signed')
      .limit(1)
      .maybeSingle();
    signed = Boolean(signedAgr);
  }

  let state: PageState;
  if (!row || !site || !client || row.revoked_at) {
    state = 'invalid';
  } else if (signed) {
    state = 'signed';
  } else if (new Date(row.expires_at).getTime() <= Date.now()) {
    state = 'expired';
  } else {
    state = 'valid';
  }

  // Demo approval queue: the client opening this page is the "viewed" signal.
  // Best-effort — a failed stamp must never break the render.
  if (
    state === 'valid' &&
    site &&
    (site.demo_status === 'sent' || site.demo_status === 'approved') &&
    !site.demo_first_viewed_at
  ) {
    try {
      const { error: viewErr } = await supabase
        .from('sites')
        .update({ demo_status: 'viewed', demo_first_viewed_at: new Date().toISOString() })
        .eq('id', site.id)
        .in('demo_status', ['sent', 'approved'])
        .is('demo_first_viewed_at', null);
      if (viewErr) console.error('welcome: demo viewed stamp failed', viewErr.message);
    } catch (err) {
      console.error('welcome: demo viewed stamp failed', err);
    }
  }

  const firstName = client?.contact_name?.split(' ')[0] ?? '';

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          SWEET DREAMS<span className={styles.brandDot}>.</span>
        </div>

        {state === 'invalid' && (
          <div>
            <h1 className={styles.title}>This link is not active</h1>
            <p className={styles.subtitle}>
              This private link is not valid or is no longer active. Email{' '}
              <a href="mailto:cole@sweetdreams.us">cole@sweetdreams.us</a> and
              we will send you a fresh one.
            </p>
          </div>
        )}

        {state === 'expired' && (
          <div>
            <h1 className={styles.title}>This link has expired</h1>
            <p className={styles.subtitle}>
              Email{' '}
              <a href="mailto:cole@sweetdreams.us">cole@sweetdreams.us</a> and
              we will send you a fresh one.
            </p>
          </div>
        )}

        {state === 'signed' && (
          <div>
            <h1 className={styles.title}>You are all signed up</h1>
            <p className={styles.subtitle}>
              Your agreement is signed. Follow your website build anytime in
              your client portal.
            </p>
            <a className={styles.primaryLink} href="/portal/login">
              Log In to Your Portal
            </a>
          </div>
        )}

        {state === 'valid' && site && client && (
          <>
            <h1 className={styles.title}>
              {firstName ? `${firstName}, your` : 'Your'} demo website is ready
            </h1>
            <p className={styles.subtitle}>
              We built this demo for <strong>{client.business_name}</strong>{' '}
              so you can see exactly what your website would look like. Take a
              look, then pick the hosting plan that fits and start your
              agreement. The build itself is free.
            </p>

            <div className={styles.linkRow}>
              {site.demo_url && (
                <a
                  className={styles.primaryLink}
                  href={site.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View My Demo Website ↗
                </a>
              )}
              {site.drive_url && (
                <a
                  className={styles.secondaryLink}
                  href={site.drive_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My Brand Files ↗
                </a>
              )}
            </div>

            <WelcomeSelect
              token={token}
              currentPriceCents={site.hosting_price_cents}
              minPriceCents={site.min_hosting_price_cents}
              currentHours={site.update_hours_per_quarter}
              currentAnalyticsAddon={site.analytics_addon}
            />
          </>
        )}
      </div>
      <p className={styles.pageFooter}>
        Sweet Dreams · Fort Wayne, Indiana · sweetdreams.us
      </p>
    </div>
  );
}
