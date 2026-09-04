# Demo Approval Queue

Set 2026-09-04. This is the operating manual for `public.sites.demo_status` and
the `/admin/demos` page. It is written for a Claude session that has only the
Supabase connector (project `fweeyjnqwxywmpmnqpts`) and this file.

## The principle

Cole, 2026-09-04:

> "There should never be a demo that I haven't seen... if we are not getting
> demos out within 2 days, our chances of closing goes down tremendously."

An audit that day found 14 demos built and only 1 ever sent, because "a demo
exists" and "the client has seen it" were never separate states in the system.

**A demo is not done when it deploys. It is done when the client has opened it.**
Every state between those two points lives on `public.sites` with a timestamp,
so `/admin/demos` can show the whole ladder on one screen and anything aging
past 48 hours is impossible to miss.

## The ladder

| `demo_status`       | Meaning                                                              | Who moves it here                                   | Timestamp written        |
| ------------------- | -------------------------------------------------------------------- | --------------------------------------------------- | ------------------------ |
| `none`              | Default. Not in the queue.                                           | Default; Cole via "Not a demo" in the UI            | -                        |
| `building`          | Claude is building the demo.                                         | Claude (SQL)                                        | -                        |
| `ready_for_review`  | Deployed, Vercel Authentication off, verified loading signed-out.    | Claude (SQL)                                        | `demo_built_at`          |
| `approved`          | Cole looked at it and wants it sent.                                 | **Cole only**, in `/admin/demos`                    | `demo_approved_at`       |
| `sent`              | The link went to the client.                                         | Claude (SQL) after sending, or Send Demo Invite     | `demo_sent_at`           |
| `viewed`            | The client opened it.                                                | The welcome page (`/welcome/[token]`), automatically | `demo_first_viewed_at`   |
| `changes_requested` | Cole wants edits before it goes out.                                 | **Cole only**, in `/admin/demos`                    | notes in `demo_notes`    |

`changes_requested` loops back: Claude makes the edits, marks `building`, then
`ready_for_review` again. Cole re-approves from there.

**Claude never writes `approved`.** Not through the connector, not through a
migration, not "just this once". The only code path that writes `approved` is
`POST /api/admin/demos/update` behind the admin cookie, which is Cole clicking
"Approve & queue for send". That single gate is the whole point of the queue.

Columns added by the migration (all on `public.sites`):

```
demo_status           text not null default 'none'
                      check in ('none','building','ready_for_review','approved','sent','viewed','changes_requested')
demo_admin_url        text          -- the demo's admin panel URL, if it has one
demo_passcode         text          -- only on demos built before 2026-09-04
demo_built_at         timestamptz   -- drives the age shown on /admin/demos
demo_approved_at      timestamptz
demo_sent_at          timestamptz
demo_first_viewed_at  timestamptz
demo_notes            text          -- free text: backfill notes, change requests, what was fixed
```

`demo_url` (the public demo URL) already existed on `sites` from the welcome flow.

## Automation contract (SQL Claude runs through the Supabase connector)

Project: `fweeyjnqwxywmpmnqpts`. Run these with the connector's `execute_sql`.
Replace `<site uuid>` with the `sites.id`. Every statement is guarded by the
current status so a stale session cannot regress a row.

### 0. Find the site (or create it)

```sql
select s.id, s.name, s.status, s.demo_status, s.demo_url, s.demo_built_at,
       s.vercel_project_id, s.github_repo, c.business_name, c.contact_name, c.email
from public.sites s
join public.clients c on c.id = s.client_id
where c.business_name ilike '%<business name>%'
order by s.created_at desc;
```

If the business has no `clients` / `sites` rows yet (a lead you are building a
demo for), create them. This mirrors the columns the 2026-09-04 backfill used;
`hosting_price_cents` has no default and must be supplied.

```sql
with c as (
  insert into public.clients (business_name, contact_name, email, phone, source_lead_id)
  values ('<Business Name>', '<Contact Name>', '<email or <slug>@pending.sweetdreams.us>', null, null)
  returning id
)
insert into public.sites
  (client_id, name, status, hosting_price_cents, build_price_cents, db_mode, demo_status)
select c.id, '<Business Name>', 'draft', 0, 0, 'shared', 'building'
from c
returning id, client_id, demo_status;
```

Match by email first (`select id from public.clients where lower(email) = lower('<email>')`)
so you do not create a duplicate client.

### 1. Mark `building`

```sql
update public.sites
set demo_status = 'building'
where id = '<site uuid>'
  and demo_status in ('none', 'changes_requested')
returning id, demo_status;
```

### 2. Mark `ready_for_review`

Only after the build standard below is met: deployed, Vercel Authentication
off, `<name>.demo.sweetdreams.us` attached, and the production URL returns 200
signed-out. `demo_built_at = now()` is the clock the whole queue runs on. On a
rebuild after `changes_requested` it resets, so the age shows the current wait.

```sql
update public.sites
set demo_status       = 'ready_for_review',
    demo_url          = 'https://<name>.demo.sweetdreams.us',
    demo_admin_url    = 'https://<name>.demo.sweetdreams.us/admin',   -- or null if the demo has no admin panel
    demo_passcode     = null,                                         -- always null for demos built on/after 2026-09-04
    demo_built_at     = now(),
    demo_approved_at  = null,
    vercel_project_id = coalesce(vercel_project_id, '<prj_...>'),
    github_repo       = coalesce(github_repo, 'Sweet-Dreams-US/<Repo>'),
    demo_notes        = concat_ws(E'\n', demo_notes, 'Ready for review ' || to_char(now(), 'YYYY-MM-DD') || ': <one line on what was built or fixed>')
where id = '<site uuid>'
  and demo_status in ('none', 'building', 'changes_requested')
returning id, demo_status, demo_url, demo_built_at;
```

If the row was `changes_requested`, read `demo_notes` first; that is where
Cole's requested changes live.

### 3. Poll for `approved`

```sql
select s.id, s.name, s.demo_url, s.demo_admin_url, s.demo_passcode, s.demo_approved_at,
       c.business_name, c.contact_name, c.email, c.phone
from public.sites s
join public.clients c on c.id = s.client_id
where s.demo_status = 'approved'
order by s.demo_approved_at;
```

Anything returned here is Cole saying "send it". Draft the message (the
`/admin/demos` card already shows the draft from `buildDemoSendMessage`), send
it, then move to step 4. Do not send anything that is not `approved`.

### 4. Mark `sent`

```sql
update public.sites
set demo_status  = 'sent',
    demo_sent_at = now()
where id = '<site uuid>'
  and demo_status = 'approved'
returning id, demo_status, demo_sent_at;
```

### 5. The full queue (what `/admin/demos` shows)

```sql
select s.id, s.name, s.demo_status,
       floor(extract(epoch from (now() - s.demo_built_at)) / 86400)::int as age_days,
       s.demo_url, s.demo_admin_url, s.demo_passcode,
       s.demo_built_at, s.demo_approved_at, s.demo_sent_at, s.demo_first_viewed_at,
       s.demo_notes, s.vercel_project_id,
       c.business_name, c.contact_name, c.email, c.phone
from public.sites s
join public.clients c on c.id = s.client_id
where s.demo_status in ('building', 'ready_for_review', 'approved', 'sent', 'changes_requested')
order by s.demo_built_at desc nulls last;
```

`age_days` here is the same floor-of-whole-days the page computes with
`demoAgeDays`: amber at 2, red at 3 or more.

## How `sent` actually happens

There are two paths. Both end with `demo_status = 'sent'` and `demo_sent_at` set.

1. **Cole clicks "Send Demo Invite" on `/admin/clients/[id]`.** That calls
   `POST /api/admin/sites/send-welcome`, which emails the client a private
   `/welcome/<token>` link (the demo invite email), moves the site pipeline
   `status` to `demo_sent`, and now also stamps `demo_status = 'sent'` and
   `demo_sent_at = now()` for that site where `demo_status <> 'viewed'` (a
   viewed demo is never regressed). Preconditions enforced by the route:
   `demo_url` set, `build_price_cents > 0`, and site `status` in
   `('draft','demo_sent')`. This path does not require `approved` first: Cole
   clicking send is the approval.
2. **Claude sends the link** (email or text, after step 3 returned the row as
   `approved`), then runs step 4 to write `sent`. Sending the raw demo URL is
   fine, but it does not carry the welcome token, so `viewed` will not be
   tracked automatically on that path (see below).

## How `viewed` gets set

`app/welcome/[token]/page.tsx` is the "client opened it" signal. When a client
opens a valid welcome link and the site is `sent` or `approved` with
`demo_first_viewed_at` null, the page writes:

```sql
-- what the welcome page does, for reference; do not run this by hand
update public.sites
set demo_status = 'viewed', demo_first_viewed_at = now()
where id = '<site uuid>' and demo_first_viewed_at is null;
```

Only the welcome link fires this. If Claude sent the raw demo URL and the
client confirms in a reply or on a call that they opened it, record that
manually:

```sql
update public.sites
set demo_status          = 'viewed',
    demo_first_viewed_at = coalesce(demo_first_viewed_at, now()),
    demo_notes           = concat_ws(E'\n', demo_notes, 'Viewed confirmed by the client on ' || to_char(now(), 'YYYY-MM-DD') || ' (<how: reply / call / text>).')
where id = '<site uuid>'
  and demo_status = 'sent'
returning id, demo_status, demo_first_viewed_at;
```

## Demo build standard (set 2026-09-04)

Every demo built on or after 2026-09-04 meets all four before it is marked
`ready_for_review`:

1. **SSO / Vercel Authentication OFF at creation.** Never send a link behind a
   login wall. Turn Deployment Protection off on the project the moment it is
   created (Vercel connector `update_project_deployment_protection`, or
   Project Settings, Deployment Protection, Vercel Authentication: Disabled).
2. **Demo admin panels have NO passcode.** One click. `demo_passcode` stays
   null. Passcodes remain only on demos built before 2026-09-04, and the
   `/admin/demos` card shows them for those rows.
3. **Attach `<name>.demo.sweetdreams.us` to the project.** The wildcard
   `*.demo.sweetdreams.us` CNAME to `cname.vercel-dns.com` already exists, so
   there is no per-demo DNS edit; add the domain to the Vercel project
   (Project Settings, Domains, or `POST /v10/projects/{project}/domains` with
   `{ "name": "<name>.demo.sweetdreams.us" }`) and it resolves immediately.
   Use that hostname as `demo_url`.
4. **Verify the production URL loads signed-out** before moving to
   `ready_for_review`. `curl -s -o /dev/null -w '%{http_code}' https://<name>.demo.sweetdreams.us`
   must print `200`. A `401`, or a redirect to `vercel.com/sso-api`, means
   Vercel Authentication is still on; go back to step 1.

The `/admin/demos` card shows a live iframe of `demo_url`; a Vercel sign-in
wall in that iframe is the visible symptom of skipping step 1.

## Morning brief rule

The morning brief reads this table and leads with anything in
`ready_for_review` older than 48 hours. Exact query:

```sql
select id, name, demo_url, demo_built_at
from public.sites
where demo_status = 'ready_for_review'
  and demo_built_at < now() - interval '48 hours'
order by demo_built_at;
```

With the client attached, for the brief itself:

```sql
select s.id, s.name, s.demo_url, s.demo_built_at,
       floor(extract(epoch from (now() - s.demo_built_at)) / 86400)::int as age_days,
       c.business_name, c.contact_name, c.email
from public.sites s
join public.clients c on c.id = s.client_id
where s.demo_status = 'ready_for_review'
  and s.demo_built_at < now() - interval '48 hours'
order by s.demo_built_at;
```

If this returns rows, the brief opens with them, oldest first: "N demos have
been waiting on you for X+ days," then the list with the demo URL and a link to
`/admin/demos`. Rows in `approved` are the second item: they are Cole's yes
waiting on Claude to send. Never demote the section below anything else.

## Backfill (ran 2026-09-04)

`supabase/migrations/20260904_demo_queue_backfill.sql` put every demo that
existed as a Vercel project into the queue with its true age (the Vercel
project creation date, from the `sweet-dreams-projects` team project list).
Things to know when you read those rows:

- Every touched row has a `demo_notes` line starting with `Backfilled 2026-09-04`.
- Existing sites with an agreement sent or signed afterwards were set to
  `sent` or `viewed`, with `demo_sent_at` / `demo_first_viewed_at` taken from
  the agreement's send and first-view times.
- Demos that existed only as Vercel projects got a new `clients` row (matched
  to a free-website lead where one existed, otherwise a
  `<slug>@pending.sweetdreams.us` placeholder email) and a new `sites` row
  matched by `vercel_project_id`, in `ready_for_review` (or `building` for the
  one whose deployment was blocked).
- Some of those rows are not real client demos. Cole prunes them in the UI
  with "Not a demo" (action `dismiss`), which sets `demo_status = 'none'` and
  appends `Removed from the demo queue on <date>.` to `demo_notes`. Do not
  re-add a row that carries that line.
- Pre-standard projects still have Vercel Authentication ON, so their card
  preview may show a sign-in wall. That is a property of the old project, not
  a bug in the page. Turn protection off on the project before the demo is
  approved and sent, then fix the wall note in `demo_notes`.
- Placeholder `@pending.sweetdreams.us` emails must be replaced with the real
  contact before "Send Demo Invite" is used; the invite email goes to
  `clients.email`.

## File map

| What                                  | Where                                                              |
| ------------------------------------- | ------------------------------------------------------------------ |
| Schema migration (applied)            | `supabase/migrations/20260904_demo_approval_queue.sql`             |
| Backfill (ran 2026-09-04)             | `supabase/migrations/20260904_demo_queue_backfill.sql`             |
| Portal column grants (applied to Supabase 2026-09-04) | `supabase/migrations/20260904_sites_internal_columns_grants.sql` — hides `demo_notes`, `demo_admin_url`, `demo_passcode`, `admin_notes` from the portal role |
| Admin page (Cole's surface)           | `app/admin/demos/page.tsx`, `app/admin/demos/DemoQueue.tsx`, `app/admin/demos/demos.module.css` |
| Approve / request changes / dismiss   | `app/api/admin/demos/update/route.ts` (the only writer of `approved`) |
| Statuses, labels, age, draft message  | `lib/clients/constants.ts` (`DEMO_STATUSES`, `DEMO_QUEUE_STATUSES`, `DEMO_WAITING_STATUSES`, `demoAgeDays`, `demoAgeTone`, `demoQueueCounter`, `buildDemoSendMessage`) |
| Stamps `sent` on Send Demo Invite     | `app/api/admin/sites/send-welcome/route.ts`                        |
| Stamps `viewed` when the client opens | `app/welcome/[token]/page.tsx`                                     |
| Ops skill (`/sd-demo-queue`, rules)   | `~/.claude/skills/sweet-dreams-ops/skill.md`                       |
| This document                         | `docs/DEMO-APPROVAL-QUEUE.md`                                      |
