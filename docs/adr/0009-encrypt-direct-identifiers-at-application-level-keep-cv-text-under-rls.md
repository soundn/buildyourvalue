# ADR-0009: Encrypt direct identifiers at the application level and keep CV text in RLS-protected plaintext

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: BRD NFR-007, NFR-010, CR-01, CR-06, CR-15; PLAN.md §Register with NDPC (compliance table); TOOLING.md §The application stack (compliance paragraph); `.claude/skills/new-migration/SKILL.md` (sensitive text rule); `api/src/ai.ts`; ADR-0004; ADR-0007

## Context
BRD NFR-007 asks only for encryption at rest; TOOLING.md proposes application-level AES-GCM for
NIN and bank data with PII pseudonymised before LLM calls; the `new-migration` skill tells
every migration to encrypt "phone, email, CV body" into `*_enc` columns while also demanding a
`tsvector` column on the CV body for hybrid search, which an encrypted column cannot provide.
The first profile table cannot be written until the scope is settled. The constraint is the
NDPA: a CV platform is a controller of personal data, and the realistic breach paths are a
leaked service-role key or a misconfigured RLS policy, not a stolen disk.

## Decision
Direct identifiers are encrypted in the API before insert with AES-GCM under a key held in the
secrets manager (never in the database): phone number, email address, and any national ID or
bank detail if ever collected. Each is stored in a `*_enc` column alongside a keyed-hash
`*_hash` column (HMAC with a separate key) for equality lookups such as login and dedup. CV
body, work history, skills and the structured summary are stored in plaintext columns protected
by RLS and Supabase's encryption at rest, because `tsvector` search and the embedding pipeline
(ADR-0007) need the text. Name, email and phone are stripped or pseudonymised before any LLM
call; `api/src/ai.ts` already sends summary, education, skills and work entries without
`basics.name`, email or phone, and that stays a tested invariant. Database-side column
encryption (pgsodium or Vault) is not used.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Encrypt the CV body too | Breaks hybrid search and forces every worker to decrypt before embedding or ranking; the CV is the data the product exists to process, and the real exposure is access control, which RLS addresses. |
| Rely on at-rest encryption only (NFR-007 as written) | Protects against lost disks, not against a leaked service key, a permissive policy or a misconfigured MCP pointed at production; a dumped `profiles` table would expose every phone number in plaintext. |
| pgsodium or Supabase Vault column encryption | Supabase recommends against new pgsodium usage and keeping keys outside the database (snippet of vendor page); keys inside Postgres defeat the purpose when the threat is database access. |
| Tokenise identifiers through a third-party vault service | Another vendor and TIA entry for two fields; application-level AES-GCM with a managed key achieves the same with code we control. |

## Consequences
- Positive: a leaked database dump exposes CV text but no contactable identifier, which limits the scam and spam harm that follows a breach; equality lookups still work through the hash column; search and embeddings remain simple SQL; the LLM never sees who the candidate is.
- Negative or risks: key rotation requires a re-encryption job and versioned ciphertexts; a lost key is unrecoverable data; prefix or fuzzy search on email is impossible by design; CV text in plaintext still leaks under a bad RLS policy, so the `new-migration` skill's two-user policy test is load-bearing; the digest sender must decrypt email addresses in the worker.
- On acceptance: rewrite the `new-migration` skill's sentence "Sensitive text (phone, email, CV body) is encrypted..." to the scope above; add an `ENCRYPTION_KEY` and `HASH_KEY` to `api/.env.example`; extend BRD NFR-007 with the application-level rule; add a unit test asserting `improveWithClaude`'s input carries no name, email or phone.
- What would make us revisit this: collecting a new identifier class (NIN, BVN, bank account), which joins the encrypted set automatically; a regulator or counsel reading of GAID 2025 requiring encryption of CV content; a search design that no longer needs server-side full-text over the CV body.

## Verification
Checked in the repository on 2026-10-24: `api/src/ai.ts` builds its input from `summary`,
`education`, `skills`, `certifications`, `nyscStatus` and `work` fields only, omitting
`basics.name`, email and phone; the `new-migration` skill prescribes `*_enc` columns for phone,
email and CV body and a `tsvector` column on the same body; no migration or table exists yet.
Snippet of vendor page, not fetched (TOOLING.md): Supabase's column-encryption page recommends
against new pgsodium usage and keeping keys outside the database. Fetched: nothing on this
topic. Assumed: that Supabase's at-rest encryption covers backups and replicas (confirm on the
Pro plan page); that Infisical or the host's secrets store is the key location (TOOLING.md
names Infisical, unpriced). Not checked: GAID 2025's exact wording on encryption of personal
data, which counsel should confirm (CR-13).
