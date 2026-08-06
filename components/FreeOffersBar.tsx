import Link from 'next/link';
import styles from './FreeOffersBar.module.css';

/**
 * Homepage offer bar — a bold, animated block routing to the live free-website
 * funnel, full width. Loud on purpose: a pulsing FREE badge and a periodic
 * light sweep to grab attention. The bar is a 1fr grid, so it auto-fits however
 * many offers are listed (one = full width).
 */
const offers = [
  {
    label: 'Free Website',
    sub: 'Free build, you only pay hosting',
    href: '/free-website',
    tone: styles.green,
  },
  // Content Plan (/content-roadmap) and Software Demo (/free-software) stay live
  // on their own pages but are intentionally OFF the homepage bar — the free
  // website offer runs full width here. Re-add an entry to bring one back.
];

export default function FreeOffersBar() {
  return (
    <section className={styles.bar} aria-label="Free offers">
      {offers.map((o) => (
        <Link key={o.href} href={o.href} className={`${styles.segment} ${o.tone}`}>
          <span className={styles.shine} aria-hidden="true" />
          <span className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Free
          </span>
          <span className={styles.text}>
            <span className={styles.label}>{o.label}</span>
            <span className={styles.sub}>{o.sub}</span>
          </span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </Link>
      ))}
    </section>
  );
}
