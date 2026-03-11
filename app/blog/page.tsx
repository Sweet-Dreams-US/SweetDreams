import type { Metadata } from "next";
import Link from "next/link";
import styles from "./blog.module.css";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog | Sweet Dreams - Business Media Tips & Industry Insights",
  description: "Expert insights on commercial video production, brand storytelling, web development, and social media growth for businesses. Tips and strategies from Fort Wayne's premier business media agency.",
  keywords: "business video production blog, brand film tips, commercial video tutorials, social media marketing tips, web development blog, Fort Wayne business media, videography tips, content creation guide, digital marketing insights, business growth strategies",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | Sweet Dreams Business Media",
    description: "Tips and insights on commercial video production, brand films, web development, and social media growth from Fort Wayne's business media experts.",
    url: `${SITE_URL}/blog`,
    type: "website",
    images: [
      {
        url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png',
        width: 1200,
        height: 630,
        alt: 'Sweet Dreams Business Media Blog',
      },
    ],
  },
};

// Blog posts data - business-focused content
const blogPosts = [
  {
    slug: "why-every-business-needs-brand-video-2025",
    title: "Why Every Business Needs a Brand Video in 2025",
    excerpt: "Brand video is no longer optional. Learn how businesses are using cinematic storytelling to build trust, increase conversions, and stand out in a crowded market.",
    date: "2025-02-12",
    category: "Brand Films",
    readTime: "8 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/DSC00545.webp",
    published: true,
  },
  {
    slug: "commercial-video-roi-guide",
    title: "The ROI of Commercial Video Production: What Businesses Need to Know",
    excerpt: "How to measure the return on investment of your commercial video content. Real data, real strategies, and the metrics that actually matter for business growth.",
    date: "2025-02-08",
    category: "Video Strategy",
    readTime: "9 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/DSC00488.webp",
    published: true,
  },
  {
    slug: "social-media-content-strategy-small-business",
    title: "Social Media Content Strategy for Small Businesses: A Complete Guide",
    excerpt: "Stop posting randomly and start growing. A step-by-step content strategy framework designed for small businesses that want real social media results.",
    date: "2025-01-20",
    category: "Social Media",
    readTime: "10 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/DSC00530.webp",
    published: true,
  },
  {
    slug: "website-conversion-optimization-tips",
    title: "7 Website Conversion Tips That Turn Visitors Into Customers",
    excerpt: "Your website gets traffic but no leads? These 7 proven conversion optimization techniques will transform your site into a lead-generating machine.",
    date: "2025-01-18",
    category: "Web Development",
    readTime: "8 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0538.webp",
    published: true,
  },
  {
    slug: "5-video-marketing-mistakes-businesses-make",
    title: "5 Video Marketing Mistakes That Are Costing Your Business Money",
    excerpt: "Stop wasting your video budget. Learn the five critical mistakes businesses make with video marketing and how to avoid them.",
    date: "2025-01-16",
    category: "Video Marketing",
    readTime: "9 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/DSC00501.webp",
    published: true,
  },
  {
    slug: "building-business-brand-identity",
    title: "Building a Brand Identity That Stands Out: A Business Owner's Guide",
    excerpt: "Your brand is more than a logo. Learn how to build a complete brand identity that resonates with your target audience and drives business growth.",
    date: "2025-01-14",
    category: "Branding",
    readTime: "11 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0617.webp",
    published: true,
  },
];

export default function BlogPage() {
  // Filter to only show published posts
  const publishedPosts = blogPosts.filter(post => post.published);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>BLOG</h1>
          <p className={styles.heroSubtitle}>
            Business Media Insights, Video Marketing Tips & Growth Strategies
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className={styles.blogSection}>
        <div className={styles.container}>
          {publishedPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Coming Soon</p>
              <p className={styles.emptySubtext}>
                We&apos;re working on bringing you valuable content about business media,
                video marketing, and growth strategies. Check back soon!
              </p>
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {publishedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={styles.postCard}
                >
                  <div className={styles.postImage}>
                    <img src={post.image} alt={post.title} />
                    <div className={styles.postCategory}>{post.category}</div>
                  </div>
                  <div className={styles.postContent}>
                    <div className={styles.postMeta}>
                      <span className={styles.postDate}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className={styles.postReadTime}>{post.readTime}</span>
                    </div>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <div className={styles.readMore}>
                      Read Article &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <h2 className={styles.categoriesTitle}>EXPLORE BY CATEGORY</h2>
          <div className={styles.categoriesGrid}>
            <div className={styles.categoryCard}>
              <h3>Video Marketing</h3>
              <p>Commercial and brand video strategies</p>
            </div>
            <div className={styles.categoryCard}>
              <h3>Social Media</h3>
              <p>Growth tactics and content strategies</p>
            </div>
            <div className={styles.categoryCard}>
              <h3>Web Development</h3>
              <p>Website optimization and conversion tips</p>
            </div>
            <div className={styles.categoryCard}>
              <h3>Branding</h3>
              <p>Brand identity and business positioning</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>READY TO GROW?</h2>
          <p className={styles.ctaText}>
            Book a call with Fort Wayne&apos;s premier business media agency
          </p>
          <Link href="/book" className={styles.ctaButton}>
            BOOK A CALL
          </Link>
        </div>
      </section>
    </div>
  );
}
