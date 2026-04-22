'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Hls from 'hls.js';
import styles from './HyperlapseRow.module.css';

export interface HyperlapseItem {
  title: string;
  client: string;
  videoId: string;
  date?: string;
}

// ===== Fullscreen modal — lightbox view of a single hyperlapse =====
// Rendered via createPortal so the dark backdrop escapes any ancestor's
// stacking context / overflow clipping. ESC key and backdrop click close.

interface HyperlapseModalProps {
  item: HyperlapseItem;
  orientation: 'vertical' | 'horizontal';
  onClose: () => void;
}

function HyperlapseModal({ item, orientation, onClose }: HyperlapseModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hlsUrl = `https://customer-w6h9o08eg118alny.cloudflarestream.com/${item.videoId}/manifest/video.m3u8`;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [item.videoId]);

  // ESC to close + lock body scroll while modal is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label={`${item.title} fullscreen`}>
      <button
        type="button"
        className={styles.modalClose}
        onClick={onClose}
        aria-label="Close fullscreen"
      >
        &times;
      </button>
      <div
        className={`${styles.modalVideoWrap} ${orientation === 'vertical' ? styles.modalVertical : styles.modalHorizontal}`}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={styles.modalVideo}
          aria-label={`${item.title} hyperlapse video at full size`}
        />
        <div className={styles.modalCaption}>
          <p className={styles.modalClient}>{item.client}</p>
          <h3 className={styles.modalTitle}>{item.title}</h3>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ===== Card — autoplay loop with hover blur + title + expand button =====

interface HyperlapseCardProps {
  item: HyperlapseItem;
  orientation: 'vertical' | 'horizontal';
  onExpand: () => void;
}

function HyperlapseCard({ item, orientation, onExpand }: HyperlapseCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const video = videoRef.current;
    if (!video) return;

    const hlsUrl = `https://customer-w6h9o08eg118alny.cloudflarestream.com/${item.videoId}/manifest/video.m3u8`;

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 6,
        maxMaxBufferLength: 15,
      });
      hlsRef.current = hls;
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [isVisible, item.videoId]);

  const cardClass = `${styles.card} ${orientation === 'vertical' ? styles.vertical : styles.horizontal}`;

  return (
    <div ref={cardRef} className={cardClass}>
      <div className={styles.videoWrap}>
        {isVisible && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
            poster={`https://customer-w6h9o08eg118alny.cloudflarestream.com/${item.videoId}/thumbnails/thumbnail.jpg?time=1s&height=600`}
            aria-label={`${item.title} hyperlapse video`}
          />
        )}
        <div className={styles.titleOverlay}>
          <p className={styles.client}>{item.client}</p>
          <h3 className={styles.title}>{item.title}</h3>
          <button
            type="button"
            className={styles.expandButton}
            onClick={onExpand}
            aria-label={`Expand ${item.title} to full size`}
          >
            <svg
              className={styles.expandIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 3h6v6" />
              <path d="M9 21H3v-6" />
              <path d="M21 3l-7 7" />
              <path d="M3 21l7-7" />
            </svg>
            <span className={styles.expandLabel}>VIEW FULL</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Row — wraps cards in a grid + owns the active-modal state =====

interface HyperlapseRowProps {
  items: HyperlapseItem[];
  orientation: 'vertical' | 'horizontal';
  label: string;
}

export default function HyperlapseRow({ items, orientation, label }: HyperlapseRowProps) {
  const [expandedItem, setExpandedItem] = useState<HyperlapseItem | null>(null);

  if (items.length === 0) return null;

  return (
    <>
      <section className={styles.section}>
        <div className={styles.labelRow}>
          <span className={styles.labelDot} aria-hidden="true" />
          <span className={styles.label}>{label}</span>
          <span className={styles.labelCount}>{items.length}</span>
        </div>
        <div
          className={`${styles.scrollRow} ${orientation === 'vertical' ? styles.scrollRowVertical : styles.scrollRowHorizontal}`}
        >
          {items.map((item, idx) => (
            <HyperlapseCard
              key={`${item.videoId}-${idx}`}
              item={item}
              orientation={orientation}
              onExpand={() => setExpandedItem(item)}
            />
          ))}
        </div>
      </section>

      {expandedItem && (
        <HyperlapseModal
          item={expandedItem}
          orientation={orientation}
          onClose={() => setExpandedItem(null)}
        />
      )}
    </>
  );
}
