import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL
  const currentDate = new Date()

  // All work/portfolio project pages
  const projectPages = [
    'knoxville-carnival-coverage',
    'wake-up-blind-music-video',
    'aegis-dental-trusted-dentistry',
    'fort-wayne-carnival-recap',
    'cumberland-falls-ky-nature-showcase',
    'indianapolis-childrens-museum-ferris-wheel',
    'sliced-by-sonny-commercial',
    'vintage-fest-fort-wayne',
    'snobiz-snowcone-truck-commercial',
    'vegas-dream-travel-content',
    'nissan-warsaw-dealership',
    'brookfield-zoo-ferris-wheel',
    'fort-wayne-hyperlapse-showcase',
    'dear-lover-music-video',
    'heaven-in-fort-wayne',
    'sweet-dreams-recording-studio',
    'fort-wayne-traffic-hyperlapse',
    'cinema-drone-ad',
    'the-coleman-prime-story',
    'mc-sim-racing',
    'fort-wayne-state-of-the-city',
    'mom-nonprofit-brand-film',
    'fort-wayne-courthouse-4k',
    'breastie-box-brand-film',
    'nissan-elgin-acquisition-recap',
    'coleman-back-to-the-future-commercial',
    'coleman-onboarding-series',
    'humane-shelter-charity-film',
    // Website portfolio projects
    'web-sweetdreams',
    'web-sweetdreamsmusic',
    'web-creatorspace',
    'web-primedealerfund',
    'web-mcracing',
    'web-crookedlake',
    'web-mindsquire',
    'web-industrialbakery',
  ].map((slug) => ({
    url: `${baseUrl}/work/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      // Trailing slash — matches the homepage canonical, which metadataBase
      // normalizes to `${SITE_URL}/`.
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      // Websites — product page (the former /software hub redirects here)
      url: `${baseUrl}/websites`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      // AI Workflows — product page
      url: `${baseUrl}/ai`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      // Media Production hub — primary pillar
      url: `${baseUrl}/services/media-production`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      // Router page — footer-only, kept indexable but low priority
      url: `${baseUrl}/solutions`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    // Service + Location pages (critical for local SEO)
    {
      url: `${baseUrl}/services/video-production-fort-wayne`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/web-development-fort-wayne`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/social-media-management-fort-wayne`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    // All portfolio project pages
    ...projectPages,
  ]
}
