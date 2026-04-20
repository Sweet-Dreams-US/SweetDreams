'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import styles from './PortfolioHorizontalScroll.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PortfolioItem {
  href: string;
  image: string;
  title: string;
  client: string;
  logo: string;
  category?: string;
  year?: string;
  comingSoon?: boolean;
  tags?: string[];
  date?: string; // ISO date (YYYY-MM-DD) — used for newest-first sort
}

type FilterKey = 'all' | 'business' | 'aerial' | 'recap' | 'social';

interface FilterConfig {
  key: FilterKey;
  label: string;
  accent: string; // pill color when active + dot color when inactive
  textOnAccent: string; // text color when pill is filled (contrast)
}

const FILTERS: FilterConfig[] = [
  { key: 'all', label: 'All Work', accent: '#ffffff', textOnAccent: '#0a0a0a' },
  { key: 'business', label: 'Business', accent: '#e63636', textOnAccent: '#ffffff' },
  { key: 'aerial', label: 'Aerial', accent: '#4A90E2', textOnAccent: '#ffffff' },
  { key: 'recap', label: 'Event Recap', accent: '#F4C430', textOnAccent: '#0a0a0a' },
  { key: 'social', label: 'Social Media', accent: '#28c840', textOnAccent: '#0a0a0a' },
];

interface PortfolioHorizontalScrollProps {
  items: PortfolioItem[];
  onMouseEnter: (logo: string) => void;
  onMouseLeave: () => void;
}

export default function PortfolioHorizontalScroll({
  items,
  onMouseEnter,
  onMouseLeave
}: PortfolioHorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [cursorLogo, setCursorLogo] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [centeredCardIndex, setCenteredCardIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  // Filter items by tag. Each item can belong to multiple tags so the same
  // project may appear under Business AND Aerial (e.g., Nissan Warsaw,
  // Coleman Prime). Then sort by date descending so newest projects show
  // first regardless of which filter is active. Undated items fall to the
  // bottom so missing-data doesn't silently promote old work.
  const filteredItems = (
    activeFilter === 'all'
      ? items
      : items.filter((item) => item.tags?.includes(activeFilter))
  )
    .slice()
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    });

  // Count per filter for the small number badge next to each label
  const filterCounts = FILTERS.reduce<Record<FilterKey, number>>((acc, f) => {
    acc[f.key] =
      f.key === 'all'
        ? items.length
        : items.filter((item) => item.tags?.includes(f.key)).length;
    return acc;
  }, { all: 0, business: 0, aerial: 0, recap: 0, social: 0 });

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer for mobile centered card detection.
  // Re-runs when the filter changes so the observer attaches to the new
  // set of rendered cards and centeredCardIndex stays in sync.
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    // Reset centered index when filter changes — stale index could point to
    // a card that's no longer rendered, causing orphaned centered state
    setCenteredCardIndex(null);

    const cards = containerRef.current.querySelectorAll('[data-card-index]');

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Center 20% of viewport
      threshold: [0, 0.5, 1]
    };

    const observer = new IntersectionObserver((entries) => {
      let maxRatio = 0;
      let mostVisibleIndex: number | null = null;

      entries.forEach(entry => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          const index = parseInt(entry.target.getAttribute('data-card-index') || '-1');
          mostVisibleIndex = index;
        }
      });

      if (maxRatio > 0.3) {
        setCenteredCardIndex(mostVisibleIndex);
      }
    }, observerOptions);

    cards.forEach(card => observer.observe(card as Element));

    return () => observer.disconnect();
  }, [isMobile, filteredItems]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnterCard = (logo: string) => {
    setCursorLogo(logo);
    onMouseEnter(logo);
  };

  const handleMouseLeaveCard = () => {
    setCursorLogo(null);
    onMouseLeave();
  };

  return (
    <div ref={containerRef} className={styles.portfolioSection}>
      {/* Custom Cursor with Logo */}
      {cursorLogo && (
        <div
          className={styles.customCursor}
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
        >
          <img src={cursorLogo} alt="Client Logo" className={styles.cursorLogo} />
        </div>
      )}

      <div ref={scrollContainerRef} className={styles.scrollContainer}>
        {/* Section header */}
        <div className={styles.header}>
          <p className={styles.miniTitle}>ALL WORK</p>
          <h2 className={styles.sectionTitle}>COMPLETE PORTFOLIO</h2>
        </div>

        {/* Filter pills — lets users see just aerial, just business,
            just recaps, or just social across the whole portfolio.
            Per-pill color comes from --pill-accent / --pill-text CSS vars. */}
        <div className={styles.filterBar} role="tablist" aria-label="Portfolio filter">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ''}`}
                style={{
                  ['--pill-accent' as string]: filter.accent,
                  ['--pill-text' as string]: filter.textOnAccent,
                } as React.CSSProperties}
                onClick={() => setActiveFilter(filter.key)}
              >
                <span className={styles.filterDot} aria-hidden="true" />
                <span className={styles.filterLabel}>{filter.label}</span>
                <span className={styles.filterCount}>{filterCounts[filter.key]}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.grid}>
          {filteredItems.map((item, itemIndex) => (
            <Link
              key={`${activeFilter}-${item.href}`}
              href={item.href}
              className={`${styles.portfolioCard} ${item.comingSoon ? styles.comingSoonCard : ''} ${isMobile && centeredCardIndex === itemIndex ? styles.centered : ''}`}
              data-card-index={itemIndex}
              onMouseEnter={() => handleMouseEnterCard(item.logo)}
              onMouseLeave={handleMouseLeaveCard}
            >
              <div className={styles.portfolioImage}>
                {item.comingSoon ? (
                  <div className={styles.comingSoon}>
                    <div className={styles.comingSoonText}>COMING SOON</div>
                  </div>
                ) : (
                  <img src={item.image} alt={item.title} />
                )}
              </div>
              <div className={styles.portfolioInfo}>
                <p className={styles.portfolioClient}>{item.client}</p>
                <h3 className={styles.portfolioTitle}>{item.title}</h3>
                {item.category && (
                  <p className={styles.portfolioCategory}>{item.category}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className={styles.emptyState}>
            <p>No projects in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
