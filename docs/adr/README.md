# Architecture decision records

| ADR | Title | Status | Date |
|---|---|---|---|
| [0001](0001-keep-one-npm-workspace-until-split-trigger.md) | Keep the four services in one npm workspace until a second contributor or the first production deploy | Accepted | 2026-10-24 |
| [0002](0002-soundtechworks-builds-and-owns-the-product.md) | SoundTechWorks builds and owns Build Your Value | Accepted | 2026-10-24 |
| [0003](0003-route-claude-calls-by-model-tier.md) | Route Claude calls by tier: Sonnet 5.5 for writing, Haiku 5.5 for bulk, Opus 5.5 only for evals | Proposed | 2026-10-24 |
| [0004](0004-drizzle-query-layer-with-sql-first-migrations.md) | Use Drizzle as the typed query layer with hand-written SQL migrations applied by the Supabase CLI | Proposed | 2026-10-24 |
| [0005](0005-send-email-through-resend-with-string-templates.md) | Send transactional and digest email through Resend with plain TypeScript templates | Proposed | 2026-10-24 |
| [0006](0006-background-jobs-on-pg-cron-and-pgmq-then-inngest.md) | Run background jobs on pg_cron and pgmq inside Supabase in Phase 1, adopt Inngest in Phase 2 | Proposed | 2026-10-24 |
| [0007](0007-embed-with-voyage-4-lite-in-pgvector-halfvec.md) | Embed with Voyage voyage-4-lite at 1,024 dimensions in pgvector halfvec, hybrid with tsvector | Proposed | 2026-10-24 |
| [0008](0008-host-api-on-fly-london-web-on-vercel-and-plan-the-split-with-the-first-deploy.md) | Host the Hono API on Fly.io London and the web apps on Vercel behind Cloudflare; the first production deploy fires the repository split | Proposed | 2026-10-24 |
| [0009](0009-encrypt-direct-identifiers-at-application-level-keep-cv-text-under-rls.md) | Encrypt direct identifiers at the application level and keep CV text in RLS-protected plaintext | Proposed | 2026-10-24 |
| [0010](0010-suppress-a-listing-on-one-user-report-pending-review.md) | Suppress a listing on one signed-in user report, pending human review within one business day | Proposed | 2026-10-24 |
