/**
 * Daily Meta ads performance sync → Supabase, for the Dreams & Nightmares
 * platform's reporting views.
 *
 *   Graph API (act_1948835248854581)
 *     ├── /insights (level=campaign, yesterday)  → public.meta_ads_daily
 *     └── /customaudiences                        → public.meta_audiences
 *
 * Runs via Vercel cron (see vercel.json). Requires:
 *   META_ADS_TOKEN — system-user token with ads_read on the Sweet Dreams
 *     Solutions business. The CAPI token works here too if it was generated
 *     with ads_read in addition to ads_management.
 *
 * Idempotent: upserts on (date, ad_account_id, campaign_id), so re-runs
 * and manual triggers are safe.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const GRAPH = 'https://graph.facebook.com/v23.0';
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || '1948835248854581';
const TOKEN = process.env.META_ADS_TOKEN || process.env.META_CAPI_ACCESS_TOKEN;

interface InsightsAction {
  action_type: string;
  value: string;
}

interface InsightsRow {
  date_start: string;
  campaign_id: string;
  campaign_name?: string;
  impressions?: string;
  clicks?: string;
  spend?: string;
  cpm?: string;
  cpc?: string;
  ctr?: string;
  actions?: InsightsAction[];
}

/** Sum every lead-shaped action Meta reports (pixel + form + CAPI). */
function extractLeads(actions: InsightsAction[] | undefined): number {
  if (!actions) return 0;
  return actions
    .filter(
      (a) =>
        a.action_type === 'lead' ||
        a.action_type === 'offsite_conversion.fb_pixel_lead' ||
        a.action_type === 'onsite_conversion.lead_grouped'
    )
    .reduce((sum, a) => sum + (parseInt(a.value, 10) || 0), 0);
}

export async function GET(request: NextRequest) {
  // Same auth model as the other cron routes: Vercel cron UA or CRON_SECRET.
  const authHeader = request.headers.get('authorization');
  const userAgent = request.headers.get('user-agent') || '';
  const isVercelCron = userAgent.includes('vercel-cron') || userAgent.includes('vercel');
  const cronSecret = process.env.CRON_SECRET;
  if (!isVercelCron && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!TOKEN) {
    console.warn('[meta-ads-sync] META_ADS_TOKEN not set — skipping');
    return NextResponse.json({ skipped: true, reason: 'META_ADS_TOKEN not configured' });
  }

  const supabase = createServiceRoleClient();
  const summary = { campaigns: 0, audiences: 0, errors: [] as string[] };

  // ---- 1. Campaign insights (yesterday) → meta_ads_daily ----
  try {
    const params = new URLSearchParams({
      level: 'campaign',
      date_preset: 'yesterday',
      fields:
        'date_start,campaign_id,campaign_name,impressions,clicks,spend,cpm,cpc,ctr,actions',
      limit: '200',
      access_token: TOKEN,
    });
    const res = await fetch(`${GRAPH}/act_${AD_ACCOUNT_ID}/insights?${params}`);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(`insights ${res.status}: ${JSON.stringify(json.error ?? json).slice(0, 300)}`);
    }

    const rows: InsightsRow[] = json.data ?? [];
    for (const row of rows) {
      const { error } = await supabase.from('meta_ads_daily').upsert(
        {
          date: row.date_start,
          ad_account_id: AD_ACCOUNT_ID,
          campaign_id: row.campaign_id,
          campaign_name: row.campaign_name ?? null,
          impressions: parseInt(row.impressions ?? '0', 10),
          clicks: parseInt(row.clicks ?? '0', 10),
          spend: parseFloat(row.spend ?? '0'),
          leads: extractLeads(row.actions),
          cpm: row.cpm ? parseFloat(row.cpm) : null,
          cpc: row.cpc ? parseFloat(row.cpc) : null,
          ctr: row.ctr ? parseFloat(row.ctr) : null,
          raw: row,
          synced_at: new Date().toISOString(),
        },
        { onConflict: 'date,ad_account_id,campaign_id' }
      );
      if (error) summary.errors.push(`upsert ${row.campaign_id}: ${error.message}`);
      else summary.campaigns++;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[meta-ads-sync] insights failed:', msg);
    summary.errors.push(`insights: ${msg}`);
  }

  // ---- 2. Audience sizes → meta_audiences ----
  try {
    const params = new URLSearchParams({
      fields: 'id,name,subtype,approximate_count_lower_bound,delivery_status',
      limit: '100',
      access_token: TOKEN,
    });
    const res = await fetch(`${GRAPH}/act_${AD_ACCOUNT_ID}/customaudiences?${params}`);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(`audiences ${res.status}: ${JSON.stringify(json.error ?? json).slice(0, 300)}`);
    }

    for (const aud of json.data ?? []) {
      const { error } = await supabase.from('meta_audiences').upsert(
        {
          audience_id: aud.id,
          ad_account_id: AD_ACCOUNT_ID,
          name: aud.name ?? null,
          subtype: aud.subtype ?? null,
          approximate_count: aud.approximate_count_lower_bound ?? null,
          delivery_status: aud.delivery_status?.description ?? aud.delivery_status?.code ?? null,
          raw: aud,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'audience_id' }
      );
      if (error) summary.errors.push(`audience ${aud.id}: ${error.message}`);
      else summary.audiences++;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[meta-ads-sync] audiences failed:', msg);
    summary.errors.push(`audiences: ${msg}`);
  }

  console.log('[meta-ads-sync] done', summary);
  return NextResponse.json({ success: summary.errors.length === 0, ...summary });
}
