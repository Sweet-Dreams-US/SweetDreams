import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Commercial Video Production | Sweet Dreams Fort Wayne",
  description: "Professional commercial video production in Fort Wayne: brand films, business commercials, corporate videos, event videography, promotional content. High-quality video services for businesses and brands.",
  keywords: "Fort Wayne videographer, commercial video production, brand film production, corporate video Fort Wayne, business video production, event videography, video production Fort Wayne, media production Indiana, professional videographer, social media video content, promotional video production",
  alternates: {
    canonical: `${SITE_URL}/media`,
  },
  openGraph: {
    title: "Commercial Video Production | Sweet Dreams Fort Wayne",
    description: "High-quality commercial video production: brand films, business commercials, corporate videos, and promotional content. Fort Wayne's premier business video production agency.",
    url: `${SITE_URL}/media`,
    type: "website",
    images: [
      {
        url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png',
        width: 1200,
        height: 630,
        alt: 'Sweet Dreams Commercial Video Production',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Commercial Video Production | Sweet Dreams",
    description: "Professional commercial video production services in Fort Wayne for businesses and brands",
  },
  other: {
    'geo.region': 'US-IN',
    'geo.placename': 'Fort Wayne',
  },
};

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
