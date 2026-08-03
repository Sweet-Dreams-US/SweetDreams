import Link from 'next/link';
import styles from './PressBanner.module.css';

/**
 * Homepage announcement strip pointing to the on-site press release (/press)
 * for the 50-free-websites campaign. Quiet on the black homepage until hover.
 */
export default function PressBanner() {
  return (
    <Link href="/press" className={styles.banner} aria-label="Read the 50 free websites announcement">
      <span className={styles.tag}>Announcement</span>
      <span className={styles.text}>
        We are building 50 Fort Wayne businesses a <span className={styles.free}>free website</span>.
      </span>
      <span className={styles.cta}>
        Read the release <span className={styles.arrow} aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
