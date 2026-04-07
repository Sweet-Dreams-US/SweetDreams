import Link from "next/link";
import styles from "@/components/web/WebProjectPage.module.css";
import WebProjectVideoPlayer from "@/components/web/WebProjectVideoPlayer";

export const metadata = {
  title: "MindSquire | Web Development Portfolio",
  description: "mindsquire.com — a YouTube content creation organization website with 1.3B+ views and recruitment platform.",
};

export default function WebMindSquirePage() {
  const project = {
    title: "MINDSQUIRE",
    url: "mindsquire.com",
    videoId: "4db4384638b438d0f2c3fb9b60a48606",
    description: "A YouTube content powerhouse with 1.3B+ views.",
    industry: "Digital Media & Content",
    year: 2025,
    services: [
      "Web Design",
      "Web Development",
      "UI/UX Design",
      "Branding",
      "Recruitment Portal",
      "Content Integration",
      "Hosting & Deployment",
    ],
    full_description:
      "mindsquire.com is the digital hub for MindSquire — a YouTube content creation organization boasting over 1.3 billion accumulated views and 2 million combined followers. The site serves as both a brand showcase and a recruitment platform, highlighting their creative team and open positions. From Assistant Editors to Heads of Operations, the careers section is designed to attract top talent in the digital content space. The design reflects MindSquire's energetic, youth-driven brand while maintaining the professionalism needed for a team scaling at their pace.",
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
