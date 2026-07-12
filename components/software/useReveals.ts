'use client';

import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/**
 * Page-level entrance + scroll animations shared by the Software hub, the
 * Websites page, and the AI page. Scoped to the passed root so it also
 * animates `[data-reveal]` / `[data-stagger]` elements rendered by child
 * components (mockup, pipeline, stats) that live inside the same root.
 *
 * Opt-in via data attributes on the markup:
 *   [data-hero]     — its direct children stagger up on load
 *   [data-bgword]   — the big ghost word, parallaxes on scroll
 *   [data-reveal]   — fades/slides up when scrolled into view
 *   [data-stagger]  — its children stagger up when the group enters view
 *
 * Respects prefers-reduced-motion (skips everything; content stays visible).
 */
export function useReveals(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from('[data-hero] > *', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power3.out',
      });

      // Background word parallax
      gsap.to('[data-bgword]', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      // Generic reveals
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 44,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%' },
        });
      });

      // Staggered groups
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        gsap.from(group.children, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 84%' },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [root]);
}
