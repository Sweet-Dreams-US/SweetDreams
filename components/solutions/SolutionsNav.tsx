'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './SolutionsNav.module.css';

export interface SolutionSection {
  id: string;
  label: string;
  number: string;
}

interface SolutionsNavProps {
  sections: SolutionSection[];
}

export default function SolutionsNav({ sections }: SolutionsNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '');
  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = useCallback(() => {
    // Check if nav should be sticky
    const nav = document.getElementById('solutions-nav-anchor');
    if (nav) {
      const navTop = nav.getBoundingClientRect().top;
      setIsSticky(navTop <= 0);
    }

    // Find active section
    const scrollTop = window.scrollY;
    const viewportTop = scrollTop + 140; // offset for sticky nav

    let currentActive = sections[0]?.id || '';
    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el && el.offsetTop <= viewportTop) {
        currentActive = section.id;
      }
    }
    setActiveId(currentActive);
  }, [sections]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Anchor point to detect when nav leaves viewport */}
      <div id="solutions-nav-anchor" className={styles.anchor} />

      {/* The nav bar */}
      <nav className={`${styles.nav} ${isSticky ? styles.navSticky : ''}`}>
        <div className={styles.navInner}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`${styles.navItem} ${activeId === section.id ? styles.navItemActive : ''}`}
            >
              <span className={styles.navNumber}>{section.number}</span>
              <span className={styles.navLabel}>{section.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Spacer when sticky so content doesn't jump */}
      {isSticky && <div className={styles.navSpacer} />}
    </>
  );
}
