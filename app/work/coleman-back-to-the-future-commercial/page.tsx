import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export const metadata = {
  title: "Coleman Automotive — Back to the Future Commercial | Sweet Dreams Solutions",
  description: "Back to the Future-themed oil change commercial for Coleman Automotive. Concept, storyboard, production, and post by Sweet Dreams Solutions.",
};

export default function ColemanBackToTheFutureCommercialPage() {
  const project = {
    title: 'BACK TO THE FUTURE',
    client_name: 'Coleman Automotive',
    client_logos: [
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/colemanautomotivegrouplogoblack.png',
    ],
    description: 'A Back to the Future-themed commercial built around Coleman Automotive\'s oil change offer — concept, storyboard, and remake delivered end-to-end.',
    category: 'Commercial · Automotive',
    location: 'Elgin, Illinois',
    year: 2026,
    services: ['Concept Development', 'Storyboarding', 'Pitching', 'Cinematography', 'Editing', 'VFX', 'Sound Design'],
    full_description: 'Coleman Automotive came to us with an oil change promotion and a creative ask: make it Back to the Future. We took that prompt and ran — storyboarding the idea, pitching the shot list, and bringing a faithful BTTF remake to life on the dealership lot. From the DeLorean reveal to the lightning-strike VFX and 1985 sound design, every beat was built to land the offer in a way a standard "service special" spot never could. The result is a commercial Coleman can run across paid social and TV without it looking like an ad.',
    mainVideo: '7943215ed685238e8ca63bc3617f807d',
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
        <VideoPlayer videoId={project.mainVideo} className={styles.videoWrapper} playTextSize="large" thumbnailTime="8s" />
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
        <Link href="/book" className={styles.ctaButton}>BOOK A CALL</Link>
      </section>
    </div>
  );
}
