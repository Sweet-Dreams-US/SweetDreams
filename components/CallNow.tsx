'use client';

import styles from './CallNow.module.css';

// High-urgency interrupt block for users who prefer a phone call over
// a contact form. Rendered as a bold banner so it reads as a literal
// "interrupt pattern" between softer marketing sections.
export default function CallNow() {
  return (
    <section className={styles.section} aria-label="Call now">
      <div className={styles.container}>
        <p className={styles.kicker}>WHY WAIT?</p>
        <h2 className={styles.headline}>
          CALL THIS NUMBER NOW<br />
          WITH YOUR QUESTIONS
        </h2>

        <a href="tel:+12606157467" className={styles.phoneLink}>
          <span className={styles.phoneIcon} aria-hidden="true">&#9742;</span>
          <span className={styles.phoneNumber}>(260) 615-7467</span>
        </a>

        <p className={styles.subtext}>
          Real humans. Same-day response. No voicemail maze.
        </p>
      </div>
    </section>
  );
}
