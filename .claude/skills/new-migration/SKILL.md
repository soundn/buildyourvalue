---
name: new-migration
description: Create or change a database table, column, index, RLS policy, enum or scheduled job for Build Your Value's Supabase Postgres. Use this for any schema or data-model change, including "store X in the database", "add a field to profiles", "we need a table for Y", pgvector or embedding columns, and pg_cron or pgmq jobs, even when the request does not say "migration". It enforces forward-only SQL migrations, RLS on every table, a policy test, and app-level encryption for sensitive fields.
argument-hint: <short_snake_case_name> <what changes and why>
---

# Write a database migration

Profiles are CVs, which are personal data under the Nigeria Data Protection Act. A table
without row level security, or a policy that is never tested, is the single most likely way
this product leaks one user's CV to another. Every step below exists to make that failure
hard.

## Before writing SQL

1. Load the `supabase:supabase-postgres-best-practices` skill if the Supabase plugin is
   enabled; it carries the current RLS, indexing and pgvector guidance. If it is not
   available, say so in the final message and proceed with the rules here.
2. Read the data model notes in `docs/ARCHITECTURE.md` ("What is real and what is stubbed")
   and the types in `core/src/types.ts`. Column names mirror the TypeScript field names in
   snake_case so the Drizzle schema and the core types stay a straight mapping.
3. If the Supabase MCP is connected, use it read-only (`read_only=true`, dev project ref)
   to inspect existing tables. Never run a migration against production through the MCP;
   migrations apply through the CLI in CI.

## Layout

Migrations live in `api/supabase/migrations/` as `YYYYMMDDHHMMSS_<name>.sql`. If that
folder does not exist yet, create it with this migration and add `api/supabase/README.md`
explaining that the folder is applied with `supabase db push` (local and CI) and that files
are never edited after merge. Forward-only: a mistake gets a new migration, never an edit,
because the file may already have run on someone's database.

Pair every migration with a Drizzle schema update in `api/src/db/schema.ts` (create it on
first use) so the API has typed access. Drizzle is the query layer (ADR-0004): `drizzle-kit pull`
regenerates the schema after a migration has run, and drizzle-kit never generates or applies
migrations.

## Rules for the SQL

- `create table` always comes with `alter table ... enable row level security;` in the
  same file, then at least one policy. A table with RLS enabled and no policy is inaccessible,
  which is the safe default; a table without RLS is readable by any anon key.
- Policies name the role and the predicate explicitly, for example
  `create policy "owner reads own profile" on profiles for select to authenticated using (user_id = auth.uid());`
  Admin and service access goes through the service role in the API, never through a
  permissive policy.
- Direct identifiers (phone, email, and any national ID or bank detail) are encrypted in the
  API with AES-GCM before insert and stored in `bytea` or `text` columns named `*_enc`, each
  paired with a keyed-hash `*_hash` column for equality lookups such as login and dedup
  (ADR-0009). CV body, work history and skills stay in plaintext columns protected by RLS and
  Supabase's encryption at rest, so the `tsvector` rule below and the embedding pipeline work.
  Supabase is deprecating pgsodium, so do not rely on column encryption in the database.
- Every foreign key gets an index. Every column used in a `where` by the digest job gets an
  index. State the expected query beside the index in a comment.
- Vectors: `halfvec(<dims>)` with an HNSW index, dims matching the embedding model in
  `api/.env.example`. Add a `tsvector` column for hybrid search at the same time.
- Timestamps are `timestamptz` with `default now()`. Soft deletes use `deleted_at`.
- Scheduled work uses `pg_cron` plus `pgmq`; put the schedule and the queue name in a
  comment at the top of the file so operators can find it without reading the job code.

## Test the policy

Add `api/supabase/tests/<name>.test.sql` that sets `request.jwt.claims` for two different
users and asserts that each sees only their own rows (one `select count(*)` per user). A
policy that was never exercised as two users has not been tested. If pgTAP is available,
use it; otherwise plain SQL with `do $$ ... assert ... $$` blocks is fine.

Run locally when the Supabase CLI is installed:

```bash
cd api && supabase db reset && supabase test db
```

If the CLI is not available in the current environment, say so and leave the test in place
for CI.

## Finish

Update the data model notes in `docs/ARCHITECTURE.md`, then report: the migration file name,
tables and columns touched, the policies added and what each allows, the indexes and why,
and whether the policy test ran. Mention any field that holds personal data and how it is
protected.
