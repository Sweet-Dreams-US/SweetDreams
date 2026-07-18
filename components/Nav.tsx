"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import MobileNav from "./MobileNav";
import BookCallLink from "./BookCallLink";

export default function Nav() {
  const pathname = usePathname();

  // Single wide logo for all pages
  const logoSrc =
    "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreamsUSlogowide.png";

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navContent}>
          {/* Left: Logo */}
          <div className={styles.navLeft}>
            <Link href="/" className={styles.navLogo} aria-label="Sweet Dreams home">
              <img
                src={logoSrc}
                alt="Sweet Dreams"
                className={`${styles.logoImage} ${styles.baseLogo}`}
              />
            </Link>
          </div>

          {/* Right: Media, Websites, AI + Book a Call + hamburger */}
          <div className={styles.navRight}>
            <div className={styles.navLinks}>
              <Link
                href="/services/media-production"
                className={`${styles.navLink} ${styles.linkRed} ${
                  pathname === "/services/media-production" ? styles.navLinkActive : ""
                }`}
              >
                MEDIA PRODUCTION
              </Link>
              <Link
                href="/websites"
                className={`${styles.navLink} ${styles.linkBlue} ${
                  pathname === "/websites" ||
                  pathname.startsWith("/services/web-software")
                    ? styles.navLinkActive
                    : ""
                }`}
              >
                WEBSITES
              </Link>
              <Link
                href="/ai"
                className={`${styles.navLink} ${styles.linkGreen} ${
                  pathname === "/ai" ? styles.navLinkActive : ""
                }`}
              >
                AI
              </Link>
              <BookCallLink className={styles.ctaButton} activeClassName={styles.ctaActive}>
                BOOK A CALL
              </BookCallLink>
            </div>

            {/* Hamburger — the rest of the site lives here */}
            <div className={styles.hamburgerInline}>
              <MobileNav />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
