import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Sweet Dreams Media */}
          <div className={styles.column}>
            <h3 className={styles.brandTitle}>SWEET DREAMS MEDIA</h3>
            <div className={styles.links}>
              <Link href="/media" className={styles.link}>Video Production</Link>
              <Link href="/media" className={styles.link}>Brand Films</Link>
              <Link href="/media" className={styles.link}>Commercials</Link>
            </div>
            <div className={styles.contact}>
              <p>3943 Parnell Ave</p>
              <p>Fort Wayne, IN 46805</p>
              <a href="tel:+12606157467" className={styles.link}>(260) 615-7467</a>
              <p>jayvalleo@sweetdreams.us</p>
            </div>
          </div>

          {/* Business Solutions */}
          <div className={styles.column}>
            <h3 className={styles.brandTitle}>BUSINESS SOLUTIONS</h3>
            <div className={styles.links}>
              <Link href="/solutions" className={styles.link}>Web Development</Link>
              <Link href="/solutions" className={styles.link}>Social Media Growth</Link>
              <Link href="/partnerships" className={styles.link}>Business Partnerships</Link>
            </div>
            <div className={styles.contact}>
              <p>cole@sweetdreams.us</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.column}>
            <h3 className={styles.brandTitle}>QUICK LINKS</h3>
            <div className={styles.links}>
              <Link href="/#work" className={styles.link}>Our Work</Link>
              <Link href="/solutions" className={styles.link}>Solutions</Link>
              <Link href="/blog" className={styles.link}>Blog</Link>
              <Link href="/about" className={styles.link}>About Us</Link>
              <Link href="/book" className={styles.link}>Contact</Link>
              <a href="https://sweetdreamsmusic.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Music Studio</a>
            </div>
          </div>

          {/* Social */}
          <div className={styles.column}>
            <h3 className={styles.brandTitle}>FOLLOW US</h3>
            <div className={styles.links}>
              <a href="https://www.instagram.com/sweetdreamssolutions.us/" target="_blank" rel="noopener noreferrer" className={styles.link}>Instagram</a>
              <a href="https://www.facebook.com/people/Sweet-Dreams-Solutions/100085672277251/" target="_blank" rel="noopener noreferrer" className={styles.link}>Facebook</a>
              <a href="https://www.youtube.com/@SweetDreamsUS" target="_blank" rel="noopener noreferrer" className={styles.link}>YouTube</a>
              <a href="https://www.tiktok.com/@sweetdreamsstudios" target="_blank" rel="noopener noreferrer" className={styles.link}>TikTok</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <p className={styles.copyright}>&copy; {new Date().getFullYear()} Sweet Dreams US LLC. All rights reserved.</p>
            <div className={styles.legalLinks}>
              <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
              <span className={styles.separator}>&bull;</span>
              <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
            </div>
          </div>
          <div className={styles.footerLogos}>
            <img
              src="https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackWhiteLogo.png"
              alt="Sweet Dreams"
              className={styles.footerLogo}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
