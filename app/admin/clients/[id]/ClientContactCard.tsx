'use client';

/**
 * Editable client contact card: business, contact, email, phone, notes —
 * each field saves on blur (same pattern as the site registry fields).
 * Portal account + payment method rows stay read only.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../clients.module.css';

export interface ContactClient {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  admin_notes: string | null;
}

export default function ClientContactCard({
  client,
  authLinked,
  paymentSaved,
}: {
  client: ContactClient;
  authLinked: boolean;
  paymentSaved: boolean;
}) {
  const router = useRouter();
  const [fields, setFields] = useState({
    business_name: client.business_name,
    contact_name: client.contact_name,
    email: client.email,
    phone: client.phone ?? '',
    admin_notes: client.admin_notes ?? '',
  });
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');

  async function save(patch: Record<string, unknown>) {
    setSaveState('saving');
    setSaveError('');
    try {
      const res = await fetch('/api/admin/clients/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: client.id, ...patch }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok !== false) {
        setSaveState('saved');
        setTimeout(() => setSaveState('idle'), 1600);
        router.refresh();
      } else {
        setSaveState('error');
        setSaveError(data.error || 'save failed');
      }
    } catch {
      setSaveState('error');
      setSaveError('network error');
    }
  }

  const inputs: Array<{ key: keyof typeof fields; label: string; type?: string }> = [
    { key: 'business_name', label: 'Business name' },
    { key: 'contact_name', label: 'Contact name' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone' },
    { key: 'admin_notes', label: 'Notes' },
  ];

  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>
        Contact + portal
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
        {inputs.map((f) => (
          <div className={styles.field} key={f.key}>
            <label className={styles.fieldLabel}>{f.label}</label>
            <input
              className={styles.input}
              type={f.type ?? 'text'}
              value={fields[f.key]}
              onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
              onBlur={() => {
                const initial =
                  f.key === 'phone'
                    ? (client.phone ?? '')
                    : f.key === 'admin_notes'
                      ? (client.admin_notes ?? '')
                      : client[f.key];
                if (fields[f.key] !== initial) {
                  save({
                    [f.key]:
                      f.key === 'phone' || f.key === 'admin_notes'
                        ? fields[f.key] || null
                        : fields[f.key],
                  });
                }
              }}
            />
          </div>
        ))}
      </div>

      {saveError && <div className={styles.errorBox}>{saveError}</div>}

      <div className={styles.kv} style={{ marginTop: 14 }}>
        <span className={styles.kvLabel}>Portal account</span>
        <span className={styles.kvValue}>
          {authLinked ? (
            <span className={styles.portalYes}>linked ✓</span>
          ) : (
            <span className={styles.portalNo}>not yet (created when they sign or are invited)</span>
          )}
        </span>
      </div>
      <div className={styles.kv}>
        <span className={styles.kvLabel}>Payment method</span>
        <span className={styles.kvValue}>
          {paymentSaved ? (
            <span className={styles.portalYes}>on file ✓</span>
          ) : (
            <span className={styles.portalNo}>not yet</span>
          )}
        </span>
      </div>
    </div>
  );
}
