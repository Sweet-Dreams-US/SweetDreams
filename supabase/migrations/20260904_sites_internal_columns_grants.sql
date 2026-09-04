-- Sites: keep internal admin columns out of the portal (2026-09-04)
--
-- sites_select_own lets a signed-in portal client SELECT their own sites
-- rows, and the anon key ships to the browser, so anyone logged in can call
-- PostgREST directly with ?select=demo_notes,demo_admin_url,demo_passcode
-- (or admin_notes) and read Cole's internal change-request and backfill
-- notes. Nothing the portal runs reads those columns: every sites query in
-- app/portal, app/api/portal, app/api/agreement, app/welcome and lib/ uses
-- an explicit column list, and the admin surfaces use the service role.
--
-- Postgres ignores a column-level REVOKE while a table-level SELECT grant
-- still exists (Supabase's default privileges grant one to anon and
-- authenticated), so this drops the table-level SELECT and re-grants SELECT
-- to authenticated on every column except the internal four. anon gets no
-- SELECT back: it has no policy on sites and never saw a row anyway.
-- Writes were already blocked for both roles (no insert/update/delete
-- policies); that is unchanged. service_role is unaffected.
--
-- Consequence: a column added to public.sites later is NOT readable through
-- the portal until it gets
--   grant select (that_column) on public.sites to authenticated;
-- so a portal query on a new column fails loudly instead of leaking.
do $$
declare
  cols text;
begin
  select string_agg(quote_ident(column_name), ', ' order by ordinal_position)
    into cols
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'sites'
    and column_name not in ('demo_notes', 'demo_admin_url', 'demo_passcode', 'admin_notes');

  if cols is null then
    raise exception 'public.sites has no columns to grant';
  end if;

  revoke select on public.sites from anon, authenticated;
  execute format('grant select (%s) on public.sites to authenticated', cols);
  raise notice 'public.sites: authenticated may select (%)', cols;
end $$;
