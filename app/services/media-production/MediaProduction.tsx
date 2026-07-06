'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Hls from 'hls.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import styles from './media.module.css';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';
const poster = (id: string, t: number) =>
  `${CF}/${id}/thumbnails/thumbnail.jpg?time=${t}s&height=600`;

/* ---------- capture form config (identical across pages) ---------- */
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

/* ---------- offerings ---------- */
const offerings = [
  { name: 'Brand Films', how: 'The story that makes people feel something — cinema quality reads as premium.' },
  { name: 'Commercials', how: 'One message made unforgettable, ready for TV and paid social.' },
  { name: 'Social Content', how: 'Show up daily where attention lives — consistency builds trust.' },
  { name: 'Aerial & Drone', how: 'Scale and scope that make you look bigger and bolder.' },
  { name: 'Event Coverage', how: 'Turn one day into months of content and proof.' },
  { name: 'Recruiting Video', how: 'Attract better people by showing the culture, not telling it.' },
];

/* ---------- proof of work ---------- */
const proof = [
  { name: 'Nissan of Elgin', tag: 'Acquisition Recap', id: '66f28edb4b5c20354896a437b7be5220', t: 5, href: '/work/nissan-elgin-acquisition-recap' },
  { name: 'Coleman — Back to the Future', tag: 'Commercial', id: '7943215ed685238e8ca63bc3617f807d', t: 8, href: '/work/coleman-back-to-the-future-commercial' },
  { name: 'The Coleman Prime Story', tag: 'Brand Trailer', id: 'd08682649901944d9bbec1dcfb8bde88', t: 89, href: '/work/the-coleman-prime-story' },
  { name: 'Breastie Box', tag: 'Brand Film', id: 'cd386f606ba61022ba3e608f684b3c80', t: 15, href: '/work/breastie-box-brand-film' },
  { name: 'M.O.M.', tag: 'Nonprofit Film', id: 'a03f0e00cd2fda4a43464adec197c0b6', t: 5, href: '/work/mom-nonprofit-brand-film' },
  { name: 'Fort Wayne State of the City', tag: 'Event Coverage', id: 'd8719a81b378ac68b2c64e1cd2819a3e', t: 5, href: '/work/fort-wayne-state-of-the-city' },
];

const HERO_REEL_ID = 'd08682649901944d9bbec1dcfb8bde88';

/* autoplay muted looping HLS — same technique as FunnelReel */
function useHls(ref: React.RefObject<HTMLVideoElement | null>, videoId: string) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const src = `${CF}/${videoId}/manifest/video.m3u8`;
    let hls: Hls | null = null;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
    }
    return () => {
      if (hls) hls.destroy();
    };
  }, [ref, videoId]);
}

export default function MediaProduction() {
  const root = useRef<HTMLDivElement>(null);
  const heroVideo = useRef<HTMLVideoElement>(null);
  const bgWord = useRef<HTMLDivElement>(null);

  useHls(heroVideo, HERO_REEL_ID);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // hero intro
      gsap.from(`.${styles.heroInner} > *`, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      });
      gsap.from(`.${styles.heroReel}`, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out',
      });

      // parallax drift on the big background word
      if (bgWord.current) {
        gsap.to(bgWord.current, {
          yPercent: 22,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      }

      // section headings reveal
      gsap.utils.toArray<HTMLElement>(`.${styles.reveal}`).forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        });
      });

      // offerings — staggered film-strip rows
      gsap.from(`.${styles.offerRow}`, {
        x: -40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.offerings}`, start: 'top 78%' },
      });

      // proof cards — staggered reveal
      gsap.from(`.${styles.proofCard}`, {
        y: 70,
        opacity: 0,
        scale: 0.96,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.proofGrid}`, start: 'top 80%' },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={styles.page}>
      {/* big faint background word */}
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

          <div className={styles.heroInner}>
            <p className={styles.kicker}>Sweet Dreams — Media Production</p>

            <div className={styles.offerTag}>
              <span className={styles.offerDot} />
              Free brand content plan — before you pay anything
            </div>

            <h1 className={styles.heroTitle}>
              WE MAKE YOUR BRAND
              <br />
              <span className={styles.accent}>IMPOSSIBLE</span>{' '}
              <span className={styles.outline}>TO FORGET</span>
            </h1>

            <p className={styles.heroSub}>
              Cinematic media production — brand films, commercials, and social
              content shot to look premium and built to move people. Tell us about
              your business and we&apos;ll map the exact content we&apos;d shoot for
              you, free.
            </p>

            <div className={styles.ctaRow}>
              <a href="#start" className={styles.btnPrimary}>
                Get my free content plan →
              </a>
              <a href="#work" className={styles.btnGhost}>
                See the reel
              </a>
            </div>
          </div>

          <div className={styles.heroReel}>
            <span className={styles.reelBadge}>
              <span className={styles.dot} /> Now Reeling
            </span>
            <video
              ref={heroVideo}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              poster={poster(HERO_REEL_ID, 89)}
            />
          </div>

          <div className={styles.bar + ' ' + styles.barBottom} aria-hidden="true">
            <div className={styles.sprockets}>
              {Array.from({ length: 40 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>
        </header>

        {/* ================= OFFERINGS ================= */}
        <section className={styles.section}>
          <div className={styles.shell}>
            <div className={styles.reveal}>
              <p className={styles.kicker}>What we shoot</p>
              <h2 className={styles.secHead}>
                Every format,
                <br />
                one obsession: memorable.
              </h2>
              <p className={styles.secLede}>
                Each piece is engineered for higher quality and impossible to
                forget — so your brand doesn&apos;t just get seen, it gets
                remembered.
              </p>
            </div>

            <div className={styles.offerings}>
              {offerings.map((o, i) => (
                <div key={o.name} className={styles.offerRow}>
                  <span className={styles.offerNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.offerBody}>
                    <h3 className={styles.offerName}>{o.name}</h3>
                    <p className={styles.offerHow}>{o.how}</p>
                  </div>
                  <span className={styles.offerArrow} aria-hidden="true">
                    ↗
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PROOF OF WORK ================= */}
        <section id="work" className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.shell}>
            <div className={styles.reveal}>
              <p className={styles.kicker}>Proof of work</p>
              <h2 className={styles.secHead}>Roll the footage.</h2>
              <p className={styles.secLede}>
                Real brands. Real productions. Every frame below shipped for a
                client — press play on the work.
              </p>
            </div>

            <div className={styles.proofGrid}>
              {proof.map((p, i) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className={`${styles.proofCard} ${
                    i === 0 ? styles.proofFeature : ''
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.proofImg}
                    src={poster(p.id, p.t)}
                    alt={`${p.name} — ${p.tag}`}
                    loading="lazy"
                  />
                  <div className={styles.proofScrim} />
                  <span className={styles.proofWatch}>Watch →</span>
                  <div className={styles.proofMeta}>
                    <span className={styles.proofTag}>{p.tag}</span>
                    <h3 className={styles.proofName}>{p.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FORM ================= */}
        <section id="start" className={styles.formSection}>
          <div className={styles.shell}>
            <div className={styles.formWrap}>
              <div className={`${styles.formPitch} ${styles.reveal}`}>
                <p className={styles.kicker}>The free offer</p>
                <h2 className={styles.secHead}>
                  Get your brand
                  <br />
                  content plan.
                </h2>
                <p className={styles.secLede}>
                  We&apos;ll map the exact content we&apos;d shoot for your
                  business — the concepts, the formats, the shot list — before you
                  spend a dollar. No pressure, just a plan you can keep.
                </p>
                <ul className={styles.freeList}>
                  <li>A tailored shoot map built around your goals</li>
                  <li>The formats that fit your audience and channels</li>
                  <li>Cinematic direction that makes you look premium</li>
                  <li>Zero cost, zero commitment to see the plan</li>
                </ul>
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
            <p className={styles.kicker} style={{ justifyContent: 'center' }}>
              Sweet Dreams — Fort Wayne
            </p>
            <h2 className={styles.closingTitle}>
              LIGHTS. CAMERA.
              <br />
              <span className={styles.accent}>UNFORGETTABLE.</span>
            </h2>
            <p className={styles.closingSub}>
              The content you&apos;d be proud to run is one conversation away. Let&apos;s
              map it out.
            </p>
            <a href="#start" className={styles.btnPrimary}>
              Get my free content plan →
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
