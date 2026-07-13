'use client';

import { useRef } from 'react';
import Link from 'next/link';
import WebPreviewVideo from '@/components/web/WebPreviewVideo';
import TopOfferBar from '@/components/TopOfferBar';
import FunnelForm, { type FunnelStep } from '@/components/funnel/FunnelForm';
import { useReveals } from '@/components/software/useReveals';
import s from './websites.module.css';

/* Free demo funnel — same steps and pipeline as /free-website. */
const DEMO_STEPS: FunnelStep[] = [
  {
    question: "What's your {name}?",
    cta: "Let's start",
    fields: [
      { name: 'firstName', placeholder: 'First name', required: true, half: true },
      { name: 'lastName', placeholder: 'Last name', required: true, half: true },
    ],
  },
  {
    question: "What's your {business}?",
    cta: 'Continue',
    fields: [
      { name: 'businessName', placeholder: 'Business name', required: true },
      { name: 'whatYouDo', placeholder: 'What do you do?', required: true },
    ],
  },
  {
    question: 'Where do we {send it}?',
    cta: 'Build mine free',
    fields: [
      { name: 'email', placeholder: 'Email', type: 'email', required: true },
      { name: 'phone', placeholder: 'Phone (optional)', type: 'tel' },
    ],
  },
];

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
          <div className={s.heroGrid}>
            <div className={s.heroInner} data-hero>
              <p className={s.eyebrow}>Websites, Fort Wayne</p>
              <h1 className={s.headline}>
                Websites that <span className={s.hl}>stand out</span>.
              </h1>
              <p className={s.subhead}>
                You are a brand worth looking at. We hand code websites that look
                like it: custom design, cinematic photo and video, and motion
                that makes people stop. Shot and built by a media company, and{' '}
                <b>built before you pay a dollar</b>.
              </p>
              <div className={s.ctaRow}>
                <a href="#start" className={s.ctaPrimary}>
                  Get your free build
                  <span className={s.ctaArrow}>→</span>
                </a>
                <Link href="/book" className={s.ctaGhost}>
                  Book a call
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className={s.heroVisual} data-reveal>
              <div className={s.heroFrame}>
                <div className={s.cardChrome}>
                  <div className={s.chromeDots} aria-hidden="true">
                    <span className={`${s.dot} ${s.dotR}`} />
                    <span className={`${s.dot} ${s.dotY}`} />
                    <span className={`${s.dot} ${s.dotG}`} />
                  </div>
                  <div className={s.cardUrl}>
                    <span aria-hidden="true">🔒 </span>
                    <b>mindsquire.com</b>
                  </div>
                </div>
                <div className={s.cardVideoWrap}>
                  <WebPreviewVideo
                    videoId="4db4384638b438d0f2c3fb9b60a48606"
                    className={s.cardVideo}
                    posterHeight={800}
                    ariaLabel="Preview of the MindSquire website"
                  />
                </div>
              </div>
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

        {/* ==================== FREE DEMO (capture) ==================== */}
        <section className={s.freeBand} id="start">
          <div className={s.shell}>
            <div className={s.freeHead} data-reveal>
              <p className={s.closingKicker}>Built before you pay.</p>
              <h2 className={s.closingLine}>
                See your new site <span className={s.hl}>live</span> first.
              </h2>
              <p className={s.freeSub}>
                We research your business, design a real demo on your brand, shoot
                the media, and send you the live link. Love it and it is yours. If
                not, you owe nothing.
              </p>
            </div>

            <div className={s.freeGrid}>
              <ul className={s.freeList} data-reveal>
                <li className={s.freeListItem}>
                  <span className={s.freeCheck} aria-hidden="true">✦</span>
                  A real, clickable site built on your brand, not a mockup.
                </li>
                <li className={s.freeListItem}>
                  <span className={s.freeCheck} aria-hidden="true">✦</span>
                  Photo and video shot by our media team, included.
                </li>
                <li className={s.freeListItem}>
                  <span className={s.freeCheck} aria-hidden="true">✦</span>
                  Hand coded to load fast and rank, and yours to keep.
                </li>
                <li className={s.freeListItem}>
                  <span className={s.freeCheck} aria-hidden="true">✦</span>
                  No payment and no commitment to see it.
                </li>
              </ul>

              <div className={s.formHost}>
                <FunnelForm
                  funnel="free-website"
                  steps={DEMO_STEPS}
                  successTitle="You're in."
                  successBody="We'll reach out shortly, build your site, and send the live link to click through. No payment, no commitment."
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
