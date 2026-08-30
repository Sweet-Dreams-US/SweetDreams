/**
 * Referral program (portal-run; not a contract term as of agreement v4).
 *
 * Every signed client gets a unique share code; their tracked link is
 * /free-website?ref=<code>. Leads that arrive through it are stamped with the
 * code, and when a referred website officially goes live the referrer earns
 * free hosting months sized by THEIR OWN plan. Clients are only ever shown
 * what their plan earns — never the whole tier table.
 *
 * Rewards are recorded here (referral_rewards) and applied to the Stripe
 * subscription by the admin for now; the row is the source of truth.
 */
import { randomBytes } from 'crypto';
import type { createServiceRoleClient } from '@/utils/supabase/service-role';

type ServiceClient = ReturnType<typeof createServiceRoleClient>;

/** No 0/O, 1/I/L — codes get read out loud and retyped. */
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;

export function generateReferralCode(): string {
  const bytes = randomBytes(CODE_LENGTH);
  let code = '';
  for (const b of bytes) code += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return code;
}

/**
 * Free hosting months a referrer earns per live referral, by the plan THEY
 * pay for: the $50 plan earns 3 months, $85 and up earn 2.
 */
export function referralMonthsForPrice(hostingPriceCents: number): number {
  return hostingPriceCents >= 8500 ? 2 : 3;
}

/**
 * The plan price that sizes a client's referral reward: their most expensive
 * site that is not cancelled or declined. Falls back to the $50 plan.
 */
export async function referrerPlanPriceCents(
  supabase: ServiceClient,
  clientId: string
): Promise<number> {
  const { data } = await supabase
    .from('sites')
    .select('hosting_price_cents')
    .eq('client_id', clientId)
    .not('status', 'in', '(cancelled,declined)')
    .order('hosting_price_cents', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as { hosting_price_cents: number } | null)?.hosting_price_cents ?? 5000;
}

/** Returns the client's referral code, generating and saving one if missing. */
export async function ensureReferralCode(
  supabase: ServiceClient,
  clientId: string
): Promise<string | null> {
  const { data } = await supabase
    .from('clients')
    .select('referral_code')
    .eq('id', clientId)
    .maybeSingle();
  const existing = (data as { referral_code: string | null } | null)?.referral_code;
  if (existing) return existing;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateReferralCode();
    const { error } = await supabase
      .from('clients')
      .update({ referral_code: code })
      .eq('id', clientId)
      .is('referral_code', null);
    if (!error) return code;
    // 23505 = another client drew the same code; try a fresh one.
    if (!error.message.includes('duplicate')) {
      console.error('[referrals] code save failed:', error);
      return null;
    }
  }
  return null;
}

export interface ReferrerLookup {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
}

/** Case-insensitive code lookup so retyped links still count. */
export async function findClientByReferralCode(
  supabase: ServiceClient,
  code: string
): Promise<ReferrerLookup | null> {
  const cleaned = code.trim().toUpperCase();
  if (!/^[A-Z2-9]{4,16}$/.test(cleaned)) return null;
  const { data } = await supabase
    .from('clients')
    .select('id, business_name, contact_name, email')
    .eq('referral_code', cleaned)
    .maybeSingle();
  return (data as ReferrerLookup | null) ?? null;
}

export interface ReferralGoLiveResult {
  rewarded: boolean;
  referrer?: ReferrerLookup;
  monthsFree?: number;
}

/**
 * Called when a site is marked live. If the site's client came in through a
 * tracked referral link, records the reward for the referrer. Idempotent:
 * the unique index on referred_site_id makes retries a no-op.
 */
export async function recordReferralRewardOnGoLive(
  supabase: ServiceClient,
  referredClientId: string,
  referredSiteId: string
): Promise<ReferralGoLiveResult> {
  const { data: clientRow } = await supabase
    .from('clients')
    .select('source_lead_id')
    .eq('id', referredClientId)
    .maybeSingle();
  const leadId = (clientRow as { source_lead_id: string | null } | null)?.source_lead_id;
  if (!leadId) return { rewarded: false };

  const { data: leadRow } = await supabase
    .from('marketing_leads')
    .select('referred_by_code')
    .eq('id', leadId)
    .maybeSingle();
  const code = (leadRow as { referred_by_code: string | null } | null)?.referred_by_code;
  if (!code) return { rewarded: false };

  const referrer = await findClientByReferralCode(supabase, code);
  if (!referrer || referrer.id === referredClientId) return { rewarded: false };

  const planCents = await referrerPlanPriceCents(supabase, referrer.id);
  const monthsFree = referralMonthsForPrice(planCents);

  const { error } = await supabase.from('referral_rewards').insert({
    referrer_client_id: referrer.id,
    referred_client_id: referredClientId,
    referred_site_id: referredSiteId,
    months_free: monthsFree,
  });
  if (error) {
    // Duplicate = this go-live already rewarded (retry path); anything else is real.
    if (!error.message.includes('duplicate')) {
      console.error('[referrals] reward insert failed:', error);
    }
    return { rewarded: false };
  }

  return { rewarded: true, referrer, monthsFree };
}
