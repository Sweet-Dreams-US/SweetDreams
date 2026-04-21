'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import styles from './HyperlapseRow.module.css';

export interface HyperlapseItem {
  title: string;
  client: string;
  videoId: string;
  date?: string;
}

interface HyperlapseCardProps {
  item: HyperlapseItem;
  orientation: 'vertical' | 'horizontal';
}

function HyperlapseCard({ item, orientation }: HyperlapseCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy-load HLS only when the card enters the viewport (saves bandwidth
  // when a user has a filter that shows many hyperlapses off-screen)
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
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
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
        </div>
      </div>
    </div>
  );
}

interface HyperlapseRowProps {
  items: HyperlapseItem[];
  orientation: 'vertical' | 'horizontal';
  label: string;
}

export default function HyperlapseRow({ items, orientation, label }: HyperlapseRowProps) {
  if (items.length === 0) return null;

  return (
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
          <HyperlapseCard key={`${item.videoId}-${idx}`} item={item} orientation={orientation} />
        ))}
      </div>
    </section>
  );
}
