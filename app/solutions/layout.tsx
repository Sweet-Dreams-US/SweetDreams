import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Not Sure Where to Start? | Sweet Dreams Fort Wayne",
  description: "Tell us what you need and we'll point you to the right place: custom software (websites and AI workflows), media production, or our portfolio. A Fort Wayne software studio and media production company.",
  keywords: "Sweet Dreams Solutions, Fort Wayne software, Fort Wayne media production, custom software Fort Wayne, business automation, AI workflows Fort Wayne, brand films Fort Wayne",
  alternates: {
    canonical: `${SITE_URL}/solutions`,
  },
  openGraph: {
    title: "Not Sure Where to Start? | Sweet Dreams Fort Wayne",
    description: "Custom software or media production, tell us what you need and we'll point you to the right place.",
    url: `${SITE_URL}/solutions`,
    type: "website",
    images: [
      {
        url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png',
        width: 1200,
        height: 630,
        alt: 'Sweet Dreams Solutions — Software & Media Production',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Not Sure Where to Start? | Sweet Dreams",
    description: "Custom software or media production for Fort Wayne businesses. Find the right starting point.",
  },
  other: {
    'geo.region': 'US-IN',
    'geo.placename': 'Fort Wayne',
  },
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
