"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../media/media.module.css";
import WhyAnimated from "@/components/media/WhyAnimated";

import PortfolioHorizontalScroll from "@/components/media/PortfolioHorizontalScroll";
import WebsiteShowcase from "@/components/web/WebsiteShowcase";
import WorkContactForm from "@/components/work/WorkContactForm";
import WorkCTABanner from "@/components/work/WorkCTABanner";

export default function WorkPage() {
  // Modal state — when any CTA is clicked, we store a pre-selected interest
  // so the form opens with a relevant checkbox already ticked
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInterest, setModalInterest] = useState<string | undefined>(undefined);
  const [modalHeading, setModalHeading] = useState<string | undefined>(undefined);

  const openModal = (interest?: string, heading?: string) => {
    setModalInterest(interest);
    setModalHeading(heading);
    setModalOpen(true);
  };

  const portfolioItems = [
    {
      href: "/work/fort-wayne-state-of-the-city",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/d8719a81b378ac68b2c64e1cd2819a3e/thumbnails/thumbnail.jpg?time=5s&height=600",
      title: "FORT WAYNE STATE OF THE CITY",
      client: "City of Fort Wayne",
      category: "Event Coverage",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CityofFortWayneLogo.png",
      tags: ["recap", "aerial"],
    },
    {
      href: "/work/mom-nonprofit-brand-film",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/a03f0e00cd2fda4a43464adec197c0b6/thumbnails/thumbnail.jpg?time=5s&height=600",
      title: "M.O.M.",
      client: "M.O.M. Nonprofit",
      category: "Brand Film · Nonprofit",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png",
      tags: ["business"],
    },
    {
      href: "/work/mc-sim-racing",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/a279eed7ef4ceef1b3b257b0fb4dfc67/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "MC SIM RACING",
      client: "MC Sim Racing",
      category: "Brand Video",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/logoMCSimRacing.png",
      tags: ["business"],
    },
    {
      href: "/work/the-coleman-prime-story",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/d08682649901944d9bbec1dcfb8bde88/thumbnails/thumbnail.jpg?time=89s&height=600",
      title: "THE COLEMAN PRIME STORY",
      client: "Coleman Prime",
      category: "Brand Trailer",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/Primedealerequityfundlogoblack.png",
      tags: ["business", "aerial"],
    },
    {
      href: "/work/knoxville-carnival-coverage",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/d554360a479b1380f96df7a4ef8f03a3/thumbnails/thumbnail.jpg?time=13s&height=600",
      title: "KISSEL ENTERTAINMENT",
      client: "Kissel Entertainment",
      category: "Commercial · Event Coverage",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/KisselLogo.png",
      tags: ["business"],
    },
    {
      href: "/work/indianapolis-childrens-museum-ferris-wheel",
      image: "https://videodelivery.net/7a243650c649bdcf4369622acd47abf6/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "INDIANAPOLIS CHILDREN'S MUSEUM FERRIS WHEEL",
      client: "Indianapolis Children's Museum",
      category: "Brand Film · Event",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/IndyChildrensMuseumLogo.png",
      tags: ["business", "aerial"],
    },
    {
      href: "/work/brookfield-zoo-ferris-wheel",
      image: "https://videodelivery.net/b3b94bd1543e2452571b90aab0a38e9b/thumbnails/thumbnail.jpg?time=13s&height=600",
      title: "BROOKFIELD ZOO FERRIS WHEEL",
      client: "RideWorx & Brookfield Zoo",
      category: "Brand Film · Event",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/BrookfieldZooLogo.png",
      tags: ["business"],
    },
    {
      href: "/work/heaven-in-fort-wayne",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/d8c34ebf7e9bb7a150feaa29cd60a9a6/thumbnails/thumbnail.jpg?time=3s&height=600",
      title: "HEAVEN IN FORT WAYNE",
      client: "Sweet Dreams Media",
      category: "Showcase · Travel",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CityofFortWayneLogo.png",
      tags: ["aerial"],
    },
    {
      href: "/work/aegis-dental-trusted-dentistry",
      image: "https://videodelivery.net/089a5f4bac2141b90d9583820ee2b6cb/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "AEGIS DENTAL - TRUSTED DENTISTRY",
      client: "Aegis Dental Group",
      category: "Commercial · Brand Film",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/TrustedDentalLogo.png",
      tags: ["business"],
    },
    {
      href: "/work/vegas-dream-travel-content",
      image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VegasDream/VegasDreamCover.png",
      title: "VEGAS DREAM - TRAVEL CONTENT",
      client: "Sweet Dreams Media",
      category: "Travel · Content Creation",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg",
      tags: ["social"],
    },
    {
      href: "/work/sliced-by-sonny-commercial",
      image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/JSonnyBarberShop/DSC07101.jpg",
      title: "SLICED BY SONNY COMMERCIAL",
      client: "Sliced By Sonny",
      category: "Commercial",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/slicedBySonny.png",
      tags: ["business"],
    },
    {
      href: "/work/vintage-fest-fort-wayne",
      image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/VintageFestFortWayne/DJI_20250817131856_0026_D.jpg",
      title: "VINTAGE FEST FORT WAYNE",
      client: "Vintage Fest",
      category: "Event Coverage",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SummitCityVintageLogo.png",
      tags: ["recap"],
    },
    {
      href: "/work/fort-wayne-traffic-hyperlapse",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/11ba969d7ad3bca18978a2c36580c51f/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "FORT WAYNE TRAFFIC HYPERLAPSE",
      client: "Sweet Dreams Media",
      category: "Hyperlapse",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg",
      tags: ["social", "aerial"],
    },
    {
      href: "/work/cinema-drone-ad",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/7d5f758e9ad94d17703b2f7842ca309b/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "CINEMA DRONE AD",
      client: "Sweet Dreams Media",
      category: "Equipment Showcase",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg",
      tags: ["aerial"],
    },
    {
      href: "/work/fort-wayne-courthouse-4k",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/f7fc42a2caa35a3fd1eeb83e4fd5de06/thumbnails/thumbnail.jpg?time=80s&height=600",
      title: "FORT WAYNE COURTHOUSE IN 4K",
      client: "Sweet Dreams Media",
      category: "Aerial Cinematography",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg",
      tags: ["aerial"],
    },
    {
      href: "/work/fort-wayne-carnival-recap",
      image: "https://videodelivery.net/1a0f730d316664839064b8a88543d63a/thumbnails/thumbnail.jpg?time=1s&height=600",
      title: "FORT WAYNE CARNIVAL RECAP",
      client: "Kissel Entertainment",
      category: "Event Coverage · Recap",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/KisselLogo.png",
      tags: ["recap"],
    },
    {
      href: "/work/nissan-warsaw-dealership",
      image: "https://customer-w6h9o08eg118alny.cloudflarestream.com/700297c313e97262173f0c2107f3b8db/thumbnails/thumbnail.jpg?time=2s&height=600",
      title: "NISSAN WARSAW DEALERSHIP",
      client: "Nissan Warsaw Dealer",
      category: "Commercial · Automotive",
      logo: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/nissanredlogo.png",
      tags: ["business", "aerial"],
    },
  ];

  const websiteProjects = [
    {
      href: "/work/web-sweetdreams",
      url: "sweetdreams.us",
      videoId: "2e09ff39e945e08cf28ced40197bf836",
      name: "Sweet Dreams",
      description: "Our own agency site — built to showcase what we do best in media and web development.",
    },
    {
      href: "/work/web-sweetdreamsmusic",
      url: "sweetdreamsmusic.com",
      videoId: "c7a40ce22803114bab73611635add20c",
      name: "Sweet Dreams Music",
      description: "24/7 recording studio with online booking and a beat marketplace.",
    },
    {
      href: "/work/web-creatorspace",
      url: "creatorspacefw.com",
      videoId: "37a027a19196653d4ef79b6c2f5f5758",
      name: "Creator Space FW",
      description: "Free community directory connecting Fort Wayne creative professionals.",
    },
    {
      href: "/work/web-primedealerfund",
      url: "primedealerfund.com",
      videoId: "652911e44eafee84d9efa47dad31eac5",
      name: "Prime Dealer Fund",
      description: "Private equity investment fund for automotive dealership acquisitions.",
    },
    {
      href: "/work/web-mcracing",
      url: "mcracingfortwayne.com",
      videoId: "1ab82de79e003fc0c37afc0a27fedbc4",
      name: "MC Racing Fort Wayne",
      description: "Professional sim racing and RC lounge with online session booking.",
    },
    {
      href: "/work/web-crookedlake",
      url: "crookedlakesandbarmusicfest.com",
      videoId: "70cc260b4cb860e8d45485baedbf3b7f",
      name: "Crooked Lake Sandbar Music Fest",
      description: "Charity music festival on a sandbar with volunteer and sponsor portals.",
    },
    {
      href: "/work/web-mindsquire",
      url: "mindsquire.com",
      videoId: "4db4384638b438d0f2c3fb9b60a48606",
      name: "MindSquire",
      description: "YouTube content organization with 1.3B+ views and recruitment platform.",
    },
    {
      href: "/work/web-industrialbakery",
      url: "industrialbakeryequipment.com",
      videoId: "33850e02411be4ba7cb880ef7af52dce",
      name: "Industrial Bakery Equipment",
      description: "Steel fabrication company manufacturing food service equipment since 2008.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const title = document.getElementById('scrolling-title');
      const section = document.getElementById('value-section');
      if (title && section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionMiddle = sectionTop + (sectionHeight / 2);
        const scrolled = window.pageYOffset + (window.innerHeight / 2);
        const offset = scrolled - sectionMiddle;
        title.style.transform = `translateX(${-offset * 1}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Deferred hash scroll — waits for GSAP ScrollTrigger pinning to settle
  // before scrolling to #websites (or any other hash target). Without this,
  // the browser's initial hash scroll fires before ScrollTrigger expands the
  // horizontal portfolio's scroll distance, landing the user at the top.
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const timer = setTimeout(scrollToHash, 900);
    window.addEventListener('hashchange', scrollToHash);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return (
    <div className={styles.page}>
      {/* Complete Portfolio - Horizontal Scroll */}
      <PortfolioHorizontalScroll
        items={portfolioItems}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
      />

      {/* First CTA touchpoint — after they've seen the video portfolio */}
      <WorkCTABanner
        variant="compact"
        accentColor="red"
        heading="Like What You See?"
        subtext="Tell us about your project — no pressure, just a conversation."
        buttonText="Start a Project"
        onClick={() => openModal(undefined, "LOVE WHAT YOU SAW?")}
      />

      {/* Website Projects - White */}
      <div id="websites" style={{ scrollMarginTop: '80px' }}>
        <WebsiteShowcase projects={websiteProjects} />
      </div>

      {/* Second CTA — after the website portfolio, targeted to web interest */}
      <WorkCTABanner
        variant="compact"
        accentColor="blue"
        heading="Need a Website Like These?"
        subtext="Custom-coded, performance-optimized, and built to convert."
        buttonText="Get a Web Quote"
        onClick={() => openModal("Web Development", "BUILD YOUR NEXT WEBSITE")}
      />

      {/* Why Choose Us - Black */}
      <WhyAnimated />

      {/* Third CTA — feature-style mid-page emphasis */}
      <WorkCTABanner
        variant="feature"
        accentColor="yellow"
        heading="Ready to Create Something Memorable?"
        subtext="We handle everything from concept to final delivery. In-house team, Fort Wayne based, trusted by the City of Fort Wayne, Nissan, Brookfield Zoo, and more."
        buttonText="Book a Discovery Call"
        onClick={() => openModal(undefined, "LET'S BUILD SOMETHING GREAT")}
      />

      {/* Value Proposition - White */}
      <section className={styles.value} id="value-section" data-cursor-hide>
        <h2 className={styles.valueTitle} id="scrolling-title">
          WE BUILD VALUE, BEYOND VIDEO.
        </h2>
        <div className={styles.container}>
          <p className={styles.valueSubtitle}>
            Professional content that amplifies your message and gets you noticed. No shortcuts, no compromises.
          </p>
        </div>
      </section>

      {/* Final form — inline at the bottom for those who scrolled all the way */}
      <div id="contact">
        <WorkContactForm
          mode="inline"
          heading="LET'S TALK"
          subtext="Tell us about your project. We respond within 24 hours."
        />
      </div>

      {/* Footer Info - Black */}
      <section className={styles.info}>
        <div className={styles.container}>
          <p className={styles.infoText}>
            Sweet Dreams Solutions is a full-service agency based in Fort Wayne, Indiana.
            We specialize in media production, marketing, web development, and business consulting —
            helping brands stand out and connect with their audience.
          </p>
        </div>
      </section>

      {/* Popup modal — triggered by CTA buttons throughout the page */}
      <WorkContactForm
        mode="modal"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        prefilledInterest={modalInterest}
        heading={modalHeading}
      />
    </div>
  );
}
