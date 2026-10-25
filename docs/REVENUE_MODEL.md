# Revenue model: the first six and twelve months

*25 October 2026. Every number below comes from `docs/model/revenue_model.mjs`, a deterministic
script whose inputs are listed with their sources in `docs/research/revenue_model_inputs.md`.
Re-run with `node docs/model/revenue_model.mjs`. Months count from the start of Phase 0; the MVP
launches in month 3; the founders take no salary. Naira throughout, dollar costs converted at
₦1,400 unless a row says otherwise.*

## The answer in four lines

- In six months the business does not make money in any scenario. Months 1 and 2 are the hand-run
  pilot and months 3 to 6 are launch, so the six-month result is a loss of about ₦4 million in the
  base case (₦2.5 million in the high case, ₦4.6 million in the low case). That loss is the cost of
  finding out whether people pay, and it is mostly fixed cost and paid media, not AI.
- In twelve months the base case reaches about 920 paying users and ₦11.6 million of net revenue,
  turns its first monthly profit in month 9, and still ends the year about ₦3.5 million down in cash.
  Drop paid media and it is within ₦0.5 million of break-even for the year; leave the founders'
  own Claude subscriptions off the company's books and it is within ₦0.1 million.
- The high case (twice the sign-ups, 4% conversion, 5% churn, a quarter of payers on Remote) makes
  about ₦28 million over the year on ₦55 million of revenue and is profitable from month 5. The low
  case (half the sign-ups, 2% conversion, 10% churn, a weak naira and heavy AI use) loses about
  ₦9.6 million and never breaks even inside the year.
- AI credits are not the problem. They are ₦3 a month for a free user, ₦236 for a Core payer and
  ₦636 for a Remote payer, about 25% of revenue in the base year and under 20% of total cost. The
  numbers that decide the outcome are sign-ups, conversion, and the roughly ₦650,000 to ₦1 million
  a month of fixed cost and media that a two-person company carries before it has payers.

## What the model does

Each month new sign-ups arrive (base: 50 and 200 in the pilot, then 1,500 rising to 9,000 by month
12, for about 48,000 registered users at year end). A share activates by finishing a CV (60% base).
Of the activated, 3% buy a subscription within the month (Core at ₦1,999 or Remote at ₦4,999, 15%
of them Remote), and a further 2 in 100 buy the one-off ₦1,999 pass, 30% of whom upgrade to Core
the month after. Subscribers churn at 7.5% a month. Active users are 45% of the older registered
base plus this month's activations; free active users receive the throttled weekly five-job digest.

Revenue is subscriptions plus the pass, plus employer featured roles from month 5 (5 a month at
₦20,000, then 10) and course-affiliate commissions (0.2% of active users at $5), less Paystack fees
(₦30 on ₦1,999, ₦175 on ₦4,999) and VAT once turnover crosses the ₦100 million a year threshold,
which no scenario reaches.

Cost is five lines. AI: every event priced from token budgets at Anthropic's list prices, Sonnet
5.5 for CV generation, tailoring, cover letters and mock interviews, Haiku 5.5 in batch for the
digest rerank and scam triage, Haiku standard for the intake questions, plus embeddings. Delivery:
email at Resend's blended rate, one OTP SMS per active user at ₦7 scaled by the scenario, and
₦350 of WhatsApp per Remote payer. Fixed: the two founders' Claude Max subscriptions ($200),
hosting on Vercel and Fly.io, Supabase, background jobs, Resend's plan, job-data APIs and
observability, each stepping up from Phase 1 to Phase 2 levels as the registered base grows toward
100,000. Paid media: ₦300,000 a month from launch in the base case, nothing in the low case and
₦1 million in the high case. One-offs: CAC, NDPC, domains, the trademark filing and a counsel
placeholder, about ₦550,000 across months 1 and 2.

## Results

### AI cost per active user per month (base token budgets and usage, ₦1,400 to the dollar)

| Tier | AI cost per month | What it buys |
|---|---|---|
| Free | ₦3 | 4.3 batched five-job digests |
| ₦1,999 pass (per purchase) | ₦270 | 7 daily 30-job digests, 5 tailorings, 1 cover letter |
| Core ₦1,999 | ₦236 | 13 digests, 3.5 tailorings, 2 cover letters |
| Remote ₦4,999 | ₦636 | 17 digests, 8 tailorings, 4 cover letters, 1 mock interview (WhatsApp ₦350 is separate) |
| Onboarding, once per activated user | ₦50 | CV parse and rewrite on Sonnet plus ten phrased intake questions |

### Three scenarios

| Scenario | 6-month revenue (net of fees) | 6-month AI spend | 6-month total cost | 6-month result | 12-month revenue (net) | 12-month AI spend | 12-month total cost | 12-month result | Payers at month 12 | Registered at month 12 | First profitable month | Cash low point |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Low | ₦333,508 | ₦362,933 | ₦4.9m | ₦-4.6m | ₦2.6m | ₦2.1m | ₦12.1m | ₦-9.6m | 218 | 24,125 | not within 12 | ₦-9.6m |
| Base | ₦1.4m | ₦454,638 | ₦5.4m | ₦-4.0m | ₦11.6m | ₦2.9m | ₦15.1m | ₦-3.5m | 921 | 48,250 | 9 | ₦-4.6m |
| High | ₦6.2m | ₦710,666 | ₦8.7m | ₦-2.5m | ₦54.6m | ₦4.6m | ₦26.7m | ₦27.9m | 3,046 | 96,500 | 5 | ₦-3.7m |

### Sensitivities on the base case

| Change | 12-month revenue (net) | 12-month total cost | 12-month result | First profitable month | Cash low point |
|---|---|---|---|---|---|
| Base, no paid media | ₦11.6m | ₦12.1m | ₦-480,257 | 8 | ₦-2.8m |
| Base, founders' Claude Max not charged to the company | ₦11.6m | ₦11.7m | ₦-120,257 | 8 | ₦-2.4m |
| Base at ₦1,800 to the dollar | ₦12.0m | ₦18.2m | ₦-6.2m | 11 | ₦-6.5m |
| Base with heavy AI use (high token budgets and usage) | ₦11.6m | ₦17.4m | ₦-5.8m | 12 | ₦-5.9m |
| Base with 4% conversion | ₦14.0m | ₦15.4m | ₦-1.5m | 9 | ₦-4.0m |
| Base with 2% conversion | ₦9.2m | ₦14.7m | ₦-5.5m | 12 | ₦-5.6m |
| Base with churn at 5% | ₦12.0m | ₦15.1m | ₦-3.1m | 9 | ₦-4.5m |
| Base with half the sign-ups | ₦6.4m | ₦12.5m | ₦-6.1m | not within 12 | ₦-6.1m |

### Low case by month

| Month | New sign-ups | Registered | Active | Pass buyers | Core | Remote | Gross revenue | Net revenue | AI | Delivery (email, SMS, WhatsApp) | Fixed | Paid media | One-off | Result | Cumulative cash | AI per active user |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 25 | 25 | 13 | 0 | 0 | 0 | ₦559 | ₦549 | ₦1,597 | ₦144 | ₦423,000 | ₦0 | ₦325,000 | ₦-749,192 | ₦-749,192 | ₦123 |
| 2 | 100 | 125 | 58 | 1 | 1 | 0 | ₦2,470 | ₦2,427 | ₦6,277 | ₦642 | ₦423,000 | ₦0 | ₦225,000 | ₦-652,492 | ₦-1.4m | ₦108 |
| 3 | 750 | 875 | 413 | 4 | 7 | 1 | ₦26,262 | ₦25,787 | ₦53,060 | ₦4,729 | ₦783,000 | ₦0 | ₦0 | ₦-815,002 | ₦-2.2m | ₦128 |
| 4 | 1,000 | 1,875 | 763 | 5 | 16 | 2 | ₦51,373 | ₦50,430 | ₦75,822 | ₦8,836 | ₦783,000 | ₦0 | ₦0 | ₦-817,228 | ₦-3.0m | ₦99 |
| 5 | 1,250 | 3,125 | 1,188 | 6 | 27 | 3 | ₦112,609 | ₦110,671 | ₦100,179 | ₦13,806 | ₦783,000 | ₦0 | ₦0 | ₦-786,314 | ₦-3.8m | ₦84 |
| 6 | 1,500 | 4,625 | 1,688 | 8 | 39 | 4 | ₦146,194 | ₦143,644 | ₦125,999 | ₦19,632 | ₦783,000 | ₦0 | ₦0 | ₦-784,987 | ₦-4.6m | ₦75 |
| 7 | 2,000 | 6,625 | 2,388 | 10 | 55 | 6 | ₦191,614 | ₦188,241 | ₦169,490 | ₦27,742 | ₦783,000 | ₦0 | ₦0 | ₦-791,992 | ₦-5.4m | ₦71 |
| 8 | 2,500 | 9,125 | 3,238 | 13 | 74 | 8 | ₦245,882 | ₦241,524 | ₦216,377 | ₦37,589 | ₦783,000 | ₦0 | ₦0 | ₦-795,442 | ₦-6.2m | ₦67 |
| 9 | 3,000 | 12,125 | 4,238 | 15 | 96 | 10 | ₦353,140 | ₦346,975 | ₦266,371 | ₦49,157 | ₦808,925 | ₦0 | ₦0 | ₦-777,478 | ₦-7.0m | ₦63 |
| 10 | 3,500 | 15,625 | 5,388 | 18 | 121 | 12 | ₦422,617 | ₦415,189 | ₦319,214 | ₦62,434 | ₦851,625 | ₦0 | ₦0 | ₦-818,084 | ₦-7.8m | ₦59 |
| 11 | 4,000 | 19,625 | 6,688 | 20 | 148 | 15 | ₦498,617 | ₦489,807 | ₦374,674 | ₦77,407 | ₦900,425 | ₦0 | ₦0 | ₦-862,699 | ₦-8.7m | ₦56 |
| 12 | 4,500 | 24,125 | 8,138 | 23 | 178 | 18 | ₦580,516 | ₦570,217 | ₦432,541 | ₦94,067 | ₦955,325 | ₦0 | ₦0 | ₦-911,716 | ₦-9.6m | ₦53 |

### Base case by month

| Month | New sign-ups | Registered | Active | Pass buyers | Core | Remote | Gross revenue | Net revenue | AI | Delivery (email, SMS, WhatsApp) | Fixed | Paid media | One-off | Result | Cumulative cash | AI per active user |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 50 | 50 | 30 | 1 | 0 | 0 | ₦2,301 | ₦2,260 | ₦1,873 | ₦237 | ₦329,000 | ₦0 | ₦325,000 | ₦-653,850 | ₦-653,850 | ₦62 |
| 2 | 200 | 250 | 143 | 2 | 2 | 0 | ₦10,585 | ₦10,393 | ₦7,719 | ₦1,136 | ₦329,000 | ₦0 | ₦225,000 | ₦-552,462 | ₦-1.2m | ₦54 |
| 3 | 1,500 | 1,750 | 1,013 | 18 | 26 | 4 | ₦108,898 | ₦106,828 | ₦62,840 | ₦8,824 | ₦609,000 | ₦300,000 | ₦0 | ₦-873,837 | ₦-2.1m | ₦62 |
| 4 | 2,000 | 3,750 | 1,988 | 24 | 60 | 9 | ₦214,382 | ₦210,221 | ₦93,259 | ₦17,657 | ₦609,000 | ₦300,000 | ₦0 | ₦-809,695 | ₦-2.9m | ₦47 |
| 5 | 2,500 | 6,250 | 3,188 | 30 | 101 | 15 | ₦483,125 | ₦474,998 | ₦126,513 | ₦28,449 | ₦609,000 | ₦300,000 | ₦0 | ₦-588,964 | ₦-3.5m | ₦40 |
| 6 | 3,000 | 9,250 | 4,613 | 36 | 148 | 22 | ₦644,417 | ₦633,475 | ₦162,435 | ₦41,170 | ₦609,000 | ₦300,000 | ₦0 | ₦-479,131 | ₦-4.0m | ₦35 |
| 7 | 4,000 | 13,250 | 6,563 | 48 | 209 | 32 | ₦863,032 | ₦848,307 | ₦220,923 | ₦58,431 | ₦639,839 | ₦300,000 | ₦0 | ₦-370,886 | ₦-4.3m | ₦34 |
| 8 | 5,000 | 18,250 | 8,963 | 60 | 284 | 43 | ₦1.1m | ₦1.1m | ₦285,259 | ₦79,639 | ₦687,283 | ₦300,000 | ₦0 | ₦-244,796 | ₦-4.6m | ₦32 |
| 9 | 6,000 | 24,250 | 11,813 | 72 | 373 | 56 | ₦1.5m | ₦1.5m | ₦355,094 | ₦104,734 | ₦744,217 | ₦300,000 | ₦0 | ₦2,319 | ₦-4.6m | ₦30 |
| 10 | 7,000 | 31,250 | 15,113 | 84 | 473 | 70 | ₦1.9m | ₦1.8m | ₦430,108 | ₦133,661 | ₦810,639 | ₦300,000 | ₦0 | ₦171,201 | ₦-4.4m | ₦28 |
| 11 | 8,000 | 39,250 | 18,863 | 96 | 585 | 87 | ₦2.3m | ₦2.2m | ₦510,003 | ₦166,370 | ₦886,550 | ₦300,000 | ₦0 | ₦358,265 | ₦-4.0m | ₦27 |
| 12 | 9,000 | 48,250 | 23,063 | 108 | 708 | 105 | ₦2.7m | ₦2.6m | ₦594,506 | ₦202,811 | ₦971,950 | ₦300,000 | ₦0 | ₦561,579 | ₦-3.5m | ₦26 |

### High case by month

| Month | New sign-ups | Registered | Active | Pass buyers | Core | Remote | Gross revenue | Net revenue | AI | Delivery (email, SMS, WhatsApp) | Fixed | Paid media | One-off | Result | Cumulative cash | AI per active user |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100 | 100 | 65 | 2 | 1 | 0 | ₦7,472 | ₦7,327 | ₦2,952 | ₦444 | ₦329,000 | ₦0 | ₦325,000 | ₦-650,069 | ₦-650,069 | ₦45 |
| 2 | 400 | 500 | 320 | 8 | 6 | 2 | ₦34,841 | ₦34,158 | ₦12,210 | ₦2,189 | ₦329,000 | ₦0 | ₦225,000 | ₦-534,241 | ₦-1.2m | ₦38 |
| 3 | 3,000 | 3,500 | 2,250 | 59 | 67 | 21 | ₦355,887 | ₦348,444 | ₦96,798 | ₦19,009 | ₦609,000 | ₦1.0m | ₦0 | ₦-1.4m | ₦-2.6m | ₦43 |
| 4 | 4,000 | 7,500 | 4,700 | 78 | 165 | 46 | ₦715,593 | ₦700,257 | ₦144,859 | ₦40,478 | ₦609,000 | ₦1.0m | ₦0 | ₦-1.1m | ₦-3.7m | ₦31 |
| 5 | 5,000 | 12,500 | 7,750 | 98 | 285 | 76 | ₦2.2m | ₦2.1m | ₦197,949 | ₦66,881 | ₦632,722 | ₦1.0m | ₦0 | ₦235,557 | ₦-3.4m | ₦26 |
| 6 | 6,000 | 18,500 | 11,400 | 117 | 427 | 111 | ₦3.0m | ₦3.0m | ₦255,899 | ₦98,117 | ₦689,656 | ₦1.0m | ₦0 | ₦913,916 | ₦-2.5m | ₦22 |
| 7 | 8,000 | 26,500 | 16,300 | 156 | 609 | 158 | ₦4.1m | ₦4.1m | ₦349,785 | ₦139,742 | ₦765,567 | ₦1.0m | ₦0 | ₦1.8m | ₦-691,990 | ₦21 |
| 8 | 10,000 | 36,500 | 22,400 | 195 | 836 | 215 | ₦5.5m | ₦5.4m | ₦453,842 | ₦191,298 | ₦860,456 | ₦1.0m | ₦0 | ₦2.9m | ₦2.2m | ₦20 |
| 9 | 12,000 | 48,500 | 29,700 | 234 | 1106 | 282 | ₦7.4m | ₦7.3m | ₦567,724 | ₦252,585 | ₦974,322 | ₦1.0m | ₦0 | ₦4.5m | ₦6.8m | ₦19 |
| 10 | 14,000 | 62,500 | 38,200 | 273 | 1417 | 359 | ₦9.3m | ₦8.5m | ₦691,103 | ₦323,408 | ₦1.1m | ₦1.0m | ₦0 | ₦5.4m | ₦12.2m | ₦18 |
| 11 | 16,000 | 78,500 | 47,900 | 312 | 1767 | 445 | ₦11.4m | ₦10.5m | ₦823,666 | ₦403,586 | ₦1.3m | ₦1.0m | ₦0 | ₦7.0m | ₦19.2m | ₦17 |
| 12 | 18,000 | 96,500 | 58,800 | 351 | 2155 | 540 | ₦13.7m | ₦12.6m | ₦965,117 | ₦492,944 | ₦1.4m | ₦1.0m | ₦0 | ₦8.7m | ₦27.9m | ₦16 |


## What the numbers say

**Fixed cost is the burn, not AI.** In the base year AI credits are ₦2.9 million against ₦15.1
million of total cost. The fixed lines and paid media are about ₦9 million. The single largest
controllable line is the ₦3.4 million a year of founder tooling, which is why the sensitivity that
leaves it off the company's books nearly breaks even. Treat it as a founder contribution until
there is revenue to carry it.

**Conversion and sign-ups move the result more than anything the engineering can change.** Going
from 3% to 4% conversion adds ₦2.4 million to the year; going to 2% removes ₦2 million. Halving
sign-ups turns a near break-even year into a ₦6 million loss. Churn from 7.5% to 5% is worth only
₦0.4 million in year one because the subscriber base is still small; it matters from year two.

**The AI cost per payer leaves room.** A Core payer costs ₦236 in AI, ₦30 in Paystack and a few
naira in delivery against ₦1,999 of revenue, a gross margin above 85%. A Remote payer costs ₦636
in AI plus ₦350 of WhatsApp and ₦175 of fees against ₦4,999, about 77%. The free tier costs ₦3 a
month per active user because the digest runs on batched Haiku, which is what makes a genuine
free tier affordable. The danger case is heavy use: with high token budgets and every Remote payer
using fifteen tailorings and three mock interviews a month, the year's AI bill doubles to about
₦6 million and the base case loses ₦5.8 million. Metering the Remote tier's unlimited tailoring
with a fair-use cap is cheap insurance.

**The naira matters more than any vendor choice.** At ₦1,800 to the dollar the base case loses
₦6.2 million instead of ₦3.5 million. Every cost line except Paystack, SMS and WhatsApp is in
dollars; every revenue line is in naira. Dollar-priced Remote subscriptions, which the plan lists
as future scope, would be the natural hedge.

**Six months is too early to judge.** No scenario is profitable at month 6 because months 1 to 6
hold the pilot, the launch and the one-off costs. The Phase 0 gate (10% of the waitlist pre-paying)
and the Phase 1 gate (2% conversion, churn under 10%) are the right checkpoints; this model says
that clearing them on the base sign-up curve produces a first profitable month in month 9 and a
company that is roughly self-funding by month 12 without paid media.

## What this does not include

- Founder salaries. Two people living on this need about ₦1 million a month between them at a
  modest Lagos cost of living, which no scenario covers in year one.
- Institutional revenue (state programmes, B2G), which the plan places in Phase 3.
- Employer-paid vetting of candidates for foreign employers, which the brief places after the
  first placements exist.
- Taxes other than VAT, bank charges, and the counsel fee beyond a placeholder.
- Any price rise. Prices are reviewed yearly against inflation, which runs around 16%.

## What is unverified

Anthropic prices were read from the live pricing page on 25 October 2026 and are the one firm
input. Token budgets per event are estimates until `messages.countTokens` runs on real Nigerian
CVs and listings in Phase 1. Conversion, churn, activation and the sign-up curve are benchmarks
from global consumer apps and edtech, with no Nigerian equivalent; the Phase 0 survey and
pre-orders are the first real data. Paystack fees, Termii, Resend, Vercel, Supabase and job-data
prices come from search summaries in the earlier research and are marked unverified there. The
exchange rate is the plan's October 2026 anchor and should be re-checked quarterly.

## What to do with it

1. Run Phase 0 against the gate and replace the conversion and activation inputs with measured
   ones at month 2. The model is a file; changing two numbers and re-running takes a minute.
2. Keep paid media at zero until the Phase 1 gate is cleared. The base case without media is
   within ₦0.5 million of a break-even year; with it, the loss is ₦3.5 million for roughly 4,800
   extra activated users, which is a decision about speed, not survival.
3. Cap Remote tailorings at a fair-use level (for example 20 a month) and put the mock interview
   on a monthly allowance, so the heavy-use case cannot double the AI bill.
4. Instrument token counts per event from the first week of Phase 1, so the AI line becomes a
   measurement rather than an estimate.
5. Revisit the model at month 6 with real churn. If churn is under 7% and conversion above 3%, the
   high case's trajectory, not the base case's, is the one to plan hiring around.
