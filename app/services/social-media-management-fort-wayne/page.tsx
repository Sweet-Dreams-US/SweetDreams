import Link from "next/link";
import { createFAQSchema, createBreadcrumbSchema } from "@/lib/schema";
import { SITE_URL, CONTACT, ADDRESS } from "@/lib/constants";

export const metadata = {
  title: "Social Media Management Fort Wayne | Content & Growth | Sweet Dreams",
  description: "Social media management and growth services in Fort Wayne, Indiana. Sweet Dreams handles strategy, content creation, posting, and audience growth for businesses. Call (260) 450-7739 for a free consultation.",
  keywords: [
    "social media management Fort Wayne",
    "social media marketing Fort Wayne",
    "social media agency Fort Wayne Indiana",
    "social media manager Fort Wayne",
    "content creation Fort Wayne",
    "Instagram management Fort Wayne",
    "TikTok marketing Fort Wayne",
    "social media growth Fort Wayne",
    "digital marketing Fort Wayne",
    "social media company near me",
    "Fort Wayne social media services",
    "business social media Fort Wayne",
  ],
  alternates: {
    canonical: `${SITE_URL}/services/social-media-management-fort-wayne`,
  },
  openGraph: {
    title: "Social Media Management Fort Wayne | Sweet Dreams",
    description: "Full-service social media management, content creation, and audience growth for Fort Wayne businesses.",
    url: `${SITE_URL}/services/social-media-management-fort-wayne`,
    type: "website",
  },
};

const faqs = [
  {
    question: "How much does social media management cost in Fort Wayne?",
    answer: "Social media management pricing depends on the scope of work — number of platforms, posting frequency, content creation needs, and whether paid ads are included. Sweet Dreams offers competitive pricing for Fort Wayne businesses. Book a free discovery call at (260) 450-7739 to discuss your needs and get a custom quote."
  },
  {
    question: "What social media platforms do you manage?",
    answer: "Sweet Dreams manages Instagram, TikTok, Facebook, YouTube, LinkedIn, and X (Twitter). We create platform-specific content optimized for each algorithm, including Reels, Stories, TikToks, YouTube Shorts, and traditional posts."
  },
  {
    question: "Do you create content or just post?",
    answer: "We are a full-service agency — we create all content in-house including video, photography, graphics, and copywriting. Our team handles strategy, content creation, scheduling, posting, community management, and performance reporting. You do not need to provide content."
  },
  {
    question: "How long before I see results from social media management?",
    answer: "Most clients see measurable engagement growth within 30-60 days. Significant audience growth and lead generation typically develop over 3-6 months of consistent, strategic content. We provide monthly reports showing follower growth, engagement rates, reach, and leads generated."
  },
  {
    question: "Can you also handle our video production and website?",
    answer: "Yes — Sweet Dreams is a full-service media agency. We offer video production, web development, and social media management under one roof. This means your brand stays consistent across all channels. Many of our clients bundle services for a cohesive digital presence."
  },
];

export default function SocialMediaFortWaynePage() {
  const faqSchema = createFAQSchema(faqs);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/solutions` },
    { name: "Social Media Management Fort Wayne", url: `${SITE_URL}/services/social-media-management-fort-wayne` },
  ]);

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.3em", color: "#999", textTransform: "uppercase", margin: 0 }}>
          Fort Wayne, Indiana
        </p>
        <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 72, fontWeight: 400, textTransform: "uppercase", lineHeight: 0.95, margin: "8px 0 32px", color: "black" }}>
          SOCIAL MEDIA MANAGEMENT FORT WAYNE
        </h1>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, lineHeight: 1.8, color: "#333", marginBottom: 48 }}>
          Sweet Dreams provides full-service social media management for businesses in Fort Wayne, Indiana. We handle everything — strategy, content creation, posting, community management, and growth. Our in-house team creates professional video and photo content, writes engaging copy, and manages your accounts so you can focus on running your business.
        </p>

        <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 36, fontWeight: 400, textTransform: "uppercase", margin: "64px 0 24px", color: "black" }}>
          SOCIAL MEDIA SERVICES
        </h2>

        <div style={{ display: "grid", gap: 24, marginBottom: 64 }}>
          {[
            { title: "Social Media Strategy", desc: "Custom social media strategies built around your business goals, target audience, and competitive landscape. We research your market and create a content plan that drives real results." },
            { title: "Content Creation", desc: "Professional video, photography, graphic design, and copywriting created in-house. We produce scroll-stopping Reels, TikToks, YouTube Shorts, Stories, and feed posts tailored to each platform." },
            { title: "Account Management & Posting", desc: "Full account management including scheduling, posting, hashtag strategy, community management, and responding to comments and DMs on your behalf." },
            { title: "Audience Growth", desc: "Organic growth strategies that build real, engaged followers — not bots. We use data-driven techniques to expand your reach and attract your ideal customers." },
            { title: "Performance Reporting", desc: "Monthly reports showing follower growth, engagement rates, reach, impressions, and lead generation. We track what works and continuously optimize your strategy." },
            { title: "Paid Social Advertising", desc: "Strategic ad campaigns on Instagram, Facebook, TikTok, and YouTube to amplify your organic content and drive targeted traffic, leads, and sales." },
          ].map((service, i) => (
            <div key={i} style={{ padding: "32px", background: "#f8f8f8", borderRadius: 12 }}>
              <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, fontWeight: 400, textTransform: "uppercase", margin: "0 0 12px", color: "black" }}>
                {service.title}
              </h3>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, lineHeight: 1.7, color: "#555", margin: 0 }}>
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 36, fontWeight: 400, textTransform: "uppercase", margin: "64px 0 24px", color: "black" }}>
          WHY SWEET DREAMS FOR SOCIAL MEDIA
        </h2>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, lineHeight: 1.8, color: "#333", marginBottom: 16 }}>
          Unlike typical social media agencies that just schedule posts, Sweet Dreams is a full-service media company. We produce professional video and photo content in-house, which means your social media gets the same production quality as a commercial — not just stock photos with text overlays. Our clients see real engagement because we create content people actually want to watch and share.
        </p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, lineHeight: 1.8, color: "#333", marginBottom: 48 }}>
          Based at {ADDRESS.formatted}, we understand the Fort Wayne market and local business landscape. Whether you are a restaurant, retail store, professional service, or growing brand, we tailor our approach to your specific audience and goals.
        </p>

        <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 36, fontWeight: 400, textTransform: "uppercase", margin: "64px 0 24px", color: "black" }}>
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <div style={{ display: "grid", gap: 24, marginBottom: 64 }}>
          {faqs.map((faq, i) => (
            <div key={i}>
              <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: 20, fontWeight: 400, textTransform: "uppercase", margin: "0 0 8px", color: "black" }}>
                {faq.question}
              </h3>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, lineHeight: 1.7, color: "#555", margin: 0 }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", padding: "64px 0", borderTop: "2px solid #eee" }}>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 48, fontWeight: 400, textTransform: "uppercase", margin: "0 0 24px", color: "black" }}>
            GROW YOUR SOCIAL MEDIA
          </h2>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: "#555", marginBottom: 32 }}>
            Book a free discovery call or reach us at {CONTACT.phoneDisplay}
          </p>
          <Link href="/book" style={{ display: "inline-block", background: "black", color: "white", fontFamily: "'IBM Plex Mono', monospace", fontWeight: "bold", textTransform: "uppercase", padding: "20px 60px", borderRadius: 999, fontSize: 16, letterSpacing: "0.15em", textDecoration: "none" }}>
            BOOK A FREE CALL
          </Link>
        </div>
      </div>
    </div>
  );
}
