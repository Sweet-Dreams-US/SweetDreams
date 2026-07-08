'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';

/**
 * Muted autoplay preview of a Cloudflare Stream website recording.
 *
 * "Starts 1 second in": instead of re-encoding the source, we seek the
 * player to `startAt` on load and, because native `loop` always restarts
 * at 0 (and swallows the `ended` event), we drop `loop` and re-seek to
 * `startAt` on `ended` to build a loop that skips the first second every
 * cycle. Poster is pulled from the same timestamp so the still frame
 * matches the first played frame.
 *
 * HLS everywhere: Safari plays .m3u8 natively; Chrome/Firefox need hls.js
 * (a raw <video src=".m3u8"> silently fails there). Lazy-initialised via
 * IntersectionObserver so a page full of these doesn't fetch every stream
 * at once.
 */
export default function WebPreviewVideo({
  videoId,
  className,
  startAt = 1,
  posterHeight = 600,
  ariaLabel,
}: {
  videoId: string;
  className?: string;
  startAt?: number;
  posterHeight?: number;
  ariaLabel?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [visible, setVisible] = useState(false);

  // Only fetch the stream once the element is near the viewport.
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

  useEffect(() => {
    if (!visible) return;
    const v = videoRef.current;
    if (!v) return;

    const src = `${CF}/${videoId}/manifest/video.m3u8`;

    // Jump past the first second once there's a frame to show. Guarded so a
    // second `loadeddata` (some browsers fire it after a seek) can't yank an
    // already-playing video back to the start.
    const seekToStart = () => {
      try {
        if (v.currentTime < startAt) v.currentTime = startAt;
      } catch {
        /* seek before ready — retried on the next ready event */
      }
    };
    // Manual loop that restarts at `startAt` instead of 0.
    const loopFromStart = () => {
      try {
        v.currentTime = startAt;
        void v.play();
      } catch {
        /* ignore */
      }
    };

    v.addEventListener('loadedmetadata', seekToStart);
    v.addEventListener('loadeddata', seekToStart);
    v.addEventListener('ended', loopFromStart);

    if (v.canPlayType('application/vnd.apple.mpegurl')) {
      v.src = src; // Safari / iOS native HLS
    } else if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 10, maxMaxBufferLength: 30 });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(v);
      hls.on(Hls.Events.MANIFEST_PARSED, seekToStart);
    }

    return () => {
      v.removeEventListener('loadedmetadata', seekToStart);
      v.removeEventListener('loadeddata', seekToStart);
      v.removeEventListener('ended', loopFromStart);
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [visible, videoId, startAt]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      autoPlay
      playsInline
      preload="metadata"
      aria-label={ariaLabel}
      poster={`${CF}/${videoId}/thumbnails/thumbnail.jpg?time=${startAt}s&height=${posterHeight}`}
    />
  );
}
