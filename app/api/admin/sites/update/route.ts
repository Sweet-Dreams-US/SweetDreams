/**
 * Admin: update a site's pipeline status and registry fields.
 *
 * Marking a site LIVE is special — it is the billing moment:
 *   gates:  live URL set + client payment method on file + not already live
 *   action: create the Stripe subscription (hosting + addons) trialing
 *           until the first 1st/15th after today, email the client their
 *           "you are live" notification with the billing start date
 * If the subscription cannot be created, the site does NOT go live.
 * Everything else is a plain field update.
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { formatInTimeZone } from 'date-fns-tz';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin-session';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { SITE_STATUSES, formatPriceCents, type SiteStatus } from '@/lib/clients/constants';
import { monthlyTotalCents, nextBillingAnchor } from '@/lib/clients/billing';
import { BUSINESS_TZ, anchorDayDisplay } from '@/lib/agreements/service';
import { requestBaseUrl } from '@/lib/base-url';
import { ADMIN_EMAIL } from '@/lib/emails/resend';
import { sendEmail } from '@/lib/emails/send';
import SiteLive from '@/lib/emails/site-live';
import ReferralReward from '@/lib/emails/referral-reward';
import UpdateRequestAdmin from '@/lib/emails/update-request-admin';
import { recordReferralRewardOnGoLive } from '@/lib/referrals';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface UpdateBody {
  site_id?: string;
  status?: string;
  admin_notes?: string | null;
  live_url?: string | null;
  demo_url?: string | null;
  drive_url?: string | null;
  domain?: string | null;
  github_repo?: string | null;
  vercel_project_id?: string | null;
  db_project_ref?: string | null;
  go_live_date?: string | null;
  hosting_price_cents?: number;
  min_hosting_price_cents?: number;
  update_hours_per_quarter?: number | null;
  build_price_cents?: number;
  billing_anchor_day?: number;
  analytics_addon?: boolean;
  builder?: string | null;
}

interface GoLiveSite {
  id: string;
  name: string;
  status: string;
  live_url: string | null;
  hosting_price_cents: number;
  analytics_addon: boolean;
  stripe_subscription_id: string | null;
  clients: {
    id: string;
    business_name: string;
    contact_name: string;
    email: string;
    stripe_customer_id: string | null;
    payment_method_saved_at: string | null;
  } | null;
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
    ['demo_url', 'demo_url', 500],
    ['drive_url', 'drive_url', 500],
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

  // Pricing fields. Note: signed agreements are immutable snapshots — price
  // edits here affect billing/records going forward, never past contracts.
  if (body.hosting_price_cents !== undefined) {
    if (!Number.isInteger(body.hosting_price_cents) || body.hosting_price_cents < 0) {
      return NextResponse.json({ ok: false, error: 'invalid hosting price' }, { status: 400 });
    }
    update.hosting_price_cents = body.hosting_price_cents;
  }
  if (body.min_hosting_price_cents !== undefined) {
    if (!Number.isInteger(body.min_hosting_price_cents) || body.min_hosting_price_cents < 0) {
      return NextResponse.json({ ok: false, error: 'invalid minimum plan' }, { status: 400 });
    }
    update.min_hosting_price_cents = body.min_hosting_price_cents;
  }
  if (body.build_price_cents !== undefined) {
    if (!Number.isInteger(body.build_price_cents) || body.build_price_cents < 0) {
      return NextResponse.json({ ok: false, error: 'invalid build value' }, { status: 400 });
    }
    update.build_price_cents = body.build_price_cents;
  }
  if (body.update_hours_per_quarter !== undefined) {
    if (
      body.update_hours_per_quarter !== null &&
      (!Number.isInteger(body.update_hours_per_quarter) || body.update_hours_per_quarter < 0)
    ) {
      return NextResponse.json({ ok: false, error: 'invalid update hours' }, { status: 400 });
    }
    update.update_hours_per_quarter = body.update_hours_per_quarter;
  }
  if (body.billing_anchor_day !== undefined) {
    if (body.billing_anchor_day !== 1 && body.billing_anchor_day !== 15) {
      return NextResponse.json({ ok: false, error: 'billing day must be 1 or 15' }, { status: 400 });
    }
    update.billing_anchor_day = body.billing_anchor_day;
  }
  if (body.analytics_addon !== undefined) {
    update.analytics_addon = body.analytics_addon === true;
  }
  if (body.builder !== undefined) {
    if (body.builder !== null && body.builder !== 'jay' && body.builder !== 'cole') {
      return NextResponse.json({ ok: false, error: 'builder must be jay or cole' }, { status: 400 });
    }
    update.builder = body.builder;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: false, error: 'nothing to update' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // ---- GO LIVE: the billing moment ----
  if (update.status === 'live') {
    const { data } = await supabase
      .from('sites')
      .select(
        'id, name, status, live_url, hosting_price_cents, analytics_addon, stripe_subscription_id, clients (id, business_name, contact_name, email, stripe_customer_id, payment_method_saved_at)'
      )
      .eq('id', body.site_id)
      .single();
    const site = data as unknown as GoLiveSite | null;
    if (!site || !site.clients) {
      return NextResponse.json({ ok: false, error: 'site not found' }, { status: 404 });
    }
    const client = site.clients;

    if (site.status === 'live') {
      return NextResponse.json({ ok: true, already_live: true });
    }

    const liveUrl = (update.live_url as string | null) ?? site.live_url;
    if (!liveUrl) {
      return NextResponse.json(
        { ok: false, error: 'Set the live URL before marking the site live.' },
        { status: 400 }
      );
    }
    if (!client.stripe_customer_id || !client.payment_method_saved_at) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'No payment method on file. The client saves one from their portal after signing. The site cannot go live (or be billed) until then.',
        },
        { status: 400 }
      );
    }

    const anchor = nextBillingAnchor();
    const totalCents = monthlyTotalCents(site);

    // Existing subscription (e.g. a retry after an email failure) is reused.
    let subscriptionId = site.stripe_subscription_id;
    if (!subscriptionId) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2025-08-27.basil',
        });
        const product = await stripe.products.create({
          name: `Website Hosting — ${site.name}`,
          metadata: { sd_site_id: site.id, sd_client_id: client.id },
        });
        const subscription = await stripe.subscriptions.create({
          customer: client.stripe_customer_id,
          items: [
            {
              price_data: {
                currency: 'usd',
                product: product.id,
                recurring: { interval: 'month' },
                unit_amount: totalCents,
              },
            },
          ],
          trial_end: anchor.trialEndUnix,
          proration_behavior: 'none',
          metadata: { sd_site_id: site.id, sd_client_id: client.id },
        });
        subscriptionId = subscription.id;
      } catch (err) {
        console.error('[admin/sites/update] go-live subscription failed:', err);
        return NextResponse.json(
          {
            ok: false,
            error: `Stripe subscription failed, site NOT marked live: ${
              err instanceof Error ? err.message : 'unknown error'
            }`,
          },
          { status: 500 }
        );
      }
    }

    update.stripe_subscription_id = subscriptionId;
    update.billing_starts_on = anchor.isoDate;
    update.billing_anchor_day = anchor.anchorDay;
    if (update.go_live_date === undefined) {
      update.go_live_date = formatInTimeZone(new Date(), BUSINESS_TZ, 'yyyy-MM-dd');
    }

    const { error: applyErr } = await supabase
      .from('sites')
      .update(update)
      .eq('id', body.site_id);
    if (applyErr) {
      console.error('[admin/sites/update] go-live save failed:', applyErr);
      return NextResponse.json({ ok: false, error: applyErr.message }, { status: 500 });
    }

    const billingStartDisplay = formatInTimeZone(
      new Date(`${anchor.isoDate}T12:00:00`),
      BUSINESS_TZ,
      'MMMM d, yyyy'
    );
    const email = await sendEmail({
      to: client.email,
      subject: `${client.business_name} is LIVE`,
      react: SiteLive({
        contactName: client.contact_name,
        businessName: client.business_name,
        liveUrl,
        billingStartDisplay,
        monthlyDisplay: formatPriceCents(totalCents),
        anchorDayDisplay: `the ${anchorDayDisplay(anchor.anchorDay)}`,
        portalUrl: `${requestBaseUrl(request)}/portal`,
      }),
    });

    // Referral: if this client came in through a tracked share link, record
    // the referrer's reward now. Best-effort — never blocks the go-live.
    try {
      const referral = await recordReferralRewardOnGoLive(supabase, client.id, site.id);
      if (referral.rewarded && referral.referrer && referral.monthsFree) {
        await sendEmail({
          to: referral.referrer.email,
          subject: `Your referral is live: ${referral.monthsFree} months of hosting free`,
          react: ReferralReward({
            contactName: referral.referrer.contact_name,
            referredBusinessName: client.business_name,
            monthsFree: referral.monthsFree,
            portalUrl: `${requestBaseUrl(request)}/portal`,
          }),
        });
        await sendEmail({
          to: ADMIN_EMAIL,
          subject: `REFERRAL reward: ${referral.referrer.business_name} earned ${referral.monthsFree} free months`,
          react: UpdateRequestAdmin({
            businessName: referral.referrer.business_name,
            siteName: site.name,
            contactName: referral.referrer.contact_name,
            title: `Apply ${referral.monthsFree} free hosting months in Stripe`,
            details: `${client.business_name} came in through ${referral.referrer.business_name}'s referral link and is now live. Apply ${referral.monthsFree} free months to ${referral.referrer.business_name}'s hosting subscription (pause or trial the upcoming invoices), then mark the reward applied.`,
            adminUrl: `${requestBaseUrl(request)}/admin/clients/${referral.referrer.id}`,
          }),
        });
      }
    } catch (referralErr) {
      console.error('[admin/sites/update] referral reward check failed:', referralErr);
    }

    return NextResponse.json({
      ok: true,
      live: true,
      billing_starts_on: anchor.isoDate,
      monthly_cents: totalCents,
      email_ok: email.ok,
    });
  }

  // ---- plain field update ----
  const { error } = await supabase.from('sites').update(update).eq('id', body.site_id);
  if (error) {
    console.error('[admin/sites/update] failed:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
