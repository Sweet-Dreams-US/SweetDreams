'use client';

import { useEffect, useState } from 'react';
import ai from './ai.module.css';

/* The busywork AI takes off the team's plate — shown running live. */
const TASKS = [
  'Reading new inquiries',
  'Drafting personalized replies',
  'Scheduling the follow ups',
  'Updating the CRM',
  'Building the weekly report',
];

/**
 * A dark terminal that shows AI working through a business's busywork on a
 * loop. Green on near-black — the AI brand, made visible. Pure state loop,
 * SSR-safe (starts at step 0 on both sides).
 */
export default function AiConsole() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % (TASKS.length + 2));
    }, 1300);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={ai.console}>
      <div className={ai.consoleBar}>
        <span className={ai.consoleBarDots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={ai.consoleTitle}>sweetdreams · ai</span>
        <span className={ai.consoleLive}>
          <span className={ai.consoleLiveDot} /> live
        </span>
      </div>

      <div className={ai.consoleBody}>
        <p className={ai.consolePrompt}>
          <span className={ai.consoleAccent}>ai</span> run daily-workflows
          <span className={ai.consoleCaret} />
        </p>

        {TASKS.map((t, i) => {
          const done = i < step;
          const running = i === step;
          return (
            <p
              key={t}
              className={ai.consoleLine}
              style={{ opacity: i <= step ? 1 : 0.22 }}
            >
              <span className={ai.consoleMark}>
                {done ? '✓' : running ? '▸' : '·'}
              </span>
              <span>{t}</span>
              {running && <span className={ai.consoleWorking}>working…</span>}
              {done && <span className={ai.consoleDone}>done</span>}
            </p>
          );
        })}

        <p
          className={ai.consoleFoot}
          style={{ opacity: step >= TASKS.length ? 1 : 0 }}
        >
          <span className={ai.consoleAccent}>✓</span> {TASKS.length} tasks handled.
          Your team did nothing.
        </p>
      </div>
    </div>
  );
}
