-- Demo-first onboarding: pre-agreement welcome flow.
--
-- Sales flow: lead gets a DEMO WEBSITE first; the admin records the demo
-- link, the Google Drive (brand files) link, and the build value, then
-- sends a private tokenized welcome link. The client views their demo,
-- picks a hosting plan + addons, and flows straight into signing.

-- 1. Demo + brand file links on sites
alter table public.sites
  add column if not exists demo_url text,
  add column if not exists drive_url text;

comment on column public.sites.demo_url is 'Demo website URL shown on the client welcome page.';
comment on column public.sites.drive_url is 'Google Drive (brand files) URL shown on the client welcome page.';

-- 2. New pipeline stage: demo_sent (between draft and agreement_sent).
--    Drop the old status check by definition match, then re-add with the
--    expanded list (drop-by-name is fragile if the auto name ever differed).
do $$
declare c text;
begin
  select conname into c
  from pg_constraint
  where conrelid = 'public.sites'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%agreement_sent%';
  if c is not null then
    execute format('alter table public.sites drop constraint %I', c);
  end if;
end $$;

alter table public.sites add constraint sites_status_check
  check (status in ('draft','demo_sent','agreement_sent','signed','building','client_review',
                    'approved','awaiting_payment','live','declined','paused','cancelled'));

-- 3. site_tokens — reusable tokenized links scoped to a SITE.
--    Unlike agreement_tokens these are NOT single use: the client can
--    reopen their welcome link from the email until it expires, is
--    revoked, or their agreement is signed. Hashes only, service role only.
create table if not exists public.site_tokens (
  id         uuid primary key default gen_random_uuid(),
  site_id    uuid not null references public.sites(id) on delete cascade,
  purpose    text not null default 'welcome' check (purpose in ('welcome')),
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create index if not exists site_tokens_site_idx on public.site_tokens (site_id);

alter table public.site_tokens enable row level security;
-- (Intentionally no policies — service role only.)

comment on table public.site_tokens is
  'Reusable tokenized links to a site''s pre-agreement welcome page (/welcome/[token]). Stores sha256 hashes only.';
