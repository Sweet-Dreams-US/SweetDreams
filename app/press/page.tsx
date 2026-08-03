import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './press.module.css';

const title = '50 Free Websites for Fort Wayne Businesses | Sweet Dreams';
const description =
  'Sweet Dreams Solutions is building 50 Fort Wayne businesses a free custom website with a professional media shoot. Businesses pay only for monthly hosting. Read the announcement.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/press' },
  openGraph: { title, description, url: '/press', type: 'article' },
};

export default function PressPage() {
  return (
    <article className={styles.pr}>
      <header className={styles.hero}>
        <h1 className={styles.signWords} aria-label="50 Free Websites">
          <span className={styles.line}>50 <span className={styles.free}>Free</span></span>
          <span className={styles.line}>Websites</span>
        </h1>
        <div className={styles.signContact}>
          <div className={styles.url}>WWW.SWEETDREAMS.US</div>
          <div className={styles.tel}>(260) 615-7467</div>
        </div>
      </header>

      <div className={styles.doc}>
        <p className={styles.fir}>For Immediate Release</p>

        <h2 className={styles.headline}>
          Sweet Dreams Solutions to Build 50 Free Websites for Fort Wayne Businesses
        </h2>

        <p className={styles.subhead}>
          The Fort Wayne software and media studio is removing the $3,000 to $20,000 upfront cost of a
          custom website. Selected businesses receive a full custom build and a professional photo and
          video shoot at no cost, and pay only for monthly hosting.
        </p>

        <p className={styles.body}>
          <span className={styles.dateline}>FORT WAYNE, Ind. — August 2, 2026 —</span> Sweet Dreams
          Solutions, a Fort Wayne software studio and media production company, today announced it will
          build 50 local businesses a complete custom website for free. The company is covering the full
          cost of the design, the build, and a professional photo and video shoot for each site.
          Businesses pay only for monthly hosting once the site is live.
        </p>

        <p className={styles.body}>
          A custom website normally costs a business $3,000 to $20,000 up front, and that is usually
          before any professional photo or video, with monthly hosting charged on top. For many local
          owners, that upfront bill is the reason they never get a real website at all. They settle for a
          do-it-yourself template that looks like every other business using the same theme, or they go
          without.
        </p>

        <p className={styles.body}>
          Sweet Dreams is removing that upfront cost entirely. There is no build fee, no design fee, and
          no media fee. Each selected business receives a custom, hand-coded website, not a template,
          along with a professional photo and video shoot produced by the company&apos;s in-house media
          team and a design branded to help the business stand out. The only ongoing cost is hosting,
          which runs $50 to $400 a month depending on the size of the site.
        </p>

        <div className={styles.facts}>
          <p className={styles.factsHead}>What each business receives, free</p>
          <ul className={styles.factsList}>
            <li>A custom, hand-coded website, designed specifically for the business</li>
            <li>A professional photo and video shoot by a real production company</li>
            <li>A brand-forward design built to stand out and be remembered against competitors</li>
            <li>The only cost is monthly hosting, $50 to $400 per month, once the site is live</li>
          </ul>
        </div>

        <p className={styles.body}>
          Because Sweet Dreams is a media production company, every site ships with real footage of the
          business, its team, and its work, rather than the stock imagery most small business websites
          rely on. That is the difference the company is betting on: a local business that looks premium
          and memorable next to competitors still running templates.
        </p>

        <blockquote className={styles.pull}>
          &ldquo;Most local business owners know they need a real website, but a five figure bill up
          front is not realistic when you are trying to make payroll. We are a media company, so we can
          build the site, shoot the photo and video, and carry that cost. The business just covers
          hosting. We would rather help local businesses look like the best option in town than sell a
          handful of expensive builds.&rdquo;
          <cite>Cole Marcuccilli, Sweet Dreams Solutions</cite>
        </blockquote>

        <p className={styles.body}>
          The offer is aimed at local Fort Wayne and Northeast Indiana businesses that need a
          professional website but cannot cover a large upfront cost, including contractors, trades,
          shops, service businesses, gyms, and offices. Sweet Dreams is capping the campaign at 50
          businesses. Owners can apply at sweetdreams.us/free-website or by calling (260) 615-7467.
        </p>

        <div className={styles.applyRow}>
          <Link href="/free-website" className={styles.applyBtn}>
            Claim your free website →
          </Link>
        </div>

        <div className={styles.boiler}>
          <p className={styles.boilerHead}>About Sweet Dreams Solutions</p>
          <p>
            Sweet Dreams Solutions is a software studio and media production company based in Fort Wayne,
            Indiana, founded in 2020. The company hand-codes custom websites and produces cinematic brand
            films, commercials, social content, and aerial cinema-drone work. Its clients include the City
            of Fort Wayne, Nissan, the Indianapolis Children&apos;s Museum, Brookfield Zoo, and Habitat
            for Humanity.
          </p>
        </div>

        <div className={styles.contact}>
          <p className={styles.contactHead}>Media Contact</p>
          <div className={styles.contactLines}>
            Cole Marcuccilli
            <br />
            Sweet Dreams Solutions
            <br />
            cole@sweetdreams.us
            <br />
            (260) 615-7467
            <br />
            https://sweetdreams.us
          </div>
        </div>

        <p className={styles.end}>###</p>
      </div>
    </article>
  );
}
