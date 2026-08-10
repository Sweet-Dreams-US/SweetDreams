/**
 * Portal: Stripe Checkout setup-mode success redirect.
 *
 * Verifies the session server side (no webhook needed for this step),
 * makes the saved payment method the customer default for future hosting
 * invoices, stamps payment_method_saved_at, and lands back on the portal.
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const portal = (suffix: string) =>
    NextResponse.redirect(new URL(`/portal${suffix}`, request.url));

  const supabaseUser = await createClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();
  if (!user) return portal('/login');

  const sessionId = request.nextUrl.searchParams.get('session_id');
  if (!sessionId) return portal('?billing=error');

  const supabase = createServiceRoleClient();
  const { data: client } = await supabase
    .from('clients')
    .select('id, stripe_customer_id')
    .eq('auth_user_id', user.id)
    .is('archived_at', null)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!client?.stripe_customer_id) return portal('?billing=error');

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
    });
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['setup_intent'],
    });

    if (
      session.mode !== 'setup' ||
      session.status !== 'complete' ||
      session.customer !== client.stripe_customer_id
    ) {
      return portal('?billing=error');
    }

    const setupIntent = session.setup_intent as Stripe.SetupIntent | null;
    const paymentMethod =
      typeof setupIntent?.payment_method === 'string'
        ? setupIntent.payment_method
        : setupIntent?.payment_method?.id;

    if (paymentMethod) {
      await stripe.customers.update(client.stripe_customer_id, {
        invoice_settings: { default_payment_method: paymentMethod },
      });
    }

    await supabase
      .from('clients')
      .update({ payment_method_saved_at: new Date().toISOString() })
      .eq('id', client.id);

    return portal('?billing=saved');
  } catch (err) {
    console.error('[portal/billing/confirm] failed:', err);
    return portal('?billing=error');
  }
}
