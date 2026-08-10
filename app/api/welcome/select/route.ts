/**
 * Public: the client picked a hosting plan on their welcome page.
 *
 * Validates the reusable welcome token (NOT single use — reopening the
 * email link must keep working), writes the chosen plan onto the site,
 * revokes any previously created unsigned agreement (the snapshot must
 * match the final choice), renders a fresh agreement, and returns the
 * signing URL for an immediate redirect. No invite email is sent — the
 * client is already here.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { checkRateLimit } from '@/lib/spam-filter';
import { hashToken } from '@/lib/agreements/tokens';
import { sendAgreementForSite } from '@/lib/agreements/service';
import {
  HOSTING_TIERS,
  analyticsIncludedAtPrice,
} from '@/lib/clients/constants';
import { requestBaseUrl } from '@/lib/base-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const clientIp =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    undefined;
  if (clientIp && !checkRateLimit(clientIp)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again shortly.' },
      { status: 429 }
    );
  }

  let body: { token?: string; tier?: string; analytics_addon?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const token = typeof body.token === 'string' ? body.token : '';
  const isCustom = body.tier === 'custom';
  const tier = HOSTING_TIERS.find((t) => t.key === body.tier);
  if (!token || token.length > 200) {
    return NextResponse.json({ ok: false, error: 'invalid link' }, { status: 410 });
  }
  if (!tier && !isCustom) {
    return NextResponse.json({ ok: false, error: 'invalid plan' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const nowIso = new Date().toISOString();

  const { data: tok } = await supabase
    .from('site_tokens')
    .select('site_id, expires_at, revoked_at')
    .eq('token_hash', hashToken(token))
    .eq('purpose', 'welcome')
    .maybeSingle();
  if (!tok || tok.revoked_at || new Date(tok.expires_at).getTime() <= Date.now()) {
    return NextResponse.json(
      { ok: false, error: 'This link is no longer active. Email cole@sweetdreams.us for a fresh one.' },
      { status: 410 }
    );
  }
  const siteId = tok.site_id as string;

  const { data: signedAgr } = await supabase
    .from('agreements')
    .select('id')
    .eq('site_id', siteId)
    .eq('status', 'signed')
    .limit(1)
    .maybeSingle();
  if (signedAgr) {
    return NextResponse.json(
      { ok: false, error: 'Your agreement is already signed. Log in to your portal.' },
      { status: 409 }
    );
  }

  // Write the chosen plan onto the site. 'custom' keeps the admin's quoted
  // price and hours untouched. Analytics add on only applies where
  // analytics is not already included at the selected price.
  let planUpdate: Record<string, unknown>;
  if (isCustom) {
    const { data: siteRow } = await supabase
      .from('sites')
      .select('hosting_price_cents')
      .eq('id', siteId)
      .single();
    const priceCents = siteRow?.hosting_price_cents ?? 0;
    planUpdate = {
      analytics_addon:
        !analyticsIncludedAtPrice(priceCents) && body.analytics_addon === true,
    };
  } else {
    planUpdate = {
      hosting_price_cents: tier!.priceCents,
      update_hours_per_quarter: tier!.updateHoursPerQuarter,
      analytics_addon: !tier!.analyticsIncluded && body.analytics_addon === true,
    };
  }

  const { error: planErr } = await supabase
    .from('sites')
    .update(planUpdate)
    .eq('id', siteId)
    .in('status', ['draft', 'demo_sent', 'agreement_sent']);
  if (planErr) {
    console.error('[welcome/select] plan write failed:', planErr);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }

  // Any previously created unsigned agreement is now stale — its snapshot
  // may not match the new choice. Revoke it and its links.
  const { data: staleAgreements } = await supabase
    .from('agreements')
    .select('id')
    .eq('site_id', siteId)
    .eq('status', 'sent');
  for (const stale of staleAgreements ?? []) {
    await supabase
      .from('agreements')
      .update({
        status: 'revoked',
        revoked_at: nowIso,
        revoke_reason: 'superseded by new plan selection on welcome page',
      })
      .eq('id', stale.id)
      .eq('status', 'sent');
    await supabase
      .from('agreement_tokens')
      .update({ revoked_at: nowIso })
      .eq('agreement_id', stale.id)
      .is('used_at', null)
      .is('revoked_at', null);
  }

  const result = await sendAgreementForSite(
    supabase,
    siteId,
    requestBaseUrl(request),
    { notify: false }
  );
  if (!result.ok || !result.signing_url) {
    console.error('[welcome/select] agreement create failed:', result.error);
    return NextResponse.json(
      { ok: false, error: 'Could not prepare your agreement. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, signing_url: result.signing_url });
}
