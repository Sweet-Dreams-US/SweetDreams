/**
 * Vercel Web Analytics reads for the client portal.
 *
 * Uses the REST query API with a team scoped token (VERCEL_API_TOKEN).
 * Every client site is a project on the Sweet Dreams team, so one token
 * serves them all. Returns a typed result instead of throwing so the
 * portal can render a friendly state when analytics is not configured or
 * a project has not collected data yet.
 */
const API = 'https://api.vercel.com/v1/query/web-analytics';
const TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_4mlJIxMh7QofsXFfy1SA8fIG';

export interface AnalyticsRow {
  label: string;
  visitors: number;
}

export interface SiteAnalytics {
  ok: true;
  days: number;
  visitors: number;
  pageviews: number;
  topPages: AnalyticsRow[];
  topReferrers: AnalyticsRow[];
}

export interface AnalyticsProblem {
  ok: false;
  reason: 'not_configured' | 'no_project' | 'not_enabled' | 'error';
  message?: string;
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function fetchSiteAnalytics(
  projectId: string | null,
  days = 30
): Promise<SiteAnalytics | AnalyticsProblem> {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) return { ok: false, reason: 'not_configured' };
  if (!projectId) return { ok: false, reason: 'no_project' };

  const until = new Date();
  const since = new Date(until.getTime() - days * 24 * 60 * 60 * 1000);
  const base = `projectId=${encodeURIComponent(projectId)}&teamId=${TEAM_ID}&since=${ymd(since)}&until=${ymd(until)}`;
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const [countRes, pagesRes, refRes] = await Promise.all([
      fetch(`${API}/visits/count?${base}`, { headers, cache: 'no-store' }),
      fetch(`${API}/visits/aggregate?${base}&by=requestPath&limit=6`, { headers, cache: 'no-store' }),
      fetch(`${API}/visits/aggregate?${base}&by=referrerHostname&limit=5`, { headers, cache: 'no-store' }),
    ]);

    if (countRes.status === 404) return { ok: false, reason: 'not_enabled' };
    if (!countRes.ok) {
      return { ok: false, reason: 'error', message: `HTTP ${countRes.status}` };
    }

    const count = await countRes.json();
    const pages = pagesRes.ok ? await pagesRes.json() : { data: [] };
    const refs = refRes.ok ? await refRes.json() : { data: [] };

    const rows = (data: unknown, key: string): AnalyticsRow[] =>
      (((data as { data?: Record<string, unknown>[] })?.data ?? []) as Record<string, unknown>[])
        .map((r) => ({
          label: String(r[key] ?? '') || 'Direct',
          visitors: Number(r.visitors ?? 0),
        }))
        .filter((r) => r.label !== 'Others');

    return {
      ok: true,
      days,
      visitors: Number(count?.data?.visitors ?? 0),
      pageviews: Number(count?.data?.pageviews ?? 0),
      topPages: rows(pages, 'requestPath'),
      topReferrers: rows(refs, 'referrerHostname'),
    };
  } catch (err) {
    return {
      ok: false,
      reason: 'error',
      message: err instanceof Error ? err.message : 'unknown error',
    };
  }
}
