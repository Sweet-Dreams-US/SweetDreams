import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  const disallowed = ['/profile', '/profile/*', '/profiles/*', '/api/*', '/admin/*', '/login', '/signup', '/auth/*', '/design-system'];

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: disallowed },
      { userAgent: 'Googlebot', allow: '/', disallow: disallowed },
      { userAgent: 'Bingbot', allow: '/', disallow: disallowed },
      { userAgent: 'DuckDuckBot', allow: '/', disallow: disallowed },
      // OpenAI
      { userAgent: 'GPTBot', allow: '/', disallow: disallowed },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: disallowed },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: disallowed },
      // Anthropic
      { userAgent: 'ClaudeBot', allow: '/', disallow: disallowed },
      { userAgent: 'anthropic-ai', allow: '/', disallow: disallowed },
      { userAgent: 'Claude-Web', allow: '/', disallow: disallowed },
      // Perplexity
      { userAgent: 'PerplexityBot', allow: '/', disallow: disallowed },
      // Google AI (Gemini)
      { userAgent: 'Google-Extended', allow: '/', disallow: disallowed },
      { userAgent: 'GoogleOther', allow: '/', disallow: disallowed },
      // Meta (Llama)
      { userAgent: 'Meta-ExternalAgent', allow: '/', disallow: disallowed },
      { userAgent: 'FacebookBot', allow: '/', disallow: disallowed },
      // Apple Intelligence
      { userAgent: 'Applebot', allow: '/', disallow: disallowed },
      { userAgent: 'Applebot-Extended', allow: '/', disallow: disallowed },
      // xAI (Grok)
      { userAgent: 'xAI-Grok', allow: '/', disallow: disallowed },
      // Common Crawl (feeds GPT, Llama, many models)
      { userAgent: 'CCBot', allow: '/', disallow: disallowed },
      // Other AI
      { userAgent: 'Amazonbot', allow: '/', disallow: disallowed },
      { userAgent: 'DuckAssistBot', allow: '/', disallow: disallowed },
      { userAgent: 'Bytespider', allow: '/', disallow: disallowed },
      { userAgent: 'cohere-ai', allow: '/', disallow: disallowed },
      { userAgent: 'YouBot', allow: '/', disallow: disallowed },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
