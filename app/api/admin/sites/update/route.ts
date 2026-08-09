/**
 * Admin: update a site's pipeline status and registry fields
 * (live URL, domain, repo, Vercel project, go live date, notes).
 * Mirrors the marketing_leads status route pattern.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { SITE_STATUSES, type SiteStatus } from '@/lib/clients/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface UpdateBody {
  site_id?: string;
  status?: string;
  admin_notes?: string | null;
  live_url?: string | null;
  domain?: string | null;
  github_repo?: string | null;
  vercel_project_id?: string | null;
  db_project_ref?: string | null;
  go_live_date?: string | null;
}

function cleanText(value: unknown, max: number): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(request: NextRequest) {
  if (!verifySession(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: UpdateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  if (!body.site_id || typeof body.site_id !== 'string') {
    return NextResponse.json({ ok: false, error: 'missing site_id' }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  if (body.status !== undefined) {
    if (!SITE_STATUSES.includes(body.status as SiteStatus)) {
      return NextResponse.json({ ok: false, error: 'invalid status' }, { status: 400 });
    }
    update.status = body.status;
    update.status_updated_at = new Date().toISOString();
  }

  const textFields: Array<[keyof UpdateBody, string, number]> = [
    ['admin_notes', 'admin_notes', 2000],
    ['live_url', 'live_url', 500],
    ['domain', 'domain', 255],
    ['github_repo', 'github_repo', 255],
    ['vercel_project_id', 'vercel_project_id', 255],
    ['db_project_ref', 'db_project_ref', 255],
  ];
  for (const [bodyKey, column, max] of textFields) {
    const cleaned = cleanText(body[bodyKey], max);
    if (cleaned !== undefined) update[column] = cleaned;
  }

  if (body.go_live_date !== undefined) {
    if (body.go_live_date === null || body.go_live_date === '') {
      update.go_live_date = null;
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(body.go_live_date)) {
      update.go_live_date = body.go_live_date;
    } else {
      return NextResponse.json(
        { ok: false, error: 'go_live_date must be YYYY-MM-DD' },
        { status: 400 }
      );
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: false, error: 'nothing to update' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('sites').update(update).eq('id', body.site_id);
  if (error) {
    console.error('[admin/sites/update] failed:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
