'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Hls from 'hls.js';
import styles from './WebsiteShowcase.module.css';

interface WebsiteProject {
  href: string;
  url: string;
  videoId: string;
  name: string;
  description: string;
}

function BrowserCard({ project }: { project: WebsiteProject }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy load: only init HLS when card enters viewport
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
      { rootMargin: '200px' }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const video = videoRef.current;
    if (!video) return;

    const hlsUrl = `https://customer-w6h9o08eg118alny.cloudflarestream.com/${project.videoId}/manifest/video.m3u8`;

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 10,
        maxMaxBufferLength: 30,
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
  }, [isVisible, project.videoId]);

  return (
    <Link ref={cardRef} href={project.href} className={styles.browserCard} aria-label={`View ${project.name} website project`}>
      {/* Browser Chrome */}
      <div className={styles.browserChrome}>
        <div className={styles.browserDots} aria-hidden="true">
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
        </div>
        <div className={styles.urlBar}>
          <span className={styles.lockIcon} aria-hidden="true">&#128274;</span>
          <span className={styles.urlText}>{project.url}</span>
        </div>
      </div>

      {/* Video Window */}
      <div className={styles.videoWindow}>
        {isVisible && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            aria-label={`Preview of ${project.name} website`}
            poster={`https://customer-w6h9o08eg118alny.cloudflarestream.com/${project.videoId}/thumbnails/thumbnail.jpg?time=2s&height=600`}
          />
        )}
        <div className={styles.visitOverlay}>
          <span className={styles.visitText}>
            VIEW PROJECT <span className={styles.arrow}>&rarr;</span>
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className={styles.projectInfo}>
        <h3 className={styles.projectName}>{project.name}</h3>
        <p className={styles.projectDescription}>{project.description}</p>
      </div>
    </Link>
  );
}

interface WebsiteShowcaseProps {
  projects: WebsiteProject[];
}

export default function WebsiteShowcase({ projects }: WebsiteShowcaseProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.miniTitle}>SITES WE&apos;VE BUILT</p>
        <h2 className={styles.sectionTitle}>WEB DEVELOPMENT</h2>
      </div>

      <div className={styles.grid}>
        {projects.map((project, index) => (
          <BrowserCard key={index} project={project} />
        ))}
      </div>
    </section>
  );
}
