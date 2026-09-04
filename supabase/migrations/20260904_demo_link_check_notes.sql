-- Demo link check (2026-09-04, Prompt A): every queued demo_url and its /admin route were fetched
-- with no cookies and the actual HTTP result appended to demo_notes. The earlier backfill warning
-- that Vercel Authentication would show a sign-in wall was wrong (the production .vercel.app alias
-- is public), so that sentence is stripped. demo_admin_url is set where /admin returned a real page.
-- Applied to Supabase via the connector on 2026-09-04; kept here for the record.

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: C² Antiques &amp; Collectibles, Fort Wayne, Indiana); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://c2antiques.vercel.app/admin')
where demo_url in ('https://c2antiques.vercel.app', 'https://c2antiques.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Davis Realty Services — Lower commissions in Northeastern Indiana); /admin 404 NOT FOUND.'
where demo_url in ('https://davis-realty-services.vercel.app', 'https://davis-realty-services.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Rob’s Just Right Seasoning | Flavor Made Personal); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://robs-just-right-seasoning-demo.vercel.app/admin')
where demo_url in ('https://robs-just-right-seasoning-demo.vercel.app', 'https://robs-just-right-seasoning-demo.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: PrimeWay Detailing — Mobile Auto Detailing in Fort Wayne, IN); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://primeway-detailing.vercel.app/admin')
where demo_url in ('https://primeway-detailing.vercel.app', 'https://primeway-detailing.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Skin Artistry by Ivy — Curated facials in Fort Wayne); /admin 404 NOT FOUND.'
where demo_url in ('https://skin-artistry-by-ivy.vercel.app', 'https://skin-artistry-by-ivy.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Clean Slate Junk Removal — Fort Wayne | Same-day hauling &amp; handyma); /admin 404 NOT FOUND.'
where demo_url in ('https://clean-slate-junk-removal.vercel.app', 'https://clean-slate-junk-removal.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Rubik Construction Group — Remodeling &amp; Repairs in Fort Wayne, IN); /admin 404 NOT FOUND.'
where demo_url in ('https://rubik-construction-group.vercel.app', 'https://rubik-construction-group.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Community Humane Shelter — Demo); /admin 404 NOT FOUND.'
where demo_url in ('https://steuben-shelter-demo.vercel.app', 'https://steuben-shelter-demo.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Equip Accounting — Demo); /admin 404 NOT FOUND.'
where demo_url in ('https://equip-accounting-demo.vercel.app', 'https://equip-accounting-demo.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Dave Lough — Demo); /admin 404 NOT FOUND.'
where demo_url in ('https://dave-lough-uhoh-rodeo-demo.vercel.app', 'https://dave-lough-uhoh-rodeo-demo.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Deesigns Home + Office — Spaces that fit how you actually live); /admin 404 NOT FOUND.'
where demo_url in ('https://website-six-zeta-86.vercel.app', 'https://website-six-zeta-86.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Fueled Up — Energy &amp; Protein Bar · Fort Wayne); /admin 404 NOT FOUND.'
where demo_url in ('https://fueled-up-phi.vercel.app', 'https://fueled-up-phi.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Exquisite Energy — Fort Wayne''s Energy Café); /admin 404 NOT FOUND.'
where demo_url in ('https://exquisite-energy.vercel.app', 'https://exquisite-energy.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Backyard Hibachi — Private Hibachi Chef, In Your Backyard); /admin 404 NOT FOUND.'
where demo_url in ('https://backyard-hibachi.vercel.app', 'https://backyard-hibachi.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Boggs Pro Cut — Fort Wayne Landscaping, Hardscaping &amp; Snow Removal); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://demo-boggs-pro-cut.vercel.app/admin')
where demo_url in ('https://demo-boggs-pro-cut.vercel.app', 'https://demo-boggs-pro-cut.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: JJ Fencing &amp; Construction — The Fox Valley&#x27;s Fence Crew, Sinc); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://demo-jj-fencing.vercel.app/admin')
where demo_url in ('https://demo-jj-fencing.vercel.app', 'https://demo-jj-fencing.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Howard Barg &amp; Associates — North Shore Estate Landscapes Since 197); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://demo-howard-barg.vercel.app/admin')
where demo_url in ('https://demo-howard-barg.vercel.app', 'https://demo-howard-barg.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Supercharged Speedsters CrossFit — Auburn built the fastest car in Ame); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://demo-supercharged-speedsters.vercel.app/admin')
where demo_url in ('https://demo-supercharged-speedsters.vercel.app', 'https://demo-supercharged-speedsters.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Reliable Cleaning — 50 Years Spotless | Commercial Janitorial, Fort Wa); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://demo-reliable-cleaning.vercel.app/admin')
where demo_url in ('https://demo-reliable-cleaning.vercel.app', 'https://demo-reliable-cleaning.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Crowned N Comfort — Mobile hair care in Fort Wayne); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://crowned-n-comfort.vercel.app/admin')
where demo_url in ('https://crowned-n-comfort.vercel.app', 'https://crowned-n-comfort.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: WATTARA - 50 in the world); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://wattara.vercel.app/admin')
where demo_url in ('https://wattara.vercel.app', 'https://wattara.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: DOT Landscaping, Fort Wayne lawn care and landscaping); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://dotlandscaping.vercel.app/admin')
where demo_url in ('https://dotlandscaping.vercel.app', 'https://dotlandscaping.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Elite Concierge — Executive Technology Talent, On Demand | Indiana); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://elite-concierge-lac.vercel.app/admin')
where demo_url in ('https://elite-concierge-lac.vercel.app', 'https://elite-concierge-lac.vercel.app/') and demo_status <> 'none';

update public.sites set
  demo_notes = trim(both E' \n' from regexp_replace(coalesce(demo_notes,''), E'\\s*Vercel Authentication is still ON for this project[^.]*\\.( so the preview may show a sign-in wall[^.]*\\.)?', '', 'g')) || E'\n' || 'Link check 2026-09-04 (no cookies): demo 200 OK real page (title: Silk &amp; Honey House, pop-up tea, brunch and picnics in Fort Wayne); /admin 200 OK real page.', demo_admin_url = coalesce(demo_admin_url, 'https://silkandhoneyhouse-sweet-dreams-projects.vercel.app/admin')
where demo_url in ('https://silkandhoneyhouse-sweet-dreams-projects.vercel.app', 'https://silkandhoneyhouse-sweet-dreams-projects.vercel.app/') and demo_status <> 'none';

update public.sites set name = 'Deesigns Home + Office',
  demo_notes = coalesce(demo_notes,'') || E'\n' || 'Correction 2026-09-04: the deployed site is Deesigns Home + Office (page title), not Prime Cards 260; the Vercel project is named "website" and its GitHub repo is PrimeCards260. Row renamed to match what the demo actually is.'
where vercel_project_id = 'prj_LUrDm6UGQFXeZU46UHBiG4YiY7t5';

update public.clients set business_name = 'Deesigns Home + Office', contact_name = 'Deesigns Home + Office', email = 'deesigns-home-office@pending.sweetdreams.us'
where email = 'prime-cards-260@pending.sweetdreams.us';