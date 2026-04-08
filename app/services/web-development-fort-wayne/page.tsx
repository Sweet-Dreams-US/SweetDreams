import Link from "next/link";
import { createFAQSchema, createBreadcrumbSchema } from "@/lib/schema";
import { SITE_URL, CONTACT, ADDRESS } from "@/lib/constants";

export const metadata = {
  title: "Web Development Fort Wayne | Custom Websites & E-Commerce | Sweet Dreams",
  description: "Professional web development in Fort Wayne, Indiana. Sweet Dreams builds custom websites, e-commerce stores, booking platforms, and business web applications. View our 8-site portfolio. Call (260) 450-7739.",
  keywords: [
    "web development Fort Wayne",
    "website design Fort Wayne",
    "Fort Wayne web developer",
    "custom website Fort Wayne Indiana",
    "e-commerce development Fort Wayne",
    "web design Fort Wayne",
    "Fort Wayne website company",
    "small business website Fort Wayne",
    "WordPress Fort Wayne",
    "Next.js developer Fort Wayne",
    "website redesign Fort Wayne",
    "web developer near me",
  ],
  alternates: {
    canonical: `${SITE_URL}/services/web-development-fort-wayne`,
  },
  openGraph: {
    title: "Web Development Fort Wayne | Sweet Dreams",
    description: "Custom websites, e-commerce, and web applications for Fort Wayne businesses. 8+ live websites in our portfolio.",
    url: `${SITE_URL}/services/web-development-fort-wayne`,
    type: "website",
  },
};

const faqs = [
  {
    question: "How much does a website cost in Fort Wayne?",
    answer: "Website costs depend on complexity. A business landing page starts at a lower price point, while custom web applications with booking systems, e-commerce, or member portals are priced based on scope. Sweet Dreams provides free consultations to understand your needs and give an accurate quote. Call (260) 450-7739."
  },
  {
    question: "How long does it take to build a website?",
    answer: "A standard business website takes 2-4 weeks from design to launch. E-commerce sites and custom web applications with advanced features like booking systems typically take 4-8 weeks. We work with your timeline and keep you involved at every stage."
  },
  {
    question: "What websites has Sweet Dreams built?",
    answer: "Sweet Dreams has built websites across multiple industries including sweetdreams.us (our own agency site), sweetdreamsmusic.com (recording studio with online booking), creatorspacefw.com (community directory), primedealerfund.com (private equity fund), mcracingfortwayne.com (sim racing lounge), crookedlakesandbarmusicfest.com (music festival), mindsquire.com (YouTube organization), and industrialbakeryequipment.com (manufacturing). View them all at sweetdreams.us/work."
  },
  {
    question: "Do you provide website hosting and maintenance?",
    answer: "Yes, Sweet Dreams provides hosting, maintenance, and ongoing support for all websites we build. We use modern deployment platforms like Vercel for maximum performance, security, and uptime."
  },
  {
    question: "What technologies do you use for web development?",
    answer: "We build with modern frameworks including Next.js, React, and TypeScript for performance and scalability. Our sites are deployed on Vercel with Supabase for databases, Cloudflare for media delivery, and Stripe for payment processing. Every site is mobile-responsive and SEO-optimized."
  },
];

export default function WebDevelopmentFortWaynePage() {
  const faqSchema = createFAQSchema(faqs);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/solutions` },
    { name: "Web Development Fort Wayne", url: `${SITE_URL}/services/web-development-fort-wayne` },
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
          WEB DEVELOPMENT FORT WAYNE
        </h1>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, lineHeight: 1.8, color: "#333", marginBottom: 48 }}>
          Sweet Dreams builds custom websites for businesses in Fort Wayne, Indiana and beyond. From e-commerce stores and booking platforms to community directories and corporate sites, we create web experiences that convert visitors into customers. With 8+ live websites in our portfolio serving industries from entertainment to manufacturing, we bring real-world results to every project.
        </p>

        <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 36, fontWeight: 400, textTransform: "uppercase", margin: "64px 0 24px", color: "black" }}>
          WEB DEVELOPMENT SERVICES
        </h2>

        <div style={{ display: "grid", gap: 24, marginBottom: 64 }}>
          {[
            { title: "Custom Website Design & Development", desc: "Bespoke websites built with modern technologies (Next.js, React) tailored to your brand. Mobile-responsive, fast-loading, and SEO-optimized from day one." },
            { title: "E-Commerce & Online Stores", desc: "Sell products and services online with Stripe payment processing, inventory management, and a seamless checkout experience that converts." },
            { title: "Booking & Scheduling Platforms", desc: "Custom online booking systems for studios, salons, consultants, and service businesses. Real-time availability, deposits, and automated notifications." },
            { title: "Business Web Applications", desc: "Community directories, member portals, investment platforms, and custom dashboards. Complex web applications built for your specific business needs." },
            { title: "Website Maintenance & Hosting", desc: "Ongoing support, performance monitoring, security updates, and content management. Deployed on enterprise-grade infrastructure for maximum uptime." },
            { title: "SEO & Performance Optimization", desc: "Search engine optimization, Core Web Vitals optimization, structured data implementation, and local SEO to ensure your site ranks and converts." },
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
          WEBSITES WE HAVE BUILT
        </h2>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, lineHeight: 1.8, color: "#333", marginBottom: 24 }}>
          Our portfolio spans multiple industries. Every site is custom-built, mobile-responsive, and optimized for search engines:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 64 }}>
          {[
            { name: "sweetdreams.us", industry: "Agency", href: "/work/web-sweetdreams" },
            { name: "sweetdreamsmusic.com", industry: "Music Studio", href: "/work/web-sweetdreamsmusic" },
            { name: "creatorspacefw.com", industry: "Community", href: "/work/web-creatorspace" },
            { name: "primedealerfund.com", industry: "Finance", href: "/work/web-primedealerfund" },
            { name: "mcracingfortwayne.com", industry: "Entertainment", href: "/work/web-mcracing" },
            { name: "crookedlakesandbarmusicfest.com", industry: "Events", href: "/work/web-crookedlake" },
            { name: "mindsquire.com", industry: "Digital Media", href: "/work/web-mindsquire" },
            { name: "industrialbakeryequipment.com", industry: "Manufacturing", href: "/work/web-industrialbakery" },
          ].map((site, i) => (
            <Link key={i} href={site.href} style={{ padding: "20px 24px", background: "#000", borderRadius: 12, textDecoration: "none", display: "block" }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: "white", display: "block" }}>{site.name}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#888" }}>{site.industry}</span>
            </Link>
          ))}
        </div>

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
            NEED A WEBSITE BUILT?
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
