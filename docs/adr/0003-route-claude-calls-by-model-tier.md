# ADR-0003: Route Claude calls by tier: Sonnet 5.5 for writing, Haiku 5.5 for bulk, Opus 5.5 only for evals

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: PLAN.md §Run matching on pgvector (model split, cost rows); BRD BR-016, INT-04, NFR-017; TOOLING.md §Three Claude tiers; CLAUDE.md §AI usage; `api/src/ai.ts`

## Context
The documents disagree on which Claude model serves product traffic. CLAUDE.md and
`api/src/ai.ts` default to `claude-opus-5-5`; PLAN.md and BRD BR-016 say "stronger model for
CV writing, cheap model for everything else"; TOOLING.md names Haiku 5.5 for the digest and
Sonnet 5.5 for CV work. The constraint that matters most is per-user variable cost (BRD BO-08:
under ₦400 per active user), and the digest is the line that compounds: TOOLING's estimate is
$0.0018 per user per week on batched Haiku against $0.072 on batched Opus.

## Decision
`api` routes every Claude call through one of two configured models. `ANTHROPIC_MODEL_WRITE`
(default `claude-sonnet-5-5`) serves CV parsing, rewriting and tailoring, cover letters and
interview grading. `ANTHROPIC_MODEL_BULK` (default `claude-haiku-5-5`) serves digest reranking,
scam triage, bullet verification and other classification, submitted through the Batch API
wherever latency allows. Opus 5.5 is used only for eval judging and a future coach agent,
never for per-user product traffic; Fable 5.1 is never used for product traffic. The single
`ANTHROPIC_MODEL` variable is replaced by the two above. Because Haiku 5.5 refusals have no
server-side fallback, a bulk call that returns `stop_reason: "refusal"` is retried once on the
write model; every Claude call keeps the deterministic rules fallback in `@byv/core`
(BR-016). Prompts to the bulk model stay under 100k tokens to avoid the long-context rate.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Keep Opus 5.5 as the default everywhere (current code) | $4/$20 per MTok is roughly 20x Haiku on the digest, the one line that scales with users; it buys nothing measurable for a 30-item rerank or a yes/no scam classification. |
| One model everywhere (Sonnet 5.5) | Simpler configuration and one eval set, but the digest at $0.036 batched per user per week is ten times the Haiku path, which alone breaks the ₦400 ceiling at the free tier's throttled volume. |
| A non-Anthropic cheap model for bulk work | Adds a second vendor, a second SDK, a second structured-output dialect and a second eval set for a two-person team; the saving over Haiku 5.5 is marginal. |

## Consequences
- Positive: digest and scam costs sit near TOOLING's estimates; CV writing keeps a model strong enough for faithful rewrites; the write/bulk split matches BR-016 and makes per-task cost logging straightforward.
- Negative or risks: two models mean two prompt-cache namespaces and two sets of eval baselines; the bulk-to-write refusal retry makes the worst-case digest cost Sonnet-priced for that user; model IDs will change again and the env vars must be re-pointed when they do.
- On acceptance: change `api/src/ai.ts` to read `ANTHROPIC_MODEL_WRITE` and `ANTHROPIC_MODEL_BULK` (dropping the `claude-opus-5-5` default), update `api/.env.example`, and rewrite the CLAUDE.md "AI usage" line ("Default model is `claude-opus-5-5`; `ANTHROPIC_MODEL` overrides it") to name the two variables.
- What would make us revisit this: a measured fabrication rate on Sonnet rewrites above zero that Opus fixes; Haiku refusal rate on the digest above 1% of users; a price change that brings Sonnet batch within 2x of Haiku; a Nigerian-English quality gap on Haiku classification measured on the Phase 0 gold set.

## Verification
Fetched (Anthropic pricing page, per TOOLING.md and the bundled `claude-api` skill, cached
2026-10-06): Haiku 5.5 $0.10/$0.50 per MTok for prompts under 100k; Sonnet 5.5 $2/$10;
Opus 5.5 $4/$20; Fable 5.1 $10/$50 and a Covered Model requiring 30-day retention. Haiku 5.5
refusals having no server-side fallback is from the Anthropic refusals documentation via the
skill. Checked in the repository: `api/src/ai.ts` line 10 defaults to `claude-opus-5-5` and
already handles `stop_reason === "refusal"` by returning null to the rules fallback. Estimates,
not measurements: the per-digest cost figures (token counts of 21k in / 3k out are assumed;
verify with `messages.countTokens` on real Nigerian listings in Phase 1) and the claim that
Haiku classification quality is adequate for Nigerian listings (no gold set exists yet).
