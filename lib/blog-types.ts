/**
 * Blog System Type Definitions
 * Sweet Dreams Business Academy Blog
 */

// ==================== CATEGORIES ====================

export const BLOG_CATEGORIES = {
  'media-production': {
    name: 'Media Production',
    slug: 'media-production',
    description: 'Video production, brand films, content creation, and visual storytelling for business growth.',
    icon: '🎬',
    color: '#c2185b',
    seoKeywords: ['video production', 'brand film', 'commercial video', 'content creation', 'business video', 'media production'],
  },
  'social-media': {
    name: 'Social Media',
    slug: 'social-media',
    description: 'Platform strategy, content creation, audience growth, and social media management for businesses.',
    icon: '📱',
    color: '#7b1fa2',
    seoKeywords: ['social media management', 'social media growth', 'content strategy', 'Instagram strategy', 'TikTok marketing'],
  },
  'web-development': {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Custom-coded websites, conversion optimization, technical SEO, and web performance.',
    icon: '💻',
    color: '#1565c0',
    seoKeywords: ['custom web development', 'website conversion', 'core web vitals', 'technical SEO', 'website optimization'],
  },
  'business-software': {
    name: 'Business Software',
    slug: 'business-software',
    description: 'Custom operations tools, business automation, CRM systems, and AI implementation.',
    icon: '⚙️',
    color: '#00838f',
    seoKeywords: ['business automation', 'custom software', 'CRM development', 'AI tools business', 'operations software'],
  },
  'marketing-strategy': {
    name: 'Marketing Strategy',
    slug: 'marketing-strategy',
    description: 'Digital marketing funnels, email automation, local SEO, and growth-focused marketing systems.',
    icon: '📈',
    color: '#2e7d32',
    seoKeywords: ['marketing funnel', 'email marketing', 'local SEO', 'lead generation', 'digital marketing strategy'],
  },
  'business-operations': {
    name: 'Business Operations',
    slug: 'business-operations',
    description: 'Systems, SOPs, delegation frameworks, and building businesses that scale without the founder.',
    icon: '🔧',
    color: '#ef6c00',
    seoKeywords: ['business operations', 'SOPs', 'business systems', 'delegation', 'scaling business'],
  },
  'business-growth': {
    name: 'Business Growth',
    slug: 'business-growth',
    description: 'Growth frameworks, offer creation, lead generation systems, and revenue architecture from the $100M playbook.',
    icon: '🚀',
    color: '#d32f2f',
    seoKeywords: ['business growth', 'offer creation', 'lead generation', 'pricing strategy', 'revenue growth', 'scaling'],
  },
  'branding': {
    name: 'Branding',
    slug: 'branding',
    description: 'Brand strategy, visual identity, storytelling, and building brands that command premium prices.',
    icon: '🎨',
    color: '#6a1b9a',
    seoKeywords: ['brand identity', 'brand strategy', 'visual branding', 'brand storytelling', 'brand development'],
  },
  'sales-closing': {
    name: 'Sales & Closing',
    slug: 'sales-closing',
    description: 'Sales psychology, consultative selling, pricing psychology, and closing frameworks for service businesses.',
    icon: '🤝',
    color: '#1a237e',
    seoKeywords: ['sales psychology', 'consultative selling', 'closing techniques', 'B2B sales', 'pricing psychology'],
  },
  'customer-retention': {
    name: 'Customer Retention',
    slug: 'customer-retention',
    description: 'Loyalty systems, lifetime value optimization, and turning customers into advocates.',
    icon: '🔄',
    color: '#004d40',
    seoKeywords: ['customer retention', 'customer loyalty', 'lifetime value', 'repeat business', 'customer experience'],
  },
  'financial-literacy': {
    name: 'Financial Literacy',
    slug: 'financial-literacy',
    description: 'Cash flow management, pricing for profit, financial foundations, and business finance essentials.',
    icon: '💰',
    color: '#827717',
    seoKeywords: ['business finance', 'cash flow management', 'pricing strategy', 'profit margins', 'financial literacy'],
  },
  'reputation-reviews': {
    name: 'Reputation & Reviews',
    slug: 'reputation-reviews',
    description: 'Online reputation management, Google reviews, testimonials, and building trust at scale.',
    icon: '⭐',
    color: '#ff8f00',
    seoKeywords: ['online reviews', 'Google reviews', 'reputation management', 'testimonials', 'social proof'],
  },
  'team-building': {
    name: 'Team Building',
    slug: 'team-building',
    description: 'Hiring, onboarding, delegation, culture design, and small business leadership.',
    icon: '👥',
    color: '#37474f',
    seoKeywords: ['hiring employees', 'team building', 'delegation', 'company culture', 'small business leadership'],
  },
  'networking-referrals': {
    name: 'Networking & Referrals',
    slug: 'networking-referrals',
    description: 'Referral systems, strategic partnerships, professional networking, and relationship-driven growth.',
    icon: '🔗',
    color: '#4e342e',
    seoKeywords: ['referral system', 'strategic partnerships', 'networking', 'business referrals', 'partnership strategy'],
  },
} as const;

export type BlogCategorySlug = keyof typeof BLOG_CATEGORIES;

// ==================== CONTENT BLOCKS ====================

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string; id: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'tip'; label: string; content: string; linkText?: string; linkHref?: string; variant?: 'default' | 'blue' | 'red' | 'yellow' }
  | { type: 'cta'; title: string; text: string; buttonText: string; buttonHref: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'stat'; value: string; label: string; source?: string }
  | { type: 'reference'; items: { text: string; url?: string }[] };

// ==================== BLOG POST ====================

export interface BlogPost {
  // Identity
  slug: string;
  title: string;
  excerpt: string;

  // Metadata
  date: string; // ISO date string YYYY-MM-DD
  updatedDate?: string;
  category: BlogCategorySlug;
  tags: string[];
  author: string;
  authorRole: string;
  readTime: string;
  published: boolean;

  // SEO
  metaTitle: string; // Under 60 chars
  metaDescription: string; // Under 155 chars
  seoKeywords: string[];

  // Content
  content: ContentBlock[];

  // Relationships
  relatedSlugs: string[];

  // Degree/Course mapping (for the curriculum structure)
  degree: string;
  course: string;
  chapter: number;
}

// ==================== HELPER FUNCTIONS ====================

export function getCategoryBySlug(slug: string) {
  return BLOG_CATEGORIES[slug as BlogCategorySlug] || null;
}

export function getAllCategories() {
  return Object.values(BLOG_CATEGORIES);
}

export function getCategorySlugs() {
  return Object.keys(BLOG_CATEGORIES) as BlogCategorySlug[];
}
