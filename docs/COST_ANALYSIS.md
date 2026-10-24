# Cost Analysis: Build Your Value

*Budgeting reference for the two founders, consolidating the cost figures in PLAN.md, BRD.md,
INFRASTRUCTURE.md, TOOLING.md and the research notes into one model. Where sources disagree the
range is shown. Reconciled 24 October 2026.*

## 1. Purpose and assumptions

Three questions: what launch costs, what each phase costs to run, and at what user count and
conversion rate subscriptions cover the bill. The stack is the recommended mix from
INFRASTRUCTURE.md (Recommendation per layer): Vercel Pro behind Cloudflare's free zone and the
Hono API on Fly.io London until the hosting trigger fires, then Cloudflare Workers for both
Next.js apps and the hot API paths with a Node job runner on Fly.io; Supabase Postgres and Auth
in London via Hyperdrive; Resend for email to roughly 100,000 users, then Amazon SES for the
digest; Paystack for payments; Claude Sonnet 5.5 for CV writing and Haiku 5.5 for bulk work
(ADR-0003). Staff, acquisition and founder salaries are excluded, as in every source table.

| Assumption | Value | Source |
|---|---|---|
| FX anchor | ₦1,400 per US dollar, October 2026, for every conversion here | PLAN.md (Pricing); BRD §14.2 |
| Monthly active users (MAU) | 30% of registered (Jobberman measures 23%; costs lean high) | INFRASTRUCTURE.md (assumptions table) |
| Digest cadence | 3 a week, 13 a month per active user, plus 2 transactional emails per registered user: 5.9 emails per registered user per month | INFRASTRUCTURE.md; PLAN.md (Pricing) |
| Matching | One forward rerank per active user per week against a ~220,000-vector job corpus | INFRASTRUCTURE.md (Data and identity) |
| Web traffic | 20 page views per active user per week; 1 render, 2 API calls, 5 assets, 150 KB each | INFRASTRUCTURE.md |
| Data | 35 KB per registered user in Postgres; 200 KB of CV files in object storage | INFRASTRUCTURE.md |
| Phone OTP | ₦7 per SMS, 0.3 to 1.0 OTP per active user per month | INFRASTRUCTURE.md; PLAN.md (Architecture) |
| Conversion | 3% base, 5% target; blended ARPU ₦2,500 | PLAN.md (Pricing); BRD §14.2 |
| Claude prices | Haiku 5.5 $0.10/$0.50 per MTok, Sonnet 5.5 $2/$10, Batch 50% off | ai_capabilities.md §7 |

Source tags: **F** fetched from the vendor page, **S** search snippet of the vendor page or a
third-party summary, **E** estimate (the source's own arithmetic or this document's). Anthropic,
Supabase and Cloudflare prices are F; almost every other vendor price is S because the research
sandbox could not open vendor pages (INFRASTRUCTURE.md and TOOLING.md, What could not be
verified). INFRASTRUCTURE.md converts SMS at about ₦1,470 per dollar; this document re-converts
at ₦1,400, so its SMS dollar figures run about 5% higher.

## 2. One-time costs to launch

Naira figures are from PLAN.md (Compliance table) and monetization_payments_compliance.md (KQ5)
unless marked; items with no figure in any source are TBD, with E placeholders that are this
document's own.

| Item | Cost | Tag | When |
|---|---|---|---|
| CAC: confirm SoundTechWorks is a private limited company (ADR-0002); incorporate or convert if not | ₦10,000 at share capital ≤₦1,000,000 plus ₦1,000 name reservation (schedule of 1 October 2025); agents ₦19,000 to 25,000 all-in | S | Phase 0 start |
| CAC: register the brand (Ladda or alternate) as a trading name | ₦10,000 plus ₦1,000 reservation (₦5,000 for restricted words) | S | After the five name checks (PLAN.md, Naming) |
| NDPC registration as Data Controller of Major Importance | OHL ₦10,000 a year; EHL ₦100,000; UHL ₦250,000 plus annual Compliance Audit Return (fee TBD, GAID Schedule 7(6)); register OHL first | S | Before the 200th data subject, which the Phase 0 survey may cross |
| Trademark filing, Classes 35, 41 and 42 | TBD; placeholder ₦150,000 to 300,000 for three classes through an agent (no figure in any source) | E | Phase 0, after iponigeria.com check |
| Domains: .ng, .com.ng, .com, .africa | TBD; placeholder ₦60,000 to 120,000 for year one of all four, registered together | E | Phase 0 |
| Logo and brand identity | TBD; placeholder ₦150,000 to 500,000 freelance | E | Phase 0 to 1 |
| Apple Developer Program | $99 a year (₦138,600) | S | Phase 3 only (no native app before then, BRD §5.2) |
| Google Play developer account | $25 one-off (₦35,000) | S | Phase 3 only |
| Expo EAS build service | Pricing unverified; free tier exists, paid plans roughly $19 to $99 a month | E | Phase 3 only |
| Legal opinion: is an AI matching marketplace a Labour Act "private employment agency"? | Counsel's fee TBD; state licence ₦5,000 Remita receipt if advised; ₦200,000 per category only for international placement | S | Before Phase 1 launch (BRD CR-10) |
| Paystack merchant setup | ₦0 setup or monthly fee reported for Nigerian gateways (Paystack's own terms not fetched); needs CAC documents | S | Phase 0 (pre-orders) |
| Termii sender-ID registration | Wallet top-up only; amount TBD | S | Phase 0 start (whitelisting takes weeks) |
| Transfer Impact Assessment, DPO, consent architecture | TBD (counsel); NDPA ss.41 to 43, GAID 2025 | — | Phase 0 |
| Phase 0 research: 300-respondent survey, 50 CV rebuilds, 300 to 500 scam labels, 200 match pairs | Under $2 of Sonnet tokens; survey incentives TBD (TOOLING.md, Adoption plan) | F/E | Months 0 to 2 |

The known naira lines (CAC twice, NDPC OHL, Labour Act licence) sum to about **₦57,000**; with
the three placeholders the launch budget is roughly **₦420,000 to 980,000** before counsel's
fees, the largest unknown. The app-store and Expo lines are Phase 3 spend.

## 3. Monthly run-rate by phase

Formula for every line: unit price × volume at the phase's scale, ranges carried from the
source. Phase 0 is the hand-run pilot (TOOLING.md, Adoption plan); Phase 1 is shown at its exit
scale of about 10,000 registered users (3,000 MAU) and begins nearer $450 to 700 a month
(TOOLING.md, Wave table); Phase 2 at about 100,000 (30,000 MAU).

| Line | Phase 0: pilot, ≤300 users | Phase 1: MVP, ~10,000 users | Phase 2: growth, ~100,000 users | Tag; source |
|---|---|---|---|---|
| Developer tooling (2 × Claude Max 5x at $100) | $200 | $200 | $200 | F; TOOLING.md |
| Hosting: web + API (Vercel Pro + Fly.io behind Cloudflare free) | $0 to 20 (Vercel Hobby, one small Fly machine) | $60 to 150 | $80 to 135; $30 to 85 once on Workers + Fly | S/E; PLAN.md; INFRASTRUCTURE.md |
| Database and auth (Supabase) | $0 (Free) | $75 to 110 (Pro + compute) | $175 to 400 (Pro, compute, PITR $100; Auth inside the 100,000 MAU included) | F/S; PLAN.md; INFRASTRUCTURE.md |
| Background jobs (pg_cron + pgmq, then Inngest) | $0 | $0 to 20 | $20 to 50 | S; ADR-0006 |
| Email (Resend Free → Pro → Scale, or SES) | $0 (3,000 free) | $20 to 90 (~59,000 emails) | $135 to 530 (Resend ~$530 at 590,000 emails; SES ~$115 plus Resend $20 fallback) | S; INFRASTRUCTURE.md (Email) |
| AI (MAU × $0.03 to 0.11, §4 formula) | $10 to 30 | $90 to 330 | $900 to 3,300 | F prices, E volumes |
| Job-data API (JSearch, SerpApi, TheirStack) | $0 to 30 | $130 to 300 | $500 to 1,500 | S; PLAN.md cost table |
| SMS OTP (MAU × 0.3 to 1.0 × ₦7) | ~$2 (₦2,100) | $5 to 15 (₦6,300 to 21,000) | $45 to 150 (₦63,000 to 210,000) | S; INFRASTRUCTURE.md |
| WhatsApp, Pro only (Pro users × ~₦350; 20% of payers on Pro is this document's assumption) | $0 | ~$15 (60 Pro users) | ~$150 (600 Pro users) | S/E; PLAN.md (Pricing) |
| Observability (Sentry, PostHog, Better Stack) | $0 | $0 to 26 | $50 to 300 | S/E; application_stack.md |
| Payment fees (Paystack) | 1.5% of revenue | 1.5% | 1.5%; 3.5% on the ₦4,999 Pro charge | S; PLAN.md (Pricing) |
| **Total before payment fees** | **$210 to 300 (₦295,000 to 420,000)** | **$600 to 1,250 (₦840,000 to 1.75 million)** | **$2,250 to 6,700 (₦3.2 to 9.4 million)** | |

Cross-checks: TOOLING.md puts Phase 0 at $270 to 330 (with a Termii top-up) and 10,000 users at
$900 to 1,350 (with Crisp and Inngest); BRD §14.3 puts 100,000 users at $3,500 to 6,000 on the
cheap-model path. This table lands inside or just below those bands because its AI line assumes
the Batch API and the free-tier throttle (§5).

## 4. Monthly cost at scale by registered-user tier

Infrastructure lines are Stack 3 from INFRASTRUCTURE.md's consolidated table and layer sections,
which exclude Claude tokens, job data, WhatsApp and staff; this table adds AI, SMS OTP, job data
and an observability estimate. Hosting below 1,000,000 users is Vercel + Fly, then Workers + Fly.

**AI formula (E from F prices; ai_capabilities.md §2 and §7):** one batched Haiku 5.5 rerank of
30 jobs per active user per week costs $0.0018 ($0.0036 standard), about $0.008 to 0.016 per MAU
per month; one Sonnet 5.5 CV generation at 3,000 input and 2,500 output tokens costs about
$0.031. A throttled free active user (weekly Haiku digest, one onboarding draft) costs $0.01 to
0.03 a month and a Core payer with five tailorings $0.17 to 0.20; at 3% conversion payers are 10%
of MAU, so the blend is **$0.03 per MAU with Batch and the throttle, up to $0.11 at standard
pricing with three Sonnet generations per active user** (PLAN.md's assumption). Scam triage
(9,000 listings a month at $0.0002) and embeddings are under $10 at every tier and folded in.

| Line (USD per month) | 1,000 (300 MAU) | 100,000 (30,000 MAU) | 1,000,000 (300,000 MAU) | 10,000,000 (3M MAU) | 50,000,000 (15M MAU) | Tag |
|---|---|---|---|---|---|---|
| Web + API hosting: Vercel + Fly, then Workers + zone plan + Fly job runner ($50–1,500, E) | 25 to 60 | 30 to 135 | 155 to 215 (Workers $85–90, Pro zone $20–25) | 900 to 1,200 (Workers ~$700) | 4,350 to 5,400 (Workers ~$3,650, Business zone) | F/S/E |
| Supabase Postgres, Storage, PITR | 25 | 175 | 387 | 2,497 | 8,760 | F |
| Supabase Auth: (MAU − 100,000) × $0.00325 | 0 | 0 | 650 | 9,425 | 48,425 | F |
| Email: Resend, then SES with VDM and Managed Dedicated IPs, 5.9 emails per registered user | 20 | 135 to 530 | ~1,490 | ~11,825 | ~46,000 | S |
| Job-data feeds (plateau; the corpus does not scale with users) | 30 to 60 | 500 to 1,500 | 1,500 to 3,000 | ~3,000 or partner feed (TBD) | ~3,000 or partner feed (TBD) | S/E |
| AI (MAU × $0.03 to 0.11) | 9 to 33 | 900 to 3,300 | 9,000 to 33,000 | 90,000 to 330,000 | 450,000 to 1,650,000 | E |
| SMS OTP (MAU × 0.3–1.0 × ₦7 ÷ 1,400) | 0.5 to 1.5 | 45 to 150 | 450 to 1,500 | 4,500 to 15,000 | 22,500 to 75,000 | S |
| Observability (events ≈ 87 per MAU per month, 10% sampled above 1M users) | 0 to 26 | 50 to 300 | 300 to 700 | 1,500 to 5,000 | 5,000 to 20,000 | E |
| **Infrastructure only (INFRASTRUCTURE.md Stack 3)** | **~50** | **~330** | **~2,600** | **~24,400** | **~107,000** | F/S |
| **All lines, before $200 tooling and payment fees** | **110 to 225** | **1,850 to 6,150** | **13,900 to 41,000** | **124,000 to 378,000** | **588,000 to 1,857,000** | |
| Per MAU per month | $0.37 to 0.75 | $0.06 to 0.21 | $0.05 to 0.14 | $0.04 to 0.13 | $0.04 to 0.12 | |
| Per registered user per month | $0.11 to 0.23 | $0.02 to 0.06 | $0.014 to 0.041 | $0.012 to 0.038 | $0.012 to 0.037 | |

Three readings. Claude tokens, which INFRASTRUCTURE.md excluded, are the largest line from about
100,000 users and three to fourteen times the whole infrastructure bill at 10 million, so the
free-tier throttle and the Batch API outweigh every hosting decision. Supabase Auth plus SMS OTP
exceed hosting and email from 1 million users, which is why INFRASTRUCTURE.md calls long
sessions and OTP fallbacks "worth more than any database decision". And the realism caveat:
INFRASTRUCTURE.md (Two million in two years) treats 10 million as the design ceiling the
architecture must not preclude and 50 million as a planning band with no Nigerian precedent
outside fintech wallets; Jobberman has 2.5 to 2.6 million registered after sixteen years, so
1.5 to 2.5 million in two years is the honest target and the 1 million column is the one to
budget against.

## 5. Unit economics

**Price mechanics (PLAN.md, Pricing; monetization_payments_compliance.md KQ3, S).** Paystack
charges 1.5% + ₦100 on local cards, capped at ₦2,000, with the ₦100 waived under ₦2,500: the
₦1,999 Core charge costs ₦30 (1.5%), the ₦4,999 Pro charge ₦175 (3.5%), and the ₦2,500 to 4,000
band is avoided. VAT is 7.5% under the Nigeria Tax Act 2025 with businesses at or below ₦100
million turnover exempt from registering, so prices are VAT-inclusive from day one and the
platform keeps the full ₦1,999 until turnover crosses about ₦8.3 million a month; after that
net revenue per Core charge is ₦1,999 ÷ 1.075 = **₦1,859.5** (PLAN.md, Compliance table).

**Variable cost per paying Core user per month (E, from §4 unit prices):**

| Component | Formula | Naira |
|---|---|---|
| AI: digest plus 5 Sonnet tailorings and cover letters | $0.008–0.016 + 5 × $0.031 | ₦235 to 280 |
| Email: 15 emails | 15 × $0.0001 (SES) to $0.0009 (Resend) | ₦2 to 19 |
| Auth MAU (only above 100,000 MAU) | $0.00325 | ₦0 to 4.6 |
| SMS OTP | 0.3 to 1.0 × ₦7 | ₦2 to 7 |
| Hosting and database share | $0.001 to 0.007 | ₦1 to 10 |
| Paystack fee | 1.5% of ₦1,999 | ₦30 |
| **Total variable cost per payer** | | **₦270 to 350** |

That sits under BRD BO-08's ₦400 ceiling per active user. Gross margin per Core payer is
**₦1,650 to 1,730 (83 to 86%)** before VAT registration and **₦1,510 to 1,590 (76 to 80%)**
after it. A Pro payer at ₦4,999 carries ₦175 of Paystack fee, unlimited tailoring and about ₦350
of WhatsApp (PLAN.md, Pricing): variable cost roughly ₦800 to 1,000, margin about 80%.

**Free-tier cost per user.** A throttled free active user (weekly Haiku digest of 5 jobs, one
onboarding draft, email, OTP) costs $0.01 to 0.04 a month, **₦14 to 56 per free MAU** or ₦4 to
17 per registered free user. At 3% conversion each payer carries about 32 free users (PLAN.md,
Architecture), ₦130 to 550 a month, which the ₦1,650 margin absorbs; unthrottled (three Sonnet
generations each) the same 32 users cost ₦4,000 and Core loses money. That is the arithmetic
behind the throttle rule.

**Paying users needed to cover each tier's monthly bill.** Payers needed = (§4 all-lines bill
plus $200 tooling, in naira) ÷ ₦1,969 (Core price net of the ₦30 fee; the bill already holds
every variable cost). Registered needed = payers ÷ conversion.

| Tier (registered) | Monthly bill incl. tooling | Core payers needed | Registered needed at 3% | Registered needed at 5% | Covers itself? |
|---|---|---|---|---|---|
| 1,000 | ₦434,000 to 595,000 | 220 to 300 | 7,300 to 10,100 | 4,400 to 6,000 | No: 30 payers at 3% |
| 100,000 | ₦2.9 to 8.9 million | 1,460 to 4,520 | 48,600 to 150,500 | 29,200 to 90,300 | Yes at 3% on the low AI case; yes at 5% on both |
| 1,000,000 | ₦19.7 to 57.7 million | 10,000 to 29,300 | 334,000 to 977,000 | 200,000 to 586,000 | Yes on both |
| 10,000,000 | ₦174 to 530 million | 88,300 to 269,000 | 2.9 to 9.0 million | 1.8 to 5.4 million | Yes at 3% on the low case; marginal at 3% on the high case |
| 50,000,000 | ₦823 million to 2.6 billion | 418,000 to 1.32 million | 13.9 to 44 million | 8.4 to 26.4 million | Yes at 3% on the low case; marginal on the high case |

Per active user: revenue at 3% conversion is 10% of MAU × ₦1,969 = **₦197 per MAU** ($0.14)
against $0.04 to 0.13 of cost at scale, leaving ₦140 per MAU in the low AI case and ₦15 in the
high. Conversion and the AI throttle are the levers; hosting moves this by a few naira per MAU.

## 6. Break-even scenarios

Monthly margin = payers × blended ARPU × 0.985 (Paystack) − monthly bill including $200 tooling,
at ₦1,400 per dollar. Blended ARPU ₦2,500 follows BRD §14.2; Core-only ₦1,999 is shown for the
pilot and one 10,000-user row. VAT is deducted (÷ 1.075) above ₦8.3 million of monthly revenue.

| Scenario | Registered | Conversion | Blended ARPU | Monthly revenue (net of 1.5%) | Monthly bill | Monthly margin |
|---|---|---|---|---|---|---|
| Phase 0 pilot (exit criterion: 10% of waitlist pre-pays the pass) | 300 | 10% one-off | ₦1,999 pass | ₦59,000 once | ₦295,000 to 462,000 | −₦240,000 to −₦400,000; validation spend |
| Phase 1 start | 1,000 | 3% | ₦2,500 | ₦74,000 | ₦434,000 to 595,000 | −₦360,000 to −₦520,000 |
| Phase 1 exit | 10,000 | 3% | ₦1,999 | ₦591,000 | ₦840,000 to 1.75 million | −₦250,000 to −₦1.16 million |
| Phase 1 exit, target | 10,000 | 5% | ₦2,500 | ₦1.23 million | ₦840,000 to 1.75 million | +₦390,000 to −₦520,000 |
| Phase 2 exit (BRD §14.2 scenario) | 100,000 | 3% | ₦2,500 | ₦7.39 million | ₦2.9 to 8.9 million | +₦4.5 million to −₦1.5 million |
| Phase 2 exit, target | 100,000 | 5% | ₦2,500 | ₦12.3 million (₦11.5 million after VAT) | ₦2.9 to 8.9 million | +₦2.6 to 8.6 million after VAT |
| Planning horizon | 1,000,000 | 3% | ₦2,500 | ₦73.9 million (₦68.7 million after VAT) | ₦19.7 to 57.7 million | +₦11 to 49 million after VAT |
| Planning horizon, target | 1,000,000 | 5% | ₦2,500 | ₦123 million (₦115 million after VAT) | ₦19.7 to 57.7 million | +₦57 to 95 million after VAT |

Subscriptions first cover the platform bill between 50,000 and 150,000 registered users depending
on the AI case, which is why BRD §14.4 makes employer, affiliate and institutional revenue
structural and why the first eighteen months are roughly ₦5 to 15 million of platform spend
before acquisition. Monthly churn of 5 to 10%, 20 to 40% of it from failed payments (PLAN.md,
Pricing), means every payer count above must be refilled monthly.

## 7. Cost controls and triggers

**Switch points (INFRASTRUCTURE.md, Recommendation per layer; ADR-0005; ADR-0008):**

| Trigger | Action |
|---|---|
| Vercel bill crosses $150 a month (ADR-0008), interpolated at roughly 200,000 to 300,000 registered users, or the first viral spike; `admin` already runs on a Workers preview as the pilot | Both Next.js apps to Workers with Static Assets; API hot paths to Workers via Hyperdrive; Node job runner stays on Fly.io (Hetzner remains the fallback) |
| 100,000 registered users (~590,000 emails a month) | Open SES in eu-west-2 or af-south-1 and warm Managed Dedicated IPs; digest fully on SES before 500,000 users (Resend Enterprise starts at 3 million emails) |
| 100,000 MAU (~333,000 registered): the Supabase Auth meter starts | Open the Supabase Enterprise MAU conversation; decide in a new ADR at 1 million registered ($650 a month); evaluate self-hosted Better Auth at the 10-million planning stage; never add Clerk on top |
| SMS OTP above ₦100,000 a month (about 100,000 users at the high OTP rate) | Longer sessions, passkeys and Google sign-in first; OTP to WhatsApp or email before SMS |
| Haiku refusal retries on Sonnet above 1% of digest users (ADR-0003), from the per-task cost log in `api/src/ai.ts` | Fix the prompt before the digest silently becomes Sonnet-priced |

**Spend caps and alerts to configure in Phase 1:**

| Where | Setting |
|---|---|
| Anthropic Console | Separate API-billed workspace for product traffic with a monthly spend limit, so the Max seats and the product never share a budget (TOOLING.md, Adoption plan); alerts at 50% and 80% |
| Supabase | Pro spend cap on until PITR is added; then compute and MAU overage alerts |
| Vercel | Spend Management alert at $100; no hard pause in production, since a pause serves a 503 to users paying ₦431 to 800 per GB (INFRASTRUCTURE.md, Hosting) |
| Cloudflare | Workers Logs sampled at 10% from day one (unsampled adds ~$1,400 a month at 10 million); billing notifications on Workers and Browser Rendering |
| Resend, SES | Plan ceilings act as caps; raise the 10 requests per second limit before 100,000 users; AWS Budgets on SES once opened |
| Termii | Prepaid wallet is the cap; low-balance and daily-OTP-count alerts |
| PostHog, Sentry | Per-product billing limits at the free-tier boundary until Phase 2 |
| `api` code | Per-user AI quotas (free throttle, 5 tailorings on Core) and a daily token-spend metric per model |

**The three biggest cost risks:**

1. **FX.** Costs are in dollars, revenue in naira. At ₦1,400 the Core price is $1.43; at ₦1,800
   it is $1.11 and the per-MAU margin in §5 shrinks by a quarter. Check FX quarterly, prices
   annually (PLAN.md).
2. **AI per active user.** The only line that scales faster than infrastructure, and it swings
   four-fold between the throttled Batch path and PLAN.md's three-generation assumption. Token
   counts are unmeasured (TOOLING.md); instrument them in Phase 1.
3. **Identity and OTP.** Supabase Auth is 45% of the infrastructure bill at 50 million users and
   SMS OTP in naira rivals the whole cloud bill from 1 million. Only product decisions (long
   sessions, passkeys, fallbacks) mitigate it.

A fourth, bounded risk is WhatsApp: a weekly marketing template at about ₦84 per message costs
₦340 to 370 per user per month and erases the Core margin if bundled (PLAN.md, Pricing); it stays
in Pro (BRD §5.2).

## 8. What is unverified

| Item | Affects | Page to check |
|---|---|---|
| Every non-Anthropic vendor price (Supabase compute tiers, Vercel Fluid and regional rates, Workers rates and 64 MiB bundle limit, Resend Scale tiers, SES Managed Dedicated IP bands, Sentry, PostHog) | §3 and §4 hosting, database, email | Each vendor's pricing page; INFRASTRUCTURE.md (What could not be verified) lists them |
| Vercel's billing of traffic behind Cloudflare's proxy | $60 versus $85 at 100,000 users; the $150 trigger | Vercel pricing docs; Vercel-only is the safe upper bound |
| Fly.io and Railway machine pricing | Node job runner line (estimated here) | fly.io/pricing; railway.com/pricing |
| Token counts per CV (3,000/2,500), job summary (600), digest (21,000) | The whole AI line | `messages.countTokens` on real Nigerian CVs in Phase 1 (TOOLING.md) |
| Paystack's own fee page and transfer, USSD and direct-debit lines; Flutterwave 1.4% + ₦100 versus 2.0% | ₦30 fee and the ₦2,500 cliff | paystack.com/pricing; flutterwave.com/ng/pricing |
| Meta's WhatsApp Nigeria rate card (vendors disagree 2x) | Pro-tier WhatsApp | developers.facebook.com/docs/whatsapp/pricing |
| Termii per-SMS price (₦5.62 to 7.00; dashboard-only) | SMS OTP line | Termii dashboard after sender-ID approval |
| NDPC thresholds (200 versus 1,000 and 5,000 subjects), 2025 fees, Schedule 7 CAR fees | Registration tier and recurring compliance cost | NDPC Guidance Notice and GAID 2025; data-protection counsel |
| Trademark fees, .ng and .africa domain prices, logo cost | Three §2 placeholders | iponigeria.com; a NiRA registrar; Namecheap |
| Labour Act licence applicability and state fee | Launch gate; ₦5,000 to 200,000 | labour.gov.ng/recruiters-licence; employment counsel |
| Expo EAS, Apple and Google fees as of Phase 3 | Mobile app line | expo.dev/pricing; developer.apple.com; play.google.com/console |
| VAT ₦100 million threshold and small-company CIT threshold | When net revenue per charge drops 7% | Nigeria Revenue Service guidance; counsel |
| Activity assumptions (30% MAU, 20 page views a week, 5.9 emails, 35 KB per user) | Every volume in §3 and §4 | Instrument from launch; Jobberman's 23% is the only anchor |
| Willingness to pay and the 3 to 5% conversion range | Every row in §5 and §6 | Phase 0 paid pilot (10% pre-pay gate) and the 300-respondent survey |

## Reading guide

- **PLAN.md** (Pricing; Run matching; Compliance table): why ₦1,999, the tier features, the
  original 1,000-to-100,000-user cost table and the one-time compliance fees.
- **BRD.md** §14 and §5.2: the reconciled cost envelope, the revenue scenario this document
  extends, and what is deliberately not built.
- **INFRASTRUCTURE.md**: the stack comparison, per-layer triggers, the five-tier table behind §4
  and the realism caveat on 10 and 50 million users.
- **TOOLING.md** (Adopt in four waves): developer tooling cost and the phase run-rate ladder.
- **research/tooling/ai_capabilities.md** §2 and §7: Claude prices and the per-user digest and
  CV generation cost model behind the AI line.
- **research/infrastructure/scale_economics_nigeria.md** Q5 and Q7: SMS and WhatsApp unit costs
  and a second sanity model at 20% MAU to compare with §4.
- **research/monetization_payments_compliance.md** KQ3 and KQ5: Paystack, VAT, NDPC, CAC and
  Labour Act detail behind §2 and §5.
- **ADR-0003, ADR-0005, ADR-0008**: the model-routing, email and hosting decisions whose revisit
  triggers appear in §7.
