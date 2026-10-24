# ADR-0005: Send transactional and digest email through Resend with plain TypeScript templates

- Status: Proposed
- Date: 2026-10-24
- Deciders: Founders (proposed by Claude from the tooling research; not yet accepted)
- Related: PLAN.md §Ship a PWA (Phase 1 row), §Run matching (delivery paragraph, cost table); BRD INT-06, §7.2, NFR-013, CR-04, CR-15; ARCHITECTURE.md §What is real and what is stubbed; TOOLING.md §The application stack; `.claude/skills/email-template/SKILL.md`

## Context
Email is the product's primary delivery channel and every planning document hedged the
provider: PLAN.md says "SES/Resend" in Phase 1 and prices the cost row as SES; BRD INT-06 and
§7.2 say "SES or Resend"; TOOLING.md recommends Resend; the `email-template` skill already
assumes plain string builders rather than React Email. Phase 0's hand-curated digests need a
provider in weeks, and the sending domain's reputation starts accruing from the first send.
The constraint is a two-person team with no AWS footprint and a deliverability bar (Gmail and
Yahoo bulk-sender rules) that one careless send can damage.

## Decision
Resend sends all transactional and digest email, from a dedicated sending subdomain with SPF,
DKIM and aligned DMARC configured and RFC 8058 one-click unsubscribe headers on every
non-transactional message from the first Phase 0 send. Templates are plain TypeScript string
builders in `api/src/emails/` returning `{ subject, html, text, headers }` as the
`email-template` skill specifies, not React Email, so they render in a queue worker with no
React runtime. The free tier (3,000 emails a month) covers Phase 0 and early Phase 1; Pro
($20 for 50,000) follows. Unsubscribes are honoured immediately (NFR-013), not at Gmail's
two-day floor.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Amazon SES | Cheapest at scale (about $0.10 per thousand) but needs an AWS account, IAM, sandbox exit, bounce and complaint handling via SNS, and our own reputation management; worth it only once volume or an AWS footprint exists. |
| Postmark | Strong transactional deliverability and good tooling, but priced above Resend at our volumes and oriented to transactional rather than digest mail. |
| Brevo | Marketing-platform pricing and feature set we do not need; the API and template model pull toward their editor rather than our code. |
| React Email templates | Pleasant authoring, but forces a React runtime into the worker that renders digests and couples email to the frontend's dependency tree. |

## Consequences
- Positive: a provider live in an afternoon; domain authentication and unsubscribe headers are set up once in the shared layout and cannot be forgotten per template; cost is immaterial at every scale in PLAN.md's table (about $17 a month at 10,000 users).
- Negative or risks: vendor lock-in is small but real (webhook payloads, suppression lists); Resend is US-hosted, so it stays on the CR-15 Transfer Impact Assessment list; the free tier's daily cap may throttle a Phase 0 send burst.
- On acceptance: add `RESEND_API_KEY` and the sender address to `api/.env.example`; create `api/src/emails/{types,layout,preview}.ts` on the first template; relabel PLAN.md's cost row and remove the remaining "SES or" hedges.
- What would make us revisit this: volume above roughly 500,000 emails a month, where SES pricing clearly wins; an AWS footprint adopted for another reason; a deliverability incident Resend cannot help diagnose; Resend raising prices or dropping the free tier.

## Verification
Snippets of vendor pages, not fetched (TOOLING.md): Resend free tier 3,000 emails a month and
Pro $20 for 50,000; SES about $0.10 per thousand (CostBench aggregator, via PLAN.md); Gmail and
Yahoo bulk-sender requirements (Bird, snippet). Fetched: the Resend MCP server README, which
is about tooling, not pricing. Checked in the repository: the `email-template` skill already
mandates string builders, a text part, RFC 8058 headers and the no-fee footer; no email code
exists yet. Estimate: the 500,000-a-month revisit threshold is the author's arithmetic on the
two snippet prices, not a quote. Open all three vendors' pricing pages before signing up.
