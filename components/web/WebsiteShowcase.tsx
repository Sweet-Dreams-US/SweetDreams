'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import WebPreviewVideo from './WebPreviewVideo';
import styles from './WebsiteShowcase.module.css';

interface WebsiteProject {
  videoId: string;
  name: string;
  /** Case-study page. Omit for smart-video previews (non-clickable). */
  href?: string;
  /** Real domain shown in the browser chrome (clickable projects). */
  url?: string;
  /** Chrome label for smart previews that have no live URL to link to. */
  label?: string;
  /** Optional blurb under the card. */
  description?: string;
}

interface BrowserCardProps {
  project: WebsiteProject;
  index: number;
  isMobile: boolean;
  isCentered: boolean;
  someCentered: boolean;
}

function BrowserCard({ project, index, isMobile, isCentered, someCentered }: BrowserCardProps) {
  // A card is clickable only when it points at a case-study page. The new
  // website recordings have no live URL / project page — they're "smart
  // videos" (autoplay preview, no link, no VIEW PROJECT affordance).
  const clickable = Boolean(project.href);
  const chromeText = project.url ?? project.label ?? project.name;

  // Only apply focus/dim classes on mobile. On desktop, cards render normally
  // with hover states from base CSS. Smart (non-clickable) cards never take
  // the click-cursor treatment.
  const cardClassName = [
    styles.browserCard,
    !clickable ? styles.smartCard : '',
    isMobile && isCentered ? styles.focused : '',
    isMobile && someCentered && !isCentered ? styles.unfocused : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {/* Click indicator badge — only for real project links */}
      {clickable && (
        <div className={styles.clickBadge} aria-hidden="true">
          <span className={styles.clickBadgeIcon}>&#8599;</span>
        </div>
      )}

      {/* Browser Chrome */}
      <div className={styles.browserChrome}>
        <div className={styles.browserDots} aria-hidden="true">
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
        </div>
        <div className={styles.urlBar}>
          {project.url && (
            <span className={styles.lockIcon} aria-hidden="true">
              &#128274;
            </span>
          )}
          <span className={styles.urlText}>{chromeText}</span>
        </div>
      </div>

      {/* Video Window */}
      <div className={styles.videoWindow}>
        <WebPreviewVideo
          videoId={project.videoId}
          ariaLabel={`Preview of the ${project.name} website`}
        />
        {clickable && (
          <div className={styles.visitOverlay}>
            <span className={styles.visitText}>
              VIEW PROJECT <span className={styles.arrow}>&rarr;</span>
            </span>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className={styles.projectInfo}>
        <div className={styles.projectInfoText}>
          <h3 className={styles.projectName}>{project.name}</h3>
          {project.description ? (
            <p className={styles.projectDescription}>{project.description}</p>
          ) : (
            <p className={styles.projectTag}>Website Design &amp; Build</p>
          )}
        </div>
        {clickable && (
          <span className={styles.viewProjectCTA}>
            VIEW PROJECT <span className={styles.ctaArrow}>&rarr;</span>
          </span>
        )}
      </div>
    </>
  );

  if (clickable) {
    return (
      <Link
        href={project.href!}
        className={cardClassName}
        data-card-index={index}
        aria-label={`View ${project.name} website project`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className={cardClassName} data-card-index={index}>
      {inner}
    </div>
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
