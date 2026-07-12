import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Growth Partnerships | Sweet Dreams - Performance-Based Business Media",
  description: "Partner with Sweet Dreams for performance-based growth. We don't do retainers, we do results. Unlimited content, brand assets, social management, and revenue-tied compensation.",
  keywords: "growth partnership, performance marketing, video marketing agency, content marketing partner, revenue-based agency, Fort Wayne marketing",
  // Retired from the main IA (no longer linked in nav/footer). Kept live for
  // any direct links, but out of the index so it isn't an orphan crawl target.
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${SITE_URL}/partnerships`,
  },
  openGraph: {
    title: "Growth Partnerships | Sweet Dreams",
    description: "We don't do retainers, we do results. Partner with us for performance-based growth.",
    url: `${SITE_URL}/partnerships`,
    type: "website",
    images: [
      {
        url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png",
        width: 1200,
        height: 630,
        alt: "Sweet Dreams Growth Partnerships",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Growth Partnerships | Sweet Dreams",
    description: "We don't do retainers, we do results. Performance-based growth partnerships.",
  },
};

export default function PartnershipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
