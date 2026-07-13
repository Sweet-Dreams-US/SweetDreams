'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import styles from '@/app/services/media-production/media.module.css';

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';

/**
 * A vertical social reel that plays muted by default, and on hover (desktop) or
 * tap (mobile) scales up and turns the sound on — no player controls. Streams
 * are lazy-loaded near the viewport.
 */
export default function SocialReel({
  videoId,
  name,
  tag,
  startAt = 1,
}: {
  videoId: string;
  name: string;
  tag: string;
  startAt?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  // Lazy-load the stream only near the viewport.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '250px' }
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, []);

  // Attach HLS and loop from `startAt`.
  useEffect(() => {
    if (!visible) return;
    const v = videoRef.current;
    if (!v) return;
    const src = `${CF}/${videoId}/manifest/video.m3u8`;
    const seek = () => {
      try {
        if (v.currentTime < startAt) v.currentTime = startAt;
      } catch {
        /* retried on next ready event */
      }
    };
    const loop = () => {
      try {
        v.currentTime = startAt;
        void v.play();
      } catch {
        /* ignore */
      }
    };
    v.addEventListener('loadedmetadata', seek);
    v.addEventListener('ended', loop);
    if (v.canPlayType('application/vnd.apple.mpegurl')) {
      v.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 10, maxMaxBufferLength: 30 });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(v);
      hls.on(Hls.Events.MANIFEST_PARSED, seek);
    }
    return () => {
      v.removeEventListener('loadedmetadata', seek);
      v.removeEventListener('ended', loop);
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [visible, videoId, startAt]);

  // Sound follows the active state.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !active;
    if (active) void v.play().catch(() => {});
  }, [active]);

  // Desktop hovers; touch devices tap to toggle.
  const onTap = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
      setActive((a) => !a);
    }
  };

  return (
    <div
      className={`${styles.vtile} ${active ? styles.vtileActive : ''}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={onTap}
      role="button"
      tabIndex={0}
      aria-label={`${name}, ${tag}. Activate for sound.`}
    >
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        preload="metadata"
        className={styles.tileVideo}
        poster={`${CF}/${videoId}/thumbnails/thumbnail.jpg?time=${startAt}s&height=800`}
      />
      <span className={styles.tileScrim} aria-hidden="true" />
      <div className={styles.tileMeta}>
        <span className={styles.tileTag}>{tag}</span>
        <h3 className={styles.tileName}>{name}</h3>
      </div>
    </div>
  );
}
