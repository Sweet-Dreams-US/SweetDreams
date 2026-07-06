'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Hls from 'hls.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import styles from './consulting.module.css';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const CF = 'https://customer-w6h9o08eg118alny.cloudflarestream.com';
const poster = (id: string, t: number) =>
  `${CF}/${id}/thumbnails/thumbnail.jpg?time=${t}s&height=600`;

/* ---- The advisory framework, rendered as a self-drawing roadmap ---- */
const STAGES: { num: string; title: string; how: string }[] = [
  {
    num: 'Stage 01',
    title: 'Growth Strategy',
    how: 'Positioning and a roadmap that compounds over time — so momentum becomes scalable and running like a system.',
  },
  {
    num: 'Stage 02',
    title: 'Offer & Pricing',
    how: 'Package and price so the value is obvious — the moment a lead reads it, the yes is scalable and running like a system.',
  },
  {
    num: 'Stage 03',
    title: 'Operations & SOPs',
    how: 'Document the business so it runs without you — the work becomes scalable and running like a system.',
  },
  {
    num: 'Stage 04',
    title: 'Scaling Systems',
    how: 'Lead-gen, delegation, and retention that stick — growth that stays scalable and running like a system.',
  },
  {
    num: 'Stage 05',
    title: 'Content Systems',
    how: 'A repeatable engine to show up everywhere — presence that is scalable and running like a system.',
  },
  {
    num: 'Stage 06',
    title: 'Partnerships',
    how: 'Performance-based growth with our whole team behind you — an operator bench that keeps you scalable and running like a system.',
  },
];

/* ---- Real proof of work ---- */
const PROOF: {
  name: string;
  tag: string;
  video: string;
  time: number;
  href: string;
  lead?: boolean;
}[] = [
  {
    name: 'Coleman Prime',
    tag: 'Positioning & Story',
    video: 'd08682649901944d9bbec1dcfb8bde88',
    time: 89,
    href: '/work/the-coleman-prime-story',
    lead: true,
  },
  {
    name: 'Prime Dealer Fund',
    tag: 'Brand + Platform',
    video: '652911e44eafee84d9efa47dad31eac5',
    time: 1,
    href: '/work/web-primedealerfund',
  },
  {
    name: 'Nissan of Elgin',
    tag: 'Growth Story',
    video: '66f28edb4b5c20354896a437b7be5220',
    time: 5,
    href: '/work/nissan-elgin-acquisition-recap',
  },
  {
    name: 'Coleman Onboarding',
    tag: 'Hiring Systems',
    video: '313f0b9be3d81f11e7d239fd08a34d38',
    time: 8,
    href: '/work/coleman-onboarding-series',
  },
  {
    name: 'Breastie Box',
    tag: 'Nonprofit Brand',
    video: 'cd386f606ba61022ba3e608f684b3c80',
    time: 15,
    href: '/work/breastie-box-brand-film',
  },
  {
    name: 'MC Racing',
    tag: 'Full Build',
    video: '1ab82de79e003fc0c37afc0a27fedbc4',
    time: 1,
    href: '/work/web-mcracing',
  },
];

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
    cta: 'Book my audit',
    fields: [
      { name: 'email', placeholder: 'Email', type: 'email', required: true },
      { name: 'phone', placeholder: 'Phone (optional)', type: 'tel' },
    ],
  },
];

export default function ConsultingLanding() {
  const root = useRef<HTMLDivElement>(null);
  const spinePath = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Lead clip: HLS autoplay muted loop
      const video = root.current?.querySelector<HTMLVideoElement>(
        '[data-lead-video]'
      );
      let hls: Hls | null = null;
      if (video) {
        const vid = video.dataset.leadVideo!;
        const src = `${CF}/${vid}/manifest/video.m3u8`;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else if (Hls.isSupported()) {
          hls = new Hls({ enableWorker: true });
          hls.loadSource(src);
          hls.attachMedia(video);
        }
      }

      if (reduce) {
        // Make sure the drawn line is fully visible with no animation.
        const path = spinePath.current;
        if (path) {
          path.style.strokeDasharray = 'none';
          path.style.strokeDashoffset = '0';
        }
        return () => {
          if (hls) hls.destroy();
        };
      }

      // Hero staggered entrance
      gsap.from('[data-hero] > *', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power3.out',
      });

      // Parallax drift on the big background word
      gsap.to('[data-bgword]', {
        yPercent: 22,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      // Section heads reveal
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 44,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });

      // ---- The roadmap draws itself ----
      const path = spinePath.current;
      if (path) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-roadmap]',
            start: 'top 72%',
            end: 'bottom 78%',
            scrub: 0.6,
          },
        });
      }

      // Each stage card slides in from its side + node lights up
      gsap.utils.toArray<HTMLElement>('[data-stage]').forEach((stage) => {
        const card = stage.querySelector('[data-stage-card]');
        const node = stage.querySelector('[data-stage-node]');
        const fromLeft = stage.dataset.side === 'left';
        if (card) {
          gsap.from(card, {
            x: fromLeft ? -50 : 50,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: stage, start: 'top 80%' },
          });
        }
        if (node) {
          ScrollTrigger.create({
            trigger: stage,
            start: 'top 62%',
            onEnter: () => node.classList.add(styles.stageNodeOn),
            onLeaveBack: () => node.classList.remove(styles.stageNodeOn),
          });
        }
      });

      // Proof cards staggered reveal
      gsap.from('[data-proof-card]', {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-proof]', start: 'top 78%' },
      });

      return () => {
        if (hls) hls.destroy();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={styles.page}>
      {/* Big faint outlined background word */}
      <span className={styles.bgWord} data-bgword aria-hidden="true">
        STRATEGY
      </span>

      {/* Masthead */}
      <div className={styles.wrap}>
        <div className={styles.masthead}>
          <span className={styles.mastheadMark}>Sweet Dreams — Advisory</span>
          <span className={styles.mastheadNote}>Consulting / Fort Wayne</span>
        </div>
        <div className={styles.rule} />
      </div>

      {/* A. HERO */}
      <header className={styles.hero}>
        <div className={styles.heroWash} aria-hidden="true" />
        <div className={styles.wrap}>
          <div className={styles.heroInner} data-hero>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              Strategy, systems &amp; scale
            </p>
            <h1 className={styles.headline}>
              Build a business that <span className={styles.hl}>runs itself</span>.
              <span className={styles.headlineThin}>
                We find the one bottleneck holding you back — then map the system
                that breaks it.
              </span>
            </h1>
            <p className={styles.subhead}>
              Most owners are the bottleneck. We turn the way you work into a
              documented, delegable system — so growth stops depending on you and
              starts compounding on its own.
            </p>

            <div className={styles.ctaRow}>
              <a href="#start" className={styles.ctaPrimary}>
                Book my free audit
                <span className={styles.ctaArrow}>→</span>
              </a>
              <a href="#framework" className={styles.ctaSecondary}>
                See the framework
              </a>
            </div>

            {/* Free offer / hook */}
            <div className={styles.offer}>
              <span className={styles.offerBadge}>Free Strategy Audit</span>
              <p className={styles.offerText}>
                Get on a call and we find the{' '}
                <strong>one bottleneck</strong> holding you back — then map the{' '}
                <strong>system that breaks it</strong>. No pitch, no fluff: you
                leave with the first move to make, whether you hire us or not.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* B. OFFERINGS as a self-drawing ROADMAP */}
      <section className={styles.section} id="framework">
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <span className={styles.sectionIndex}>01 / The Framework</span>
            <h2 className={styles.sectionTitle}>The roadmap</h2>
          </div>
          <p className={styles.sectionLede} data-reveal>
            Six stages. Each one makes your brand a little more scalable and
            running like a system. We start wherever your bottleneck is.
          </p>

          <div className={styles.roadmap} data-roadmap>
            {/* Self-drawing SVG spine */}
            <svg
              className={styles.roadmapSpine}
              viewBox="0 0 40 1000"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path className={styles.spineTrack} d="M20 0 L20 1000" />
              <path
                ref={spinePath}
                className={styles.spineDraw}
                d="M20 0 L20 1000"
              />
            </svg>

            {STAGES.map((s, i) => {
              const side = i % 2 === 0 ? 'left' : 'right';
              return (
                <div
                  key={s.title}
                  className={`${styles.stage} ${
                    side === 'left' ? styles.stageLeft : styles.stageRight
                  }`}
                  data-stage
                  data-side={side}
                >
                  <div className={styles.stageCard} data-stage-card>
                    <p className={styles.stageNum}>{s.num}</p>
                    <h3 className={styles.stageTitle}>{s.title}</h3>
                    <p className={styles.stageHow}>{s.how}</p>
                  </div>
                  <span
                    className={styles.stageNode}
                    data-stage-node
                    aria-hidden="true"
                  />
                  <span className={styles.stageSpacer} aria-hidden="true" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* C. PROOF OF WORK */}
      <section className={styles.section} data-proof>
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <span className={styles.sectionIndex}>02 / Proof</span>
            <h2 className={styles.sectionTitle}>Systems we&apos;ve built</h2>
          </div>
          <p className={styles.sectionLede} data-reveal>
            Positioning, platforms, hiring engines and brand films — real
            businesses we made scalable and running like a system.
          </p>

          <div className={styles.proofGrid}>
            {PROOF.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className={`${styles.proofCard} ${
                  p.lead ? styles.proofCardLead : ''
                }`}
                data-proof-card
              >
                <div className={styles.proofMediaWrap}>
                  {p.lead ? (
                    <video
                      className={styles.proofVideo}
                      data-lead-video={p.video}
                      poster={poster(p.video, p.time)}
                      muted
                      autoPlay
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className={styles.proofImg}
                      src={poster(p.video, p.time)}
                      alt={`${p.name} — ${p.tag}`}
                      loading="lazy"
                    />
                  )}
                </div>
                <span className={styles.proofArrow} aria-hidden="true">
                  ↗
                </span>
                <div className={styles.proofOverlay}>
                  <span className={styles.proofTag}>{p.tag}</span>
                  <h3 className={styles.proofName}>{p.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* D. CAPTURE FORM */}
      <section className={styles.startSection} id="start">
        <div className={styles.wrap}>
          <div className={styles.startGrid}>
            <div className={styles.startCopy} data-reveal>
              <h2 className={styles.startTitle}>
                Claim your <span className={styles.hl}>free audit</span>.
              </h2>
              <p className={styles.startBody}>
                Tell us where you are. We&apos;ll review your business before the
                call and show up with the one bottleneck to break first — and the
                system that breaks it.
              </p>
              <ul className={styles.startPoints}>
                <li className={styles.startPoint}>
                  <span className={styles.startCheck}>✓</span>
                  One clear bottleneck, named on the call
                </li>
                <li className={styles.startPoint}>
                  <span className={styles.startCheck}>✓</span>
                  The system that breaks it, mapped out
                </li>
                <li className={styles.startPoint}>
                  <span className={styles.startCheck}>✓</span>
                  No pitch required — the plan is yours to keep
                </li>
              </ul>
            </div>

            <div className={styles.formHost}>
              <FunnelForm
                funnel="consulting"
                steps={steps}
                successTitle="We'll be in touch."
                successBody="We'll review your business and come to the call with the one bottleneck to break first."
              />
            </div>
          </div>
        </div>
      </section>

      {/* E. CLOSING */}
      <section className={styles.closing}>
        <div className={styles.wrap}>
          <h2 className={styles.closingLine} data-reveal>
            Stop being the <span className={styles.hl}>bottleneck</span>.
          </h2>
          <p className={styles.closingSub} data-reveal>
            The best time to systemize was a year ago. The second best time is one
            free call away.
          </p>
          <a href="#start" className={styles.ctaPrimary} data-reveal>
            Book my free audit
            <span className={styles.ctaArrow}>→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
