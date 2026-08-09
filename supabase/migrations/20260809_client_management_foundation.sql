-- Client management foundation: clients, sites, agreements, agreement_tokens.
-- Powers /admin/clients, the e-sign flow at /agreement/[token], and the
-- client portal at /portal.
--
-- Write path: service role only (admin APIs + signing flow).
-- Read path: portal clients read their OWN rows through RLS with the
--   authenticated key; agreement_tokens are never readable outside
--   the service role.
--
-- Additive only — does not touch music-site tables.

-- ============================================================
-- clients — one row per business we serve
-- ============================================================
create table if not exists public.clients (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  business_name      text not null,
  contact_name       text not null,
  email              text not null,            -- normalized lowercase by app code
  phone              text,

  -- Linked at signing. NOT unique: one person can own several businesses.
  auth_user_id       uuid references auth.users(id) on delete set null,

  -- Billing phase (Stripe subscriptions) fills this in later.
  stripe_customer_id text,

  -- Where this client came from (free-website funnel inquiry etc.)
  source_lead_id     uuid references public.marketing_leads(id) on delete set null,

  admin_notes        text,
  archived_at        timestamptz
);

create index if not exists clients_email_idx on public.clients (lower(email));
create index if not exists clients_auth_user_idx on public.clients (auth_user_id);

comment on table public.clients is
  'Website clients (free build + monthly hosting). Created from /admin, linked to auth.users at agreement signing. Distinct from music-studio profiles.';

-- ============================================================
-- sites — one row per website build (client 1:N sites)
-- ============================================================
create table if not exists public.sites (
  id                       uuid primary key default gen_random_uuid(),
  client_id                uuid not null references public.clients(id) on delete restrict,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),

  name                     text not null,
  domain                   text,

  -- Onboarding pipeline. Manual moves from /admin for now; the billing
  -- phase will gate 'live' on an active subscription.
  status                   text not null default 'draft'
    check (status in ('draft','agreement_sent','signed','building','client_review',
                      'approved','awaiting_payment','live','declined','paused','cancelled')),
  status_updated_at        timestamptz,

  -- Offer economics. The build is free to the client; build_price_cents is
  -- the recorded build value that anchors the contract buyout schedule
  -- (yr1 100% / yr2 75% / yr3 65% / yr4+ 50% of build value).
  hosting_price_cents      integer not null check (hosting_price_cents >= 0),
  update_hours_per_quarter integer,
  build_price_cents        integer not null default 0 check (build_price_cents >= 0),
  billing_anchor_day       smallint not null default 1 check (billing_anchor_day in (1, 15)),

  -- Database packaging: simple ($50) sites ride the shared platform database
  -- (their forms POST to a central sweetdreams.us API); a dedicated Supabase
  -- project requires the $85+ plan. db_project_ref = project ref for
  -- dedicated, or shared-cluster id; null = the main SweetDreams project.
  db_mode                  text not null default 'shared'
    check (db_mode in ('none','shared','dedicated')),
  db_project_ref           text,

  -- Infrastructure registry: each client site = its own GitHub repo + its
  -- own Vercel project. The automation phase drives previews/merges off these.
  github_repo              text,
  vercel_project_id        text,
  live_url                 text,
  go_live_date             date,

  admin_notes              text
);

create index if not exists sites_client_idx on public.sites (client_id);
create index if not exists sites_status_idx on public.sites (status);

comment on table public.sites is
  'Client website builds. One per site; carries onboarding status, hosting tier economics, db packaging mode, and the repo/Vercel registry for later automation.';

-- ============================================================
-- agreements — immutable snapshots of what was sent and signed
-- ============================================================
create table if not exists public.agreements (
  id                    uuid primary key default gen_random_uuid(),
  client_id             uuid not null references public.clients(id) on delete restrict,
  site_id               uuid not null references public.sites(id) on delete restrict,
  created_at            timestamptz not null default now(),

  template_version      text not null,
  variables             jsonb not null,      -- fill values snapshot (price, names, dates)
  rendered_text         text not null,       -- frozen at send time; resends reuse it verbatim
  content_sha256        text not null,

  status                text not null default 'sent'
    check (status in ('sent','signed','revoked')),

  first_viewed_at       timestamptz,

  -- Signature record (ESIGN attribution)
  signed_at             timestamptz,
  signer_name           text,
  signer_ip             inet,
  signer_user_agent     text,
  consents              jsonb,               -- [{key, label, checked}] with exact checkbox text
  signed_content_sha256 text,                -- recomputed from stored text at signing

  revoked_at            timestamptz,
  revoke_reason         text,

  constraint agreements_signed_fields_complete check (
    status <> 'signed'
    or (signed_at is not null and signer_name is not null and signed_content_sha256 is not null)
  )
);

create index if not exists agreements_client_idx on public.agreements (client_id);
create index if not exists agreements_site_idx on public.agreements (site_id);

-- A site can only ever have one signed agreement.
create unique index if not exists agreements_one_signed_per_site
  on public.agreements (site_id) where status = 'signed';

comment on table public.agreements is
  'Website services + hosting agreements. rendered_text is an immutable snapshot with a sha256 fingerprint; changed terms mean revoke + new row, never an edit.';

-- ============================================================
-- agreement_tokens — hashed single-use links (sign + account setup)
-- ============================================================
create table if not exists public.agreement_tokens (
  id           uuid primary key default gen_random_uuid(),
  agreement_id uuid not null references public.agreements(id) on delete cascade,
  purpose      text not null default 'sign' check (purpose in ('sign','account_setup')),
  token_hash   text not null unique,         -- sha256 hex of the raw token; raw is never stored
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null,         -- ~14 days for sign, ~60 min for account_setup
  used_at      timestamptz,
  revoked_at   timestamptz
);

create index if not exists agreement_tokens_agreement_idx
  on public.agreement_tokens (agreement_id);

comment on table public.agreement_tokens is
  'Single-use tokens behind /agreement/[token] links and post-sign password setup. Stores hashes only; every issued link leaves an audit row.';

-- ============================================================
-- updated_at auto-bump triggers
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists clients_touch on public.clients;
create trigger clients_touch
  before update on public.clients
  for each row execute function public.touch_updated_at();

drop trigger if exists sites_touch on public.sites;
create trigger sites_touch
  before update on public.sites
  for each row execute function public.touch_updated_at();

-- ============================================================
-- Agreement immutability
-- ============================================================
-- Content is frozen from the moment a row is created (send time). Signature
-- fields freeze once status reaches 'signed'. Allowed transitions:
--   sent -> signed (signature fields written exactly once)
--   sent -> revoked (revoked_at / revoke_reason)
--   first_viewed_at may be set while sent.
create or replace function public.agreements_block_mutation()
returns trigger language plpgsql as $$
begin
  if new.rendered_text is distinct from old.rendered_text
     or new.content_sha256 is distinct from old.content_sha256
     or new.template_version is distinct from old.template_version
     or new.variables is distinct from old.variables
     or new.client_id is distinct from old.client_id
     or new.site_id is distinct from old.site_id then
    raise exception 'agreement content is immutable';
  end if;

  if old.status = 'signed' then
    if new.status is distinct from old.status
       or new.signed_at is distinct from old.signed_at
       or new.signer_name is distinct from old.signer_name
       or new.signer_ip is distinct from old.signer_ip
       or new.signer_user_agent is distinct from old.signer_user_agent
       or new.consents is distinct from old.consents
       or new.signed_content_sha256 is distinct from old.signed_content_sha256 then
      raise exception 'signed agreements are immutable';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists agreements_immutable on public.agreements;
create trigger agreements_immutable
  before update on public.agreements
  for each row execute function public.agreements_block_mutation();

-- ============================================================
-- Auth lookup RPC (PostgREST cannot query the auth schema)
-- ============================================================
-- The signing flow must LINK an existing auth user (music customers share
-- this auth pool) instead of blindly creating a duplicate. Service role only.
create or replace function public.get_auth_user_id_by_email(p_email text)
returns uuid
language sql
security definer
set search_path = public
as $$
  select id from auth.users
  where lower(email) = lower(p_email)
    and deleted_at is null
  limit 1;
$$;

revoke all on function public.get_auth_user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.get_auth_user_id_by_email(text) to service_role;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.clients enable row level security;
alter table public.sites enable row level security;
alter table public.agreements enable row level security;
alter table public.agreement_tokens enable row level security;

-- Portal clients read only their own rows. All writes go through the
-- service role — no insert/update/delete policies for anon/authenticated.
create policy clients_select_own on public.clients
  for select to authenticated
  using (auth_user_id = (select auth.uid()));

create policy sites_select_own on public.sites
  for select to authenticated
  using (exists (
    select 1 from public.clients c
    where c.id = sites.client_id
      and c.auth_user_id = (select auth.uid())
  ));

-- Clients only ever see their signed agreement — never drafts or revoked.
create policy agreements_select_own_signed on public.agreements
  for select to authenticated
  using (
    status = 'signed'
    and exists (
      select 1 from public.clients c
      where c.id = agreements.client_id
        and c.auth_user_id = (select auth.uid())
    )
  );

-- agreement_tokens: intentionally NO policies — service role only.
