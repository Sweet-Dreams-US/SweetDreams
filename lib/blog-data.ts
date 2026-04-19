/**
 * Blog Data - Central registry for all blog posts
 * Imports from batch files and exports unified arrays
 */

import { BlogPost, BLOG_CATEGORIES, BlogCategorySlug } from './blog-types';

// Import batches
let allPosts: BlogPost[] = [];

// Dynamically concat batches - these will be created by the content agents
// Using try/catch pattern for graceful handling during build
function loadPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const batch1 = require('./blog-posts-batch1');
    posts.push(...batch1.blogPostsBatch1);
  } catch (e) {
    // Batch 1 not yet available
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const batch2 = require('./blog-posts-batch2');
    posts.push(...batch2.blogPostsBatch2);
  } catch (e) {
    // Batch 2 not yet available
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const batch3 = require('./blog-posts-batch3');
    posts.push(...batch3.blogPostsBatch3);
  } catch (e) {
    // Batch 3 not yet available
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const batch4 = require('./blog-posts-batch4');
    posts.push(...batch4.blogPostsBatch4);
  } catch (e) {
    // Batch 4 not yet available
  }

  return posts;
}

allPosts = loadPosts();

// ==================== QUERY FUNCTIONS ====================

/**
 * Get all published blog posts, sorted by date (newest first)
 */
export function getAllPosts(): BlogPost[] {
  return allPosts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find(post => post.slug === slug && post.published);
}

/**
 * Get posts by category
 */
export function getPostsByCategory(categorySlug: BlogCategorySlug): BlogPost[] {
  return getAllPosts().filter(post => post.category === categorySlug);
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter(post =>
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get related posts for a given post
 */
export function getRelatedPosts(post: BlogPost, limit: number = 3): BlogPost[] {
  // First try explicit related slugs
  const relatedBySlug = post.relatedSlugs
    .map(slug => getPostBySlug(slug))
    .filter((p): p is BlogPost => p !== undefined);

  if (relatedBySlug.length >= limit) {
    return relatedBySlug.slice(0, limit);
  }

  // Fill remaining with same-category posts
  const sameCategoryPosts = getPostsByCategory(post.category)
    .filter(p => p.slug !== post.slug && !post.relatedSlugs.includes(p.slug));

  return [...relatedBySlug, ...sameCategoryPosts].slice(0, limit);
}

/**
 * Get all unique tags across all posts
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPosts().forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}

/**
 * Get categories that have at least one published post
 */
export function getActiveCategories() {
  const categoriesWithPosts = new Set(getAllPosts().map(post => post.category));
  return Object.entries(BLOG_CATEGORIES)
    .filter(([slug]) => categoriesWithPosts.has(slug as BlogCategorySlug))
    .map(([, category]) => category);
}

/**
 * Get featured post (most recent or pinned)
 */
export function getFeaturedPost(): BlogPost | undefined {
  const posts = getAllPosts();
  return posts[0]; // Most recent published post
}

/**
 * Get all post slugs for static generation
 */
export function getAllPostSlugs(): string[] {
  return allPosts.filter(post => post.published).map(post => post.slug);
}

/**
 * Search posts by query string (searches title, excerpt, tags)
 */
export function searchPosts(query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase();
  return getAllPosts().filter(post =>
    post.title.toLowerCase().includes(lowerQuery) ||
    post.excerpt.toLowerCase().includes(lowerQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    post.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get previous and next posts for navigation
 */
export function getAdjacentPosts(slug: string): { prev: BlogPost | null; next: BlogPost | null } {
  const posts = getAllPosts();
  const index = posts.findIndex(post => post.slug === slug);

  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

/**
 * Get post count per category
 */
export function getPostCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  getAllPosts().forEach(post => {
    counts[post.category] = (counts[post.category] || 0) + 1;
  });
  return counts;
}
