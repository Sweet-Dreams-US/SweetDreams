'use client';

import { useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import PlatformMockup from '@/components/software/PlatformMockup';
import AiPipeline from '@/components/software/AiPipeline';
import BigStats from '@/components/software/BigStats';
import { useReveals } from '@/components/software/useReveals';
import styles from '@/app/software/software.module.css';

/* Done with you, not to you — the answer to "what do they know about MY business". */
const APPROACH = [
  {
    name: 'We teach your team',
    how: 'Hands on sessions where your people learn to actually use AI, on your real work, not generic prompts off the internet.',
  },
  {
    name: 'We build it with you',
    how: 'The workflows come from how you already work, so they fit the jobs no outsider could ever guess from the outside.',
  },
  {
    name: 'Your team owns it',
    how: 'Every workflow we build is yours to run and change. No lock in, no black box, no monthly hostage situation.',
  },
];

/* The model — hourly, flexible, no numbers on the page. */
const MODEL = [
  {
    name: 'Start with a few hours',
    how: 'We find where AI saves the most time in your week, then ship the first workflow together, fast.',
  },
  {
    name: 'Scale as it pays off',
    how: 'Add hours or a monthly block once it is working. Flexible plans, priced by the hour, no big upfront commitment.',
  },
  {
    name: 'It compounds',
    how: 'Each workflow trains your team and stacks on the last, so the output keeps climbing long after we start.',
  },
];

export default function AiWorkflows() {
  const root = useRef<HTMLDivElement>(null);
  useReveals(root);

  return (
    <div
      ref={root}
      className={styles.page}
      style={
        {
          '--accent': '#16a34a',
          '--accent-2': '#4ade80',
          '--accent-ink': '#04160c',
        } as CSSProperties
      }
    >
      <span className={styles.bgWord} data-bgword aria-hidden="true">
        AI
      </span>

      <div className={styles.wrap}>
        <div className={styles.masthead}>
          <span className={styles.mastheadMark}>Sweet Dreams, AI</span>
          <span className={styles.mastheadNote}>AI Workflows / Fort Wayne</span>
        </div>
        <div className={styles.rule} />
      </div>

      {/* ============================ HERO ============================ */}
      <header className={styles.hero}>
        <div className={styles.heroWash} aria-hidden="true" />
        <div className={styles.wrap}>
          <div className={styles.heroInner} data-hero>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              AI Workflows, Fort Wayne
            </p>
            <h1 className={styles.headline}>
              Put <span className={styles.hl}>AI to work</span> in your business.
            </h1>
            <p className={styles.subhead}>
              We work hands on with your team, teach them to use AI, then build
              the workflows that fit how you actually work, so the busywork runs
              itself. Built <b>with</b> your team, not around them, and yours to
              keep.
            </p>

            <div className={styles.ctaRow}>
              <Link href="/book" className={styles.ctaPrimary}>
                Book a call
                <span className={styles.ctaArrow}>→</span>
              </Link>
              <a href="#how" className={styles.ctaSecondary}>
                See how it works
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== DONE WITH YOU ====================== */}
      <section className={styles.section} id="approach">
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              Done with you, not to you
            </p>
            <h2 className={styles.sectionTitle}>
              We do not guess at <span className={styles.hl}>your business</span>.
            </h2>
            <p className={styles.sectionLede}>
              The best AI workflows are the ones nobody could plan from the
              outside. So we do not sell you a black box. We sit with your team,
              teach them, and build around how the work actually gets done.
            </p>
          </div>

          <div className={styles.valueGrid} data-stagger>
            {APPROACH.map((a, i) => (
              <div className={styles.valueItem} key={a.name}>
                <span className={styles.valueNum}>{String(i + 1).padStart(2, '0')}</span>
                <p className={styles.valueName}>{a.name}</p>
                <p className={styles.valueHow}>{a.how}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= HOW IT WORKS ======================= */}
      <section className={styles.section} id="how" style={{ paddingTop: 0 }}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              How it works
            </p>
            <h2 className={styles.sectionTitle}>
              Start small. <span className={styles.hl}>Scale</span> as it pays off.
            </h2>
            <p className={styles.sectionLede}>
              No giant contract to find out if AI helps. We start with a few
              hours, prove it on your real work, and grow from there.
            </p>
          </div>

          <div className={styles.valueGrid} data-stagger>
            {MODEL.map((m, i) => (
              <div className={styles.valueItem} key={m.name}>
                <span className={styles.valueNum}>{String(i + 1).padStart(2, '0')}</span>
                <p className={styles.valueName}>{m.name}</p>
                <p className={styles.valueHow}>{m.how}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== WORKFLOWS WE BUILD =================== */}
      <section className={styles.autoStage} id="workflows">
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              The workflows we build
            </p>
            <h2 className={styles.sectionTitle}>
              Every step, <span className={styles.hl}>connected</span>.
            </h2>
            <p className={styles.sectionLede}>
              Inquiries, bookings, payments, follow up, reporting. AI sits at the
              core and moves the work between them, so the routine handoffs happen
              without anyone touching them.
            </p>
          </div>

          <AiPipeline />
          <BigStats />

          <p className={styles.autoCopy} data-reveal>
            The AI workflows that fit{' '}
            <span className={styles.hl}>how you actually work</span>.
          </p>
        </div>
      </section>

      {/* ================== BUILT ON A REAL SYSTEM ================== */}
      <section className={styles.suiteStage} id="system">
        <div className={styles.suiteGlow} aria-hidden="true" />
        <div className={styles.wrap}>
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.kicker}>
              <span className={styles.kickerBar} />
              Built on a real system
            </p>
            <h2 className={styles.sectionTitle}>
              Not a chatbot. A <span className={styles.hl}>system</span>.
            </h2>
            <p className={styles.sectionLede}>
              To make AI actually run the work, we build the operations system it
              plugs into, in the backend of your own site. This is the kind of
              thing your workflows run on. You own all of it.
            </p>
          </div>

          <PlatformMockup brand="Operations" />

          <div className={styles.ownRow} data-reveal>
            <div>
              <p className={styles.ownTitle}>
                Built <span className={styles.hl}>with</span> your team, owned by
                your <span className={styles.hl}>team</span>.
              </p>
              <p className={styles.ownSub}>
                We teach as we build, so the people who run it every day are the
                ones who understand it. When we are done, it does not need us.
              </p>
            </div>
            <Link href="/websites" className={styles.ctaOnDark}>
              New here? Start with a website
              <span className={styles.ctaArrow}>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================== CLOSING ======================== */}
      <section className={styles.closing}>
        <div className={styles.closingGlow} aria-hidden="true" />
        <div className={styles.wrap}>
          <p className={styles.closingKicker} data-reveal>
            A few hours to start.
          </p>
          <h2 className={styles.closingLine} data-reveal>
            Put <span className={styles.hl}>AI to work</span> in your business.
          </h2>
          <p className={styles.closingSub} data-reveal>
            We will find the busywork worth handing to AI, build the first
            workflow with your team, and go from there.
          </p>
          <div className={styles.closingCtas} data-reveal>
            <Link href="/book" className={styles.ctaLight}>
              Book a call
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <Link href="/software" className={styles.ctaGhost}>
              See the full picture
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
