# ADR-0015: Use useladda.com as the first production and email domain; ladda.ng becomes primary after the CAC and trademark searches

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: PLAN.md §Keep "Build your value" as the tagline and brand as Ladda, EXECUTION_PLAN.md Step 1 and Step 2, brand/README.md, ADR-0002, ADR-0005, ADR-0012

## Context
The brand is Ladda, but `ladda.com` has been held since 1999 and is renewed to 2029, and a check of 24 alternative names on 24 October 2026 found every short `.com` taken too, so a rename would not buy a `.com`. The `.ng`, `.com.ng` and `.africa` names are free but Cloudflare Registrar does not sell `.ng`, and the plan says not to buy the primary name before the CAC and trademark searches. The team needs one real domain now for the landing page, the waitlist, Resend sending and the Paystack merchant descriptor.

## Decision
`useladda.com`, registered on Cloudflare Registrar on 24 October 2026 with Cloudflare DNS, is the first production domain. It serves the landing page and the web app, `hello@useladda.com` and `security@useladda.com` are the transactional and contact addresses through Cloudflare Email Routing, and the digest sends from the dedicated subdomain `mail.useladda.com` with SPF, DKIM and DMARC. `ladda.ng` becomes the primary domain once the CAC name search and the trademark search in classes 35, 41 and 42 are clean; `ladda.com.ng` and `ladda.africa` are bought with it as defensive registrations, and `useladda.com` then redirects to `ladda.ng` while remaining the email domain so sender reputation is not reset. `EMAIL_FROM_TRANSACTIONAL` and `EMAIL_FROM_DIGEST` in `api/.env.example` carry these addresses.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Wait for the CAC and trademark searches, then buy `ladda.ng` first | Blocks the landing page, waitlist and email warm-up by weeks; the `.com` phrase domain was cheap and reversible |
| Buy `ladda.com` from its holder | Held 27 years by a Japanese registrant and renewed to 2029; slow and expensive with no guarantee |
| `ladda.work`, `ladda.org`, `ladda.net` or `ladda.dev` | `.work` carries a spam reputation that hurts an email-first product; `.org` reads as a charity; `.net` is confused with the `.com`; `.dev` says developer tool |
| Rename the product to one whose `.com` is free | Of 24 candidates only `pathrung.com` was free and it is a weak name; the scarcity is in `.com`, not the name |
| `joinladda.com` or `laddahq.com` instead of `useladda.com` | Equivalent; `useladda.com` was chosen and bought, the others stay free as of the same day |

## Consequences
- Positive: a real domain exists today, so DNS, email authentication and the digest warm-up start in Phase 0 rather than after the trademark search. The sending domain never changes, which protects deliverability.
- Negative or risks: two domains to renew and explain; `useladda.com` is less memorable than `ladda.ng` and must redirect once the primary exists. The purchase was made before the CAC and trademark searches, so if "Ladda" fails either search the domain is a $10 write-off and the brand work in `brand/` is redone.
- What would make us revisit this: the CAC or trademark search finds a conflicting "Ladda", or `ladda.ng` is registered by someone else before the searches finish.

## Verification
Checked on 24 October 2026: Verisign RDAP shows `useladda.com` registered through Cloudflare, Inc. on Cloudflare nameservers, expiring 24 October 2027; NiRA RDAP shows `ladda.ng` and `ladda.com.ng` free; the `.africa` registry shows `ladda.africa` free; `joinladda.com`, `tryladda.com`, `myladda.com`, `laddajobs.com` and `laddahq.com` free. Assumed, not verified: the CAC and trademark registries are clean for "Ladda"; `.work` deliverability is worse than `.com` (general industry reputation, not measured).
