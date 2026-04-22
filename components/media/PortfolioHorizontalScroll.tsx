'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import styles from './PortfolioHorizontalScroll.module.css';
import HyperlapseRow from './HyperlapseRow';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PortfolioItem {
  href?: string; // optional — hyperlapse smart-videos don't link to a project page
  image: string;
  title: string;
  client: string;
  logo: string;
  category?: string;
  year?: string;
  comingSoon?: boolean;
  tags?: string[];
  date?: string; // ISO date (YYYY-MM-DD) — used for newest-first sort
  // Smart-video fields — when isSmartVideo is true the item renders as an
  // autoplay muted looping video in a dedicated hyperlapse row instead of
  // a thumbnail card in the main grid.
  isSmartVideo?: boolean;
  videoId?: string; // Cloudflare Stream UID
  orientation?: 'vertical' | 'horizontal';
}

type FilterKey = 'all' | 'business' | 'aerial' | 'recap' | 'social' | 'hyperlapse';

const FILTER_KEYS: FilterKey[] = ['all', 'business', 'aerial', 'recap', 'social', 'hyperlapse'];

// Pill config — each pill either applies a filter OR performs a scroll-to
// action. Software is a scroll-to pill (jumps to the websites section)
// rather than a real filter, since web projects live in a separate
// component below the main portfolio.
interface FilterConfig {
  key: string; // unique pill identifier
  label: string;
  accent: string; // pill color when active + dot color when inactive
  textOnAccent: string; // text color when pill is filled (contrast)
  filterKey?: FilterKey; // set → clicking applies this filter
  scrollTo?: string; // set → clicking scrolls to this CSS selector
}

const FILTERS: FilterConfig[] = [
  { key: 'all', label: 'All Work', accent: '#ffffff', textOnAccent: '#0a0a0a', filterKey: 'all' },
  { key: 'business', label: 'Business', accent: '#e63636', textOnAccent: '#ffffff', filterKey: 'business' },
  { key: 'aerial', label: 'Aerial', accent: '#4A90E2', textOnAccent: '#ffffff', filterKey: 'aerial' },
  { key: 'recap', label: 'Event Recap', accent: '#F4C430', textOnAccent: '#0a0a0a', filterKey: 'recap' },
  { key: 'social', label: 'Social Media', accent: '#28c840', textOnAccent: '#0a0a0a', filterKey: 'social' },
  { key: 'hyperlapse', label: 'Hyperlapse', accent: '#a855f7', textOnAccent: '#ffffff', filterKey: 'hyperlapse' },
  { key: 'software', label: 'Software', accent: '#f97316', textOnAccent: '#ffffff', scrollTo: '#websites' },
];

interface PortfolioHorizontalScrollProps {
  items: PortfolioItem[];
  onMouseEnter: (logo: string) => void;
  onMouseLeave: () => void;
  websiteCount?: number; // count displayed on the Software scroll-to pill
}

export default function PortfolioHorizontalScroll({
  items,
  onMouseEnter,
  onMouseLeave,
  websiteCount = 0,
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

  // Read ?filter=X from URL on mount so share links open the right view.
  // Using window.location directly (not useSearchParams) avoids needing
  // a Suspense boundary for the static build.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlFilter = params.get('filter') as FilterKey | null;
    if (urlFilter && FILTER_KEYS.includes(urlFilter)) {
      setActiveFilter(urlFilter);
    }
  }, []);

  // Keep URL in sync so clicking a filter produces a shareable link
  // without triggering a Next.js navigation (no scroll reset, no refetch).
  const handleFilterChange = (key: FilterKey) => {
    setActiveFilter(key);
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (key === 'all') {
      url.searchParams.delete('filter');
    } else {
      url.searchParams.set('filter', key);
    }
    window.history.replaceState({}, '', url);
  };

  // Filter items by tag. Each item can belong to multiple tags so the same
  // project may appear under Business AND Aerial. Sort by date descending
  // so newest projects show first regardless of which filter is active.
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

  // Split filtered items into the main thumbnail grid vs the smart-video
  // hyperlapse rows. Smart videos get their own rows regardless of filter
  // so vertical/wide layout stays clean.
  const mainGridItems = filteredItems.filter((item) => !item.isSmartVideo);
  const verticalHyperlapses = filteredItems.filter(
    (item) => item.isSmartVideo && item.orientation === 'vertical' && item.videoId
  );
  const horizontalHyperlapses = filteredItems.filter(
    (item) => item.isSmartVideo && item.orientation === 'horizontal' && item.videoId
  );

  // Count per pill for the small number badge next to each label.
  // Software pill uses websiteCount (from websiteProjects) since web
  // projects live outside the items array in a sibling component.
  const filterCounts: Record<string, number> = FILTERS.reduce<Record<string, number>>((acc, f) => {
    if (f.scrollTo) {
      // Scroll-to pills use the explicit count passed in
      acc[f.key] = f.key === 'software' ? websiteCount : 0;
    } else if (f.key === 'all') {
      acc[f.key] = items.length;
    } else {
      acc[f.key] = items.filter((item) => item.tags?.includes(f.key)).length;
    }
    return acc;
  }, {});

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
  }, [isMobile, mainGridItems]);

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
            // Only filter-type pills can be "active"; scroll-to pills
            // (like Software) are always inactive — they're navigation
            const isActive = !filter.scrollTo && activeFilter === filter.filterKey;

            const handleClick = () => {
              if (filter.scrollTo) {
                // Scroll-to pill: jump to the target section
                if (typeof window === 'undefined') return;
                const target = document.querySelector(filter.scrollTo);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                return;
              }
              if (filter.filterKey) {
                handleFilterChange(filter.filterKey);
              }
            };

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
                onClick={handleClick}
              >
                <span className={styles.filterDot} aria-hidden="true" />
                <span className={styles.filterLabel}>{filter.label}</span>
                <span className={styles.filterCount}>{filterCounts[filter.key]}</span>
              </button>
            );
          })}
        </div>

        {mainGridItems.length > 0 && (
          <div className={styles.grid}>
            {mainGridItems.map((item, itemIndex) => (
              <Link
                key={`${activeFilter}-${item.href ?? item.title}`}
                href={item.href ?? '#'}
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
        )}

        {/* Hyperlapse rows — vertical orientation first, then wide. Only
            appear when the active filter has smart-video items matching.
            For "All", both rows appear between main grid and websites. */}
        <HyperlapseRow
          items={verticalHyperlapses.map((i) => ({
            title: i.title,
            client: i.client,
            videoId: i.videoId!,
            date: i.date,
          }))}
          orientation="vertical"
          label="Vertical Hyperlapses"
        />
        <HyperlapseRow
          items={horizontalHyperlapses.map((i) => ({
            title: i.title,
            client: i.client,
            videoId: i.videoId!,
            date: i.date,
          }))}
          orientation="horizontal"
          label="Wide Hyperlapses"
        />

        {filteredItems.length === 0 && (
          <div className={styles.emptyState}>
            <p>No projects in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
