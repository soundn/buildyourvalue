# Catalog scan: Claude Code plugins, skills and MCP connectors available to this account

Observed 2026-10-23 from inside the team's Claude Code session, using the account's own plugin catalog search, skills list and MCP connector registry. These are facts about what can be enabled today, not web research.

## Currently enabled

- Plugins enabled on the account: none.
- Skills enabled: docs (shareable Claude Docs), google-workspace, deep-research, skill-creator, docx, pdf, pptx, xlsx, computer-use, chrome-browser, built-in-browser, morning, import-memory.
- Built into the Claude Code session: code-review, simplify, security-review, init (CLAUDE.md generator), session-start-hook, update-config (hooks and permissions), claude-api (Anthropic SDK reference), dataviz, artifact-design, workflow-authoring, run.
- MCP connectors connected: Figma (connected and enabled in chat), Gmail (connected), Google Drive, Notion, Atlassian, GitHub (session-scoped), Claude Docs.

## Plugins available in the catalog (not yet enabled)

| Plugin | Publisher tier | What it bundles | Relevance to this project |
|---|---|---|---|
| supabase (official) | partner | Skills: supabase, supabase-postgres-best-practices; MCP server: supabase (project management, database, auth, storage) | High. Phase 1 moves profiles and listings to Supabase; the MCP server can run migrations and inspect schema. |
| RLS Schema Explorer for Supabase | community | Skill rls-schema-explorer; read-only Supabase MCP; /schema command | High. Reads real tables, columns and RLS policies before writing queries; read-only, so safe for routine use. |
| supabase-expert | community | Skill: supabase (RLS, auth flows, storage, security auditing) | Medium. Overlaps with the official plugin's best-practices skill. |
| posthog (official) | partner | Many skills (analyzing expensive users, experiment session replays, heatmaps, auditing endpoints, warehouse properties); MCP access to analytics, flags, experiments, error tracking | High. The plan's metrics (activation, digest opens, conversion, churn) need product analytics and feature flags. |
| sentry (official) | partner | Skills: sentry-get-started, sentry-instrument, sentry-debug-issue, sentry-fix-stack-traces, sentry-create-alert, sentry-otel-exporter-setup; MCP | High. Error tracking for API, frontend and admin; the skills instrument a Next.js and Node app. |
| playwright (Microsoft) | partner | MCP server: browser automation and end-to-end testing | High. The prototype's end-to-end check already runs in Playwright; the MCP lets Claude drive the app interactively. |
| securitymaxxing | community | Skills: llm-app-security, secure-coding, security-review-method; commands /audit, /api, /authn | High. OWASP Top 10 and API audits plus LLM-app security (prompt injection), which this product needs because it feeds user CVs and scraped listings into prompts. |
| Sent | partner | Skills for SMS, WhatsApp and RCS messaging, sender profiles, compliance, account readiness; MCP | Medium. A business service provider route for WhatsApp and SMS OTP; compare with Termii and the WhatsApp Cloud API directly. |
| Design (Anthropic) | Anthropic catalog | Skills: accessibility-review, design-critique, design-handoff, design-system, research-synthesis, user-research, ux-copy; MCP servers for Figma, Linear, Notion, Slack, Asana, Intercom, Gmail, Calendar | High for Phase 0 and 1. user-research and research-synthesis fit the 300-respondent survey and the 50-person pilot; ux-copy fits onboarding and digest copy; accessibility-review fits the PWA. |
| Figma (official) | community tier listing | Skills: figma-design-to-code, figma-generate-design, figma-generate-library, figma-spec, figma-code-connect, figma-use, and more; MCP | Medium. Useful once a designer joins or when generating a design system from the codebase. |
| seo-check | community | Skill: pre-commit SEO audit that crawls affected routes like Googlebot | Medium. Jobs-in-Lagos style SEO is a growth channel in the plan. |
| rampstack-seo | community | Keyword research, technical audit, programmatic SEO, AI-search optimisation | Medium. Programmatic SEO pages per role and city are a known job-board growth tactic. |
| Programmatic SEO Gate | community | Viability and template checks for per-city or per-role pages | Low to medium. |
| Website Check-up by SEO Records | community | Site audit via SEO Records connectors | Low. |
| skipper | community | Architecture scaffolding, docs doctor, decision records | Low. The workspace is already structured; ADRs can be hand-written. |
| Testing (Kobiton) | partner | Real-device mobile testing MCP | Low for now. Real Android device testing becomes relevant before launch. |

## MCP connectors in the registry (not installed unless noted)

| Connector | Sample tools | Status | Relevance |
|---|---|---|---|
| Supabase | list_projects, create_project, get_cost, and 24 more | not installed | High (Phase 1) |
| Vercel | list_projects, list_deployments, get_deployment_events, search_vercel_documentation | not installed | High if Vercel hosts the web apps |
| Sentry | find_issues, get_issue_details, find_releases, and 12 more | not installed | High |
| PostHog | query-run, hogql from question, insight create and query, and 49 more | not installed | High |
| Resend | compose-template, create-broadcast, create-automation, and 77 more | not installed | High if Resend sends the digest |
| Linear | issues, projects, cycles, documents | not installed | Medium (issue tracking for two people) |
| Sent | contacts, messaging, balance | not installed | Medium |
| Figma | get_design_context, get_screenshot, generate_diagram, create_design_system_rules | connected | Medium |
| Gmail | inbox search, drafts | connected | Low |
| Pushwoosh | push and journeys | not installed | Low (Web Push can be done directly) |

No Paystack, Flutterwave, Termii or Cloudflare connector appeared in the registry search. No skills matching Next.js, React, Supabase, Tailwind, Playwright, WhatsApp or PWA exist in the account's own uploaded skills, so project-specific skills would have to be written with skill-creator.
