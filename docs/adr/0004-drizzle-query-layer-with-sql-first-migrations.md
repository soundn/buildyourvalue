# ADR-0004: Use Drizzle as the typed query layer with hand-written SQL migrations applied by the Supabase CLI

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: ARCHITECTURE.md §What is real and what is stubbed; BRD INT-10, NFR-007; TOOLING.md §The application stack; `.claude/skills/new-migration/SKILL.md`; CLAUDE.md §Rules that keep the split clean

## Context
TOOLING.md says the workspace "already has" Drizzle and names drizzle-kit for CI migrations;
the `new-migration` skill says Drizzle is chosen but applies SQL files with the Supabase CLI;
no package.json in the repository depends on Drizzle at all. Phase 1 needs a decision before
the first table exists, because the schema will carry RLS policies, pg_cron schedules, pgmq
queues and pgvector indexes that an ORM's migration generator does not express well. The
constraint is that CVs are personal data under the NDPA: the SQL that defines access must be
readable and reviewable as SQL.

## Decision
`api` uses `drizzle-orm` (version pinned, since its 1.0 line is still in beta) as its typed
query layer, with the TypeScript schema in `api/src/db/schema.ts`. Migrations are hand-written,
forward-only SQL files in `api/supabase/migrations/`, applied with `supabase db push` locally
and in CI, exactly as the `new-migration` skill describes. `drizzle-kit` is used only for
`drizzle-kit pull`, which regenerates `schema.ts` from the database after a migration has run;
it never generates or applies migrations. The SQL files are the single source of truth for the
database; the Drizzle schema is derived from them. `core` stays free of Drizzle and of any
database import.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Prisma | Heavier runtime and query engine, its own schema language competing with the SQL, and a weak story for RLS and Postgres extensions; slower cold starts matter on a small API host. |
| Kysely | Typed SQL with near-zero overhead, but no schema introspection, so the types must be maintained by hand or with a third tool. |
| supabase-js only | Fine for the Next.js apps' own reads under RLS, but gives the API no types for server-side joins, batch upserts in the ingestion job or vector queries. |
| drizzle-kit generate for migrations | Produces diffs that fight hand-written RLS policies, `security definer` functions and extension objects, and would make the generated SQL rather than the reviewed SQL the source of truth. |

## Consequences
- Positive: one reviewable SQL history that CI can apply from scratch; typed queries in the API without a second schema language; `drizzle-kit pull` keeps types honest after every migration; the pattern already written into the `new-migration` skill becomes the recorded decision.
- Negative or risks: two artefacts per change (SQL plus regenerated schema), so a forgotten `pull` leaves stale types until the typecheck fails; Drizzle's beta 1.0 means pinning and reading changelogs on upgrade; pgvector and pgmq types may need custom column definitions in Drizzle.
- On acceptance: add pinned `drizzle-orm` and `drizzle-kit` to `api/package.json`, create `api/src/db/schema.ts` and `api/supabase/` with the first migration, and add a CLAUDE.md conventions line ("Database access in `api` goes through Drizzle; migrations are SQL in `api/supabase/migrations`"). Correct TOOLING.md's "already has Drizzle" and "drizzle-kit in CI" wording.
- What would make us revisit this: Drizzle 1.0 shipping with breaking changes we cannot absorb in a week; a need for the Next.js apps to run server-side queries directly (which would argue for supabase-js plus generated types everywhere); a second language joining the stack.

## Verification
Checked in the repository on 2026-10-24: no `drizzle-orm` or `drizzle-kit` in any
`package.json`; `api/src/` holds `ai.ts`, `review.ts` and `server.ts` only, with in-memory
state; the `new-migration` skill already prescribes SQL-first files under
`api/supabase/migrations/` and a Drizzle schema beside them. Snippet (makerkit, via
TOOLING.md): Drizzle adds little overhead over the raw driver and its 1.0 is in beta. Vendor
claim, unverified: Supabase recommends keeping encryption keys outside the database and is
deprecating pgsodium (relevant because it rules out database-side column encryption as the
reason to pick an ORM). Not measured: Drizzle's handling of `halfvec` columns and pgmq
functions; test on the first migration.
