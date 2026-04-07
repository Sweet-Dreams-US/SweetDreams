import Link from "next/link";
import styles from "@/components/web/WebProjectPage.module.css";
import WebProjectVideoPlayer from "@/components/web/WebProjectVideoPlayer";

export const metadata = {
  title: "Industrial Bakery Equipment | Web Development Portfolio",
  description: "industrialbakeryequipment.com — a steel fabrication company website specializing in food service equipment manufacturing.",
};

export default function WebIndustrialBakeryPage() {
  const project = {
    title: "INDUSTRIAL BAKERY EQUIPMENT",
    url: "industrialbakeryequipment.com",
    videoId: "33850e02411be4ba7cb880ef7af52dce",
    description: "Steel fabrication and food service equipment manufacturing since 2008.",
    industry: "Manufacturing & Food Service",
    year: 2025,
    services: [
      "Web Design",
      "Web Development",
      "UI/UX Design",
      "Product Catalog",
      "Quote Request System",
      "SEO Optimization",
      "Hosting & Deployment",
    ],
    full_description:
      "industrialbakeryequipment.com is the online presence for Industrial Bakery Equipment (IBE) — a Fort Wayne-based steel and stainless steel fabrication company operating since 2008. The site serves as both a product catalog and a lead generation tool, showcasing their extensive range of food service equipment including bread cooling racks, dough troughs, blast freeze racks, and custom wire carts. Serving over a dozen industries from baking and food processing to government and military, the site features detailed product specifications, downloadable PDF spec sheets, and a streamlined quote request system designed to convert industrial buyers.",
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
