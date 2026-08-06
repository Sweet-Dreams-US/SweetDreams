-- Free-website inquiry pipeline: status + notes on marketing_leads.
-- Powers the /admin/inquiries panel (new -> contacted -> building -> signed ->
-- live / declined). Additive and idempotent; does not touch capture/tracking.
alter table public.marketing_leads
  add column if not exists status text not null default 'new',
  add column if not exists status_updated_at timestamptz,
  add column if not exists admin_notes text;
