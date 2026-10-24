# ADR-0008: Host the Hono API on Fly.io London and the web apps on Vercel behind Cloudflare; the first production deploy fires the repository split

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: PLAN.md §Run matching (lean stack paragraph, "Hosting" cost row), §Ship a PWA (no app store); BRD NFR-006, NFR-016, INT-15, CR-15; ARCHITECTURE.md §How to split later; TOOLING.md §The application stack (Hosting row); ADR-0001; ADR-0002

## Context
Four documents name four hosting combinations: PLAN.md says Vercel Pro or a Hetzner VPS via
Coolify; BRD NFR-016 says Supabase Pro, Vercel or VPS; ARCHITECTURE.md says Fly.io or Railway
for the API and Vercel or Cloudflare for the web apps; TOOLING.md says Vercel plus Cloudflare
with Fly.io or Railway for Hono. ADR-0001 makes the first production deploy the trigger for the
repository split, so the deploy has to be planned, not improvised. ADR-0001's other trigger,
"a second regular contributor", became ambiguous once ADR-0002 named Philip as the second
founder. The constraint is latency from Lagos to a London database that every request touches,
plus two people's operations time.

## Decision
The Hono API runs on Fly.io in the London region (`lhr`), deployed as a Docker image next to
Supabase in `eu-west-2`, with Railway as the fallback host if Fly.io's pricing or reliability
disappoints. `frontend` and `admin` run on Vercel Pro (one seat) with Cloudflare's free tier in
front for the Lagos point of presence and caching. There is no app-store distribution; the PWA
is the only client (PLAN.md). The first production deploy is planned together with ADR-0001's
repository split: publish `@byv/core` to the private registry first, then create the three
service repositories, each with its own CI and deploy target. ADR-0001's Decision section is
amended by one dated line to read "a second regular contributor" as a regular contributor
beyond the two founders, so Philip's first commit does not by itself trigger the split.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Hetzner VPS with Coolify | Cheapest per month and full control, but patching, backups, TLS, zero-downtime deploys and on-call land on two founders; revisit when the hosting bill, not the ops time, is the constraint. |
| Cloudflare Workers for the API | Hono runs there natively and the Lagos edge is attractive, but Node-only dependencies (`docx` export, Playwright PDF rendering, Anthropic SDK streaming) need checking, and most requests are database-bound in London anyway. |
| Vercel functions for the API | Co-located with the web apps and one bill, but long digest and ingestion jobs exceed function time limits and the queue workers (ADR-0006) need a long-running process. |
| Railway as primary | Comparable to Fly.io; chosen as fallback rather than primary because Fly.io's region list includes London and its egress pricing is known (if expensive for Africa). |

## Consequences
- Positive: API and database in the same region remove a cross-region hop from every request; Cloudflare caches static assets in Lagos; Vercel previews cover the web apps; the deploy plan and the split plan are one checklist instead of two surprises.
- Negative or risks: three hosting vendors (Fly.io, Vercel, Cloudflare) plus Supabase, each on the CR-15 transfer assessment; Fly.io's Africa egress is about 6x its European rate (snippet), which matters if PDF downloads grow; Vercel Pro's single seat means one founder owns web deploys; no Lagos-to-London latency has been measured, so the ~100 ms round-trip assumption is untested.
- On acceptance: write `api/Dockerfile` and `fly.toml`, Vercel projects for `frontend` and `admin`, Cloudflare DNS; execute ARCHITECTURE.md "How to split later" in the same sprint; update PLAN.md's lean-stack sentence and BRD NFR-016 to the chosen hosts; add the hosting line to the TIA (CR-15).
- What would make us revisit this: measured Lagos round trips showing Frankfurt or another region beats London; a hosting bill above roughly $150 a month where a VPS would pay for its ops time; Cloudflare Workers passing the Node-compatibility check for the API's dependencies; Fly.io reliability incidents affecting the nightly pipeline.

## Verification
Snippets of vendor pages, not fetched (TOOLING.md): Supabase lists London (`eu-west-2`) and no
Lagos or Cape Town region; Cloudflare has served from Lagos since 2018; Vercel Pro $20 per seat;
Fly.io Africa egress $0.12/GB; Hono's edge-runtime support. Checked in the repository: no
`Dockerfile`, `fly.toml`, `vercel.json` or `.github/` exists, so ADR-0001's deploy trigger has
not fired; ADR-0001's Decision names "a second regular contributor" without defining it, and
ADR-0002 names Philip as co-founder. Estimates: the ~100 ms Lagos-to-London round trip (no
measurement found; RIPE Atlas or a Lagos probe for a week is the listed fix); the $150 revisit
threshold. Unverified: whether `docx`, Playwright and the Anthropic SDK run on Cloudflare
Workers; Railway's current pricing and region list.
