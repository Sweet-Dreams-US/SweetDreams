/**
 * Centralized Constants for Sweet Dreams
 * Single source of truth for domain, branding, and configuration
 */

// ==================== DOMAIN CONFIGURATION ====================

/**
 * Primary domain - sweetdreams.us
 * Business solutions site for media, video production, web development
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sweetdreams.us';

/**
 * Sister site - Sweet Dreams Music (separate booking site)
 */
export const MUSIC_SITE_URL = 'https://sweetdreamsmusic.com';

/**
 * Legacy domains that redirect to sweetdreams.us
 */
export const LEGACY_DOMAINS = [
  'sweetdreamsvideo.com',
  'sweetdreamsprod.com',
] as const;

// ==================== BRAND IDENTITY ====================

export const BRAND = {
  name: 'Sweet Dreams',
  legalName: 'Sweet Dreams Music LLC',
  tagline: 'Business Media Solutions',
  description: 'Fort Wayne business media agency specializing in media production, website development, business operations software, marketing strategies, social media management, and social media content production for businesses.',
} as const;

// ==================== CONTACT INFORMATION ====================

export const CONTACT = {
  phone: '+1-260-450-7739',
  phoneDisplay: '(260) 450-7739',
  email: 'jayvalleo@sweetdreams.us',
  emailSupport: 'support@sweetdreams.us',
  emailNoreply: 'noreply@sweetdreams.us',
} as const;

// ==================== BUSINESS ADDRESS ====================

export const ADDRESS = {
  street: '3943 Parnell Ave',
  city: 'Fort Wayne',
  state: 'IN',
  stateFullName: 'Indiana',
  zip: '46805',
  country: 'US',
  countryFullName: 'United States',
  formatted: '3943 Parnell Ave, Fort Wayne, IN 46805',
} as const;

// ==================== GEOLOCATION ====================

export const GEO = {
  latitude: 41.093842,
  longitude: -85.139236,
  region: 'US-IN',
  placeName: 'Fort Wayne',
  position: '41.0793;-85.1394',
  icbm: '41.0793, -85.1394',
} as const;

// ==================== SOCIAL MEDIA ====================

export const SOCIAL = {
  instagram: 'https://www.instagram.com/sweetdreamssolutions.us/',
  tiktok: 'https://www.tiktok.com/@sweetdreamsstudios',
  facebook: 'https://www.facebook.com/people/Sweet-Dreams-Solutions/100085672277251/',
  youtube: 'https://www.youtube.com/@SweetDreamsUS',
  twitter: '@jayvalleo',
  linkedin: '',
} as const;

// ==================== BUSINESS HOURS ====================

export const BUSINESS_HOURS = {
  monday: { open: '09:00', close: '21:00', isOpen: true },
  tuesday: { open: '09:00', close: '21:00', isOpen: true },
  wednesday: { open: '09:00', close: '21:00', isOpen: true },
  thursday: { open: '09:00', close: '21:00', isOpen: true },
  friday: { open: '09:00', close: '21:00', isOpen: true },
  saturday: { open: '10:00', close: '18:00', isOpen: true },
  sunday: { open: null, close: null, isOpen: false },
} as const;

// ==================== SERVICE CONFIGURATION ====================

export const SERVICES = {
  video: {
    name: 'Media Production',
    slug: 'media',
    description: 'Commercials, brand films, corporate videos, promotional content, event coverage, and social media video production for businesses',
  },
  web: {
    name: 'Website Services & Software Development',
    slug: 'solutions',
    description: 'Custom website design, web development, e-commerce, and business operations software for businesses and brands',
  },
  social: {
    name: 'Social Media Management & Production',
    slug: 'solutions',
    description: 'Full-service social media management, content production, strategy, and audience growth for businesses',
  },
  marketing: {
    name: 'Marketing Strategies',
    slug: 'solutions',
    description: 'Data-driven marketing strategies, brand development, and digital marketing campaigns for business growth',
  },
  partnerships: {
    name: 'Business Partnerships',
    slug: 'partnerships',
    description: 'Strategic media partnerships for long-term business growth and brand development',
  },
} as const;

// ==================== SEO CONFIGURATION ====================

export const SEO = {
  defaultTitle: 'Sweet Dreams | Fort Wayne Business Media Solutions',
  titleTemplate: '%s | Sweet Dreams',
  defaultDescription: 'Fort Wayne business media agency offering media production, website services, business operations software development, marketing strategies, social media management, and social media content production. Professional solutions for businesses and brands.',
  keywords: [
    // Location-based
    'Fort Wayne media agency',
    'Fort Wayne videographer',
    'Fort Wayne web development',
    'Fort Wayne commercial video production',
    'Northeast Indiana media production',
    'Indiana business media agency',
    'Fort Wayne business solutions',

    // Service-specific
    'commercial videography',
    'brand film production',
    'business video production',
    'corporate video Fort Wayne',
    'custom website development',
    'social media marketing',
    'social media growth agency',
    'content creation services',
    'business media sales',
    'promotional video production',

    // Combined services
    'full-service business media agency',
    'media production company',
    'digital marketing agency Fort Wayne',
    'video and web development',
    'business partnerships media',
    'brand video production',
    'commercial production company',

    // High-intent local searches
    'creative agency Fort Wayne',
    'media solutions Fort Wayne',
    'video marketing Fort Wayne',
    'Fort Wayne web designer',
    'website company Fort Wayne Indiana',
    'videographer near me Fort Wayne',

    // Expanded service coverage
    'business operations software Fort Wayne',
    'marketing strategies Fort Wayne',
    'social media content production',
    'media production Fort Wayne Indiana',
    'social media production Fort Wayne',
    'software development Fort Wayne',
    'business software Fort Wayne',
    'marketing agency Fort Wayne',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Sweet Dreams',
    imageUrl: `${SITE_URL}/og-image.png`,
    imageAlt: 'Sweet Dreams Business Media Solutions',
    imageWidth: 1200,
    imageHeight: 630,
  },
} as const;

// ==================== ANALYTICS ====================

export const ANALYTICS = {
  googleAnalytics: 'G-JVM25Y7PGY',
  googleTagManager: 'GTM-NX7KJL3N',
  facebookPixel: '3631251467167744',
  microsoftClarity: 'tyjolmx04i',
} as const;

// ==================== STRIPE CONFIGURATION ====================

export const STRIPE = {
  successUrl: `${SITE_URL}/book?success=true`,
  cancelUrl: `${SITE_URL}/book`,
} as const;
