/**
 * Agreement send/resend orchestration, shared by the admin "create client"
 * and "send agreement" routes. Always runs with the service role client.
 *
 * Send semantics:
 * - New send: render the LATEST template with the site's current economics,
 *   store the immutable snapshot + sha256, mint a signing token, email it.
 * - Resend: reuse the STORED snapshot (never re-render — the client must see
 *   exactly what the fingerprint covers), revoke old live links, mint fresh.
 * - Changed terms = revoke + new agreement row, never an edit.
 */
import { formatInTimeZone } from 'date-fns-tz';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  LATEST_AGREEMENT_VERSION,
  type AgreementVariables,
} from './templates';
import { renderAgreement } from './render';
import { mintToken, SIGN_TOKEN_TTL_MS } from './tokens';
import {
  analyticsIncludedAtPrice,
  formatPriceCents,
} from '@/lib/clients/constants';
import { sendEmail } from '@/lib/emails/send';
import AgreementInvite from '@/lib/emails/agreement-invite';

/** Fort Wayne is Eastern time. */
export const BUSINESS_TZ = 'America/Indiana/Indianapolis';

export function anchorDayDisplay(day: number): '1st' | '15th' {
  return day === 15 ? '15th' : '1st';
}

interface SiteWithClient {
  id: string;
  name: string;
  status: string;
  hosting_price_cents: number;
  update_hours_per_quarter: number | null;
  build_price_cents: number;
  billing_anchor_day: number;
  analytics_addon: boolean;
  clients: {
    id: string;
    business_name: string;
    contact_name: string;
    email: string;
  } | null;
}

export interface SendAgreementResult {
  ok: boolean;
  /** Suggested HTTP status for the caller's response. */
  status: number;
  error?: string;
  agreement_id?: string;
  signing_url?: string;
  email_ok?: boolean;
  resent?: boolean;
}

export async function sendAgreementForSite(
  supabase: SupabaseClient,
  siteId: string,
  /** Origin for the signing link (from the request, so links work on dev/preview/prod alike). */
  baseUrl: string,
  /** notify: false skips the invite email (welcome flow — the client is already on the page). */
  options: { notify?: boolean } = {}
): Promise<SendAgreementResult> {
  const notify = options.notify !== false;
  const { data, error } = await supabase
    .from('sites')
    .select(
      'id, name, status, hosting_price_cents, update_hours_per_quarter, build_price_cents, billing_anchor_day, analytics_addon, clients (id, business_name, contact_name, email)'
    )
    .eq('id', siteId)
    .single();

  if (error || !data) {
    return { ok: false, status: 404, error: 'site not found' };
  }
  const site = data as unknown as SiteWithClient;
  const client = site.clients;
  if (!client) {
    return { ok: false, status: 500, error: 'site has no client' };
  }

  if (!['draft', 'demo_sent', 'agreement_sent'].includes(site.status)) {
    return {
      ok: false,
      status: 409,
      error: `cannot send an agreement while site status is ${site.status}`,
    };
  }

  let agreementId: string;
  let hostingPriceDisplay: string;
  let resent = false;

  const { data: existing } = await supabase
    .from('agreements')
    .select('id, variables')
    .eq('site_id', siteId)
    .eq('status', 'sent')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    // Resend: same stored text, old links die, a fresh link goes out.
    agreementId = existing.id;
    hostingPriceDisplay = (existing.variables as AgreementVariables)
      .hosting_price;
    resent = true;

    const { error: revokeErr } = await supabase
      .from('agreement_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('agreement_id', agreementId)
      .eq('purpose', 'sign')
      .is('used_at', null)
      .is('revoked_at', null);
    if (revokeErr) {
      return {
        ok: false,
        status: 500,
        error: `token revoke failed: ${revokeErr.message}`,
      };
    }
  } else {
    const vars: AgreementVariables = {
      business_name: client.business_name,
      contact_name: client.contact_name,
      contact_email: client.email,
      hosting_price: formatPriceCents(site.hosting_price_cents),
      update_hours: String(site.update_hours_per_quarter ?? 0),
      build_price: formatPriceCents(site.build_price_cents),
      billing_anchor_day: anchorDayDisplay(site.billing_anchor_day),
      effective_date: formatInTimeZone(new Date(), BUSINESS_TZ, 'MMMM d, yyyy'),
      analytics_terms: analyticsIncludedAtPrice(site.hosting_price_cents)
        ? 'Monthly analytics reports on your website are included in your plan at no extra cost.'
        : site.analytics_addon
          ? 'Monthly analytics reports on your website are included as a $10 per month add on you selected, billed with your hosting.'
          : 'Monthly analytics reports on your website are available anytime as a $10 per month add on.',
    };
    const { text, sha256 } = renderAgreement(LATEST_AGREEMENT_VERSION, vars);

    const { data: inserted, error: insErr } = await supabase
      .from('agreements')
      .insert({
        client_id: client.id,
        site_id: site.id,
        template_version: LATEST_AGREEMENT_VERSION,
        variables: vars,
        rendered_text: text,
        content_sha256: sha256,
        status: 'sent',
      })
      .select('id')
      .single();
    if (insErr || !inserted) {
      return {
        ok: false,
        status: 500,
        error: `agreement insert failed: ${insErr?.message ?? 'unknown'}`,
      };
    }
    agreementId = inserted.id;
    hostingPriceDisplay = vars.hosting_price;
  }

  const token = mintToken();
  const expiresAt = new Date(Date.now() + SIGN_TOKEN_TTL_MS);
  const { error: tokErr } = await supabase.from('agreement_tokens').insert({
    agreement_id: agreementId,
    purpose: 'sign',
    token_hash: token.hash,
    expires_at: expiresAt.toISOString(),
  });
  if (tokErr) {
    return {
      ok: false,
      status: 500,
      error: `token insert failed: ${tokErr.message}`,
    };
  }

  const signingUrl = `${baseUrl}/agreement/${token.raw}`;

  await supabase
    .from('sites')
    .update({
      status: 'agreement_sent',
      status_updated_at: new Date().toISOString(),
    })
    .eq('id', site.id)
    .in('status', ['draft', 'demo_sent', 'agreement_sent']);

  // Email is best effort: the signing URL is returned either way so the
  // admin can copy it manually if delivery fails.
  let emailOk: boolean | undefined;
  if (notify) {
    const email = await sendEmail({
      to: client.email,
      subject: `Your Sweet Dreams website agreement for ${client.business_name}`,
      react: AgreementInvite({
        contactName: client.contact_name,
        businessName: client.business_name,
        hostingPrice: hostingPriceDisplay,
        signingUrl,
        expiresDisplay: formatInTimeZone(expiresAt, BUSINESS_TZ, 'MMMM d, yyyy'),
      }),
    });
    emailOk = email.ok;
  }

  return {
    ok: true,
    status: 200,
    agreement_id: agreementId,
    signing_url: signingUrl,
    email_ok: emailOk,
    resent,
  };
}
