-- Client collaboration: update requests, plain English changelog, preview link.
--
-- Flow: client submits a request from the portal -> admin works it (Claude
-- Code later) -> admin marks it done with the hours it took, which posts a
-- plain English update the client sees. Included quarterly hours only start
-- counting once the admin marks the site live.

-- Always-available preview/staging link (separate from the pre-sale demo URL)
alter table public.sites
  add column if not exists preview_url text;

comment on column public.sites.preview_url is
  'Working preview URL shown to the client at all times so they can watch changes land.';

-- 1. Requests the client submits
create table if not exists public.update_requests (
  id           uuid primary key default gen_random_uuid(),
  site_id      uuid not null references public.sites(id) on delete cascade,
  client_id    uuid not null references public.clients(id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  title        text not null,
  details      text,
  status       text not null default 'new'
    check (status in ('new','in_progress','preview_ready','done','declined')),
  preview_url  text,
  admin_notes  text,
  completed_at timestamptz,
  submitted_by uuid references auth.users(id) on delete set null
);

create index if not exists update_requests_site_idx on public.update_requests (site_id);
create index if not exists update_requests_status_idx on public.update_requests (status);

comment on table public.update_requests is
  'Website change requests submitted by clients from the portal. Admin moves status; preview_url is the branch deploy to review before going live.';

-- 2. The plain English changelog the client reads
create table if not exists public.site_updates (
  id                uuid primary key default gen_random_uuid(),
  site_id           uuid not null references public.sites(id) on delete cascade,
  created_at        timestamptz not null default now(),
  title             text not null,
  summary           text not null,           -- written simply, no jargon
  request_id        uuid references public.update_requests(id) on delete set null,
  hours_used        numeric(5,2) not null default 0,
  visible_to_client boolean not null default true
);

create index if not exists site_updates_site_idx on public.site_updates (site_id, created_at desc);

comment on table public.site_updates is
  'Plain English record of work done on a site. hours_used draws down the plan quarterly allowance (only counted once the site is live).';

drop trigger if exists update_requests_touch on public.update_requests;
create trigger update_requests_touch
  before update on public.update_requests
  for each row execute function public.touch_updated_at();

-- 3. RLS: clients READ their own; all writes go through admin/portal APIs
--    using the service role (no client write policies anywhere).
alter table public.update_requests enable row level security;
alter table public.site_updates enable row level security;

create policy update_requests_select_own on public.update_requests
  for select to authenticated
  using (exists (
    select 1 from public.clients c
    where c.id = update_requests.client_id and c.auth_user_id = (select auth.uid())
  ));

create policy site_updates_select_own on public.site_updates
  for select to authenticated
  using (
    visible_to_client
    and exists (
      select 1 from public.sites s
      join public.clients c on c.id = s.client_id
      where s.id = site_updates.site_id and c.auth_user_id = (select auth.uid())
    )
  );
