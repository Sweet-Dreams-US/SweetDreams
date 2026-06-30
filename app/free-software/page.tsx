import type { Metadata } from 'next';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import styles from '@/components/funnel/funnel.module.css';

export const metadata: Metadata = {
  title: 'One System Runs Your Whole Business — Branded To You | Sweet Dreams',
  description:
    'Staff, scheduling, accounting, customers — one system, your brand, and you own it. See a live demo built for your business before you pay. Fort Wayne.',
  robots: { index: false, follow: true },
};

const steps: FunnelStep[] = [
  {
    question: "What's your {name}?",
    cta: "Let's start",
    fields: [
      { name: 'firstName', placeholder: 'First name', required: true, half: true },
      { name: 'lastName', placeholder: 'Last name', required: true, half: true },
    ],
  },
  {
    question: 'Tell us about your {business}',
    cta: 'Continue',
    fields: [
      { name: 'businessName', placeholder: 'Business name', required: true },
      {
        name: 'currentTools',
        placeholder: 'Apps you pay for now?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    question: 'Where do we {send your demo}?',
    cta: 'See my demo',
    fields: [
      { name: 'email', placeholder: 'Email', type: 'email', required: true },
      { name: 'phone', placeholder: 'Phone (optional)', type: 'tel' },
    ],
  },
];

export default function FreeSoftwarePage() {
  return (
    <div className={`${styles.page} ${styles.accentGreen}`}>
      <div className={styles.qualifierBar}>
        <p className={styles.qualifierText}>
          <span className={styles.qualifierDot} />
          For owners running their business on five different subscriptions
        </p>
      </div>

      <div className={styles.stack}>
        <p className={styles.kicker}>Business Owners</p>
        <h1 className={styles.headline}>
          One System Runs It All. <span className={styles.hl}>You Own It.</span>
        </h1>
        <p className={styles.subhead}>
          Staff, scheduling, accounting, customers — connected and branded to
          you. We build a live demo on your business. See it before you pay.
        </p>

        <div className={styles.miniCompare}>
          <div className={styles.miniCol}>
            <p className={styles.miniColHead}>You pay now</p>
            <p className={styles.miniColLine}>
              Scheduling · Books · CRM · POS · Calendar — 5 bills, none yours
            </p>
          </div>
          <div className={styles.miniArrow}>→</div>
          <div className={`${styles.miniCol} ${styles.miniColGood}`}>
            <p className={styles.miniColHead}>You own</p>
            <p className={styles.miniColLine}>
              One system · your branding · everything connected
            </p>
          </div>
        </div>

        <FunnelForm
          funnel="free-software"
          steps={steps}
          successTitle="Demo incoming."
          successBody="We'll learn how your business runs, build a live demo dashboard branded to you, and send a link to click around in — before any talk of price."
        />

        <div className={styles.trustRow}>
          <span className={styles.trustItem}>
            <span className={styles.trustStar}>✦</span> Your logo, your domain, your data
          </span>
        </div>

        <div className={styles.consent}>
          <p className={styles.consentText}>
            By submitting you agree to be contacted by Sweet Dreams Solutions
            about your project. See our <a href="/privacy">Privacy Policy</a> &amp;{' '}
            <a href="/terms">Terms</a>.
          </p>
        </div>
      </div>

      <footer className={styles.miniFooter}>
        <div className={styles.miniFooterLinks}>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/work">Our Work</a>
          <a href="https://sweetdreams.us">sweetdreams.us</a>
        </div>
        <p className={styles.miniFooterFine}>
          © {new Date().getFullYear()} Sweet Dreams US LLC · Fort Wayne, Indiana.
          Demo builds offered at our discretion.
        </p>
      </footer>
    </div>
  );
}
