# Application stack, libraries and third-party services for a 2026 mobile-first AI career platform (Nigeria)

Research context and method note (read first):
- Date observed for every figure in this note: 2026-10-23.
- Direct page fetches (WebFetch) failed for every vendor domain in this session with DNS errors through the sandbox proxy (supabase.com, resend.com, posthog.com, sentry.io, vercel.com, fly.io, inngest.com, trigger.dev, upstash.com, arcjet.com, paystack.com, developers.facebook.com, nextjs.org, serwist.pages.dev, cloudflare.com). Every figure below is therefore **[snippet]** (taken from search-result extracts, often of the vendor's own page or `.md` mirror of it, otherwise of third-party pricing aggregators). No figure is [fetched]. Where the snippet came from the vendor's own domain, that is noted as "[snippet, vendor page]"; where it came from an aggregator or blog, "[snippet, third party]". The report writer should treat third-party pricing as indicative and re-verify any number that drives a budget decision.
- Constraint applied throughout: two-person team, so recommendations favour managed services, generous free tiers, and the fewest moving parts.

## Nigeria baseline: device, network, data cost and connectivity constraints that shape every layer

### Takeaway
Nigeria is roughly 82% Android, with a long tail of Android 11–13 devices; median mobile download speed is in the tens of Mbps on Ookla but browser-measured real-world medians are ~5 Mbps, and mobile data became ~65% more expensive per GB after the January 2025 tariff hike. Design for cheap bytes, low-end Android and intermittent connectivity, and treat WhatsApp and bank transfer as first-class channels.

### Cited Findings
- Statcounter Nigeria mobile OS share, August 2026: Android 81.9–81.96%, iOS 17.93–17.99% [snippet, vendor data] — [Statcounter mobile OS Nigeria](https://gs.statcounter.com/os-market-share/mobile/nigeria); [Statcounter mobile-os page](https://gs.statcounter.com/os-market-share/mobile-operating-system/nigeria)
- Android version share Nigeria, May 2026: Android 13 largest at 17.85%, Android 12 at 16.43%, Android 11 at 13.33% [snippet] — [Statcounter Android version Nigeria](https://gs.statcounter.com/android-version-market-share/mobile-os/nigeria)
- Ookla Speedtest Global Index: Nigeria median mobile download 44.14 Mbps as of December 2025, ranked 85th globally, down seven places [snippet] — [BusinessDay](https://businessday.ng/technology/article/nigeria-slips-to-85th-in-global-internet-speed-rankings-as-peers-pull-ahead/); [Guardian NG](https://guardian.ng/business-services/nigerias-internet-speed-slips-ranks-85th-globally/)
- NCC states average 4G download speed was 33 Mbps at end of 2025 (average, 4G only) [snippet] — [TechCabal](https://techcabal.com/?p=177717)
- Browser-based speed tests (speedof.me, H1 2026, 10k+ tests, mixed desktop/mobile) show a 5.3 Mbps median real-world download; phones ~5 Mbps vs desktop ~8 Mbps [snippet] — [speedof.me Nigeria](https://speedof.me/internet-speed/nigeria)
- NCC approved a 50% tariff increase on calls, data and SMS on 20 January 2025, the first adjustment in about 11 years [snippet] — [Guardian NG](https://guardian.ng/technology/telecoms/telcos-implement-50-hike-as-mtn-increases-data-sms-prices/)
- Average price of 1GB across MTN, Airtel, Glo, 9mobile rose 65.22% from ₦287.5 to ₦475; Airtel 1GB ₦350→₦500, MTN ₦200→₦350, Glo ₦300→₦750 [snippet] — [BusinessDay](https://businessday.ng/?p=949775)
- MTN 1.8GB monthly plan ₦1,500 (replacing 1.5GB at ₦1,000); 20GB plan ₦7,500 (from ₦5,500); 15GB weekly bundle ₦2,000→₦6,000 [snippet] — [TechCabal](https://techcabal.com/?p=151625); [North Africa Post](https://northafricapost.com/?p=84339)
- Airtel cheapest monthly plan 2GB for ₦1,500 (replacing 1.2GB at ₦1,000) [snippet] — [TechCabal](https://techcabal.com/?p=151978)
- Carrier SMS rates moved from ₦4 to ₦6 per message after the January 2025 hike [snippet, third party] — [MessageCentral](https://www.messagecentral.com/blog/sms-providers-in-nigeria)
- ITU affordability basket cites average monthly mobile cost for Nigeria at US$4.90 in 2025 for a 5GB basket incl. voice/SMS [snippet, secondary] — [dadosmundiais](https://www.dadosmundiais.com/africa/nigeria/telecomunicacoes.php)
- Cloudflare's own blog (30 Oct 2018): "Lagos, Nigeria - Cloudflare's 155th city", colocated with an undersea-cable operator and peering at IXPN and WAF-IX Lagos; content previously served from London/Lisbon can be served from Lagos [snippet, vendor page] — [Cloudflare blog](https://blog.cloudflare.com/lagos); [tech.africa](https://tech.africa/cloudflare-lagos-nigeria)
- AWS Local Zone Lagos launched January 2023 (announced 25 Jan 2023) alongside Lima and Querétaro; AWS markets Local Zones for single-digit-millisecond latency and data residency [snippet] — [AWS What's New](https://go.aws/3XZcGZn); [TechCabal](https://techcabal.com/?p=105873); [DCD](https://datacenterdynamics.com/en/news/aws-launches-local-zone-edge-locations-in-lagos-lima-and-quer%C3%A9taro)

### Inferences
- With ~82% Android and a quarter of users on Android 11–13, the PWA path (install to home screen, Web Push) is viable and iOS can be a secondary target.
- The real-world browser median (~5 Mbps) and ₦350–₦500/GB make bundle size a product feature: every 100 KB of JS is a visible cost to users on small bundles. Performance budgets (below) should be enforced in CI.
- Both Cloudflare (edge PoP) and AWS (Local Zone) have Lagos presence; Vercel's nearest compute region is Cape Town (cpt1) and Supabase's nearest documented region is London (eu-west-2) — so static/edge assets can be Lagos-local, while database round-trips will be ~100+ ms (not measured here; see gaps).

### Gaps
- No 2026 per-GB tariff data found; latest confirmed figures are January 2025.
- No measured Lagos→London / Lagos→Cape Town latency figures found from a reliable source.
- No 2026 Ookla national median for Nigeria found (latest is Dec 2025).

## Frontend and PWA

### Takeaway
Next.js 16 (Turbopack default, Cache Components/`use cache`, `proxy.ts`, React 19.2, Node ≥20.9) plus Tailwind v4 and shadcn/ui (now offering Base UI as a primitive alongside Radix) is the 2026 default; Serwist is the maintained service-worker route for Next but has Turbopack caveats in dev mode that must be tested. Budget ~125–150 KB gzipped critical-path JS for low-end Android on 3G.

### Cited Findings
- Next.js 16 released 21 October 2025; Turbopack is the stable default bundler with "up to 5-10x faster Fast Refresh, and 2-5x faster builds"; Cache Components built on Partial Pre-Rendering and the `use cache` directive, enabled via `cacheComponents` in `next.config.ts`; `experimental.ppr` removed; `middleware.ts` replaced by `proxy.ts` "to clarify network boundary" [snippet, vendor page] — [Next.js 16 blog](https://nextjs.org/blog/next-16); [nextjs.org/16](https://nextjs.org/16)
- Next.js 16 pairs with React 19.2.0 and requires Node.js 20.9+; async `params`/`searchParams` required; custom webpack configs keep working via `--webpack` flag [snippet] — [Next.js upgrade guide v16](https://nextjs.org/docs/pages/guides/upgrading/version-16); [makerkit](https://makerkit.dev/blog/tutorials/nextjs-16); [InfoQ](https://www.infoq.com/news/2025/12/nextjs-16-release)
- Next.js 16.1 (Dec 2025) added Turbopack file-system caching and a Next.js bundle analyzer; a secondary source reports 16.3.0 as latest stable in August 2026 [snippet, third party] — [AlternativeTo](https://alternativeto.net/news/2025/12/next-js-16-1-released-with-turbopack-file-system-caching-next-js-bundle-analyzer-and-more); [issoh.co.jp](https://www.issoh.co.jp/tech/details/4026/)
- Next.js 16 supports React 19.2 incl. View Transitions and `useEffectEvent()` [snippet] — [Appwrite blog](https://appwrite.io/blog/post/everything-new-in-nextjs16)
- React Compiler: a secondary 2026 tutorial reports it moved to RC end-2025 and is usable in production via Babel/SWC plugin; React 19.2.6 published 6 May 2026. No official "Compiler 1.0 stable" source found [snippet, third party] — [tech-insider.org](https://tech-insider.org/fr/react-tutoriel-19-2-app-production-13-etapes-2026/)
- Tailwind CSS 4.0 shipped January 2025 with the Rust "Oxide" engine, "up to 5x faster build times, or 100x for incremental builds", CSS-first config; browser floor Chrome 120+, Safari 16.4+, Firefox 128+ [snippet] — [DevClass](https://devclass.com/2025/01/24/tailwind-css-4-0-released-with-ground-up-rewrite-for-faster-rust-powered-build); [The New Stack](https://thenewstack.io/tailwind-css-gets-a-ground-up-rewrite-for-version-4-0/)
- shadcn/ui: Base UI support added January 2026 via `--base` flag; from February 2026 the new-york style uses a single `radix-ui` package with `npx shadcn@latest migrate radix`; full Tailwind v4 + React 19 support, components drop `forwardRef` and add `data-slot`; CLI v4 adds `--dry-run`/`--diff` [snippet, third party] — [ssojet guide](https://ssojet.com/blog/what-is-shadcn-ui); [mcpservers shadcn skill](https://mcpservers.org/ko/agent-skills/openai/shadcn)
- One source claims that as of July 2026 `npx shadcn init` defaults to Base UI unless `-b radix` is passed (single source, unverified) [snippet, third party] — [Aceternity](https://ui.aceternity.com/blog/shadcn-ui-alternatives)
- Vercel's AI Elements components depend on Radix APIs and have type errors with Base UI; recommend `--base radix` if AI Elements may be used [snippet] — [Vercel plugin shadcn skill](https://mcpservers.org/tr/agent-skills/vercel/vercel-plugin/shadcn-2)
- Serwist 9.0.0 released ~March 2024 (`@serwist/next` renamed `cacheOnFrontEndNav`→`cacheOnNavigation`) [snippet] — [Serwist GitHub discussion #127](https://github.com/serwist/serwist/discussions/127)
- A Next.js 16 PWA template using Serwist states "Serwist is disabled in development mode due to Turbopack compatibility", service worker runs only in production builds [snippet, third party] — [startwiseph/next-pwa template](https://github.com/startwiseph/next-pwa)
- Another guide states Serwist "works natively with Turbopack in production" with `swSrc: app/sw.ts`; a third says Next.js 16 requires installing `@serwist/turbopack` — these conflict and none is an official Serwist doc [snippet, third party] — [vibeindex nextjs-pwa skill](https://www.vibeindex.ai/skills/just-mpm/conformai/nextjs-pwa); [skills.sh pwa](https://www.skills.sh/jchaselubitz/conjecture/pwa)
- Next.js Turbopack docs: "Turbopack replaces webpack, so webpack() configs are not recognized" [snippet, vendor page] — [Next.js Turbopack reference](https://nextjs.org/docs/app/api-reference/turbopack.md)
- Chrome installability: valid manifest, registered service worker, HTTPS, maskable icons (192×192 and 512×512); Chrome for Android can install any site as an app even without a manifest [snippet] — [frontendchecklist](https://frontendchecklist.io/rules/html/pwa-installability); [MDN Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_Installable)
- Web Install API reported stable in Chrome 144; Chrome 147 origin trial for a declarative `<install>` element [snippet, single secondary source] — [Modern Web Weekly #67](https://modernwebweekly.substack.com/p/modern-web-weekly-67)
- Declarative Web Push: Safari 18.4 added support for home-screen PWAs; no source found on Chrome Android status [snippet] — [slightfuture PWA 2026](https://slightfuture.com/webdev/progressive-web-apps-2026/)
- Performance budget origin: Alex Russell's baseline is a $200 Android on slow 3G (400 ms RTT / 400 Kbps), 5 s TTI first load, ~130 KB gzipped JS [snippet] — [Infrequently Noted](https://infrequently.org/2017/10/can-you-afford-it-real-world-web-performance-budgets/comments.html)
- web.dev sample `budget.json`: 125 KB total JS, 300 KB total page weight, 3000 ms TTI, 1000 ms FMP; run via `lighthouse --budget-path` [snippet, vendor page] — [web.dev performance budgets](https://web.dev/articles/use-lighthouse-for-performance-budgets?hl=pl)
- Practitioner example: initial JS under 150 KB gzipped, CI fails on overrun [snippet] — [Shipping on 3G](https://mosescodes.laravel.cloud/blog/shipping-on-3g)
- Nigerian Pidgin is not offered as a UI language by mainstream platforms; CDIAL's "Indigenous Mobile" keyboard supports Hausa, Igbo, Yoruba, Pidgin; Samsung made Hausa/Yoruba/Igbo official languages on Galaxy S25/A56; Google Translate added Hausa, Igbo, Yoruba etc. in 2024 [snippet] — [Global Voices](https://rising.globalvoices.org/blog/2014/02/27/i-type-therefore-i-am-texting-in-local-languages/); [Brand Times CDIAL](https://www.brandtimes.com.ng/cdial-unveils-ai-technology-that-speaks-4-nigerian-languages/)
- Hausa UI localisation needs special characters ɓ, ɗ, ƙ, ƴ, Unicode testing, font verification, and a stored language preference [snippet] — [Wikimedia Phabricator T412371](https://phabricator.wikimedia.org/T412371)

### Inferences
- Recommendation: Next.js 16.x app router with Cache Components, React 19.2, Tailwind v4, shadcn/ui on **Radix** (safer today given the Base UI type issues reported with Vercel AI Elements and the unverified default switch), react-hook-form + zod (v4) via `@hookform/resolvers`, TanStack Query v5 for client cache. Pin versions; the ecosystem moved fast through 2026.
- PWA: use `@serwist/next` with production-only SW generation and accept that `next dev` runs without a SW (or run `next dev --webpack` when testing offline). Verify whether `@serwist/turbopack` exists on npm before adopting — the sources conflict. Treat `next-pwa` (shadiqworks) as legacy; it does not appear in 2026 results.
- Offline-first: cache the app shell and last-viewed job/CV data with Serwist runtime caching; queue mutations (saved jobs, application drafts) with the Background Sync API (Chrome Android) and fall back to retry-on-focus elsewhere; keep images as AVIF/WebP via `next/image` with explicit `sizes`, and self-host one variable font subset.
- Budgets: enforce 125–150 KB gzipped initial JS, <300 KB first-load page weight, via `lighthouse --budget-path` plus `@next/bundle-analyzer` (now built in since 16.1) in GitHub Actions. Test under Lighthouse "Slow 3G"/4x CPU throttling.
- i18n: `next-intl` with `en-NG` default and a `pcm` (ISO 639-3 code for Nigerian Pidgin) tone variant implemented as a message catalogue, not a separate locale rule set — there is no CLDR/platform locale support, so treat Pidgin as copy variants and keep number/date formatting on `en-NG`.
- Accessibility: `@axe-core/playwright` in e2e, `eslint-plugin-jsx-a11y` in lint.

### Gaps
- Could not confirm the official Serwist Turbopack integration story (package name, dev-mode support) — Serwist docs unreachable.
- Could not confirm React Compiler 1.0 stable status or current `next-intl`, TanStack Query, react-hook-form, `@hookform/resolvers` version numbers and Next 16 peer ranges.
- Could not confirm Declarative Web Push or Web Install API status on Chrome Android from an official Chrome source.
- No Nigeria-specific Lighthouse/CrUX data located.

## Backend and data

### Takeaway
Keep the Hono API (edge-capable, typed `hc` client, Zod validators, `@hono/zod-openapi` for OpenAPI) and Supabase Postgres in London (eu-west-2) with RLS; use Drizzle for a two-person team; implement phone OTP via Supabase's Send SMS Hook pointing at a Nigerian provider (Termii/Africa's Talking), since Supabase's native providers are Twilio/MessageBird/Vonage/TextLocal only; use Upstash Redis for cache/rate-limit state and start background jobs on Supabase pg_cron + pgmq + Edge Functions, graduating to Inngest when retries/observability matter.

### Cited Findings
- Fastify's own benchmark page (updated 17 Aug 2026): Fastify 5.11.3 ≈ 88,171 req/s, Hono 4.13.1 ≈ 82,371 req/s, Express 5.2.1 ≈ 59,754 req/s on a single Node instance ("illustrative") [snippet, vendor page] — [Fastify benchmarks](https://www.fastify.dev/benchmarks/)
- Hono and Fastify measured within ~1% on Node 24 (91,897 vs 92,651 req/s); Hono's typed client gives "a fully typed client with zero codegen"; Hono is the only one with native edge runtime support [snippet, third party] — [techplained](https://www.techplained.com/hono-vs-express-vs-fastify); [DeployHQ](https://www.deployhq.com/guides/hono)
- "All frameworks converge around 10-15K RPS with a real DB call" [snippet, third party] — [pkgpulse](https://www.pkgpulse.com/guides/hono-vs-express-vs-fastify-2026)
- Hono RPC: export `AppType`, client via `hc<AppType>(url)`; both tsconfigs must set `"strict": true`; `zValidator('json', schema)` + `c.req.valid('json')`; `@hono/zod-openapi` generates OpenAPI from the same Zod schemas; Hono v4.12.16 reported current April 2026 [snippet, vendor + third party] — [Hono RPC guide](https://hono.dev/guides/rpc); [codex.danielvaughan.com](https://codex.danielvaughan.com/2026/06/03/codex-cli-hono-edge-apis-zod-openapi-rpc-cloudflare-workers/)
- Supabase Free plan (aggregators, consistent): 500 MB database, 2 active projects, 5 GB egress, 50,000 MAUs, 1 GB file storage, 2M realtime messages, 500K Edge Function invocations, no backups; free projects pause after 7 days inactivity; Pro $25/month per org, Team $599/month; core limits "remain unchanged in 2026"; GitHub integration on all plans since April 2026 [snippet, third party] — [uibakery](https://uibakery.io/blog/supabase-pricing); [makerkit](https://makerkit.dev/blog/saas/supabase-pricing); [designrevision](https://designrevision.com/blog/supabase-pricing)
- Supabase changelog 3 March 2025: Free plan third-party auth MAUs raised from 50 to 50,000; Pro/Team 100,000 included, then $0.00325 per MAU [snippet, vendor page] — [Supabase changelog](https://supabase.com/changelog/33959-greatly-increased-third-party-auth-mau-quota-for-free-and-paid-plans)
- Supabase pricing table: basic MFA included on Free; "Advanced Multi-Factor Auth - Phone" not included on Free [snippet, vendor page] — [Supabase pricing .md](https://supabase.com/pricing.md)
- Supabase regions doc lists "West Europe (London) eu-west-2"; no Cape Town (af-south-1) or Lagos region appears [snippet, vendor page] — [Supabase regions](https://supabase.com/docs/guides/platform/regions); [supabase.com/regions](https://supabase.com/regions)
- Supabase phone login providers: MessageBird, Twilio, Vonage, TextLocal (community-supported), plus `twilio_verify`; default OTP rate limit 1 per 60 s, codes expire after 1 hour; WhatsApp OTP only via Twilio/Twilio Verify [snippet, vendor page] — [Supabase phone login](https://supabase.com/docs/guides/auth/phone-login)
- Supabase Send SMS Hook replaces built-in SMS sending; a listed use case is "using a regional SMS provider"; payload includes the user and OTP in an `sms` object; configured as HTTPS hook to an Edge Function with a generated secret [snippet, vendor page] — [Send SMS Hook docs](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook.md); [Auth hooks](https://supabase.com/docs/guides/auth/auth-hooks.md); [DEV community India example](https://dev.to/acetrondi/using-supabase-sms-hook-to-send-custom-authentication-messages-in-india-4nj7)
- Supabase does "NOT RECOMMEND any new usage of pgsodium"; TCE/Server Key Management not recommended "due to their high level of operational complexity and misconfiguration risk"; Vault API unchanged; projects "encrypted at rest by default"; keys should not live in the same database [snippet, vendor page] — [Supabase column encryption docs](https://supabase.com/docs/guides/database/column-encryption); [Supabase Vault blog](https://supabase.com/blog/supabase-vault)
- Drizzle vs Prisma 2026: Drizzle "adds almost no overhead over the raw driver"; Prisma 7 claims 9x cold-start and 3x latency improvements but Drizzle still faster with smaller edge footprint; Prisma needs Accelerate or driver adapters for edge; Drizzle stable 0.45.2 with 1.0 beta in progress — "pin versions explicitly" [snippet, third party] — [makerkit Drizzle vs Prisma](https://makerkit.dev/blog/md/tutorials/drizzle-vs-prisma); [turbostarter](https://www.turbostarter.dev/blog/drizzle-vs-prisma-typescript-orm-2026)
- Supabase docs: pg_cron + pg_net can invoke Edge Functions on a schedule, store the auth token in Vault [snippet, vendor page] — [Scheduling Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions.md)
- pg_cron lacks retries and failure alerts out of the box; patterns use pgmq consumed on a pg_cron schedule and `EdgeRuntime.waitUntil` for <30 s tasks; sources conflict on whether pg_cron is available on Free (two say yes, one says Pro+) [snippet, third party] — [crontap guide](https://crontap.com/guides/supabase-cron-jobs); [tessl edge-function orchestration](https://tessl.io/registry/g14wxz/edge-function-background-orchestration)
- Inngest free tier ≈50,000 step runs/month (each step counts), 7-day history, 1 production env, Basic $20/mo, Pro $50/mo (one aggregator says $75, another $99) [snippet, third party] — [automationatlas Inngest](https://automationatlas.io/answers/inngest-pricing-explained-2026/); [costbench Inngest](https://costbench.com/software/ai-workflow-orchestration/inngest/)
- Trigger.dev free: $5/month compute credits, 20 concurrent runs, 10 schedules, 1-day log retention (credit model; an older model of 10,000 runs/14-day history also reported) [snippet, third party] — [zenml Trigger.dev pricing](https://www.zenml.io/blog/trigger-dev-pricing); [automationatlas Trigger.dev](https://automationatlas.io/answers/trigger-dev-pricing-explained-2026/)
- Upstash Redis Free: 256 MB, 500K commands/month, 10 GB bandwidth/month, 10,000 cmd/s, 1 database, no credit card; pay-as-you-go $0.20 per 100K commands with monthly budget cap [snippet, vendor page] — [Upstash Redis pricing](https://upstash.com/pricing/redis); [Upstash billing docs](https://upstash.com/docs/redis/overall/billing)
- Arcjet pricing: bot detection $0.50 per 1M; protected request price conflicts between $0.50/1M (.md page) and $5/1M (HTML page); "Individual" plan with 1 member, 1 hour log retention; rate limiting adds "10-20ms per request"; `@arcjet/next` SDK covers bot protection, rate limiting, Shield WAF; no Hono coverage found [snippet, vendor page] — [Arcjet pricing .md](https://arcjet.com/pricing.md); [Arcjet rate limiting concepts](https://docs.arcjet.com/rate-limiting/concepts); [@arcjet/next](https://npmjs.com/package/@arcjet/next)
- Cloudflare Turnstile: standard plan free with unlimited sitekeys/requests per one source; another lists 1M requests/month, 20 widgets; enterprise features behind Cloudflare Enterprise contract [snippet, third party, competitor-authored] — [prosopo Turnstile pricing](https://prosopo.io/tools/cloudflare-turnstile-pricing/); [phpcaptcha review](https://www.phpcaptcha.org/cloudflare-turnstile-review)
- Cloudflare R2 free tier: 10 GB-month storage, 1M Class A ops, 10M Class B ops, egress free; Supabase Storage Free: 1 GB, 5 GB uncached + 5 GB cached egress, overage $0.09/GB uncached, $0.03/GB cached [snippet, third party] — [merginit object storage comparison](https://merginit.com/blog/17062026-free-object-storage-comparison); [activepieces Supabase pricing](https://www.activepieces.com/blog/supabase-pricing-free-tier-limits-pro-costs-egress)

### Inferences
- API framework: keep Hono. Benchmarks put it level with Fastify on Node and it is the only one that also runs on Cloudflare Workers/Vercel Edge if you later move hot read paths closer to Lagos. Next route handlers remain fine for BFF-only concerns, but a separate Hono service gives you OpenAPI + typed `hc` client shared through the workspace core package. Use `@hono/zod-openapi` (official) rather than the community `hono-openapi` unless you need its framework-agnostic validator support.
- ORM: Drizzle (pin 0.45.x; evaluate 1.0 when GA) — SQL-first fits pgvector and RLS policies written in SQL; use `drizzle-kit` migrations committed to the repo, applied in CI against Supabase via direct connection, and seed scripts in the core package.
- Auth: Supabase Auth with Google sign-in plus phone OTP through the Send SMS Hook → Edge Function → Termii (DND route) or Africa's Talking. Native Twilio/Vonage will cost more per Nigerian SMS and are not DND-aware. Keep email OTP/magic link as fallback because Nigerian SMS delivery is regulated (DND, 8pm–8am promotional block).
- Region: eu-west-2 London (closest documented Supabase region to Lagos on the Europe–West Africa cable routes). Expect ~100 ms+ DB RTT; mitigate with Cache Components, Upstash edge cache and aggressive client-side caching rather than chasing a Lagos-local DB.
- PII: rely on Supabase at-rest encryption + RLS; do application-level field encryption (AES-GCM via Node `crypto`, key in platform secrets/KMS) for high-sensitivity fields (NIN, BVN-adjacent data, bank details) rather than pgsodium, which Supabase is deprecating.
- Jobs: start with pg_cron + pgmq + Edge Functions (zero extra vendors) for digests and embedding backfills; adopt Inngest (50K steps free) once you need retries, idempotency keys and run history for the email/WhatsApp fan-out. Trigger.dev's $5 credit model is less predictable for a cron-heavy workload.
- Files: CV uploads to Supabase Storage (same RLS/auth) with signed URLs; if egress grows, move originals to R2 (free egress). Virus scanning: no managed scanner found in sources; the practical options are a ClamAV container on Fly.io/Railway invoked from a job, or an external scanning API — flagged as a gap.
- Bot/rate limiting: Cloudflare Turnstile (free) on signup/login forms + Arcjet or Upstash Ratelimit in the Hono API; Arcjet's 10–20 ms overhead is acceptable on write paths only.

### Gaps
- Supabase pricing page itself unreachable; all plan figures are from aggregators.
- No source confirms whether pg_cron is enabled on the Free plan in 2026 (sources conflict).
- Arcjet per-request pricing unresolved ($0.50 vs $5 per 1M) and no documented free request quota.
- No source found for managed virus scanning of uploads with Supabase Storage/R2.
- No Supabase Cape Town region evidence; London is the inferred best choice, not measured.
- Per-SMS cost of Supabase native phone auth not found.

## Payments in Nigeria

### Takeaway
Paystack remains the default: local cards 1.5% + ₦100 (₦100 waived under ₦2,500) capped at ₦2,000, Pay with Transfer confirms 99% of transfers within 8 s via Paystack-Titan, and subscriptions support card and Nigeria Direct Debit (NIBSS mandate) only. Build dunning yourself off webhook events (verify HMAC-SHA512 `x-paystack-signature`, dedupe on event id, return 200 fast), and expect 7.5% VAT on fees.

### Cited Findings
- Paystack Nigeria local card fee 1.5% + ₦100, fee capped at ₦2,000; ₦100 flat fee waived for transactions under ₦2,500; international cards 3.9% + ₦100 no cap; virtual account/bank transfer 1% capped at ₦300 (one guide); next-business-day settlement; 7.5% VAT on fees [snippet, third party] — [kolonell Paystack fees 2026](https://kolonell.com/en/blog/paystack-transaction-fees-breakdown-nigeria-2026); [afrotools fee calculator](https://afrotools.com/tools/payment-fee-calculator/)
- Paystack subscriptions support "Card and Direct Debit (Nigeria)" only; plans created in dashboard or via create-plan endpoint with intervals hourly→annually; subscribe either via `/subscription` with customer + plan code or by passing plan code at transaction initialize; "listen for subscription events" [snippet, vendor page] — [Paystack subscriptions docs](https://paystack.com/docs/payments/subscriptions/)
- Paystack Direct Debit: customer links bank account by sending a small transfer to a NIBSS-provided account; mandate created on confirmation; authorization code delivered via webhook; six-hour wait after authorization before first charge; Nigeria-only; first charge via Initialize Authorization endpoint then charge-authorization with code + customer email + amount; "only the email used to create an authorization can be used to charge it" [snippet, vendor pages] — [Paystack Direct Debit waitlist](https://paystack.com/blog/product/direct-debit-waitlist); [Paystack Direct Debit support](https://support.paystack.com/hc/en-us/articles/12542843851420-Direct-Debit); [Paystack recurring charges](https://paystack.com/docs/payments/recurring-charges)
- CBN fee on failed direct debits: 1% or ₦5,000 whichever higher (1% for amounts ≤₦500,000); Paystack told Techpoint it does not apply to recurring payments set up on Paystack (older article) [snippet] — [Techpoint](https://techpoint.africa/?p=182462)
- Paystack webhooks: `x-paystack-signature` header is HMAC SHA512 of payload keyed with your secret key; IP whitelisting as second check [snippet, vendor page] — [Paystack webhooks docs](https://paystack.com/docs/payments/webhooks/)
- Third-party: live-mode webhook retries every 3 minutes for first 4 tries then hourly up to 72 hours; test mode hourly for 10 hours; 30-second timeout; no separate webhook secret; no official idempotency-key mechanism found — dedupe on event id [snippet, third party] — [Hookdeck Paystack guide](https://hookdeck.com/webhooks/platforms/guide-to-paystack-webhooks-features-and-best-practices); [mctaba retries](https://mctaba.com/learn/paystack/paystack-webhook-retries-what-to-expect-and-how-to-cope)
- Dunning (third-party Paystack guide): failed recurring charge returns `gateway_response`; retry temporary failures (Insufficient Funds), request card update for permanent (Card Expired), investigate ambiguous (Do Not Honor); limit to a few retries over about a week [snippet, third party] — [mctaba dunning](https://mctaba.com/learn/paystack/handling-failed-recurring-charges-and-dunning-on-paystack)
- Paystack-Titan: "99% of bank transfers collected via Paystack-Titan are confirmed within 8 seconds"; >170M unique transactions via Paystack Virtual Accounts (Wema, Access, Zenith); Pay with Transfer generates Zenith/Providus account numbers [snippet, vendor page] — [Paystack-Titan blog](https://paystack.com/blog/product-engineering/paystack-titan); [Pay with Transfer](https://paystack.com/blog/product-engineering/pay-with-transfer)
- Paystack status page logs repeated "Nigeria: Delay in Completing Transfers" incidents attributed to downtime at Nigeria's central Transfers Switch (Jan 2025, May 2025) [snippet, vendor page] — [Paystack status](https://status.paystack.com/incidents/3rwtf4rtf0xp); [Paystack status](https://status.paystack.com/incidents/6617xw1pt187)
- Flutterwave domestic cards 1.4% + 0.6% platform fee + 7.5% VAT; international card fee raised 3.8%→4.8% effective 11 Nov 2024 [snippet, third party] — [brands.ng](https://brands.ng/?p=2164); [dodopayments](https://dodopayments.com/blogs/flutterwave-alternatives)
- Monnify positioned as cheapest for virtual-account collections with >99.8% interbank success (no exact fee found); OPay merchant fees not found [snippet, third party] — [kolonell aggregator comparison](https://kolonell.com/en/blog/payment-aggregator-comparison-nigeria-2026)
- Paystack Node SDKs (none official): `@alexasomba/paystack-node` 1.10.8 (TypeScript, generated from Paystack OpenAPI spec, timing-safe webhook verification); `@irabeny/paystack-sdk` 1.5.1 on JSR (~1 year stale); `@gray-adeyi/paystack-sdk` 0.2.4 multi-runtime; `@alexasomba/better-auth-paystack` 3.0.0 [snippet] — [@alexasomba/paystack-node README](https://app.unpkg.com/@alexasomba/paystack-node@1.10.8/files/README.md); [@gray-adeyi/paystack-sdk](https://jsr.io/@gray-adeyi/paystack-sdk)

### Inferences
- Recommendation: Paystack as primary (cards, Pay with Transfer, Direct Debit for recurring, USSD for one-off low-value), with Flutterwave kept as a dormant fallback adapter behind a `PaymentProvider` interface in the core package. For an AI career product with a likely ₦2,000–₦10,000 monthly tier, Paystack's 1.5%+₦100 sits well under Flutterwave's 2.0%+VAT.
- Do not depend on a third-party Node SDK: wrap Paystack's REST API with a thin typed client (Zod-validated responses) in the core package; the available SDKs are community-maintained with unclear cadence.
- Dunning: Paystack does not document a retry schedule, so own it — on `invoice.payment_failed`/`charge.failed`, schedule retries (day 1, 3, 7) via your job runner, send a card-update link (Paystack subscription "manage link"), downgrade after exhaustion; for Direct Debit expect a mandate-level failure mode and offer Pay-with-Transfer top-up as the manual recovery path.
- Receipts/VAT: Paystack fees attract 7.5% VAT; if you are VAT-registered, issue a VAT invoice showing TIN, 7.5% line; generate PDF receipts server-side and email via Resend.
- Webhook handler: verify HMAC on the raw body, insert event id into a `payment_events` table with a unique constraint, return 200, process asynchronously.

### Gaps
- Paystack's own pricing page unreachable; fee figures are from third-party calculators that agree with each other.
- Official Paystack webhook retry schedule and any idempotency-key support not found in vendor docs.
- Monnify and OPay merchant fee schedules not found.
- No source on Paystack USSD/bank-transfer availability inside a subscription (docs say card + direct debit only).

## Messaging: email, WhatsApp, SMS OTP, push

### Takeaway
Resend (3,000 emails/month free, Pro $20 for 50K) with React Email is the lowest-friction transactional/digest stack; comply with Gmail/Yahoo bulk-sender rules from day one (SPF+DKIM+DMARC, RFC 8058 one-click unsubscribe, <0.3% spam). WhatsApp via Meta Cloud API is now per-message billed, with vendor-reported Nigeria rates around $0.0067–$0.0101 utility and $0.03–$0.06 marketing and a new October 2026 charge on service messages; Termii is the natural Nigerian BSP/SMS provider (DND route, $50/month WhatsApp account fee). Web Push stays free on OneSignal, but roll your own VAPID push first.

### Cited Findings
- Resend plans: Free $0 for 3,000 emails/month (100/day), no overage; Pro $20/mo for 50,000 and $35/mo for 100,000, $0.90 per 1,000 overage; 30-day data retention on free; dedicated IP $30/mo on Scale for >3,000 emails/day; marketing (contacts) plans free up to 1,000 contacts [snippet, vendor .md pages] — [Resend pricing .md](https://resend.com/pricing.md); [Resend pricing KB](https://resend.com/docs/knowledge-base/what-is-resend-pricing.md); [Resend new free tier blog](https://resend.com/blog/new-free-tier.md)
- Postmark: free 100 emails/month hard cap; Basic $15/mo (10K) $1.80/1K overage; Pro $16.50 $1.30/1K; Platform $18 $1.20/1K; dedicated IP $50 [snippet, third party] — [activepieces Postmark pricing](https://www.activepieces.com/blog/postmark-pricing-plans-costs-by-volume-2026-guide.md)
- Amazon SES $0.10 per 1,000 emails + $0.12/GB attachments; 3,000 free/month for first 12 months; dedicated IP $24.95/mo [snippet, third party] — [costbench SES vs Postmark](https://www.costbench.com/compare/amazon-ses-vs-postmark/)
- Gmail/Yahoo bulk sender (≥5,000/day): SPF, DKIM, DMARC (p=none suffices), one of SPF/DKIM aligned with From domain, RFC 8058 List-Unsubscribe one-click honoured within 2 days, spam complaint rate below 0.3% (aim <0.1%); monitor via Google Postmaster Tools and Yahoo CFL [snippet, third party] — [Bird explainer](https://bird.com/explained/deliverability/what-are-the-gmail-and-yahoo-bulk-sender-requirements); [Warmy guide](https://www.warmy.io/guides/google-yahoo-sender-requirements/); [Mailgun](https://www.mailgun.com/de/?p=25830)
- Meta WhatsApp moved to per-message billing on 1 July 2025; rates vary by country and template category (Authentication, Utility, Marketing) [snippet, third party] — [setsmart WhatsApp pricing](https://setsmart.io/blog/whatsapp-business-api-pricing); [Meta updates-to-pricing](https://developers.secure.facebook.com/docs/whatsapp/updates-to-pricing)
- From 1 October 2026 Meta reportedly charges for service (customer-reply) messages inside the 24-hour window, with first 1,000 service messages per phone number per month free (single vendor claim) [snippet, third party] — [MSME Africa](https://msmeafricaonline.com/whatsapp-to-charge-businesses-for-customer-replies-from-october-2026/); [ChatMaxima Nigeria rates](https://chatmaxima.com/whatsapp-api-pricing/nigeria/)
- Nigeria WhatsApp per-message rates (USD, conflicting vendor figures): utility $0.0101 (~₦14) and marketing $0.062 (~₦84) at ₦1,340/$ (Daily Trust/MSME Africa); marketing $0.0516, utility $0.0067, authentication $0.0067 (ChatMaxima); marketing $0.0325, utility $0.0068, service $0.0147, authentication $0.0327 (ChatDaddy, per conversation); Innovation Village says final Nigerian rate unannounced, estimates ₦10 transactional/₦51 marketing [snippet, third party] — [Daily Trust](https://dailytrust.com/?p=1946166); [ChatDaddy](https://www.chatdaddy.tech/blog/whatsapp-business-api-pricing); [Innovation Village](https://innovation-village.com/whatsapp-to-charge-nigerian-businesses-for-customer-replies/)
- Utility templates must be strictly non-promotional; mixed content (order update + promo) is reclassified Marketing at higher cost (July 2025 guideline update) [snippet, third party] — [YCloud template category update](https://www.ycloud.com/blog/whatsapp-api-message-template-category-guidelines-update); [egrow utility guide](https://help.egrow.com/en/article/whatsapp-template-category-guide-how-to-keep-your-templates-in-the-utility-category)
- 360dialog hosting fee per number €49/$49 Regular (80 msg/s), €99/$99 Premium, €299/$299 (1,000 msg/s), billed from onboarding, renews 1st of month [snippet, vendor page] — [360dialog prices](https://docs.360dialog.com/docs/360dialog/prices-plans-and-payment-options)
- Twilio WhatsApp: Meta fee plus ~$0.005 per message both directions; no monthly per-number fee found [snippet, third party] — [Telnyx](https://telnyx.com/resources/whatsapp-business-api-cost); [Rasayel](https://learn.rasayel.io/en/books/whatsapp/whatsapp-business-platform/cost)
- Termii pricing page: SMS/WhatsApp/Email billed per transaction, rates vary by destination/channel; WhatsApp $50 monthly fee per account plus $0.0001 per transaction, billed in USD; prepaid wallet model; DND route needed to reach DND numbers; generic (promotional) route blocked 8:00 PM–8:00 AM in Nigeria [snippet, vendor pages] — [Termii pricing](https://termii.com/pricing); [Termii messaging API](https://developers.termii.com/messaging-api); [Termii DND blog](https://blog.termii.com/the-dnd-service-in-nigeria-everything-you-need-to-know)
- Termii case study: powers Paystack's transactional messaging [snippet, vendor page] — [Termii × Paystack](https://blog.termii.com/secure-and-reliable-how-termiis-communication-platform-transformed-paystacks-transactional-processes)
- Africa's Talking: reaches DND numbers on all four networks only on the transactional route, which requires registered sender ID, OTP/financial/solicited traffic, telco whitelisting ≥2 weeks, KYC (CAC certificate, ID, C-level letter to each telco); Nigerian sender IDs free, ≤11 chars, ~1 working day setup (third party says 3–5 business days) [snippet, vendor help] — [AT DND article](https://help.africastalking.com/en/articles/2241664-does-africa-s-talking-support-sending-of-sms-to-dnd-numbers-in-nigeria); [AT sender ID](https://help.africastalking.com/en/articles/2257657-how-do-i-get-a-sender-id-in-nigeria); [Telerivet Nigeria SMS](https://www.telerivet.com/blog/nigeria-sms-sender-id-dnd-compliance)
- Nigerian SMS market rates 2025: ₦5.62–₦7.00 per 160-char page standard; ₦6.50–₦8.00 DND/corporate routes; competitor benchmark $0.0055–$0.008 local OTP [snippet, third party] — [BulkSMS Nigeria calculator](https://www.bulksmsnigeria.com/resources/sms-pricing-calculator); [MessageCentral OTP pricing](https://www.messagecentral.com/blog/otp-sms-pricing-nigeria)
- OneSignal Free plan: mobile push/in-app limited to <1,000 MAU (new accounts 1 Sep 2026, existing 1 Oct 2026); web push and email stay on Free; Growth $19/mo + $0.012/MAU [snippet, third party, competitor-authored] — [Pushwoosh on OneSignal changes](https://www.pushwoosh.com/blog/onesignal-free-plan-changes/); [Courier vs OneSignal](https://www.courier.com/guides/courier-vs-onesignal)

### Inferences
- Email: Resend + React Email for transactional and the weekly job digest. 3,000/month free covers a pilot; at 10K users × 4 digests the $20 Pro tier (50K) suffices. Put digests on a separate subdomain (e.g. `digest.`) with its own DKIM so transactional reputation is isolated; implement `List-Unsubscribe` + `List-Unsubscribe-Post` headers and a one-click endpoint; store consent per channel in Postgres.
- WhatsApp: use Meta Cloud API directly (no BSP hosting fee) or Termii as BSP if you want one Nigerian vendor for SMS + WhatsApp; 360dialog's $49/number is hard to justify at launch. Budget utility messages at ~$0.007–$0.010 each and marketing at $0.03–$0.06; keep premium-tier job alerts as Utility templates (user-requested, non-promotional) to stay at the lower rate, and expect the new post-October-2026 service-message charge after 1,000 free replies per number.
- SMS OTP: Termii DND route (or Africa's Talking transactional route) via the Supabase Send SMS Hook; register a sender ID early (2+ weeks telco whitelisting). Offer WhatsApp OTP and email OTP as cheaper, more reliable fallbacks.
- Push: implement standard Web Push (VAPID, `web-push` npm) through Serwist's SW; adopt OneSignal only if you need segmentation UI — web push remains free there.

### Gaps
- Meta's official Nigeria rate card could not be fetched; vendor figures conflict by up to 2×.
- Termii's naira SMS unit price is not published; must be read from the dashboard.
- No official OneSignal page confirming web push limits.
- No Nigeria-specific deliverability data for Resend/Postmark/SES.

## Observability and product analytics

### Takeaway
Sentry Developer (free, 1 user, 5K errors) + PostHog free tier (1M events, 5K web replays, 1M flag requests, 1,500 survey responses) cover errors, performance, replay, analytics, flags and experiments at zero cost for a pilot; add Better Stack free (10 monitors, 1 status page) and Axiom's personal tier (reported 500 GB/month) for uptime and logs. Total startup-scale spend ≈ $0–$50/month.

### Cited Findings
- Sentry Developer plan free for one user, 5,000 errors/month; Team $26/month flat, unlimited members, ~50K errors; Business $80/month; overage billed per unit on-demand [snippet, third party] — [Capterra Sentry pricing](https://www.capterra.com/p/165426/Sentry/pricing/); [costbench Sentry free plan](https://costbench.com/software/developer-tools/sentry/free-plan/)
- PostHog free: first 1M events/month, 5,000 session recordings/month (2,500 mobile), 1M feature flag requests, 1,500 survey responses; paid events from ~$0.00005 (anonymous) to $0.000248; no time limit on free plan [snippet, third party] — [schematic PostHog pricing](https://schematichq.com/blog/posthog-pricing); [usercall PostHog pricing](https://usercall.co/post/posthog-pricing); [agentdeals analytics comparison](https://agentdeals.dev/analytics-free-tier-comparison-2026)
- Better Stack Free: 10 monitors + heartbeats, 1 status page, 100,000 exceptions/month, 3 GB logs (3-day retention), 30 GB metrics, 3 GB traces; responder license $29/license/month annual [snippet, vendor page] — [Better Stack uptime pricing](https://betterstack.com/uptime/pricing); [hyperping on Better Stack](https://hyperping.com/blog/betterstack-pricing)
- Axiom: aggregators report Personal tier 500 GB ingest/month, 25 GB storage, 30-day retention, 2 datasets, 1 user; Axiom pricing doc (Jan 2026) says every Cloud account pays $25/month base platform fee with per-GB graduated ingest; April 2025 blog says $25 plan includes 1,000 GB loading, 100 GB-hours query, 100 GB storage [snippet, vendor + third party] — [Axiom pricing llms.txt](https://axiom.co/pricing/llms.txt); [Axiom reimagining pricing](https://axiom.co/blog/reimagining-pricing); [agentdeals Axiom](https://agentdeals.dev/vendor/axiom)
- Grafana Cloud free tier includes 500 k6 VUh/month, 10k metrics, 50 GB logs/traces/profiles; k6 platform fee $19/month then pay-as-you-go; Pro ~$0.15/VUh [snippet, third party] — [last9 Grafana pricing](https://last9.io/blog/grafana-cloud-pricing/); [cubeapm Grafana](https://cubeapm.com/blog/grafana-cloud-pricing-and-review/)

### Inferences
- Recommendation: Sentry (`@sentry/nextjs`, `@sentry/node` in Hono) for errors + tracing with sampling at 10–20% to stay in free/Team limits; PostHog for product analytics, feature flags (replaces a separate flag vendor), A/B experiments and surveys, with EU cloud for NDPA-friendlier residency; PostHog session replay rather than Sentry Replay to avoid paying twice. Mixpanel/Amplitude add cost without flags; not recommended for a two-person team.
- Emit OpenTelemetry from Hono (`@hono/otel`) so traces can go to Sentry now and Axiom/Grafana later without code changes.
- Uptime + public status page: Better Stack free (1 status page), pointing at Vercel/Fly health endpoints and the Paystack webhook endpoint.
- Logs: Axiom personal tier (or Better Stack's 3 GB) — verify Axiom's current free allowance before relying on 500 GB.

### Gaps
- Sentry's and PostHog's official pricing pages unreachable; figures are from aggregators that broadly agree.
- Axiom free-tier figure (500 GB vs 1,000 GB vs $25 base fee) is unresolved.

## Testing and quality

### Takeaway
Vitest 4.x (stable Browser Mode via `@vitest/browser-playwright`, built-in visual regression, Playwright traces) + Playwright for e2e, Testing Library for components, Zod schemas shared from the core package as the API contract (with `@hono/zod-openapi` emitting OpenAPI and `hc` providing the typed client), and Grafana k6 (500 VUh free) for load.

### Cited Findings
- Vitest 4.0 (October 2025): Browser Mode stable, visual regression testing, Playwright trace support; Playwright provider moved to separate `@vitest/browser-playwright` package (breaking change); Vitest 4.1 (March 2026) adds test tags and experimental native Node runner; latest reported 4.1.9; minimums Node 20.19+, Vite 6+; no Vitest 5 beta yet [snippet] — [voidzero announcing Vitest 4](https://voidzero.dev/posts/announcing-vitest-4); [InfoQ Vitest 4](https://www.infoq.com/news/2025/12/vitest-4-browser-mode); [issoh Vitest 4 guide](https://www.issoh.co.jp/tech/details/9465/)
- Hono RPC typed client via `hc<AppType>` with Zod validators; `@hono/zod-openapi` for OpenAPI from the same schemas; strict TS required in both packages [snippet, vendor page] — [Hono RPC guide](https://hono.dev/guides/rpc)
- Grafana k6 cloud free 500 VUh/month, no credit card, 14-day result retention [snippet, third party] — [agentdeals k6](https://agentdeals.dev/vendor/grafana-k6-cloud)
- Chrome Lighthouse budgets via `--budget-path` (see Frontend section) [snippet, vendor page] — [web.dev](https://web.dev/articles/use-lighthouse-for-performance-budgets?hl=pl)

### Inferences
- Contract testing: because the Hono app's `AppType` is consumed by the Next.js frontend through the workspace, a type-check in CI is the first contract test; add schema-level tests that parse recorded API fixtures through the shared Zod schemas, and publish OpenAPI JSON as a build artifact for the admin console and external partners.
- Visual regression: use Vitest 4 Browser Mode's built-in screenshot assertions for components and Playwright `toHaveScreenshot` for key mobile viewports (360×800 Android), rather than paying for Chromatic/Percy at this stage.
- Load: run k6 open-source locally in CI on the API; use the 500 free cloud VUh for pre-launch soak tests of the Paystack webhook and job-search endpoints.

### Gaps
- Playwright 1.5x and Testing Library React 19 compatibility details not found in results (both are widely used; verify current versions on npm).

## Delivery: hosting, CI, regions, secrets, migrations, backups

### Takeaway
Vercel Pro ($20/seat, 1 TB transfer, 10M edge requests) for the Next.js apps with Cloudflare in front (Lagos PoP) and Fly.io (shared-cpu-1x from $1.94/month base; Africa egress $0.12/GB) or Railway ($5 Hobby) for the Hono API/Docker; Supabase in London; GitHub Actions (2,000 free minutes private) with Vercel preview deployments; Infisical or Doppler free tiers for secrets; drizzle-kit migrations in CI; Supabase Pro ($25) is the minimum for backups.

### Cited Findings
- Vercel Hobby free, non-commercial only, ~100 GB transfer and ~1M edge requests, cannot buy extra usage; Pro $20 per paid seat/month, unlimited free viewers, includes $20 usage credit, 1 TB Fast Data Transfer, 10M Edge Requests; overage $0.15/GB transfer, $2 per million edge requests; Active CPU included allowance conflicts (40 hrs vs none) [snippet, third party] — [makerkit Vercel cost](https://makerkit.dev/blog/tutorials/vercel-cost); [modelence Vercel pricing](https://modelence.com/compare/vercel-pricing); [vogels Vercel reference](https://docs.it.apps.vogels.com/docs/vercel/reference/pricing)
- Vercel region cpt1 = af-south-1 Cape Town; functions default to iad1; cpt1 has region-specific pricing available only to Pro users [snippet, vendor page] — [Vercel regions](https://vercel.com/docs/edge-network/regions); [Vercel cpt1 pricing](https://vercel.com/docs/pricing/regional-pricing/cpt1)
- Cloudflare Workers Free: 100,000 requests/day, 10 ms CPU per invocation, resets 00:00 UTC; Paid $5/month minimum with 10M requests and 30M CPU-ms included, $0.30 per additional million requests, $0.02 per million CPU-ms (one Cloudflare page shows 20M included at $0.60/M — conflicting); no egress fees [snippet, vendor + third party] — [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/); [makerkit Cloudflare calculator](https://makerkit.dev/pricing-calculator/cloudflare)
- Fly.io: shared-cpu-1x 256 MB $1.94/month in Ashburn/Secaucus (multiplier 1.000); regional price = Ashburn × multiplier (e.g., Frankfurt 1 GB $7.73 vs $6.70); egress $0.02/GB NA/EU, $0.04 APAC/SA, $0.12/GB Africa and India; new volume-snapshot and inter-region fees reported early 2026; no free tier for new accounts [snippet, vendor + third party] — [Fly.io pricing .md](https://fly.io/pricing.md); [Fly.io docs pricing](https://fly.io/docs/about/pricing/); [temps.sh Fly pricing 2026](https://temps.sh/blog/fly-io-pricing-2026)
- Railway Hobby $5/month with $5 usage credit (acts as spend cap), per-second billing (~$0.00000772 per vCPU-second), Pro $20/seat + usage; Render Starter $7/month fixed instances, Postgres from ~$6/month [snippet, third party] — [sota.io comparison](https://sota.io/blog/railway-vs-render-vs-fly-pricing-2026); [findstack](https://findstack.com/resources/railway-vs-render-vs-fly-io)
- GitHub Free: 2,000 Actions minutes/month (Pro 3,000); public repos free on standard hosted runners; Dependabot alerts included; heise reports a $0.002/min charge for self-hosted runners in private repos from January 2026 that GitHub later said it would reconsider (unresolved) [snippet, vendor docs + press] — [GitHub plans docs](https://docs.github.com/en/enterprise-server@3.17/get-started/learning-about-github/githubs-plans); [GitHub Actions billing](https://docs.github.com/billing/managing-billing-for-your-products/managing-billing-for-github-actions); [heise](https://heise.de/-11118027)
- Infisical free: 5 identities, 3 projects, 3 environments, 10 integrations, secret scanning; Pro $18–$20/identity/month; MIT core self-hostable. Doppler Developer free for 3 users (CLI, service tokens); Team $21/user/month; extra users on free $8 [snippet, third party] — [costbench Doppler vs Infisical](https://costbench.com/compare/doppler-vs-infisical/); [merginit secrets comparison](https://merginit.com/blog/23062026-free-secrets-env-management-comparison)
- Supabase Free plan has no backups (plan table) [snippet, third party] — [uibakery](https://uibakery.io/blog/supabase-pricing)
- Fly.io has a documented Arcjet integration [snippet, vendor page] — [Fly.io Arcjet docs](https://fly.io/docs/security/arcjet/)

### Inferences
- Frontend hosting: Vercel Pro (one seat = $20) is the lowest-ops choice for Next.js 16 Cache Components; front it with Cloudflare DNS/CDN (free plan) so static assets hit the Lagos PoP, and set Vercel function region to `cpt1` (Cape Town) or keep `iad1`/`lhr1` if the database is in London — co-locate functions with Supabase (London) because most requests are DB-bound.
- API hosting: Fly.io `jnb` (Johannesburg) or `lhr` for the Hono Docker image; Africa egress at $0.12/GB is 6× Europe, so if the API serves large payloads to Nigerian users, London may be cheaper and only marginally slower than Johannesburg (unmeasured). Railway is simpler for a two-person team if you do not need multi-region. Alternatively run Hono on Cloudflare Workers Paid ($5) for Lagos-edge compute with no egress fees — the strongest latency option for read-heavy endpoints.
- CI/CD: GitHub Actions (lint, typecheck, Vitest, Playwright on PRs; drizzle-kit migrate on merge to main against Supabase via `DATABASE_URL` from Infisical); Vercel preview per PR; Fly/Railway preview via PR environments.
- Secrets: Infisical free (5 identities is enough for 2 humans + CI + Vercel + Fly) with its GitHub Actions and Vercel integrations; 1Password is fine for humans but not a runtime secrets manager.
- Feature flags: PostHog (already in stack) rather than a separate vendor.
- Backups: Supabase Pro ($25) for daily backups and PITR add-on; nightly `pg_dump` to R2 from a Fly scheduled machine as an independent copy.

### Gaps
- Vercel's own pricing page unreachable; Active CPU allowance conflict unresolved.
- Fly.io Johannesburg multiplier/price not found.
- Cloudflare Workers Paid included-requests conflict (10M vs 20M) unresolved.
- No measured latency comparison Lagos→Cape Town vs Lagos→London for Vercel/Fly.

## Security and compliance tooling (NDPA/GAID)

### Takeaway
NDPA 2023 is operationalised by the GAID 2025 (issued 20 March 2025, fully in force 19 September 2025): expect NDPC registration if you are a controller of major importance, an annual compliance audit (first within 15 months), semi-annual processing reports, a documented retention policy under a "minimum necessary" standard, explicit cookie consent with reject option, and Transfer Impact Assessments for hosting data outside Nigeria (your Supabase/Vercel stack). Pair with free tooling: GitHub secret scanning/push protection, Dependabot, Socket (free for OSS/small private), strict CSP, and an audit-log table.

### Cited Findings
- GAID issued 20 March 2025, fully in force 19 September 2025, replaces NDPR 2019 framework [snippet] — [Mondaq GAID](https://www.mondaq.com/nigeria/privacy-protection/1606106/the-nigeria-data-protection-commission-issues-the-general-application-and-implementation-directive-2025-gaid); [Templars client alert PDF](https://templars-law.com/app/uploads/2025/04/NDPC-Issues-the-Nigeria-Data-Protection-Act-General-Application-and-Implementation-Directive-2025.pdf)
- Data Controllers/Processors of Major Importance must register with NDPC across three risk tiers; every controller/processor must complete a compliance audit within 15 months of starting business, then annually; Ultra-High/Extra-High tiers file Compliance Audit Returns by 31 March; processing-activity reporting every six months; SNAG grievance procedure before NDPC escalation; international transfers require Transfer Impact Assessments and NDPC approval for SCCs/BCRs [snippet] — [DLA Piper on GAID](https://privacymatters.dlapiper.com/2025/06/nigeria-ndpc-issues-gaid-key-compliance-insights/); [legalbytes GAID](https://legalbytes.substack.com/p/gaid-2025-what-nigerian-businesses)
- Retention: NDPA storage-limitation principle; GAID applies a "minimum necessary" standard and requires clear retention policies; no fixed statutory retention periods given [snippet] — [secureprivacy NDPA guide](https://secureprivacy.ai/blog/nigeria-data-protection-law)
- Cookie consent under GAID: clear, informed, freely given consent before non-essential cookies; banner visible without scrolling; explicit accept/reject; disclose purpose, controller, withdrawal; strictly necessary cookies exempt [snippet, third party] — [CookieHub Nigeria](https://www.cookiehub.com/blog/a-changing-data-privacy-landscape-in-nigeria); [flexyconsent NDPA guide](https://flexyconsent.com/blog/nigeria-ndpa-cookie-consent-compliance-guide/)
- GAID strengthens right to erasure under specific conditions (excerpt truncated; no response deadline found) [snippet] — [Mondaq key updates](https://www.mondaq.com/nigeria/privacy-protection/1627428/key-regulatory-updates-under-the-2025-general-application-and-implementation-directive-gaid-issued-by-the-nigeria-data-protection-commission-ndpc)
- GitHub secret scanning push protection free for all public repositories; limitations: limited secret types, no historical scanning [snippet, vendor + third party] — [GitHub blog](https://github.blog/news-insights/product-news/push-protection-is-generally-available-and-free-for-all-public-repositories/); [GitGuardian on push protection](https://medium.com/gitguardian/githubs-push-protection-enhancing-open-source-security-with-limitations-to-consider-606b54913d07)
- Socket.dev free tier: unlimited OSS repos; private repos ~1,000 scans/month, 3–5 members (sources vary); Team $25/developer/month [snippet, third party] — [agentdeals Socket](https://agentdeals.dev/vendor/socket-dev); [toolradar Socket pricing](https://toolradar.com/tools/socket-dev/pricing)
- Supabase: encryption at rest by default; pgsodium column encryption deprecated/not recommended; keys must not live in the same database [snippet, vendor page] — [Supabase column encryption](https://supabase.com/docs/guides/database/column-encryption)

### Inferences
- Because production data will sit in London (Supabase) and US/EU (Vercel, Resend, PostHog), prepare a Transfer Impact Assessment and record it in your GAID compliance file; choose EU cloud options (PostHog EU, Resend EU region if offered) to simplify the story; consider AWS Lagos Local Zone only if a regulator later demands in-country residency.
- Implement: `audit_log` table written via Postgres triggers for PII reads/writes by admins; retention jobs (pg_cron) that delete inactive accounts' CVs after a documented period (e.g., 24 months of inactivity, to be set by policy); self-service export/delete endpoints with a 30-day grace period; consent table per channel (email digest, WhatsApp, SMS, analytics cookies) feeding Resend/WhatsApp opt-in checks.
- Security baseline: OWASP ASVS Level 1 checklist; Next.js `proxy.ts` to set nonce-based CSP, HSTS, Permissions-Policy; Dependabot + Socket on GitHub; Arcjet/Upstash rate limits on auth and upload routes; signed URLs for CVs; application-level encryption for NIN/bank data.

### Gaps
- No statutory response deadline for erasure requests found; GAID text itself not fetched.
- Whether an early-stage job platform qualifies as a "Data Controller of Major Importance" (thresholds) not found in results.
- Socket free-tier private repo limits conflict (3 vs 5 members).

## Admin and ops: admin UI, support tooling, status pages

### Takeaway
Keep the hand-built Next.js admin console on shadcn/ui + TanStack Table/Query for a two-person team; Refine (v5, React 19, TanStack Query v5) is the drop-in accelerator if you want CRUD scaffolding, and Payload 3 only makes sense if you also need CMS content. Chatwoot (MIT, self-host) or Crisp (per-workspace pricing, ~$45–$95/month) for support with WhatsApp inbox; Better Stack free for the status page.

### Cited Findings
- Refine CORE v5 (Feb 2026) adds React 19 support and TanStack Query v5; Refine ~33.2K vs react-admin ~26.3K GitHub stars (2025); marmelab's comparison says react-admin needs less code and marks Refine as lacking relationships/undo/calendar (2023, vendor-biased) [snippet] — [Refine vs React Admin](https://refine.dev/blog/refine-vs-react-admin/); [marmelab comparison](https://marmelab.com/blog/2023/07/04/react-admin-vs-refine.html); [StackShare](https://stackshare.io/stackups/react-admin-vs-refine)
- Payload 3 embeds in a Next.js app sharing server/routes/build; Postgres adapter `@payloadcms/db-postgres`; Railway template reports Payload 3.91 on Next.js 16.4 (October 2026); media on local FS is ephemeral so S3-compatible storage needed; one source claims Figma acquired Payload and Payload Cloud paused sign-ups in 2026 (single source) [snippet] — [Railway Payload guide](https://docs.railway.com/guides/payload-cms); [Railway Payload template](https://railway.com/deploy/payload-cms-oct-26--payload-cms-postgres); [techsy Payload 2026](https://techsy.io/zh-tw/blog/payload-cms-2026-why-figma-bought-it)
- Intercom $39–139/user/month plus $0.99 per Fin AI resolution; Crisp per-workspace (Mini ~$45, Essentials ~$95, Plus ~$295/month; another source €45 Mini for 4 agents; another "Pro $28 for 5 agents"); Chatwoot MIT open source, unlimited agents self-hosted, managed from $19/agent/month; Chatwoot and Crisp both offer WhatsApp inbox [snippet, third party] — [devtoolpicks Intercom alternatives](https://devtoolpicks.com/blog/best-intercom-alternatives-indie-hackers-2026); [achiya Chatwoot vs Intercom](https://achiya-automation.com/en/blog/chatwoot-vs-intercom/); [G2 Chatwoot vs Crisp](https://www.g2.com/compare/chatwoot-vs-crisp)
- Better Stack free includes 1 status page (see Observability) [snippet, vendor page] — [Better Stack pricing](https://betterstack.com/uptime/pricing)

### Inferences
- Admin: stay hand-built on the same component library as the PWA (shared from the workspace core), add Refine only for data-grid-heavy screens (candidate moderation, payments reconciliation). Payload would add a second schema/auth system on top of Supabase — not worth it unless marketing content needs a CMS.
- Support: Crisp Mini/Essentials gives a managed WhatsApp + email + chat inbox without hosting; Chatwoot self-hosted on Fly/Railway (~$7–$15/month) if cost dominates. Avoid Intercom at this stage.
- Status page: Better Stack free, embedded link in the PWA's offline fallback page so users on flaky connections can distinguish "you're offline" from "we're down".

### Gaps
- Crisp 2026 tier prices conflict across sources; Payload/Figma acquisition claim is single-sourced.
- No Nigeria-specific support-tool pricing (naira billing) found.

## Consolidated recommendation table (for the report writer)

| Layer | Pick (version/tier) | Monthly cost at pilot | Why (Nigeria-specific) |
|---|---|---|---|
| Frontend | Next.js 16.x app router, React 19.2, Tailwind 4, shadcn/ui (Radix), react-hook-form + zod 4, TanStack Query 5, next-intl (`en-NG`, `pcm` tone) | $0 | Cache Components cut JS/HTML bytes; ~82% Android PWA install path |
| PWA | `@serwist/next` (prod-only SW), Web Push VAPID, Background Sync | $0 | Offline shell + queued actions for intermittent 3G/4G |
| API | Hono 4.x on Node (Docker) with `@hono/zod-openapi`, `hc` client | $0–$5 | Typed contract shared via workspace; edge-portable |
| Database/Auth | Supabase Pro, eu-west-2 London, pgvector, RLS, Drizzle 0.45.x | $25 | Nearest documented region; backups need Pro |
| Phone OTP | Supabase Send SMS Hook → Termii DND route (fallback: Africa's Talking) | per-SMS ~₦6–₦8 (market) | Native providers lack DND handling |
| Jobs | pg_cron + pgmq + Edge Functions → Inngest when needed | $0 → $20 | One vendor fewer at start |
| Cache/limits | Upstash Redis free (500K cmds) + Turnstile + Arcjet/Upstash Ratelimit | $0 | Edge-replicated, budget cap |
| Files | Supabase Storage (signed URLs) → R2 for egress-heavy | $0 | R2 egress free |
| Payments | Paystack (cards, Pay with Transfer, Direct Debit, USSD) via thin typed client; Flutterwave dormant adapter | 1.5%+₦100 cap ₦2,000 (+7.5% VAT) | Transfer confirms in ~8 s; self-built dunning |
| Email | Resend + React Email; separate digest subdomain; RFC 8058 unsubscribe | $0 → $20 | Gmail/Yahoo bulk rules |
| WhatsApp | Meta Cloud API direct or via Termii ($50/mo account) | ~$0.007–$0.010/utility msg | Avoid $49/number BSP fees |
| Push | Web Push via SW; OneSignal optional (web push free) | $0 | |
| Observability | Sentry Developer/Team, PostHog free (analytics, flags, replay, surveys), Better Stack free, Axiom personal | $0–$26 | |
| Testing | Vitest 4.1 (Browser Mode VRT), Playwright, Testing Library, axe, k6 (500 VUh) | $0 | |
| Hosting | Vercel Pro (1 seat) + Cloudflare free (Lagos PoP); Fly.io/Railway for Hono (or Workers Paid $5) | $20–$30 | Edge in Lagos, compute near DB |
| CI/Secrets | GitHub Actions free, Vercel previews, Infisical free, drizzle-kit migrations | $0 | |
| Security/compliance | GAID 2025 registry/audit calendar, TIA for offshore hosting, consent + audit log tables, Dependabot/Socket/push protection, nonce CSP in `proxy.ts` | $0 | NDPA/GAID in force since Sept 2025 |
| Admin/support | Hand-built Next.js admin (+Refine if needed); Crisp or self-hosted Chatwoot; Better Stack status page | $0–$95 | |

Estimated all-in pilot run-rate: roughly $70–$130/month before messaging volume (Supabase Pro $25, Vercel Pro $20, API host $5–$20, Sentry Team $26 optional, Crisp optional), plus per-message SMS/WhatsApp and Paystack fees. All figures [snippet]; verify against vendor pages before committing.
