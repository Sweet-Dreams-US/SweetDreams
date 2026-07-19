'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
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

const TURNSTILE_SITE_KEY = '0x4AAAAAACJodExIWnZ-7sQq';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
}
const getTurnstile = (): TurnstileApi | undefined =>
  (window as unknown as { turnstile?: TurnstileApi }).turnstile;

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

  // Turnstile (only on the final step)
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // One-shot latch so the browser Lead conversion fires at most once per form
  // instance, even if two submit events race through before the disabled
  // button state commits. Purely a tracking guard — it does not touch submit,
  // validation, the DB write, or the email.
  const firedRef = useRef(false);

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const setField = (name: string, value: string) =>
    setValues((v) => ({ ...v, [name]: value }));

  const renderTurnstile = useCallback(() => {
    const ts = getTurnstile();
    if (ts && turnstileRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = ts.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (t: string) => {
            setToken(t);
            setError(null);
          },
          'expired-callback': () => setToken(null),
          'error-callback': () => setToken(null),
          theme: 'light',
          size: 'flexible',
        });
      } catch {
        /* render is retried when scriptReady / step changes */
      }
    }
  }, []);

  // If the script already loaded (client nav), mark ready on mount.
  useEffect(() => {
    if (getTurnstile()) setScriptReady(true);
  }, []);

  // Mount the widget once we're on the last step and the script is ready.
  useEffect(() => {
    if (isLast && scriptReady) renderTurnstile();
  }, [isLast, scriptReady, renderTurnstile]);

  // Top-of-funnel signal: fire ViewContent when the offer is seen. This is
  // the missing mid-funnel rung — with only Lead firing, Meta (and we) can't
  // see landing→lead drop-off per ad. Browser fbq + server CAPI share one
  // eventID so Meta dedupes the pair (same pattern as Lead). Fires once per
  // mount. Also pushes a GA4 dataLayer event for funnel analysis.
  useEffect(() => {
    const eventId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `vc-${funnel}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      const w = window as unknown as {
        fbq?: (...args: unknown[]) => void;
        dataLayer?: Record<string, unknown>[];
      };
      if (typeof w.fbq === 'function') {
        w.fbq(
          'track',
          'ViewContent',
          { content_name: funnel, content_category: 'funnel' },
          { eventID: eventId }
        );
      }
      w.dataLayer?.push({ event: 'funnel_view', funnel });
    } catch {
      /* analytics best-effort */
    }
    // Server-side mirror (CAPI) — deduped by eventId, survives ad blockers.
    fetch('/api/meta-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        eventName: 'ViewContent',
        eventId,
        funnel,
        contentName: funnel,
        sourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      }),
    }).catch(() => {
      /* best-effort */
    });
  }, [funnel]);

  const validateStep = (): string | null => {
    for (const f of step.fields) {
      const val = (values[f.name] ?? '').trim();
      if (f.required && !val) return 'Please fill in the required fields.';
      if (f.type === 'email' && val && !EMAIL_RE.test(val))
        return 'Please enter a valid email address.';
    }
    return null;
  };

  const fireConversion = (metaEventId: string) => {
    // Idempotent: only the first successful submission fires the Lead. A second
    // call (e.g. a rapid double-submit that slips past the disabled button) is a
    // no-op, so the browser can never mint two Lead events for one submission.
    if (firedRef.current) return;
    firedRef.current = true;
    try {
      const w = window as unknown as {
        gtag?: (...args: unknown[]) => void;
        fbq?: (...args: unknown[]) => void;
        dataLayer?: Record<string, unknown>[];
      };
      if (typeof w.gtag === 'function')
        w.gtag('event', 'generate_lead', { funnel });
      // eventID matches the server-side CAPI Lead so Meta dedupes the pair.
      if (typeof w.fbq === 'function')
        w.fbq('track', 'Lead', { funnel }, { eventID: metaEventId });
      w.dataLayer?.push({ event: 'lead_captured', funnel });
    } catch {
      /* analytics best-effort */
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
      // GA4 funnel-progress signal (kept in GA4/dataLayer only — NOT sent to
      // the Meta pixel, so the Meta dataset stays clean for optimization).
      try {
        (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer?.push({
          event: 'funnel_step',
          funnel,
          step: stepIndex + 1,
          step_name: step.question,
        });
      } catch {
        /* best-effort */
      }
      setStepIndex((i) => i + 1);
      return;
    }

    // Final step → require the human check, then submit.
    if (!token) {
      setError('Please complete the verification.');
      return;
    }

    setStatus('submitting');
    try {
      // One id for both the browser fbq Lead and the server CAPI Lead —
      // Meta keeps whichever arrives first and drops the duplicate.
      const metaEventId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${funnel}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const res = await fetch('/api/funnel-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funnel,
          ...values,
          honeypot,
          turnstileToken: token,
          metaEventId,
        }),
      });
      if (res.ok) {
        fireConversion(metaEventId);
        setStatus('success');
      } else {
        setStatus('error');
        setError('Something went wrong. Please try again.');
        setToken(null);
        const ts = getTurnstile();
        if (ts && widgetIdRef.current) ts.reset(widgetIdRef.current);
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
      {/* Turnstile script — loads once, used on the final step */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />

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

        {/* Turnstile renders here only on the final step */}
        {isLast && <div ref={turnstileRef} className={styles.turnstileWrap} />}

        {error && <p className={styles.fieldError}>{error}</p>}

        <button
          type="submit"
          className={styles.submit}
          disabled={status === 'submitting' || (isLast && !token)}
        >
          {status === 'submitting' ? 'SENDING…' : step.cta}
        </button>
      </form>
    </div>
  );
}
