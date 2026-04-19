import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../blog.module.css";
import { SITE_URL } from "@/lib/constants";
import { getPostsByCategory, getPostCountByCategory } from "@/lib/blog-data";
import { BLOG_CATEGORIES, BlogCategorySlug, getCategorySlugs } from "@/lib/blog-types";

export async function generateStaticParams() {
  return getCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = BLOG_CATEGORIES[category as BlogCategorySlug];

  if (!cat) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${cat.name} | Sweet Dreams Blog`,
    description: cat.description,
    keywords: cat.seoKeywords.join(", "),
    alternates: {
      canonical: `${SITE_URL}/blog/category/${cat.slug}`,
    },
    openGraph: {
      title: `${cat.name} | Sweet Dreams Blog`,
      description: cat.description,
      url: `${SITE_URL}/blog/category/${cat.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = BLOG_CATEGORIES[category as BlogCategorySlug];

  if (!cat) {
    notFound();
  }

  const posts = getPostsByCategory(category as BlogCategorySlug);
  const allCategories = Object.values(BLOG_CATEGORIES);
  const postCounts = getPostCountByCategory();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href="/blog">Blog</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span>{cat.name}</span>
          </div>
          <h1 className={styles.heroTitle}>{cat.icon} {cat.name.toUpperCase()}</h1>
          <p className={styles.heroSubtitle}>{cat.description}</p>
        </div>
      </section>

      {/* Category Filters */}
      <section className={styles.filterSection}>
        <div className={styles.filterContainer}>
          <div className={styles.categoryFilters}>
            <Link href="/blog" className={styles.categoryFilter}>
              All
            </Link>
            {allCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/blog/category/${c.slug}`}
                className={c.slug === category ? styles.categoryFilterActive : styles.categoryFilter}
              >
                {c.name}
                {postCounts[c.slug] ? ` (${postCounts[c.slug]})` : ''}
              </Link>
            ))}
          </div>
          <div className={styles.resultsCount}>
            {posts.length} article{posts.length !== 1 ? 's' : ''} in {cat.name}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className={styles.blogSection}>
        <div className={styles.container}>
          {posts.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Coming Soon</p>
              <p className={styles.emptySubtext}>
                Articles on {cat.name.toLowerCase()} are in the works. Check back soon or explore other categories.
              </p>
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {posts.map((post) => (
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

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>READY TO GROW?</h2>
          <p className={styles.ctaText}>
            Book a call with Fort Wayne&apos;s business media agency.
            We turn strategy into execution.
          </p>
          <Link href="/book" className={styles.ctaButton}>
            BOOK A CALL
          </Link>
        </div>
      </section>
    </div>
  );
}
