/**
 * Admin: move a demo through the approval queue (/admin/demos).
 *
 * The queue exists because "a demo exists" and "Cole has seen it" were never
 * separate states — demos deployed and then sat unsent. So the ladder has
 * one rung only a human can climb: `approved`. Claude writes building ->
 * ready_for_review and approved -> sent through the database directly, the
 * send-welcome route also stamps sent, and the welcome page stamps viewed
 * when the client opens their link; but this route is the ONLY code path
 * that writes demo_status = 'approved', and it only runs behind the admin
 * session cookie. Nothing else in the repo, and nothing in the automation,
 * may set it.
 *
 * Actions (the body never carries a raw demo_status):
 *   approve          ready_for_review | changes_requested  -> approved
 *   request_changes  ready_for_review | approved           -> changes_requested
 *   dismiss          any queue status                      -> none
 * Each update is guarded on the status we just read, so a concurrent write
 * (Claude marking it sent, for example) is refused instead of clobbered.
 */
import { NextRequest, NextResponse } from 'next/server';
import { formatInTimeZone } from 'date-fns-tz';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import {
  DEMO_QUEUE_STATUSES,
  DEMO_STATUS_LABELS,
  type DemoStatus,
} from '@/lib/clients/constants';
import { BUSINESS_TZ } from '@/lib/agreements/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ACTIONS = ['approve', 'request_changes', 'dismiss'] as const;
type DemoAction = (typeof ACTIONS)[number];

const APPROVE_FROM: readonly DemoStatus[] = ['ready_for_review', 'changes_requested'];
const REQUEST_CHANGES_FROM: readonly DemoStatus[] = ['ready_for_review', 'approved'];

const NOTES_MAX = 2000;

interface UpdateBody {
  site_id?: string;
  action?: string;
  notes?: string;
}

interface DemoSiteRow {
  id: string;
  demo_status: string;
  demo_url: string | null;
  demo_notes: string | null;
}

function statusLabel(status: string): string {
  return DEMO_STATUS_LABELS[status as DemoStatus] ?? status;
}

export async function POST(request: NextRequest) {
  if (!verifySession(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  // `null`, a string or a number all parse as valid JSON; they are still bad bodies.
  if (!parsed || typeof parsed !== 'object') {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  const body = parsed as UpdateBody;
  if (!body.site_id || typeof body.site_id !== 'string') {
    return NextResponse.json({ ok: false, error: 'missing site_id' }, { status: 400 });
  }
  if (!UUID_RE.test(body.site_id)) {
    return NextResponse.json({ ok: false, error: 'invalid site_id' }, { status: 400 });
  }
  if (!body.action || !ACTIONS.includes(body.action as DemoAction)) {
    return NextResponse.json({ ok: false, error: 'invalid action' }, { status: 400 });
  }
  const action = body.action as DemoAction;

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('sites')
    .select('id, demo_status, demo_url, demo_notes')
    .eq('id', body.site_id)
    .single();
  if (error || !data) {
    return NextResponse.json({ ok: false, error: 'site not found' }, { status: 404 });
  }
  const site = data as unknown as DemoSiteRow;
  const current = site.demo_status as DemoStatus;

  const update: Record<string, unknown> = {};
  let next: DemoStatus;

  if (action === 'approve') {
    if (!APPROVE_FROM.includes(current)) {
      return NextResponse.json(
        {
          ok: false,
          error: `This demo is "${statusLabel(current)}" — only a demo that is ready for review or has changes requested can be approved.`,
        },
        { status: 409 }
      );
    }
    if (!site.demo_url) {
      return NextResponse.json(
        { ok: false, error: 'This demo has no URL yet. Nothing to approve until it is deployed.' },
        { status: 400 }
      );
    }
    next = 'approved';
    update.demo_status = next;
    update.demo_approved_at = new Date().toISOString();
  } else if (action === 'request_changes') {
    if (!REQUEST_CHANGES_FROM.includes(current)) {
      return NextResponse.json(
        {
          ok: false,
          error: `This demo is "${statusLabel(current)}" — changes can only be requested on a demo that is ready for review or approved.`,
        },
        { status: 409 }
      );
    }
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
    if (!notes) {
      return NextResponse.json(
        { ok: false, error: 'Say what needs to change before sending it back.' },
        { status: 400 }
      );
    }
    if (notes.length > NOTES_MAX) {
      return NextResponse.json(
        { ok: false, error: `Notes must be ${NOTES_MAX} characters or fewer.` },
        { status: 400 }
      );
    }
    next = 'changes_requested';
    update.demo_status = next;
    update.demo_notes = notes;
    update.demo_approved_at = null;
  } else {
    if (!DEMO_QUEUE_STATUSES.includes(current)) {
      return NextResponse.json(
        {
          ok: false,
          error: `This demo is "${statusLabel(current)}" and is not in the queue, so there is nothing to remove.`,
        },
        { status: 409 }
      );
    }
    const today = formatInTimeZone(new Date(), BUSINESS_TZ, 'yyyy-MM-dd');
    const line = `Removed from the demo queue on ${today}.`;
    const existing = site.demo_notes ?? '';
    next = 'none';
    update.demo_status = next;
    update.demo_notes = existing ? `${existing}\n${line}` : line;
  }

  // Guard on the status we read so a concurrent write is refused, not overwritten.
  const { data: applied, error: applyErr } = await supabase
    .from('sites')
    .update(update)
    .eq('id', site.id)
    .eq('demo_status', current)
    .select('id');
  if (applyErr) {
    console.error('[admin/demos/update] failed:', applyErr);
    return NextResponse.json({ ok: false, error: applyErr.message }, { status: 500 });
  }
  if (!applied || applied.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'This demo changed status while you were looking at it. Refresh and try again.' },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true, demo_status: next });
}
