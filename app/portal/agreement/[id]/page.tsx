/**
 * Portal: view your signed agreement. Fetched through RLS — only the
 * owner's SIGNED agreements are visible, so a wrong or foreign id is
 * simply not found.
 */
import { notFound } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';
import { createClient } from '@/utils/supabase/server';
import { BUSINESS_TZ } from '@/lib/agreements/service';
import styles from '../../portal.module.css';

export const dynamic = 'force-dynamic';

interface AgreementRow {
  id: string;
  rendered_text: string;
  signed_at: string | null;
  signer_name: string | null;
  signed_content_sha256: string | null;
  clients: { business_name: string } | null;
}

export default async function PortalAgreementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('agreements')
    .select(
      'id, rendered_text, signed_at, signer_name, signed_content_sha256, clients (business_name)'
    )
    .eq('id', id)
    .maybeSingle();

  const agreement = data as unknown as AgreementRow | null;
  if (!agreement) notFound();

  return (
    <div>
      <a href="/portal" className={styles.backLink}>
        ← Back to your portal
      </a>
      <h1 className={styles.pageTitle}>
        Your agreement
        {agreement.clients ? ` for ${agreement.clients.business_name}` : ''}
      </h1>

      <div className={styles.signatureRecord}>
        <p className={styles.recordLine}>
          Signed by {agreement.signer_name}
          {agreement.signed_at
            ? ` on ${formatInTimeZone(
                new Date(agreement.signed_at),
                BUSINESS_TZ,
                "MMMM d, yyyy 'at' h:mm a zzz"
              )}`
            : ''}
        </p>
        {agreement.signed_content_sha256 && (
          <p className={styles.recordFingerprint}>
            Document fingerprint (SHA 256): {agreement.signed_content_sha256}
          </p>
        )}
      </div>

      <div className={styles.agreementBox}>
        <pre className={styles.agreementText}>{agreement.rendered_text}</pre>
      </div>
    </div>
  );
}
