/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://sweetdreams.us',
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  // Exclude auth, profile, and music pages from sitemap
  exclude: [
    '/profile',
    '/profile/*',
    '/api/*',
    '/(auth)/*',
    '/(auth)/login',
    '/(auth)/signup',
    '/music',
    '/music/*',
  ],

  // robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/profile', '/api', '/(auth)', '/music'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sweetdreams.us'}/sitemap.xml`,
    ],
  },

  // Custom priority and change frequency per page
  transform: async (config, path) => {
    // Priority levels based on importance
    const priorities = {
      '/': 1.0,              // Homepage - highest
      '/work': 0.95,         // Portfolio - primary conversion page
      '/solutions': 0.9,     // Business solutions - very high
      '/book': 0.9,          // Booking - conversion endpoint
      '/partnerships': 0.8,  // Partnerships - high
      '/about': 0.7,         // About
      '/blog': 0.7,          // Blog
      '/media': 0.3,         // Deprecated — will be fully replaced by /work
    }

    const priority = priorities[path] || 0.5

    // Change frequency based on page type
    let changefreq = 'weekly'
    if (path === '/') changefreq = 'daily'
    if (path === '/blog') changefreq = 'daily'
    if (path === '/work') changefreq = 'daily' // frequent portfolio updates

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    }
  },

  // Additional paths to include (useful for dynamic routes)
  additionalPaths: async (config) => {
    const result = []

    // Add all work/portfolio project pages (business-focused)
    const projectSlugs = [
      'fort-wayne-courthouse-4k',
      'fort-wayne-state-of-the-city',
      'mom-nonprofit-brand-film',
      'knoxville-carnival-coverage',
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
      'heaven-in-fort-wayne',
      'wake-up-blind-music-video',
      'dear-lover-music-video',
      'sweet-dreams-recording-studio',
      'fort-wayne-traffic-hyperlapse',
      'cinema-drone-ad',
      'the-coleman-prime-story',
      'mc-sim-racing',
      // Website portfolio projects
      'web-sweetdreams',
      'web-sweetdreamsmusic',
      'web-creatorspace',
      'web-primedealerfund',
      'web-mcracing',
      'web-crookedlake',
      'web-mindsquire',
      'web-industrialbakery',
    ]

    projectSlugs.forEach(slug => {
      result.push({
        loc: `/work/${slug}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      })
    })

    return result
  },
}
