-- Demo Approval Queue (2026-09-04)
--
-- A demo is not done when it deploys. It is done when the client has opened
-- it. Every state between those two points lives on public.sites so that
-- /admin/demos can show the whole ladder with timestamps and nothing ages
-- past 48 hours unseen.
--
-- Ladder: none -> building -> ready_for_review -> approved -> sent -> viewed
--         changes_requested loops back to building/ready_for_review.
-- Claude (via the Supabase connector) writes building, ready_for_review, sent.
-- ONLY the admin UI (/admin/demos, cookie-gated) writes approved.
-- The welcome page writes viewed when the client opens their private link.

alter table public.sites
  add column if not exists demo_status text not null default 'none',
  add column if not exists demo_admin_url text,
  add column if not exists demo_passcode text,
  add column if not exists demo_built_at timestamptz,
  add column if not exists demo_approved_at timestamptz,
  add column if not exists demo_sent_at timestamptz,
  add column if not exists demo_first_viewed_at timestamptz,
  add column if not exists demo_notes text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'sites_demo_status_check') then
    alter table public.sites
      add constraint sites_demo_status_check check (demo_status in
        ('none','building','ready_for_review','approved','sent','viewed','changes_requested'));
  end if;
end $$;

create index if not exists sites_demo_status_idx on public.sites (demo_status, demo_built_at);

comment on column public.sites.demo_status is
  'Demo ladder: none, building, ready_for_review, approved (admin UI only), sent, viewed, changes_requested.';
comment on column public.sites.demo_built_at is
  'When the demo deployed and was verified loading. Drives the age shown on /admin/demos.';
