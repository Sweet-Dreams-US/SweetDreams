import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export const metadata = {
  title: "Humane Shelter Charity Film | Sweet Dreams Solutions",
  description: "Charity brand film capturing how the Crooked Lake Sandbar Music Fest funds the Humane Shelter — produced by Sweet Dreams Solutions.",
};

export default function HumaneShelterCharityFilmPage() {
  const project = {
    title: 'HUMANE SHELTER',
    client_name: 'Humane Shelter × Crooked Lake Sandbar Music Fest',
    client_logos: [
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/HumaneShelterLogoWhitebackground.png',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CrookedLakeLogo.png',
    ],
    description: 'A charity film capturing the partnership between the Crooked Lake Sandbar Music Fest and the Humane Shelter — where the festival\'s donations actually land.',
    category: 'Charity Film · Nonprofit',
    location: 'Angola, Indiana',
    year: 2026,
    services: ['Brand Storytelling', 'Event Coverage', 'Charity Spotlight', 'Cinematography', 'Editing', 'Post-Production'],
    full_description: 'The Crooked Lake Sandbar Music Fest is a charity event built on a single promise: every dollar raised goes to a cause that matters. The Humane Shelter is where most of those donations land — funding the animals, the staff, and the day-to-day work of a shelter that depends on the community to keep its doors open. Sweet Dreams Solutions produced this film to close the loop for donors and attendees, showing where their support actually goes. From the festival on the water to the shelter on the ground, this is the story of one weekend that funds a year of rescue.',
    mainVideo: 'a5be567ba670d8e102cf9b507a4ad936',
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
        <VideoPlayer videoId={project.mainVideo} className={styles.videoWrapper} playTextSize="large" thumbnailTime="12s" />
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
