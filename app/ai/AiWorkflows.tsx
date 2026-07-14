'use client';

import { useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import PlatformMockup from '@/components/software/PlatformMockup';
import AiPipeline from '@/components/software/AiPipeline';
import { useReveals } from '@/components/software/useReveals';
import styles from '@/app/software/software.module.css';
import ai from './ai.module.css';
import AiConsole from './AiConsole';

/* Dark green theme, set on the page root so the whole design system themes. */
const DARK: CSSProperties = {
  '--accent': '#16a34a',
  '--accent-2': '#4ade80',
  '--accent-ink': '#04160c',
  '--ink': '#ffffff',
  '--paper': '#06100b',
  '--paper-2': '#0c1712',
  '--muted': 'rgba(255, 255, 255, 0.62)',
  '--muted-2': 'rgba(255, 255, 255, 0.44)',
  '--line': 'rgba(255, 255, 255, 0.1)',
  '--line-strong': 'rgba(255, 255, 255, 0.16)',
} as CSSProperties;

/* Done with you, not to you — the answer to "what do they know about MY business". */
const APPROACH = [
  {
    name: 'We teach your team',
    how: 'Hands on sessions where your people learn to use AI on your real work, not generic prompts off the internet.',
  },
  {
    name: 'We build it with you',
    how: 'The workflows come from how you already work, so they fit the jobs no outsider could ever guess from the outside.',
  },
  {
    name: 'You own all of it',
    how: 'Your workflows, your data, your accounts. No lock in, no black box, no monthly hostage situation. When we leave, it still runs.',
  },
];

/* The real ladder: free assessment -> build sessions -> monthly coaching. */
const STEPS = [
  {
    name: 'Free AI Assessment',
    how: 'We find what your payroll spends on repetitive computer work, run one automation live on it, and leave you the number: hours a week lost, and what it costs.',
  },
  {
    name: 'Build Sessions',
    how: 'Working sessions where we build the workflows together with your team, one at a time, so they learn it as it gets made.',
  },
  {
    name: 'Monthly Coaching',
    how: 'Ongoing support and new automations, month to month, cancel anytime, until your team runs it all without us.',
  },
];

export default function AiWorkflows() {
  const root = useRef<HTMLDivElement>(null);
  useReveals(root);

  return (
    <div ref={root} className={styles.page} style={DARK}>
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
          <div className={ai.heroGrid}>
            <div className={styles.heroInner} data-hero>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              AI Workflows, Fort Wayne
            </p>
            <h1 className={styles.headline}>
              Put AI to work on your <span className={styles.hl}>busywork</span>.
            </h1>
            <p className={styles.subhead}>
              Your team does the <b>real work</b>. AI does the <b>busywork</b>. We
              sit down with your people, find the repetitive computer work eating
              your payroll, and teach them to hand it to AI. Built with your team
              and yours to keep. It starts with a free AI Assessment.
            </p>

            <div className={styles.ctaRow}>
              <Link
                href="/book"
                className={styles.ctaPrimary}
                style={{ background: 'var(--accent)', color: '#04160c', borderColor: 'var(--accent)' }}
              >
                Book your free AI Assessment
                <span className={styles.ctaArrow}>→</span>
              </Link>
              <a href="#how" className={styles.ctaSecondary}>
                See how it works
                <span aria-hidden="true">↓</span>
              </a>
            </div>
            </div>

            <div className={ai.heroVisual} data-reveal>
              <AiConsole />
            </div>
          </div>
        </div>
      </header>

      {/* ==================== FREE AI ASSESSMENT ==================== */}
      <section className={styles.section} id="assessment" style={{ paddingBottom: 0 }}>
        <div className={styles.wrap}>
          <div className={ai.auditBand} data-reveal>
            <p className={ai.auditLabel}>Start here, free</p>
            <h2 className={ai.auditTitle}>
              The free <span className={ai.hl}>AI Assessment</span>.
            </h2>
            <p className={ai.auditText}>
              In a 30 to 45 minute session, we find what your payroll spends on
              repetitive computer work, run one automation live on it, and leave
              you a number: <b>how many hours a week your team loses, and what that
              costs you</b>. No pitch. No cost.
            </p>

            <ul className={ai.auditPoints} data-stagger>
              <li className={ai.auditPoint}>
                <span className={ai.auditPointNum}>01</span>
                We come prepared, with an automation ready for your kind of work.
              </li>
              <li className={ai.auditPoint}>
                <span className={ai.auditPointNum}>02</span>
                We run it live, on your real work, right there in the room.
              </li>
              <li className={ai.auditPoint}>
                <span className={ai.auditPointNum}>03</span>
                You leave with the number: hours saved a week, and dollars a year.
              </li>
            </ul>

            <div className={ai.auditCtaRow}>
              <Link href="/book" className={ai.auditCta}>
                Book your free assessment
                <span aria-hidden="true">→</span>
              </Link>
              <span className={ai.auditFine}>Fort Wayne and northeast Indiana, in person. Remote available.</span>
            </div>
          </div>
        </div>
      </section>

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
              Assess. Build. <span className={styles.hl}>Then we go</span>.
            </h2>
            <p className={styles.sectionLede}>
              No giant contract to find out if AI helps. We prove it free, build
              the first workflows with your team, and grow from there, one workflow
              at a time.
            </p>
          </div>

          <div className={styles.valueGrid} data-stagger>
            {STEPS.map((m, i) => (
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
              Invoicing, scheduling, inquiries, follow up, research, reporting. AI
              sits at the core and moves the work between them, so the routine
              handoffs happen without anyone touching them.
            </p>
          </div>

          <AiPipeline />

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
                ones who understand it. If your team cannot run it without us, it
                is not finished.
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
      <section className={styles.closing} style={{ background: '#04100a' }}>
        <div className={styles.closingGlow} aria-hidden="true" />
        <div className={styles.wrap}>
          <p className={styles.closingKicker} data-reveal>
            No pitch. No cost.
          </p>
          <h2 className={styles.closingLine} data-reveal>
            See your <span className={styles.hl}>busywork</span> on paper.
          </h2>
          <p className={styles.closingSub} data-reveal>
            Book the free AI Assessment. We will find the busywork worth handing to
            AI, put a real payroll number on it, and build the first workflow with
            your team.
          </p>
          <div className={styles.closingCtas} data-reveal>
            <Link href="/book" className={styles.ctaLight}>
              Book your free assessment
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <a
              href="https://dreamsuite.us"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaGhost}
            >
              Visit DreamSuite.us
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
