import RecentWork from "@/components/RecentWork";
import VideoHero from "@/components/VideoHero";
import SolutionsAnimated from "@/components/SolutionsAnimated";
import FriendsAnimated from "@/components/FriendsAnimated";
import FeaturedProject from "@/components/FeaturedProject";
import Work from "@/components/Work";
import CTASection from "@/components/CTASection";
import TransitionSection from "@/components/TransitionSection";
import WhatWeDo from "@/components/WhatWeDo";
import PartnerWithUs from "@/components/PartnerWithUs";
import WhyUs from "@/components/WhyUs";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* 1. Video Hero */}
      <VideoHero />

      {/* 2. What We Do — four service pillars */}
      <WhatWeDo />

      {/* 3. We Were Raised In This Age — our process + positioning */}
      <TransitionSection />

      {/* 5. Latest Work — featured projects carousel */}
      <RecentWork />

      {/* 6. Ready To Start? — pick your pillar */}
      <SolutionsAnimated />

      {/* 7. Partner With Us — Sweet Spot Partnerships */}
      <PartnerWithUs />

      {/* 8. Why Us — generational positioning */}
      <WhyUs />

      {/* 9a. Our Friends — trusted brands */}
      <FriendsAnimated />

      {/* 9b. Featured Project — Nissan spotlight */}
      <FeaturedProject />

      {/* 10. We Care About Your "Why?" — work grid */}
      <Work />

      {/* 11. Let's Create Something — final CTA with vertical video */}
      <CTASection />
    </div>
  );
}
