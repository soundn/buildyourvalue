# Architecture and repository strategy

Build Your Value ships as separate deployable services, each destined for its own
repository. This repository holds the first prototype as an npm workspace so the
pieces can be developed and run together today and split without rewrites later.

## Services and their future repositories

| Folder | Future repository | What it is | Runtime |
|---|---|---|---|
| `core/` | `buildyourvalue-core` (published as a private package `@byv/core`) | Shared domain logic and types: six-component CV weakness score, scam screen, Nigeria remote-eligibility classifier (`remote.ts`, ADR-0017), matching, learning-path builder, deterministic CV rewrite rules, sample data. No framework dependencies. | Node library (ESM) |
| `api/` | `buildyourvalue-api` | HTTP API: evaluate a profile (score + matches + path), improve a CV (Claude with rules fallback), job listings, user reports, admin review queue. | Node + Hono |
| `frontend/` | `buildyourvalue-frontend` | Job-seeker progressive web app: onboarding, dashboard, CV preview and print, digest preview, pricing. Mobile-first, installable. | Next.js |
| `admin/` | `buildyourvalue-admin` | Staff console: listing review queue with approve and reject, audit trail. Employer verification joins it in Phase 2. | Next.js |
| `mobile/` | `buildyourvalue-mobile` | Job-seeker mobile app (Phase 2, Android first): push notifications, share-sheet CV capture, Play Store presence. Talks to `api` over HTTP and imports `@byv/core` for types only ([ADR-0014](adr/0014-build-the-job-seeker-mobile-app-with-expo-in-a-mobile-workspace-shipping-in-phase-2.md)). | Expo (React Native) |

Rules that keep the split clean:

- `frontend` and `admin` talk to `api` over HTTP only, through `NEXT_PUBLIC_API_URL`. They import `@byv/core` for types and static reference data (roles), never for scoring. `mobile` follows the same rule through `EXPO_PUBLIC_API_URL` (ADR-0014).
- `api` is the only service that scores, matches or calls an LLM.
- `core` has no I/O. Anything that needs a database, a network or a secret lives in `api`.
- Each folder has its own `package.json`, `tsconfig.json`, `.env.example` and scripts, so moving it to a new repository is a copy plus a dependency on the published `@byv/core`.

## How to split later

We split when the first of these happens: a second regular contributor joins, or the first production deploy is set up ([ADR-0001](adr/0001-keep-one-npm-workspace-until-split-trigger.md)). The first production deploy is planned together with the split, and "second regular contributor" means one beyond the two founders ([ADR-0008](adr/0008-host-api-on-fly-london-web-on-vercel-and-plan-the-split-with-the-first-deploy.md)).

1. Publish `core` to a private registry (GitHub Packages or npm) as `@byv/core` and pin a version.
2. Create the three service repositories and move each folder's contents to the root of its repository.
3. Replace the workspace reference `"@byv/core": "0.1.0"` with the published version.
4. Give each repository its own CI (typecheck, tests, build) and deploy target (API on Fly.io London with Railway as fallback, web apps on Vercel behind Cloudflare; ADR-0008). The web apps move to Cloudflare Workers and the API splits into Workers hot paths plus a Node job runner when the Vercel bill passes $150 a month or registered users pass 200,000 ([ADR-0011](adr/0011-keep-vercel-and-fly-for-the-first-deploy-move-the-edge-to-cloudflare-workers-on-a-cost-trigger.md)).

## Request flow in the prototype

```mermaid
flowchart LR
  U[Job seeker PWA] -->|POST /v1/evaluate| A[API]
  U -->|POST /v1/cv/improve| A
  U -->|POST /v1/jobs/:id/report| A
  S[Admin console] -->|GET /v1/admin/review| A
  S -->|POST /v1/admin/review/:id| A
  A --> C[(core: score, screen, match, path)]
  A -->|optional| L[Claude via Anthropic SDK]
  A --> D[(in-memory listings and decisions)]
```

## API endpoints

| Method and path | Purpose |
|---|---|
| `GET /health` | Liveness plus whether the AI engine is configured |
| `GET /v1/roles`, `GET /v1/courses`, `GET /v1/sample-profile` | Reference data |
| `GET /v1/jobs` | Publishable listings (automatic pass or human approved) |
| `POST /v1/evaluate` | Profile in; role, weakness report, top matches and learning path out |
| `POST /v1/cv/improve` | Profile in; improved profile, change list, before and after scores out |
| `POST /v1/jobs/:id/report` | User report with a reporter id; one report suppresses a listing pending human review, a verified employer's listing needs two, and each reporter is capped at three reports a day (ADR-0010) |
| `GET /v1/admin/review` | Review queue: every listing that did not pass cleanly or was reported |
| `POST /v1/admin/review/:id` | Approve or reject with reviewer identity and note |

## What is real and what is stubbed

| Area | Prototype | MVP replacement (docs/PLAN.md, Phase 1) |
|---|---|---|
| Profile storage | Browser localStorage | Supabase Postgres behind phone-OTP and Google auth, accessed through Drizzle with SQL-first migrations (ADR-0004); phone and email encrypted at the application level (ADR-0009) |
| Job listings | 28 fictional sample listings, 4 of them scam fixtures (ids s001–s004) | Nightly ingestion from JSearch/SerpApi (Nigeria) and from public employer job boards plus remote feeds (remote) with dedup and the eligibility classifier; the audit script in `api/scripts/` already reads the remote feeds (ADR-0017) |
| Matching | Deterministic skill coverage, role alignment, experience, location | pgvector recall (voyage-4-lite `halfvec(1024)` plus tsvector; ADR-0007; only the live job corpus is indexed, profile vectors are stored unindexed until reverse search exists, ADR-0013) then LLM rerank of the top 30 (Haiku 5.5; ADR-0003), scheduled by pg_cron and pgmq (ADR-0006) |
| CV improvement | Rules by default; Claude structured output when `ANTHROPIC_API_KEY` is set | Same, with cost telemetry and model selection per tier |
| Digest | On-screen preview | Resend send (ADR-0005) behind an `EmailProvider` interface with suppressions in Postgres, moving the digest stream to SES between 100,000 and 500,000 users (ADR-0012); SPF, DKIM, DMARC and one-click unsubscribe |
| Payments | Pricing page only | Paystack one-off pass and Core plan with dunning |
| Admin auth | None, localhost only | Staff SSO |
| Review decisions and user reports | In-memory | Postgres tables with audit log |
