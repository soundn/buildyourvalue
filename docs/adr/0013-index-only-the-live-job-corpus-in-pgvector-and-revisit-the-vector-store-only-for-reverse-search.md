# ADR-0013: Index only the live job corpus in pgvector; store but do not index profile vectors; revisit the vector store only when employer-to-candidate reverse search is built

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: ADR-0007 (amended by this ADR); ADR-0006; INFRASTRUCTURE.md §Data and identity, §Recommendation per layer, §Conclusion, §What could not be verified; PLAN.md §Run matching on pgvector; BRD INT-05, NFR-016; ARCHITECTURE.md §What is real and what is stubbed (Matching row); `.claude/skills/new-migration/SKILL.md` (vector rule)

## Context
ADR-0007 chose Voyage `voyage-4-lite` at 1,024 dimensions in pgvector `halfvec` with an HNSW
index, and named "a corpus approaching five million vectors" as a revisit trigger without
saying which corpus. INFRASTRUCTURE.md sized the two candidates: at 50 million registered users
a profile index would be about 102 GB of `halfvec` data plus 1.2 to 2x that for HNSW, beyond
Supabase's largest 16XL instance and into HNSW sharding that degrades badly across nodes;
the live job corpus, at about 300 listings a day with two-year retention, is roughly 200,000
to 220,000 vectors and under 2 GB with its index at every user tier. The digest is a forward
query (one active user's vector against the jobs), so the profile index is only needed for a
feature the product does not have. The constraint is not building a 50-million-vector problem
that no product requirement asks for.

## Decision
ADR-0007's model, dimensions and `halfvec` storage stand. The matching index is the live job
corpus only: the `jobs` embedding column carries the HNSW index and the hybrid `tsvector`, and
each match run queries it once per active user, as a batch over active users against a small,
hot index rather than a fan-out over a growing one. Profile summary vectors are stored in
`halfvec(1024)` for the forward query and for re-embedding by content hash, but are NOT given a
vector index, and the `new-migration` skill's vector rule is read accordingly. The trigger to
revisit the vector store is building employer-to-candidate reverse search, which would index
roughly 5 million completed profiles (about 7 million registered users); registered-user count
on its own is not a trigger. When reverse search is built, the options in order are `halfvec`
on an 8XL-plus primary, Supabase vector pod projects, or Cloudflare Vectorize, and the forward
match never leaves the primary. Reverse search is priced as a product decision when an
employer asks for it.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Index every profile vector from day one | 35 million vectors at 50 million users (7 million at 10 million) exceed any single managed Postgres instance for the index alone, force vector pods or sharding, and buy nothing until reverse search exists; the forward query reads one profile row by primary key. |
| Cloudflare Vectorize for the forward match | Would serve 220,000 jobs for a few dollars a month, but it is a second data system with a 20 million vector per index cap, no SQL join with the `tsvector` hybrid, no bulk export and no data-localisation controls for CR-15; pgvector on the same Postgres already fits in RAM on a Medium or Large instance. |
| Dedicated vector database (ADR-0007's alternative) | Still rejected: under five million vectors pgvector is the cheapest production-grade choice, and this ADR shows the indexed corpus never approaches that bound without reverse search. |
| Supabase vector pod projects now | Supabase's scaling guidance for collections that outgrow operational data; the job corpus does not, so a second project would add a cross-database hop to every match for no capacity gain. |

## Consequences
- Positive: the vector index stays under 2 GB regardless of user growth, so Supabase compute is sized by operational data and read load, not by vectors; the matching pipeline can be designed as a batch from the start; ADR-0007's "five million vectors" trigger is replaced by a feature trigger the founders control; no second data system.
- Negative or risks: a future reverse-search feature is a capacity project (8XL-plus primary or vector pods) that must be planned before the first employer is promised it; storing unindexed profile vectors costs about 2 KB per profile, immaterial but not zero; the `halfvec` extrapolations in INFRASTRUCTURE.md come from a 1,536-dimension float32 guide, so the "under 2 GB" figure is an estimate.
- On acceptance: ADR-0007's Status line reads "Accepted; amended by ADR-0013"; the first vector migration indexes `jobs` only and leaves the profile column unindexed with a comment pointing here; the match job in ADR-0006's pgmq pipeline is written as a batch over active users.
- What would make us revisit this: an employer or recruiter asking for candidate search (the trigger); the live job corpus passing one million vectors through longer retention or a direct board feed (ADR-0007's original bound comes back into view); a measured match-run time that a single hot index cannot meet at the active-user count.

## Verification
Read from vendor documentation source repositories (INFRASTRUCTURE.md): Supabase's benchmarks
to one million 1,536-dimension vectors on 32 to 40 GB of RAM and its guidance to split vector
collections into pod projects; Supabase compute tiers to 16XL (64 vCPU, 256 GB RAM); pgvector
`halfvec` at 2 bytes per dimension; Vectorize's 20 million vector and 1,536-dimension cap.
Search snippets, not fetched: HNSW capacity of roughly 2 to 3 million 1,536-dimension vectors
in 16 GB (Tiger Data); cross-node HNSW traversals above 80% of search steps in a five-node
split (arXiv 2512.17264). Estimates: 300 listings a day with two-year retention gives the
200,000 to 220,000 job corpus; 35 KB per user and a 30% active ratio underlie the profile
counts; neither Supabase nor anyone else has published a pgvector benchmark at 10 to 50 million
vectors on managed Postgres. Checked in the repository: no vector migration exists yet, so the
index placement costs nothing to decide now; `api/.env.example` still lacks `EMBEDDING_MODEL`
and `EMBEDDING_DIMS` (ADR-0007's open item).
