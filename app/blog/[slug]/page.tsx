import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./blog-post.module.css";
import { SITE_URL, BRAND } from "@/lib/constants";
import { getPostBySlug, getRelatedPosts, getAdjacentPosts, getAllPostSlugs } from "@/lib/blog-data";
import { BLOG_CATEGORIES, ContentBlock } from "@/lib/blog-types";
import ScrollTOC from "@/components/blog/ScrollTOC";

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Dynamic metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.seoKeywords.join(", "),
    authors: [{ name: post.author }],
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedDate || post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

// Extract headings for Table of Contents
function getHeadings(content: ContentBlock[]): { id: string; text: string; level: number }[] {
  return content
    .filter((block): block is Extract<ContentBlock, { type: "heading" }> => block.type === "heading")
    .map((block) => ({ id: block.id, text: block.text, level: block.level }));
}

// Parse inline markdown links [text](/url) to JSX
function parseInlineLinks(text: string): React.ReactNode[] {
  const parts = text.split(/(\[([^\]]+)\]\(([^)]+)\))/g);
  const nodes: React.ReactNode[] = [];

  let i = 0;
  while (i < parts.length) {
    if (i + 3 < parts.length && parts[i + 1] && parts[i + 1].startsWith("[")) {
      // Text before the link
      if (parts[i]) nodes.push(parts[i]);
      // The link itself
      const linkText = parts[i + 2];
      const linkHref = parts[i + 3];
      const isExternal = linkHref.startsWith("http");
      nodes.push(
        <Link
          key={`link-${i}`}
          href={linkHref}
          {...(isExternal ? { target: "_blank", rel: "noopener" } : {})}
        >
          {linkText}
        </Link>
      );
      i += 4;
    } else {
      if (parts[i]) {
        // Parse bold text **text**
        const boldParts = parts[i].split(/(\*\*[^*]+\*\*)/g);
        boldParts.forEach((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            nodes.push(<strong key={`bold-${i}-${j}`}>{part.slice(2, -2)}</strong>);
          } else if (part) {
            nodes.push(part);
          }
        });
      }
      i += 1;
    }
  }

  return nodes;
}

// Render a content block
function ContentBlockRenderer({ block, index }: { block: ContentBlock; index: number }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className={styles.contentParagraph}>
          {parseInlineLinks(block.text)}
        </p>
      );

    case "heading":
      if (block.level === 2) {
        return <h2 id={block.id} className={styles.contentH2}>{block.text}</h2>;
      }
      return <h3 id={block.id} className={styles.contentH3}>{block.text}</h3>;

    case "list":
      if (block.ordered) {
        return (
          <ol className={styles.orderedList}>
            {block.items.map((item, i) => (
              <li key={i} className={styles.listItem}>{parseInlineLinks(item)}</li>
            ))}
          </ol>
        );
      }
      return (
        <ul className={styles.unorderedList}>
          {block.items.map((item, i) => (
            <li key={i} className={styles.listItem}>{parseInlineLinks(item)}</li>
          ))}
        </ul>
      );

    case "tip":
      return (
        <div className={`${styles.tipBox} ${block.variant ? styles[`tip${block.variant.charAt(0).toUpperCase() + block.variant.slice(1)}`] : ''}`}>
          <div className={styles.tipLabel}>{block.label}</div>
          <div className={styles.tipContent}>{parseInlineLinks(block.content)}</div>
          {block.linkText && block.linkHref && (
            <Link href={block.linkHref} className={styles.tipButton}>
              {block.linkText}
            </Link>
          )}
        </div>
      );

    case "cta":
      return (
        <div className={styles.inlineCta}>
          <h3 className={styles.inlineCtaTitle}>{block.title}</h3>
          <p className={styles.inlineCtaText}>{block.text}</p>
          <Link href={block.buttonHref} className={styles.inlineCtaButton}>
            {block.buttonText}
          </Link>
        </div>
      );

    case "stat":
      return (
        <div className={styles.statBlock}>
          <div className={styles.statValue}>{block.value}</div>
          <div className={styles.statLabel}>{block.label}</div>
          {block.source && <div className={styles.statSource}>{block.source}</div>}
        </div>
      );

    case "quote":
      return (
        <blockquote className={styles.quoteBlock}>
          <p className={styles.quoteText}>&ldquo;{block.text}&rdquo;</p>
          {block.attribution && (
            <cite className={styles.quoteAttribution}>&mdash; {block.attribution}</cite>
          )}
        </blockquote>
      );

    case "reference":
      return (
        <div className={styles.referencesSection}>
          <h3 className={styles.referencesTitle}>References</h3>
          <ol className={styles.referencesList}>
            {block.items.map((ref, i) => (
              <li key={i} className={styles.referenceItem}>
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer">
                    {ref.text}
                  </a>
                ) : (
                  ref.text
                )}
              </li>
            ))}
          </ol>
        </div>
      );

    default:
      return null;
  }
}

// JSON-LD structured data for blog post
function BlogPostSchema({ post }: { post: ReturnType<typeof getPostBySlug> }) {
  if (!post) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.metaDescription,
    "url": `${SITE_URL}/blog/${post.slug}`,
    "datePublished": post.date,
    "dateModified": post.updatedDate || post.date,
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": SITE_URL,
    },
    "publisher": {
      "@type": "Organization",
      "name": BRAND.legalName,
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    "keywords": post.seoKeywords.join(", "),
    "articleSection": BLOG_CATEGORIES[post.category]?.name,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = getHeadings(post.content);
  const relatedPosts = getRelatedPosts(post, 3);
  const { prev, next } = getAdjacentPosts(slug);
  const category = BLOG_CATEGORIES[post.category];

  return (
    <div className={styles.page}>
      <BlogPostSchema post={post} />

      <article className={styles.article}>
        {/* Header */}
        <header className={styles.header}>
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href="/blog">Blog</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href={`/blog/category/${post.category}`}>{category?.name}</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span>{post.title}</span>
          </nav>

          {/* Category Badge */}
          <Link
            href={`/blog/category/${post.category}`}
            className={styles.category}
            style={{ backgroundColor: category?.color }}
          >
            {category?.name}
          </Link>

          {/* Title */}
          <h1 className={styles.title}>{post.title}</h1>

          {/* Meta */}
          <div className={styles.meta}>
            <span className={styles.author}>{post.author}</span>
            <span className={styles.separator}>|</span>
            <time dateTime={post.date} className={styles.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className={styles.separator}>|</span>
            <span className={styles.readTime}>{post.readTime}</span>
          </div>

          {/* Tags */}
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Two-column layout: Content + ScrollTOC sidebar */}
        <div className={styles.contentLayout}>
          {/* Scroll-tracked Table of Contents */}
          {headings.length > 0 && (
            <ScrollTOC headings={headings} categoryColor={category?.color} />
          )}

          {/* Main Content */}
          <div className={styles.content}>
            {post.content.map((block, index) => (
              <ContentBlockRenderer key={index} block={block} index={index} />
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <footer className={styles.footer}>
          {/* Share Section */}
          <div className={styles.shareSection}>
            <h3 className={styles.shareTitle}>Share This Article</h3>
            <div className={styles.shareButtons}>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareButton}
              >
                X / Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareButton}
              >
                LinkedIn
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareButton}
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Previous / Next Navigation */}
          <div className={styles.postNavigation}>
            {prev ? (
              <Link href={`/blog/${prev.slug}`} className={styles.navPrev}>
                <span className={styles.navLabel}>&larr; Previous</span>
                <span className={styles.navTitle}>{prev.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link href={`/blog/${next.slug}`} className={styles.navNext}>
                <span className={styles.navLabel}>Next &rarr;</span>
                <span className={styles.navTitle}>{next.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className={styles.relatedSection}>
              <h3 className={styles.relatedTitle}>RELATED ARTICLES</h3>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className={styles.relatedCard}
                  >
                    <div className={styles.relatedCategory}>
                      {BLOG_CATEGORIES[related.category]?.name}
                    </div>
                    <h4 className={styles.relatedCardTitle}>{related.title}</h4>
                    <p className={styles.relatedExcerpt}>{related.excerpt}</p>
                    <span className={styles.relatedReadMore}>Read Article &rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </footer>
      </article>

      {/* Bottom CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>READY TO IMPLEMENT?</h2>
          <p className={styles.ctaText}>
            Stop reading and start executing. Book a call with our team to put
            these strategies into action with professional media, web, and growth systems.
          </p>
          <Link href="/book" className={styles.ctaButton}>
            BOOK A CALL
          </Link>
        </div>
      </section>
    </div>
  );
}
