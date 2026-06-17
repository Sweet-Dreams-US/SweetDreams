import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export const metadata = {
  title: "Breastie Box Brand Film | Sweet Dreams Solutions",
  description: "Brand film for Breastie Box, a Fort Wayne nonprofit delivering care boxes to breast cancer patients. Long-form story film + 60-second cutdown produced by Sweet Dreams Solutions.",
};

export default function BreastieBoxBrandFilmPage() {
  const project = {
    title: 'BREASTIE BOX',
    client_name: 'Breastie Box',
    client_logos: [
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/Boob%20Logo%20.png',
    ],
    description: 'A brand film for Breastie Box, a Fort Wayne nonprofit bringing comfort, hope, and confidence to breast cancer patients — one box at a time.',
    category: 'Brand Film · Nonprofit',
    location: 'Fort Wayne, Indiana',
    year: 2026,
    services: ['Brand Film Production', 'Cinematography', 'Storytelling', 'Editing', '60-Second Cutdown', 'Post-Production'],
    full_description: 'Breastie Box is a Fort Wayne nonprofit that delivers personalized care packages to people newly diagnosed with breast cancer — comfort items, safe personal care products, and supportive touches that say "you are not alone." They\'ve distributed more than 3,500 boxes and raised over $240,000 at their A Pinch of Pink gala. Sweet Dreams Solutions produced this brand film to capture the heart of the mission — the recipients, the volunteers, and the moments inside every box — and delivered both a long-form story film for the gala and a 60-second cutdown for social and donor outreach.',
    mainVideo: 'cd386f606ba61022ba3e608f684b3c80',
    additionalVideos: [
      { id: '99f8648fad4d287122cacbb2b8ad5189', title: '60-Second Cutdown' },
    ] as { id: string; title: string }[],
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
        <VideoPlayer videoId={project.mainVideo} className={styles.videoWrapper} playTextSize="large" thumbnailTime="15s" />
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

      {project.additionalVideos.length > 0 && (
        <section className={styles.gallery}>
          <h2 className={styles.sectionTitle}>MORE VIDEOS</h2>
          <div className={styles.galleryGrid}>
            {project.additionalVideos.map((video, index) => (
              <div key={index} className={styles.galleryItem}>
                <VideoPlayer
                  videoId={video.id}
                  className={styles.additionalVideoWrapper}
                  playTextSize="small"
                  thumbnailTime="3s"
                />
                <span className={styles.videoTitle}>{video.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>READY TO CREATE SOMETHING AMAZING?</h2>
        <Link href="/book" className={styles.ctaButton}>BOOK A CALL</Link>
      </section>
    </div>
  );
}
