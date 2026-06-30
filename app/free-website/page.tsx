import type { Metadata } from 'next';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import styles from '@/components/funnel/funnel.module.css';

export const metadata: Metadata = {
  title: 'Get Your Website Built Free — See It Before You Pay | Sweet Dreams',
  description:
    'We build your new website first — real, clickable, personalized — before you spend a dollar. Hand-coded, yours to keep, live in days. Fort Wayne.',
  // Paid-traffic landing page — keep it out of organic search.
  robots: { index: false, follow: true },
};

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';
const poster = (id: string) =>
  `${CF}/${id}/thumbnails/thumbnail.jpg?time=2s&height=600`;

const examples = [
  {
    name: 'MC Racing',
    url: 'https://mcracingfortwayne.com',
    videoId: '1ab82de79e003fc0c37afc0a27fedbc4',
  },
  {
    name: 'Sweet Dreams Music',
    url: 'https://sweetdreamsmusic.com',
    videoId: 'c7a40ce22803114bab73611635add20c',
  },
  {
    name: 'Sweet Dreams',
    url: 'https://sweetdreams.us',
    videoId: '2e09ff39e945e08cf28ced40197bf836',
  },
];

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
    question: "What's your {business}?",
    cta: 'Continue',
    fields: [
      { name: 'businessName', placeholder: 'Business name', required: true },
      { name: 'whatYouDo', placeholder: 'What do you do?', required: true },
    ],
  },
  {
    question: 'Where do we {send it}?',
    cta: 'Build mine free',
    fields: [
      { name: 'email', placeholder: 'Email', type: 'email', required: true },
      { name: 'phone', placeholder: 'Phone (optional)', type: 'tel' },
    ],
  },
];

export default function FreeWebsitePage() {
  return (
    <div className={`${styles.page} ${styles.accentBlue}`}>
      {/* Qualifier — swap this line per campaign / niche */}
      <div className={styles.qualifierBar}>
        <p className={styles.qualifierText}>
          <span className={styles.qualifierDot} />
          Built for Fort Wayne businesses ready to look the part
        </p>
      </div>

      <section className={styles.hero}>
        <p className={styles.kicker}>Local Businesses</p>
        <h1 className={styles.headline}>
          See Your New Website <span className={styles.hl}>Before You Pay</span> a
          Dollar
        </h1>
        <p className={styles.subhead}>
          Tell us about your business and we&apos;ll hand-build a real, clickable
          site — personalized to you — for free. If you love it, it&apos;s yours.
          If you don&apos;t, you owe nothing.
        </p>
      </section>

      {/* Visual proof — three live sites you can click right now */}
      <section className={styles.media}>
        <div className={styles.exampleGrid}>
          {examples.map((ex) => (
            <a
              key={ex.url}
              href={ex.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.exampleCard}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poster(ex.videoId)}
                alt={`${ex.name} website`}
                className={styles.exampleThumb}
                loading="lazy"
              />
              <span className={styles.exampleLabel}>
                <span className={styles.exampleName}>{ex.name}</span>
                <span className={styles.exampleVisit}>Visit →</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Capture */}
      <section id="form" className={styles.formZone}>
        <FunnelForm
          funnel="free-website"
          steps={steps}
          successTitle="You're in."
          successBody="We're already on it. We'll reach out shortly to confirm a few details, then build your site and send you the live link to click through — no payment, no commitment."
        />
      </section>

      <div className={styles.trust}>
        <div className={styles.trustItem}>
          <span className={styles.trustStar}>✦</span> Hand-coded — not a template
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustStar}>✦</span> Yours to keep · live in days
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

      {/* Proof */}
      <section className={`${styles.section} ${styles.sectionTint}`}>
        <div className={styles.sectionInnerNarrow}>
          <div className={styles.quoteBlock}>
            <p className={styles.quoteText}>
              &ldquo;Every other shop sent a quote and a wireframe. Sweet Dreams
              sent the actual finished website. There was nothing left to think
              about — I just said yes.&rdquo;
            </p>
            <p className={styles.quoteAttr}>— A Sweet Dreams client</p>
            <div className={styles.ctaCenter}>
              <a href="#form" className={styles.ctaJump}>
                Build mine free
              </a>
            </div>
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
          Spec builds are offered at our discretion. Results vary by business.
        </p>
      </footer>
    </div>
  );
}
