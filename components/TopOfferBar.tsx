import Link from 'next/link';
import styles from './TopOfferBar.module.css';

interface TopOfferBarProps {
  tone: 'red' | 'blue';
  label: string;
  sub?: string;
  href: string;
}

/**
 * Skinny, standout sticky bar pinned to the top of a page promoting its free
 * offer. Red on Media Production, blue on Software.
 */
export default function TopOfferBar({ tone, label, sub, href }: TopOfferBarProps) {
  return (
    <Link href={href} className={`${styles.bar} ${styles[tone]}`}>
      <span className={styles.shine} aria-hidden="true" />
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
      {sub && <span className={styles.sub}>{sub}</span>}
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
