# ADR-0007: Embed with Voyage voyage-4-lite at 1,024 dimensions in pgvector halfvec, hybrid with tsvector

- Status: Proposed
- Date: 2026-10-24
- Deciders: Founders (proposed by Claude from the tooling research; not yet accepted)
- Related: PLAN.md §Run matching on pgvector (embedding paragraph, "Embeddings" cost row); BRD INT-05, NFR-016; ARCHITECTURE.md §What is real and what is stubbed (Matching row); TOOLING.md §Three Claude tiers (Embeddings row); `.claude/skills/new-migration/SKILL.md` (vector rule)

## Context
PLAN.md and BRD INT-05 specify OpenAI `text-embedding-3-small` at 1,536 dimensions; TOOLING.md
recommends Voyage `voyage-4-lite` or OpenAI at 1,024 dimensions in `halfvec`; the
`new-migration` skill tells migrations to read the dimension from `api/.env.example`, which has
no embedding variable. The first migration with a vector column fixes the dimension, so the
choice is needed before Phase 1 schema work. The constraint is low: both candidates cost about
$0.02 per million tokens and the column is rebuildable nightly, so this decision costs compute
to reverse, not design.

## Decision
Jobs, profile summaries and courses are embedded with Voyage `voyage-4-lite` at 1,024
dimensions, stored in pgvector `halfvec(1024)` columns with an HNSW index, and every embedded
table also carries a `tsvector` column; recall combines the two by reciprocal rank fusion so
exact Nigerian tokens ("NYSC", "ICAN", "Ikeja") are not blurred by the embedding. We embed
Claude-produced structured summaries, not raw text, keyed by content hash so changed listings
are re-embedded. `api/.env.example` declares `EMBEDDING_MODEL=voyage-4-lite` and
`EMBEDDING_DIMS=1024` (added now, commented as proposed) and migrations read the dimension from
there. OpenAI `text-embedding-3-small` at 1,536 dimensions is the equal-cost alternative and the
fallback if Voyage onboarding stalls; a nightly rebuild job makes the switch a configuration
change plus one compute run.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| OpenAI text-embedding-3-small, 1,536-d (PLAN.md's choice) | Same price; 50% more storage per vector and a second vendor relationship with OpenAI purely for embeddings. Kept as the named fallback. |
| OpenAI text-embedding-3-large | About $0.13 per million tokens (snippet), 6x the cost, for recall gains the LLM rerank stage already supplies. |
| Self-hosted Qwen3 or BGE-M3 | Free per token but a GPU or CPU inference service to run, monitor and scale; ops cost for two people exceeds the token bill at every scale in PLAN.md. |
| Dedicated vector database | A second data system for under a million vectors; pgvector in the same Postgres is "almost always the cheapest production-grade choice" below about five million (PLAN.md). |

## Consequences
- Positive: half the vector storage of a 1,536-d `vector` column; one Postgres for data, search and queue (ADR-0006); hybrid search keeps exact-token matching; the embedding bill stays under $1 a month at 1,000 users.
- Negative or risks: Voyage is a smaller vendor than OpenAI (onboarding, rate limits and regional availability unverified); any model change requires re-embedding the whole corpus; `halfvec` precision is adequate per a vendor benchmark we have not reproduced.
- On acceptance: PLAN.md's "text-embedding-3-small ... 1,536" sentence and BRD INT-05 read "voyage-4-lite 1,024 (proposed, ADR-0007), text-embedding-3-small as alternative"; the first vector migration uses `halfvec(1024)`; the nightly rebuild job is scheduled from the start.
- What would make us revisit this: match-relevance nDCG@10 on the Phase 0 gold set measurably below the OpenAI alternative; Voyage rate limits blocking a nightly run; a price change above $0.05 per million tokens; a corpus approaching five million vectors.

## Verification
Fetched (pgvector README, via TOOLING.md): `halfvec` stores 2 bytes per dimension, HNSW
indexes up to 4,000 dimensions, and hybrid search with full-text fused by reciprocal rank
fusion is documented. Snippets, not fetched: Voyage `voyage-4-lite` at $0.02 per million tokens
with 200M free tokens (usagepricing aggregator); OpenAI `text-embedding-3-small` at $0.02 and
`3-large` at $0.13 (OpenAI community thread and PLAN.md's search summary); Neon's claim that
`halfvec` halves storage at equivalent recall. Checked in the repository: no embedding code or
env var exists; `api/.env.example` could not be edited in this session because the project's
permission settings deny access to `.env.*` files, so adding `EMBEDDING_MODEL` and
`EMBEDDING_DIMS` remains an open item. Estimate: that the rerank stage compensates for any
recall gap between the two models; measure on the 200 labelled profile/job pairs.
