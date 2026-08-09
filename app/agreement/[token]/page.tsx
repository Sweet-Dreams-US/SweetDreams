/**
 * Public agreement signing page — /agreement/[token]
 *
 * No login required: the unguessable single-use token IS the authorization.
 * Renders exactly one of: the agreement + sign form (valid), expired,
 * generic invalid (revoked / unknown / burned — never leaks which), or
 * already signed. Marks first_viewed_at on first valid open.
 */
import type { Metadata } from 'next';
import { formatInTimeZone } from 'date-fns-tz';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { hashToken } from '@/lib/agreements/tokens';
import { BUSINESS_TZ } from '@/lib/agreements/service';
import AgreementSignForm from './AgreementSignForm';
import styles from './agreement.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign Your Agreement | Sweet Dreams',
  robots: { index: false, follow: false },
};

interface TokenRow {
  id: string;
  expires_at: string;
  used_at: string | null;
  revoked_at: string | null;
  agreements: {
    id: string;
    status: string;
    rendered_text: string;
    signed_at: string | null;
    first_viewed_at: string | null;
    clients: {
      business_name: string;
      contact_name: string;
    } | null;
  } | null;
}

type PageState = 'valid' | 'expired' | 'invalid' | 'already_signed';

export default async function AgreementPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createServiceRoleClient();

  const { data } = await supabase
    .from('agreement_tokens')
    .select(
      'id, expires_at, used_at, revoked_at, agreements (id, status, rendered_text, signed_at, first_viewed_at, clients (business_name, contact_name))'
    )
    .eq('token_hash', hashToken(token))
    .eq('purpose', 'sign')
    .maybeSingle();

  const tok = data as unknown as TokenRow | null;
  const agreement = tok?.agreements ?? null;
  const client = agreement?.clients ?? null;

  let state: PageState;
  if (!tok || !agreement || !client) {
    state = 'invalid';
  } else if (agreement.status === 'signed') {
    state = 'already_signed';
  } else if (agreement.status !== 'sent' || tok.revoked_at || tok.used_at) {
    state = 'invalid';
  } else if (new Date(tok.expires_at).getTime() <= Date.now()) {
    state = 'expired';
  } else {
    state = 'valid';
  }

  if (state === 'valid' && agreement && !agreement.first_viewed_at) {
    await supabase
      .from('agreements')
      .update({ first_viewed_at: new Date().toISOString() })
      .eq('id', agreement.id)
      .is('first_viewed_at', null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          SWEET DREAMS<span className={styles.brandDot}>.</span>
        </div>

        {state === 'invalid' && (
          <div className={styles.notice}>
            <h1 className={styles.noticeTitle}>This link is not active</h1>
            <p className={styles.noticeText}>
              This signing link is not valid or is no longer active. If you
              were expecting an agreement from us, email{' '}
              <a href="mailto:cole@sweetdreams.us">cole@sweetdreams.us</a> and
              we will send you a fresh link.
            </p>
          </div>
        )}

        {state === 'expired' && (
          <div className={styles.notice}>
            <h1 className={styles.noticeTitle}>This link has expired</h1>
            <p className={styles.noticeText}>
              For your security, signing links only last 14 days. Email{' '}
              <a href="mailto:cole@sweetdreams.us">cole@sweetdreams.us</a> and
              we will send you a fresh one.
            </p>
          </div>
        )}

        {state === 'already_signed' && agreement && (
          <div className={styles.notice}>
            <h1 className={styles.noticeTitle}>Already signed</h1>
            <p className={styles.noticeText}>
              This agreement was signed
              {agreement.signed_at
                ? ` on ${formatInTimeZone(
                    new Date(agreement.signed_at),
                    BUSINESS_TZ,
                    'MMMM d, yyyy'
                  )}`
                : ''}
              . You can view it anytime in your client portal.
            </p>
            <a className={styles.portalLink} href="/portal/login">
              Go to your portal
            </a>
          </div>
        )}

        {state === 'valid' && agreement && client && (
          <>
            <h1 className={styles.title}>
              Website agreement for {client.business_name}
            </h1>
            <p className={styles.subtitle}>
              Please read the agreement below, then sign at the bottom. It
              takes about five minutes.
            </p>

            <div className={styles.agreementBox}>
              <pre className={styles.agreementText}>
                {agreement.rendered_text}
              </pre>
            </div>

            <AgreementSignForm
              token={token}
              contactName={client.contact_name}
              businessName={client.business_name}
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
