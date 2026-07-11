'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import Hls from 'hls.js';
import styles from './VideoHero.module.css';

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

// Crossfade opacity/offset for scene `i` given overall scrub progress `p`.
// Scenes hand off in the last 15% of each third; the last scene never fades.
function sceneStyle(i: number, p: number, count: number) {
  const f = Math.min(count - 0.0001, p * count);
  const idx = Math.floor(f);
  const frac = f - idx;
  const hand = 0.85;
  if (i === idx) {
    if (idx === count - 1 || frac < hand) return { o: 1, y: 0 };
    const t = (frac - hand) / (1 - hand);
    return { o: 1 - t, y: -14 * t };
  }
  if (i === idx + 1) {
    if (frac < hand) return { o: 0, y: 14 };
    const t = (frac - hand) / (1 - hand);
    return { o: t, y: 14 * (1 - t) };
  }
  return { o: 0, y: 14 };
}

export default function VideoHero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const hero = rootRef.current;
    const video = videoRef.current;
    if (!hero || !video) return;

    // Load HLS into the <video> so we can control currentTime by scroll.
    const src = `${CF}/${HERO_VIDEO_ID}/manifest/video.m3u8`;
    let hls: Hls | null = null;
    const seekStart = () => {
      try {
        video.currentTime = START;
      } catch {
        /* seeks once ready */
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

    const scenes = Array.from(
      hero.querySelectorAll<HTMLElement>(`.${styles.scene}`)
    );
    const showFirst = () => {
      scenes.forEach((s, i) => {
        s.style.opacity = i === 0 ? '1' : '0';
        s.style.transform = 'translateY(0px)';
      });
    };

    // gsap.matchMedia re-runs (and cleans up) each branch on breakpoint change,
    // so the treatment never latches to the width at mount.
    const mm = gsap.matchMedia();

    // Desktop: sticky stage + scroll-driven scrub (no ScrollTrigger pin).
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      video.pause();
      seekStart();

      let ticking = false;
      const update = () => {
        ticking = false;
        const total = hero.offsetHeight - window.innerHeight;
        if (total <= 0) return;
        const p = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / total));
        scenes.forEach((s, i) => {
          const { o, y } = sceneStyle(i, p, scenes.length);
          s.style.opacity = String(o);
          s.style.transform = `translateY(${y}px)`;
        });
        if (video.readyState >= 1) {
          const t = START + p * (END - START);
          try {
            video.currentTime = t;
          } catch {
            /* mid-seek */
          }
        }
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      update();

      const entrance = gsap.from(
        `.${styles.eyebrow}, .${styles.sub}, .${styles.ctas}`,
        { y: 22, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
      );

      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        entrance.kill();
      };
    });

    // Mobile (motion ok): no scrub. First headline; loop the clip gently.
    mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      showFirst();
      video.loop = true;
      video.muted = true;
      video.play().catch(() => {});
      const entrance = gsap.from(`.${styles.inner} > *`, {
        y: 22,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.1,
      });
      return () => {
        entrance.kill();
        video.pause();
      };
    });

    // Reduced motion (any width): static first frame, first headline.
    mm.add('(prefers-reduced-motion: reduce)', () => {
      showFirst();
      video.pause();
      seekStart();
    });

    return () => {
      mm.revert();
      if (hls) hls.destroy();
    };
  }, []);

  return (
    <section className={styles.hero} ref={rootRef}>
      <div className={styles.sticky}>
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
      </div>
    </section>
  );
}
