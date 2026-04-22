'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Work.module.css';

// Color codes match the Work page filter palette so the homepage
// feels unified with the portfolio. Each project picks the color that
// best represents its primary category.
type ProjectColor = 'red' | 'yellow' | 'blue' | 'green' | 'orange' | 'purple';

interface Project {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  client: string;
  category: string;
  year: string;
  services: string;
  color: ProjectColor;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'FORT WAYNE COURTHOUSE 4K',
    slug: 'fort-wayne-courthouse-4k',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/f7fc42a2caa35a3fd1eeb83e4fd5de06/thumbnails/thumbnail.jpg?time=80s&height=600',
    client: 'Sweet Dreams Media',
    category: 'Aerial Cinematography',
    year: '2026',
    services: 'DJI Inspire Cinema Drone, 4K Aerial, Color Grading, Editing',
    color: 'blue',
  },
  {
    id: 2,
    title: 'FORT WAYNE STATE OF THE CITY',
    slug: 'fort-wayne-state-of-the-city',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/d8719a81b378ac68b2c64e1cd2819a3e/thumbnails/thumbnail.jpg?time=5s&height=600',
    client: 'City of Fort Wayne',
    category: 'Event Coverage',
    year: '2026',
    services: 'Event Coverage, Aerial, Multi-cam Production, Editing',
    color: 'yellow',
  },
  {
    id: 3,
    title: 'M.O.M. NONPROFIT BRAND FILM',
    slug: 'mom-nonprofit-brand-film',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/a03f0e00cd2fda4a43464adec197c0b6/thumbnails/thumbnail.jpg?time=5s&height=600',
    client: 'M.O.M. Nonprofit',
    category: 'Brand Film · Nonprofit',
    year: '2026',
    services: 'Brand Strategy, Cinematography, Interviews, Editing, Color',
    color: 'red',
  },
  {
    id: 4,
    title: 'FORT WAYNE HYPERLAPSE CITY SHOWCASE',
    slug: 'fort-wayne-hyperlapse-showcase',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/a507a5b8a369b70b7332c0567cbbcc4c/thumbnails/thumbnail.jpg?time=2s&height=600',
    client: 'City of Fort Wayne',
    category: 'Aerial Hyperlapse',
    year: '2025',
    services: 'Aerial Cinematography, Hyperlapse, Color Grading, Editing',
    color: 'blue',
  },
  {
    id: 5,
    title: 'THE COLEMAN PRIME STORY',
    slug: 'the-coleman-prime-story',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/d08682649901944d9bbec1dcfb8bde88/thumbnails/thumbnail.jpg?time=89s&height=600',
    client: 'Coleman Prime',
    category: 'Brand Trailer',
    year: '2025',
    services: 'Brand Strategy, Cinematography, Editing, Color Grading',
    color: 'red',
  },
  {
    id: 6,
    title: 'NISSAN WARSAW DEALERSHIP',
    slug: 'nissan-warsaw-dealership',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/700297c313e97262173f0c2107f3b8db/thumbnails/thumbnail.jpg?time=2s&height=600',
    client: 'Nissan Warsaw Dealer',
    category: 'Automotive Commercial',
    year: '2025',
    services: 'Commercial, Aerial, Cinematography, Editing, Color',
    color: 'red',
  },
  {
    id: 7,
    title: 'INDUSTRIAL BAKERY EQUIPMENT',
    slug: 'web-industrialbakery',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/33850e02411be4ba7cb880ef7af52dce/thumbnails/thumbnail.jpg?time=1s&height=600',
    client: 'Industrial Bakery Equipment',
    category: 'Custom Website',
    year: '2025',
    services: 'Custom Code, Brand Strategy, SEO, Performance Optimization',
    color: 'orange',
  },
  {
    id: 8,
    title: 'PRIME DEALER EQUITY FUND',
    slug: 'web-primedealerfund',
    thumbnail: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/652911e44eafee84d9efa47dad31eac5/thumbnails/thumbnail.jpg?time=1s&height=600',
    client: 'Coleman Prime',
    category: 'Custom Website',
    year: '2025',
    services: 'Custom Code, Brand System, Investor Portal, SEO',
    color: 'orange',
  },
  {
    id: 9,
    title: 'INDIANAPOLIS CHILDREN\'S MUSEUM FERRIS WHEEL',
    slug: 'indianapolis-childrens-museum-ferris-wheel',
    thumbnail: 'https://videodelivery.net/7a243650c649bdcf4369622acd47abf6/thumbnails/thumbnail.jpg?time=1s&height=600',
    client: 'Indianapolis Children\'s Museum',
    category: 'Brand Film · Event',
    year: '2025',
    services: 'Scripting, Aerial, Cinematography, Editing, Color Grading',
    color: 'red',
  },
  {
    id: 10,
    title: 'BROOKFIELD ZOO FERRIS WHEEL',
    slug: 'brookfield-zoo-ferris-wheel',
    thumbnail: 'https://videodelivery.net/b3b94bd1543e2452571b90aab0a38e9b/thumbnails/thumbnail.jpg?time=13s&height=600',
    client: 'RideWorx & Brookfield Zoo',
    category: 'Brand Film · Event',
    year: '2025',
    services: 'Scripting, Cinematography, Editing, Color Grading',
    color: 'red',
  },
];

// Map colors to CSS class names so we can style per-color hover/active states
const colorClassMap: Record<ProjectColor, string> = {
  red: styles.colorRed,
  yellow: styles.colorYellow,
  blue: styles.colorBlue,
  green: styles.colorGreen,
  orange: styles.colorOrange,
  purple: styles.colorPurple,
};

export default function Work() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleProject = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className={styles.section} data-cursor-hide>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>WE CARE ABOUT YOUR "WHY?"</h2>
          <h3 className={styles.mainText}>WORK</h3>
        </div>

        {/* Subheader */}
        <div className={styles.subheader}>
          <span className={styles.subheaderLeft}>PROJECTS</span>
          <Link href="/work" className={styles.exploreLink}>EXPLORE</Link>
        </div>

        {/* Projects List */}
        <div className={styles.projectsList}>
          {PROJECTS.map((project) => {
            const isExpanded = expandedId === project.id;
            const projectClass = `${styles.projectItem} ${colorClassMap[project.color]} ${isExpanded ? styles.projectItemExpanded : ''}`;
            return (
              <div key={project.id} className={projectClass}>
                {/* Project Header - Always Visible */}
                <div className={styles.projectHeader} onClick={() => toggleProject(project.id)}>
                  <h4 className={styles.projectTitle}>{project.title}</h4>
                  <button className={styles.toggleButton}>
                    <svg
                      className={`${styles.arrow} ${isExpanded ? styles.arrowUp : ''}`}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                {/* Project Details - Collapsible */}
                {isExpanded && (
                  <div className={styles.projectDetails}>
                    <div className={styles.detailsLeft}>
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className={styles.thumbnail}
                      />
                    </div>
                    <div className={styles.detailsRight}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>CLIENT</span>
                        <span className={styles.detailValue}>{project.client}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>CATEGORY</span>
                        <span className={styles.detailValue}>{project.category}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>YEAR</span>
                        <span className={styles.detailValue}>{project.year}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>SERVICES</span>
                        <span className={styles.detailValue}>{project.services}</span>
                      </div>
                      <Link href={`/work/${project.slug}`} className={styles.viewButton}>
                        VIEW PROJECT
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
