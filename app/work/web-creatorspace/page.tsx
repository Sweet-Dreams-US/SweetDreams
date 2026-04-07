import Link from "next/link";
import styles from "@/components/web/WebProjectPage.module.css";
import WebProjectVideoPlayer from "@/components/web/WebProjectVideoPlayer";

export const metadata = {
  title: "Creator Space FW | Web Development Portfolio",
  description: "creatorspacefw.com — a free community directory and networking platform for creative professionals in Fort Wayne.",
};

export default function WebCreatorSpacePage() {
  const project = {
    title: "CREATOR SPACE FW",
    url: "creatorspacefw.com",
    videoId: "37a027a19196653d4ef79b6c2f5f5758",
    description: "A free community directory connecting Fort Wayne creatives.",
    industry: "Community & Networking",
    year: 2024,
    services: [
      "Web Design",
      "Web Development",
      "UI/UX Design",
      "Community Platform",
      "Directory System",
      "Event Integration",
      "Hosting & Deployment",
    ],
    full_description:
      "creatorspacefw.com is a free community directory and networking platform built for creative professionals in Fort Wayne, Indiana. The platform connects local videographers, photographers, designers, musicians, and developers through a searchable directory, monthly meetups, and collaboration tools. Every feature was designed to lower the barrier for creatives to find each other and work together — from the filterable creator profiles to the event calendar highlighting community gatherings like their annual bash celebration.",
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
