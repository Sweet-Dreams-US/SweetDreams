'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebPreviewVideo from '@/components/web/WebPreviewVideo';
import SocialReel from '@/components/media/SocialReel';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import TopOfferBar from '@/components/TopOfferBar';
import styles from './media.module.css';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const HERO_REEL_ID = 'd08682649901944d9bbec1dcfb8bde88';

/* ---------- capture form config ---------- */
const steps: FunnelStep[] = [
  {
    question: "What's your {name}?",
    cta: "Let's start",
    fields: [
      { name: 'firstName', placeholder: 'First name', required: true, half: true },
      { name: 'lastName', placeholder: 'Last name', required: true, half: true },
    ],
  },
  {
    question: 'Tell us about your {business}',
    cta: 'Continue',
    fields: [
      { name: 'businessName', placeholder: 'Business name', required: true },
      { name: 'whatYouDo', placeholder: 'What do you do?', required: true },
    ],
  },
  {
    question: 'Where do we {reach you}?',
    cta: 'Get my content plan',
    fields: [
      { name: 'email', placeholder: 'Email', type: 'email', required: true },
      { name: 'phone', placeholder: 'Phone (optional)', type: 'tel' },
    ],
  },
];

/* ---------- production data ---------- */
interface Reel {
  name: string;
  tag: string;
  id: string;
  start?: number;
}

/* Commercials */
const commLead: Reel = {
  name: 'Coleman: Back to the Future',
  tag: 'Commercial',
  id: '7943215ed685238e8ca63bc3617f807d',
  start: 8,
};
const commTiles: Reel[] = [
  { name: 'Nissan Warsaw', tag: 'Commercial', id: '700297c313e97262173f0c2107f3b8db', start: 2 },
];

/* Brand Films */
const brandLead: Reel = {
  name: 'The Coleman Prime Story',
  tag: 'Brand Trailer',
  id: 'd08682649901944d9bbec1dcfb8bde88',
  start: 89,
};
const brandTiles: Reel[] = [
  { name: 'Kissel Entertainment', tag: 'Brand Film', id: 'd554360a479b1380f96df7a4ef8f03a3' },
  { name: 'MC Sim Racing', tag: 'Brand Video', id: 'a279eed7ef4ceef1b3b257b0fb4dfc67' },
  { name: 'Breastie Box', tag: 'Brand Film', id: 'cd386f606ba61022ba3e608f684b3c80', start: 15 },
];

const socialReels: Reel[] = [
  { name: 'Revive', tag: 'Social Reel', id: '62ea7c66a3ad77eadd83bd89c01f98c2' },
  { name: 'Revive', tag: 'Vertical', id: 'f4aa9217c51a8f15aaa849a25763fb57' },
  { name: 'PS5 Giveaway', tag: 'Promo Reel', id: 'd8c943ecf6fb3fcd91b5b5981f0c93ba' },
  { name: 'Another9', tag: 'Teaser', id: '1af67b520ce2d7ce398c09393dda1f89' },
  { name: 'Another9', tag: 'Grand Opening', id: '179d826809918e1f087948d6e93ee1a5' },
];

/* Event Recap */
const eventLead: Reel = {
  name: 'Fort Wayne State of the City',
  tag: 'Event Recap',
  id: 'd8719a81b378ac68b2c64e1cd2819a3e',
  start: 5,
};
const eventTiles: Reel[] = [
  { name: 'Nissan of Elgin', tag: 'Acquisition', id: '66f28edb4b5c20354896a437b7be5220', start: 5 },
  { name: 'Fort Wayne Carnival', tag: 'Event Recap', id: '1a0f730d316664839064b8a88543d63a' },
];

const aerialLead: Reel = {
  name: 'Cinema Drone',
  tag: 'Aerial',
  id: '7d5f758e9ad94d17703b2f7842ca309b',
};
const aerialTiles: Reel[] = [
  { name: 'Fort Wayne Courthouse', tag: 'Aerial 4K', id: 'f7fc42a2caa35a3fd1eeb83e4fd5de06' },
  { name: 'Fort Wayne', tag: 'Hyperlapse', id: 'a507a5b8a369b70b7332c0567cbbcc4c' },
];

const categories = [
  { n: '01', label: 'Commercials', href: '#brand-story' },
  { n: '02', label: 'Social Media', href: '#social-content' },
  { n: '03', label: 'Brand Films', href: '#live-events' },
  { n: '04', label: 'Event Recap', href: '#event-recap' },
  { n: '05', label: 'Aerial & Motion', href: '#aerial-motion' },
];

/* ---------- reel tile ---------- */
function ReelTile({ reel, feature }: { reel: Reel; feature?: boolean }) {
  return (
    <div className={`${styles.tile} ${feature ? styles.tileFeature : ''}`}>
      <WebPreviewVideo
        videoId={reel.id}
        startAt={reel.start ?? 1}
        className={styles.tileVideo}
        ariaLabel={`${reel.name} · ${reel.tag}`}
      />
      <span className={styles.tileScrim} aria-hidden="true" />
      <div className={styles.tileMeta}>
        <span className={styles.tileTag}>{reel.tag}</span>
        <h3 className={styles.tileName}>{reel.name}</h3>
      </div>
    </div>
  );
}

export default function MediaProduction() {
  const root = useRef<HTMLDivElement>(null);
  const bgWord = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from(`.${styles.heroInner} > *`, {
        y: 46,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
      });
      gsap.from(`.${styles.heroReel}`, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.35,
        ease: 'power3.out',
      });
      gsap.from(`.${styles.catChip}`, {
        y: 18,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        delay: 0.5,
        ease: 'power3.out',
      });

      if (bgWord.current) {
        gsap.to(bgWord.current, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>(`.${styles.reveal}`).forEach((el) => {
        gsap.from(el, {
          y: 54,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 84%' },
        });
      });

      gsap.utils.toArray<HTMLElement>(`.${styles.stagger}`).forEach((c) => {
        gsap.from(Array.from(c.children), {
          y: 44,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: c, start: 'top 86%' },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={styles.page}>
      <TopOfferBar
        tone="red"
        label="90 Day Content Plan"
        sub="Before you pay anything"
        href="#start"
      />

      <div ref={bgWord} className={styles.bgWord} aria-hidden="true">
        MEDIA
      </div>

      <div className={styles.content}>
        {/* ================= HERO ================= */}
        <header className={styles.hero}>
          <div className={styles.heroFade} aria-hidden="true" />

          <div className={styles.bar + ' ' + styles.barTop} aria-hidden="true">
            <div className={styles.sprockets}>
              {Array.from({ length: 40 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroInner}>
              <p className={styles.eyebrow}>Media Production</p>

              <div className={styles.offerTag}>
                <span className={styles.offerDot} />
                Free 90 day content plan · before you pay anything
              </div>

              <h1 className={styles.heroTitle}>
                WE MAKE YOUR BRAND
                <br />
                <span className={styles.accent}>IMPOSSIBLE</span>{' '}
                <span className={styles.outline}>TO FORGET</span>
              </h1>

              <p className={styles.heroSub}>
                Cinematic media production. Brand films, commercials, social
                content, event coverage, and aerial, shot to look premium and
                built to move people. Tell us about your business and we&apos;ll
                map the exact content we&apos;d shoot for you, free.
              </p>

              <div className={styles.ctaRow}>
                <a href="#start" className={styles.btnPrimary}>
                  Get my content plan →
                </a>
                <Link href="/work" className={styles.btnGhost}>
                  See the full portfolio
                </Link>
              </div>
            </div>

            <div className={styles.heroReel}>
              <span className={styles.reelBadge}>
                <span className={styles.dot} /> Now Reeling
              </span>
              <WebPreviewVideo
                videoId={HERO_REEL_ID}
                startAt={89}
                className={styles.heroReelVideo}
                ariaLabel="Sweet Dreams media production reel"
              />
            </div>
          </div>

          <nav className={styles.catNav} aria-label="Production categories">
            {categories.map((c) => (
              <a key={c.href} href={c.href} className={styles.catChip}>
                <span>{c.n}</span>
                {c.label}
              </a>
            ))}
          </nav>

          <div className={styles.bar + ' ' + styles.barBottom} aria-hidden="true">
            <div className={styles.sprockets}>
              {Array.from({ length: 40 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>
        </header>

        {/* ================= COMMERCIALS ================= */}
        <section id="brand-story" className={styles.band}>
          <div className={styles.shell}>
            <div className={`${styles.bandHead} ${styles.reveal}`}>
              <p className={styles.eyebrow}>
                <span className={styles.bandCount}>01 · Films people remember</span>
              </p>
              <h2 className={styles.bandTitle}>Commercials.</h2>
              <p className={styles.bandLede}>
                Cinema grade commercials built to make people feel something,
                because the ad that moves you is the one you remember, and premium
                footage reads as a premium brand.
              </p>
            </div>

            <div className={styles.bandLead + ' ' + styles.reveal}>
              <ReelTile reel={commLead} feature />
            </div>
            <div className={styles.bandStrip + ' ' + styles.stagger}>
              {commTiles.map((r) => (
                <ReelTile key={r.id} reel={r} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= SOCIAL & CONTENT ================= */}
        <section id="social-content" className={`${styles.band} ${styles.bandAlt}`}>
          <div className={styles.shell}>
            <div className={`${styles.bandHead} ${styles.reveal}`}>
              <p className={styles.eyebrow}>
                <span className={styles.bandCount}>02 · Stop the scroll</span>
              </p>
              <h2 className={styles.bandTitle}>Social Media Content.</h2>
              <p className={styles.bandLede}>
                Vertical social content built for the feed, designed to show up
                daily where attention actually lives.
              </p>
            </div>

            <div className={styles.socialReels}>
              {socialReels.map((r) => (
                <SocialReel
                  key={r.id}
                  videoId={r.id}
                  name={r.name}
                  tag={r.tag}
                  startAt={r.start ?? 1}
                />
              ))}
            </div>

            <div className={styles.offerBar + ' ' + styles.reveal}>
              <div>
                <p className={styles.offerBadge}>Free · No cost to start</p>
                <h3 className={styles.offerTitle}>
                  3 months of content.
                  <br />
                  You do nothing.
                </h3>
                <p className={styles.offerCopy}>
                  We&apos;ll plan, shoot, and schedule a full 90 days of posts for
                  your business, so you show up every single day without lifting a
                  finger. See the whole plan before you spend a dollar.
                </p>
                <Link href="/content-roadmap" className={styles.btnPrimary}>
                  Get the 90 day plan →
                </Link>
              </div>

              <div className={styles.persuade}>
                <div className={styles.persuadeItem}>
                  <h4 className={styles.persuadeHead}>
                    Content that keeps them watching
                  </h4>
                  <p className={styles.persuadeBody}>
                    Every piece is engineered to earn the next second of attention,
                    with hooks that stop the scroll and stories that hold it.
                  </p>
                </div>
                <div className={styles.persuadeItem}>
                  <h4 className={styles.persuadeHead}>
                    More touchpoints. More trust. More sales.
                  </h4>
                  <p className={styles.persuadeBody}>
                    Posting daily keeps your brand in front of buyers until
                    they&apos;re ready. Familiarity builds trust, and trust is
                    what closes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BRAND FILMS ================= */}
        <section id="live-events" className={styles.band}>
          <div className={styles.shell}>
            <div className={`${styles.bandHead} ${styles.reveal}`}>
              <p className={styles.eyebrow}>
                <span className={styles.bandCount}>03 · The story of your brand</span>
              </p>
              <h2 className={styles.bandTitle}>Brand Films.</h2>
              <p className={styles.bandLede}>
                Story driven brand films and trailers that show who you are, not
                just what you sell, the kind of film a brand runs for years.
              </p>
            </div>

            <div className={styles.bandLead + ' ' + styles.reveal}>
              <ReelTile reel={brandLead} feature />
            </div>
            <div className={styles.bandStrip + ' ' + styles.stagger}>
              {brandTiles.map((r) => (
                <ReelTile key={r.id} reel={r} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= EVENT RECAP ================= */}
        <section id="event-recap" className={`${styles.band} ${styles.bandAlt}`}>
          <div className={styles.shell}>
            <div className={`${styles.bandHead} ${styles.reveal}`}>
              <p className={styles.eyebrow}>
                <span className={styles.bandCount}>04 · Capture the room</span>
              </p>
              <h2 className={styles.bandTitle}>Event Recap.</h2>
              <p className={styles.bandLede}>
                Full event coverage and recap films that capture the energy in the
                room, proof you can run for months after the lights go down.
              </p>
            </div>

            <div className={styles.bandLead + ' ' + styles.reveal}>
              <ReelTile reel={eventLead} feature />
            </div>
            <div className={styles.bandStrip + ' ' + styles.stagger}>
              {eventTiles.map((r) => (
                <ReelTile key={r.id} reel={r} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= AERIAL & MOTION ================= */}
        <section id="aerial-motion" className={styles.band}>
          <div className={styles.shell}>
            <div className={`${styles.bandHead} ${styles.reveal}`}>
              <p className={styles.eyebrow}>
                <span className={styles.bandCount}>05 / Aerial &amp; Motion</span>
              </p>
              <h2 className={styles.bandTitle}>Scale from above.</h2>
              <p className={styles.bandLede}>
                Licensed drone cinematography and hyperlapse motion that make your
                brand look bigger, bolder, and built for the big screen.
              </p>
            </div>

            <div className={styles.bandLead + ' ' + styles.reveal}>
              <ReelTile reel={aerialLead} feature />
            </div>
            <div className={styles.bandStrip + ' ' + styles.stagger}>
              {aerialTiles.map((r) => (
                <ReelTile key={r.id} reel={r} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= CAPTURE ================= */}
        <section id="start" className={styles.formSection}>
          <div className={styles.shell}>
            <div className={styles.formWrap}>
              <div className={`${styles.formPitch} ${styles.reveal}`}>
                <p className={styles.eyebrow}>The free offer</p>
                <h2 className={styles.bandTitle}>
                  Get your <span className={styles.accent}>free</span>
                  <br />
                  brand content plan.
                </h2>
                <p className={styles.bandLede}>
                  We&apos;ll map the exact content we&apos;d shoot for your
                  business. The concepts, the formats, the shot list, before you
                  spend a dollar. No pressure, just a plan you can keep.
                </p>
                <ul className={styles.freeList}>
                  <li>A tailored shoot map built around your goals</li>
                  <li>The formats that fit your audience and channels</li>
                  <li>Cinematic direction that makes you look premium</li>
                  <li>Zero cost, zero commitment to see the plan</li>
                </ul>
                <Link href="/content-roadmap" className={styles.planLink}>
                  Or grab the free 90 day content plan →
                </Link>
              </div>

              <div className={styles.formHost}>
                <FunnelForm
                  funnel="media-production"
                  steps={steps}
                  successTitle="Your plan is on the way."
                  successBody="We'll map the exact content we'd shoot for you and reach out shortly."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= CLOSING ================= */}
        <section className={styles.closing}>
          <div className={styles.reveal}>
            <p className={styles.eyebrow} style={{ justifyContent: 'center' }}>
              Sweet Dreams · Fort Wayne
            </p>
            <h2 className={styles.closingTitle}>
              LIGHTS. CAMERA.
              <br />
              <span className={styles.accent}>UNFORGETTABLE.</span>
            </h2>
            <p className={styles.closingSub}>
              The content you&apos;d be proud to run is one conversation away.
              Let&apos;s map it out.
            </p>
            <div className={styles.closingCtas}>
              <a href="#start" className={styles.btnPrimary}>
                Get my content plan →
              </a>
              <Link href="/book" className={styles.btnGhost}>
                Book a call
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
