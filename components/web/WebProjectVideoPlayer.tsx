'use client';

import { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';
import styles from './WebProjectPage.module.css';

interface WebProjectVideoPlayerProps {
  videoId: string;
  url: string;
}

export default function WebProjectVideoPlayer({ videoId, url }: WebProjectVideoPlayerProps) {
  const [showOverlay, setShowOverlay] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hlsUrl = `https://customer-w6h9o08eg118alny.cloudflarestream.com/${videoId}/manifest/video.m3u8`;

    if (Hls.isSupported()) {
      const hls = new Hls();
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
  }, [videoId]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowOverlay(false);
    }
  };

  return (
    <div className={styles.browserMockup}>
      <div className={styles.browserBar}>
        <div className={styles.browserDots}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
        </div>
        <div className={styles.mockupUrlBar}>
          <span className={styles.lockIcon}>&#128274;</span>
          <span className={styles.mockupUrl}>{url}</span>
        </div>
      </div>
      <div className={styles.videoSection}>
        <video
          ref={videoRef}
          poster={`https://customer-w6h9o08eg118alny.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg?time=2s&height=600`}
          controls
          playsInline
          aria-label={`Website preview for ${url}`}
          onPlay={() => setShowOverlay(false)}
        />
        {showOverlay && (
          <div className={styles.playOverlay} onClick={handlePlay}>
            <span className={styles.playText}>PLAY</span>
          </div>
        )}
      </div>
    </div>
  );
}
