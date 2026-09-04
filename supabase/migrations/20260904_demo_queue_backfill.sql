-- Demo Approval Queue backfill (2026-09-04)
--
-- On 2026-09-04 an audit found demos built and never sent, with nothing in
-- the system that made that visible. This backfill puts every demo that
-- exists as a Vercel project into the queue with its TRUE age (the Vercel
-- project creation date), so /admin/demos shows the real picture on day one.
--
-- Source of truth used: Vercel team sweet-dreams-projects project list
-- (created dates, production aliases, GitHub links), public.sites,
-- public.agreements, public.marketing_leads. Every row this touches carries
-- a demo_notes line saying it was backfilled. Anything that is not actually
-- a client demo can be pruned in the UI with "Not a demo" (sets none).
--
-- Idempotent: existing sites are only updated while demo_status = 'none';
-- new clients are matched by email and new sites by vercel_project_id.

-- ---------------------------------------------------------------------------
-- A. Existing sites whose demo was evidently delivered (an agreement was
--    sent or signed afterwards). Timestamps come from the agreements table.
-- ---------------------------------------------------------------------------

-- Crowned N Comfort: Vercel crowned-n-comfort (2026-08-10), agreement sent 2026-08-26
update public.sites s set
  demo_url = coalesce(s.demo_url, 'https://crowned-n-comfort.vercel.app'),
  vercel_project_id = coalesce(s.vercel_project_id, 'prj_TpPdXNZTYPQUoXjZJUKweMIx0aNT'),
  demo_status = 'sent',
  demo_built_at = '2026-08-10T18:56:29Z',
  demo_sent_at = (select min(a.created_at) from public.agreements a where a.site_id = s.id),
  demo_notes = 'Backfilled 2026-09-04. Demo = Vercel project crowned-n-comfort. Marked sent because an agreement was sent 2026-08-26; sent time is the agreement send time. Vercel Authentication is still ON for this project (built before the 2026-09-04 standard), so the preview may show a sign-in wall.'
where s.id = '948596b8-cb11-41f0-81ff-6238d054ea37' and s.demo_status = 'none';

-- Wattara: Vercel wattara (2026-08-28, supersedes wattara-demo 2026-08-10), agreement sent 2026-08-31
update public.sites s set
  demo_url = coalesce(s.demo_url, 'https://wattara.vercel.app'),
  vercel_project_id = coalesce(s.vercel_project_id, 'prj_XmK2w2tYSTDNYFRwufGpqwmV8LRe'),
  github_repo = coalesce(s.github_repo, 'Sweet-Dreams-US/Wattara'),
  demo_status = 'sent',
  demo_built_at = '2026-08-28T17:19:58Z',
  demo_sent_at = (select min(a.created_at) from public.agreements a where a.site_id = s.id),
  demo_notes = 'Backfilled 2026-09-04. Demo = Vercel project wattara (an earlier build wattara-demo from 2026-08-10 also exists). Marked sent because an agreement was sent 2026-08-31. Vercel Authentication is still ON for this project.'
where s.id = '7665f08d-745d-4b42-8933-872bde61560f' and s.demo_status = 'none';

-- Dot Landscaping: Vercel dotlandscaping (2026-08-30), agreement sent 2026-08-31
update public.sites s set
  demo_url = coalesce(s.demo_url, 'https://dotlandscaping.vercel.app'),
  vercel_project_id = coalesce(s.vercel_project_id, 'prj_jPPvc2rv00gyBLJn4EgdNT3oXiwc'),
  github_repo = coalesce(s.github_repo, 'Sweet-Dreams-US/DOTLandscaping'),
  demo_status = 'sent',
  demo_built_at = '2026-08-30T13:38:47Z',
  demo_sent_at = (select min(a.created_at) from public.agreements a where a.site_id = s.id),
  demo_notes = 'Backfilled 2026-09-04. Demo = Vercel project dotlandscaping. Marked sent because an agreement was sent 2026-08-31. Vercel Authentication is still ON for this project.'
where s.id = '1651690d-979e-4598-9f95-a7f5d398ad22' and s.demo_status = 'none';

-- Elite Concierge: Vercel elite-concierge (2026-08-27), agreement sent 2026-09-03
update public.sites s set
  demo_url = coalesce(s.demo_url, 'https://elite-concierge-lac.vercel.app'),
  vercel_project_id = coalesce(s.vercel_project_id, 'prj_gS92hrEXwidqbHPqAIC9ViRwqkhG'),
  github_repo = coalesce(s.github_repo, 'Sweet-Dreams-US/EliteConcierge'),
  demo_status = 'sent',
  demo_built_at = '2026-08-27T23:12:04Z',
  demo_sent_at = (select min(a.created_at) from public.agreements a where a.site_id = s.id),
  demo_notes = 'Backfilled 2026-09-04. Demo = Vercel project elite-concierge. Marked sent because an agreement was sent 2026-09-03.'
where s.id = '16867ac4-994d-44f3-805a-55f5fefb37b7' and s.demo_status = 'none';

-- Fort Wayne Roofing: signed 2026-08-20, demo_url already on file
update public.sites s set
  vercel_project_id = coalesce(s.vercel_project_id, 'prj_lyIsATOqiLe5bubdz47svNbmSMsh'),
  github_repo = coalesce(s.github_repo, 'Sweet-Dreams-US/FortWayneRoofing'),
  demo_status = 'viewed',
  demo_built_at = '2026-08-07T19:53:34Z',
  demo_sent_at = (select min(a.created_at) from public.agreements a where a.site_id = s.id),
  demo_first_viewed_at = (select min(a.first_viewed_at) from public.agreements a where a.site_id = s.id),
  demo_notes = 'Backfilled 2026-09-04. Client signed 2026-08-20; sent/viewed times are the agreement send/view times.'
where s.id = '3b5d83f5-7aa6-4a8a-bfac-f65538ab30e3' and s.demo_status = 'none';

-- Inner Pack: signed 2026-08-27, demo_url already on file
update public.sites s set
  vercel_project_id = coalesce(s.vercel_project_id, 'prj_m4KmjY4z13GIpdRpERKNqNx3uVBj'),
  github_repo = coalesce(s.github_repo, 'Sweet-Dreams-US/InnerPackINC'),
  demo_status = 'viewed',
  demo_built_at = '2026-08-07T19:34:00Z',
  demo_sent_at = (select min(a.created_at) from public.agreements a where a.site_id = s.id),
  demo_first_viewed_at = (select min(a.first_viewed_at) from public.agreements a where a.site_id = s.id),
  demo_notes = 'Backfilled 2026-09-04. Client signed 2026-08-27; sent/viewed times are the agreement send/view times.'
where s.id = '2f2a78ad-4934-4bca-a042-5b910cccf9a5' and s.demo_status = 'none';

-- Jeronimo Lawn Services: signed 2026-08-20, demo project now serves jeronimolawn.com
update public.sites s set
  demo_url = coalesce(s.demo_url, 'https://jeronimo-lawn-services-demo.vercel.app'),
  vercel_project_id = coalesce(s.vercel_project_id, 'prj_94yNUtCLDig4jKe3PmDXX2qcIULD'),
  demo_status = 'viewed',
  demo_built_at = '2026-08-09T00:24:08Z',
  demo_sent_at = (select min(a.created_at) from public.agreements a where a.site_id = s.id),
  demo_first_viewed_at = (select min(a.first_viewed_at) from public.agreements a where a.site_id = s.id),
  demo_notes = 'Backfilled 2026-09-04. Client signed 2026-08-20; the demo project now serves www.jeronimolawn.com.'
where s.id = '3534e1ac-2d18-42a0-bee0-f88484c9785e' and s.demo_status = 'none';

-- ---------------------------------------------------------------------------
-- B. Demos that exist only as Vercel projects: create the client + site rows
--    so they appear in the queue with their true age. Where a matching
--    free-website lead exists, the client carries the lead's real contact
--    details and source_lead_id; otherwise a <slug>@pending.sweetdreams.us
--    placeholder (the same convention the 2026-08-10 import used).
-- ---------------------------------------------------------------------------
do $$
declare
  r record;
  cid uuid;
begin
  for r in
    select * from (values
      ('Uh Oh Rodeo', 'Dave Lough', 'uh-oh-rodeo@pending.sweetdreams.us', null::uuid,
       'dave-lough-uhoh-rodeo-demo', 'prj_GpNKreNpZLqFUwqYLiJKIYexVn9n', null,
       'https://dave-lough-uhoh-rodeo-demo.vercel.app', '2026-08-09T00:24:01Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project dave-lough-uhoh-rodeo-demo (built 2026-08-09, never sent). Vercel Authentication is still ON for this project, so the preview may show a sign-in wall until it is turned off.'),
      ('Equip Accounting', 'Equip Accounting', 'equip-accounting@pending.sweetdreams.us', null::uuid,
       'equip-accounting-demo', 'prj_XGlcIvsML1Q35D4UIeeWMvIkgIwC', null,
       'https://equip-accounting-demo.vercel.app', '2026-08-09T00:24:02Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project equip-accounting-demo (built 2026-08-09, never sent). Vercel Authentication is still ON for this project.'),
      ('Skin Artistry by Ivy', 'Ivy', 'skin-artistry-by-ivy@pending.sweetdreams.us', null::uuid,
       'skin-artistry-by-ivy', 'prj_5JYgcIEtdDj7B2kyYTOEHmmLAASA', null,
       'https://skin-artistry-by-ivy.vercel.app', '2026-08-10T19:09:38Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project skin-artistry-by-ivy (built 2026-08-10, never sent; public, no sign-in wall). An earlier build ivy-anna-esthetics-demo (2026-08-09) also exists at https://ivy-anna-esthetics-demo.vercel.app.'),
      ('Rubik Construction Group', 'Nickolin Byer', 'nickolin.byer@gmail.com', 'a12663c4-165f-4046-919d-c16995d3c8e5'::uuid,
       'rubik-construction-group', 'prj_cQZS7nraDqOfPDT1O1QwDXGAehOI', 'Sweet-Dreams-US/RubikConstructionGroup',
       'https://rubik-construction-group.vercel.app', '2026-08-10T14:22:42Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project rubik-construction-group (built 2026-08-10, never sent). Lead came in 2026-08-06 via the free-website funnel. An earlier build rubik-construction-demo (2026-08-09) also exists. Vercel Authentication is still ON for this project.'),
      ('Steuben Shelter', 'Steuben Shelter', 'steuben-shelter@pending.sweetdreams.us', null::uuid,
       'steuben-shelter-demo', 'prj_K9UT11if76BsS8Uo2va0igquhZhV', null,
       'https://steuben-shelter-demo.vercel.app', '2026-08-09T00:24:07Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project steuben-shelter-demo (built 2026-08-09, never sent). Vercel Authentication is still ON for this project.'),
      ('Clean Slate Junk Removal', 'Clean Slate Junk Removal', 'clean-slate-junk-removal@pending.sweetdreams.us', null::uuid,
       'clean-slate-junk-removal', 'prj_Mc0konpYRxYbCTBAJUs7wFTJXi7U', 'Sweet-Dreams-US/CleanSlateJunkRemoval',
       'https://clean-slate-junk-removal.vercel.app', '2026-08-10T14:26:13Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project clean-slate-junk-removal (built 2026-08-10, never sent). Two earlier builds also exist: cleanslate-junk-removal-demo (2026-08-09) and clean-slate-junk-removal-demo (2026-08-10). Vercel Authentication is still ON for this project.'),
      ('C2 Antiques & Collectibles', 'C2 Antiques & Collectibles', 'c2-antiques@pending.sweetdreams.us', null::uuid,
       'c2antiques', 'prj_FfYX3p9DbiAonKrcMGtYuhuqtjBI', 'Sweet-Dreams-US/C2Antiques',
       'https://c2antiques.vercel.app', '2026-08-28T18:24:29Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project c2antiques (built 2026-08-28, never sent). An earlier build c2-antiques-collectibles (2026-08-10) also exists. Vercel Authentication is still ON for this project.'),
      ('Primeway Detailing', 'Primeway Detailing', 'primeway-detailing@pending.sweetdreams.us', null::uuid,
       'primeway-detailing', 'prj_HMAte4Tn7tsQNXqcjRLUkYT7P3Kq', null,
       'https://primeway-detailing.vercel.app', '2026-08-10T19:48:28Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project primeway-detailing (built 2026-08-10, never sent). Vercel Authentication is still ON for this project.'),
      ('Rob''s Just Right Seasoning', 'Rob', 'robs-just-right-seasoning@pending.sweetdreams.us', null::uuid,
       'robs-just-right-seasoning-demo', 'prj_bT2WFbixLQ9vPK4eQ3qJoOBLXTTo', 'Sweet-Dreams-US/RobsJustRightSeasoning',
       'https://robs-just-right-seasoning-demo.vercel.app', '2026-08-12T19:31:29Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project robs-just-right-seasoning-demo (built 2026-08-12, last deployed 2026-09-04, never sent; public, no sign-in wall).'),
      ('Davis Realty Services', 'Davis Realty Services', 'davis-realty-services@pending.sweetdreams.us', null::uuid,
       'davis-realty-services', 'prj_BMi6BGxGhTbNkKqPYbHNASX102tp', 'Sweet-Dreams-US/DavisRealtyServices',
       'https://davis-realty-services.vercel.app', '2026-08-19T14:51:36Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project davis-realty-services (built 2026-08-19, never sent). Vercel Authentication is still ON for this project.'),
      ('Silk and Honey House', 'Silk and Honey House', 'silk-and-honey-house@pending.sweetdreams.us', null::uuid,
       'silkandhoneyhouse', 'prj_HwLPSywK2HDkZs6YiUXog672WbDN', 'Sweet-Dreams-US/SilkAndHoneyHouse',
       'https://silkandhoneyhouse-sweet-dreams-projects.vercel.app', '2026-08-30T16:56:40Z'::timestamptz, 'building',
       'Backfilled 2026-09-04 from Vercel project silkandhoneyhouse (created 2026-08-30). Its latest deployment is BLOCKED, so it is not live yet; move to ready_for_review once it deploys and loads signed-out.'),
      ('Reliable Cleaning', 'Reliable Cleaning', 'reliable-cleaning@pending.sweetdreams.us', null::uuid,
       'demo-reliable-cleaning', 'prj_J8Oq3c35QUJtIvE1VAJq3cbFn584', null,
       'https://demo-reliable-cleaning.vercel.app', '2026-07-10T03:49:40Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project demo-reliable-cleaning (built 2026-07-10, never sent). Vercel Authentication is still ON for this project.'),
      ('Supercharged Speedsters CrossFit', 'Bre', 'bre@superchargedspeedsters.com', 'f7e4d0e3-bba8-4599-be09-db9d89c50455'::uuid,
       'demo-supercharged-speedsters', 'prj_eYZFAGlOKWaxosmKtpC1BoZxgx5v', 'Sweet-Dreams-US/demo-supercharged-speedsters',
       'https://demo-supercharged-speedsters.vercel.app', '2026-07-12T23:51:40Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project demo-supercharged-speedsters (built 2026-07-12, never sent). Lead came in 2026-07-12. Vercel Authentication is still ON for this project.'),
      ('Howard Barg and Associates', 'Howard Barg', 'hb4545@aol.com', '78744538-f5f7-4938-8a16-7a7c7014f019'::uuid,
       'demo-howard-barg', 'prj_ckoClAYF1hIfLheSq181WfjrVGW3', 'Sweet-Dreams-US/demo-howard-barg',
       'https://demo-howard-barg.vercel.app', '2026-07-13T23:57:14Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project demo-howard-barg (built 2026-07-13, never sent). Lead came in 2026-07-13. Vercel Authentication is still ON for this project.'),
      ('JJ Fencing and Construction', 'José Martinez', 'joe2884@icliud.com', '06aa15e0-bcfe-4a5f-9999-3ae41284fcf5'::uuid,
       'demo-jj-fencing', 'prj_qYzPQnLtCH8AFogNs1yAoVkUcnyz', 'Sweet-Dreams-US/demo-jj-fencing',
       'https://demo-jj-fencing.vercel.app', '2026-07-19T17:52:31Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project demo-jj-fencing (built 2026-07-19, never sent). Lead came in 2026-07-18; the email on the lead looks mistyped (icliud). Vercel Authentication is still ON for this project.'),
      ('Boggs Pro Cut', 'Boggs Pro Cut', 'boggs-pro-cut@pending.sweetdreams.us', null::uuid,
       'demo-boggs-pro-cut', 'prj_Pibb2UgeBzbKgC0tiMifwcNDbAe1', 'Sweet-Dreams-US/demo-boggs-pro-cut',
       'https://demo-boggs-pro-cut.vercel.app', '2026-07-21T18:02:41Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project demo-boggs-pro-cut (built 2026-07-21, never sent). Vercel Authentication is still ON for this project.'),
      ('Backyard Hibachi', 'Backyard Hibachi', 'backyard-hibachi@pending.sweetdreams.us', null::uuid,
       'backyard-hibachi', 'prj_hqPPKK8skQmZE0VSPADy3tfurbG6', null,
       'https://backyard-hibachi.vercel.app', '2026-07-30T02:52:54Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project backyard-hibachi (built 2026-07-30, never sent). Vercel Authentication is still ON for this project.'),
      ('Exquisite Energy', 'Exquisite Energy', 'exquisite-energy@pending.sweetdreams.us', null::uuid,
       'exquisite-energy', 'prj_gUwemoT2OalMAobunxDBfI2oQAOm', 'Sweet-Dreams-US/ExquisiteEnergy',
       'https://exquisite-energy.vercel.app', '2026-07-31T21:04:00Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project exquisite-energy (built 2026-07-31, never sent). Vercel Authentication is still ON for this project.'),
      ('Fueled Up', 'Fueled Up', 'fueled-up@pending.sweetdreams.us', null::uuid,
       'fueled-up', 'prj_yA4zbkzxU9M4TVUSxTTKhAodgTN7', null,
       'https://fueled-up-phi.vercel.app', '2026-08-02T00:55:05Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project fueled-up (built 2026-08-02, never sent). Vercel Authentication is still ON for this project.'),
      ('Prime Cards 260', 'Prime Cards 260', 'prime-cards-260@pending.sweetdreams.us', null::uuid,
       'website (PrimeCards260)', 'prj_LUrDm6UGQFXeZU46UHBiG4YiY7t5', 'Sweet-Dreams-US/PrimeCards260',
       'https://website-six-zeta-86.vercel.app', '2026-08-07T15:15:27Z'::timestamptz, 'ready_for_review',
       'Backfilled 2026-09-04 from Vercel project "website" (GitHub repo PrimeCards260, built 2026-08-07, never sent). Vercel Authentication is still ON for this project.')
    ) as v(business_name, contact_name, email, source_lead_id, vercel_name, vercel_project_id, github_repo, demo_url, built_at, demo_status, note)
  loop
    select id into cid from public.clients where lower(email) = lower(r.email) limit 1;
    if cid is null then
      insert into public.clients (business_name, contact_name, email, source_lead_id, admin_notes)
      values (r.business_name, r.contact_name, r.email, r.source_lead_id,
              'Created by the demo queue backfill on 2026-09-04 from Vercel project ' || r.vercel_name || '.')
      returning id into cid;
    end if;

    if not exists (select 1 from public.sites where vercel_project_id = r.vercel_project_id) then
      insert into public.sites
        (client_id, name, status, hosting_price_cents, build_price_cents, db_mode,
         demo_url, vercel_project_id, github_repo, demo_status, demo_built_at, demo_notes)
      values
        (cid, r.business_name, 'draft', 0, 0, 'shared',
         r.demo_url, r.vercel_project_id, r.github_repo, r.demo_status, r.built_at, r.note);
    end if;
  end loop;
end $$;
