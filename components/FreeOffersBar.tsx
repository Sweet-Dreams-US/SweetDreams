import Link from 'next/link';
import styles from './FreeOffersBar.module.css';

/**
 * Homepage offer bar — two bold, animated offer blocks routing to the live
 * free-funnel landing pages. Loud on purpose: a pulsing FREE badge and a
 * periodic light sweep to grab attention.
 *
 * Business operations (software) is intentionally hidden for now — the
 * /free-software page stays live but is not promoted here. To re-enable,
 * uncomment the Free Software Demo entry below (the bar auto-fits the count).
 */
const offers = [
  {
    label: 'Website',
    sub: 'Built before you pay a dollar',
    href: '/free-website',
    tone: styles.blue,
  },
  {
    label: 'Content Plan',
    sub: '90 days of content, you do nothing',
    href: '/content-roadmap',
    tone: styles.purple,
  },
  // {
  //   label: 'Software Demo',
  //   sub: 'A live demo, branded to you',
  //   href: '/free-software',
  //   tone: styles.green,
  // },
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
