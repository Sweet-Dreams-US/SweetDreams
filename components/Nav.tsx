"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import MobileNav from "./MobileNav";

export default function Nav() {
  const pathname = usePathname();

  // Single wide logo for all pages
  const logoSrc = "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreamsUSlogowide.png";

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navContent}>

          {/* Left: Book a Call + Work (yellow) */}
          <div className={styles.navLeft}>
            <Link href="/book" className={`${styles.ctaButton} ${pathname === '/book' ? styles.ctaActive : ''}`}>
              BOOK A CALL
            </Link>
            <Link
              href="/work"
              className={`${styles.navLink} ${styles.linkYellow} ${pathname === '/work' || pathname.startsWith('/work/') ? styles.navLinkActive : ''}`}
            >
              WORK
            </Link>
          </div>

          {/* Center Logo */}
          <div className={styles.navCenter}>
            <Link href="/" className={styles.navLogo}>
              <img
                src={logoSrc}
                alt="Sweet Dreams"
                className={`${styles.logoImage} ${styles.baseLogo}`}
              />
            </Link>
          </div>

          {/* Right: Media Production (red) + Web (blue) + Hamburger */}
          <div className={styles.navRight}>
            <Link
              href="/services/media-production"
              className={`${styles.navLink} ${styles.linkRed} ${pathname === '/services/media-production' ? styles.navLinkActive : ''}`}
            >
              MEDIA PRODUCTION
            </Link>
            <Link
              href="/services/web-software"
              className={`${styles.navLink} ${styles.linkBlue} ${pathname === '/services/web-software' ? styles.navLinkActive : ''}`}
            >
              WEB
            </Link>

            {/* Hamburger - inline */}
            <div className={styles.hamburgerInline}>
              <MobileNav />
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
