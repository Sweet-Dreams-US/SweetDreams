import Link from "next/link";
import styles from "@/components/web/WebProjectPage.module.css";
import WebProjectVideoPlayer from "@/components/web/WebProjectVideoPlayer";

export const metadata = {
  title: "Crooked Lake Sandbar Music Fest | Web Development Portfolio",
  description: "crookedlakesandbarmusicfest.com — a charity music festival website for an on-the-water event in Angola, Indiana.",
};

export default function WebCrookedLakePage() {
  const project = {
    title: "CROOKED LAKE SANDBAR MUSIC FEST",
    url: "crookedlakesandbarmusicfest.com",
    videoId: "70cc260b4cb860e8d45485baedbf3b7f",
    description: "A charity music festival held on a sandbar in Angola, Indiana.",
    industry: "Events & Entertainment",
    year: 2025,
    services: [
      "Web Design",
      "Web Development",
      "UI/UX Design",
      "Event Integration",
      "Content Management",
      "Volunteer & Sponsor Portals",
      "Hosting & Deployment",
    ],
    full_description:
      "crookedlakesandbarmusicfest.com is the event website for the Crooked Lake Sandbar Music Fest — a charity music festival held on a sandbar at Crooked Lake in Angola, Indiana. Attendees boat directly to the sandbar venue for a unique on-the-water music experience. The site features a countdown timer to the next event, recap videos from previous years, a detailed venue map, and integrated portals for volunteer sign-ups, sponsorship opportunities, and artist submissions. All proceeds from the festival go to charity, with prominent sponsor visibility throughout the site.",
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
