'use client';

/**
 * Sign form + post-sign account setup.
 *
 * Phases:
 *   sign          — typed name + both consent checkboxes
 *   password      — new account: set a password right here (or skip → email)
 *   done_existing — signer already had an account (music site or repeat
 *                   client); we never touch their existing password
 *   email_sent    — they skipped; a set-password email is on its way
 *
 * On successful password set we sign them straight into the portal.
 */
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SIGN_CONSENTS } from '@/lib/agreements/consents';
import PasswordField from '@/components/PasswordField';
import SignaturePad from './SignaturePad';
import styles from './agreement.module.css';

type Phase = 'sign' | 'password' | 'done_existing' | 'email_sent' | 'done_set';

interface Props {
  token: string;
  contactName: string;
  businessName: string;
}

export default function AgreementSignForm({
  token,
  contactName,
  businessName,
}: Props) {
  const [phase, setPhase] = useState<Phase>('sign');
  const [name, setName] = useState(contactName);
  const [signature, setSignature] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [esignConsent, setEsignConsent] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [accountEmail, setAccountEmail] = useState('');

  async function submitSignature() {
    setError('');
    if (name.trim().length < 2) {
      setError('Please type your full legal name.');
      return;
    }
    if (!signature) {
      setError('Please draw your signature in the box.');
      return;
    }
    if (!agreeTerms || !esignConsent) {
      setError('Please check both boxes to sign.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/agreement/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: name.trim(),
          signature_image: signature,
          consents: { agree_terms: agreeTerms, esign_consent: esignConsent },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.error === 'already_signed') {
          setError('This agreement was already signed. Refresh the page.');
        } else if (data.error === 'expired') {
          setError('This link expired. Email cole@sweetdreams.us for a fresh one.');
        } else {
          setError(data.error || 'Something went wrong. Please try again.');
        }
        return;
      }
      setAccountEmail(data.email || '');
      if (data.has_existing_account || !data.setup_token) {
        setPhase('done_existing');
      } else {
        setSetupToken(data.setup_token);
        setPhase('password');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function submitPassword() {
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/agreement/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setup_token: setupToken, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not set your password. Use the emailed link instead.');
        return;
      }
      // Log them straight in — this is their first portal visit.
      const email = data.email || accountEmail;
      if (email) {
        const supabase = createClient();
        const { error: loginErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!loginErr) {
          window.location.href = '/portal';
          return;
        }
      }
      setPhase('done_set');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function skipPassword() {
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/agreement/skip-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setup_token: setupToken }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not send the email. Please try again.');
        return;
      }
      setPhase('email_sent');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (phase === 'done_existing') {
    return (
      <div className={styles.successBox}>
        <h2 className={styles.successTitle}>
          Signed. You already have an account with us.
        </h2>
        <p className={styles.successText}>
          A copy of your agreement is on its way to your inbox. The email{' '}
          <strong>{accountEmail || 'you signed with'}</strong> already has a
          Sweet Dreams login (for example from Sweet Dreams Music or an
          earlier project), so we connected your new website to that account
          instead of creating a second one. Log in with the password you
          already use. Forgot it? Use Forgot Password on the login page and
          we will email you a reset link.
        </p>
        <a className={styles.primaryBtn} href="/portal/login">
          Log In to Your Portal
        </a>
      </div>
    );
  }

  if (phase === 'email_sent') {
    return (
      <div className={styles.successBox}>
        <h2 className={styles.successTitle}>Signed. Check your email.</h2>
        <p className={styles.successText}>
          A copy of your agreement and a link to finish setting up your portal
          login are on their way to {accountEmail || 'your inbox'}.
        </p>
      </div>
    );
  }

  if (phase === 'done_set') {
    return (
      <div className={styles.successBox}>
        <h2 className={styles.successTitle}>Password set</h2>
        <p className={styles.successText}>
          Your portal login is ready. Log in to follow your website build.
        </p>
        <a className={styles.primaryBtn} href="/portal/login">
          Log In to Your Portal
        </a>
      </div>
    );
  }

  if (phase === 'password') {
    return (
      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>Signed. Now create your account.</h2>
        <p className={styles.formHint}>
          Your account is your client portal login for{' '}
          {accountEmail || 'your email'}. It is where you follow your build,
          see your live links, and read your agreement anytime. Choose a
          password to finish.
        </p>
        <label className={styles.label}>
          Password (at least 8 characters)
          <PasswordField
            className={styles.input}
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
        </label>
        <label className={styles.label}>
          Confirm password
          <PasswordField
            className={styles.input}
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button
          className={styles.primaryBtn}
          onClick={submitPassword}
          disabled={busy}
        >
          {busy ? 'Creating your account...' : 'Create My Account'}
        </button>
        <button
          className={styles.ghostBtn}
          onClick={skipPassword}
          disabled={busy}
        >
          Skip for now (email me a link)
        </button>
      </div>
    );
  }

  return (
    <div className={styles.formSection}>
      <h2 className={styles.formTitle}>Sign for {businessName}</h2>

      <label className={styles.checkRow}>
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
        />
        <span>{SIGN_CONSENTS[0].label}</span>
      </label>
      <label className={styles.checkRow}>
        <input
          type="checkbox"
          checked={esignConsent}
          onChange={(e) => setEsignConsent(e.target.checked)}
        />
        <span>{SIGN_CONSENTS[1].label}</span>
      </label>

      <label className={styles.label}>
        Type your full legal name to sign
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
        />
      </label>

      <div className={styles.label}>
        Draw your signature (use your mouse, or your finger on mobile)
        <SignaturePad onChange={setSignature} />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.primaryBtn}
        onClick={submitSignature}
        disabled={busy}
      >
        {busy ? 'Signing...' : 'Sign Agreement'}
      </button>
      <p className={styles.finePrint}>
        When you sign, we record your typed name, the date and time, and your
        connection details as your signature record. You get a copy by email.
      </p>
    </div>
  );
}
