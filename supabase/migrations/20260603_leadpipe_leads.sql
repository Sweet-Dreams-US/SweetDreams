-- Leadpipe Leads table — stores webhook events from Leadpipe for visitors
-- identified on sweetdreams.us. Read by the nightmaresturntodreams.com
-- admin dashboard (via Supabase REST/RPC using a shared service role key
-- or a dedicated read-only key).
--
-- Write path: POST /api/leadpipe/webhook on sweetdreams.us
--   - HMAC-SHA256 signature verified against LEADPIPE_WEBHOOK_SECRET
--   - Writes via SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)
--
-- Read path: nightmares admin
--   - Uses service role key OR is granted policy access
--   - Filters by source_domain to scope per-property

-- ============================================================
-- Table
-- ============================================================
create table if not exists public.leadpipe_leads (
  id                uuid primary key default gen_random_uuid(),

  -- Source identifiers (which Leadpipe pixel sent this)
  source_pixel      text        not null,
  source_domain     text        not null,
  event_type        text        not null,     -- visitor.identified | visitor.updated | visitor.match | ...

  -- Timestamps
  received_at       timestamptz not null default now(),  -- when we got the webhook
  event_at          timestamptz,                          -- timestamp from payload

  -- Visitor journey
  visitor_id        text,
  page_views        int,
  pages_visited     jsonb,                                -- array of {path, timestamp}

  -- Contact (often null on first hits, populated after identification)
  contact_name      text,
  contact_title     text,
  contact_email     text,
  contact_phone     text,
  contact_linkedin  text,

  -- Company
  company_name      text,
  company_domain    text,
  company_industry  text,
  company_size      text,
  company_city      text,
  company_state     text,

  -- Intent
  intent_score      int,
  intent_topics     jsonb,

  -- Source of truth — always store the full original payload so we never
  -- lose Leadpipe fields we haven't mapped yet. New Leadpipe fields can
  -- be surfaced later without re-ingesting.
  raw_payload       jsonb not null,

  -- Outreach tracking (managed by admin dashboard, not webhook)
  outreach_status   text default 'new'
                    check (outreach_status in ('new','contacted','replied','qualified','dead')),
  outreach_notes    text,
  contacted_at      timestamptz,
  contacted_by      text,                                 -- email of admin who took action

  -- Bookkeeping
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists leadpipe_leads_received_at_idx
  on public.leadpipe_leads (received_at desc);

create index if not exists leadpipe_leads_domain_intent_idx
  on public.leadpipe_leads (source_domain, intent_score desc nulls last);

create index if not exists leadpipe_leads_status_idx
  on public.leadpipe_leads (outreach_status);

create index if not exists leadpipe_leads_visitor_idx
  on public.leadpipe_leads (visitor_id);

create index if not exists leadpipe_leads_company_domain_idx
  on public.leadpipe_leads (company_domain);

-- ============================================================
-- updated_at auto-bump trigger
-- ============================================================
create or replace function public.leadpipe_leads_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leadpipe_leads_touch on public.leadpipe_leads;
create trigger leadpipe_leads_touch
  before update on public.leadpipe_leads
  for each row execute function public.leadpipe_leads_set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
-- This table holds sensitive lead intelligence — only the service role
-- (used by our webhook + our admin readers) can touch it. Anon clients
-- have zero access; never expose this with the anon key on a public page.
alter table public.leadpipe_leads enable row level security;

-- (Intentionally no anon policies — service role bypasses RLS by design.)
-- If you ever want to expose subset reads to authenticated admin users,
-- add a policy here keyed on auth.uid() membership in an admins table.

comment on table public.leadpipe_leads is
  'Lead intelligence captured from Leadpipe webhooks. Multi-tenant by source_domain. Written by sweetdreams.us /api/leadpipe/webhook, read by nightmaresturntodreams.com admin dashboard.';
