# ADR-0006: Run background jobs on pg_cron and pgmq inside Supabase in Phase 1, adopt Inngest in Phase 2

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: PLAN.md §Run matching (lean stack paragraph, "Background jobs" cost row); BRD INT-11, NFR-005, NFR-016, NFR-020; TOOLING.md §The application stack (Jobs/queues row); `.claude/skills/new-migration/SKILL.md`

## Context
Phase 1 needs a nightly pipeline (ingest listings, dedupe, screen, embed, match, fan out
digests) that finishes before 06:00 WAT (NFR-005) and never sends an empty digest (NFR-020).
PLAN.md and BRD INT-11 name Inngest, Trigger.dev or pg-boss; TOOLING.md and the
`new-migration` skill assume pg_cron plus pgmq first. The constraint is vendor count for two
people: every extra service is another dashboard, secret, invoice and TIA entry, and at 1,000
users the queue carries a few thousand messages a night.

## Decision
Phase 1 scheduling and queuing live inside the Supabase Postgres: `pg_cron` fires the nightly
stages and `pgmq` queues carry per-listing and per-user work (ingestion, embedding, matching,
digest fan-out), with workers implemented as Supabase Edge Functions or as the Hono API pulling
from the queue, whichever a stage's runtime needs (the Anthropic SDK and `docx` favour Node).
Each migration that adds a job records its schedule and queue name in a header comment, per the
`new-migration` skill. In Phase 2, when retries with run history, fan-out visibility and
per-user multi-step functions matter, Inngest (about 50,000 steps free, then $20 Basic) is
adopted for those flows, with pg_cron and pgmq kept for simple schedules.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Inngest or Trigger.dev from day one | Best developer experience for retries and observability, but a third vendor before the first user, a step-count bill that scales with fan-out, and a second place where job code lives; adopt when the pain is measured. |
| pg-boss on a VPS | Postgres-backed and mature, but needs a long-running Node process we are not otherwise hosting in Phase 1 (ADR-0008 puts the API on Fly.io; pg-boss there is possible later). |
| Vercel Cron | Schedules only: no queue, no retries, function time limits that a 20,000-listing embedding run will exceed. |

## Consequences
- Positive: $0 at 1,000 users; one system to back up and one set of credentials; queue state is queryable with SQL beside the data it processes; the `new-migration` skill's conventions already match.
- Negative or risks: no run history or retry UI beyond what we build in `admin`; a stuck worker is visible only through our own alerts (NFR-019); pg_cron on the Supabase Free tier is unconfirmed, so Phase 0 may need Pro earlier or a stand-in schedule; Edge Functions have their own runtime limits, so long stages must be chunked through the queue.
- On acceptance: the first pipeline migration creates the queues and schedules; `admin` gains a minimal job-status view; BRD INT-11 and PLAN.md's lean-stack sentence lose the Inngest-or-Trigger.dev hedge; the Phase 2 Inngest line is added to the cost table.
- What would make us revisit this: a night where a stage fails silently and the digest is late; fan-out above roughly 50,000 users a week; a need for per-user step functions with waits (dunning sequences, course-completion re-match) that are awkward as queue messages; confirmation that pg_cron is unavailable on the plan we are on.

## Verification
Fetched: nothing on this topic; the Supabase plugin's MCP server could not connect from this
environment. Snippets (TOOLING.md): Inngest's free tier of about 50,000 steps and $20 Basic
plan; pgmq and pg_cron availability as Supabase extensions. Unverified and flagged in
TOOLING.md's gap table: whether pg_cron is enabled on the Supabase Free tier (Pro is planned
for backups regardless). Estimates: message volumes per night and the 50,000-user fan-out
threshold are the author's arithmetic from PLAN.md's assumptions (60% weekly active, 300
candidates and 30 reranked per user). Checked in the repository: no job runner, queue or
scheduler code exists; the `new-migration` skill already prescribes pg_cron plus pgmq.
