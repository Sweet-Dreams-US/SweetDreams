/**
 * Centralized Constants for Sweet Dreams Solutions
 * Single source of truth for domain, branding, and configuration
 *
 * Business: Sweet Dreams Solutions (Sweet Dreams US LLC)
 * Domain: sweetdreams.us
 * Services: Media Production, Marketing, Business Consulting, Software Development
 */

// ==================== DOMAIN CONFIGURATION ====================

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sweetdreams.us';
export const MUSIC_SITE_URL = 'https://sweetdreamsmusic.com';
export const LEGACY_DOMAINS = ['sweetdreamsvideo.com', 'sweetdreamsprod.com'] as const;

// ==================== BRAND IDENTITY ====================

export const BRAND = {
  name: 'Sweet Dreams Solutions',
  shortName: 'Sweet Dreams',
  legalName: 'Sweet Dreams US LLC',
  tagline: 'Media Production, Marketing, Business Consulting & Software Development',
  description: 'Sweet Dreams Solutions is a full-service business agency in Fort Wayne, Indiana delivering media production, marketing strategy, business consulting, and custom software development. We help businesses scale with commercial video, brand films, social media growth, custom-coded websites, business operations software, and strategic consulting — all under one roof.',
} as const;

// ==================== CONTACT INFORMATION ====================

export const CONTACT = {
  phone: '+1-260-615-7467',
  phoneDisplay: '(260) 615-7467',
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
  media: {
    name: 'Media Production',
    slug: 'media',
    description: 'Commercial video production, brand films, documentary-style storytelling, photography, event coverage, drone/cinema drone, and short-form social video content for businesses.',
  },
  marketing: {
    name: 'Marketing',
    slug: 'solutions',
    description: 'Full-funnel marketing strategy, local SEO, email marketing automation, paid advertising, social media growth and management, content strategy, and conversion optimization.',
  },
  consulting: {
    name: 'Business Consulting',
    slug: 'solutions',
    description: 'Growth strategy, operations design, offer strategy, pricing, delegation systems, and scaling frameworks for business owners.',
  },
  software: {
    name: 'Software Development',
    slug: 'solutions',
    description: 'Custom-coded websites (Next.js, React, TypeScript), business operations software, custom CRMs, automation tools, AI implementation, and API integrations.',
  },
  partnerships: {
    name: 'Strategic Partnerships',
    slug: 'partnerships',
    description: 'Performance-based growth partnerships with revenue-tied compensation. Unlimited content production, brand asset creation, and social media management.',
  },
} as const;

// ==================== SEO CONFIGURATION ====================

export const SEO = {
  defaultTitle: 'Sweet Dreams Solutions | Media, Marketing, Consulting & Software',
  titleTemplate: '%s | Sweet Dreams Solutions',
  defaultDescription: 'Sweet Dreams Solutions is a Fort Wayne, Indiana business agency offering media production, marketing strategy, business consulting, and custom software development. Commercial video, brand films, custom-coded websites, business operations software, growth frameworks, and more — all under one roof.',
  keywords: [
    'Sweet Dreams Solutions',
    'Sweet Dreams Solutions Fort Wayne',
    'Sweet Dreams US LLC',
    'sweetdreams.us',
    'media production agency',
    'marketing agency Fort Wayne',
    'business consulting agency',
    'custom software development agency',
    'commercial video production',
    'brand film production',
    'business video production',
    'documentary style brand video',
    'corporate video Fort Wayne',
    'Fort Wayne videographer',
    'Northeast Indiana media production',
    'full funnel marketing',
    'local SEO Fort Wayne',
    'email marketing automation',
    'social media management',
    'social media growth agency',
    'content marketing strategy',
    'conversion rate optimization',
    'digital marketing Fort Wayne',
    'business consulting Fort Wayne',
    'small business growth consultant',
    'business operations consultant',
    'pricing strategy consultant',
    'custom website development',
    'custom coded websites',
    'business operations software',
    'custom CRM development',
    'business automation software',
    'Fort Wayne business agency',
    'Northeast Indiana marketing agency',
    'Fort Wayne creative agency',
    'Fort Wayne web development',
    'full service business agency',
    'cinema drone Fort Wayne',
    'drone videography Fort Wayne',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Sweet Dreams Solutions',
    imageUrl: `${SITE_URL}/og-image.png`,
    imageAlt: 'Sweet Dreams Solutions — Media Production, Marketing, Business Consulting & Software Development',
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
