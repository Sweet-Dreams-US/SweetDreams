-- Go-live billing: when the admin marks a site live, a Stripe subscription
-- is created on the saved payment method, trialing until the next 1st or
-- 15th (whichever comes first after the live date) and billing monthly on
-- that day from then on.
alter table public.sites
  add column if not exists stripe_subscription_id text,
  add column if not exists billing_starts_on date;

comment on column public.sites.stripe_subscription_id is
  'Stripe subscription created at go live (trial until the first 1st/15th after the live date).';
comment on column public.sites.billing_starts_on is
  'First hosting charge date (the 1st or 15th after go live); the monthly billing day thereafter.';
