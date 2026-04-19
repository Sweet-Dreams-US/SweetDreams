"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import styles from "./page.module.css";

const TURNSTILE_SITE_KEY = "0x4AAAAAACJodExIWnZ-7sQq";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

// ==================== TAB DATA ====================

const TABS = [
  { id: 'media', label: 'Media Production', color: 'tabColorRed' },
  { id: 'marketing', label: 'Marketing', color: 'tabColorYellow' },
  { id: 'web', label: 'Web & Software', color: 'tabColorBlue' },
  { id: 'consulting', label: 'Consulting', color: 'tabColorRed' },
] as const;

type TabId = typeof TABS[number]['id'];

// ==================== ACCORDION COMPONENT ====================

function Accordion({
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
  theme,
}: {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  theme: 'white' | 'black';
}) {
  const isBlack = theme === 'black';
  return (
    <>
      <div
        className={`${isBlack ? styles.accordionHeader : styles.accordionHeaderWhite} ${isOpen ? (isBlack ? styles.accordionOpen : styles.accordionOpenWhite) : ''}`}
        onClick={onToggle}
      >
        <div>
          <h2 className={`${isBlack ? styles.accordionTitle : styles.accordionTitleWhite} ${isOpen ? (isBlack ? styles.titleOpenBlack : styles.titleOpenWhite) : ''}`}>{title}</h2>
          {subtitle && <p className={styles.accordionSubtitle}>{subtitle}</p>}
        </div>
        <span className={`${isBlack ? styles.accordionCaret : styles.accordionCaretWhite} ${isOpen ? styles.caretOpen : ''}`}>
          ▼
        </span>
      </div>
      <div className={`${isBlack ? styles.accordionContent : styles.accordionContentWhite} ${isOpen ? (isBlack ? styles.accordionContentOpen : styles.accordionContentOpenWhite) : ''}`}>
        {children}
      </div>
    </>
  );
}

// ==================== CARD COMPONENT ====================

function Card({ title, features, buttonText, theme }: { title: string; features: string[]; buttonText: string; theme: 'white' | 'black' }) {
  const isBlack = theme === 'black';
  return (
    <div className={isBlack ? styles.pricingCardBlack : styles.pricingCard}>
      <h3 className={isBlack ? styles.pricingCardTitleBlack : styles.pricingCardTitle}>{title}</h3>
      <div className={isBlack ? styles.pricingCardFeaturesBlack : styles.pricingCardFeatures}>
        {features.map((f, i) => <p key={i}>{f}</p>)}
      </div>
      <Link href="/book" className={isBlack ? styles.pricingCardButtonBlack : styles.pricingCardButton}>{buttonText}</Link>
    </div>
  );
}

// ==================== 1. MEDIA PRODUCTION ====================

function MediaTab() {
  const [open, setOpen] = useState<string | null>('brand');
  const t = (s: string) => setOpen(open === s ? null : s);

  return (
    <div className={styles.tabContent}>
      <div className={styles.videoProductionSection}>
        <div className={styles.videoProductionContainer}>
          <Accordion title="BRAND FILM" isOpen={open === 'brand'} onToggle={() => t('brand')} theme="white">
            <div className={styles.pricingGrid}>
              <Card theme="white" title="Brand Identity" features={['Mission & origin story', 'What you do & how', 'Case study ready']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Campaign Package" features={['Multi-platform delivery', 'Cohesive brand story', 'Social + web + ads']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Multi-Day Production" features={['Multiple locations', 'Full crew & equipment', 'Extended storytelling']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>

          <Accordion title="COMMERCIALS" isOpen={open === 'commercials'} onToggle={() => t('commercials')} theme="white">
            <div className={styles.pricingGrid}>
              <Card theme="white" title="Single Spot" features={['TV or digital ready', '15-60 second format', 'One core message']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Ad Campaign" features={['Multi-spot package', 'Cohesive messaging', 'All platform formats']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Multi-Day Production" features={['Multiple locations', 'Full crew & equipment', 'Series or seasonal']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>

          <Accordion title="INTERNAL & RECRUITING" isOpen={open === 'internal'} onToggle={() => t('internal')} theme="white">
            <div className={styles.pricingGrid}>
              <Card theme="white" title="Onboarding Video" features={['Welcome to the team', 'Culture showcase', 'Set the tone']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Recruiting Content" features={['Why you should apply', 'What it\'s like here', 'Attract top talent']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Training Videos" features={['How we do things', 'Process documentation', 'Internal use']} buttonText="DISCUSS PROJECT" />
            </div>
          </Accordion>

          <Accordion title="AERIAL & DRONE" isOpen={open === 'drone'} onToggle={() => t('drone')} theme="white">
            <div className={styles.pricingGrid}>
              <Card theme="white" title="Cinema Drone" features={['Cinematic flyovers', 'Business & property', 'National brand look']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Real Estate & Location" features={['Property showcases', 'Venue tours', 'Quick turnaround']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="FPV & 360" features={['Indoor FPV flights', 'Dynamic tracking shots', 'Immersive 360 content']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>
        </div>
      </div>

      <div className={styles.blackPricingSection}>
        <div className={styles.videoProductionContainer}>
          <Accordion title="SOCIAL CONTENT PACKAGES" isOpen={open === 'content'} onToggle={() => t('content')} theme="black">
            <div className={styles.pricingGridBlack}>
              <Card theme="black" title="Starter" features={['4 videos per month', '1x per week', 'Basic editing']} buttonText="DISCUSS PROJECT" />
              <Card theme="black" title="Growth" features={['8 videos per month', '2x per week', 'Full production']} buttonText="DISCUSS PROJECT" />
              <Card theme="black" title="Scale" features={['7-14 posts per week', 'Daily content', 'Full service team']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>

          <Accordion title="EVENT COVERAGE" isOpen={open === 'event'} onToggle={() => t('event')} theme="black">
            <div className={styles.pricingGridBlack}>
              <Card theme="black" title="1 Day" features={['Single day coverage', 'Highlight reel', 'Social clips']} buttonText="BOOK" />
              <Card theme="black" title="2+ Days" features={['Multi-day events', 'Full highlight + raw', 'Extended coverage']} buttonText="BOOK" />
              <Card theme="black" title="Full Package" features={['Monthly event plan', 'Large-scale production', 'Multi-person crew']} buttonText="GET QUOTE" />
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

// ==================== 2. MARKETING ====================

function MarketingTab() {
  const [open, setOpen] = useState<string | null>('funnel');
  const t = (s: string) => setOpen(open === s ? null : s);

  return (
    <div className={styles.tabContent}>
      <div className={styles.videoProductionSection}>
        <div className={styles.videoProductionContainer}>
          <Accordion title="FULL-FUNNEL STRATEGY" isOpen={open === 'funnel'} onToggle={() => t('funnel')} theme="white">
            <div className={styles.pricingGrid}>
              <Card theme="white" title="Campaign Planning" features={['Market research & analysis', 'Audience targeting', 'Multi-channel calendar']} buttonText="BUILD YOUR PLAN" />
              <Card theme="white" title="Conversion Optimization" features={['Landing page design', 'A/B testing', 'Form & UX optimization']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Performance Reporting" features={['Monthly analytics', 'ROI tracking', 'Strategy adjustments']} buttonText="DISCUSS PROJECT" />
            </div>
          </Accordion>

          <Accordion title="LOCAL SEO" isOpen={open === 'seo'} onToggle={() => t('seo')} theme="white">
            <div className={styles.pricingGrid}>
              <Card theme="white" title="Google Business Profile" features={['GBP optimization', 'Review strategy', 'Local citations']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="On-Page SEO" features={['Keyword optimization', 'Technical SEO audit', 'Content strategy']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Ongoing SEO" features={['Monthly optimization', 'Ranking reports', 'Competitor monitoring']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>

          <Accordion title="PAID ADVERTISING" isOpen={open === 'ads'} onToggle={() => t('ads')} theme="white">
            <div className={styles.pricingGrid}>
              <Card theme="white" title="Google Ads" features={['Search campaigns', 'Keyword targeting', 'Conversion tracking']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Meta Ads" features={['Facebook & Instagram', 'Audience targeting', 'Creative testing']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Full Ad Management" features={['All platforms', 'Budget optimization', 'Monthly reporting']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>

          <Accordion title="EMAIL MARKETING" isOpen={open === 'email'} onToggle={() => t('email')} theme="white">
            <div className={styles.pricingGrid}>
              <Card theme="white" title="Welcome Sequences" features={['Automated onboarding', 'Brand introduction', 'First-purchase nudge']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Nurture Campaigns" features={['Lead warming', 'Value-first content', 'Sales conversion']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Full Email System" features={['Complete automation', 'Segmentation', 'A/B testing & analytics']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>
        </div>
      </div>

      <div className={styles.blackPricingSection}>
        <div className={styles.videoProductionContainer}>
          <Accordion title="SOCIAL MEDIA MANAGEMENT" isOpen={open === 'social'} onToggle={() => t('social')} theme="black">
            <div className={styles.pricingGridBlack}>
              <Card theme="black" title="Content Calendars" features={['Monthly planning', 'Platform-native content', 'Scheduled posting']} buttonText="DISCUSS PROJECT" />
              <Card theme="black" title="Community Management" features={['Comment responses', 'DM management', 'Audience engagement']} buttonText="DISCUSS PROJECT" />
              <Card theme="black" title="Full Management" features={['All platforms handled', 'Content + engagement + growth', 'Monthly reporting']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

// ==================== 3. WEB & SOFTWARE ====================

function WebSoftwareTab() {
  const [open, setOpen] = useState<string | null>('websites');
  const t = (s: string) => setOpen(open === s ? null : s);

  return (
    <div className={styles.tabContent}>
      <div className={styles.blackPricingSection}>
        <div className={styles.videoProductionContainer}>
          <Accordion title="WEBSITES" subtitle="Every site hand-coded from scratch." isOpen={open === 'websites'} onToggle={() => t('websites')} theme="black">
            <div className={styles.pricingGridBlack}>
              <Card theme="black" title="Starter" features={['Clean & professional', '3-5 pages', 'Mobile responsive']} buttonText="DISCUSS PROJECT" />
              <Card theme="black" title="Professional" features={['Full brand experience', '10+ pages', 'SEO optimized']} buttonText="DISCUSS PROJECT" />
              <Card theme="black" title="E-commerce & Apps" features={['Full-stack applications', 'Booking / payments', 'Custom integrations']} buttonText="DISCUSS PROJECT" />
            </div>
          </Accordion>

          <Accordion title="SEO & PERFORMANCE" isOpen={open === 'seoPerf'} onToggle={() => t('seoPerf')} theme="black">
            <div className={styles.pricingGridBlack}>
              <Card theme="black" title="Technical SEO" features={['Core Web Vitals', 'Site speed optimization', 'Structured data']} buttonText="DISCUSS PROJECT" />
              <Card theme="black" title="On-Page SEO" features={['Keyword strategy', 'Meta optimization', 'Content structure']} buttonText="DISCUSS PROJECT" />
              <Card theme="black" title="Ongoing Maintenance" features={['Updates & security', 'Performance monitoring', 'Content updates']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>
        </div>
      </div>

      <div className={styles.videoProductionSection}>
        <div className={styles.videoProductionContainer}>
          <Accordion title="CUSTOM SOFTWARE" isOpen={open === 'custom'} onToggle={() => t('custom')} theme="white">
            <div className={styles.pricingGrid}>
              <Card theme="white" title="Custom CRM" features={['Client management', 'Pipeline tracking', 'Communication tools']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Admin Dashboards" features={['Business analytics', 'Operations tracking', 'Real-time reporting']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Internal Tools" features={['Workflow automation', 'Team management', 'Custom integrations']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>

          <Accordion title="AUTOMATION & AI" isOpen={open === 'automation'} onToggle={() => t('automation')} theme="white">
            <div className={styles.pricingGrid}>
              <Card theme="white" title="Business Automation" features={['Invoice automation', 'Scheduling systems', 'Report generation']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="AI Implementation" features={['Chatbots & assistants', 'Content automation', 'Data analysis tools']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Full Automation Suite" features={['End-to-end workflow', 'Multi-tool integration', 'Ongoing optimization']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

// ==================== 4. CONSULTING ====================

function ConsultingTab() {
  const [open, setOpen] = useState<string | null>('growth');
  const t = (s: string) => setOpen(open === s ? null : s);

  return (
    <div className={styles.tabContent}>
      <div className={styles.videoProductionSection}>
        <div className={styles.videoProductionContainer}>
          <Accordion title="GROWTH STRATEGY" isOpen={open === 'growth'} onToggle={() => t('growth')} theme="white">
            <div className={styles.pricingGrid}>
              <Card theme="white" title="Business Analysis" features={['Market positioning', 'Bottleneck identification', 'Growth roadmap']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Offer Design" features={['Value engineering', 'Pricing strategy', 'Guarantee design']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Scaling Systems" features={['Revenue architecture', 'Lead generation design', 'Retention frameworks']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>

          <Accordion title="OPERATIONS" isOpen={open === 'ops'} onToggle={() => t('ops')} theme="white">
            <div className={styles.pricingGrid}>
              <Card theme="white" title="SOPs & Documentation" features={['Process documentation', 'Training systems', 'Knowledge management']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Delegation Systems" features={['Task frameworks', 'Team structure design', 'Accountability systems']} buttonText="DISCUSS PROJECT" />
              <Card theme="white" title="Full Operations Overhaul" features={['Complete systems audit', 'Implementation plan', 'Ongoing optimization']} buttonText="BOOK A CALL" />
            </div>
          </Accordion>
        </div>
      </div>

      <div className={styles.blackPricingSection}>
        <div className={styles.videoProductionContainer}>
          <Accordion title="STRATEGIC PARTNERSHIPS" isOpen={open === 'partnerships'} onToggle={() => t('partnerships')} theme="black">
            <div className={styles.pricingGridBlack}>
              <Card theme="black" title="Growth Partnership" features={['Revenue-tied outcomes', 'Unlimited content', 'Full marketing support']} buttonText="APPLY" />
              <Card theme="black" title="Media Partnership" features={['Ongoing production', 'Brand asset creation', 'Social management']} buttonText="APPLY" />
              <Card theme="black" title="Custom Partnership" features={['Tailored to your goals', 'Performance-based', 'Long-term alignment']} buttonText="LET&apos;S TALK" />
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

// ==================== TAB CONTENT MAP ====================

const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  media: <MediaTab />,
  marketing: <MarketingTab />,
  web: <WebSoftwareTab />,
  consulting: <ConsultingTab />,
};

// ==================== SOLUTIONS CONTACT FORM ====================

const SOLUTION_OPTIONS = [
  { label: 'Media Production', color: '#e63636' },
  { label: 'Marketing', color: '#F4C430' },
  { label: 'Social Media Management', color: '#4A90E2' },
  { label: 'Web Development', color: '#e63636' },
  { label: 'Business Software', color: '#F4C430' },
  { label: 'Business Consulting', color: '#4A90E2' },
  { label: 'Strategic Partnership', color: '#e63636' },
] as const;

function SolutionsContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    solutions: [] as string[],
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderTurnstile = useCallback(() => {
    if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            setTurnstileToken(token);
            setTurnstileError(null);
          },
          'error-callback': () => {
            setTurnstileError('Verification failed. Please try again.');
            setTurnstileToken(null);
          },
          'expired-callback': () => {
            setTurnstileToken(null);
            setTurnstileError('Verification expired. Please verify again.');
          },
          theme: 'dark',
          size: 'flexible',
        });
      } catch (error) {
        console.error('Turnstile render error:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (window.turnstile) renderTurnstile();
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [renderTurnstile]);

  const toggleSolution = (label: string) => {
    setFormData(prev => ({
      ...prev,
      solutions: prev.solutions.includes(label)
        ? prev.solutions.filter(s => s !== label)
        : [...prev.solutions, label],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTurnstileError(null);
    if (!turnstileToken) { setTurnstileError('Please complete the verification.'); return; }
    if (!formData.phone) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: '',
          message: `Solutions interest: ${formData.solutions.join(', ')}\n\n${formData.message}`,
          preferredDate: '',
          preferredTime: '',
          turnstileToken,
        }),
      });

      if (response.ok) {
        setStatus('success');
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('event', 'ads_conversion_Book_appointment_1', {});
        }
        setFormData({ name: '', email: '', phone: '', solutions: [], message: '' });
        setTurnstileToken(null);
        if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
      } else {
        setStatus('error');
        if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
      }
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className={styles.formSection}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={renderTurnstile}
      />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>LET&apos;S TALK</h2>
        <p className={styles.formSubtext}>Tell us what you need. We&apos;ll get back to you within 24 hours.</p>

        {status === 'success' ? (
          <div className={styles.formSuccess}>
            <h3>Message sent!</h3>
            <p>We&apos;ll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className={styles.formInput} placeholder="Your name" />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={styles.formInput} placeholder="(555) 555-5555" />
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.formInput} placeholder="you@company.com" />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>What are you interested in? (select all that apply)</label>
              <div className={styles.solutionTags}>
                {SOLUTION_OPTIONS.map((sol) => {
                  const isSelected = formData.solutions.includes(sol.label);
                  return (
                    <button
                      key={sol.label}
                      type="button"
                      onClick={() => toggleSolution(sol.label)}
                      className={`${styles.solutionTag} ${isSelected ? styles.solutionTagActive : ''}`}
                      style={isSelected ? { borderColor: sol.color, background: sol.color, color: sol.color === '#F4C430' ? '#000' : '#fff' } : {}}
                    >
                      <span className={styles.checkbox} style={isSelected ? { borderColor: sol.color === '#F4C430' ? '#000' : '#fff', background: sol.color === '#F4C430' ? '#000' : '#fff' } : {}}>
                        {isSelected && <span className={styles.checkmark} style={{ color: sol.color }}>&#10003;</span>}
                      </span>
                      {sol.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Tell us more (optional)</label>
              <textarea name="message" value={formData.message} onChange={handleChange} className={styles.formTextarea} rows={3} placeholder="Describe your project or goals..." />
            </div>

            <div ref={turnstileRef} className={styles.turnstile} />
            {turnstileError && <p className={styles.formError}>{turnstileError}</p>}

            <button type="submit" className={styles.formSubmit} disabled={status === 'loading'}>
              {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
            </button>

            {status === 'error' && <p className={styles.formError}>Something went wrong. Please try again.</p>}
          </form>
        )}
      </div>
    </section>
  );
}

// ==================== MAIN PAGE ====================

export default function SolutionsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('media');

  return (
    <div className={styles.page}>
      {/* TAB NAV */}
      <nav className={styles.tabNav}>
        <div className={styles.tabNavInner}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabButton} ${activeTab === tab.id ? `${styles.tabButtonActive} ${styles[tab.color]}` : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ACTIVE TAB CONTENT */}
      {TAB_CONTENT[activeTab]}

      {/* CONTACT FORM */}
      <SolutionsContactForm />

      {/* MUSIC STUDIO MINI CARD */}
      <div className={styles.musicCard}>
        <div className={styles.musicCardInner}>
          <p className={styles.musicCardText}>Looking for music recording, mixing, or mastering?</p>
          <a href="https://sweetdreamsmusic.com" target="_blank" rel="noopener noreferrer" className={styles.musicCardLink}>
            Visit Sweet Dreams Music &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
