# Revenue and cost model inputs (6 and 12 months)

*Compiled 25 October 2026 for the Build Your Value (Ladda) revenue model. Every figure carries a
source: a repository file, a URL opened in this session, or "assumption". Search-snippet or
memory figures are marked [unverified]. Ranges are low / base / high. Fetch log: the Anthropic
pricing page opened; support.paystack.com and cbn.gov.ng did not resolve through the proxy, so
§5 and §9 fall back to repository figures.*

## 1. Anthropic API prices

Source: `claude-api` skill, model table cached 2026-10-06, confirmed against the live pricing page
(https://platform.claude.com/docs/en/about-claude/pricing.md, opened 25 October 2026). All USD per
million tokens (MTok). Model routing per `docs/adr/0003-route-claude-calls-by-model-tier.md`.

| Input | claude-sonnet-5-5 (write tier) | claude-haiku-5-5 (bulk tier, prompt ≤100K) | Note |
|---|---|---|---|
| Base input | 2.00 | 0.10 | Haiku prompts over 100K tokens pay 0.50 / 2.50; ADR-0003 keeps bulk prompts under 100K |
| Output | 10.00 | 0.50 | |
| Cache write, 5-minute | 2.50 | 0.125 | 1.25x base |
| Cache write, 1-hour | 4.00 | 0.20 | 2x base |
| Cache read | 0.10 | 0.01 | Live page: 0.05x on Sonnet 5.5, 0.1x on Haiku. The skill's migration note says 0.20 for Sonnet 5.5; the live table governs |
| Batch input | 1.00 | 0.05 | "50 percent discount on both input and output tokens"; stacks with caching |
| Batch output | 5.00 | 0.25 | Results within 24 hours; fits nightly or weekly digests |
| Opus 5.5 (evals only) | 4.00 / 20.00 | n/a | Never on product traffic (ADR-0003) |

Haiku 5.5 refusals retry once on the write model (`api/src/ai.ts`), so a refused digest is
Sonnet-priced ($0.072 standard).

## 2. Token budgets per product event

Assumptions grounded in `api/src/ai.ts` (`max_tokens` 16,000 write, 4,000 bulk, 300 intake),
`docs/research/tooling/ai_capabilities.md` §1, §6, §7 and `docs/COST_ANALYSIS.md` §4. None is
measured; ADR-0003 calls for `messages.countTokens` on real Nigerian CVs and listings in Phase 1.

| Event | Model | Input tokens (low / base / high) | Output tokens | Cost per event, base (low–high) | Source and note |
|---|---|---|---|---|---|
| CV parse and rewrite | Sonnet, standard | 3,000 / 5,000 / 8,000 | 2,000 / 2,500 / 4,000 | $0.035 ($0.026–0.056) | ai_capabilities §1: 2-page CV is 5–8K tokens with page images; PLAN.md uses 3,000 / 2,500 |
| CV tailoring to one job | Sonnet, standard | 3,000 / 4,000 / 6,000 | 1,500 / 2,500 / 3,000 | $0.033 ($0.021–0.042) | COST_ANALYSIS §4 uses $0.031 per generation; profile JSON plus a 600-token job plus rubric |
| Cover letter | Sonnet, standard | 2,500 / 3,500 / 5,000 | 500 / 800 / 1,200 | $0.015 ($0.010–0.022) | assumption; shares the tailoring prompt prefix, so caching cuts input further |
| Mock interview session (text, about 8 turns) | Sonnet, standard | 15,000 / 30,000 / 60,000 cumulative | 2,000 / 4,000 / 6,000 | $0.10 ($0.05–0.18) | assumption; history re-sent each turn. Voice adds STT at about $0.004 per minute (ai_capabilities §5, [unverified]) |
| Digest rerank, 30 jobs, one user | Haiku, batch | 18,000 / 21,000 / 25,000 | 2,000 / 3,000 / 4,500 | $0.0018 ($0.0014–0.0024) | ai_capabilities §7: 30 × 600-token job summaries + 1,500 profile + 1,500 rubric; $0.0036 at standard price |
| Free digest rerank, 5 jobs | Haiku, batch | 6,000 | 600 | $0.00045 | derived from the row above; BRD §14.1 gives Free users 5 jobs weekly |
| Scam triage per listing | Haiku, batch | 1,000 / 1,500 / 2,500 | 100 / 150 / 300 | $0.0001 ($0.00007–0.0002) | ai_capabilities §6: about $0.0002 standard, half in batch; runs on the corpus, not per user |
| Intake question phrasing | Haiku, standard | 300 / 400 / 600 | 40 / 60 / 120 | $0.00007; about $0.0007 per onboarding of 10 questions | `api/src/ai.ts` `phraseIntakeQuestion`, `max_tokens: 300`; interactive, so no batch |
| Embedding per listing | voyage-4-lite | 600 | n/a | $0.000012 | $0.02 per MTok, 200M free tokens (ADR-0007, [unverified] snippet); embedded once per content hash |
| Embedding per profile summary | voyage-4-lite | 300 / 500 / 800 | n/a | $0.00001 | ADR-0007; re-embedded on profile change only |

Corpus-level triage and embedding of 9,000 listings a month is under $10 (`docs/COST_ANALYSIS.md` §4).

## 3. Usage frequencies per user per month by tier

Tier definitions from `docs/BRD.md` §14.1 as updated by `docs/adr/0017-...md` (Remote at ₦4,999
replaces Pro). Frequencies are assumptions; the cap on Core tailorings is a product rule.

| Input | Free | ₦1,999 pass (7 days, one-off) | Core ₦1,999 | Remote ₦4,999 | Source and note |
|---|---|---|---|---|---|
| Digests per month | 4.3 (weekly, 5 jobs) | 7 (daily for 7 days, 30 jobs) | 13 (3x weekly, 30 jobs) | 13 email + 4.3 WhatsApp digest | BRD §14.1; COST_ANALYSIS §1 uses 13 per month |
| Reranks per month | 4.3 | 7 | 13 | 17 (13 plus priority re-match, assumption) | PLAN.md Pricing table |
| Tailorings used | 0 | 3 / 5 / 10 in the week | 2 / 3.5 / 5 (cap 5) | 5 / 8 / 15 (unlimited) | assumption; COST_ANALYSIS §5 assumes all 5 used on Core |
| Cover letters | 0 | 0 / 1 / 2 | 1 / 2 / 4 | 2 / 4 / 8 | assumption |
| Mock interviews | 0 | 0 | 0 | 0.5 / 1 / 3 | Remote only (BRD §14.1) |
| Onboarding CV draft | 1 one-off (Sonnet) | included | included | included | PLAN.md Free row: "CV draft"; the one Sonnet call every sign-up triggers |
| Intake phrasing calls | 10 one-off | — | — | — | `api/src/ai.ts` |
| WhatsApp marketing messages | 0 | 0 | 0 | 4.3 at about ₦84 (≈₦350 a month) | PLAN.md Architecture; [unverified] press figure |
| Emails per registered user | 5.9 a month blended (13 digests per active user + 2 transactional) | | | | COST_ANALYSIS §1; INFRASTRUCTURE.md |
| OTP SMS per active user | 0.3 / 0.6 / 1.0 | | | | INFRASTRUCTURE.md assumptions table |

Resulting AI cost per active user per month (base, low–high), from §1 and §2:

| Tier | AI cost, USD | AI cost, ₦ at 1,400 | Composition of base |
|---|---|---|---|
| Free | 0.010 (0.005–0.030) | 14 (7–42) | 4.3 free reranks plus the onboarding draft amortised over six months; high case is a 30-job digest at standard price |
| Pass (one-off, per purchase) | 0.19 (0.10–0.45) | 266 | 7 reranks, 5 tailorings, 1 cover letter |
| Core | 0.17 (0.07–0.35) | 238 (98–490) | 13 batched reranks $0.023, 3.5 tailorings $0.116, 2 cover letters $0.030; matches COST_ANALYSIS §5's $0.17–0.20 |
| Remote | 0.46 (0.17–1.41) | 644 (238–1,974) | 17 reranks, 8 tailorings, 4 cover letters, 1 mock interview; WhatsApp (about ₦350) is a separate line |

Unthrottled free users (three Sonnet generations each) would cost about ₦4,000 per payer at 3%
conversion (`docs/COST_ANALYSIS.md` §5), which is why the Free row above is throttled.

## 4. Conversion and retention benchmarks

| Input | Low / base / high | Unit | Source | Note |
|---|---|---|---|---|
| Free-to-paid, consumer apps | under 2% / 2% / 4% | % of registered | PLAN.md Pricing (RevenueCat) [unverified snippet] | "Most consumer apps under 2%, top performers about 4%" |
| Free-to-paid, SaaS average and edtech | 2.6% (edtech) / 3.7% (SaaS) | % | PLAN.md Pricing; monetization research KQ3 (Userpilot, First Page Sage) [unverified] | Edtech is the closest analogue |
| Time-boxed trial conversion (the pass) | 14–25% | % of trial starters | PLAN.md Pricing (Mewayz) [unverified] | Supports leading with the ₦1,999 pass |
| Pass-to-subscription upgrade | 20% / 30% / 40% | % of pass buyers | assumption | PLAN.md lists it as a metric to track; no benchmark found |
| Phase 0 gate | 10% of waitlist pre-pays the pass | % | BRD BO-01; PLAN.md Phases | Exit criterion for the pilot |
| Phase gates, conversion | 2% at Phase 1 exit, 4%+ at Phase 2 exit | % of registered | PLAN.md Phases table; BRD §18 | The model should hit these, not the benchmarks |
| Phase gates, churn | under 10% at Phase 1 exit, under 7% at Phase 2 exit | % of payers per month | PLAN.md Phases table; BRD §18 | |
| Monthly churn, consumer subscriptions | 5% / 7.5% / 10% | % | PLAN.md Pricing (MEAN CEO) [unverified] | gtm_and_naming.md says treat global figures as ceilings in Nigeria |
| Share of churn that is involuntary | 20% / 30% / 40% | % of churn | PLAN.md Pricing [unverified] | |
| Activation | 60%+ of sign-ups complete a CV and alert in session one; OTP loss under 15% | % | BRD BO-03 | Payers convert from activated users, not raw sign-ups |
| Monthly active share | 30% / 45% / 60% of registered | % | COST_ANALYSIS §1 (30%; Jobberman measures 23%); PLAN.md cost table (60% weekly active) | Costs lean on the high case, revenue on the low |
| Nigerian specifics | uLesson halved prices in 2024; ALX at $5 a month | — | monetization research KQ1 | No Nigeria-specific conversion or churn benchmark exists |

## 5. Payment costs

| Input | Value | Unit | Source | Note |
|---|---|---|---|---|
| Paystack local card fee | 1.5% + ₦100, ₦100 waived under ₦2,500, capped at ₦2,000 | per charge | PLAN.md Pricing; monetization research KQ2 [unverified: paystack.com not fetched this session or in the research] | |
| Fee on ₦1,999 (Core, pass) | ₦30 (1.5%) | ₦ | derived | |
| Fee on ₦4,999 (Remote) | ₦175 (3.5%) | ₦ | PLAN.md Pricing | ₦2,500–4,000 band avoided |
| Fee on ₦12,999 (Remote quarter) | ₦295 (2.3%) | ₦ | derived from the rule | Direct debit only sensible above ₦5,000 (Lendsqr, [unverified]) |
| Payout transfer fee | ₦10 (≤₦5,000), tiered ₦10/25/50 | per transfer | monetization research KQ2 [unverified] | Negligible if settled weekly |
| Settlement timing | about one business day; new accounts up to 48 hours | days | monetization research KQ2 [unverified] | Working-capital input only |
| Failed renewal rate, cards | 8% / 11% / 14% | % per cycle | PLAN.md Pricing; monetization research KQ2 (Kolonell, vendor estimate) [unverified] | Mobile money about 22%; manual retry 20–35% |
| Dunning recovery | 20% / 30% / 38% of failed charges | % | monetization research KQ2 [unverified] | 3–5 retries over 7–10 days with reminders |
| VAT | 7.5%, prices VAT-inclusive | % | PLAN.md Compliance table; BRD §14.1 | Exempt while turnover ≤ ₦100 million a year (about ₦8.3 million a month); then ₦1,999 nets ₦1,859.5 (COST_ANALYSIS §5) |
| App-store billing | not used (15%) | % | PLAN.md Pricing | Web checkout only |

## 6. Fixed and infrastructure costs by month

Sources: `docs/COST_ANALYSIS.md` §2–§4, `docs/INFRASTRUCTURE.md`, `docs/research/technical_architecture.md`
KQ4 and KQ6. Every non-Anthropic vendor price is a search snippet ([unverified]). USD at ₦1,400.

| Line | Unit price | Months 0–2 (Phase 0, ≤300 users) | Months 3–5 (Phase 1, to ~10,000) | Months 6–12 (Phase 2, to ~100,000) | Note |
|---|---|---|---|---|---|
| Developer tooling | 2 × Claude Max $100 | $200 | $200 | $200 | COST_ANALYSIS §3 (F) |
| Vercel | Pro $20 per seat plus usage | $0–20 (Hobby) | $40–60 | $60–150 | 2 seats; move to Workers when the bill passes $150 (ADR-0011) |
| Fly.io API machine | small machine, unpriced | $0–20 | $10–30 | $20–50 | INFRASTRUCTURE.md: "a fixed tens-of-dollars line"; assumption |
| Supabase | Pro $25 + compute $5–100; PITR $100 | $0 (Free) | $25–60 | $75–175 | 100,000 MAU included in Auth |
| Background jobs | pg_cron + pgmq free; Inngest $0–25 then $75–99 | $0 | $0–20 | $20–50 | ADR-0006 |
| Email, Resend | Free 3,000; Pro $20 for 50,000; Scale $90 for 100,000; overage about $0.90 per 1,000 | $0 | $20 | $20–90 | ADR-0005; 5.9 emails per registered user |
| Email, SES | $0.10 per 1,000 | — | — | option from 100,000 users | ADR-0012 |
| Termii SMS OTP | ₦7 per SMS (₦5.62–7.00) | about ₦2,100 | ₦6,300–21,000 | ₦63,000–210,000 | INFRASTRUCTURE.md; MAU × 0.3–1.0 |
| Job-data APIs | JSearch about $30 per 10,000 requests; SerpApi $50 per 5,000; TheirStack $59 per 1,500 credits to $1,500 per million | $0–30 | $30–130 | $130–500 | PLAN.md Architecture; plateaus with the corpus, not users |
| Embeddings | voyage-4-lite $0.02 per MTok | under $1 | $1–2 | $3–5 | ADR-0007 |
| WhatsApp (Remote tier only) | about ₦84 marketing, ₦14 utility per delivered message | $0 | $0 | Remote payers × about ₦350 | PLAN.md; [unverified] |
| Observability | Sentry, PostHog, Better Stack free tiers | $0 | $0–26 | $50–300 | COST_ANALYSIS §3 |
| Domains (.ng, .com.ng, .com, .africa) | placeholder ₦60,000–120,000 a year | year one | — | — | COST_ANALYSIS §2 placeholder, no source |
| NDPC registration (OHL) | ₦10,000 a year | before the 200th data subject | — | renewal | PLAN.md Compliance; higher tiers ₦100,000 / ₦250,000 |
| CAC | ₦10,000 + ₦1,000 reservation (company) and again for the trading name; agents ₦19,000–25,000 | Phase 0 | — | — | COST_ANALYSIS §2 |
| Trademark, three classes | placeholder ₦150,000–300,000 | Phase 0 | — | — | COST_ANALYSIS §2, no source |
| Logo and brand | placeholder ₦150,000–500,000 | Phase 0–1 | — | — | COST_ANALYSIS §2, no source |
| Labour Act licence | ₦5,000 state receipt if counsel advises; counsel fee TBD | before launch | — | — | PLAN.md Compliance |
| Paystack settlement | no setup or monthly fee reported | — | — | — | COST_ANALYSIS §2 [unverified] |
| Phase total before AI and fees | | $210–300 | $300–600 | $600–1,250 at 10,000 users; $1,850–6,150 at 100,000 | COST_ANALYSIS §3 |

## 7. Growth assumptions for a two-founder bootstrap

| Input | Low / base / high | Unit | Source | Note |
|---|---|---|---|---|
| Phase 0 pilot | 50 CVs rebuilt by hand; up to 300 users; 300-respondent survey | users | PLAN.md Phases; COST_ANALYSIS §3 | Months 0–2 |
| Waitlist at launch | 300 / 600 / 1,200 | sign-ups | assumption | Gate is 10% pre-paying the pass (BO-01) |
| Launch month | month 3 (Phase 1 starts month 2, MVP ships inside it) | — | PLAN.md Phases | |
| New sign-ups, month 1–2 | 50, 200 | per month | pilot and waitlist | |
| New sign-ups, months 3–6 | base 1,500, 2,000, 2,500, 3,000; low 0.5x; high 2x | per month | assumption | High case reaches about 12,500 registered by month 5, matching COST_ANALYSIS §3's Phase 1 exit of about 10,000 |
| New sign-ups, months 7–12 | base 4,000, 5,000, 6,000, 7,000, 8,000, 9,000; low 0.5x; high 2x | per month | assumption | Base cumulative about 48,000 at month 12; high about 96,000, near the plan's 100,000 Phase 2 exit; Jobberman adds about 330,000 a year (gtm_and_naming.md) |
| Meta CPM | about ₦2,100 ($1.50); range $0.80–2.20 | per 1,000 impressions | gtm_and_naming.md KQ1 (Grey, Stackmatix) [unverified] | |
| Meta CPC | ₦30–300 | per click | gtm_and_naming.md [unverified] | |
| Cost per install | under ₦1,000 plausible; model 500 / 750 / 1,000 | ₦ | gtm_and_naming.md inference | No Nigerian CPI figure found (Gaps) |
| Blended CAC per activated free user | ₦700–1,500 | ₦ | gtm_and_naming.md KQ6 target | Payback within three subscription months |
| Paid media budget | ₦0 / ₦300,000 / ₦1,000,000 | per month from month 3 | assumption | 0 / 400 / 1,300 installs a month at base CPI; the rest is organic and referral |
| Referral | 0.15 / 0.25 / 0.40 referred activations per activated user | ratio | assumption | Reward is a Core month or an extra tailoring once the referred user completes a CV (BR-050); cost is §3 Core AI cost plus forgone revenue |
| Campus ambassadors | about 20 awards of ₦100,000 a year | ₦ | BRD BR-051 | Phase 2 |
| NYSC timing | sign-up uplift of 1.5x / 2x / 3x in mobilisation months | multiplier | PLAN.md Launch; BRD BR-052 | assumption on the multiplier |
| Share of payers choosing Remote | 10% / 15% / 25% | % of payers | assumption | 7% of fresh remote listings are open to Nigeria, mostly engineering (remote_eligibility_audit.md); COST_ANALYSIS assumed 20% on Pro |
| Blended monthly ARPU | ₦2,299 / ₦2,449 / ₦2,749 | ₦ per payer | derived from the Remote share | BRD §14.2 uses ₦2,500; the quarterly ₦12,999 is ₦4,333 a month |
| Pass buyers | 1 / 2 / 3 pass purchases per 100 new activated users per month | % | assumption | One-off ₦1,999 each; 20–40% upgrade (§4) |

## 8. Other revenue

| Input | Low / base / high | Unit | Source | Note |
|---|---|---|---|---|
| Employer featured role or 10-candidate shortlist | ₦15,000 / ₦20,000 / ₦30,000 | ₦ per role | BRD §14.1; PLAN.md Pricing | Jobberman Standard listing is ₦100,000 incl. VAT (monetization research KQ3) |
| Paying employers | 0 before month 5; 2 / 5 / 10 roles a month in months 5–8; 5 / 10 / 20 in months 9–12 | roles per month | BRD §14.2 target of 20 paying employers by Phase 2 exit; ramp is an assumption | Requires the verified-employer badge (Phase 2) |
| Coursera affiliate rate | 45% on Specializations and Professional Certificates; about 20% courses; 10% Coursera Plus; 30-day cookie | % of sale | PLAN.md Pricing (Impact); monetization research KQ3 [unverified] | Nigeria-localised Coursera Plus $24 a month (upskilling research) |
| Udemy affiliate rate | 10% base, up to about 15%; 7-day cookie; mobile-app sales excluded | % of sale | PLAN.md Pricing; monetization research KQ3 [unverified] | Sale prices $10–15 give $1–2 per sale |
| Affiliate commission per converting user | $1 / $5 / $22 | USD | assumption | High case is 45% of one month of a $49 certificate subscription; price itself unverified |
| Affiliate take-up | 0.1% / 0.2% / 0.3% of MAU per month generate a commission | % | assumption | Free sources are recommended first, which caps paid take-up by design |
| Timing | employers and affiliates from month 5 (Phase 2 start); institutional from Phase 3 | — | PLAN.md Phases; BRD §14.2 | BRD targets: affiliate above 5% of revenue by Phase 2 exit, institutional above 25% by Phase 3 exit |

## 9. Exchange rate

| Input | Low / base / high | Unit | Source | Note |
|---|---|---|---|---|
| USD/NGN for cost conversion | ₦1,400 / ₦1,500 / ₦1,800 | ₦ per USD | PLAN.md Pricing and BRD §14.2 anchor ₦1,400 (October 2026); COST_ANALYSIS §7 stress case ₦1,800 | No repository document uses ₦1,380; INFRASTRUCTURE.md converts at about ₦1,470 and the monetization research at about ₦1,500 (2025, [unverified]). cbn.gov.ng not fetched; re-check quarterly |
