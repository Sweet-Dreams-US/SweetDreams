/**
 * Deterministic agreement rendering.
 *
 * renderAgreement produces the exact plain text stored in
 * agreements.rendered_text plus its sha256 fingerprint. The same
 * (version, variables) input always yields the same text and hash; the
 * signing flow recomputes the hash from the STORED text at signature time
 * so what was signed is provable later.
 */
import { createHash } from 'crypto';
import { AGREEMENT_TEMPLATES, type AgreementVariables } from './templates';

export function renderAgreement(
  version: string,
  vars: AgreementVariables
): { text: string; sha256: string } {
  const template = AGREEMENT_TEMPLATES[version];
  if (!template) {
    throw new Error(`Unknown agreement template version: ${version}`);
  }

  const fill = (input: string) =>
    input.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
      const value = (vars as unknown as Record<string, string>)[key];
      if (value === undefined || value === '') {
        throw new Error(`Missing agreement variable: ${key}`);
      }
      return value;
    });

  const parts: string[] = [template.title.toUpperCase(), ''];
  template.sections.forEach((section, i) => {
    parts.push(`${i + 1}. ${section.heading}`);
    parts.push(fill(section.body));
    parts.push('');
  });

  const text = parts.join('\n').trimEnd() + '\n';
  return { text, sha256: sha256Hex(text) };
}

export function sha256Hex(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}
