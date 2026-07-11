'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebPreviewVideo from '@/components/web/WebPreviewVideo';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import styles from './media.module.css';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';
const poster = (id: string, t: number) =>
  `${CF}/${id}/thumbnails/thumbnail.jpg?time=${t}s&height=800`;

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

const brandLead: Reel = {
  name: 'Coleman: Back to the Future',
  tag: 'Commercial',
  id: '7943215ed685238e8ca63bc3617f807d',
  start: 8,
};
const brandTiles: Reel[] = [
  { name: 'The Coleman Prime Story', tag: 'Brand Trailer', id: 'd08682649901944d9bbec1dcfb8bde88', start: 89 },
  { name: 'Breastie Box', tag: 'Brand Film', id: 'cd386f606ba61022ba3e608f684b3c80', start: 15 },
  { name: 'Nissan of Elgin', tag: 'Brand Spot', id: '66f28edb4b5c20354896a437b7be5220', start: 5 },
  { name: 'M.O.M.', tag: 'Nonprofit Film', id: 'a03f0e00cd2fda4a43464adec197c0b6', start: 5 },
];

const socialReels: Reel[] = [
  { name: 'Revive', tag: 'Social Reel', id: '62ea7c66a3ad77eadd83bd89c01f98c2' },
  { name: 'Revive', tag: 'Vertical', id: 'f4aa9217c51a8f15aaa849a25763fb57' },
  { name: 'Coleman', tag: 'Recruiting', id: '313f0b9be3d81f11e7d239fd08a34d38', start: 8 },
];

const liveLead: Reel = {
  name: 'Fort Wayne State of the City',
  tag: 'Event Coverage',
  id: 'd8719a81b378ac68b2c64e1cd2819a3e',
  start: 5,
};
const liveTiles: Reel[] = [
  { name: 'Kissel Entertainment', tag: 'Event Recap', id: 'd554360a479b1380f96df7a4ef8f03a3' },
  { name: 'Humane Shelter', tag: 'Charity Film', id: 'a5be567ba670d8e102cf9b507a4ad936' },
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

const photoStills = [
  { id: 'd08682649901944d9bbec1dcfb8bde88', t: 45, label: 'Product' },
  { id: 'cd386f606ba61022ba3e608f684b3c80', t: 30, label: 'Brand' },
  { id: '66f28edb4b5c20354896a437b7be5220', t: 12, label: 'Campaign' },
];

const categories = [
  { n: '01', label: 'Brand & Story', href: '#brand-story' },
  { n: '02', label: 'Social & Content', href: '#social-content' },
  { n: '03', label: 'Live & Events', href: '#live-events' },
  { n: '04', label: 'Aerial & Motion', href: '#aerial-motion' },
  { n: '05', label: 'Photography', href: '#photography' },
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

        {/* ================= BRAND & STORY ================= */}
        <section id="brand-story" className={styles.band}>
          <div className={styles.shell}>
            <div className={`${styles.bandHead} ${styles.reveal}`}>
              <p className={styles.eyebrow}>
                <span className={styles.bandCount}>01 / Brand &amp; Story</span>
              </p>
              <h2 className={styles.bandTitle}>Films people remember.</h2>
              <p className={styles.bandLede}>
                Brand films, commercials, and brand trailers shot at cinema
                quality, because the story that makes people feel something is
                the one they remember, and premium footage reads as a premium
                brand.
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

        {/* ================= SOCIAL & CONTENT ================= */}
        <section id="social-content" className={`${styles.band} ${styles.bandAlt}`}>
          <div className={styles.shell}>
            <div className={`${styles.bandHead} ${styles.reveal}`}>
              <p className={styles.eyebrow}>
                <span className={styles.bandCount}>02 / Social &amp; Content</span>
              </p>
              <h2 className={styles.bandTitle}>Stop the scroll.</h2>
              <p className={styles.bandLede}>
                Vertical social and recruiting content built for the feed,
                designed to show up daily where attention actually lives.
              </p>
            </div>

            <div className={styles.socialReels + ' ' + styles.stagger}>
              {socialReels.map((r) => (
                <div key={r.id} className={styles.vtile}>
                  <WebPreviewVideo
                    videoId={r.id}
                    startAt={r.start ?? 1}
                    className={styles.tileVideo}
                    ariaLabel={`${r.name} · ${r.tag}`}
                  />
                  <span className={styles.tileScrim} aria-hidden="true" />
                  <div className={styles.tileMeta}>
                    <span className={styles.tileTag}>{r.tag}</span>
                    <h3 className={styles.tileName}>{r.name}</h3>
                  </div>
                </div>
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

        {/* ================= LIVE & EVENTS ================= */}
        <section id="live-events" className={styles.band}>
          <div className={styles.shell}>
            <div className={`${styles.bandHead} ${styles.reveal}`}>
              <p className={styles.eyebrow}>
                <span className={styles.bandCount}>03 / Live &amp; Events</span>
              </p>
              <h2 className={styles.bandTitle}>Capture the room.</h2>
              <p className={styles.bandLede}>
                Full event coverage and recap films that capture the energy in the
                room, proof you can run for months after the lights go down.
              </p>
            </div>

            <div className={styles.bandLead + ' ' + styles.reveal}>
              <ReelTile reel={liveLead} feature />
            </div>
            <div className={styles.bandStrip + ' ' + styles.stagger}>
              {liveTiles.map((r) => (
                <ReelTile key={r.id} reel={r} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= AERIAL & MOTION ================= */}
        <section id="aerial-motion" className={`${styles.band} ${styles.bandAlt}`}>
          <div className={styles.shell}>
            <div className={`${styles.bandHead} ${styles.reveal}`}>
              <p className={styles.eyebrow}>
                <span className={styles.bandCount}>04 / Aerial &amp; Motion</span>
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

        {/* ================= PHOTOGRAPHY ================= */}
        <section id="photography" className={styles.band}>
          <div className={styles.shell}>
            <div className={`${styles.bandHead} ${styles.reveal}`}>
              <p className={styles.eyebrow}>
                <span className={styles.bandCount}>05 / Photography</span>
              </p>
              <h2 className={styles.bandTitle}>Stills that sell.</h2>
              <p className={styles.bandLede}>
                Product, food, headshots, and campaign photography, the same
                cinematic eye frozen into a single frame.
              </p>
            </div>

            <div className={styles.photoGrid + ' ' + styles.stagger}>
              {photoStills.map((p) => (
                <div key={`${p.id}-${p.t}`} className={styles.photo}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.photoImg}
                    src={poster(p.id, p.t)}
                    alt={`${p.label} photography still`}
                    loading="lazy"
                  />
                  <span className={styles.photoScrim} aria-hidden="true" />
                  <span className={styles.photoLabel}>{p.label}</span>
                </div>
              ))}
              <div className={styles.photoCard}>
                <h3 className={styles.photoCardHead}>
                  One shoot,
                  <br />
                  every asset.
                </h3>
                <p className={styles.photoCardBody}>
                  We pull stills alongside every production, so your website, ads,
                  and socials all speak the same premium visual language.
                </p>
              </div>
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
                  Get your brand
                  <br />
                  content plan.
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
