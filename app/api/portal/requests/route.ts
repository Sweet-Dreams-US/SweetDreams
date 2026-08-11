/**
 * Portal: a client submits a website update request.
 *
 * Auth is the client's portal session. The site is verified to belong to
 * them (through their own RLS-scoped read) before the service role writes
 * the row, so a client can never file a request against someone else's
 * site. Admin gets an email; the client sees it immediately in the portal.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { requestBaseUrl } from '@/lib/base-url';
import { ADMIN_EMAIL } from '@/lib/emails/resend';
import { sendEmail } from '@/lib/emails/send';
import UpdateRequestAdmin from '@/lib/emails/update-request-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const supabaseUser = await createClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: { site_id?: string; title?: string; details?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const title = (body.title ?? '').trim();
  const details = (body.details ?? '').trim();
  if (!body.site_id || typeof body.site_id !== 'string') {
    return NextResponse.json({ ok: false, error: 'missing site' }, { status: 400 });
  }
  if (title.length < 3) {
    return NextResponse.json(
      { ok: false, error: 'Tell us what you would like changed.' },
      { status: 400 }
    );
  }

  // RLS-scoped read: only returns the site if it belongs to this user.
  const { data: site } = await supabaseUser
    .from('sites')
    .select('id, name, client_id, clients (business_name, contact_name)')
    .eq('id', body.site_id)
    .maybeSingle();
  if (!site) {
    return NextResponse.json({ ok: false, error: 'site not found' }, { status: 404 });
  }
  const client = (site as unknown as {
    clients: { business_name: string; contact_name: string } | null;
  }).clients;

  const supabase = createServiceRoleClient();
  const { data: inserted, error } = await supabase
    .from('update_requests')
    .insert({
      site_id: site.id,
      client_id: site.client_id,
      title: title.slice(0, 200),
      details: details.slice(0, 4000) || null,
      submitted_by: user.id,
    })
    .select('id')
    .single();
  if (error) {
    console.error('[portal/requests] insert failed:', error);
    return NextResponse.json({ ok: false, error: 'could not save your request' }, { status: 500 });
  }

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Update request: ${client?.business_name ?? site.name}`,
    replyTo: user.email ?? undefined,
    react: UpdateRequestAdmin({
      businessName: client?.business_name ?? site.name,
      siteName: site.name,
      contactName: client?.contact_name ?? '',
      title,
      details,
      adminUrl: `${requestBaseUrl(request)}/admin/clients/${site.client_id}`,
    }),
  });

  return NextResponse.json({ ok: true, id: inserted.id });
}
