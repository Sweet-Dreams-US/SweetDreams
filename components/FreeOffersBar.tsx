import Link from 'next/link';
import styles from './FreeOffersBar.module.css';

/**
 * Homepage offer bar — a bright strip routing to the three free-funnel
 * landing pages. Each segment is color-coded to its destination's accent
 * (website = blue, content = red, software = green) so the offers read as
 * one product line.
 */
const offers = [
  {
    label: 'Free Website',
    sub: 'See it built before you pay',
    href: '/free-website',
    tone: styles.blue,
  },
  {
    label: 'Free Content Plan',
    sub: 'Your 90 days, mapped free',
    href: '/content-roadmap',
    tone: styles.red,
  },
  {
    label: 'Free Software Demo',
    sub: 'A live demo, branded to you',
    href: '/free-software',
    tone: styles.green,
  },
];

export default function FreeOffersBar() {
  return (
    <section className={styles.bar} aria-label="Free offers">
      {offers.map((o) => (
        <Link key={o.href} href={o.href} className={`${styles.segment} ${o.tone}`}>
          <span className={styles.label}>{o.label}</span>
          <span className={styles.sub}>{o.sub}</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </Link>
      ))}
    </section>
  );
}
