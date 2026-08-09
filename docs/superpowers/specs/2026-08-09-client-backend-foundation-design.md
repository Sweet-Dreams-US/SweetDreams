# Client Backend Foundation — Design (2026-08-09)

Phase 1 of 5 for the sweetdreams.us client management backend. Built and
verified on branch `client-backend-foundation`.

## Problem
The 50 Free Websites campaign produces clients faster than manual onboarding
can absorb: no agreements system, no client accounts, no client-visible
status. Target: one admin operating hundreds of hosted client sites.

## Roadmap (each phase its own spec + build)
1. **Foundation (this)** — agreements + e-sign that creates the portal
   account + admin client/site pipeline + portal stub.
2. Portal v1 — dashboard, plain English updates feed, update request form.
3. Billing — Stripe subscriptions anchored to the 1st/15th (trial_end at
   anchor), card + ACH, live status gated on active subscription, addons.
4. Automation — update request → Claude Code via GitHub Action per client
   repo → Vercel preview in admin → one click merge/go live → auto changelog.
5. CRM/reports — per-site leads into the portal + monthly analytics addon.

## Locked business terms (Cole, 2026-08-09)
- Tiers: $50/mo (3 update hrs/quarter), $85/mo (9), $125/mo (16), custom allowed.
- Build free; **build value** recorded per site anyway — it anchors the buyout:
  year 1 = 100%, year 2 = 75%, year 3 = 65%, year 4+ = 50% of build value.
- 60 day cancel notice. Buyout schedule is written into the contract.
- Billing on the 1st or the 15th (first anchor on/after go live).
- Database packaging: dedicated Supabase project requires $85+; $50 sites use
  the shared platform DB via a central lead API (Phase 5); `sites.db_mode` +
  `db_project_ref` record the choice now.

## Architecture
- **Tables** (`20260809_client_management_foundation.sql`): `clients` (1:N)
  `sites` (status pipeline draft → agreement_sent → signed → building →
  client_review → approved → awaiting_payment → live, + declined/paused/
  cancelled), `agreements` (immutable rendered_text snapshot + sha256 +
  signature record), `agreement_tokens` (sha256 hashes only; purposes
  `sign` 14d / `account_setup` 60min; single use).
- **Immutability**: DB trigger blocks content edits always and any change to
  signed rows; partial unique index = one signed agreement per site. Changed
  terms = revoke + new row.
- **E-sign flow**: tokenized public page `/agreement/[token]` (no login) →
  typed name + 2 stored consent labels → atomic token claim (single UPDATE
  with all validity conditions) → signature written with IP/UA/sha →
  account create-or-link.
- **Accounts**: shared Supabase Auth pool with the music site. New signers
  get `user_metadata.account_type = 'website_client'`;
  `handle_new_user()` (migration `20260809_website_client_signup_trigger_guard`)
  early-returns for them so no music profile is created. Existing emails are
  LINKED via security definer RPC `get_auth_user_id_by_email` (service role
  only) and their password is never touched.
- **RLS**: clients/sites SELECT own rows; agreements SELECT own AND signed
  only; agreement_tokens no policies (service role only); no write policies.
- **Portal**: `/portal` gated by a strictly scoped middleware block using the
  previously unused `utils/supabase/middleware.ts`; reads go through the
  user-scoped SSR client so RLS is the enforced boundary.
- **Admin**: `/admin/clients` (+ new + detail) on the existing
  `sd_admin_session` cookie auth; send/resend (reuses stored snapshot, new
  link, old links revoked), revoke, pipeline status + registry fields
  (github_repo, vercel_project_id, live_url, go_live_date for later phases),
  set-password email (Supabase recovery link), Convert to Client from
  /admin/inquiries prefills the form via `?lead=<id>`.
- **Email**: `lib/emails/send.ts` wrapper (checks Resend's returned `{error}`
  — it never throws); React Email components: agreement-invite,
  agreement-signed-client (full text + signature record),
  agreement-signed-admin, set-password. All sends best effort; the signing
  URL is always returned to admin as backup.
- **Template**: versioned TS constant (`lib/agreements/templates.ts`),
  append-only after first send. v1 is plain English and marked DRAFT pending
  attorney review.

## Verified (2026-08-09, local E2E against live DB, test data deleted)
- Build clean; 16 new routes.
- SQL: RLS on 4 tables, 3 select policies, 0 write policies, 0 token
  policies; immutability + one-signed-per-site raise correctly; simulated
  client JWT sees exactly own rows, unsigned agreements invisible.
- Full flow: admin API create+send (renders all variables) → signing page →
  sign (IP/UA/sha match, consents stored, site → signed) → auth user created
  with account_type=website_client and **zero** music profiles → skip
  password path → password set + signInWithPassword works → RLS via
  PostgREST shows own rows only, 0 tokens → already-signed page → admin list
  + detail render signature record.
- Regression: homepage sets no cookies, /login still redirects to
  sweetdreamsmusic.com, /agreement/* public, /portal redirects unauthed.

## Config still owed (owner)
- Supabase Auth redirect allowlist: https://sweetdreams.us/auth/callback
  (+ preview origin for testing).
- Verify sweetdreams.us in Resend, then set LEAD_FROM_EMAIL.
- ADMIN_SESSION_SECRET added to .env.local (local only; Vercel already set).
- Attorney review of agreement v1 before first real client send.
