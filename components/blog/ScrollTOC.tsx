'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './ScrollTOC.module.css';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ScrollTOCProps {
  headings: Heading[];
  categoryColor?: string;
}

export default function ScrollTOC({ headings, categoryColor = '#1565c0' }: ScrollTOCProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    setReadProgress(progress);

    // Find the active heading based on scroll position
    const headingElements = headings
      .map(h => ({ id: h.id, el: document.getElementById(h.id) }))
      .filter(h => h.el !== null);

    if (headingElements.length === 0) return;

    const viewportTop = scrollTop + 120; // offset for sticky nav

    let currentActive = headingElements[0].id;
    for (const { id, el } of headingElements) {
      if (el && el.offsetTop <= viewportTop) {
        currentActive = id;
      }
    }

    setActiveId(currentActive);
  }, [headings]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
      setMobileExpanded(false);
    }
  };

  const activeHeading = headings.find(h => h.id === activeId);
  const h2Headings = headings.filter(h => h.level === 2);
  const activeH2Index = h2Headings.findIndex(h => h.id === activeId) + 1;
  const totalH2s = h2Headings.length;

  // For H3s, show which parent H2 section we're in
  const currentH2 = (() => {
    const idx = headings.findIndex(h => h.id === activeId);
    if (idx === -1) return null;
    // Walk backwards to find nearest H2
    for (let i = idx; i >= 0; i--) {
      if (headings[i].level === 2) return headings[i];
    }
    return null;
  })();

  const displaySection = activeHeading?.level === 2
    ? `${activeH2Index}/${totalH2s}`
    : currentH2
      ? `${h2Headings.indexOf(currentH2) + 1}/${totalH2s}`
      : '';

  const displayTitle = activeHeading?.text || 'Introduction';

  return (
    <>
      {/* Desktop Sidebar TOC */}
      <aside className={styles.tocSidebar}>
        <div className={styles.tocSticky}>
          <div className={styles.tocLabel}>Contents</div>
          <div className={styles.tocInner}>
            {/* Progress bar */}
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{ height: `${readProgress}%`, backgroundColor: categoryColor }}
              />
            </div>

            <nav className={styles.tocNav}>
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`${heading.level === 2 ? styles.tocItemH2 : styles.tocItemH3} ${
                    activeId === heading.id ? styles.tocItemActive : ''
                  }`}
                  style={activeId === heading.id ? { borderLeftColor: categoryColor, color: categoryColor } : {}}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar - just shows current section title */}
      <div className={styles.mobileBar}>
        <div className={styles.mobileProgress}>
          <div
            className={styles.mobileProgressFill}
            style={{ width: `${readProgress}%`, backgroundColor: categoryColor }}
          />
        </div>

        <button
          className={styles.mobileBarContent}
          onClick={() => setMobileExpanded(!mobileExpanded)}
        >
          <div className={styles.mobileBarLeft}>
            {displaySection && (
              <span className={styles.mobileBarSection} style={{ color: categoryColor }}>
                {displaySection}
              </span>
            )}
            <span className={styles.mobileBarTitle}>{displayTitle}</span>
          </div>
          <span className={`${styles.mobileBarChevron} ${mobileExpanded ? styles.mobileBarChevronUp : ''}`}>
            {mobileExpanded ? '\u25BC' : '\u25B2'}
          </span>
        </button>

        {mobileExpanded && (
          <div className={styles.mobilePanel}>
            <nav className={styles.mobilePanelNav}>
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`${heading.level === 2 ? styles.mobilePanelH2 : styles.mobilePanelH3} ${
                    activeId === heading.id ? styles.mobilePanelActive : ''
                  }`}
                  style={activeId === heading.id ? { color: categoryColor } : {}}
                >
                  {heading.level === 3 && <span className={styles.mobilePanelIndent} />}
                  {heading.text}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
