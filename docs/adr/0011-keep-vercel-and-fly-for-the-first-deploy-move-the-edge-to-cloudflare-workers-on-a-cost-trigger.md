# ADR-0011: Keep Vercel and Fly.io for the first deploy; move the edge to Cloudflare Workers at a $150 Vercel bill or 200,000 users, splitting the API into Workers and a Node job runner

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: ADR-0008 (amended by this ADR); ADR-0001; ADR-0006; INFRASTRUCTURE.md §Hosting, §Data and identity, §Recommendation per layer, §Conclusion, §What could not be verified; PLAN.md §Run matching (lean stack paragraph, "Hosting" cost row); BRD NFR-006, NFR-016, CR-15; ARCHITECTURE.md §How to split later

## Context
ADR-0008 chose Fly.io London for the Hono API and Vercel Pro behind Cloudflare's free tier for
`frontend` and `admin`, and named a $150 monthly hosting bill as its revisit trigger without
saying what happens then. INFRASTRUCTURE.md costed the alternatives from 1,000 to 50 million
registered users: below 100,000 users the stacks are within a few hundred dollars of each
other, but Vercel's per-request and per-gigabyte meters make it 5 to 19 times the Workers bill
from one million users, Vercel has no Lagos point of presence while Cloudflare has served from
Lagos since 2018, and Cloudflare's own data products (D1, Durable Objects, Vectorize) cap out
in ways that force hand-sharding. The constraint is two founders' operations time now and a
usage meter that diverges by an order of magnitude later.

## Decision
ADR-0008 stands for the first production deploy and the Phase 0 and Phase 1 scale: the Hono
API on Fly.io London, `frontend` and `admin` on Vercel Pro behind Cloudflare. Web hosting moves
to Cloudflare Workers (with Static Assets) via `@opennextjs/cloudflare` when the monthly Vercel
bill passes $150 or registered users pass 200,000, whichever comes first; before that move,
`admin` is deployed to a Workers preview as the low-risk pilot. At the same point the API
becomes two deployables: hot request-response paths (auth-gated reads, listing pages, the match
endpoint) run on Workers and reach Supabase through Hyperdrive using the direct connection
string and a Postgres driver, with Hyperdrive query caching disabled for any query touching
personal data; a Node job runner on Fly.io or Railway keeps the digest rendering and sending,
ingestion, PDF and DOCX generation and the pgmq consumers from ADR-0006. Cloudflare's data
products (D1, Durable Objects, Vectorize) are not adopted; Supabase Postgres stays the system
of record, and any Workers binding used in `api/` sits behind an interface so either exit stays
days of work.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Stay on Vercel indefinitely | Modelled at 5 to 19 times the Workers bill from one million users (13x against Vercel alone); no Lagos point of presence, so every request crosses an undersea cable twice; Spend Management pauses production with a 503 at the cap, a worse failure mode for users paying ₦431 to ₦800 per GB than a larger bill. |
| All-Cloudflare now, including D1, Durable Objects and Vectorize | D1 is capped at 10 GB per database (about 285,000 users each, so 35 hand-sharded databases at 10 million users), Durable Objects have no cross-user query, Vectorize has no SQL and no bulk export, and Cloudflare sells no consumer identity (Access is $7 per workforce seat), so Clerk would be needed at about $5,000 a month per million users. Cheapest at 1,000 users and most expensive from one million. |
| Move the web apps to Workers before the first deploy | OpenNext's Next.js support table changed three times in eighteen months and the Workers bundle limit is unconfirmed; the saving below 100,000 users is tens of dollars; the `admin` pilot buys the evidence without the risk. |
| Hetzner VPS with Coolify (ADR-0008's alternative) | Still rejected for the same reason: patching, backups and on-call land on two founders, and the hosting meter, not the ops time, is what the triggers address. |

## Consequences
- Positive: the first deploy follows ADR-0008 unchanged; the move has concrete triggers and a rehearsal (`admin` pilot) instead of a crisis; Workers run in the Lagos PoP by default with region-flat egress; Postgres stays portable by `pg_dump`; the Node job runner the digest needs anyway (ADR-0005, ADR-0006) is where every Node-only dependency lives, so the Workers migration never has to make Playwright or `docx` run at the edge.
- Negative or risks: two API deployables mean two deploy pipelines and a shared-code discipline between them; Workers previews and rollbacks come through Wrangler or GitHub Actions rather than Vercel's turnkey flow; Hyperdrive supports about 100 origin connections per configuration; logs must be sampled or shipped by Logpush from day one on Workers (unsampled logging is the largest cost swing); Fly.io and Railway were not priced, so the job runner is an unmodelled fixed line.
- On acceptance: ADR-0008's Status line reads "Accepted; amended by ADR-0011"; the `admin` Workers pilot and the `wrangler dev` compatibility check for `docx`, the Anthropic SDK and Hyperdrive go on the first-deploy checklist; `api/` keeps hosting bindings behind interfaces from the first production commit.
- What would make us revisit this: the $150 Vercel bill or 200,000 registered users (fires the move); the `admin` pilot or `wrangler dev` failing on a dependency the hot path needs (keeps the API whole on Fly.io and moves only the web apps); a measured Lagos latency test showing no Workers advantage; Cloudflare withdrawing OpenNext support for the Next.js major in use; Cloudflare Email Service or Vectorize reaching general availability with the caps lifted (re-opens the all-Cloudflare question, not this decision).

## Verification
Read from vendor documentation source repositories (INFRASTRUCTURE.md): Workers Paid pricing
($5 a month, 10 million requests and 30 million CPU-ms included, then $0.30 and $0.02 per
million), 128 MB memory per isolate, `node:child_process` a non-functional stub under
`nodejs_compat`, Hyperdrive included in Workers Paid with about 100 origin connections and
Cloudflare's Supabase guide recommending the direct connection string, D1 10 GB per database,
Vectorize 20 million vectors per index. Search snippets, not fetched: Vercel regional pricing
for fra1 and cpt1, the OpenNext support table, the 5-to-19x cost ratios (INFRASTRUCTURE.md's
model under its own traffic assumptions). Unverified, per INFRASTRUCTURE.md: Vercel's billing
treatment of a third-party proxy in front of it (the Cloudflare-fronted Vercel figures are an
assumption; Vercel-only figures are the upper bound); the Workers 64 MiB uncompressed bundle
limit reported for 4 September 2026; whether `docx` and the Anthropic SDK's streaming run on
Workers (inferred from Node-compatibility documentation, not tested, and already ADR-0008's
open check); no Lagos-to-London or Lagos-to-Workers latency measurement exists; no OpenNext
cold-start figure. Estimate: the 200,000-user trigger is INFRASTRUCTURE.md's interpolation of
where the Vercel bill crosses $150 (its range is 200,000 to 300,000). Checked in the
repository: no `Dockerfile`, `fly.toml`, `vercel.json`, `wrangler.toml` or `.github/` exists,
so neither ADR-0008's deploy nor this ADR's triggers have fired.
