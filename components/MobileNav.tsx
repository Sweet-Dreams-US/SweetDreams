'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileNav.module.css';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Detect if hamburger is over dark background
  useEffect(() => {
    const checkBackground = () => {
      const hamburgerX = window.innerWidth - 40;
      const hamburgerY = 40;
      let element = document.elementFromPoint(hamburgerX, hamburgerY);

      if (element) {
        let currentElement: Element | null = element;
        let isDark = false;

        while (currentElement && currentElement !== document.body) {
          const styles = window.getComputedStyle(currentElement);
          const bgColor = styles.backgroundColor;

          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            const rgbMatch = bgColor.match(/rgb[a]?\((\d+),\s*(\d+),\s*(\d+)/);
            if (rgbMatch) {
              const r = parseInt(rgbMatch[1]);
              const g = parseInt(rgbMatch[2]);
              const b = parseInt(rgbMatch[3]);
              const luminance = (r + g + b) / 3;
              isDark = luminance < 128;
              break;
            }
          }

          if (currentElement.classList.contains('bg-black') ||
              currentElement.className.includes('bg-black')) {
            isDark = true;
            break;
          }

          currentElement = currentElement.parentElement;
        }

        setIsOverDark(isDark);
      }
    };

    checkBackground();
    let rafId: number;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkBackground);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkBackground);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkBackground);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/work', label: 'WORK' },
    { href: '/solutions', label: 'SOLUTIONS' },
    { href: '/media', label: 'MEDIA' },
    { href: '/book', label: 'BOOK A CALL' },
    { href: '/partnerships', label: 'PARTNERSHIPS' },
    { href: '/about', label: 'ABOUT' },
  ];

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        className={`${styles.hamburger} ${isOpen ? styles.open : ''} ${isOverDark && !isOpen ? styles.light : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Full-Screen Mobile Menu Overlay */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.menuOpen : ''}`}>
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>

        <nav className={styles.mobileNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${
                pathname === link.href ? styles.active : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.mobileMenuFooter}>
          <p>Sweet Dreams Media</p>
          <p>Fort Wayne, Indiana</p>
        </div>
      </div>
    </>
  );
}
