'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import styles from './VideoHero.module.css';

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';
// Heaven in Fort Wayne aerial. We scrub a frame SEQUENCE (Cloudflare per-time
// thumbnails) on a canvas instead of seeking a <video>, so scroll is smooth.
const HERO_VIDEO_ID = 'd8c34ebf7e9bb7a150feaa29cd60a9a6';
const START = 10;
const END = 21;
const FRAME_COUNT = 80; // frames across the scrub (memory ~ count x 3.7MB @720p)
const FRAME_H = 720;

const frameUrl = (i: number) => {
  const t = START + (END - START) * (i / (FRAME_COUNT - 1));
  return `${CF}/${HERO_VIDEO_ID}/thumbnails/thumbnail.jpg?time=${t.toFixed(3)}s&height=${FRAME_H}`;
};
const POSTER_URL = `${CF}/${HERO_VIDEO_ID}/thumbnails/thumbnail.jpg?time=${START}s&height=${FRAME_H}`;

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

// Coarse-first load order so a rough scrub is usable before every frame lands:
// ends, then middle, then progressively finer subdivisions.
function loadOrder(n: number) {
  const order: number[] = [];
  const seen = new Array(n).fill(false);
  const add = (i: number) => {
    if (i >= 0 && i < n && !seen[i]) {
      seen[i] = true;
      order.push(i);
    }
  };
  add(0);
  add(n - 1);
  for (let step = Math.max(1, n >> 1); ; step = step >> 1) {
    for (let i = step; i < n; i += step) add(i);
    if (step === 1) break;
  }
  for (let i = 0; i < n; i++) add(i);
  return order;
}

export default function VideoHero() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = rootRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;

    const scenes = Array.from(
      hero.querySelectorAll<HTMLElement>(`.${styles.scene}`)
    );
    const showFirst = () => {
      scenes.forEach((s, i) => {
        s.style.opacity = i === 0 ? '1' : '0';
        s.style.transform = 'translateY(0px)';
      });
    };

    // Cover-fit draw of an image onto the (DPR-scaled) canvas.
    const drawCover = (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement
    ) => {
      if (!img.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw, dh, dx, dy;
      if (cr > ir) {
        dw = cw;
        dh = cw / ir;
        dx = 0;
        dy = (ch - dh) / 2;
      } else {
        dh = ch;
        dw = ch * ir;
        dy = 0;
        dx = (cw - dw) / 2;
      }
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        return true;
      }
      return false;
    };

    const mm = gsap.matchMedia();

    // Desktop (motion): scroll-scrubbed canvas frame sequence.
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;
      ctx.imageSmoothingQuality = 'high';

      let imgs: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
      const loaded = new Array<boolean>(FRAME_COUNT).fill(false);
      loadOrder(FRAME_COUNT).forEach((i) => {
        const im = new Image();
        im.decoding = 'async';
        im.onload = () => {
          loaded[i] = true;
        };
        im.src = frameUrl(i);
        imgs[i] = im;
      });

      const nearestLoaded = (idx: number) => {
        if (loaded[idx]) return imgs[idx];
        for (let r = 1; r < FRAME_COUNT; r++) {
          if (idx - r >= 0 && loaded[idx - r]) return imgs[idx - r];
          if (idx + r < FRAME_COUNT && loaded[idx + r]) return imgs[idx + r];
        }
        return null;
      };

      sizeCanvas();

      let raf = 0;
      let current = 0;
      let lastDrawn = -1;
      const loop = () => {
        if (sizeCanvas()) lastDrawn = -1; // canvas resized → force redraw
        const total = hero.offsetHeight - window.innerHeight;
        const target =
          total > 0
            ? Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / total))
            : 0;
        // Ease toward the scroll target for smooth, slightly-trailing motion.
        current += (target - current) * 0.15;
        if (Math.abs(target - current) < 0.0006) current = target;

        scenes.forEach((s, i) => {
          const { o, y } = sceneStyle(i, current, scenes.length);
          s.style.opacity = String(o);
          s.style.transform = `translateY(${y}px)`;
        });

        const idx = Math.round(current * (FRAME_COUNT - 1));
        if (idx !== lastDrawn) {
          const img = nearestLoaded(idx);
          if (img) {
            drawCover(ctx, img);
            if (loaded[idx]) lastDrawn = idx;
          }
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      const entrance = gsap.from(
        `.${styles.eyebrow}, .${styles.sub}, .${styles.ctas}`,
        { y: 22, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
      );

      return () => {
        cancelAnimationFrame(raf);
        entrance.kill();
        // release frame bitmaps
        imgs.forEach((im) => {
          if (im) {
            im.onload = null;
            im.src = '';
          }
        });
        imgs = [];
      };
    });

    // Mobile + reduced motion (any width): single static frame, first headline.
    const staticPoster = () => {
      showFirst();
      const ctx = canvas.getContext('2d', { alpha: false });
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => {
        sizeCanvas();
        if (ctx) drawCover(ctx, im);
      };
      im.src = POSTER_URL;
    };
    mm.add('(max-width: 900px)', staticPoster);
    mm.add('(min-width: 901px) and (prefers-reduced-motion: reduce)', staticPoster);

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section className={styles.hero} ref={rootRef}>
      <div className={styles.sticky}>
        {/* Scroll-scrubbed frame sequence on a canvas (poster shows first) */}
        <div
          className={styles.videoWrap}
          aria-hidden="true"
          style={{ backgroundImage: `url(${POSTER_URL})` }}
        >
          <canvas ref={canvasRef} className={styles.videoBg} />
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
