/**
 * Agreement link tokens.
 *
 * The raw token appears only in the emailed URL (and once in the admin UI
 * for copying). The database stores sha256 hashes, so a database leak never
 * exposes a usable signing link.
 */
import { createHash, randomBytes } from 'crypto';

export const SIGN_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
export const SETUP_TOKEN_TTL_MS = 60 * 60 * 1000; // 60 minutes

export function hashToken(raw: string): string {
  return createHash('sha256').update(raw, 'utf8').digest('hex');
}

export function mintToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString('base64url');
  return { raw, hash: hashToken(raw) };
}
