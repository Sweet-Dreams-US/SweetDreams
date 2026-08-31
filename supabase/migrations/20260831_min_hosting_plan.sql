-- Per-site minimum hosting plan for the client-facing plan pickers.
-- 0 = every plan shown. Set to 8500 (or higher) when the build requires a
-- bigger plan (for example payment processing needs $85+): tiers priced
-- below the minimum disappear from the welcome page picker and the signing
-- page comparison, and the plan-select API refuses them server side.
alter table public.sites
  add column if not exists min_hosting_price_cents integer not null default 0
  check (min_hosting_price_cents >= 0);
