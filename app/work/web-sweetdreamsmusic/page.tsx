import Link from "next/link";
import styles from "@/components/web/WebProjectPage.module.css";
import WebProjectVideoPlayer from "@/components/web/WebProjectVideoPlayer";

export const metadata = {
  title: "Sweet Dreams Music | Web Development Portfolio",
  description: "sweetdreamsmusic.com — a professional recording studio website with online booking, beat store, and studio showcase.",
};

export default function WebSweetDreamsMusicPage() {
  const project = {
    title: "SWEET DREAMS MUSIC",
    url: "sweetdreamsmusic.com",
    videoId: "c7a40ce22803114bab73611635add20c",
    description: "A 24/7 recording studio with online booking and beat marketplace.",
    industry: "Music & Entertainment",
    year: 2024,
    services: [
      "Web Design",
      "Web Development",
      "E-Commerce Integration",
      "Online Booking System",
      "UI/UX Design",
      "Content Management",
      "Hosting & Deployment",
    ],
    full_description:
      "sweetdreamsmusic.com is the digital platform for Sweet Dreams Music — a professional recording studio in Fort Wayne operating 24/7. The site features an integrated online booking system with real-time availability, a beat marketplace with MP3 leases and exclusive rights purchasing, and detailed studio showcases for their two recording rooms. Engineers' profiles, equipment lists, and session pricing are all presented in a clean, musician-friendly interface designed to convert visitors into booked sessions.",
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
