/**
 * Service landing pages — one proper landing page per pillar, in the funnel
 * style. Hero (fade + ghost word + bold title) → PROOF OF WORK (real
 * portfolio pieces, not a feature list) → closing CTA. No "everything under
 * one roof" list, no trusted-by band.
 */

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';
export const proofPoster = (videoId: string, time = '2s') =>
  `${CF}/${videoId}/thumbnails/thumbnail.jpg?time=${time}&height=600`;

export interface ProofItem {
  videoId: string;
  time?: string;
  label: string;
  tag: string;
  href: string;
}

export interface ServiceData {
  slug: string;
  name: string;
  accentClass: 'svcRed' | 'svcYellow' | 'svcBlue' | 'svcGreen';
  kicker: string;
  headline: string;
  headlineAccent: string;
  subhead: string;
  offerings: string[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  proofHeading: string;
  proof: ProofItem[];
  proofMore: { label: string; href: string };
  closingHeadline: string;
  closingSub: string;
  closingCta: { label: string; href: string };
  metaTitle: string;
  metaDescription: string;
}

export const SERVICES: Record<string, ServiceData> = {
  'media-production': {
    slug: 'media-production',
    name: 'Media Production',
    accentClass: 'svcRed',
    kicker: 'Media Production',
    headline: 'People remember what they',
    headlineAccent: 'see.',
    subhead:
      "Brand films, commercials, social video, aerial, and event coverage — cinema cameras, full post, and stories built to sell. We don't make videos. We grow businesses.",
    offerings: ['Brand Films', 'Commercials', 'Social Content', 'Aerial & Drone', 'Event Coverage', 'Recruiting Video'],
    primaryCta: { label: 'Start a Project', href: '/book' },
    secondaryCta: { label: 'See All Work', href: '/work?filter=business' },
    proofHeading: 'Proof, not promises.',
    proof: [
      { videoId: '66f28edb4b5c20354896a437b7be5220', time: '5s', label: 'Nissan of Elgin', tag: 'Acquisition Recap', href: '/work/nissan-elgin-acquisition-recap' },
      { videoId: '7943215ed685238e8ca63bc3617f807d', time: '8s', label: 'Coleman — Back to the Future', tag: 'Commercial', href: '/work/coleman-back-to-the-future-commercial' },
      { videoId: 'd08682649901944d9bbec1dcfb8bde88', time: '89s', label: 'The Coleman Prime Story', tag: 'Brand Trailer', href: '/work/the-coleman-prime-story' },
      { videoId: 'cd386f606ba61022ba3e608f684b3c80', time: '15s', label: 'Breastie Box', tag: 'Brand Film', href: '/work/breastie-box-brand-film' },
      { videoId: 'a03f0e00cd2fda4a43464adec197c0b6', time: '5s', label: 'M.O.M.', tag: 'Nonprofit Film', href: '/work/mom-nonprofit-brand-film' },
      { videoId: 'd8719a81b378ac68b2c64e1cd2819a3e', time: '5s', label: 'Fort Wayne State of the City', tag: 'Event Coverage', href: '/work/fort-wayne-state-of-the-city' },
    ],
    proofMore: { label: 'See all our work', href: '/work?filter=business' },
    closingHeadline: 'Ready to be impossible to ignore?',
    closingSub: 'One shoot can carry your brand for months. Let’s make it.',
    closingCta: { label: 'Book a Call', href: '/book' },
    metaTitle: 'Media Production — Brand Films, Commercials & Social Video | Sweet Dreams',
    metaDescription:
      'Cinematic brand films, commercials, social video, aerial, and event coverage. Shot on cinema cameras and cut in-house by Sweet Dreams Solutions.',
  },

  'web-software': {
    slug: 'web-software',
    name: 'Web & Software',
    accentClass: 'svcBlue',
    kicker: 'Web & Software',
    headline: 'Your first handshake, and your',
    headlineAccent: 'back office.',
    subhead:
      'Hand-coded websites and custom software — no templates, no bloat, no subscription traps. And every finished site ships with professional photo and video of your business.',
    offerings: ['Custom Websites', 'Web Apps', 'E-Commerce', 'Custom Software', 'Automation & AI', 'SEO & Speed'],
    primaryCta: { label: 'Get a Free Site', href: '/free-website' },
    secondaryCta: { label: 'See Our Sites', href: '/work#websites' },
    proofHeading: 'Sites we’ve shipped.',
    proof: [
      { videoId: '1ab82de79e003fc0c37afc0a27fedbc4', label: 'MC Racing', tag: 'mcracingfortwayne.com', href: '/work/web-mcracing' },
      { videoId: '652911e44eafee84d9efa47dad31eac5', label: 'Prime Dealer Fund', tag: 'primedealerfund.com', href: '/work/web-primedealerfund' },
      { videoId: '37a027a19196653d4ef79b6c2f5f5758', label: 'Creator Space', tag: 'creatorspacefw.com', href: '/work/web-creatorspace' },
      { videoId: '4db4384638b438d0f2c3fb9b60a48606', label: 'MindSquire', tag: 'mindsquire.com', href: '/work/web-mindsquire' },
      { videoId: '33850e02411be4ba7cb880ef7af52dce', label: 'Industrial Bakery', tag: 'industrialbakeryequipment.com', href: '/work/web-industrialbakery' },
      { videoId: '2e09ff39e945e08cf28ced40197bf836', label: 'Sweet Dreams', tag: 'sweetdreams.us', href: '/work/web-sweetdreams' },
    ],
    proofMore: { label: 'See all our sites', href: '/work#websites' },
    closingHeadline: 'See it before you pay a dollar.',
    closingSub: 'Tell us about your business and we’ll build a real, clickable site for free — media included.',
    closingCta: { label: 'Get My Free Site', href: '/free-website' },
    metaTitle: 'Web & Software — Hand-Coded Sites & Custom Software | Sweet Dreams',
    metaDescription:
      'Hand-coded websites, web apps, and custom software — no templates, no subscription traps. Every site ships with professional media. Sweet Dreams Solutions.',
  },

  marketing: {
    slug: 'marketing',
    name: 'Marketing',
    accentClass: 'svcYellow',
    kicker: 'Marketing',
    headline: 'The best-marketed business',
    headlineAccent: 'wins.',
    subhead:
      'Full-funnel strategy, Google & Meta Ads, local SEO, and email — built to measure, not just run. We put you in front of the people ready to buy.',
    offerings: ['Google & Meta Ads', 'Local SEO', 'Email Automation', 'Social Management', 'Funnels & CRO', 'Reporting'],
    primaryCta: { label: 'Get a Plan', href: '/book' },
    secondaryCta: { label: 'See the Work', href: '/work?filter=business' },
    proofHeading: 'Campaigns that moved the needle.',
    proof: [
      { videoId: '7943215ed685238e8ca63bc3617f807d', time: '8s', label: 'Coleman Oil-Change Campaign', tag: 'Paid Social Ad', href: '/work/coleman-back-to-the-future-commercial' },
      { videoId: '313f0b9be3d81f11e7d239fd08a34d38', time: '8s', label: 'Coleman Hiring Funnel', tag: 'Recruiting Ads', href: '/work/coleman-onboarding-series' },
      { videoId: '7d5f758e9ad94d17703b2f7842ca309b', label: 'Cinema Drone', tag: 'Lead-Gen Ad', href: '/work/cinema-drone-ad' },
      { videoId: '66f28edb4b5c20354896a437b7be5220', time: '5s', label: 'Nissan of Elgin Launch', tag: 'Announcement', href: '/work/nissan-elgin-acquisition-recap' },
      { videoId: '62ea7c66a3ad77eadd83bd89c01f98c2', label: 'Revive Gym Content', tag: 'Social Reel', href: '/content-roadmap' },
      { videoId: 'cd386f606ba61022ba3e608f684b3c80', time: '15s', label: 'Breastie Box Campaign', tag: 'Nonprofit Push', href: '/work/breastie-box-brand-film' },
    ],
    proofMore: { label: 'See all our work', href: '/work?filter=business' },
    closingHeadline: 'Stop guessing. Start measuring.',
    closingSub: 'We’ll build the plan that turns spend into customers.',
    closingCta: { label: 'Book a Call', href: '/book' },
    metaTitle: 'Marketing — Ads, Local SEO & Full-Funnel Strategy | Sweet Dreams',
    metaDescription:
      'Full-funnel marketing: Google & Meta Ads, local SEO, email automation, and social media built to measure. Sweet Dreams Solutions.',
  },

  consulting: {
    slug: 'consulting',
    name: 'Consulting',
    accentClass: 'svcGreen',
    kicker: 'Strategy & Consulting',
    headline: 'Strategy turns effort into',
    headlineAccent: 'momentum.',
    subhead:
      'Brand positioning, offer and pricing design, operations, and scaling systems. We find the bottleneck holding you back — then build the system that breaks it.',
    offerings: ['Growth Strategy', 'Offer & Pricing', 'Operations & SOPs', 'Scaling Systems', 'Content Systems', 'Partnerships'],
    primaryCta: { label: 'Book a Call', href: '/book' },
    secondaryCta: { label: 'Partner With Us', href: '/partnerships' },
    proofHeading: 'Brands we’ve built with.',
    proof: [
      { videoId: 'd08682649901944d9bbec1dcfb8bde88', time: '89s', label: 'Coleman Prime', tag: 'Positioning & Story', href: '/work/the-coleman-prime-story' },
      { videoId: '652911e44eafee84d9efa47dad31eac5', label: 'Prime Dealer Fund', tag: 'Brand + Platform', href: '/work/web-primedealerfund' },
      { videoId: '66f28edb4b5c20354896a437b7be5220', time: '5s', label: 'Nissan of Elgin', tag: 'Growth Story', href: '/work/nissan-elgin-acquisition-recap' },
      { videoId: '313f0b9be3d81f11e7d239fd08a34d38', time: '8s', label: 'Coleman Onboarding', tag: 'Hiring Systems', href: '/work/coleman-onboarding-series' },
      { videoId: 'cd386f606ba61022ba3e608f684b3c80', time: '15s', label: 'Breastie Box', tag: 'Nonprofit Brand', href: '/work/breastie-box-brand-film' },
      { videoId: '1ab82de79e003fc0c37afc0a27fedbc4', label: 'MC Racing', tag: 'Full Build', href: '/work/web-mcracing' },
    ],
    proofMore: { label: 'See all our work', href: '/work?filter=business' },
    closingHeadline: 'What’s the one bottleneck holding you back?',
    closingSub: 'Let’s find it on a call — and build the system that breaks it.',
    closingCta: { label: 'Book a Call', href: '/book' },
    metaTitle: 'Consulting — Growth Strategy, Operations & Scaling | Sweet Dreams',
    metaDescription:
      'Business consulting: growth strategy, offer and pricing design, operations, and scaling systems. Frameworks that compound. Sweet Dreams Solutions.',
  },
};

export const SERVICE_SLUGS = Object.keys(SERVICES);
