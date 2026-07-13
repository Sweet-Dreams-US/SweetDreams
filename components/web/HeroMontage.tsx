'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';

export interface MontageClip {
  videoId: string;
  /** How many seconds of this clip to play before advancing. */
  seconds: number;
  /** Optional label (e.g. brand name) for the parent to show in a chrome bar. */
  label?: string;
}

/**
 * Plays a sequence of Cloudflare Stream clips back to back, each for a fixed
 * number of seconds, then loops. Clips crossfade. Lazy-initialised via
 * IntersectionObserver so the streams only load near the viewport.
 *
 * The parent can react to which clip is showing via `onActiveChange` (used to
 * sync a browser-chrome URL/label to the current clip).
 */
export default function HeroMontage({
  clips,
  className,
  posterHeight = 800,
  ariaLabel,
  onActiveChange,
}: {
  clips: MontageClip[];
  className?: string;
  posterHeight?: number;
  ariaLabel?: string;
  onActiveChange?: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const hlsRefs = useRef<(Hls | null)[]>([]);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  // Only fetch streams once near the viewport.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Attach HLS (or native) to every clip once visible, then start the first.
  useEffect(() => {
    if (!visible) return;
    clips.forEach((clip, i) => {
      const v = videoRefs.current[i];
      if (!v) return;
      const src = `${CF}/${clip.videoId}/manifest/video.m3u8`;
      if (v.canPlayType('application/vnd.apple.mpegurl')) {
        v.src = src;
      } else if (Hls.isSupported() && !hlsRefs.current[i]) {
        const hls = new Hls({ maxBufferLength: 8, maxMaxBufferLength: 20 });
        hlsRefs.current[i] = hls;
        hls.loadSource(src);
        hls.attachMedia(v);
      }
    });
    const first = videoRefs.current[0];
    if (first) {
      try {
        first.currentTime = 0;
        void first.play();
      } catch {
        /* autoplay retried by the browser */
      }
    }
    const refs = hlsRefs.current;
    return () => {
      refs.forEach((h) => h?.destroy());
      hlsRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Advance when the active clip passes its allotted seconds.
  useEffect(() => {
    if (!visible) return;
    const v = videoRefs.current[active];
    const clip = clips[active];
    if (!v || !clip) return;

    onActiveChange?.(active);

    try {
      if (v.currentTime > clip.seconds) v.currentTime = 0;
      void v.play();
    } catch {
      /* ignore */
    }

    const onTime = () => {
      if (v.currentTime >= clip.seconds) {
        const next = (active + 1) % clips.length;
        const nv = videoRefs.current[next];
        if (nv) {
          try {
            nv.currentTime = 0;
            void nv.play();
          } catch {
            /* ignore */
          }
        }
        setActive(next);
      }
    };
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, active]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%' }}
      aria-label={ariaLabel}
    >
      {clips.map((clip, i) => (
        <video
          key={clip.videoId}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          muted
          playsInline
          preload={i === 0 ? 'auto' : 'metadata'}
          poster={
            i === 0
              ? `${CF}/${clip.videoId}/thumbnails/thumbnail.jpg?time=0.5s&height=${posterHeight}`
              : undefined
          }
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === active ? 1 : 0,
            transition: 'opacity 0.55s ease',
          }}
        />
      ))}
    </div>
  );
}
