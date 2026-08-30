'use client';

/**
 * The client's tracked referral link with copy and (on supporting devices)
 * native share. The link is the whole mechanic — every signup through it is
 * credited to this client automatically.
 */
import { useState } from 'react';
import styles from '../portal.module.css';

export default function ReferralShare({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can be blocked; the input stays selectable by hand.
    }
  }

  async function share() {
    try {
      await navigator.share({
        title: 'Free website from Sweet Dreams',
        text: 'Sweet Dreams built my website free, you only pay hosting. Use my link:',
        url: link,
      });
    } catch {
      // User dismissed the sheet — nothing to do.
    }
  }

  const canShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className={styles.shareRow}>
      <input
        className={styles.shareInput}
        readOnly
        value={link}
        onFocus={(e) => e.currentTarget.select()}
        aria-label="Your referral link"
      />
      <button type="button" className={styles.copyBtn} onClick={copy}>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      {canShare && (
        <button type="button" className={styles.copyBtn} onClick={share}>
          Share
        </button>
      )}
    </div>
  );
}
