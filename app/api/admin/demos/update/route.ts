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
 *   approve          ready_for_review | changes_requested   -> approved
 *   request_changes  ready_for_review | approved | sent     -> changes_requested
 *   dismiss          any queue status                       -> none
 * `request_changes` from `sent` is the "Reopen" case: the demo went to the
 * client and Cole wants it worked on again. demo_sent_at is left alone so the
 * send history survives; demo_approved_at is cleared because the approval no
 * longer stands.
 *
 * demo_notes is a running history, never replaced. approve and request_changes
 * each APPEND a timestamped entry (`[Sep 4, 2026 3:12 PM] Changes requested:
 * ...`, `[...] Approved.`), separated by a blank line, so the card on
 * /admin/demos can show everything Cole has asked for so far. dismiss appends
 * its one-line marker the same way.
 *
 * Each update is guarded on the status AND the updated_at we just read (the
 * sites_touch trigger bumps it on every write), so a concurrent write of any
 * kind (Claude marking it sent, a link-check line appended to demo_notes) is
 * refused instead of clobbered. demo_notes is appended in memory, so without
 * the second guard a notes-only write in between would be silently lost.
 */
import { NextRequest, NextResponse } from 'next/server';
import { formatInTimeZone } from 'date-fns-tz';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import {
  BUSINESS_TZ,
  DEMO_ACTIONS,
  DEMO_QUEUE_STATUSES,
  DEMO_STATUS_LABELS,
  type DemoAction,
  type DemoStatus,
} from '@/lib/clients/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const APPROVE_FROM: readonly DemoStatus[] = ['ready_for_review', 'changes_requested'];
// 'sent' here is the Reopen case (see the header comment).
const REQUEST_CHANGES_FROM: readonly DemoStatus[] = ['ready_for_review', 'approved', 'sent'];

const NOTES_MAX = 2000;

/**
 * C0 controls and DEL, minus tab / LF / CR. Postgres rejects a NUL byte
 * outright (the route would 500 with the raw DB message) and the rest render
 * as junk under white-space: pre-wrap, so they are dropped before validation.
 */
const CONTROL_CHARS_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/** Business-time stamp that prefixes every history entry, e.g. `Sep 4, 2026 3:12 PM`. */
function noteStamp(): string {
  return formatInTimeZone(new Date(), BUSINESS_TZ, 'MMM d, yyyy h:mm a');
}

/** Append one entry to the demo_notes history, blank-line separated. Never replaces. */
function appendNote(existing: string | null, entry: string): string {
  const prior = (existing ?? '').trimEnd();
  return prior ? `${prior}\n\n${entry}` : entry;
}

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
  /** Bumped by the sites_touch trigger on every update; the concurrency guard. */
  updated_at: string;
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
  if (!body.action || !DEMO_ACTIONS.includes(body.action as DemoAction)) {
    return NextResponse.json({ ok: false, error: 'invalid action' }, { status: 400 });
  }
  const action = body.action as DemoAction;

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('sites')
    .select('id, demo_status, demo_url, demo_notes, updated_at')
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
    // Keep the history complete: the card shows this next to the change requests.
    update.demo_notes = appendNote(site.demo_notes, `[${noteStamp()}] Approved.`);
  } else if (action === 'request_changes') {
    if (!REQUEST_CHANGES_FROM.includes(current)) {
      return NextResponse.json(
        {
          ok: false,
          error: `This demo is "${statusLabel(current)}" — changes can only be requested on a demo that is ready for review, approved, or already sent (reopen).`,
        },
        { status: 409 }
      );
    }
    const notes =
      typeof body.notes === 'string' ? body.notes.replace(CONTROL_CHARS_RE, '').trim() : '';
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
    const stamp = noteStamp();
    const entry =
      current === 'sent'
        ? `[${stamp}] Reopened after send. Changes requested: ${notes}`
        : `[${stamp}] Changes requested: ${notes}`;
    next = 'changes_requested';
    update.demo_status = next;
    update.demo_notes = appendNote(site.demo_notes, entry);
    update.demo_approved_at = null;
    // demo_sent_at is deliberately NOT cleared: a reopened demo still went out once.
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
    next = 'none';
    update.demo_status = next;
    update.demo_notes = appendNote(site.demo_notes, line);
  }

  // Guard on the status AND the updated_at we read. demo_notes is appended in
  // memory, so a notes-only write landing in between (a link-check line, a
  // manual SQL note) would otherwise be silently overwritten; updated_at
  // catches that without putting the whole history in the query string.
  const { data: applied, error: applyErr } = await supabase
    .from('sites')
    .update(update)
    .eq('id', site.id)
    .eq('demo_status', current)
    .eq('updated_at', site.updated_at)
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
