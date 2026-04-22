import Link from "next/link";
import styles from "./error.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Go Home
          </Link>
          <Link href="/book" className={styles.secondaryButton}>
            Book a Call
          </Link>
        </div>

        <div className={styles.helpText}>
          <p>Looking for something specific?</p>
          <div className={styles.links}>
            <Link href="/work">Our Work</Link>
            <Link href="/solutions">Solutions</Link>
            <Link href="/book">Book a Call</Link>
            <a href="https://sweetdreamsmusic.com" target="_blank" rel="noopener noreferrer">Music Studio</a>
          </div>
        </div>
      </div>
    </div>
  );
}
