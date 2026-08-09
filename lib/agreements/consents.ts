/**
 * The exact consent checkbox labels shown on the signing page.
 *
 * Shared by the UI and the sign API so what gets STORED in
 * agreements.consents is verbatim what the signer saw. Do not reword
 * casually — changed labels only apply to future signatures.
 */
export const SIGN_CONSENTS = [
  {
    key: 'agree_terms',
    label:
      'I have read and agree to the Website Services and Hosting Agreement above',
  },
  {
    key: 'esign_consent',
    label:
      'I agree to do business electronically and that typing my name below counts as my legal electronic signature',
  },
] as const;

export type ConsentKey = (typeof SIGN_CONSENTS)[number]['key'];
