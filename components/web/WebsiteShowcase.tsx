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

interface BrowserCardProps {
  project: WebsiteProject;
  index: number;
  isMobile: boolean;
  isCentered: boolean;
  someCentered: boolean;
}

function BrowserCard({ project, index, isMobile, isCentered, someCentered }: BrowserCardProps) {
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

  // Only apply focus/dim classes on mobile. On desktop, cards render normally
  // with no blur — hover states from base CSS handle desktop affordance.
  // Before any card is centered (initial mount on mobile), no card is dimmed —
  // prevents the brief "all blurred" flash before the observer fires.
  const cardClassName = [
    styles.browserCard,
    isMobile && isCentered ? styles.focused : '',
    isMobile && someCentered && !isCentered ? styles.unfocused : '',
  ].filter(Boolean).join(' ');

  return (
    <Link ref={cardRef} href={project.href} className={cardClassName} data-card-index={index} aria-label={`View ${project.name} website project`}>
      {/* Click indicator badge — persistent top-right corner, visible on all devices */}
      <div className={styles.clickBadge} aria-hidden="true">
        <span className={styles.clickBadgeIcon}>&#8599;</span>
      </div>

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
        <div className={styles.projectInfoText}>
          <h3 className={styles.projectName}>{project.name}</h3>
          <p className={styles.projectDescription}>{project.description}</p>
        </div>
        {/* Persistent CTA — always visible on mobile and desktop */}
        <span className={styles.viewProjectCTA}>
          VIEW PROJECT <span className={styles.ctaArrow}>&rarr;</span>
        </span>
      </div>
    </Link>
  );
}

interface WebsiteShowcaseProps {
  projects: WebsiteProject[];
}

export default function WebsiteShowcase({ projects }: WebsiteShowcaseProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [centeredIndex, setCenteredIndex] = useState<number | null>(null);

  // Detect mobile and react to viewport resizes so the effect toggles cleanly
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Single observer for ALL cards — picks the one with the highest
  // intersectionRatio as "centered." Mirrors PortfolioHorizontalScroll's
  // pattern so the website showcase behaves identically to the media
  // portfolio above. Only one card can be centered at a time.
  useEffect(() => {
    if (!isMobile || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('[data-card-index]');
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let mostVisibleIndex: number | null = null;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            const idx = parseInt(entry.target.getAttribute('data-card-index') || '-1');
            if (idx >= 0) mostVisibleIndex = idx;
          }
        });

        if (maxRatio > 0.3) {
          setCenteredIndex(mostVisibleIndex);
        }
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [isMobile, projects]);

  const someCentered = centeredIndex !== null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.miniTitle}>SITES WE&apos;VE BUILT</p>
        <h2 className={styles.sectionTitle}>WEB DEVELOPMENT</h2>
      </div>

      <div ref={gridRef} className={styles.grid}>
        {projects.map((project, index) => (
          <BrowserCard
            key={index}
            project={project}
            index={index}
            isMobile={isMobile}
            isCentered={centeredIndex === index}
            someCentered={someCentered}
          />
        ))}
      </div>
    </section>
  );
}
