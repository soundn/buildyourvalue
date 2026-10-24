# Architecture decision records

| ADR | Title | Status | Date |
|---|---|---|---|
| [0001](0001-keep-one-npm-workspace-until-split-trigger.md) | Keep the four services in one npm workspace until a second contributor or the first production deploy | Accepted | 2026-10-24 |
| [0002](0002-soundtechworks-builds-and-owns-the-product.md) | SoundTechWorks builds and owns Build Your Value | Accepted | 2026-10-24 |
| [0003](0003-route-claude-calls-by-model-tier.md) | Route Claude calls by tier: Sonnet 5.5 for writing, Haiku 5.5 for bulk, Opus 5.5 only for evals | Accepted | 2026-10-24 |
| [0004](0004-drizzle-query-layer-with-sql-first-migrations.md) | Use Drizzle as the typed query layer with hand-written SQL migrations applied by the Supabase CLI | Accepted | 2026-10-24 |
| [0005](0005-send-email-through-resend-with-string-templates.md) | Send transactional and digest email through Resend with plain TypeScript templates | Accepted; amended by ADR-0012 | 2026-10-24 |
| [0006](0006-background-jobs-on-pg-cron-and-pgmq-then-inngest.md) | Run background jobs on pg_cron and pgmq inside Supabase in Phase 1, adopt Inngest in Phase 2 | Accepted | 2026-10-24 |
| [0007](0007-embed-with-voyage-4-lite-in-pgvector-halfvec.md) | Embed with Voyage voyage-4-lite at 1,024 dimensions in pgvector halfvec, hybrid with tsvector | Accepted; amended by ADR-0013 | 2026-10-24 |
| [0008](0008-host-api-on-fly-london-web-on-vercel-and-plan-the-split-with-the-first-deploy.md) | Host the Hono API on Fly.io London and the web apps on Vercel behind Cloudflare; the first production deploy fires the repository split | Accepted; amended by ADR-0011 | 2026-10-24 |
| [0009](0009-encrypt-direct-identifiers-at-application-level-keep-cv-text-under-rls.md) | Encrypt direct identifiers at the application level and keep CV text in RLS-protected plaintext | Accepted | 2026-10-24 |
| [0010](0010-suppress-a-listing-on-one-user-report-pending-review.md) | Suppress a listing on one signed-in user report, pending human review within one business day | Accepted | 2026-10-24 |
| [0011](0011-keep-vercel-and-fly-for-the-first-deploy-move-the-edge-to-cloudflare-workers-on-a-cost-trigger.md) | Keep Vercel and Fly.io for the first deploy; move the edge to Cloudflare Workers at a $150 Vercel bill or 200,000 users, splitting the API into Workers and a Node job runner | Accepted | 2026-10-24 |
| [0012](0012-keep-resend-behind-an-email-provider-interface-move-the-digest-to-ses-between-100k-and-500k-users.md) | Keep Resend behind an EmailProvider interface with suppression state in Postgres; open SES at 100,000 users and move the digest stream to it before 500,000 | Accepted | 2026-10-24 |
| [0013](0013-index-only-the-live-job-corpus-in-pgvector-and-revisit-the-vector-store-only-for-reverse-search.md) | Index only the live job corpus in pgvector; store but do not index profile vectors; revisit the vector store only when employer-to-candidate reverse search is built | Accepted | 2026-10-24 |
| [0014](0014-build-the-job-seeker-mobile-app-with-expo-in-a-mobile-workspace-shipping-in-phase-2.md) | Build the job-seeker mobile app with Expo (React Native) in a `mobile/` workspace, shipping Android first in Phase 2 while the PWA stays primary | Accepted | 2026-10-24 |
| [0015](0015-use-useladda-com-as-the-first-production-and-email-domain.md) | Use useladda.com as the first production and email domain; ladda.ng becomes primary after the CAC and trademark searches | Accepted | 2026-10-24 |
| [0016](0016-lead-with-a-developer-first-remote-tier-over-a-free-domestic-base.md) | Lead with a developer-first Remote tier at ₦4,999 over a free domestic base | Rejected; superseded by ADR-0017 | 2026-10-24 |
| [0017](0017-keep-the-board-open-to-every-job-seeker-with-remote-eligibility-as-a-filter.md) | Keep the board open to every job seeker and every role; remote eligibility is a filter, not a segment | Accepted | 2026-10-24 |
