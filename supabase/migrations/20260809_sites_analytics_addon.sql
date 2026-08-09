-- Analytics packaging: monthly analytics reports are included free at the
-- $85+ hosting plans; $50 plans can add them for $5/mo. This flag records
-- the add on choice for sub-$85 sites (billing wiring lands in the Stripe
-- phase; the agreement text reflects it now).
alter table public.sites
  add column if not exists analytics_addon boolean not null default false;

comment on column public.sites.analytics_addon is
  'Client opted into the $5/mo analytics reports add on (only meaningful below the $85 plans, which include analytics).';
