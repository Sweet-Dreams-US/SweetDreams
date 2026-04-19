"use client";

import styles from "./WorkCTABanner.module.css";

interface WorkCTABannerProps {
  variant: "compact" | "feature" | "minimal";
  heading: string;
  subtext?: string;
  buttonText: string;
  onClick: () => void;
  accentColor?: "red" | "yellow" | "blue" | "white";
}

/**
 * Reusable CTA banner used throughout /work page.
 * Three visual variants so we can mesh them into different sections
 * without each one feeling repetitive:
 *
 * - "compact"  — thin horizontal bar, short heading + button
 * - "feature"  — bigger hero-style block with larger heading
 * - "minimal"  — just a styled inline button with supporting text
 */
export default function WorkCTABanner({
  variant,
  heading,
  subtext,
  buttonText,
  onClick,
  accentColor = "white",
}: WorkCTABannerProps) {
  const accentClass =
    accentColor === "red"
      ? styles.accentRed
      : accentColor === "yellow"
      ? styles.accentYellow
      : accentColor === "blue"
      ? styles.accentBlue
      : styles.accentWhite;

  if (variant === "compact") {
    return (
      <section className={`${styles.compact} ${accentClass}`}>
        <div className={styles.compactInner}>
          <div className={styles.compactText}>
            <h3 className={styles.compactHeading}>{heading}</h3>
            {subtext && <p className={styles.compactSubtext}>{subtext}</p>}
          </div>
          <button className={styles.compactButton} onClick={onClick}>
            {buttonText}
          </button>
        </div>
      </section>
    );
  }

  if (variant === "feature") {
    return (
      <section className={`${styles.feature} ${accentClass}`}>
        <div className={styles.featureInner}>
          <h2 className={styles.featureHeading}>{heading}</h2>
          {subtext && <p className={styles.featureSubtext}>{subtext}</p>}
          <button className={styles.featureButton} onClick={onClick}>
            {buttonText}
          </button>
        </div>
      </section>
    );
  }

  // minimal
  return (
    <div className={styles.minimal}>
      {subtext && <p className={styles.minimalSubtext}>{subtext}</p>}
      <button className={`${styles.minimalButton} ${accentClass}`} onClick={onClick}>
        {buttonText} &rarr;
      </button>
    </div>
  );
}
