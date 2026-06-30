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
        placeholder: 'Which apps/subscriptions are you paying for now?',
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

// The scattered stack they pay for now vs. the one system they'd own.
const stackNow = [
  ['Scheduling app', '$/mo'],
  ['Accounting / books', '$/mo'],
  ['CRM', '$/mo'],
  ['POS / payments tool', '$/mo'],
  ['Calendar / forms tool', '$/mo'],
];

export default function FreeSoftwarePage() {
  return (
    <div className={`${styles.page} ${styles.accentGreen}`}>
      <div className={styles.qualifierBar}>
        <p className={styles.qualifierText}>
          <span className={styles.qualifierDot} />
          Built for owners running their business on five different subscriptions
        </p>
      </div>

      <section className={styles.hero}>
        <p className={styles.kicker}>Business Owners</p>
        <h1 className={styles.headline}>
          One System Runs Your Whole Business.{' '}
          <span className={styles.hl}>You Own It.</span>
        </h1>
        <p className={styles.subhead}>
          Staff. Scheduling. Accounting. Customers. All connected, all branded to
          you. We&apos;ll build a live demo on your business — see it running
          before you pay a dime.
        </p>
      </section>

      {/* Demo visual — SWAP THIS PLACEHOLDER for the real dashboard mockup/video.
          Drop a Cloudflare <video> or an <img src="..."> into .frameWide. */}
      <section className={styles.media}>
        <div className={styles.frameWide}>
          <div className={styles.framePlaceholder}>
            <span className={styles.framePlaceholderTitle}>Your dashboard, your brand</span>
            <span className={styles.framePlaceholderSub}>
              Demo mockup goes here — swap this placeholder for the dashboard
              walkthrough.
            </span>
          </div>
        </div>
      </section>

      <section id="form" className={styles.formZone}>
        <FunnelForm
          funnel="free-software"
          steps={steps}
          successTitle="Demo incoming."
          successBody="We'll reach out to learn how your business runs, then build a live demo dashboard branded to you. You'll get a link to click around in before any conversation about price."
        />
      </section>

      <div className={styles.trust}>
        <div className={styles.trustItem}>
          <span className={styles.trustStar}>✦</span> Your logo, your domain, your data
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustStar}>✦</span> Built to replace the whole monthly pile
        </div>
      </div>

      <div className={styles.consent}>
        <p className={styles.consentText}>
          By providing your information you agree to be contacted by Sweet Dreams
          Solutions by phone, text, or email about your project. We do not sell
          your personal information. See our{' '}
          <a href="/privacy">Privacy Policy</a> and{' '}
          <a href="/terms">Terms of Service</a>.
        </p>
      </div>

      {/* The centerpiece: scattered stack vs one owned system */}
      <section className={`${styles.section} ${styles.sectionTint}`}>
        <div className={styles.sectionInner}>
          <p className={styles.eyebrow}>Stop renting five tools that don&apos;t talk</p>
          <h2 className={styles.sectionTitle}>The Pile vs. One System</h2>
          <div className={styles.compare}>
            <div className={`${styles.compareCol} ${styles.compareBad}`}>
              <h3 className={styles.compareHead}>What you pay now</h3>
              <ul className={styles.compareList}>
                {stackNow.map(([name, fee]) => (
                  <li key={name} className={styles.compareLine}>
                    <span>{name}</span>
                    <span className={styles.compareFee}>{fee}</span>
                  </li>
                ))}
              </ul>
              <p className={styles.compareTotalBad}>
                A stack of monthly fees — none of it yours
              </p>
            </div>

            <div className={styles.compareVs}>vs</div>

            <div className={`${styles.compareCol} ${styles.compareGood}`}>
              <h3 className={styles.compareHead}>What we build you</h3>
              <ul className={styles.compareList}>
                <li className={`${styles.compareLine} ${styles.compareGoodLine}`}>
                  Staff &amp; scheduling
                </li>
                <li className={`${styles.compareLine} ${styles.compareGoodLine}`}>
                  Accounting &amp; invoicing
                </li>
                <li className={`${styles.compareLine} ${styles.compareGoodLine}`}>
                  Customer management (CRM)
                </li>
                <li className={`${styles.compareLine} ${styles.compareGoodLine}`}>
                  Payments &amp; bookings
                </li>
                <li className={`${styles.compareLine} ${styles.compareGoodLine}`}>
                  All connected · your branding
                </li>
              </ul>
              <p className={styles.compareTotalGood}>One system. You own it.</p>
            </div>
          </div>
          <div className={styles.ctaCenter}>
            <a href="#form" className={styles.ctaJump}>
              See my demo
            </a>
          </div>
        </div>
      </section>

      <footer className={styles.miniFooter}>
        <div className={styles.miniFooterLinks}>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/work">Our Work</a>
          <a href="https://sweetdreams.us">sweetdreams.us</a>
        </div>
        <p className={styles.miniFooterFine}>
          © {new Date().getFullYear()} Sweet Dreams US LLC · Fort Wayne, Indiana.
          Demo builds are offered at our discretion. Results vary by business.
        </p>
      </footer>
    </div>
  );
}
