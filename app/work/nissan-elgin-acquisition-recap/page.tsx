import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export const metadata = {
  title: "Nissan of Elgin Acquisition Recap | Sweet Dreams Solutions",
  description: "Takeover recap film for the fifth Coleman Automotive × Prime Dealer Equity Fund co-investment — Nissan of Elgin. Cinematography, editing, press release, and web publishing by Sweet Dreams Solutions.",
};

export default function NissanElginAcquisitionRecapPage() {
  const project = {
    title: 'NISSAN OF ELGIN',
    client_name: 'Coleman Automotive × Prime Dealer Equity Fund',
    client_logos: [
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/Primedealerequityfundlogoblack.png',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/colemanautomotivegrouplogoblack.png',
    ],
    description: 'A takeover recap film capturing the fifth Coleman + Prime acquisition — Nissan of Elgin — and the platform\'s first dealership in Illinois.',
    category: 'Event Recap · Acquisition',
    location: 'Elgin, Illinois',
    year: 2026,
    services: ['Event Coverage', 'Cinematography', 'Editing', 'Press Release Writing', 'Web Publishing', 'Brand Storytelling'],
    full_description: 'Nissan of Elgin marks the fifth co-investment between Coleman Automotive Group and the Prime Dealer Equity Fund — closed exactly twelve months after the partnership\'s first deal, propelling annualized revenue above $200 million and opening the platform\'s entry into the Chicago metropolitan area. Sweet Dreams Solutions was on the ground for the takeover day, capturing the team meeting the new staff, walking the showroom, and stepping into the next chapter. We delivered the recap film, wrote the announcement press release, and published it to primedealerfund.com — the same site we designed, built, and manage for the fund.',
    mainVideo: '66f28edb4b5c20354896a437b7be5220',
    additionalVideos: [] as { id: string; title: string }[],
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.description}>{project.description}</p>
        </div>
        <div className={styles.clientInfo}>
          <div className={styles.clientLogos}>
            {project.client_logos.map((logo, index) => (
              <img key={index} src={logo} alt={project.client_name} className={styles.clientLogo} />
            ))}
          </div>
          <span className={styles.clientName}>{project.client_name}</span>
        </div>
      </header>

      <section className={styles.videoSection}>
        <VideoPlayer videoId={project.mainVideo} className={styles.videoWrapper} playTextSize="large" thumbnailTime="5s" />
      </section>

      <section className={styles.metadata}>
        <div className={styles.metadataGrid}>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>CATEGORY</span>
            <span className={styles.metadataValue}>{project.category}</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>LOCATION</span>
            <span className={styles.metadataValue}>{project.location}</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>YEAR</span>
            <span className={styles.metadataValue}>{project.year}</span>
          </div>
        </div>
      </section>

      <section className={styles.overview}>
        <h2 className={styles.sectionTitle}>PROJECT OVERVIEW</h2>
        <p className={styles.overviewText}>{project.full_description}</p>
        <div className={styles.servicesSection}>
          <h3 className={styles.servicesTitle}>SERVICES PROVIDED</h3>
          <div className={styles.servicesList}>
            {project.services.map((service, index) => (
              <span key={index} className={styles.serviceTag}>{service}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Press release callout — proves the deliverable extended beyond the
          camera work. Links to the live release on the site we built and manage. */}
      <section className={styles.pressRelease}>
        <p className={styles.pressReleaseKicker}>PRESS RELEASE DEVELOPMENT</p>
        <h2 className={styles.pressReleaseHeading}>WE WROTE & PUBLISHED THE ANNOUNCEMENT</h2>
        <p className={styles.pressReleaseText}>
          Beyond the takeover video, Sweet Dreams Solutions developed the full
          acquisition press release — interviewing leadership, drafting the
          announcement copy, and publishing it to the Prime Dealer Fund
          insights hub on the site we designed, built, and continue to manage.
          One agency, one cohesive story across video and written word.
        </p>
        <a
          href="https://www.primedealerfund.com/insights/nissan-of-elgin-acquisition-press-release"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.pressReleaseButton}
        >
          READ THE PRESS RELEASE →
        </a>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>READY TO CREATE SOMETHING AMAZING?</h2>
        <Link href="/book" className={styles.ctaButton}>BOOK A CALL</Link>
      </section>
    </div>
  );
}
