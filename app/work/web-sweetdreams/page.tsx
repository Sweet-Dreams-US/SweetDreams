import Link from "next/link";
import styles from "@/components/web/WebProjectPage.module.css";
import WebProjectVideoPlayer from "@/components/web/WebProjectVideoPlayer";

export const metadata = {
  title: "Sweet Dreams | Web Development Portfolio",
  description: "sweetdreams.us — the main agency website for Sweet Dreams, a Fort Wayne-based media and web development agency.",
};

export default function WebSweetDreamsPage() {
  const project = {
    title: "SWEETDREAMS.US",
    url: "sweetdreams.us",
    videoId: "2e09ff39e945e08cf28ced40197bf836",
    description: "Our own agency site — built to showcase what we do best.",
    industry: "Agency",
    year: 2024,
    services: [
      "Web Design",
      "Web Development",
      "UI/UX Design",
      "Branding",
      "Content Strategy",
      "SEO Optimization",
      "Hosting & Deployment",
    ],
    full_description:
      "sweetdreams.us is the digital home of Sweet Dreams — a Fort Wayne, Indiana-based media agency founded in 2020. The site was designed and built to embody our results-driven philosophy with bold typography, smooth animations, and an immersive portfolio experience. Every interaction was crafted to communicate professionalism and creativity, from the GSAP-powered hero to the horizontal-scroll portfolio grid. Built on Next.js with Vercel deployment for maximum performance.",
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
