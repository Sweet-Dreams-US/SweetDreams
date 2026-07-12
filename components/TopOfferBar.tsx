import Link from 'next/link';
import styles from './TopOfferBar.module.css';

interface TopOfferBarProps {
  tone: 'red' | 'blue';
  label: string;
  sub?: string;
  href: string;
}

/**
 * Bold, sticky offer bar pinned to the top of a page (like the homepage offers
 * bar, but a single page-specific block). Red on Media, blue on Software.
 */
export default function TopOfferBar({ tone, label, sub, href }: TopOfferBarProps) {
  return (
    <Link href={href} className={`${styles.bar} ${styles[tone]}`}>
      <span className={styles.shine} aria-hidden="true" />
      <span className={styles.inner}>
        <span className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          Free
        </span>
        <span className={styles.text}>
          <span className={styles.label}>{label}</span>
          {sub && <span className={styles.sub}>{sub}</span>}
        </span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  );
}
