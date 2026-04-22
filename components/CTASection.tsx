"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import styles from "./CTASection.module.css";

// Cloudflare Stream UID for the vertical team reel that replaces the
// previous static IMPVertphoto.jpg image. Keeps the exact same size
// as the original image via the .verticalImage CSS class.
const VIDEO_ID = "a4e77a8138fc0e358032779ae097ac06";
const HLS_URL = `https://customer-w6h9o08eg118alny.cloudflarestream.com/${VIDEO_ID}/manifest/video.m3u8`;
const POSTER_URL = `https://customer-w6h9o08eg118alny.cloudflarestream.com/${VIDEO_ID}/thumbnails/thumbnail.jpg?time=1s&height=900`;

export default function CTASection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Attach HLS stream once mounted. Safari handles HLS natively so we
  // fall back to setting the src directly there.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 10,
        maxMaxBufferLength: 30,
      });
      hlsRef.current = hls;
      hls.loadSource(HLS_URL);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_URL;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  return (
    <section className={styles.section} data-cursor-hide>
      <div className={styles.container}>
        <div className={styles.verticalImageSection}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className={styles.verticalImage}
            poster={POSTER_URL}
            aria-label="Sweet Dreams team reel"
          />
        </div>
        <div className={styles.contentSection}>
          <h2 className={styles.title}>
            LET&apos;S CREATE<br />
            SOMETHING<br />
            THAT REALLY<br />
            <span className={styles.standsOut}>STANDS OUT</span>
          </h2>
          <Link href="/book" className={styles.button}>
            GET IN TOUCH
          </Link>
        </div>
      </div>
    </section>
  );
}
