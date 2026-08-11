/**
 * Versioned agreement templates.
 *
 * Rules:
 * - Versions are APPEND ONLY. Once a version has been sent to anyone, never
 *   edit it — add a new version and bump LATEST_AGREEMENT_VERSION. Every
 *   agreements row stores its own rendered snapshot + sha256, so old
 *   signatures stay verifiable forever regardless of template changes.
 * - House style: plain English a business owner reads in five minutes,
 *   no dashes in copy.
 *
 * v1 (frozen, historical): carried a DRAFT notice and listed backups.
 * v2 (current): drafting notice removed, backups claim removed.
 */

export interface AgreementTemplate {
  version: string;
  title: string;
  /** Section bodies may contain {{variable}} slots. */
  sections: { heading: string; body: string }[];
}

export interface AgreementVariables {
  business_name: string;
  contact_name: string;
  contact_email: string;
  /** Formatted, e.g. "$85" */
  hosting_price: string;
  /** e.g. "9" */
  update_hours: string;
  /** Formatted build value, e.g. "$4,500" */
  build_price: string;
  /** "1st" or "15th" */
  billing_anchor_day: string;
  /** e.g. "August 9, 2026" */
  effective_date: string;
  /** Full sentence describing analytics packaging for this plan. */
  analytics_terms: string;
}

export const LATEST_AGREEMENT_VERSION = 'v2';

const PARTIES = {
  heading: 'Who This Agreement Is Between',
  body:
    'This Website Services and Hosting Agreement (the "Agreement") is between Sweet Dreams Music LLC of Fort Wayne, Indiana ("Sweet Dreams", "we", "us") and {{business_name}}, represented by {{contact_name}} ({{contact_email}}) (the "Client", "you"). It takes effect on {{effective_date}}.',
};

const BUILD = {
  heading: 'What We Build For You',
  body:
    'Sweet Dreams will design and build a custom website for {{business_name}} at no upfront build cost to you. The build includes custom design, development, and one media session (photo and video) to capture real content for your site. The value of this build is {{build_price}} (the "Build Value"). You pay nothing for the build itself for as long as your monthly hosting with us stays active.',
};

const BILLING_START = {
  heading: 'When Billing Starts',
  body:
    'After signing, you will add a payment method (card or bank). It is saved, not charged. You are not charged any hosting until we both confirm your website is ready and Sweet Dreams marks it live. Once live, hosting is billed monthly on the 1st or the 15th of the month, starting with whichever comes first after your live date, and that stays your billing day.',
};

const OWNERSHIP = {
  heading: 'Who Owns What',
  body:
    'While your hosting is active, the website, its code, and the build remain the property of Sweet Dreams. You always own your brand: your business name, logo, and the information about your business. Photos and video we capture during your media session may be used by both you and Sweet Dreams to promote your business and our work.',
};

const BUYOUT = {
  heading: 'Taking Your Website With You (Optional Buyout)',
  body:
    'If you ever want to take the website and its code elsewhere and stop hosting with us, you may buy out the build. A buyout is completely optional and never required. The buyout price is based on the Build Value of {{build_price}} and when you leave: during year 1 it is 100% of the Build Value; during year 2 it is 75%; during year 3 it is 65%; year 4 and beyond it is 50%. Once the buyout is paid, we transfer the code and the site to you and hosting ends.',
};

const CANCEL = {
  heading: 'Cancelling Anytime',
  body:
    'You may cancel your hosting at any time with 60 days written notice. There is no long term commitment and no requirement to ever buy out the website. Hosting fees continue through the 60 day notice period. If you cancel without a buyout, the website simply comes down at the end of the notice period and the build remains the property of Sweet Dreams. Your brand materials and any content you provided are returned to you on request. Sweet Dreams may also end this Agreement with the same 60 days written notice.',
};

const WARRANTIES = {
  heading: 'What We Promise and What We Do Not',
  body:
    'We will provide your hosting and services with reasonable skill and care, using reputable hosting providers. We do not guarantee uninterrupted availability, search rankings, or any specific business results. Our total liability under this Agreement is limited to the hosting fees you paid us in the 3 months before the issue arose.',
};

const LAW = {
  heading: 'Governing Law',
  body:
    'This Agreement is governed by the laws of the State of Indiana. Any dispute will be handled in the courts of Allen County, Indiana.',
};

const ESIGN = {
  heading: 'Electronic Signature',
  body:
    'You agree to do business electronically. Typing your name and drawing your signature on the signing page together count as your legal signature on this Agreement, with the same force as a handwritten signature. A copy of this Agreement is emailed to you and stays available in your client portal.',
};

/** v1 — frozen. Do not edit; historical signatures reference this wording. */
const V1: AgreementTemplate = {
  version: 'v1',
  title: 'Website Services and Hosting Agreement',
  sections: [
    {
      heading: 'Draft Notice',
      body:
        'This document is a working draft of the Sweet Dreams website services agreement and is pending final legal review. By signing you agree to its terms as written below.',
    },
    PARTIES,
    BUILD,
    {
      heading: 'Monthly Hosting and Care',
      body:
        'Your hosting plan is {{hosting_price}} per month. It covers hosting, security, maintenance, backups, and up to {{update_hours}} hours of website updates each quarter (every 3 months). Unused update hours do not roll over. Work beyond your included hours is quoted and approved by you before we start it. {{analytics_terms}} Monthly hosting is required to keep your website live.',
    },
    BILLING_START,
    OWNERSHIP,
    BUYOUT,
    CANCEL,
    WARRANTIES,
    LAW,
    ESIGN,
  ],
};

/** v2 — current. No draft notice; no backups claim. */
const V2: AgreementTemplate = {
  version: 'v2',
  title: 'Website Services and Hosting Agreement',
  sections: [
    PARTIES,
    BUILD,
    {
      heading: 'Monthly Hosting and Care',
      body:
        'Your hosting plan is {{hosting_price}} per month. It covers hosting, security, maintenance, and up to {{update_hours}} hours of website updates each quarter (every 3 months). Unused update hours do not roll over. Work beyond your included hours is quoted and approved by you before we start it. {{analytics_terms}} Monthly hosting is required to keep your website live.',
    },
    BILLING_START,
    OWNERSHIP,
    BUYOUT,
    CANCEL,
    WARRANTIES,
    LAW,
    ESIGN,
  ],
};

export const AGREEMENT_TEMPLATES: Record<string, AgreementTemplate> = {
  v1: V1,
  v2: V2,
};
