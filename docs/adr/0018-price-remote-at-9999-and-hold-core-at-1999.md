# ADR-0018: Price the Remote tier at ₦9,999 a month (₦24,999 a quarter) and hold Core at ₦1,999 with a ₦2,499 test

- Status: Accepted; amended by ADR-0019 (the tier is named Pro and defined by service, not by kind of job)
- Date: 2026-10-25
- Deciders: Founders
- Related: PLAN.md §Price at ₦1,999, BRD §14.1 and BR-033, docs/REVENUE_MODEL.md, docs/research/revenue_model_inputs.md, ADR-0017

## Context
The Remote tier inherited Pro's ₦4,999, a price chosen as "a month for less than Jobberman's ₦5,200 week" and as the point where WhatsApp costs fit, never against the value of a dollar-paying remote role. The buyer already pays about ₦33,000 a month for Coursera Plus and ₦30,000 to ₦80,000 for a human CV rewrite. Core's ₦1,999 was chosen against Paystack's ₦2,500 fee cliff, the ₦1,300 to ₦2,500 streaming band and the minimum wage, and that reasoning still holds. The revenue model shows the base case losing ₦3.5 million over the first year at the old prices and roughly breaking even at ₦2,499 Core and ₦9,999 Remote, holding conversion constant.

## Decision
Remote is ₦9,999 a month or ₦24,999 a quarter, VAT-inclusive, with ₦7,500 shown to half the pre-order visitors in Phase 0 so the price is measured rather than assumed. Core stays at ₦1,999 a month, with ₦2,499 shown to half the pre-order visitors. The ₦1,999 seven-day pass stays as the entry purchase. Remote's unlimited tailoring carries a fair-use cap of 20 a month and the mock interview a monthly allowance, so heavy use cannot double the AI bill. A dollar price of about $7 for diaspora users is the next pricing decision and the hedge against the naira.

## Alternatives considered
| Option | Why not |
|---|---|
| Keep Remote at ₦4,999 | Undersells a product whose value is a dollar salary; the base case does not recover its launch costs in year one |
| Remote at ₦7,500 | Pays 2.8% in Paystack fees against 2.5% at ₦9,999 and leaves ₦1.1 million a year on the table in the base case; kept as the A/B arm |
| Core at ₦2,999 or above | Crosses the ₦2,500 fee cliff (₦145, 4.8%) and starts competing with Jobberman on price instead of under it |
| Core at ₦2,499 outright | Worth about ₦1.5 million a year in the base case but untested against the graduate's willingness to pay; measured first |

## Consequences
- Positive: the base case moves from a ₦3.5 million loss to about break-even over twelve months at constant conversion; Remote fees fall from 3.5% to 2.5%; the quarter at ₦24,999 pays 1.9%.
- Negative or risks: Remote conversion will fall from the ₦4,999 assumption; the tier can lose a third of its buyers and still earn more, but that is a bet until the pre-order page measures it. Every document that quoted ₦4,999 had to change.
- What would make us revisit this: Phase 0 pre-orders at ₦9,999 converting below two thirds of the ₦7,500 arm, or Remote churn above 10% in the first quarter after launch.

## Verification
Checked: Paystack fee arithmetic by price point; the model runs at both prices (docs/model/revenue_model.mjs). Assumed: conversion at the higher price; comparables (Coursera Plus, human CV rewrites, Jobberman) are from the earlier research and marked unverified there.
