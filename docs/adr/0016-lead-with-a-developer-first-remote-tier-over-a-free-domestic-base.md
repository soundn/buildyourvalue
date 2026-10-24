# ADR-0016: Lead with a developer-first Remote tier at ₦4,999 over a free domestic base

- Status: Rejected (superseded the same day by ADR-0017: the founders chose an open board for every job seeker)
- Date: 2026-10-24
- Deciders: Founders
- Related: PLAN.md §Price at ₦1,999, §Phases; BRD BR-017, BR-031, pricing table; docs/research/remote_eligibility_audit.md; ADR-0010, ADR-0015

## Context
Philip's review of the brief argued that foreign remote jobs, not domestic ones, are where the data is free, the scam problem is sharpest and the willingness to pay is real, and proposed making remote the core proposition. The audit run on 24 October 2026 found that only 7% of 601 fresh remote listings were open to someone in Nigeria, that the open roles cluster at a few worldwide employers, and that 22 of the 40 fresh open roles were engineering, with 18 non-engineering open roles in a whole month. Remote-first for every Nigerian graduate therefore has no inventory to sell yet; domestic-first has weak willingness to pay. Two founders need a few thousand paying subscribers, not a mass market.

## Decision
The paid product is a Remote tier for developers, designers and the data and product people beside them, at ₦4,999 a month or ₦12,999 a quarter, replacing the Pro tier. It consists of a CV rewritten to global conventions, a digest of foreign remote roles filtered to those open to Nigeria by the classifier in `core/src/remote.ts`, an honest readiness score, and a learning path with a "getting paid" module. Supply comes from a curated list of employers that hire worldwide, read from their public job boards, measured weekly against a target of 30 fresh open developer or design roles. The domestic tiers (Free, the ₦1,999 pass, Core at ₦1,999) stay as the top of the funnel. A further remote segment (support, virtual assistants, writing) opens only when its own supply is proven. Employer-paid vetting is Phase 3, after placements exist.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Domestic-first at ₦1,999 (the original plan) | The biggest unverified assumption is that unemployed graduates pay at all; the domestic feed problem is the plan's weakest part |
| Remote-first for every Nigerian (the review's proposal) | 7% open share and 18 non-engineering open roles a month: no digest to sell outside engineering and design today |
| Drop domestic entirely | The scam screen, CV score and digest engine are identical; the free domestic tier is where remote buyers discover the product and costs about $0.03 per user per month |
| Price the Remote tier at ₦7,500 or in dollars | Untested; shown to half the pre-order visitors in Phase 0 rather than assumed |

## Consequences
- Positive: a buyer who already pays for ALX and LinkedIn Premium; free, legal, structured supply; a filter nobody else does honestly; the Labour Act licence question largely falls away.
- Negative or risks: a narrow market in the low hundreds of thousands; supply concentrated in a few employers; a truthful fit score tells most users they are not ready, so the first sale is readiness rather than jobs; the survey, the landing page, the BRD and the plan must all be rewritten around the new proposition before Phase 0 starts.
- What would make us revisit this: the curated employer list yields fewer than 30 fresh open developer or design roles a week for four weeks; fewer than 10% of the remote waitlist pre-pays ₦4,999; or a hand-check of 50 audit rows shows the classifier's "open" precision below 80%.

## Verification
Checked: the audit numbers above, from the live feeds on 24 October 2026, with the script and CSV in the repository. Assumed, not verified: willingness to pay ₦4,999 (Phase 0 survey and pre-order); the size of the remote-capable pool; foreign employers' appetite for vetted Nigerian candidates; the classifier's precision, pending the 50-row hand-check.
