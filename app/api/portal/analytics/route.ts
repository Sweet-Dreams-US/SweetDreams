/**
 * Portal: website analytics for one of the client's sites.
 *
 * Entitlement: included at the $85+ plans, or the $10/mo add on. Everyone
 * else gets a locked response the portal renders as an upsell.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { analyticsIncludedAtPrice } from '@/lib/clients/constants';
import { fetchSiteAnalytics } from '@/lib/vercel-analytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabaseUser = await createClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const siteId = request.nextUrl.searchParams.get('site_id');
  if (!siteId) {
    return NextResponse.json({ ok: false, error: 'missing site_id' }, { status: 400 });
  }

  // RLS-scoped: only their own site comes back.
  const { data: site } = await supabaseUser
    .from('sites')
    .select('id, vercel_project_id, hosting_price_cents, analytics_addon')
    .eq('id', siteId)
    .maybeSingle();
  if (!site) {
    return NextResponse.json({ ok: false, error: 'site not found' }, { status: 404 });
  }

  const entitled =
    analyticsIncludedAtPrice(site.hosting_price_cents as number) ||
    site.analytics_addon === true;
  if (!entitled) {
    return NextResponse.json({ ok: true, locked: true });
  }

  const result = await fetchSiteAnalytics(site.vercel_project_id as string | null);
  return NextResponse.json({ ok: true, locked: false, analytics: result });
}
