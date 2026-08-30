-- Referral program (portal-run, NOT a contract term as of agreement v4).
--
-- clients.referral_code        unique share code; the client's tracked link is
--                              /free-website?ref=<code>. Generated lazily the
--                              first time the client opens their referrals page.
-- marketing_leads.referred_by_code  set when a lead arrives through a tracked
--                              link with a code that matches a real client.
-- referral_rewards             one row per referred website that officially
--                              goes live. months_free is computed from the
--                              REFERRER's own hosting plan at that moment
--                              ($50 plan earns 3 months, $85 and up earn 2).
--                              status: earned -> applied (admin applies the
--                              free months to the Stripe subscription).

alter table public.clients
  add column if not exists referral_code text;

create unique index if not exists clients_referral_code_key
  on public.clients (referral_code)
  where referral_code is not null;

alter table public.marketing_leads
  add column if not exists referred_by_code text;

create index if not exists marketing_leads_referred_by_code_idx
  on public.marketing_leads (referred_by_code)
  where referred_by_code is not null;

create table if not exists public.referral_rewards (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  referrer_client_id uuid not null references public.clients(id) on delete cascade,
  referred_client_id uuid not null references public.clients(id) on delete cascade,
  referred_site_id uuid not null references public.sites(id) on delete cascade,
  months_free integer not null check (months_free between 1 and 12),
  status text not null default 'earned' check (status in ('earned', 'applied')),
  applied_at timestamptz,
  notes text
);

-- One reward per referred website, ever.
create unique index if not exists referral_rewards_referred_site_key
  on public.referral_rewards (referred_site_id);

create index if not exists referral_rewards_referrer_idx
  on public.referral_rewards (referrer_client_id);

alter table public.referral_rewards enable row level security;

-- Referrers can see their own rewards; all writes stay service-role only.
drop policy if exists "Clients read own referral rewards" on public.referral_rewards;
create policy "Clients read own referral rewards"
  on public.referral_rewards
  for select
  to authenticated
  using (
    referrer_client_id in (
      select id from public.clients where auth_user_id = (select auth.uid())
    )
  );
