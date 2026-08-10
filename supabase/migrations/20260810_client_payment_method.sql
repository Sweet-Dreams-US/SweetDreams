-- Payment method on file: after signing, clients save a card or bank via
-- Stripe Checkout (setup mode — saved, never charged at signing). Billing
-- itself starts only when the admin marks the site live (next 1st or 15th).
alter table public.clients
  add column if not exists payment_method_saved_at timestamptz;

comment on column public.clients.payment_method_saved_at is
  'When a default payment method was saved via Stripe Checkout setup mode. Charging starts at go live, never at signing.';
