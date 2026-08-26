-- Agreement termination + client cancellation requests.
--
-- Rules (Cole): before the site is officially LIVE either party may end the
-- agreement instantly; after live it is the 60 day notice from the contract.
-- Clients request cancellation from the portal; the admin confirms, which
-- terminates the agreement and stamps the effective date.
--
-- The signed SNAPSHOT stays immutable — termination is lifecycle state, so
-- the freeze trigger is recreated to allow ONLY these four fields to change
-- on a signed agreement.

alter table public.agreements
  add column if not exists terminated_at timestamptz,
  add column if not exists terminated_by text check (terminated_by in ('admin','client')),
  add column if not exists termination_reason text,
  add column if not exists termination_effective date;

comment on column public.agreements.termination_effective is
  'When hosting actually ends: immediately if terminated before live, notice date + 60 days if terminated after live.';

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
       or new.signed_content_sha256 is distinct from old.signed_content_sha256
       or new.signature_image is distinct from old.signature_image then
      raise exception 'signed agreements are immutable';
    end if;
    -- terminated_at / terminated_by / termination_reason / termination_effective
    -- are lifecycle fields and MAY change on signed rows.
  end if;

  return new;
end;
$$;

create table if not exists public.cancellation_requests (
  id           uuid primary key default gen_random_uuid(),
  site_id      uuid not null references public.sites(id) on delete cascade,
  client_id    uuid not null references public.clients(id) on delete cascade,
  created_at   timestamptz not null default now(),
  reason       text,
  status       text not null default 'pending'
    check (status in ('pending','confirmed','withdrawn')),
  resolved_at  timestamptz,
  submitted_by uuid references auth.users(id) on delete set null
);

create index if not exists cancellation_requests_site_idx on public.cancellation_requests (site_id);
create index if not exists cancellation_requests_status_idx on public.cancellation_requests (status);

comment on table public.cancellation_requests is
  'Client-initiated cancellation requests from the portal. Admin confirming one terminates the agreement (instant before live, 60 day notice after).';

alter table public.cancellation_requests enable row level security;

create policy cancellation_requests_select_own on public.cancellation_requests
  for select to authenticated
  using (exists (
    select 1 from public.clients c
    where c.id = cancellation_requests.client_id and c.auth_user_id = (select auth.uid())
  ));
