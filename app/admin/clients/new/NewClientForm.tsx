'use client';

/**
 * New client form: business + contact info, hosting tier presets
 * ($50/3h, $85/9h, $125/16h, custom), build value, billing anchor day,
 * database packaging (constrained by tier), then create as draft or
 * create and send the agreement in one shot.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  HOSTING_TIERS,
  DB_MODE_LABELS,
  analyticsIncludedAtPrice,
  type DbMode,
} from '@/lib/clients/constants';
import styles from '../clients.module.css';

export interface LeadPrefill {
  source_lead_id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  what_you_do: string;
}

type TierKey = 'starter' | 'growth' | 'pro' | 'custom';

export default function NewClientForm({ prefill }: { prefill: LeadPrefill | null }) {
  const router = useRouter();

  const [businessName, setBusinessName] = useState(prefill?.business_name ?? '');
  const [contactName, setContactName] = useState(prefill?.contact_name ?? '');
  const [email, setEmail] = useState(prefill?.email ?? '');
  const [phone, setPhone] = useState(prefill?.phone ?? '');
  const [siteName, setSiteName] = useState('');
  const [domain, setDomain] = useState('');

  const [tier, setTier] = useState<TierKey>('starter');
  const [priceDollars, setPriceDollars] = useState('50');
  const [hours, setHours] = useState('3');
  const [buildDollars, setBuildDollars] = useState('');
  const [anchorDay, setAnchorDay] = useState<1 | 15>(1);
  const [dbMode, setDbMode] = useState<DbMode>('shared');
  const [analyticsAddon, setAnalyticsAddon] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    client_id: string;
    signing_url?: string;
    email_ok?: boolean;
    send_error?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const dedicatedAllowed = tier !== 'starter';

  function pickTier(key: TierKey) {
    setTier(key);
    const preset = HOSTING_TIERS.find((t) => t.key === key);
    if (preset) {
      setPriceDollars(String(preset.priceCents / 100));
      setHours(String(preset.updateHoursPerQuarter));
      if (!preset.allowedDbModes.includes(dbMode)) setDbMode('shared');
    }
  }

  async function submit(sendAgreement: boolean) {
    setError('');
    const priceCents = Math.round(parseFloat(priceDollars || '0') * 100);
    const buildCents = Math.round(parseFloat(buildDollars || '0') * 100);
    const hoursNum = parseInt(hours || '0', 10);

    if (!businessName.trim() || !contactName.trim() || !email.trim()) {
      setError('Business, contact name, and email are required.');
      return;
    }
    if (!Number.isFinite(priceCents) || priceCents < 0) {
      setError('Enter a valid monthly hosting price.');
      return;
    }
    if (sendAgreement && (!Number.isFinite(buildCents) || buildCents <= 0)) {
      setError(
        'Enter the build value before sending. It anchors the buyout schedule in the contract.'
      );
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/admin/clients/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName.trim(),
          contact_name: contactName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          source_lead_id: prefill?.source_lead_id,
          send_agreement: sendAgreement,
          site: {
            name: siteName.trim() || businessName.trim(),
            domain: domain.trim(),
            hosting_price_cents: priceCents,
            update_hours_per_quarter: Number.isFinite(hoursNum) ? hoursNum : 0,
            build_price_cents: Number.isFinite(buildCents) ? buildCents : 0,
            billing_anchor_day: anchorDay,
            db_mode: dbMode,
            analytics_addon: analyticsAddon,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }
      if (data.signing_url || data.send_error) {
        setResult(data);
      } else {
        router.push(`/admin/clients/${data.client_id}`);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <div className={styles.card}>
        <p className={styles.cardTitle}>Client created</p>
        {result.signing_url ? (
          <div className={styles.copyBox}>
            <strong>
              {result.email_ok
                ? 'Agreement emailed. Signing link (backup copy, shown once):'
                : 'EMAIL FAILED — copy this signing link and send it yourself:'}
            </strong>
            {result.signing_url}
            <div>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={() => {
                  navigator.clipboard.writeText(result.signing_url!);
                  setCopied(true);
                }}
              >
                {copied ? 'Copied ✓' : 'Copy link'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.errorBox}>
            Client saved, but sending failed: {result.send_error}. Open the client
            and use Send Agreement to retry.
          </div>
        )}
        <div className={styles.submitRow}>
          <a href={`/admin/clients/${result.client_id}`} className={styles.primaryAction}>
            Open Client
          </a>
          <a href="/admin/clients" className={styles.secondaryBtn}>
            Back to Clients
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.card}>
        <p className={styles.cardTitle}>Business</p>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Business name *</label>
            <input
              className={styles.input}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Contact name *</label>
            <input
              className={styles.input}
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Email *</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Phone</label>
            <input
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Site name (defaults to business)</label>
            <input
              className={styles.input}
              value={siteName}
              placeholder={businessName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Domain (if known)</label>
            <input
              className={styles.input}
              value={domain}
              placeholder="example.com"
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
        </div>
        {prefill?.what_you_do && (
          <p className={styles.muted} style={{ marginTop: 12 }}>
            From the inquiry: {prefill.what_you_do}
          </p>
        )}
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Hosting plan</p>
        <div className={styles.tierRow}>
          {HOSTING_TIERS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`${styles.tierBtn} ${tier === t.key ? styles.tierBtnActive : ''}`}
              onClick={() => pickTier(t.key)}
            >
              <span className={styles.tierPrice}>
                ${t.priceCents / 100}/mo
              </span>
              <span className={styles.tierMeta}>
                {t.label} · {t.updateHoursPerQuarter} hrs/quarter
              </span>
            </button>
          ))}
          <button
            type="button"
            className={`${styles.tierBtn} ${tier === 'custom' ? styles.tierBtnActive : ''}`}
            onClick={() => setTier('custom')}
          >
            <span className={styles.tierPrice}>Custom</span>
            <span className={styles.tierMeta}>set price + hours below</span>
          </button>
        </div>

        <div className={styles.formGrid} style={{ marginTop: 16 }}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Monthly hosting ($)</label>
            <input
              className={styles.input}
              type="number"
              min="0"
              step="1"
              value={priceDollars}
              onChange={(e) => {
                setPriceDollars(e.target.value);
                setTier('custom');
              }}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Update hours per quarter</label>
            <input
              className={styles.input}
              type="number"
              min="0"
              step="1"
              value={hours}
              onChange={(e) => {
                setHours(e.target.value);
                setTier('custom');
              }}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>
              Build value ($) — anchors the buyout schedule
            </label>
            <input
              className={styles.input}
              type="number"
              min="0"
              step="100"
              value={buildDollars}
              placeholder="4500"
              onChange={(e) => setBuildDollars(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Billing day</label>
            <div className={styles.radioRow}>
              <label>
                <input
                  type="radio"
                  checked={anchorDay === 1}
                  onChange={() => setAnchorDay(1)}
                />
                the 1st
              </label>
              <label>
                <input
                  type="radio"
                  checked={anchorDay === 15}
                  onChange={() => setAnchorDay(15)}
                />
                the 15th
              </label>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Database</label>
            <select
              className={styles.select}
              value={dbMode}
              onChange={(e) => setDbMode(e.target.value as DbMode)}
            >
              <option value="shared">{DB_MODE_LABELS.shared}</option>
              <option value="none">{DB_MODE_LABELS.none}</option>
              <option value="dedicated" disabled={!dedicatedAllowed}>
                {DB_MODE_LABELS.dedicated}
                {dedicatedAllowed ? '' : ' (requires $85+ plan)'}
              </option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Analytics reports</label>
            {analyticsIncludedAtPrice(
              Math.round(parseFloat(priceDollars || '0') * 100)
            ) ? (
              <span className={styles.kvValue}>Included free with this plan</span>
            ) : (
              <div className={styles.radioRow}>
                <label>
                  <input
                    type="checkbox"
                    checked={analyticsAddon}
                    onChange={(e) => setAnalyticsAddon(e.target.checked)}
                  />
                  Add analytics reports (+$5/mo)
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      <div className={styles.submitRow}>
        <button
          type="button"
          className={styles.primaryAction}
          disabled={busy}
          onClick={() => submit(true)}
        >
          {busy ? 'Working...' : 'Create + Send Agreement'}
        </button>
        <button
          type="button"
          className={styles.secondaryBtn}
          disabled={busy}
          onClick={() => submit(false)}
        >
          Create as Draft
        </button>
      </div>
    </div>
  );
}
