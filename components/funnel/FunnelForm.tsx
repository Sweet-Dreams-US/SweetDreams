'use client';

import { useState } from 'react';
import styles from './funnel.module.css';

export interface FunnelField {
  name: string;
  placeholder: string;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  half?: boolean; // render two half-width fields side by side
}

export interface FunnelStep {
  /** Question text. Wrap a word in {curly braces} to accent-color it. */
  question: string;
  fields: FunnelField[];
  cta: string;
}

interface FunnelFormProps {
  funnel: string;
  steps: FunnelStep[];
  successTitle: string;
  successBody: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Render a question, accent-coloring any {wrapped} segment.
function renderQuestion(q: string) {
  const parts = q.split(/(\{[^}]+\})/g);
  return parts.map((part, i) =>
    part.startsWith('{') && part.endsWith('}') ? (
      <span key={i} className={styles.hl}>
        {part.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function FunnelForm({
  funnel,
  steps,
  successTitle,
  successBody,
}: FunnelFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const setField = (name: string, value: string) =>
    setValues((v) => ({ ...v, [name]: value }));

  // Validate the fields on the current step only.
  const validateStep = (): string | null => {
    for (const f of step.fields) {
      const val = (values[f.name] ?? '').trim();
      if (f.required && !val) return 'Please fill in the required fields.';
      if (f.type === 'email' && val && !EMAIL_RE.test(val))
        return 'Please enter a valid email address.';
    }
    return null;
  };

  const fireConversion = () => {
    try {
      const w = window as unknown as {
        gtag?: (...args: unknown[]) => void;
        fbq?: (...args: unknown[]) => void;
      };
      if (typeof w.gtag === 'function')
        w.gtag('event', 'generate_lead', { funnel });
      if (typeof w.fbq === 'function') w.fbq('track', 'Lead', { funnel });
    } catch {
      /* analytics is best-effort */
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }

    // Final step → submit everything.
    setStatus('submitting');
    try {
      const res = await fetch('/api/funnel-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funnel, ...values, honeypot }),
      });
      if (res.ok) {
        fireConversion();
        setStatus('success');
      } else {
        setStatus('error');
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.formCard}>
        <div className={styles.success}>
          <h2 className={styles.successTitle}>{successTitle}</h2>
          <p className={styles.successBody}>{successBody}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      {/* progress dots */}
      <div className={styles.progress} aria-hidden="true">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${
              i === stepIndex
                ? styles.dotActive
                : i < stepIndex
                ? styles.dotDone
                : ''
            }`}
          />
        ))}
      </div>

      <h2 className={styles.formQuestion}>{renderQuestion(step.question)}</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* honeypot — bots fill it, humans never see it */}
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          className={styles.honeypot}
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          aria-hidden="true"
        />

        {(() => {
          // Group consecutive half fields into rows; full fields stand alone.
          const rows: FunnelField[][] = [];
          for (const f of step.fields) {
            const last = rows[rows.length - 1];
            if (f.half && last && last.length === 1 && last[0].half) {
              last.push(f);
            } else {
              rows.push([f]);
            }
          }
          return rows.map((row, ri) => (
            <div
              key={ri}
              className={`${styles.fieldRow} ${
                row.length === 1 ? styles.fieldRowSingle : ''
              }`}
            >
              {row.map((f) =>
                f.type === 'textarea' ? (
                  <textarea
                    key={f.name}
                    name={f.name}
                    placeholder={f.placeholder}
                    className={styles.textarea}
                    value={values[f.name] ?? ''}
                    onChange={(e) => setField(f.name, e.target.value)}
                  />
                ) : (
                  <input
                    key={f.name}
                    type={f.type ?? 'text'}
                    name={f.name}
                    placeholder={f.placeholder}
                    className={styles.input}
                    value={values[f.name] ?? ''}
                    onChange={(e) => setField(f.name, e.target.value)}
                    autoComplete={
                      f.type === 'email'
                        ? 'email'
                        : f.type === 'tel'
                        ? 'tel'
                        : 'off'
                    }
                  />
                )
              )}
            </div>
          ));
        })()}

        {error && <p className={styles.fieldError}>{error}</p>}

        <button
          type="submit"
          className={styles.submit}
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'SENDING…' : step.cta}
        </button>
      </form>
    </div>
  );
}
