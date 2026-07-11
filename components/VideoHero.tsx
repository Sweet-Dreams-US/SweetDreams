'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hls from 'hls.js';
import styles from './VideoHero.module.css';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';
// Heaven in Fort Wayne aerial. Scroll scrubs it from START to END seconds.
const HERO_VIDEO_ID = 'd8c34ebf7e9bb7a150feaa29cd60a9a6';
const START = 10;
const END = 21;

// The headline "options" that scroll brings in, one per third of the scrub.
const SCENES = [
  { a: 'WE MAKE BRANDS', b: 'IMPOSSIBLE TO IGNORE.' },
  { a: 'WE BUILD THE SYSTEMS', b: 'THAT RUN THEM.' },
  { a: 'MEDIA AND SOFTWARE.', b: 'UNDER ONE ROOF.' },
];

const MARQUEE = [
  'BRAND FILMS',
  'WEBSITES',
  'DREAM SUITE',
  'AI AUTOMATIONS',
  'SOCIAL CONTENT',
  'AERIAL',
  'COMMERCIALS',
  'EVENT COVERAGE',
];

export default function VideoHero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    // Load HLS into the <video> so we can control currentTime by scroll.
    const src = `${CF}/${HERO_VIDEO_ID}/manifest/video.m3u8`;
    let hls: Hls | null = null;
    const seekStart = () => {
      try {
        video.currentTime = START;
      } catch {
        /* seek retried when ready */
      }
    };
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', seekStart, { once: true });
    } else if (Hls.isSupported()) {
      hls = new Hls({ maxBufferLength: 40, maxMaxBufferLength: 90 });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, seekStart);
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 900px)').matches;

    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>(`.${styles.scene}`);

      // Fallback (mobile / reduced-motion): no scroll-scrub. Show the first
      // headline; on mobile let the clip loop gently so it isn't a dead frame.
      if (reduced || isMobile) {
        gsap.set(scenes, { autoAlpha: 0 });
        gsap.set(scenes[0], { autoAlpha: 1 });
        if (!reduced) {
          video.loop = true;
          video.muted = true;
          const tryPlay = () => video.play().catch(() => {});
          if (hls) hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
          else video.addEventListener('loadedmetadata', tryPlay, { once: true });
        }
        gsap.from(`.${styles.inner} > *`, {
          y: 22,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.1,
        });
        return;
      }

      // Desktop: pin the hero and let scroll drive the video + headline scenes.
      gsap.set(scenes[0], { autoAlpha: 1, yPercent: 0 });
      gsap.set([scenes[1], scenes[2]], { autoAlpha: 0, yPercent: 14 });

      const proxy = { t: START };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=170%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Scrub the video time across the whole pinned range.
      tl.to(
        proxy,
        {
          t: END,
          ease: 'none',
          duration: 1,
          onUpdate: () => {
            if (video.readyState >= 1) {
              try {
                video.currentTime = proxy.t;
              } catch {
                /* mid-seek */
              }
            }
          },
        },
        0
      );

      // Bring in the different headline options at scroll milestones.
      tl.to(scenes[0], { autoAlpha: 0, yPercent: -14, duration: 0.09, ease: 'power1.in' }, 0.3)
        .to(scenes[1], { autoAlpha: 1, yPercent: 0, duration: 0.11, ease: 'power2.out' }, 0.32)
        .to(scenes[1], { autoAlpha: 0, yPercent: -14, duration: 0.09, ease: 'power1.in' }, 0.62)
        .to(scenes[2], { autoAlpha: 1, yPercent: 0, duration: 0.11, ease: 'power2.out' }, 0.64);

      gsap.from(
        `.${styles.eyebrow}, .${styles.sub}, .${styles.ctas}`,
        { y: 22, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
      );
    }, root);

    return () => {
      ctx.revert();
      if (hls) hls.destroy();
    };
  }, []);

  return (
    <section className={styles.hero} ref={rootRef}>
      {/* Scroll-scrubbed background video */}
      <div className={styles.videoWrap} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.videoBg}
          muted
          playsInline
          preload="auto"
          poster={`${CF}/${HERO_VIDEO_ID}/thumbnails/thumbnail.jpg?time=${START}s&height=900`}
        />
        <div className={styles.scrim} />
        <div className={styles.grain} />
      </div>

      {/* Content */}
      <div className={styles.inner}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          FORT WAYNE · MEDIA + SOFTWARE
        </span>

        <div className={styles.headlineStack}>
          {SCENES.map((s, i) => (
            <h1 className={styles.scene} key={i}>
              <span>{s.a}</span>
              <span className={styles.sceneAccent}>{s.b}</span>
            </h1>
          ))}
        </div>

        <p className={styles.sub}>
          A creative agency and software studio under one roof. Cinematic media
          production and custom platforms, built to grow the business behind the brand.
        </p>

        <div className={styles.ctas}>
          <Link href="/book" className={styles.ctaPrimary}>
            Book a call
            <span className={styles.ctaArrow} aria-hidden="true">
              ↗
            </span>
          </Link>
          <Link href="/work" className={styles.ctaSecondary}>
            See our work
          </Link>
        </div>

        <div className={styles.scrollCue} aria-hidden="true">
          <span className={styles.scrollLine} />
          Scroll
        </div>
      </div>

      {/* Moving marquee */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span className={styles.marqueeItem} key={i}>
              {m}
              <span className={styles.marqueeDot}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
