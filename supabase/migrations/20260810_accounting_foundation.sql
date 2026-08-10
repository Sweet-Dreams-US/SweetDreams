-- Accounting foundation: builder payout split, per-site expenses, monthly
-- payouts ledger.
--
-- Model (Cole): whoever built the site (Jay or Cole) receives 65% of that
-- site's monthly revenue; the business keeps 35%. Per-site costs must stay
-- under the 35% for the business to profit. Month close materializes
-- recurring expense templates into dated entries, computes payout rows per
-- payee, and Mark Paid gives transaction history + the running balance.

-- 1. Who built the site (receives the 65%)
alter table public.sites
  add column if not exists builder text check (builder in ('jay','cole'));

comment on column public.sites.builder is
  'Employee who built the site; receives 65% of monthly revenue. Business keeps 35%.';

-- 2. Per-site expenses: recurring templates + dated actual entries
create table if not exists public.site_expenses (
  id           uuid primary key default gen_random_uuid(),
  site_id      uuid not null references public.sites(id) on delete cascade,
  created_at   timestamptz not null default now(),
  category     text not null check (category in
    ('vercel','supabase','domain','media','labor','api','software','writeoff','other')),
  description  text,
  amount_cents integer not null check (amount_cents >= 0),
  -- recurring = a monthly TEMPLATE; month close copies it into a dated entry
  recurring    boolean not null default false,
  -- dated actual entry: which month it belongs to (first of month); null on templates
  month        date,
  -- when a dated entry was materialized from a template
  template_id  uuid references public.site_expenses(id) on delete set null
);

create index if not exists site_expenses_site_idx on public.site_expenses (site_id);
create index if not exists site_expenses_month_idx on public.site_expenses (month);
create unique index if not exists site_expenses_template_month_uniq
  on public.site_expenses (template_id, month) where template_id is not null;

comment on table public.site_expenses is
  'Every penny spent per site. recurring=true rows are monthly templates; dated rows (month set) are actual incurred costs, including writeoffs for unpaid service.';

-- 3. Monthly payouts ledger (one row per month per payee)
create table if not exists public.payouts (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  month        date not null,                    -- first of month
  payee        text not null check (payee in ('jay','cole','business')),
  amount_cents integer not null check (amount_cents >= 0),
  status       text not null default 'owed' check (status in ('owed','paid')),
  paid_at      timestamptz,
  note         text,
  unique (month, payee)
);

create index if not exists payouts_month_idx on public.payouts (month);

comment on table public.payouts is
  'Month-close results: 65% owed to the builder(s), 35% booked to the business. Mark Paid stamps history; the business balance sums business rows minus dated expenses.';

-- 4. Service-role only
alter table public.site_expenses enable row level security;
alter table public.payouts enable row level security;
-- (no policies — admin service role only)
