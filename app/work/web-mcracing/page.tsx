import Link from "next/link";
import styles from "@/components/web/WebProjectPage.module.css";
import WebProjectVideoPlayer from "@/components/web/WebProjectVideoPlayer";

export const metadata = {
  title: "MC Racing Fort Wayne | Web Development Portfolio",
  description: "mcracingfortwayne.com — Fort Wayne's professional-grade sim racing and RC lounge website.",
};

export default function WebMCRacingPage() {
  const project = {
    title: "MC RACING FORT WAYNE",
    url: "mcracingfortwayne.com",
    videoId: "1ab82de79e003fc0c37afc0a27fedbc4",
    description: "Fort Wayne's only professional sim racing and RC lounge.",
    industry: "Entertainment & Gaming",
    year: 2025,
    services: [
      "Web Design",
      "Web Development",
      "UI/UX Design",
      "Online Booking System",
      "Content Management",
      "SEO Optimization",
      "Hosting & Deployment",
    ],
    full_description:
      "mcracingfortwayne.com is the online hub for MC Racing — Fort Wayne's only professional-grade sim racing and RC lounge. The site showcases their premium simulation rigs featuring direct-drive force feedback wheels, hydraulic handbrakes, and triple 65-inch displays. Session booking is streamlined with three tiers (Sprint, Grand Prix, and Endurance), plus combo deals that include their indoor RC track. The design captures the high-energy racing atmosphere while making it easy for customers to book sessions, explore party packages, and find information about corporate events.",
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.description}>{project.description}</p>
          <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className={styles.liveSiteLink}>
            Visit Live Site &rarr;
          </a>
        </div>
      </header>

      <WebProjectVideoPlayer videoId={project.videoId} url={project.url} />

      <section className={styles.metadata}>
        <div className={styles.metadataGrid}>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>INDUSTRY</span>
            <span className={styles.metadataValue}>{project.industry}</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>WEBSITE</span>
            <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className={styles.metadataLink}>{project.url}</a>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>YEAR</span>
            <span className={styles.metadataValue}>{project.year}</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>TYPE</span>
            <span className={styles.metadataValue}>Web Development</span>
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
        <h2 className={styles.ctaTitle}>NEED A WEBSITE BUILT?</h2>
        <Link href="/work#contact" className={styles.ctaButton}>
          GET IN TOUCH
        </Link>
      </section>
    </div>
  );
}
