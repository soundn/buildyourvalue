# Revenue model: the first six and twelve months

*25 October 2026, at the prices in ADR-0018 (Core ₦1,999, Pro ₦9,999; ADR-0019 names the tier). Every number below
comes from `docs/model/revenue_model.mjs`, a deterministic script whose inputs are listed with
their sources in `docs/research/revenue_model_inputs.md`. Re-run with
`node docs/model/revenue_model.mjs`. Months count from the start of Phase 0; the MVP launches in
month 3; the founders take no salary. Naira throughout, dollar costs converted at ₦1,400 unless a
row says otherwise.*

## The answer in four lines

- In six months the business does not make money in any scenario. Months 1 and 2 are the hand-run
  pilot and months 3 to 6 are launch, so the six-month result is a loss of about ₦3.7 million in the
  base case (₦1.2 million in the high case, ₦4.6 million in the low case). That loss is the cost of
  finding out whether people pay, and it is mostly fixed cost and paid media, not AI.
- In twelve months the base case reaches about 920 paying users and ₦13.8 million of net revenue,
  turns its first monthly profit in month 9, and ends the year about ₦1.3 million down in cash, with
  the low point of ₦4 million in month 8. Drop paid media and the year is ₦1.7 million positive;
  leave the founders' own Claude subscriptions off the company's books and it is ₦2.1 million
  positive.
- The high case (twice the sign-ups, 4% conversion, 5% churn, a quarter of payers on Pro) makes
  about ₦38 million over the year on ₦65 million of revenue, is profitable monthly from month 5 and
  cash-positive from month 7. The low case (half the sign-ups, 2% conversion, 10% churn, a weak
  naira and heavy AI use) loses about ₦9.2 million and never breaks even inside the year.
- AI credits are not the problem. They are ₦3 a month for a free user, ₦236 for a Core payer and
  ₦636 for a Pro payer, about 21% of revenue in the base year and under 20% of total cost. The
  numbers that decide the outcome are sign-ups, conversion, and the roughly ₦650,000 to ₦1 million
  a month of fixed cost and media that a two-person company carries before it has payers.

## What the model does

Each month new sign-ups arrive (base: 50 and 200 in the pilot, then 1,500 rising to 9,000 by month
12, for about 48,000 registered users at year end). A share activates by finishing a CV (60% base).
Of the activated, 3% buy a subscription within the month (Core at ₦1,999 or Pro at ₦9,999, 15%
of them Pro), and a further 2 in 100 buy the one-off ₦1,999 pass, 30% of whom upgrade to Core
the month after. Subscribers churn at 7.5% a month. Active users are 45% of the older registered
base plus this month's activations; free active users receive the throttled weekly five-job digest.
The ₦24,999 Pro quarter is not modelled separately; it improves cash timing and fees slightly.

Revenue is subscriptions plus the pass, plus employer featured roles from month 5 (5 a month at
₦20,000, then 10) and course-affiliate commissions (0.2% of active users at $5), less Paystack fees
(₦30 on ₦1,999, ₦250 on ₦9,999) and VAT once turnover crosses the ₦100 million a year threshold,
which no scenario reaches.

Cost is five lines. AI: every event priced from token budgets at Anthropic's list prices, Sonnet
5.5 for CV generation, tailoring, cover letters and mock interviews, Haiku 5.5 in batch for the
digest rerank and scam triage, Haiku standard for the intake questions, plus embeddings. Delivery:
email at Resend's blended rate, one OTP SMS per active user at ₦7 scaled by the scenario, and
₦350 of WhatsApp per Pro payer. Fixed: the two founders' Claude Max subscriptions ($200),
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
| Pro ₦9,999 | ₦636 | 17 digests, 8 tailorings, 4 cover letters, 1 mock interview (WhatsApp ₦350 is separate) |
| Onboarding, once per activated user | ₦50 | CV parse and rewrite on Sonnet plus ten phrased intake questions |

### Three scenarios

| Scenario | 6-month revenue (net of fees) | 6-month AI spend | 6-month total cost | 6-month result | 12-month revenue (net) | 12-month AI spend | 12-month total cost | 12-month result | Payers at month 12 | Registered at month 12 | First profitable month | Cash low point |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Low | ₦379,951 | ₦362,933 | ₦4.9m | ₦-4.6m | ₦3.0m | ₦2.1m | ₦12.1m | ₦-9.2m | 218 | 24,125 | not within 12 | ₦-9.2m |
| Base | ₦1.7m | ₦454,638 | ₦5.4m | ₦-3.7m | ₦13.8m | ₦2.9m | ₦15.1m | ₦-1.3m | 921 | 48,250 | 9 | ₦-4.0m |
| High | ₦7.4m | ₦710,666 | ₦8.7m | ₦-1.2m | ₦64.6m | ₦4.6m | ₦26.7m | ₦37.9m | 3,046 | 96,500 | 5 | ₦-3.3m |

### Sensitivities on the base case

| Change | 12-month revenue (net) | 12-month total cost | 12-month result | First profitable month | Cash low point |
|---|---|---|---|---|---|
| Base, no paid media | ₦13.8m | ₦12.1m | ₦1.7m | 7 | ₦-2.5m |
| Base, founders' Claude Max not charged to the company | ₦13.8m | ₦11.7m | ₦2.1m | 7 | ₦-2.0m |
| Base at ₦1,800 to the dollar | ₦14.2m | ₦18.2m | ₦-4.1m | 10 | ₦-5.4m |
| Base with heavy AI use (high token budgets and usage) | ₦13.8m | ₦17.4m | ₦-3.7m | 10 | ₦-4.7m |
| Base with 4% conversion | ₦16.9m | ₦15.4m | ₦1.4m | 8 | ₦-3.4m |
| Base with 2% conversion | ₦10.7m | ₦14.7m | ₦-4.0m | 10 | ₦-4.8m |
| Base with churn at 5% | ₦14.3m | ₦15.1m | ₦-793,706 | 8 | ₦-3.9m |
| Base with half the sign-ups | ₦7.5m | ₦12.5m | ₦-5.0m | 11 | ₦-5.3m |

### Low case by month

| Month | New sign-ups | Registered | Active | Pass buyers | Core | Pro | Gross revenue | Net revenue | AI | Delivery (email, SMS, WhatsApp) | Fixed | Paid media | One-off | Result | Cumulative cash | AI per active user |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 25 | 25 | 13 | 0 | 0 | 0 | ₦624 | ₦613 | ₦1,597 | ₦144 | ₦423,000 | ₦0 | ₦325,000 | ₦-749,128 | ₦-749,128 | ₦123 |
| 2 | 100 | 125 | 58 | 1 | 1 | 0 | ₦2,778 | ₦2,731 | ₦6,277 | ₦642 | ₦423,000 | ₦0 | ₦225,000 | ₦-652,189 | ₦-1.4m | ₦108 |
| 3 | 750 | 875 | 413 | 4 | 7 | 1 | ₦30,290 | ₦29,755 | ₦53,060 | ₦4,729 | ₦783,000 | ₦0 | ₦0 | ₦-811,035 | ₦-2.2m | ₦128 |
| 4 | 1,000 | 1,875 | 763 | 5 | 16 | 2 | ₦59,998 | ₦58,926 | ₦75,822 | ₦8,836 | ₦783,000 | ₦0 | ₦0 | ₦-808,733 | ₦-3.0m | ₦99 |
| 5 | 1,250 | 3,125 | 1,188 | 6 | 27 | 3 | ₦126,622 | ₦124,474 | ₦100,179 | ₦13,806 | ₦783,000 | ₦0 | ₦0 | ₦-772,511 | ₦-3.8m | ₦84 |
| 6 | 1,500 | 4,625 | 1,688 | 8 | 39 | 4 | ₦166,305 | ₦163,453 | ₦125,999 | ₦19,632 | ₦783,000 | ₦0 | ₦0 | ₦-765,178 | ₦-4.6m | ₦75 |
| 7 | 2,000 | 6,625 | 2,388 | 10 | 55 | 6 | ₦219,714 | ₦215,920 | ₦169,490 | ₦27,742 | ₦783,000 | ₦0 | ₦0 | ₦-764,313 | ₦-5.3m | ₦71 |
| 8 | 2,500 | 9,125 | 3,238 | 13 | 74 | 8 | ₦283,672 | ₦278,747 | ₦216,377 | ₦37,589 | ₦783,000 | ₦0 | ₦0 | ₦-758,219 | ₦-6.1m | ₦67 |
| 9 | 3,000 | 12,125 | 4,238 | 15 | 96 | 10 | ₦402,151 | ₦395,251 | ₦266,371 | ₦49,157 | ₦808,925 | ₦0 | ₦0 | ₦-729,202 | ₦-6.8m | ₦63 |
| 10 | 3,500 | 15,625 | 5,388 | 18 | 121 | 12 | ₦484,227 | ₦475,875 | ₦319,214 | ₦62,434 | ₦851,625 | ₦0 | ₦0 | ₦-757,399 | ₦-7.6m | ₦59 |
| 11 | 4,000 | 19,625 | 6,688 | 20 | 148 | 15 | ₦574,066 | ₦564,124 | ₦374,674 | ₦77,407 | ₦900,425 | ₦0 | ₦0 | ₦-788,382 | ₦-8.4m | ₦56 |
| 12 | 4,500 | 24,125 | 8,138 | 23 | 178 | 18 | ₦670,920 | ₦659,265 | ₦432,541 | ₦94,067 | ₦955,325 | ₦0 | ₦0 | ₦-822,668 | ₦-9.2m | ₦53 |

### Base case by month

| Month | New sign-ups | Registered | Active | Pass buyers | Core | Pro | Gross revenue | Net revenue | AI | Delivery (email, SMS, WhatsApp) | Fixed | Paid media | One-off | Result | Cumulative cash | AI per active user |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 50 | 50 | 30 | 1 | 0 | 0 | ₦2,639 | ₦2,593 | ₦1,873 | ₦237 | ₦329,000 | ₦0 | ₦325,000 | ₦-653,518 | ₦-653,518 | ₦62 |
| 2 | 200 | 250 | 143 | 2 | 2 | 0 | ₦12,247 | ₦12,030 | ₦7,719 | ₦1,136 | ₦329,000 | ₦0 | ₦225,000 | ₦-550,825 | ₦-1.2m | ₦54 |
| 3 | 1,500 | 1,750 | 1,013 | 18 | 26 | 4 | ₦130,685 | ₦128,288 | ₦62,840 | ₦8,824 | ₦609,000 | ₦300,000 | ₦0 | ₦-852,376 | ₦-2.1m | ₦62 |
| 4 | 2,000 | 3,750 | 1,988 | 24 | 60 | 9 | ₦261,535 | ₦256,668 | ₦93,259 | ₦17,657 | ₦609,000 | ₦300,000 | ₦0 | ₦-763,249 | ₦-2.8m | ₦47 |
| 5 | 2,500 | 6,250 | 3,188 | 30 | 101 | 15 | ₦560,492 | ₦551,204 | ₦126,513 | ₦28,449 | ₦609,000 | ₦300,000 | ₦0 | ₦-512,757 | ₦-3.3m | ₦40 |
| 6 | 3,000 | 9,250 | 4,613 | 36 | 148 | 22 | ₦756,481 | ₦743,858 | ₦162,435 | ₦41,170 | ₦609,000 | ₦300,000 | ₦0 | ₦-368,747 | ₦-3.7m | ₦35 |
| 7 | 4,000 | 13,250 | 6,563 | 48 | 209 | 32 | ₦1.0m | ₦1.0m | ₦220,923 | ₦58,431 | ₦639,839 | ₦300,000 | ₦0 | ₦-215,592 | ₦-3.9m | ₦34 |
| 8 | 5,000 | 18,250 | 8,963 | 60 | 284 | 43 | ₦1.3m | ₦1.3m | ₦285,259 | ₦79,639 | ₦687,283 | ₦300,000 | ₦0 | ₦-34,661 | ₦-4.0m | ₦32 |
| 9 | 6,000 | 24,250 | 11,813 | 72 | 373 | 56 | ₦1.8m | ₦1.8m | ₦355,094 | ₦104,734 | ₦744,217 | ₦300,000 | ₦0 | ₦276,479 | ₦-3.7m | ₦30 |
| 10 | 7,000 | 31,250 | 15,113 | 84 | 473 | 70 | ₦2.2m | ₦2.2m | ₦430,108 | ₦133,661 | ₦810,639 | ₦300,000 | ₦0 | ₦517,882 | ₦-3.2m | ₦28 |
| 11 | 8,000 | 39,250 | 18,863 | 96 | 585 | 87 | ₦2.7m | ₦2.6m | ₦510,003 | ₦166,370 | ₦886,550 | ₦300,000 | ₦0 | ₦785,324 | ₦-2.4m | ₦27 |
| 12 | 9,000 | 48,250 | 23,063 | 108 | 708 | 105 | ₦3.2m | ₦3.1m | ₦594,506 | ₦202,811 | ₦971,950 | ₦300,000 | ₦0 | ₦1.1m | ₦-1.3m | ₦26 |

### High case by month

| Month | New sign-ups | Registered | Active | Pass buyers | Core | Pro | Gross revenue | Net revenue | AI | Delivery (email, SMS, WhatsApp) | Fixed | Paid media | One-off | Result | Cumulative cash | AI per active user |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100 | 100 | 65 | 2 | 1 | 0 | ₦9,097 | ₦8,928 | ₦2,952 | ₦444 | ₦329,000 | ₦0 | ₦325,000 | ₦-648,469 | ₦-648,469 | ₦45 |
| 2 | 400 | 500 | 320 | 8 | 6 | 2 | ₦42,885 | ₦42,081 | ₦12,210 | ₦2,189 | ₦329,000 | ₦0 | ₦225,000 | ₦-526,318 | ₦-1.2m | ₦38 |
| 3 | 3,000 | 3,500 | 2,250 | 59 | 67 | 21 | ₦461,029 | ₦452,008 | ₦96,798 | ₦19,009 | ₦609,000 | ₦1.0m | ₦0 | ₦-1.3m | ₦-2.4m | ₦43 |
| 4 | 4,000 | 7,500 | 4,700 | 78 | 165 | 46 | ₦945,477 | ₦926,693 | ₦144,859 | ₦40,478 | ₦609,000 | ₦1.0m | ₦0 | ₦-867,644 | ₦-3.3m | ₦31 |
| 5 | 5,000 | 12,500 | 7,750 | 98 | 285 | 76 | ₦2.5m | ₦2.5m | ₦197,949 | ₦66,881 | ₦632,722 | ₦1.0m | ₦0 | ₦610,734 | ₦-2.7m | ₦26 |
| 6 | 6,000 | 18,500 | 11,400 | 117 | 427 | 111 | ₦3.6m | ₦3.5m | ₦255,899 | ₦98,117 | ₦689,656 | ₦1.0m | ₦0 | ₦1.5m | ₦-1.2m | ₦22 |
| 7 | 8,000 | 26,500 | 16,300 | 156 | 609 | 158 | ₦4.9m | ₦4.8m | ₦349,785 | ₦139,742 | ₦765,567 | ₦1.0m | ₦0 | ₦2.6m | ₦1.3m | ₦21 |
| 8 | 10,000 | 36,500 | 22,400 | 195 | 836 | 215 | ₦6.6m | ₦6.5m | ₦453,842 | ₦191,298 | ₦860,456 | ₦1.0m | ₦0 | ₦4.0m | ₦5.3m | ₦20 |
| 9 | 12,000 | 48,500 | 29,700 | 234 | 1106 | 282 | ₦8.8m | ₦8.1m | ₦567,724 | ₦252,585 | ₦974,322 | ₦1.0m | ₦0 | ₦5.3m | ₦10.6m | ₦19 |
| 10 | 14,000 | 62,500 | 38,200 | 273 | 1417 | 359 | ₦11.1m | ₦10.2m | ₦691,103 | ₦323,408 | ₦1.1m | ₦1.0m | ₦0 | ₦7.1m | ₦17.7m | ₦18 |
| 11 | 16,000 | 78,500 | 47,900 | 312 | 1767 | 445 | ₦13.6m | ₦12.5m | ₦823,666 | ₦403,586 | ₦1.3m | ₦1.0m | ₦0 | ₦9.0m | ₦26.7m | ₦17 |
| 12 | 18,000 | 96,500 | 58,800 | 351 | 2155 | 540 | ₦16.4m | ₦15.1m | ₦965,117 | ₦492,944 | ₦1.4m | ₦1.0m | ₦0 | ₦11.2m | ₦37.9m | ₦16 |


## What the numbers say

**Fixed cost is the burn, not AI.** In the base year AI credits are ₦2.9 million against ₦15.1
million of total cost. The fixed lines and paid media are about ₦9 million. The single largest
controllable line is the ₦3.4 million a year of founder tooling, which is why the sensitivity that
leaves it off the company's books turns the year positive. Treat it as a founder contribution until
there is revenue to carry it.

**Conversion and sign-ups move the result more than anything the engineering can change.** Going
from 3% to 4% conversion adds ₦2.7 million to the year; going to 2% removes ₦2.7 million. Halving
sign-ups turns a near break-even year into a ₦5 million loss. Churn from 7.5% to 5% is worth only
₦0.5 million in year one because the subscriber base is still small; it matters from year two.

**The price change did what it was meant to.** Moving the top tier from ₦4,999 to ₦9,999 at constant
conversion adds ₦2.2 million of net revenue to the base year and ₦10 million to the high case, and
takes the base case from a ₦3.5 million loss to ₦1.3 million. The model holds conversion constant,
which flatters the higher price; the Phase 0 pre-order page shows ₦7,500 to half the visitors so
the real elasticity is measured. Pro can lose a third of its buyers at ₦9,999 and still earn
more than at ₦4,999.

**The AI cost per payer leaves room.** A Core payer costs ₦236 in AI, ₦30 in Paystack and a few
naira in delivery against ₦1,999 of revenue, a gross margin above 85%. A Pro payer costs ₦636
in AI plus ₦350 of WhatsApp and ₦250 of fees against ₦9,999, about 88%. The free tier costs ₦3 a
month per active user because the digest runs on batched Haiku, which is what makes a genuine
free tier affordable. The danger case is heavy use: with high token budgets and every Pro payer
using fifteen tailorings and three mock interviews a month, the year's AI bill doubles to about
₦6 million and the base case loses ₦3.7 million. The fair-use cap of 20 tailorings a month in
ADR-0018 is the insurance.

**The naira matters more than any vendor choice.** At ₦1,800 to the dollar the base case loses
₦4.1 million instead of ₦1.3 million. Every cost line except Paystack, SMS and WhatsApp is in
dollars; every revenue line is in naira. A dollar-priced Pro subscription for diaspora users is
the natural hedge and the next pricing decision.

**Six months is too early to judge.** No scenario is profitable at month 6 because months 1 to 6
hold the pilot, the launch and the one-off costs. The Phase 0 gate (10% of the waitlist pre-paying)
and the Phase 1 gate (2% conversion, churn under 10%) are the right checkpoints; this model says
that clearing them on the base sign-up curve produces a first profitable month in month 9 and a
company that is self-funding by month 12 without paid media.

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
pre-orders are the first real data, and conversion at ₦9,999 is the least certain input of all.
Paystack fees, Termii, Resend, Vercel, Supabase and job-data prices come from search summaries in
the earlier research and are marked unverified there. The exchange rate is the plan's October 2026
anchor and should be re-checked quarterly.

## What to do with it

1. Run Phase 0 against the gate and replace the conversion and activation inputs with measured
   ones at month 2, including the ₦9,999 against ₦7,500 and ₦1,999 against ₦2,499 price arms.
2. Keep paid media at zero until the Phase 1 gate is cleared. The base case without media is
   ₦1.7 million positive for the year; with it, the loss is ₦1.3 million for roughly 4,800 extra
   activated users, which is a decision about speed, not survival.
3. Enforce the Pro fair-use cap (20 tailorings a month) and a monthly mock-interview allowance,
   so the heavy-use case cannot double the AI bill.
4. Instrument token counts per event from the first week of Phase 1, so the AI line becomes a
   measurement rather than an estimate.
5. Revisit the model at month 6 with real churn. If churn is under 7% and conversion above 3%, the
   high case's trajectory, not the base case's, is the one to plan hiring around.
