'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import styles from './funnel.module.css';

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';

/**
 * Vertical social reel player for the funnel pages.
 *
 * Plays Cloudflare Stream HLS in every browser: Safari plays .m3u8
 * natively, everything else needs hls.js (a raw <video src=".m3u8">
 * silently fails in Chrome/Firefox). Muted + autoplay + loop so the reel
 * draws the eye like a native social feed; controls let the visitor unmute.
 */
export default function FunnelReel({ videoId }: { videoId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = `${CF}/${videoId}/manifest/video.m3u8`;
    let hls: Hls | null = null;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari / iOS — native HLS
      video.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [videoId]);

  return (
    <video
      ref={videoRef}
      className={styles.frameVideo}
      poster={`${CF}/${videoId}/thumbnails/thumbnail.jpg?time=1s&height=900`}
      muted
      autoPlay
      loop
      playsInline
      controls
      preload="metadata"
    />
  );
}
