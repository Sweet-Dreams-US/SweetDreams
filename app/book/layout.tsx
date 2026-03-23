import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Book a Call | Sweet Dreams - Free Business Media Consultation",
  description: "Schedule a free discovery call with Sweet Dreams. Discuss your commercial video production, web development, or social media growth needs with our Fort Wayne team.",
  keywords: "book consultation, free discovery call, video production quote, Fort Wayne creative agency contact, business media consultation, web development quote",
  alternates: {
    canonical: `${SITE_URL}/book`,
  },
  openGraph: {
    title: "Book a Free Discovery Call | Sweet Dreams",
    description: "Schedule a free call to discuss your business media, video production, or web development needs.",
    url: `${SITE_URL}/book`,
    type: "website",
    images: [
      {
        url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png",
        width: 1200,
        height: 630,
        alt: "Book a Call with Sweet Dreams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Free Discovery Call | Sweet Dreams",
    description: "Schedule a free call to discuss your business media, video production, or web development needs.",
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
