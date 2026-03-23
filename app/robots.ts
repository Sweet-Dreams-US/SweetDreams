import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/profile', '/profile/*', '/profiles/*', '/api/*', '/admin/*', '/login', '/signup', '/auth/*', '/design-system'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/profile', '/profile/*', '/profiles/*', '/api/*', '/admin/*', '/login', '/signup', '/auth/*'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/profile', '/profile/*', '/profiles/*', '/api/*', '/admin/*', '/login', '/signup', '/auth/*'],
      },
      // AI crawlers - allow indexing for AI search (ChatGPT, Perplexity, etc.)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/profile', '/profile/*', '/profiles/*', '/api/*', '/admin/*', '/login', '/signup'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/profile', '/profile/*', '/profiles/*', '/api/*', '/admin/*', '/login', '/signup'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/profile', '/profile/*', '/profiles/*', '/api/*', '/admin/*', '/login', '/signup'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/profile', '/profile/*', '/profiles/*', '/api/*', '/admin/*', '/login', '/signup'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
