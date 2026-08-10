/**
 * Portal: start a Stripe Checkout SETUP session to save a payment method.
 *
 * Setup mode saves a card or bank on file WITHOUT charging anything —
 * hosting billing only starts when the admin marks the site live (next
 * 1st or 15th). Auth is the client's portal session; the Stripe customer
 * is found or created and stored on their client row.
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { requestBaseUrl } from '@/lib/base-url';

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

  const supabase = createServiceRoleClient();
  const { data: client } = await supabase
    .from('clients')
    .select('id, business_name, contact_name, email, stripe_customer_id')
    .eq('auth_user_id', user.id)
    .is('archived_at', null)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'no client account linked to this login' },
      { status: 404 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  });

  let customerId = client.stripe_customer_id as string | null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: client.email,
      name: client.business_name,
      metadata: { sd_client_id: client.id, contact_name: client.contact_name },
    });
    customerId = customer.id;
    await supabase
      .from('clients')
      .update({ stripe_customer_id: customerId })
      .eq('id', client.id);
  }

  const base = requestBaseUrl(request);
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'setup',
    customer: customerId,
    success_url: `${base}/api/portal/billing/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/portal`,
    metadata: { sd_client_id: client.id },
  };

  // Prefer card + ACH bank; fall back to card only if bank debits are not
  // enabled on the Stripe account.
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      ...sessionParams,
      payment_method_types: ['card', 'us_bank_account'],
    });
  } catch (err) {
    console.warn(
      '[portal/billing/checkout] card+bank session failed, retrying card only:',
      err instanceof Error ? err.message : err
    );
    session = await stripe.checkout.sessions.create({
      ...sessionParams,
      payment_method_types: ['card'],
    });
  }

  return NextResponse.json({ ok: true, url: session.url });
}
