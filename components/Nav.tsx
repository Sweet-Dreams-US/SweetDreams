"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import MobileNav from "./MobileNav";

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

          {/* Right: the two things we sell + Book a Call + hamburger */}
          <div className={styles.navRight}>
            <div className={styles.navLinks}>
              <Link
                href="/services/web-software"
                className={`${styles.navLink} ${styles.linkBlue} ${
                  pathname === "/software" || pathname.startsWith("/services/web-software")
                    ? styles.navLinkActive
                    : ""
                }`}
              >
                SOFTWARE
              </Link>
              <Link
                href="/services/media-production"
                className={`${styles.navLink} ${styles.linkRed} ${
                  pathname === "/services/media-production" ? styles.navLinkActive : ""
                }`}
              >
                MEDIA PRODUCTION
              </Link>
              <Link
                href="/book"
                className={`${styles.ctaButton} ${pathname === "/book" ? styles.ctaActive : ""}`}
              >
                BOOK A CALL
              </Link>
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
