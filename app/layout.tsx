import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import GradientCursor from "@/components/GradientCursor";
import { consolidatedSchema } from "@/lib/schema";
import { SITE_URL, SEO, GEO, BRAND } from "@/lib/constants";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: SEO.defaultTitle,
  description: SEO.defaultDescription,
  keywords: SEO.keywords.join(', '),
  authors: [{ name: BRAND.legalName }],
  icons: {
    icon: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png',
    apple: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  // Geo-targeting for local SEO (CRITICAL)
  other: {
    'geo.region': GEO.region,
    'geo.placename': GEO.placeName,
    'geo.position': GEO.position,
    'ICBM': GEO.icbm,
  },
  openGraph: {
    type: SEO.openGraph.type,
    title: "Sweet Dreams Solutions | Fort Wayne's Leading Full-Service Agency",
    description: "Fort Wayne's leading full-service agency. Media production, marketing, custom software, and business consulting — all under one roof. Trusted by the City of Fort Wayne, Nissan, Indianapolis Children's Museum, and Brookfield Zoo. Serving Fort Wayne, Northeast Indiana, and the Midwest.",
    url: SITE_URL,
    siteName: SEO.openGraph.siteName,
    locale: SEO.openGraph.locale,
    images: [
      {
        url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png',
        width: SEO.openGraph.imageWidth,
        height: SEO.openGraph.imageHeight,
        alt: SEO.openGraph.imageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jayvalleo',
    creator: '@jayvalleo',
    title: "Sweet Dreams Solutions | Fort Wayne's Leading Full-Service Agency",
    description: "Media production, marketing, custom software, and business consulting — all under one roof. Trusted by the City of Fort Wayne, Nissan, and Brookfield Zoo. Fort Wayne, Northeast Indiana & the Midwest.",
    images: ['https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NX7KJL3N');
          `}
        </Script>

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '3631251467167744');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Google Ads Conversion Tracking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18077252453"
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18077252453');
          `}
        </Script>

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JVM25Y7PGY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JVM25Y7PGY');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "tyjolmx04i");
          `}
        </Script>

        {/* Metricool */}
        <Script id="metricool" strategy="afterInteractive">
          {`
            (function(){
              var b=document.getElementsByTagName("head")[0],c=document.createElement("script");
              c.type="text/javascript";c.src="https://tracker.metricool.com/resources/be.js";
              c.onload=function(){try{beTracker.t({hash:"e58732b17a6a586cbd3b4f425ca2829b"})}catch(e){}};
              b.appendChild(c);
            })();
          `}
        </Script>

        {/* Schema.org Structured Data - CRITICAL for local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(consolidatedSchema)
          }}
        />
      </head>
      <body className={ibmPlexMono.className}>
        <GradientCursor />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NX7KJL3N"
            height="0"
            width="0"
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>

        {/* Facebook Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=3631251467167744&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}