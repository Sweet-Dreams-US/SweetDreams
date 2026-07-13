import type { Metadata } from 'next';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import WebPreviewVideo from '@/components/web/WebPreviewVideo';
import { NICHE_BY_SLUG } from '@/lib/funnel-niches';
import styles from '@/components/funnel/funnel.module.css';

export const metadata: Metadata = {
  title: 'Get Your Website Built Free — See It Before You Pay | Sweet Dreams',
  description:
    'We build your new website first — real, clickable, personalized — before you spend a dollar. Hand-coded, yours to keep, live in days. Fort Wayne.',
  robots: { index: false, follow: true },
};

// Non-clickable smart-video previews — real sites we've built, autoplaying
// (muted, looped, starting 1s in). Not links: these sell the quality, they
// aren't case studies to click into.
const showcase = [
  { name: 'Bite Me Protein', videoId: 'a7969078d27d7d15394978d0c02cc306' },
  { name: 'Ace Gameroom', videoId: 'abc316f410b475f978ab9322b033add6' },
  { name: 'Hot Chicks', videoId: 'bc21e8ee97ddda1e531072021685955a' },
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

export default async function FreeWebsitePage({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string }>;
}) {
  const { niche } = await searchParams;
  const qualifier =
    (niche && NICHE_BY_SLUG[niche]?.w) ||
    'Built for any business ready to look the part';

  return (
    <div className={`${styles.page} ${styles.accentBlue}`}>
      <div className={styles.qualifierBar}>
        <p className={styles.qualifierPill}>
          <span className={styles.qualifierStar}>✦</span>
          <span className={styles.qualifierLabel}>{qualifier}</span>
          <span className={styles.qualifierStar}>✦</span>
        </p>
      </div>

      <div className={styles.stack}>
        <p className={styles.kicker}>Local Businesses</p>
        <h1 className={styles.headline}>
          See Your New Website <span className={styles.hl}>Before You Pay</span>
        </h1>
        <p className={styles.subhead}>
          We hand-build a real, clickable site personalized to your business —
          free. Love it and it&apos;s yours. Don&apos;t, and you owe nothing.
        </p>

        <div className={styles.showcaseRow}>
          {showcase.map((ex) => (
            <div key={ex.videoId} className={styles.showcaseCard}>
              <WebPreviewVideo
                videoId={ex.videoId}
                className={styles.showcaseVideo}
                ariaLabel={`${ex.name} website preview`}
                noMobileVideo
              />
              <span className={styles.showcaseName}>{ex.name}</span>
            </div>
          ))}
        </div>

        <FunnelForm
          funnel="free-website"
          steps={steps}
          successTitle="You're in."
          successBody="We'll reach out shortly, build your site, and send the live link to click through — no payment, no commitment."
        />

        <div className={styles.trustRow}>
          <span className={styles.trustItem}>
            <span className={styles.trustStar}>✦</span> Hand-coded, not a template
          </span>
          <span className={styles.trustItem}>
            <span className={styles.trustStar}>✦</span> Pro photos &amp; video included
          </span>
          <span className={styles.trustItem}>
            <span className={styles.trustStar}>✦</span> Yours to keep · live in days
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
          Spec builds offered at our discretion.
        </p>
      </footer>
    </div>
  );
}
