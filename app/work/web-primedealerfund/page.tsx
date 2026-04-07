import Link from "next/link";
import styles from "@/components/web/WebProjectPage.module.css";
import WebProjectVideoPlayer from "@/components/web/WebProjectVideoPlayer";

export const metadata = {
  title: "Prime Dealer Fund | Web Development Portfolio",
  description: "primedealerfund.com — a private equity investment fund website for automotive dealership acquisitions.",
};

export default function WebPrimeDealerFundPage() {
  const project = {
    title: "PRIME DEALER FUND",
    url: "primedealerfund.com",
    videoId: "652911e44eafee84d9efa47dad31eac5",
    description: "A private equity fund site for automotive dealership investments.",
    industry: "Finance & Private Equity",
    year: 2024,
    services: [
      "Web Design",
      "Web Development",
      "UI/UX Design",
      "Branding",
      "Content Strategy",
      "Investor Portal Design",
      "Hosting & Deployment",
    ],
    full_description:
      "primedealerfund.com is the digital presence for the Prime Dealer Equity Fund — a private equity investment vehicle partnering with Coleman Automotive Group to acquire and operate automotive dealerships across the United States. The site was designed to communicate trust, authority, and professionalism to accredited investors. It features a clear five-step investment process, detailed portfolio showcasing their dealership holdings across Indiana, Iowa, and Ohio, and performance metrics that highlight the fund's target distributions and the scale of the automotive retail industry.",
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
