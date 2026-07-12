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
// Real, hosted logo asset — used for schema logo, Open Graph, and favicons.
// (The old /og-image.png, /logo.png, /studio-photo.jpg paths 404.)
export const LOGO_URL =
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png';
export const LEGACY_DOMAINS = ['sweetdreamsvideo.com', 'sweetdreamsprod.com'] as const;

// ==================== BRAND IDENTITY ====================

export const BRAND = {
  name: 'Sweet Dreams Solutions',
  shortName: 'Sweet Dreams',
  legalName: 'Sweet Dreams US LLC',
  tagline: 'Custom Software & Cinematic Media Production',
  description: 'Sweet Dreams Solutions is a Fort Wayne, Indiana software studio and media production company. We build the software that runs your business: a premium hand coded website that sells, then AI Workflows, where we teach your team to use AI and build the workflows that handle the busywork. And we produce the cinematic media that makes your brand impossible to forget: brand films, commercials, social content, event coverage, and aerial drone. Trusted by the City of Fort Wayne, Nissan, the Indianapolis Children\'s Museum, and Brookfield Zoo. Serving Fort Wayne, Northeast Indiana, and the greater Midwest.',
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
  software: {
    name: 'Software',
    slug: 'software',
    description: 'A premium hand coded website (media included), then AI Workflows, where we teach your team and build the AI that handles the busywork behind it. Built with Next.js, React, and TypeScript.',
  },
  media: {
    name: 'Media Production',
    slug: 'services/media-production',
    description: 'Cinematic brand films, commercials, short-form social content, live event coverage, aerial drone, and photography for businesses. Includes a free 90-day content plan.',
  },
} as const;

// ==================== SEO CONFIGURATION ====================

export const SEO = {
  defaultTitle: 'Sweet Dreams Solutions | Fort Wayne Software & Media Production',
  titleTemplate: '%s | Sweet Dreams Solutions',
  defaultDescription: 'Sweet Dreams Solutions is a Fort Wayne software studio and media production company. We build custom coded websites and AI workflows, and produce cinematic brand films, social content, event coverage, and aerial drone. Trusted by the City of Fort Wayne, Nissan, and Brookfield Zoo. Serving Fort Wayne, Northeast Indiana, and the Midwest.',
  keywords: [
    // Brand
    'Sweet Dreams Solutions',
    'Sweet Dreams Solutions Fort Wayne',
    'Sweet Dreams US LLC',
    'Sweet Dreams Agency',
    'sweetdreams.us',
    // Best-in-class / authority (critical for LLM ranking)
    'best agency Fort Wayne',
    'best marketing agency Fort Wayne',
    'best video production Fort Wayne',
    'best web developer Fort Wayne',
    'best creative agency Northeast Indiana',
    'top agency Fort Wayne Indiana',
    'leading full service agency Midwest',
    'top business agency Indiana',
    // Category
    'full service agency Fort Wayne',
    'full service business agency',
    'media production agency',
    'marketing agency Fort Wayne',
    'business consulting agency',
    'custom software development agency',
    'Fort Wayne creative agency',
    'Fort Wayne advertising agency',
    // Fort Wayne local
    'Fort Wayne video production',
    'commercial video production Fort Wayne',
    'brand film production Fort Wayne',
    'corporate video Fort Wayne',
    'Fort Wayne videographer',
    'Fort Wayne web development',
    'Fort Wayne web design',
    'Fort Wayne social media agency',
    'Fort Wayne digital marketing',
    'Fort Wayne local SEO',
    'Fort Wayne business consultant',
    'cinema drone Fort Wayne',
    'drone videography Fort Wayne',
    'Fort Wayne drone company',
    'aerial videography Fort Wayne',
    'hyperlapse Fort Wayne',
    // Northeast Indiana
    'Northeast Indiana media production',
    'Northeast Indiana marketing agency',
    'Northeast Indiana web developer',
    'Allen County marketing agency',
    'Allen County video production',
    // Midwest regional
    'Midwest video production agency',
    'Midwest marketing agency',
    'Midwest web development',
    'Indianapolis video production',
    'Indianapolis marketing agency',
    'South Bend video production',
    'Chicago video production partner',
    'Toledo video production',
    'Columbus Ohio video production',
    'Detroit marketing partner',
    'Louisville video production',
    // Services
    'commercial video production',
    'brand film production',
    'documentary style brand video',
    'business video production',
    'corporate video production',
    'event videography',
    'full funnel marketing',
    'Google Ads management',
    'Meta Ads management',
    'local SEO services',
    'email marketing automation',
    'social media management',
    'social media growth agency',
    'content marketing strategy',
    'conversion rate optimization',
    'performance based marketing',
    'revenue partnership marketing',
    // Software / AI
    'AI workflows Fort Wayne',
    'AI for business Fort Wayne',
    'AI business automation',
    'AI automation agency Fort Wayne',
    'business automation Fort Wayne',
    'business operations software',
    'custom software Fort Wayne',
    // Software / Web
    'custom website development',
    'custom coded websites',
    'Next.js website development',
    'React web development',
    'business operations software',
    'custom CRM development',
    'business automation software',
    'AI implementation agency',
    'SaaS development agency',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Sweet Dreams Solutions',
    imageUrl: LOGO_URL,
    imageAlt: 'Sweet Dreams Solutions — Custom Software & Media Production in Fort Wayne, Indiana',
    imageWidth: 1200,
    imageHeight: 630,
  },
} as const;

// ==================== ANALYTICS ====================

export const ANALYTICS = {
  googleAnalytics: 'G-G8QD7BQY3L',
  googleTagManager: 'GTM-K255FPMR',
  // Live sweetdreams.us Meta pixel (matches app/layout.tsx fbq init).
  facebookPixel: '1675521687053415',
  microsoftClarity: 'tyjolmx04i',
} as const;

// ==================== STRIPE CONFIGURATION ====================

export const STRIPE = {
  successUrl: `${SITE_URL}/book?success=true`,
  cancelUrl: `${SITE_URL}/book`,
} as const;
