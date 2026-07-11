import FreeOffersBar from "@/components/FreeOffersBar";
import VideoHero from "@/components/VideoHero";
import WhatWeDo from "@/components/WhatWeDo";
import TransitionSection from "@/components/TransitionSection";
import RecentWork from "@/components/RecentWork";
import FeaturedProject from "@/components/FeaturedProject";
import FriendsAnimated from "@/components/FriendsAnimated";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* 1. Free offers bar — thin strip under the nav, above the hero */}
      <FreeOffersBar />

      {/* 2. Full-bleed cinematic video hero — sells both avenues */}
      <VideoHero />

      {/* 3. What We Do — the two avenues (Software + Media Production) */}
      <WhatWeDo />

      {/* 4. We Were Raised In This Age — generational-authenticity beat */}
      <TransitionSection />

      {/* 5. Recent Work — featured projects carousel */}
      <RecentWork />

      {/* 6. Featured Project — Nissan spotlight */}
      <FeaturedProject />

      {/* 7. Trusted by our friends — brand proof */}
      <FriendsAnimated />

      {/* 8. Final CTA — Let's create something that moves */}
      <CTASection />
    </div>
  );
}
