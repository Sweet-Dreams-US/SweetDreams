'use client';

import { useEffect, useRef } from 'react';
import styles from './WhyUs.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Pure positioning section — no steps, no CTA. This is about who we
// are as a generation and why it gives clients an edge. Lives between
// Partner With Us (which answers "how do you engage?") and Our Friends
// (which answers "who else trusts you?").
export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !headlineRef.current) return;

    const ctx = gsap.context(() => {
      const words = headlineRef.current?.querySelectorAll(`.${styles.headlinePhrase}`);
      if (!words) return;

      gsap.set(words, { y: 40, opacity: 0 });
      gsap.to(words, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <p className={styles.kicker}>WHY US</p>

        <h2 className={styles.headline} ref={headlineRef}>
          <span className={styles.headlinePhrase}>MORE TOUCHPOINTS.</span>{' '}
          <span className={styles.headlinePhrase}>MORE TRUST.</span>{' '}
          <span className={styles.headlinePhrase}>MORE SALES.</span>
        </h2>

        <div className={styles.body}>
          <p className={styles.paragraph}>
            Raised on social media. Trained in trends. We know what works because we live it every day.
          </p>
          <p className={styles.paragraph}>
            We don&apos;t study this from the outside. We&apos;re the generation building it from the
            inside, and your brand gets the benefit of every hour we&apos;ve already spent paying attention.
          </p>
        </div>
      </div>
    </section>
  );
}
