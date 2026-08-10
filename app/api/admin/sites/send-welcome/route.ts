/**
 * Admin: send (or resend) the demo welcome invite for a site.
 *
 * Requires the demo URL and a build value to already be set — the welcome
 * page leads straight into plan selection and agreement rendering, so the
 * numbers must be ready before the client ever sees the link. Resending
 * revokes old welcome links and mints a fresh one.
 */
import { NextRequest, NextResponse } from 'next/server';
import { formatInTimeZone } from 'date-fns-tz';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { mintToken, WELCOME_TOKEN_TTL_MS } from '@/lib/agreements/tokens';
import { BUSINESS_TZ } from '@/lib/agreements/service';
import { requestBaseUrl } from '@/lib/base-url';
import { sendEmail } from '@/lib/emails/send';
import DemoInvite from '@/lib/emails/demo-invite';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SiteRow {
  id: string;
  status: string;
  demo_url: string | null;
  drive_url: string | null;
  build_price_cents: number;
  clients: {
    id: string;
    business_name: string;
    contact_name: string;
    email: string;
  } | null;
}

export async function POST(request: NextRequest) {
  if (!verifySession(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: { site_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  if (!body.site_id || typeof body.site_id !== 'string') {
    return NextResponse.json({ ok: false, error: 'missing site_id' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('sites')
    .select(
      'id, status, demo_url, drive_url, build_price_cents, clients (id, business_name, contact_name, email)'
    )
    .eq('id', body.site_id)
    .single();
  if (error || !data) {
    return NextResponse.json({ ok: false, error: 'site not found' }, { status: 404 });
  }
  const site = data as unknown as SiteRow;
  const client = site.clients;
  if (!client) {
    return NextResponse.json({ ok: false, error: 'site has no client' }, { status: 500 });
  }

  if (!site.demo_url) {
    return NextResponse.json(
      { ok: false, error: 'Set the demo URL on this site first.' },
      { status: 400 }
    );
  }
  if (!site.build_price_cents || site.build_price_cents <= 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Set the build value first. The agreement renders from it the moment the client picks a plan.',
      },
      { status: 400 }
    );
  }
  if (!['draft', 'demo_sent'].includes(site.status)) {
    return NextResponse.json(
      { ok: false, error: `cannot send a demo invite while site status is ${site.status}` },
      { status: 409 }
    );
  }

  // One live welcome link at a time.
  const { error: revokeErr } = await supabase
    .from('site_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('site_id', site.id)
    .eq('purpose', 'welcome')
    .is('revoked_at', null);
  if (revokeErr) {
    return NextResponse.json({ ok: false, error: revokeErr.message }, { status: 500 });
  }

  const token = mintToken();
  const expiresAt = new Date(Date.now() + WELCOME_TOKEN_TTL_MS);
  const { error: tokErr } = await supabase.from('site_tokens').insert({
    site_id: site.id,
    purpose: 'welcome',
    token_hash: token.hash,
    expires_at: expiresAt.toISOString(),
  });
  if (tokErr) {
    return NextResponse.json({ ok: false, error: tokErr.message }, { status: 500 });
  }

  const welcomeUrl = `${requestBaseUrl(request)}/welcome/${token.raw}`;

  await supabase
    .from('sites')
    .update({ status: 'demo_sent', status_updated_at: new Date().toISOString() })
    .eq('id', site.id)
    .in('status', ['draft', 'demo_sent']);

  const email = await sendEmail({
    to: client.email,
    subject: `Your demo website for ${client.business_name} is ready`,
    react: DemoInvite({
      contactName: client.contact_name,
      businessName: client.business_name,
      demoUrl: site.demo_url,
      driveUrl: site.drive_url,
      welcomeUrl,
      expiresDisplay: formatInTimeZone(expiresAt, BUSINESS_TZ, 'MMMM d, yyyy'),
    }),
  });

  return NextResponse.json({ ok: true, welcome_url: welcomeUrl, email_ok: email.ok });
}
