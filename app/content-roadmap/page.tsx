import type { Metadata } from 'next';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import FunnelReel from '@/components/funnel/FunnelReel';
import { NICHE_BY_SLUG } from '@/lib/funnel-niches';
import styles from '@/components/funnel/funnel.module.css';

export const metadata: Metadata = {
  title: 'We Bring the Cameras — 3 Months of Content, You Do Nothing | Sweet Dreams',
  description:
    'Every other social company asks you to send footage. We bring the cameras to you, make three months of content, and run every platform for you. Fort Wayne.',
  robots: { index: false, follow: true },
};

const REELS = ['62ea7c66a3ad77eadd83bd89c01f98c2', 'f4aa9217c51a8f15aaa849a25763fb57'];

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
      { name: 'whatYouDo', placeholder: 'What do you do?', required: true },
    ],
  },
  {
    question: 'Where do we {send your plan}?',
    cta: 'Get my content plan',
    fields: [
      { name: 'email', placeholder: 'Email', type: 'email', required: true },
      { name: 'phone', placeholder: 'Phone (optional)', type: 'tel' },
    ],
  },
];

export default async function ContentRoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string }>;
}) {
  const { niche } = await searchParams;
  const qualifier =
    (niche && NICHE_BY_SLUG[niche]?.c) ||
    'For local businesses that want to be everywhere — with no time to film';

  return (
    <div className={`${styles.page} ${styles.accentPurple}`}>
      <div className={styles.qualifierBar}>
        <p className={styles.qualifierPill}>
          <span className={styles.qualifierStar}>✦</span>
          <span className={styles.qualifierLabel}>{qualifier}</span>
          <span className={styles.qualifierStar}>✦</span>
        </p>
      </div>

      <div className={styles.stack}>
        <p className={styles.kicker}>
          Every other company asks you to send footage.{' '}
          <strong>We bring the cameras.</strong>
        </p>
        <h1 className={styles.headline}>
          3 Months of Content. <span className={styles.hl}>You Do Nothing.</span>
        </h1>
        <p className={styles.subhead}>
          First, we build your 90-day content plan — <strong>free</strong>. You see
          exactly what we&apos;d film before you pay a dime. Then we bring the
          cameras and make it.
        </p>

        <div className={styles.reelRow}>
          {REELS.map((id) => (
            <div key={id} className={styles.reelItem}>
              <FunnelReel videoId={id} />
            </div>
          ))}
        </div>

        <div className={styles.offerCard}>
          <p className={styles.offerLineItem}>
            <span className={styles.offerCheck}>✓</span>{' '}
            <span className={styles.hl}>
              <strong>Free 90-day content plan up front</strong>
            </span>{' '}
            — see exactly what we&apos;d film before you pay
          </p>
          <p className={styles.offerLineItem}>
            <span className={styles.offerCheck}>✓</span> Filmed at your business · edited
            in your style · posted &amp; managed everywhere
          </p>
          <p className={styles.offerLineItem}>
            <span className={styles.offerCheck}>✓</span> One shoot · a full 3 months of
            content · you do nothing
          </p>
          <p className={styles.guaranteeChip}>
            <strong>Guarantee:</strong> a full 3 months of content delivered — or
            we keep filming free until it is.
          </p>
        </div>

        <FunnelForm
          funnel="content-roadmap"
          steps={steps}
          successTitle="Your plan is on the way."
          successBody="We'll map the exact 90 days of content we'd film and post for you, and send it over. No filming, editing, or posting on your end — that's the point."
        />

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
          Pricing is a starting point and may vary by scope.
        </p>
      </footer>
    </div>
  );
}
