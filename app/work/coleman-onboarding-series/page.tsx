import Link from "next/link";
import styles from "./project.module.css";
import VideoPlayer from "./VideoPlayer";

export const metadata = {
  title: "Coleman Onboarding Series — 3-Video Hiring Package | Sweet Dreams Solutions",
  description: "Productized 3-video onboarding series for Coleman Automotive — Why You Should Apply, Thank You for Applying, and Welcome to the Team. A repeatable hiring funnel any business can deploy.",
};

export default function ColemanOnboardingSeriesPage() {
  const project = {
    title: 'ONBOARDING SERIES',
    client_name: 'Coleman Automotive',
    client_logos: [
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/colemanautomotivegrouplogoblack.png',
    ],
    description: 'A three-video hiring & onboarding series productized for any business — turning recruitment into a branded funnel candidates actually finish.',
    category: 'Onboarding Series · Productized',
    location: 'Elgin, Illinois',
    year: 2026,
    services: ['Concept & Funnel Design', 'Scripting', 'On-Camera Coaching', 'Cinematography', 'Editing', 'Brand-Consistent Color & Sound'],
  };

  // The three videos as a package — equally weighted, sequenced by where they
  // sit in the candidate's journey. Stages are named for the business outcome,
  // not the video subject, so prospects scanning the page understand WHY each
  // piece exists in the funnel.
  const steps = [
    {
      number: '01',
      stage: 'ATTRACT · Top of funnel',
      name: 'WHY YOU SHOULD APPLY',
      videoId: '313f0b9be3d81f11e7d239fd08a34d38',
      thumbnailTime: '3s',
      description: 'A scroll-stopping recruiting spot built to run on Indeed, LinkedIn, and paid social. Shot at Nissan of Elgin, this is the video a candidate sees before they ever fill out a form — the one that pre-sells the role, the team, and the brand in under 90 seconds.',
      outcome: 'Outcome: higher quality applicants, lower cost per qualified hire, less time spent screening people who weren\'t a fit.',
    },
    {
      number: '02',
      stage: 'ACKNOWLEDGE · Mid-funnel confirmation',
      name: 'THANK YOU FOR APPLYING',
      videoId: '5a4e466c966e2f5bd0f901f8013bb9e9',
      thumbnailTime: '2s',
      description: 'The auto-reply video that lands in every applicant\'s inbox. Most companies send a templated email; this puts a face, a tone, and a real human moment in front of the candidate the second they hit submit — which dramatically reduces the silent drop-off between application and interview.',
      outcome: 'Outcome: stronger candidate experience, fewer ghosted interviews, a meaningful brand impression even for the people you don\'t hire.',
    },
    {
      number: '03',
      stage: 'ACTIVATE · Day one welcome',
      name: 'WELCOME TO THE TEAM',
      videoId: 'cc32acf6a41516b7c9806b721bdead02',
      thumbnailTime: '2s',
      description: 'The day-one onboarding video new hires watch before they ever walk the floor. Sets culture, expectations, and pride in joining the team — the kind of welcome that makes a new employee text their family before lunch.',
      outcome: 'Outcome: faster ramp time, higher 90-day retention, a culture moment that compounds with every new hire who joins.',
    },
  ];

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

      {/* Package framing — explains the productized nature before any video plays */}
      <section className={styles.seriesIntro}>
        <p className={styles.seriesKicker}>PRODUCTIZED OFFERING · 3-VIDEO PACKAGE</p>
        <h2 className={styles.seriesIntroHeading}>ONE FUNNEL. THREE VIDEOS. EVERY HIRE.</h2>
        <p className={styles.seriesIntroText}>
          Most companies bolt a recruiting video onto whatever HR system they already
          have and hope. We built Coleman a complete hiring funnel — Attract,
          Acknowledge, Activate — that turns candidates into employees with consistent
          brand presence at every step. The same package can be productized for any
          business looking to hire smarter, not harder.
        </p>
      </section>

      {/* The series — three equally-weighted blocks, sequenced by funnel stage */}
      <section className={styles.steps}>
        {steps.map((step) => (
          <article key={step.number} className={styles.step}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>{step.number}</span>
              <div className={styles.stepLabelCol}>
                <p className={styles.stepStage}>{step.stage}</p>
                <h3 className={styles.stepName}>{step.name}</h3>
              </div>
            </div>
            <div className={styles.stepVideoWrapper}>
              <VideoPlayer
                videoId={step.videoId}
                className={styles.videoWrapper}
                playTextSize="large"
                thumbnailTime={step.thumbnailTime}
              />
            </div>
            <p className={styles.stepDescription}>{step.description}</p>
            <p className={styles.stepOutcome}>
              <strong>{step.outcome.split(':')[0]}:</strong>{step.outcome.substring(step.outcome.indexOf(':') + 1)}
            </p>
          </article>
        ))}
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
        <p className={styles.overviewText}>
          Built first for Coleman Automotive and now available as a productized
          package for any business: a three-video hiring & onboarding series that
          replaces the templated emails and generic recruiting spots most companies
          settle for. Sweet Dreams Solutions handles the funnel design, scripting,
          on-camera coaching, cinematography, and brand-consistent post-production —
          so the candidate hears the same voice from the moment they see the ad to
          the moment they walk in on day one.
        </p>
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
        <h2 className={styles.ctaTitle}>WANT A SERIES LIKE THIS FOR YOUR TEAM?</h2>
        <Link href="/book" className={styles.ctaButton}>BOOK A CALL</Link>
      </section>
    </div>
  );
}
