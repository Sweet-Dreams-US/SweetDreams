import type { Metadata } from 'next';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import FunnelReel from '@/components/funnel/FunnelReel';
import styles from '@/components/funnel/funnel.module.css';

export const metadata: Metadata = {
  title: 'We Bring the Cameras — 3 Months of Content, You Do Nothing | Sweet Dreams',
  description:
    'Every other social company asks you to send footage. We bring the cameras to you, make three months of content, and run every platform for you. Fort Wayne.',
  robots: { index: false, follow: true },
};

// Real vertical reels — proof of "we bring the cameras and make the content."
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

export default function ContentRoadmapPage() {
  return (
    <div className={`${styles.page} ${styles.accentRed}`}>
      <div className={styles.qualifierBar}>
        <p className={styles.qualifierText}>
          <span className={styles.qualifierDot} />
          Built for local businesses that want to be everywhere — with no time to film
        </p>
      </div>

      <section className={styles.hero}>
        <p className={styles.kicker}>Local Businesses</p>
        <h1 className={styles.headline}>
          3 Months of Content, Filmed At Your Business,{' '}
          <span className={styles.hl}>You Do Nothing</span>
        </h1>
        <p className={styles.subhead}>
          We show up with the cameras, capture three months of content in one
          visit, edit it in your style, and post it on every platform for you.
          Start with your free 90-day content plan.
        </p>
      </section>

      {/* Vertical reel proof — real shoots, autoplaying muted like a feed */}
      <section className={styles.media}>
        <div className={styles.reelGrid}>
          {REELS.map((id) => (
            <div key={id} className={styles.reelItem}>
              <FunnelReel videoId={id} />
            </div>
          ))}
        </div>
      </section>

      <section id="form" className={styles.formZone}>
        <FunnelForm
          funnel="content-roadmap"
          steps={steps}
          successTitle="Your plan is on the way."
          successBody="We'll map out the exact 90 days of content we'd film and post for you and send it over. No filming for you, no editing, no posting — that's the whole point."
        />
      </section>

      <div className={styles.trust}>
        <div className={styles.trustItem}>
          <span className={styles.trustStar}>✦</span> We bring the cameras — you don&apos;t lift a finger
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustStar}>✦</span> Filmed, edited, and posted for you
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

      {/* The wedge + promise stack */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.sectionInnerNarrow}>
          <p className={styles.wedge}>
            Every other social company asks you to send them footage.{' '}
            <span className={styles.hl}>We bring the cameras to you.</span>
          </p>
          <div className={styles.promiseStack}>
            <div className={styles.promiseItem}>
              <span className={styles.promiseMark}>✗</span> You don&apos;t film
            </div>
            <div className={styles.promiseItem}>
              <span className={styles.promiseMark}>✗</span> You don&apos;t edit
            </div>
            <div className={styles.promiseItem}>
              <span className={styles.promiseMark}>✗</span> You don&apos;t post
            </div>
            <div className={styles.promiseItem}>
              <span className={styles.promiseMark}>✓</span> We do all of it
            </div>
          </div>
        </div>
      </section>

      {/* Replacement comparison — scattered à la carte vs the one offer */}
      <section className={`${styles.section} ${styles.sectionTint}`}>
        <div className={styles.sectionInner}>
          <p className={styles.eyebrow}>What it would cost you in pieces</p>
          <h2 className={styles.sectionTitle}>Four Hires vs. One Offer</h2>
          <div className={styles.compare}>
            <div className={`${styles.compareCol} ${styles.compareBad}`}>
              <h3 className={styles.compareHead}>Piece it together</h3>
              <ul className={styles.compareList}>
                <li className={styles.compareLine}>
                  <span>Videographer</span>
                  <span className={styles.compareFee}>per shoot</span>
                </li>
                <li className={styles.compareLine}>
                  <span>Editor</span>
                  <span className={styles.compareFee}>per video</span>
                </li>
                <li className={styles.compareLine}>
                  <span>Social manager</span>
                  <span className={styles.compareFee}>monthly</span>
                </li>
                <li className={styles.compareLine}>
                  <span>Content strategist</span>
                  <span className={styles.compareFee}>monthly</span>
                </li>
              </ul>
              <p className={styles.compareTotalBad}>
                Thousands a month — scattered &amp; unmanaged
              </p>
            </div>

            <div className={styles.compareVs}>vs</div>

            <div className={`${styles.compareCol} ${styles.compareGood}`}>
              <h3 className={styles.compareHead}>Sweet Dreams</h3>
              <ul className={styles.compareList}>
                <li className={`${styles.compareLine} ${styles.compareGoodLine}`}>
                  One shoot at your business
                </li>
                <li className={`${styles.compareLine} ${styles.compareGoodLine}`}>
                  3 months of content
                </li>
                <li className={`${styles.compareLine} ${styles.compareGoodLine}`}>
                  Edited in your brand style
                </li>
                <li className={`${styles.compareLine} ${styles.compareGoodLine}`}>
                  Posted &amp; managed on every platform
                </li>
              </ul>
              <p className={styles.compareTotalGood}>One offer. Everything handled.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The offer + price revealed inside the stack */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <p className={styles.eyebrow}>The offer</p>
          <h2 className={styles.sectionTitle}>Everything, Done For You</h2>
          <div className={styles.offerBox}>
            <ul className={styles.offerList}>
              <li className={styles.offerLine}>
                <span className={styles.offerCheck}>✓</span> Filmed in person on cinema
                cameras at your business
              </li>
              <li className={styles.offerLine}>
                <span className={styles.offerCheck}>✓</span> A full 3 months of content
                from one shoot
              </li>
              <li className={styles.offerLine}>
                <span className={styles.offerCheck}>✓</span> Edited in your brand style
              </li>
              <li className={styles.offerLine}>
                <span className={styles.offerCheck}>✓</span> Posted &amp; fully managed on
                every platform
              </li>
            </ul>
            <div className={styles.priceRow}>
              <p className={styles.priceStrike}>
                A videographer, editor, social manager &amp; strategist would run{' '}
                <s>thousands a month</s>
              </p>
              <div className={styles.priceBig}>$2,850</div>
              <p className={styles.priceNote}>
                one shoot · 3 months of content · then $500/mo to keep it running
              </p>
            </div>
          </div>

          {/* Guarantee — your answer: a full 3 months of content, guaranteed */}
          <div className={styles.guarantee}>
            <h3 className={styles.guaranteeTitle}>The 3-Month Guarantee</h3>
            <p className={styles.guaranteeText}>
              You get a full three months of content — guaranteed. If we
              don&apos;t deliver every piece, we keep filming free until it&apos;s
              all done. You are never short of content.
            </p>
          </div>

          <div className={styles.ctaCenter}>
            <a href="#form" className={styles.ctaJump}>
              Get my content plan
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
          Pricing shown is a starting point and may vary by scope. Results vary by
          business.
        </p>
      </footer>
    </div>
  );
}
