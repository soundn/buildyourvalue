# Execution plan: from today to a paying pilot

Date: 24 October 2026. Owners: the founder (F), Philip (P), Claude in this repository (C).
This is the ordered list of what happens next, who does it, and what unblocks what. It
turns `docs/PLAN.md` (the why), `docs/BRD.md` (the what), `docs/INFRASTRUCTURE.md` and
`docs/COST_ANALYSIS.md` (the how much) into a sequence. Phase names match the plan.

## Where we stand

Done on the `claude/youthful-noether-eo2ncm` branch: research, plan, BRD, architecture,
tooling and infrastructure reports, cost analysis, fourteen ADRs (all accepted), a working
prototype (core, api, frontend, admin), an Expo mobile scaffold, Claude Code hooks,
permissions and five project skills, and the Ladda brand files in `brand/`.

Not done: anything with a real account, a real domain, a real database or a real user.
That is the next six weeks.

## Step 0: decisions that gate everything (this week, F + P)

| # | Decision | Default if nobody objects | Record |
|---|---|---|---|
| 0.1 | Brand name | Ladda, tagline "Build your value", parent line "a SoundTechWorks solution" | ADR after the checks in `brand/README.md` pass |
| 0.2 | Roles | F: sponsor, product and partnerships. P: engineering lead and operations. Data protection contact: F until a named DPO exists | BRD §1.2 and §6.3 |
| 0.3 | Merge the branch to `main` | Yes, after P has read the plan and the brief | Pull request |
| 0.4 | Entity | SoundTechWorks (ADR-0002); confirm it is a Ltd whose objects cover the product | CAC certificate in a shared drive |

## Step 1: brand, domain and identity (week 1, F)

1. Run the five checks in `brand/README.md` for Ladda (`.ng`, `.com.ng`, `.com/.app/.africa`, CAC, trademark classes 35/41/42, handles). If `.ng` or CAC fails, run them for Afara.
2. Buy the domains at Cloudflare Registrar where available (at-cost pricing, no markup) and the `.ng` ones at a NiRA registrar. Point every domain's nameservers at Cloudflare.
3. Reserve the handles. Create a `hello@` and a `security@` mailbox on the domain (Cloudflare Email Routing forwards them to Gmail for free).
4. File the trademark in classes 35, 41 and 42 at the Nigerian registry. It is slow; start it now.
5. Hand C the result: the chosen domain, and confirmation that nameservers are on Cloudflare. C then renames the product in code and docs (manifest, footer, app ids, README, BRD title) in one commit.

## Step 2: accounts and access hand-over (week 1 to 2, F creates, C configures)

Create each account in SoundTechWorks' name with the founder's email, enable two-factor authentication, then add Philip and give C access the way the last column says. Never paste a secret into chat; secrets go into the provider's dashboard or a secrets manager, and Claude Code cloud sessions read them as environment secrets.

| Account | Plan to start | Why now | What C needs |
|---|---|---|---|
| GitHub organisation `soundtechworks` | Free | Home for the four future repositories (ADR-0001) and CI | Transfer this repository into the org; add C's GitHub App to the org |
| Cloudflare | Free | DNS, CDN, Lagos edge, Turnstile, Email Routing; later Workers (ADR-0011) | API token scoped to the zone (DNS edit) and later a Workers deploy token |
| Vercel | Hobby now, Pro ($20) at launch | Frontend and admin hosting for Phase 0 and 1 (ADR-0008) | Team invite; `VERCEL_TOKEN` as a GitHub Actions secret |
| Fly.io | Pay as you go | Hono API in London (ADR-0008); no free tier, about $5 a month | `FLY_API_TOKEN` as a GitHub Actions secret |
| Supabase | Free now, Pro ($25) before real users | Postgres, Auth, Storage in London (ADR-0004, 0009) | Project URL, anon key and service role key as environment secrets; a read-only database branch for the Supabase MCP |
| Resend | Free | Transactional and digest email (ADR-0012) | API key; verify the digest subdomain (`mail.ladda.ng`) with SPF, DKIM, DMARC |
| Anthropic | API, pay as you go | CV writing and bulk routes (ADR-0003) | `ANTHROPIC_API_KEY` with a monthly spend limit set in the console |
| Voyage AI | Free tier (200M tokens) | Embeddings (ADR-0013) | API key |
| Paystack | Test mode | Payments; live keys only after CAC and bank verification | Test secret key; later the official Paystack MCP in test mode |
| Termii | Prepaid wallet | SMS OTP via Supabase's Send SMS Hook; sender ID registration takes weeks, start now | API key, approved sender ID |
| Google Cloud | Free | OAuth client for Google sign-in | Client ID and secret in Supabase Auth |
| Expo (EAS) | Free | Mobile builds and updates (ADR-0014) | Organisation invite; `EXPO_TOKEN` for CI |
| Google Play Console | One-time $25 | Android listing | Developer account under SoundTechWorks |
| Apple Developer | $99 a year | iOS listing, needed later in Phase 2 | Can wait until the Android app is in testing |
| PostHog, Sentry | Free | Analytics and errors from Phase 1 | Project keys; enable the plugins' MCP then, not before |
| NDPC | ₦10,000 tier | Registration before the 200th data subject, which the pilot may reach | Filing receipt in the shared drive |

Hand-over rule: one shared password manager vault (Bitwarden free for two people) holding the
owner logins; everything else is a scoped token with the narrowest permission that works.

## Step 3: repository and delivery (week 2, C with P reviewing)

1. Open the pull request from this branch to `main`; P reviews the plan and the code.
2. Add GitHub Actions: typecheck, core tests, builds, and the end-to-end browser check on every pull request; Claude Code review on pull requests using a subscription token.
3. Rename the product to the confirmed brand in one commit (Step 1.5).
4. Add the `.env.example` lines for every account above (the current permission rule blocks edits to `.env.example`; narrow it first, see "Known blockers").
5. Keep one workspace until the first production deploy, then split into `core`, `api`, `frontend`, `admin` and `mobile` repositories under the GitHub organisation (ADR-0001, 0008). `@byv/core` is published to GitHub Packages first.

## Step 4: Phase 0, the paid pilot (weeks 2 to 8, F + P run it, C builds the tools)

Goal and gate are unchanged from the plan: 300 survey responses, 50 hand-served CVs, four weeks of curated email digests, pre-orders of the ₦1,999 pass. Gate to Phase 1: at least 10% of the waitlist pre-pays and at least 40% of the 50 open three of four digests.

| Week | Work | Owner |
|---|---|---|
| 2 | Landing page on the real domain with waitlist and Paystack test-mode pre-order; survey built (Google Forms or Tally) and pushed through NYSC and campus WhatsApp groups | C builds, F distributes |
| 2 | NDPC registration filed; privacy notice page live; Transfer Impact Assessment drafted (Supabase London, Vercel, Resend, Anthropic) | F with counsel |
| 3 | First 25 CVs rebuilt with the prototype, reviewed by hand; digest 1 sent through Resend from the digest subdomain with one-click unsubscribe | P and C |
| 4 to 6 | Remaining 25 CVs; digests 2 to 4; open and click tracking in a spreadsheet; employer outreach to 10 SMEs for the shortlist product | P, F |
| 5 | Hand-label 300 to 500 Nigerian listings for the scam classifier and 200 profile-to-job pairs for matching evals | F + P, C builds the labelling sheet |
| 7 | Read the numbers against the gate; interview 10 pilot users | F + P |
| 8 | Go or pivot decision recorded as an ADR | F + P |

## Step 5: Phase 1, the MVP (months 2 to 5, C builds, P leads engineering)

In the order the skills and ADRs support, each as its own pull request:

1. Supabase schema with the `new-migration` skill: profiles, cvs, jobs, matches, reports, review decisions, subscriptions; RLS on every table; application-level encryption for phone and email (ADR-0009).
2. Auth: phone OTP through Termii via the Send SMS Hook, Google sign-in, long-lived sessions to keep OTP cost down.
3. Job ingestion job on pg_cron and pgmq (ADR-0006): aggregator pull, dedup, scam screen, embeddings with Voyage (ADR-0013), nightly.
4. Matching on pgvector with the Haiku rerank (ADR-0003); digest email through the `email-template` skill and Resend (ADR-0012); unsubscribe and suppression in Postgres.
5. Paystack: ₦1,999 pass and Core plan, webhook with signature check, dunning retries, bank transfer and USSD fallbacks.
6. Admin: staff sign-in, review queue on real data, employer verification.
7. PWA: service worker and Web Push (Serwist), Lighthouse budget at 150 KB in CI.
8. Observability: Sentry and PostHog wired; the eval set from the pilot run on every prompt change.
9. First production deploy: API on Fly.io London, web on Vercel behind Cloudflare (ADR-0008). This fires the repository split.

Exit criteria (BRD §18): 60% of sign-ups finish a CV, 35% digest open rate, 2% free-to-paid, churn under 10%.

## Step 6: Phase 2, growth and the mobile app (months 5 to 10)

Learning paths on ESCO, employer listings, campus and NYSC growth, Pro tier with WhatsApp utility notifications, and the Expo app (ADR-0014): Android first through EAS Build to the Play Store internal track, push notifications for digest and match alerts, share-sheet CV capture; iOS follows when there is demand. The web move to Cloudflare Workers happens when the Vercel bill passes $150 or users pass 200,000 (ADR-0011).

## Mobile recommendation, in one paragraph

Use Expo. The whole codebase is TypeScript and the domain logic is already a package, so a React Native app through Expo shares types, validation and reference data with the web apps, and two founders stay in one language. Expo Router mirrors the Next.js file routing, EAS Build removes the need for a Mac or Android Studio on each laptop, EAS Update ships JavaScript fixes without a store review, and NativeWind keeps the Tailwind tokens from the web. Flutter would mean a second language and no code sharing; Capacitor would wrap the PWA faster but gives weaker push and native feel, and is the fallback if Phase 2 slips. Expo's free tier covers 15 Android and 15 iOS builds a month, enough for a two-person team until release cadence picks up; the paid Production plan is reported at $99 to $199 a month and must be checked on expo.dev/pricing. The scaffold is in `mobile/` now so the structure is real from day one.

## Known blockers and who clears them

| Blocker | Clears it |
|---|---|
| `api/.env.example` cannot be edited by Claude because the deny rule for `.env.*` also matches it | F approves narrowing the rule in `.claude/settings.json` to `.env`, `.env.local`, `.env.*.local`, `.env.production`, `.env.development` |
| Plugin MCP servers (Supabase, Sentry, PostHog) cannot connect from the cloud sandbox | Use them from a local Claude Code session, or allow their hosts in the environment's network policy |
| Domain, CAC and trademark checks cannot be run from the sandbox | F runs them (Step 1) |
| Labour Act recruiter-licence question | Counsel, before Phase 1 |
