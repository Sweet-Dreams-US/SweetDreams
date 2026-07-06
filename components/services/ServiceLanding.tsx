import Link from 'next/link';
import { type ServiceData, proofPoster } from '@/lib/services-data';
import styles from './service-landing.module.css';

/**
 * Renders one service landing page: hero → proof-of-work grid → closing.
 * Server component — all flair is CSS.
 */
export default function ServiceLanding({ data }: { data: ServiceData }) {
  return (
    <div className={`${styles.page} ${styles[data.accentClass]}`}>
      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.heroWatermark} aria-hidden="true">
          {data.name.split(' ')[0]}
        </span>
        <div className={styles.heroInner}>
          <p className={styles.kicker}>{data.kicker}</p>
          <h1 className={styles.headline}>
            {data.headline} <span className={styles.hl}>{data.headlineAccent}</span>
          </h1>
          <p className={styles.subhead}>{data.subhead}</p>
          <div className={styles.ctaRow}>
            <Link href={data.primaryCta.href} className={styles.ctaPrimary}>
              {data.primaryCta.label} <span aria-hidden="true">→</span>
            </Link>
            <Link href={data.secondaryCta.href} className={styles.ctaSecondary}>
              {data.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* What we do — bold offerings */}
      <section className={styles.offers}>
        <div className={styles.offersInner}>
          <p className={styles.offersEyebrow}>What we do</p>
          <h2 className={styles.offersTitle}>Pick what you need.</h2>
          <div className={styles.offersGrid}>
            {data.offerings.map((o, i) => (
              <div key={o} className={styles.offerItem}>
                <span className={styles.offerNum}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {o}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof of work */}
      <section className={styles.proof}>
        <div className={styles.proofInner}>
          <p className={styles.proofEyebrow}>Our Work</p>
          <h2 className={styles.proofTitle}>{data.proofHeading}</h2>
          <div className={styles.proofGrid}>
            {data.proof.map((p) => (
              <Link key={p.videoId + p.href} href={p.href} className={styles.proofCard}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proofPoster(p.videoId, p.time)}
                  alt={p.label}
                  className={styles.proofThumb}
                  loading="lazy"
                />
                <div className={styles.proofMeta}>
                  <span className={styles.proofLabel}>{p.label}</span>
                  <span className={styles.proofTag}>{p.tag}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.proofMoreRow}>
            <Link href={data.proofMore.href} className={styles.proofMore}>
              {data.proofMore.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className={styles.closing}>
        <div className={styles.closingInner}>
          <h2 className={styles.closingHeadline}>{data.closingHeadline}</h2>
          <p className={styles.closingSub}>{data.closingSub}</p>
          <Link href={data.closingCta.href} className={styles.closingBtn}>
            {data.closingCta.label} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
