/**
 * Portal: a client requests cancellation of their hosting agreement.
 *
 * This does NOT terminate anything by itself — it records the request,
 * alerts the admin, and the admin's confirmation (terminate) applies the
 * contract terms: instant before live, 60 day notice after live.
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

  let body: { site_id?: string; reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  if (!body.site_id || typeof body.site_id !== 'string') {
    return NextResponse.json({ ok: false, error: 'missing site' }, { status: 400 });
  }

  // RLS-scoped: only their own site comes back.
  const { data: site } = await supabaseUser
    .from('sites')
    .select('id, name, status, client_id, clients (business_name, contact_name)')
    .eq('id', body.site_id)
    .maybeSingle();
  if (!site) {
    return NextResponse.json({ ok: false, error: 'site not found' }, { status: 404 });
  }

  const { data: signed } = await supabaseUser
    .from('agreements')
    .select('id')
    .eq('site_id', site.id)
    .eq('status', 'signed')
    .limit(1)
    .maybeSingle();
  if (!signed) {
    return NextResponse.json(
      { ok: false, error: 'There is no signed agreement on this website to cancel.' },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();
  const { data: existing } = await supabase
    .from('cancellation_requests')
    .select('id')
    .eq('site_id', site.id)
    .eq('status', 'pending')
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      { ok: false, error: 'You already have a cancellation request in. We will be in touch.' },
      { status: 409 }
    );
  }

  const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 2000) : '';
  const { error } = await supabase.from('cancellation_requests').insert({
    site_id: site.id,
    client_id: site.client_id,
    reason: reason || null,
    submitted_by: user.id,
  });
  if (error) {
    console.error('[portal/cancellation] insert failed:', error);
    return NextResponse.json({ ok: false, error: 'could not save your request' }, { status: 500 });
  }

  const client = (site as unknown as {
    clients: { business_name: string; contact_name: string } | null;
  }).clients;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `CANCELLATION request: ${client?.business_name ?? site.name}`,
    replyTo: user.email ?? undefined,
    react: UpdateRequestAdmin({
      businessName: client?.business_name ?? site.name,
      siteName: site.name,
      contactName: client?.contact_name ?? '',
      title: 'Client requested cancellation',
      details: reason || '(no reason given)',
      adminUrl: `${requestBaseUrl(request)}/admin/clients/${site.client_id}`,
    }),
  });

  return NextResponse.json({ ok: true });
}
