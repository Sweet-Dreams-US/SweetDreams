/**
 * Spam Filter for Sweet Dreams Solutions
 * Blocks international spam, bot patterns, and suspicious submissions
 */

// Only allow US/Canada phone formats
const US_PHONE_REGEX = /^[\+]?1?[\s\-\.]?\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4}$/;

// Suspicious phone prefixes (India, Philippines, UK spam, etc.)
const BLOCKED_PHONE_PREFIXES = [
  '+91', '+63', '+44', '+234', '+880', '+92', '+84', '+62',
  '+66', '+60', '+55', '+52', '+86', '+82', '+81',
  '91', '63', '44', '234', '880', '92',
];

// Suspicious email patterns
const SUSPICIOUS_EMAIL_PATTERNS = [
  /\d{4,}@gmail\.com$/i,           // numbers-heavy gmail (e.g. mollaminaj9733@gmail.com)
  /^[a-z]+[a-z]+\d{3,}@gmail\.com$/i, // name + many numbers @ gmail
  /@yahoo\.co\.in$/i,
  /@rediffmail\.com$/i,
  /@yopmail\.com$/i,
  /@tempmail\./i,
  /@guerrillamail\./i,
  /@mailinator\./i,
  /@10minutemail\./i,
];

// Names that are clearly spam patterns
const SUSPICIOUS_NAME_PATTERNS = [
  /^[a-z]{15,}$/i,                   // Super long single word names
  /^[A-Z][a-z]+\s[A-Z][a-z]+[A-Z]/,  // Random mixed case (e.g. "lnHqQKpCemPoEBZdIZ")
];

// Block messages that just copy the site content
const SITE_CONTENT_PATTERNS = [
  /BUSINESS SOLUTIONS/i,
  /SWEET DREAMS MEDIA/i,
  /QUICK LINKS/i,
];

export interface SpamCheckResult {
  isSpam: boolean;
  reason: string;
}

export function checkForSpam({
  name,
  email,
  phone,
  message,
  ip,
}: {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  ip?: string;
}): SpamCheckResult {

  // 1. Check phone number - must look like US/Canada if provided
  if (phone) {
    const cleanPhone = phone.replace(/[\s\-\.\(\)]/g, '');

    // Block known international prefixes
    for (const prefix of BLOCKED_PHONE_PREFIXES) {
      if (cleanPhone.startsWith(prefix)) {
        return { isSpam: true, reason: `Blocked phone prefix: ${prefix}` };
      }
    }

    // If phone has more than 11 digits (US max with country code), likely international
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length > 11) {
      return { isSpam: true, reason: `Phone too long: ${digitsOnly.length} digits` };
    }

    // If phone has fewer than 10 digits, not a valid US number
    if (digitsOnly.length < 10) {
      return { isSpam: true, reason: `Phone too short: ${digitsOnly.length} digits` };
    }

    // Must match US phone format
    if (!US_PHONE_REGEX.test(cleanPhone) && !US_PHONE_REGEX.test(digitsOnly)) {
      // Allow if it starts with 1 and rest is 10 digits
      if (!(digitsOnly.startsWith('1') && digitsOnly.length === 11)) {
        // Allow plain 10 digit numbers
        if (digitsOnly.length !== 10) {
          return { isSpam: true, reason: 'Phone does not match US format' };
        }
      }
    }
  }

  // 2. Check email patterns
  for (const pattern of SUSPICIOUS_EMAIL_PATTERNS) {
    if (pattern.test(email)) {
      return { isSpam: true, reason: `Suspicious email pattern: ${email}` };
    }
  }

  // 3. Check for .om typos (common spam tell - kriselcainglet@gmail.om)
  if (email.endsWith('.om') || email.endsWith('.con') || email.endsWith('.cmo')) {
    return { isSpam: true, reason: `Malformed email TLD: ${email}` };
  }

  // 4. Check name patterns
  for (const pattern of SUSPICIOUS_NAME_PATTERNS) {
    if (pattern.test(name)) {
      return { isSpam: true, reason: `Suspicious name pattern: ${name}` };
    }
  }

  // 5. Check if message is just scraped site content
  if (message) {
    for (const pattern of SITE_CONTENT_PATTERNS) {
      if (pattern.test(message)) {
        return { isSpam: true, reason: 'Message contains scraped site content' };
      }
    }
  }

  // 6. Honeypot - if company name is "Airtel", "Jio", etc. (Indian telecoms used as spam fill)
  const SPAM_COMPANIES = ['airtel', 'jio', 'vodafone', 'bsnl', 'globe', 'smart', 'tnt'];

  return { isSpam: false, reason: '' };
}

/**
 * Rate limiting by IP - simple in-memory store
 * Resets on server restart (which is fine for serverless)
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // max 3 submissions per hour per IP

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true; // allowed
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false; // rate limited
  }

  entry.count++;
  return true; // allowed
}
