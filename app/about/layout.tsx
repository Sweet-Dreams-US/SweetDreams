import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us | Sweet Dreams - Fort Wayne Business Media Agency",
  description: "Learn about Sweet Dreams, Fort Wayne's premier business media agency. Founded by Jay Valleo, we specialize in commercial video production, brand films, web development, and business media solutions.",
  keywords: "about Sweet Dreams, Fort Wayne business media agency, Jay Valleo, video production company, commercial video Fort Wayne, business media solutions",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Us | Sweet Dreams Business Media",
    description: "Fort Wayne's premier business media agency specializing in commercial video production, brand films, and digital media solutions.",
    url: `${SITE_URL}/about`,
    type: "website",
    images: [
      {
        url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png",
        width: 1200,
        height: 630,
        alt: "Sweet Dreams Business Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Sweet Dreams Business Media",
    description: "Fort Wayne's premier business media agency specializing in commercial video production, brand films, and digital media.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
