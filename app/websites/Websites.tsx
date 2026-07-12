'use client';

import { useRef } from 'react';
import Link from 'next/link';
import WebPreviewVideo from '@/components/web/WebPreviewVideo';
import TopOfferBar from '@/components/TopOfferBar';
import { useReveals } from '@/components/software/useReveals';
import s from './websites.module.css';

/* Four curated builds shown up top; full set lives on the portfolio. */
const FEATURED = [
  { name: 'MC Racing', videoId: '1ab82de79e003fc0c37afc0a27fedbc4', chrome: 'mcracingfortwayne.com', tag: 'Motorsports' },
  { name: 'Creator Space', videoId: '37a027a19196653d4ef79b6c2f5f5758', chrome: 'creatorspacefw.com', tag: 'Creative' },
  { name: 'Bite Me Protein', videoId: 'a7969078d27d7d15394978d0c02cc306', chrome: 'Bite Me Protein', tag: 'Product' },
  { name: 'Prime Dealer Fund', videoId: '652911e44eafee84d9efa47dad31eac5', chrome: 'primedealerfund.com', tag: 'Finance' },
];

/* Why it stands out — the six reasons, as simple colored bullets. */
const REASONS = [
  { name: 'Hand coded', desc: 'Custom from scratch, no templates. It looks like nothing else on the internet.' },
  { name: 'Media included', desc: 'Pro photo and video, shot for your brand. We are a media company first.' },
  { name: 'Designed to stand out', desc: 'Bold and art directed, built to be remembered, not another look alike.' },
  { name: 'Motion and cinema', desc: 'Animation and video that make people stop scrolling and feel the brand.' },
  { name: 'Yours to keep', desc: 'Your brand, your domain, your code, never held hostage.' },
  { name: 'Fast and found', desc: 'Hand coded to load fast and still rank in your city on Google.' },
];

/* How it works — the free spec build. */
const STEPS = [
  { name: 'Built before you pay', desc: 'We design a real demo on your brand first. You see it live before you spend a dollar.' },
  { name: 'Shot for your brand', desc: 'Our media team captures the photo and video, so the site is built on real footage of you.' },
  { name: 'Launched and yours', desc: 'Hand coded, fast, and cared for on managed hosting. Your brand, your code, yours to keep.' },
];

export default function Websites() {
  const root = useRef<HTMLDivElement>(null);
  useReveals(root);

  return (
    <div ref={root} className={s.page}>
      <TopOfferBar
        tone="blue"
        label="Website"
        sub="Built before you pay a dollar"
        href="/free-website"
      />

      <span className={s.bgWord} data-bgword aria-hidden="true">
        WEB
      </span>

      <div className={s.content}>
        {/* ============================ HERO ============================ */}
        <header className={s.hero}>
          <div className={s.heroGlow} aria-hidden="true" />
          <div className={s.heroInner} data-hero>
            <p className={s.eyebrow}>Websites, Fort Wayne</p>
            <h1 className={s.headline}>
              Websites that <span className={s.hl}>stand out</span>.
            </h1>
            <p className={s.subhead}>
              You are a brand worth looking at. We hand code websites that look
              like it: custom design, cinematic photo and video, and motion that
              makes people stop. Shot and built by a media company, and{' '}
              <b>built before you pay a dollar</b>.
            </p>
            <div className={s.ctaRow}>
              <Link href="/free-website" className={s.ctaPrimary}>
                Get your free build
                <span className={s.ctaArrow}>→</span>
              </Link>
              <Link href="/book" className={s.ctaGhost}>
                Book a call
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </header>

        {/* ========================= EXAMPLES ========================= */}
        <section className={s.section} id="work">
          <div className={s.shell}>
            <div className={s.sectionHead} data-reveal>
              <p className={s.kicker}>
                <span className={s.kickerBar} />
                Sites we have built
              </p>
              <h2 className={s.sectionTitle}>
                Real builds, <span className={s.hl}>real brands</span>.
              </h2>
              <p className={s.sectionLede}>
                Every one hand coded from scratch, with the photo and video shot
                by our media team. Hover to watch them move.
              </p>
            </div>

            <div className={s.showcase} data-stagger>
              {FEATURED.map((p) => {
                const hasDomain = p.chrome.includes('.');
                return (
                  <div className={s.card} key={p.name}>
                    <div className={s.cardChrome}>
                      <div className={s.chromeDots} aria-hidden="true">
                        <span className={`${s.dot} ${s.dotR}`} />
                        <span className={`${s.dot} ${s.dotY}`} />
                        <span className={`${s.dot} ${s.dotG}`} />
                      </div>
                      <div className={s.cardUrl}>
                        {hasDomain && <span aria-hidden="true">🔒 </span>}
                        <b>{p.chrome}</b>
                      </div>
                    </div>
                    <div className={s.cardVideoWrap}>
                      <WebPreviewVideo
                        videoId={p.videoId}
                        className={s.cardVideo}
                        ariaLabel={`Preview of the ${p.name} website`}
                      />
                    </div>
                    <div className={s.cardFoot}>
                      <p className={s.cardName}>{p.name}</p>
                      <span className={s.cardTag}>{p.tag}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={s.portfolioRow} data-reveal>
              <Link href="/work#websites" className={s.portfolioBtn}>
                View full website portfolio
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== WHY IT STANDS OUT ==================== */}
        <section className={s.section} id="why" style={{ paddingTop: 0 }}>
          <div className={s.shell}>
            <div className={s.sectionHead} data-reveal>
              <p className={s.kicker}>
                <span className={s.kickerBar} />
                Why it stands out
              </p>
              <h2 className={s.sectionTitle}>
                Not a template. A <span className={s.hl}>statement</span>.
              </h2>
            </div>

            <div className={s.bullets} data-stagger>
              {REASONS.map((r) => (
                <div className={s.bullet} key={r.name}>
                  <span className={s.bulletMark} aria-hidden="true">✦</span>
                  <div>
                    <p className={s.bulletName}>{r.name}</p>
                    <p className={s.bulletDesc}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================= HOW IT WORKS ======================= */}
        <section className={s.section} id="how" style={{ paddingTop: 0 }}>
          <div className={s.shell}>
            <div className={s.sectionHead} data-reveal>
              <p className={s.kicker}>
                <span className={s.kickerBar} />
                How it works
              </p>
              <h2 className={s.sectionTitle}>
                You see it live <span className={s.hl}>first</span>.
              </h2>
              <p className={s.sectionLede}>
                No big deposit to find out what you are getting. We design a real
                demo on your brand, shoot the media, then you decide.
              </p>
            </div>

            <div className={s.steps} data-stagger>
              {STEPS.map((step, i) => (
                <div className={s.step} key={step.name}>
                  <span className={s.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                  <p className={s.stepName}>{step.name}</p>
                  <p className={s.stepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>

            {/* quiet AI hint, not the focal point */}
            <p className={s.aiHint} data-reveal>
              Down the line, we also teach teams to put AI to work.{' '}
              <Link href="/ai">Learn about our AI workflows and education →</Link>
            </p>
          </div>
        </section>

        {/* ======================== CLOSING ======================== */}
        <section className={s.closing}>
          <div className={s.closingGlow} aria-hidden="true" />
          <div className={s.shell}>
            <p className={s.closingKicker} data-reveal>Built before you pay.</p>
            <h2 className={s.closingLine} data-reveal>
              See your new site <span className={s.hl}>live</span> first.
            </h2>
            <p className={s.closingSub} data-reveal>
              We research your business, design a real demo on your brand, shoot
              the media, and send you the link. Then you decide.
            </p>
            <div className={s.closingCtas} data-reveal>
              <Link href="/free-website" className={s.ctaPrimary}>
                Get your free build
                <span className={s.ctaArrow}>→</span>
              </Link>
              <Link href="/book" className={s.ctaGhost}>
                Book a call
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
