/**
 * Versioned agreement templates.
 *
 * Rules:
 * - Versions are APPEND ONLY. Once a version has been sent to anyone, never
 *   edit it — add a new version and bump LATEST_AGREEMENT_VERSION. Every
 *   agreements row stores its own rendered snapshot + sha256, so old
 *   signatures stay verifiable forever regardless of template changes.
 * - v1 ships marked DRAFT. Attorney reviewed text should replace it (as an
 *   edit only if no v1 was ever sent, otherwise as v2).
 * - House style: plain English a business owner reads in five minutes,
 *   no dashes in copy.
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
}

export const LATEST_AGREEMENT_VERSION = 'v1';

const V1: AgreementTemplate = {
  version: 'v1',
  title: 'Website Services and Hosting Agreement',
  sections: [
    {
      heading: 'Draft Notice',
      body:
        'This document is a working draft of the Sweet Dreams website services agreement and is pending final legal review. By signing you agree to its terms as written below.',
    },
    {
      heading: 'Who This Agreement Is Between',
      body:
        'This Website Services and Hosting Agreement (the "Agreement") is between Sweet Dreams Music LLC of Fort Wayne, Indiana ("Sweet Dreams", "we", "us") and {{business_name}}, represented by {{contact_name}} ({{contact_email}}) (the "Client", "you"). It takes effect on {{effective_date}}.',
    },
    {
      heading: 'What We Build For You',
      body:
        'Sweet Dreams will design and build a custom website for {{business_name}} at no upfront build cost to you. The build includes custom design, development, and one media session (photo and video) to capture real content for your site. The value of this build is {{build_price}} (the "Build Value"). You pay nothing for the build itself for as long as your monthly hosting with us stays active.',
    },
    {
      heading: 'Monthly Hosting and Care',
      body:
        'Your hosting plan is {{hosting_price}} per month. It covers hosting, security, maintenance, backups, and up to {{update_hours}} hours of website updates each quarter (every 3 months). Unused update hours do not roll over. Work beyond your included hours is quoted and approved by you before we start it. Monthly hosting is required to keep your website live.',
    },
    {
      heading: 'When Billing Starts',
      body:
        'You are not charged any hosting until we both confirm your website is ready and it goes live. Once live, hosting is billed monthly on the {{billing_anchor_day}} of each month, starting with the first {{billing_anchor_day}} on or after your live date.',
    },
    {
      heading: 'Who Owns What',
      body:
        'While your hosting is active, the website, its code, and the build remain the property of Sweet Dreams. You always own your brand: your business name, logo, and the information about your business. Photos and video we capture during your media session may be used by both you and Sweet Dreams to promote your business and our work.',
    },
    {
      heading: 'Taking Your Website With You (Buyout)',
      body:
        'If you ever want to take the website and its code elsewhere and stop hosting with us, you may buy out the build. The buyout price is based on the Build Value of {{build_price}} and when you leave: during year 1 it is 100% of the Build Value; during year 2 it is 75%; during year 3 it is 65%; year 4 and beyond it is 50%. Once the buyout is paid, we transfer the code and the site to you and hosting ends.',
    },
    {
      heading: 'Cancelling Hosting',
      body:
        'Either of us may end this Agreement with 60 days written notice. Hosting fees continue through the notice period. If you cancel without a buyout, the website comes down at the end of the notice period and the build remains the property of Sweet Dreams. Your brand materials and any content you provided are returned to you on request.',
    },
    {
      heading: 'What We Promise and What We Do Not',
      body:
        'We will provide your hosting and services with reasonable skill and care, using reputable hosting providers. We do not guarantee uninterrupted availability, search rankings, or any specific business results. Our total liability under this Agreement is limited to the hosting fees you paid us in the 3 months before the issue arose.',
    },
    {
      heading: 'Governing Law',
      body:
        'This Agreement is governed by the laws of the State of Indiana. Any dispute will be handled in the courts of Allen County, Indiana.',
    },
    {
      heading: 'Electronic Signature',
      body:
        'You agree to do business electronically and agree that typing your name on the signing page counts as your legal signature on this Agreement, with the same force as a handwritten signature. A copy of this Agreement is emailed to you and stays available in your client portal.',
    },
  ],
};

export const AGREEMENT_TEMPLATES: Record<string, AgreementTemplate> = {
  v1: V1,
};
