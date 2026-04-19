import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export const metadata = {
  title: "Fort Wayne State of the City Address | Sweet Dreams Solutions",
  description: "Official video production for the Fort Wayne Mayor's Office State of the City Address. Produced by Sweet Dreams Solutions.",
};

export default function FortWayneStateOfTheCityPage() {
  const project = {
    title: 'FORT WAYNE STATE OF THE CITY ADDRESS',
    client_name: 'City of Fort Wayne',
    client_logos: [
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CityofFortWayneLogo.png',
    ],
    description: 'Official video production for the Fort Wayne State of the City Address.',
    category: 'Event Coverage',
    location: 'Fort Wayne, Indiana',
    year: 2026,
    services: ['Event Videography', 'Multi-Camera Production', 'Post-Production', 'Delivery'],
    full_description: 'Sweet Dreams Solutions was selected by the Mayor\'s Office to produce the official Fort Wayne State of the City Address. This project showcases our ability to handle high-profile civic events with the professionalism and production quality that city government demands. Full multi-camera coverage, professional audio, and polished post-production delivered on deadline.',
    mainVideo: 'd8719a81b378ac68b2c64e1cd2819a3e',
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
        <VideoPlayer videoId={project.mainVideo} className={styles.videoWrapper} playTextSize="large" />
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

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>READY TO CREATE SOMETHING AMAZING?</h2>
        <p className={styles.ctaDescription}>Let&apos;s discuss your next project.</p>
        <div className={styles.ctaButtons}>
          <Link href="/book" className={styles.ctaPrimary}>BOOK A CALL</Link>
          <Link href="/work" className={styles.ctaSecondary}>VIEW ALL WORK</Link>
        </div>
      </section>
    </div>
  );
}
