# ADR-0012: Keep Resend behind an EmailProvider interface with suppression state in Postgres; open SES at 100,000 users and move the digest stream to it before 500,000

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: ADR-0005 (amended by this ADR); ADR-0006; ADR-0011 (the Node job runner); INFRASTRUCTURE.md §Email, §Recommendation per layer, §Conclusion, §What could not be verified; PLAN.md §Ship a PWA (Phase 1 row), §Run matching (cost table "Email" row); BRD INT-06, NFR-013, CR-15; `.claude/skills/email-template/SKILL.md`

## Context
ADR-0005 chose Resend for all transactional and digest mail and named "volume above roughly
500,000 emails a month" as its revisit trigger, an author's estimate. INFRASTRUCTURE.md priced
the digest at scale under a 5.9-emails-per-user-per-month model: Resend's Enterprise tier
begins at 3 million emails a month (about 510,000 registered users) and its overage runs 3 to 6
times Amazon SES, which has no plan ceiling, Managed Dedicated IPs with automatic warm-up and a
50-recipient bulk-template call. Resend's outage history (81 incidents since February 2024, a
two-hour delay on 15 February 2026) argues for a second provider behind a circuit breaker.
Cloudflare Email Service is still a beta with a 50-recipient cap, an unpublished daily quota
and no webhooks. The constraint is that a provider move must not drop suppressions, which would
spike the spam rate past Gmail's 0.3% threshold on a stream warmed over months.

## Decision
Resend remains the provider for Phase 0 and Phase 1, as ADR-0005 says, but from the first
template every send goes through an `EmailProvider` interface in `api/src/emails/` (send one,
send a batch, parse a webhook), and suppressions and unsubscribes live in a Postgres table
written from provider webhooks and the RFC 8058 one-click endpoint, never only in the
provider's suppression list. The digest and transactional mail run as separate streams from
separate subdomains. At roughly 100,000 registered users (about 590,000 emails a month) we
open an Amazon SES account in `eu-west-2`, verify the digest subdomain there and start warming
Managed Dedicated IPs; the digest stream moves to SES (`SendBulkTemplatedEmail` in pgmq batches
of 50 users from the Node job runner) before 500,000 registered users. Resend, or Postmark if
Resend's transactional reliability disappoints, stays for OTP fallback, receipts and dunning,
and as the failover behind a circuit breaker for the digest. Cloudflare Email Service is not
adopted for the digest.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Amazon SES from day one | Cheapest at every tier (about $1 a month at 1,000 users) but needs an AWS account, IAM, sandbox exit, SNS bounce and complaint plumbing and reputation management before any volume justifies it; two founders in Phase 0 should spend that time on the product. |
| Resend Enterprise at volume | Quote-based from 3 million emails a month; INFRASTRUCTURE.md's extrapolation is $2,700 to 3,500 a month at one million users against SES at about $1,490, widening to 3 to 6x at 10 and 50 million. The 10 requests-per-second account limit also needs a support ticket before 100,000 users. |
| Cloudflare Email Service | Beta; 3,000 emails included then $0.35 per 1,000 (3.5x SES); 50 recipients per message; "conservative daily quota" with no published figure (one forum report of 200 a day); no dedicated IPs, no bounce or complaint webhooks. A candidate for Worker-originated transactional mail once generally available, not for a 300,000-recipient Tuesday morning. |
| Postmark for the digest | Pauses accounts that send promotional mail on a transactional stream and requires its Broadcast stream; $1.20 to 1.80 per 1,000, five to seven times SES. Kept as a transactional fallback option only. |
| SendGrid Pro or Mailgun Scale | Both top out at 2.5 million emails a month (about 424,000 users here), which is below the point where the move pays. |

## Consequences
- Positive: the provider move is a configuration change plus warm-up, not a rewrite, because templates already return `{ subject, html, text, headers }` and the interface hides the vendor; suppressions survive the move so the spam rate does not spike; transactional mail is isolated from digest reputation and from a Resend outage; the email line falls from an extrapolated $2,700 to 3,500 to about $1,490 a month at one million users.
- Negative or risks: a second vendor (AWS) joins the CR-15 Transfer Impact Assessment; Managed Dedicated IPs cost about $2,600 a month more than self-managed IPs at 59 million emails, accepted to keep warm-up off two founders' plates; running two providers means two webhook formats to normalise into the suppression table; SES's `af-south-1` endpoint is an untested alternative to `eu-west-2`.
- On acceptance: ADR-0005's Status line reads "Accepted; amended by ADR-0012"; the `EmailProvider` interface and the suppression migration are created with the first template (the `email-template` and `new-migration` skills apply); PLAN.md's cost row keeps "Resend" for the Phase 1 figures and gains "SES from 500,000 users" for the top row.
- What would make us revisit this: 100,000 registered users (opens SES and starts warming); 500,000 registered users or a Resend Enterprise quote (completes the digest move); a Resend incident delaying OTPs (moves transactional mail to the second provider early); Cloudflare Email Service reaching general availability with published quotas, webhooks and dedicated IPs (candidate for Worker-originated transactional mail only); Gmail or Yahoo changing bulk-sender rules in a way that favours one provider's tooling.

## Verification
Search snippets of vendor pages, not fetched (INFRASTRUCTURE.md): Resend Pro $20 for 50,000,
Scale from $90 for 100,000, dedicated IP add-on $30, overage about $0.90 falling to $0.46 per
1,000, Enterprise from 3 million emails a month, 10 requests-per-second account limit; SES
$0.10 per 1,000, Managed Dedicated IPs $15 a month plus $0.08 per 1,000 falling to $0.02,
Virtual Deliverability Manager $0.07 per 1,000, `SendBulkTemplatedEmail` 50 recipients per
call, automatic warm-up; Cloudflare Email Service beta status (October 2026 docs), $0.35 per
1,000, 50 recipients per message; Gmail's 0.3% spam-rate threshold and November 2025
enforcement. Estimates: the 5.9-emails-per-user-per-month model and every user-count
threshold (100,000 and 500,000) derive from it; Resend's Enterprise rate is an extrapolation
because none is published. Unverified: Cloudflare Email Service's daily quota rests on one
forum post; its webhooks, dedicated IPs and acceptable-use wording on digest mail were not
addressed by any source; the SES Managed Dedicated IP band above 100 million emails. Checked in
the repository: no email code exists yet, so the interface and suppression table cost nothing
to add now; the `email-template` skill already mandates string builders, a text part and RFC
8058 headers.
