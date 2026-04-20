import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export default function FortWayneCourthouse4KPage() {
  const project = {
    title: 'FORT WAYNE COURTHOUSE IN 4K',
    client_name: 'Sweet Dreams Media',
    client_logo_url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg',
    cloudflare_stream_id: 'f7fc42a2caa35a3fd1eeb83e4fd5de06',
    description: 'A 4K aerial showcase of the historic Allen County Courthouse captured with our DJI Inspire cinema drone.',
    category: 'Aerial Cinematography',
    location: 'Fort Wayne, IN',
    year: 2026,
    services: ['Aerial Cinematography', '4K Cinema Drone', 'Color Grading', 'Editing'],
    full_description: 'Captured with the DJI Inspire — a true cinema-grade drone — this 4K aerial piece showcases the historic Allen County Courthouse in downtown Fort Wayne. The Beaux-Arts architecture, built in 1902, is one of the most photographed landmarks in Indiana, and our cinema drone reveals details invisible from the ground: the limestone carvings, the dome, and the symmetry of the surrounding streetscape. This footage demonstrates the caliber of aerial work Sweet Dreams Media delivers for commercial real estate, architectural, tourism, and broadcast clients across Northeast Indiana.',
    additional_images: []
  };

  return (
    <div className={styles.container}>
      {/* Header with title and client info */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.description}>{project.description}</p>
        </div>
        <div className={styles.clientInfo}>
          {project.client_logo_url && (
            <img
              src={project.client_logo_url}
              alt={project.client_name}
              className={styles.clientLogo}
            />
          )}
          <span className={styles.clientName}>{project.client_name}</span>
        </div>
      </header>

      {/* Main Video */}
      <section className={styles.videoSection}>
        <VideoPlayer videoId={project.cloudflare_stream_id} className={styles.videoWrapper} playTextSize="large" />
      </section>

      {/* Project Metadata */}
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

      {/* Project Overview */}
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

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>NEED AERIAL WORK LIKE THIS?</h2>
        <Link href="/book" className={styles.ctaButton}>
          GET IN TOUCH
        </Link>
      </section>
    </div>
  );
}
