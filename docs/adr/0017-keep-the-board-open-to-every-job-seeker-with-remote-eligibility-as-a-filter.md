# ADR-0017: Keep the board open to every job seeker and every role; remote eligibility is a filter, not a segment

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: PLAN.md §Price at ₦1,999, §Phases; BRD BR-017, BR-031, pricing table; docs/research/remote_eligibility_audit.md; ADR-0010, ADR-0015, ADR-0016

## Context
Philip's review proposed a remote-first proposition and the audit of 24 October 2026 showed remote supply open to Nigeria is 7% of fresh listings and mostly engineering. ADR-0016 proposed narrowing the paid product to a developer-first Remote tier. The founder rejected the narrowing the same day: the product is an open job board for everybody, any role and any sector, and the audit result describes what the remote shelf can promise, not who the board is for.

## Decision
The board is open to every job seeker in every role. Local roles come from aggregators and later direct feeds; remote roles come from public employer boards and remote feeds and pass the Nigeria-eligibility classifier in `core/src/remote.ts` before they can reach a digest. The digest shows the real count of eligible remote roles per sector and never pads it. The tiers stay Free, the ₦1,999 pass, Core at ₦1,999 and a Remote tier at ₦4,999 that is open to anyone who wants foreign remote roles, replacing Pro. The curated worldwide-employer list is grown by sector and measured weekly, and the Phase 0 survey and pilot cohort span roles rather than targeting developers. Nothing in the product, the copy or the pricing turns a user away by role or sector.

## Alternatives considered
| Option | Why not |
|---|---|
| Developer-first Remote tier (ADR-0016) | Narrows the market to a segment the founders do not want to be confined to; the engine is identical for every role |
| Remote-first for everyone | 7% open share and 18 non-engineering open roles a month: no digest to sell outside engineering today; honest counts per sector achieve the same without a promise the data cannot keep |
| Domestic-only | Leaves the free, structured remote supply and the one buyer segment with proven willingness to pay on the table |

## Consequences
- Positive: one product and one message for the whole market; the eligibility filter becomes a differentiating feature of the board rather than a product in itself; no rewrite of the domestic market research.
- Negative or risks: the remote shelf will look thin for most sectors at launch and must be shown honestly; willingness to pay across the whole market remains the biggest unverified assumption and is tested in Phase 0 before more code is written.
- What would make us revisit this: Phase 0 shows paying users concentrated in one sector while the rest do not convert, or the weekly per-sector remote counts stay near zero outside engineering for a quarter.

## Verification
Checked: the audit numbers, from the live feeds on 24 October 2026, with the script and CSV in the repository. Assumed, not verified: willingness to pay in each segment (Phase 0 survey and pre-orders); the classifier's precision, pending the 50-row hand-check.
