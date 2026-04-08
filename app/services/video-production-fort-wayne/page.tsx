import Link from "next/link";
import { createFAQSchema, createBreadcrumbSchema } from "@/lib/schema";
import { SITE_URL, CONTACT, ADDRESS, BRAND } from "@/lib/constants";

export const metadata = {
  title: "Video Production Fort Wayne | Commercial Video & Brand Films | Sweet Dreams",
  description: "Professional video production in Fort Wayne, Indiana. Sweet Dreams creates commercials, brand films, corporate videos, event coverage, and promotional content for businesses. Call (260) 450-7739 for a free consultation.",
  keywords: [
    "video production Fort Wayne",
    "videographer Fort Wayne Indiana",
    "commercial video production Fort Wayne",
    "brand film Fort Wayne",
    "corporate video Fort Wayne",
    "Fort Wayne video company",
    "promotional video production Indiana",
    "event videography Fort Wayne",
    "business video Fort Wayne",
    "video production company near me",
    "Fort Wayne commercial production",
    "professional videographer Fort Wayne",
  ],
  alternates: {
    canonical: `${SITE_URL}/services/video-production-fort-wayne`,
  },
  openGraph: {
    title: "Video Production Fort Wayne | Sweet Dreams Media",
    description: "Professional commercial video production, brand films, and corporate media for Fort Wayne businesses. Free consultation available.",
    url: `${SITE_URL}/services/video-production-fort-wayne`,
    type: "website",
  },
};

const faqs = [
  {
    question: "How much does video production cost in Fort Wayne?",
    answer: "Video production costs in Fort Wayne vary based on project scope. Sweet Dreams offers competitive pricing starting from single-day shoots for commercials to multi-day brand film productions. We provide free consultations to scope your project and give you an accurate quote. Call us at (260) 450-7739 or book a free discovery call on our website."
  },
  {
    question: "What types of videos does Sweet Dreams produce?",
    answer: "Sweet Dreams produces commercials, brand films, corporate videos, event coverage, promotional content, social media videos, product showcases, and drone footage. We serve businesses across Fort Wayne, Northeast Indiana, and nationwide."
  },
  {
    question: "How long does a video production project take?",
    answer: "Timeline depends on the project. A simple commercial can be completed in 1-2 weeks from shoot to final delivery. Brand films and larger projects typically take 2-4 weeks. We work with your schedule and deadlines to deliver on time."
  },
  {
    question: "Do you offer drone videography in Fort Wayne?",
    answer: "Yes, Sweet Dreams offers FAA-certified drone videography for aerial shots, property tours, event coverage, and cinematic b-roll. Drone footage adds a premium, professional look to any video project."
  },
  {
    question: "Where is Sweet Dreams located?",
    answer: `Sweet Dreams is located at ${ADDRESS.formatted}. We serve businesses throughout Fort Wayne, Northeast Indiana, and beyond. Contact us at ${CONTACT.phoneDisplay} or email ${CONTACT.email}.`
  },
];

export default function VideoProductionFortWaynePage() {
  const faqSchema = createFAQSchema(faqs);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/solutions` },
    { name: "Video Production Fort Wayne", url: `${SITE_URL}/services/video-production-fort-wayne` },
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
          VIDEO PRODUCTION FORT WAYNE
        </h1>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, lineHeight: 1.8, color: "#333", marginBottom: 48 }}>
          Sweet Dreams is a professional video production company based in Fort Wayne, Indiana. We create commercials, brand films, corporate videos, event coverage, and promotional content that helps businesses stand out and grow. Founded in 2020 by Jay Val Leo, we bring a results-driven approach to every project — no retainers, no hourly billing, just great work that delivers measurable value.
        </p>

        <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 36, fontWeight: 400, textTransform: "uppercase", margin: "64px 0 24px", color: "black" }}>
          OUR VIDEO PRODUCTION SERVICES
        </h2>

        <div style={{ display: "grid", gap: 24, marginBottom: 64 }}>
          {[
            { title: "Commercial Production", desc: "TV commercials, digital ads, and promotional videos designed to convert viewers into customers. We handle everything from concept to final cut." },
            { title: "Brand Films", desc: "Cinematic storytelling that captures your brand's essence. Our brand films build emotional connections between your business and your audience." },
            { title: "Corporate Video", desc: "Professional corporate videos for training, internal communications, investor presentations, and company culture showcases." },
            { title: "Event Videography", desc: "Full event coverage including highlight reels, recap videos, and live event documentation for conferences, festivals, and corporate events." },
            { title: "Drone Videography", desc: "FAA-certified aerial cinematography for stunning overhead shots, property tours, and cinematic b-roll that elevates any production." },
            { title: "Social Media Content", desc: "Short-form video content optimized for Instagram, TikTok, YouTube, and Facebook that drives engagement and grows your audience." },
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
          WHY FORT WAYNE BUSINESSES CHOOSE SWEET DREAMS
        </h2>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, lineHeight: 1.8, color: "#333", marginBottom: 16 }}>
          We are not a traditional agency. Sweet Dreams operates on a performance-driven model where your success is our success. Our clients include Nissan, Indianapolis Children&apos;s Museum, Brookfield Zoo, Kissel Entertainment, Aegis Dental, and dozens more businesses across Fort Wayne and Indiana.
        </p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, lineHeight: 1.8, color: "#333", marginBottom: 48 }}>
          Based at {ADDRESS.formatted}, we are embedded in the Fort Wayne community. We understand local businesses, local audiences, and what it takes to make your brand impossible to ignore in Northeast Indiana and beyond.
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
            READY TO GET STARTED?
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
