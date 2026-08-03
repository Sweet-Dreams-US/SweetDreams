import type { Metadata } from 'next';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import WebPreviewVideo from '@/components/web/WebPreviewVideo';
import { NICHE_BY_SLUG } from '@/lib/funnel-niches';
import styles from '@/components/funnel/funnel.module.css';

export const metadata: Metadata = {
  title: 'Free Website for Your Business, You Only Pay Hosting | Sweet Dreams',
  description:
    'We build your full website and shoot the photo and video for it, free. You only pay monthly hosting. Hand coded and fully managed. Fort Wayne and Northeast Indiana.',
  robots: { index: false, follow: true },
};

// Non-clickable smart-video previews — real sites we've built, autoplaying
// (muted, looped, starting 1s in). Not links: these sell the quality, they
// aren't case studies to click into.
const showcase = [
  { name: 'Bite Me Protein', videoId: 'a7969078d27d7d15394978d0c02cc306' },
  { name: 'Revive FW', videoId: 'fadf22d878896f6151c6a9b0ca9db90d' },
  { name: 'Creator Space', videoId: '37a027a19196653d4ef79b6c2f5f5758' },
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
    <div className={`${styles.page} ${styles.accentGreen}`}>
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
          Your Website, Free. You Only <span className={styles.hl}>Pay Hosting</span>
        </h1>
        <p className={styles.subhead}>
          We hand build your full website and shoot the photos and video for it,
          free. You only pay hosting, $50 to $400 a month depending on your site.
          A real custom site, designed and shot for your brand.
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
          successBody="We'll reach out shortly, build your site, and send you the live link. You only pay hosting once it is live."
        />

        <div className={styles.trustRow}>
          <span className={styles.trustItem}>
            <span className={styles.trustStar}>✦</span> Hand-coded, not a template
          </span>
          <span className={styles.trustItem}>
            <span className={styles.trustStar}>✦</span> Pro photos &amp; video included
          </span>
          <span className={styles.trustItem}>
            <span className={styles.trustStar}>✦</span> Fully managed · live in days
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
          Free builds offered at our discretion. Monthly hosting required to keep your site live.
        </p>
      </footer>
    </div>
  );
}
