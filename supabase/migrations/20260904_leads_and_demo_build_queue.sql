-- Leads table + demo build queue (2026-09-04, Prompt A of the demo factory)
--
-- Leads lived only in a Google Sheet; demos live in public.sites. Nothing
-- joined them, so finished demos rotted unseen. public.leads is the working
-- pipeline row for every Meta free-website lead, and leads.site_id is the
-- join to the demo. public.demo_build_queue is what the factory reads: every
-- lead with no demo yet that either gave us enough info OR was first
-- contacted more than 48 hours ago. Missing photos are a placeholder, not a
-- reason to wait.

create table if not exists public.leads (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),
  full_name               text not null,
  business_name           text,
  phone                   text unique,
  email                   text,
  what_they_do            text,        -- their own words from the Meta form
  source                  text default 'meta_free_website',
  contact_card_created_at timestamptz,
  stage                   text not null default 'new',
  first_contact_at        timestamptz,
  last_inbound_at         timestamptz,
  last_outbound_at        timestamptz,
  touches                 int not null default 0,
  next_action             text,
  next_due                timestamptz,
  site_id                 uuid references public.sites(id),
  drive_url               text,
  notes                   text,
  constraint leads_stage_check check (stage in (
    'new','contacted','replied','questions_sent','questions_answered',
    'enough_info','demo_pending','demo_sent','negotiating','signed',
    'soft_no','do_not_contact'))
);

comment on table public.leads is
  'Meta free-website lead pipeline. stage is the working state; site_id joins the demo in public.sites. Written by the ops team and the demo factory through the service role.';
comment on column public.leads.what_they_do is 'The lead''s own words from the Meta form. Never rewrite.';

create index if not exists leads_next_due_idx
  on public.leads (next_due)
  where stage not in ('signed','soft_no','do_not_contact');
create index if not exists leads_stage_idx on public.leads (stage);

-- Access: RLS on. Service role has full access (it bypasses RLS). Portal
-- users (authenticated) get SELECT only, and only on the columns an admin
-- lead UI reads: notes is internal and is not granted. There is deliberately
-- NO policy for anon or authenticated, so even the granted columns return
-- no rows until someone adds a policy on purpose. Remember: a column the UI
-- reads without an explicit grant makes that query fail loudly.
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
grant all on public.leads to service_role;
grant select (
  id, created_at, full_name, business_name, phone, email, what_they_do, source,
  contact_card_created_at, stage, first_contact_at, last_inbound_at,
  last_outbound_at, touches, next_action, next_due, site_id, drive_url
) on public.leads to authenticated;

-- The build queue. security_invoker so the view never widens access beyond
-- what the caller already has on public.leads.
create or replace view public.demo_build_queue
  with (security_invoker = true) as
select l.id as lead_id, l.full_name, l.business_name, l.phone, l.what_they_do,
       l.first_contact_at, l.stage, l.drive_url,
       now() - l.first_contact_at as age
  from public.leads l
 where l.site_id is null
   and l.stage not in ('soft_no','do_not_contact','signed')
   and ( l.stage in ('enough_info','questions_answered')
      or l.first_contact_at < now() - interval '48 hours' )
 order by l.first_contact_at;

comment on view public.demo_build_queue is
  'Leads that should get a demo now: no demo yet, not closed, and either enough info or first contacted more than 48 hours ago. The factory works this top to bottom.';

revoke all on public.demo_build_queue from anon, authenticated;
grant select on public.demo_build_queue to service_role;
