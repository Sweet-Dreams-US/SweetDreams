import type { Metadata } from "next";
import Link from "next/link";
import styles from "./blog.module.css";
import { SITE_URL } from "@/lib/constants";
import { getAllPosts, getFeaturedPost, getActiveCategories, getPostCountByCategory } from "@/lib/blog-data";
import { BLOG_CATEGORIES, BlogCategorySlug } from "@/lib/blog-types";

export const metadata: Metadata = {
  title: "Blog | Sweet Dreams - Business Growth Insights & Strategies",
  description: "Expert insights on video production, web development, marketing funnels, business growth frameworks, social media strategy, and operations. Actionable knowledge for business owners.",
  keywords: "business blog, video production tips, web development blog, marketing strategy, social media growth, business growth, Alex Hormozi, Fort Wayne business, media production, SEO tips, business operations",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | Sweet Dreams Business Academy",
    description: "Actionable business insights on media production, web development, marketing strategy, and growth frameworks from Fort Wayne's business media experts.",
    url: `${SITE_URL}/blog`,
    type: "website",
    images: [
      {
        url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png',
        width: 1200,
        height: 630,
        alt: 'Sweet Dreams Business Blog',
      },
    ],
  },
};

// JSON-LD structured data for the blog
function BlogSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Sweet Dreams Business Blog",
    "description": "Expert insights on media production, web development, marketing strategy, and business growth frameworks.",
    "url": `${SITE_URL}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "Sweet Dreams",
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function BlogPage() {
  const posts = getAllPosts();
  const featuredPost = getFeaturedPost();
  const activeCategories = getActiveCategories();
  const postCounts = getPostCountByCategory();
  const allCategories = Object.values(BLOG_CATEGORIES);

  return (
    <div className={styles.page}>
      <BlogSchema />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span>Blog</span>
          </div>
          <h1 className={styles.heroTitle}>THE BLOG</h1>
          <p className={styles.heroSubtitle}>
            Business growth strategies, media production insights, web development deep-dives,
            and operational frameworks. No fluff. Just actionable knowledge that moves the needle.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className={styles.filterSection}>
        <div className={styles.filterContainer}>
          <div className={styles.categoryFilters}>
            <Link href="/blog" className={styles.categoryFilterActive}>
              All
            </Link>
            {allCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className={styles.categoryFilter}
              >
                {category.name}
                {postCounts[category.slug] ? ` (${postCounts[category.slug]})` : ''}
              </Link>
            ))}
          </div>
          <div className={styles.resultsCount}>
            {posts.length} article{posts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className={styles.featuredSection}>
          <div className={styles.featuredContainer}>
            <div className={styles.featuredLabel}>Latest Article</div>
            <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredCard}>
              <div className={styles.featuredContent}>
                <div className={styles.featuredCategory}>
                  {BLOG_CATEGORIES[featuredPost.category]?.name || featuredPost.category}
                </div>
                <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                <div className={styles.featuredMeta}>
                  <span>{new Date(featuredPost.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className={styles.blogSection}>
        <div className={styles.container}>
          {posts.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Coming Soon</p>
              <p className={styles.emptySubtext}>
                We&apos;re building a comprehensive business knowledge base.
                Check back soon for actionable content on media, marketing, and growth.
              </p>
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {posts.slice(featuredPost ? 1 : 0).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={styles.postCard}
                >
                  <div className={styles.postCardContent}>
                    <div className={styles.postCategory}>
                      {BLOG_CATEGORIES[post.category]?.name || post.category}
                    </div>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <div className={styles.postMeta}>
                      <span>{new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                      <span className={styles.readMore}>Read &rarr;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Overview */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>EXPLORE BY CATEGORY</h2>
          <p className={styles.sectionSubtitle}>
            14 knowledge domains. 65 courses. 359 topics. Your business education starts here.
          </p>
          <div className={styles.categoriesGrid}>
            {allCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className={styles.categoryCard}
              >
                <div className={styles.categoryIcon}>{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                {postCounts[category.slug] && (
                  <div className={styles.categoryPostCount}>
                    {postCounts[category.slug]} article{postCounts[category.slug] !== 1 ? 's' : ''}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>READY TO APPLY WHAT YOU&apos;VE LEARNED?</h2>
          <p className={styles.ctaText}>
            Book a call with our team. We&apos;ll help you implement these strategies
            with professional media production, custom web development, and growth systems.
          </p>
          <Link href="/book" className={styles.ctaButton}>
            BOOK A CALL
          </Link>
        </div>
      </section>
    </div>
  );
}
