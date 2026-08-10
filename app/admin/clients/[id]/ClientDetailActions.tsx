'use client';

/**
 * Interactive half of the client detail page: per-site pipeline status +
 * registry fields (save on blur), agreement send/resend/revoke with the
 * one-time signing URL copy box, and the set-password email action.
 * Every server-changing action ends with router.refresh() so the server
 * component re-renders fresh data.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';
import {
  SITE_STATUSES,
  SITE_STATUS_LABELS,
  DB_MODE_LABELS,
  analyticsIncludedAtPrice,
  type DbMode,
  type SiteStatus,
} from '@/lib/clients/constants';
import styles from '../clients.module.css';

export interface DetailSite {
  id: string;
  name: string;
  domain: string | null;
  demo_url: string | null;
  drive_url: string | null;
  status: string;
  hosting_price_cents: number;
  update_hours_per_quarter: number | null;
  build_price_cents: number;
  billing_anchor_day: number;
  db_mode: DbMode;
  db_project_ref: string | null;
  analytics_addon: boolean;
  github_repo: string | null;
  vercel_project_id: string | null;
  live_url: string | null;
  go_live_date: string | null;
  admin_notes: string | null;
  stripe_subscription_id: string | null;
  billing_starts_on: string | null;
}

export interface DetailAgreement {
  id: string;
  site_id: string;
  status: string;
  template_version: string;
  created_at: string;
  first_viewed_at: string | null;
  signed_at: string | null;
  signer_name: string | null;
  signer_ip: string | null;
  signed_content_sha256: string | null;
  signature_image: string | null;
  revoked_at: string | null;
  revoke_reason: string | null;
}

const TZ = 'America/Indiana/Indianapolis';

function fmt(iso: string | null): string {
  if (!iso) return '';
  return formatInTimeZone(new Date(iso), TZ, "MMM d, yyyy 'at' h:mm a");
}

export default function ClientDetailActions({
  clientId,
  hasPortalAccount,
  sites,
  agreements,
}: {
  clientId: string;
  hasPortalAccount: boolean;
  sites: DetailSite[];
  agreements: DetailAgreement[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [signingUrl, setSigningUrl] = useState('');
  const [copied, setCopied] = useState(false);

  async function post(url: string, body: unknown): Promise<Record<string, unknown> | null> {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError((data.error as string) || 'Something went wrong.');
        return null;
      }
      return data;
    } catch {
      setError('Network error.');
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function sendAgreement(siteId: string) {
    const data = await post('/api/admin/agreements/send', { site_id: siteId });
    if (!data) return;
    setSigningUrl((data.signing_url as string) || '');
    setCopied(false);
    setNotice(
      data.email_ok
        ? `Agreement ${data.resent ? 'resent' : 'sent'} by email. Backup link below (shown once).`
        : 'EMAIL FAILED. Copy the link below and send it yourself.'
    );
    router.refresh();
  }

  async function sendWelcome(siteId: string) {
    const data = await post('/api/admin/sites/send-welcome', { site_id: siteId });
    if (!data) return;
    setSigningUrl((data.welcome_url as string) || '');
    setCopied(false);
    setNotice(
      data.email_ok
        ? 'Demo invite emailed. Their private welcome link is below (backup copy).'
        : 'EMAIL FAILED. Copy the welcome link below and send it yourself.'
    );
    router.refresh();
  }

  async function revokeAgreement(agreementId: string) {
    const data = await post('/api/admin/agreements/revoke', {
      agreement_id: agreementId,
    });
    if (!data) return;
    setNotice('Agreement revoked. All its links are dead.');
    setSigningUrl('');
    router.refresh();
  }

  async function sendPasswordLink() {
    const data = await post('/api/admin/clients/password-link', {
      client_id: clientId,
    });
    if (!data) return;
    setNotice(
      data.email_ok
        ? 'Set-password email sent.'
        : 'Link generated but the email failed. Try again.'
    );
  }

  return (
    <div>
      {(notice || error) && (
        <div className={error ? styles.errorBox : styles.copyBox}>
          {error || notice}
          {signingUrl && !error && (
            <>
              <div style={{ marginTop: 8 }}>{signingUrl}</div>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={() => {
                  navigator.clipboard.writeText(signingUrl);
                  setCopied(true);
                }}
              >
                {copied ? 'Copied ✓' : 'Copy link'}
              </button>
            </>
          )}
        </div>
      )}

      {sites.map((site) => (
        <SiteCard
          key={site.id}
          site={site}
          agreements={agreements.filter((a) => a.site_id === site.id)}
          busy={busy}
          onSend={() => sendAgreement(site.id)}
          onSendWelcome={() => sendWelcome(site.id)}
          onRevoke={revokeAgreement}
        />
      ))}

      <div className={styles.card}>
        <p className={styles.cardTitle}>Portal access</p>
        <p className={styles.muted} style={{ margin: '0 0 12px' }}>
          {hasPortalAccount
            ? 'This client has a portal login. Send them a set-password email if they are locked out.'
            : 'No portal account yet. It is created automatically the moment they sign.'}
        </p>
        {hasPortalAccount && (
          <button
            type="button"
            className={styles.secondaryBtn}
            disabled={busy}
            onClick={sendPasswordLink}
          >
            Email Set-Password Link
          </button>
        )}
      </div>
    </div>
  );
}

function SiteCard({
  site,
  agreements,
  busy,
  onSend,
  onSendWelcome,
  onRevoke,
}: {
  site: DetailSite;
  agreements: DetailAgreement[];
  busy: boolean;
  onSend: () => void;
  onSendWelcome: () => void;
  onRevoke: (agreementId: string) => void;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(site.status);
  const [fields, setFields] = useState({
    demo_url: site.demo_url ?? '',
    drive_url: site.drive_url ?? '',
    live_url: site.live_url ?? '',
    domain: site.domain ?? '',
    github_repo: site.github_repo ?? '',
    vercel_project_id: site.vercel_project_id ?? '',
    go_live_date: site.go_live_date ?? '',
    admin_notes: site.admin_notes ?? '',
  });
  const [plan, setPlan] = useState({
    price: String(site.hosting_price_cents / 100),
    hours: String(site.update_hours_per_quarter ?? 0),
    build: String(site.build_price_cents / 100),
  });
  const [anchorDay, setAnchorDay] = useState(site.billing_anchor_day);
  const [analyticsAddon, setAnalyticsAddon] = useState(site.analytics_addon);

  function savePlanNumber(key: 'price' | 'hours' | 'build') {
    const raw = parseFloat(plan[key] || '0');
    if (!Number.isFinite(raw) || raw < 0) return;
    if (key === 'price') save({ hosting_price_cents: Math.round(raw * 100) });
    if (key === 'build') save({ build_price_cents: Math.round(raw * 100) });
    if (key === 'hours') save({ update_hours_per_quarter: Math.round(raw) });
  }
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle'
  );
  const [saveError, setSaveError] = useState('');

  async function save(patch: Record<string, unknown>) {
    setSaveState('saving');
    setSaveError('');
    try {
      const res = await fetch('/api/admin/sites/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site_id: site.id, ...patch }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok !== false) {
        setSaveState('saved');
        setTimeout(() => setSaveState('idle'), 1600);
        router.refresh();
      } else {
        setSaveState('error');
        setSaveError(data.error || 'save failed');
        if (patch.status) setStatus(site.status);
      }
    } catch {
      setSaveState('error');
      setSaveError('network error');
    }
  }

  const canSend = status === 'draft' || status === 'agreement_sent';
  const hasSent = agreements.some((a) => a.status === 'sent');

  const registryFields: Array<{
    key: keyof typeof fields;
    label: string;
    placeholder?: string;
    type?: string;
  }> = [
    { key: 'demo_url', label: 'Demo website URL', placeholder: 'https://...' },
    { key: 'drive_url', label: 'Google Drive (brand files) URL', placeholder: 'https://drive.google.com/...' },
    { key: 'live_url', label: 'Live URL', placeholder: 'https://...' },
    { key: 'domain', label: 'Domain', placeholder: 'example.com' },
    { key: 'github_repo', label: 'GitHub repo', placeholder: 'owner/repo' },
    { key: 'vercel_project_id', label: 'Vercel project', placeholder: 'prj_...' },
    { key: 'go_live_date', label: 'Go live date', type: 'date' },
  ];

  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>
        Site: {site.name}
        <span className={styles.saveTag + ' ' + (styles[`save_${saveState}`] || '')}>
          {saveState === 'saving'
            ? 'saving…'
            : saveState === 'saved'
              ? 'saved ✓'
              : saveState === 'error'
                ? 'error'
                : ''}
        </span>
      </p>

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Pipeline status</label>
          <select
            className={`${styles.statusSelect} ${styles[`st_${status as SiteStatus}`] || ''}`}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              save({ status: e.target.value });
            }}
          >
            {SITE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {SITE_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Monthly hosting ($)</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="1"
            value={plan.price}
            onChange={(e) => setPlan({ ...plan, price: e.target.value })}
            onBlur={() => savePlanNumber('price')}
          />
          <span className={styles.muted}>
            {DB_MODE_LABELS[site.db_mode]}
            {site.stripe_subscription_id ? ' · Stripe subscription linked' : ''}
          </span>
          {site.billing_starts_on && (
            <span className={styles.portalYes}>
              Subscription active · first charge {site.billing_starts_on}
            </span>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Update hours per quarter</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="1"
            value={plan.hours}
            onChange={(e) => setPlan({ ...plan, hours: e.target.value })}
            onBlur={() => savePlanNumber('hours')}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Build value ($)</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="100"
            value={plan.build}
            onChange={(e) => setPlan({ ...plan, build: e.target.value })}
            onBlur={() => savePlanNumber('build')}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Billing day</label>
          <div className={styles.radioRow}>
            <label>
              <input
                type="radio"
                checked={anchorDay === 1}
                onChange={() => {
                  setAnchorDay(1);
                  save({ billing_anchor_day: 1 });
                }}
              />
              the 1st
            </label>
            <label>
              <input
                type="radio"
                checked={anchorDay === 15}
                onChange={() => {
                  setAnchorDay(15);
                  save({ billing_anchor_day: 15 });
                }}
              />
              the 15th
            </label>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Analytics reports</label>
          {analyticsIncludedAtPrice(
            Math.round(parseFloat(plan.price || '0') * 100)
          ) ? (
            <span className={styles.kvValue}>Included with this plan</span>
          ) : (
            <div className={styles.radioRow}>
              <label>
                <input
                  type="checkbox"
                  checked={analyticsAddon}
                  onChange={(e) => {
                    setAnalyticsAddon(e.target.checked);
                    save({ analytics_addon: e.target.checked });
                  }}
                />
                Add on (+$10/mo)
              </label>
            </div>
          )}
        </div>
        {registryFields.map((f) => (
          <div className={styles.field} key={f.key}>
            <label className={styles.fieldLabel}>{f.label}</label>
            <input
              className={styles.input}
              type={f.type ?? 'text'}
              value={fields[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
              onBlur={() => {
                const initial =
                  (site[f.key as keyof DetailSite] as string | null) ?? '';
                if (fields[f.key] !== initial) {
                  save({ [f.key]: fields[f.key] || null });
                }
              }}
            />
          </div>
        ))}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Notes</label>
          <input
            className={styles.input}
            value={fields.admin_notes}
            placeholder="Internal notes…"
            onChange={(e) => setFields({ ...fields, admin_notes: e.target.value })}
            onBlur={() => {
              if (fields.admin_notes !== (site.admin_notes ?? '')) {
                save({ admin_notes: fields.admin_notes || null });
              }
            }}
          />
        </div>
      </div>

      {saveError && <div className={styles.errorBox}>{saveError}</div>}

      <div className={styles.submitRow}>
        {(status === 'draft' || status === 'demo_sent') && (
          <button
            type="button"
            className={styles.primaryAction}
            disabled={busy}
            onClick={onSendWelcome}
            title="Needs the demo URL and build value set first"
          >
            {status === 'demo_sent' ? 'Resend Demo Invite (new link)' : 'Send Demo Invite'}
          </button>
        )}
        {canSend && (
          <button
            type="button"
            className={styles.secondaryBtn}
            disabled={busy}
            onClick={onSend}
          >
            {hasSent ? 'Resend Agreement (new link)' : 'Send Agreement Directly'}
          </button>
        )}
      </div>

      {agreements.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <p className={styles.fieldLabel} style={{ marginBottom: 8 }}>
            Agreements
          </p>
          <ul className={styles.timeline}>
            {agreements.map((a) => (
              <li key={a.id}>
                <div>
                  <strong>{a.status.toUpperCase()}</strong> · {a.template_version} ·
                  sent {fmt(a.created_at)}
                </div>
                {a.first_viewed_at && (
                  <div className={styles.timelineMuted}>
                    first viewed {fmt(a.first_viewed_at)}
                  </div>
                )}
                {a.status === 'signed' && (
                  <>
                    <div>
                      signed by {a.signer_name} on {fmt(a.signed_at)}
                      {a.signer_ip ? ` from ${a.signer_ip}` : ''}
                    </div>
                    {a.signature_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.signature_image}
                        alt={`Signature of ${a.signer_name ?? 'signer'}`}
                        style={{
                          display: 'block',
                          maxHeight: 56,
                          margin: '6px 0',
                          background: '#fff',
                          borderRadius: 6,
                          padding: '2px 8px',
                        }}
                      />
                    )}
                    {a.signed_content_sha256 && (
                      <div className={styles.fingerprint}>
                        sha256 {a.signed_content_sha256}
                      </div>
                    )}
                  </>
                )}
                {a.status === 'revoked' && (
                  <div className={styles.timelineMuted}>
                    revoked {fmt(a.revoked_at)}
                    {a.revoke_reason ? ` — ${a.revoke_reason}` : ''}
                  </div>
                )}
                {a.status === 'sent' && (
                  <div style={{ marginTop: 6 }}>
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      disabled={busy}
                      onClick={() => onRevoke(a.id)}
                    >
                      Revoke link
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
