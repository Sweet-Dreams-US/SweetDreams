/**
 * Admin: email a client a set-password link for the portal.
 *
 * Uses Supabase's own recovery link (admin.generateLink) so we never build
 * a custom password token system. Requires the client to already have a
 * portal account (created at signing).
 */
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { requestBaseUrl } from '@/lib/base-url';
import { sendEmail } from '@/lib/emails/send';
import SetPasswordEmail from '@/lib/emails/set-password';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!verifySession(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: { client_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  if (!body.client_id || typeof body.client_id !== 'string') {
    return NextResponse.json({ ok: false, error: 'missing client_id' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: client, error } = await supabase
    .from('clients')
    .select('id, contact_name, email, auth_user_id')
    .eq('id', body.client_id)
    .single();
  if (error || !client) {
    return NextResponse.json({ ok: false, error: 'client not found' }, { status: 404 });
  }
  if (!client.auth_user_id) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'This client has no portal account yet. Their account is created when they sign the agreement.',
      },
      { status: 400 }
    );
  }

  const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: client.email,
    options: {
      redirectTo: `${requestBaseUrl(request)}/auth/callback?next=/portal/set-password`,
    },
  });
  const actionLink = linkData?.properties?.action_link;
  if (linkErr || !actionLink) {
    console.error('[admin/clients/password-link] generateLink failed:', linkErr);
    return NextResponse.json(
      { ok: false, error: linkErr?.message ?? 'could not generate link' },
      { status: 500 }
    );
  }

  const email = await sendEmail({
    to: client.email,
    subject: 'Set your Sweet Dreams portal password',
    react: SetPasswordEmail({
      contactName: client.contact_name,
      actionUrl: actionLink,
    }),
  });

  return NextResponse.json({ ok: true, email_ok: email.ok });
}
