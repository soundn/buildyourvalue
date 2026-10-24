# ADR-0010: Suppress a listing on one signed-in user report, pending human review within one business day

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: BRD BR-003, BR-005, BR-004, BRL-004, FR-011, FR-026; PLAN.md §Run matching (scam filter), §Compliance (consumer trust row); ARCHITECTURE.md §API endpoints; CLAUDE.md §Product rules; `api/src/review.ts`; `frontend/src/components/TrustFooter.tsx`

## Context
The documents disagree on how many user reports hide a listing. `api/src/review.ts`
`publishableJobs()` and the ARCHITECTURE.md endpoint row require two reports; BRD BR-005 reads
as one report suppressing pending review; the landing page says "One report from you suppresses
it pending review" and the TrustFooter promises "we pull it within one business day". The
constraint is trust: PLAN.md's risk register says one fake listing in a paid digest could be
fatal, and 84% of Nigerian adults met a scam last year, so the cost of a false suppression (one
listing hidden for a day) is far below the cost of a scam listing staying live after a warning.

## Decision
One report from a signed-in user suppresses the listing from digests and matches immediately,
and it stays suppressed until a human approves or rejects it in `admin` within one business day
(BR-005). Two abuse limits apply: a user may file at most three reports per day, and a listing
from a verified employer (BR-004 badge, Phase 2) needs two independent reports before
suppression, because verified employers are the likeliest target of competitor or spite
reports. Anonymous reports are not accepted; the report control requires a session. Every
report and decision is written to the audit log that `admin` already shows. The product copy
("one report", "within one business day") is the contract; the code follows it.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Keep two reports (current code) | Cheaper to moderate and resistant to a single malicious report, but a scam listing stays live after the first warning, and a free-tier user may be the only person who saw it that week. Contradicts BR-005 and the published promise. |
| Suppress only after human review | Avoids false suppressions entirely, but breaks the one-business-day promise overnight and on weekends, exactly when WhatsApp scam campaigns run. |
| Weighted reports (trusted reporters count more) | Better in principle, but needs reporter history we do not have at launch; add as a Phase 2 refinement once report volume exists. |

## Consequences
- Positive: the code, the BRD and the footer say the same thing; a scam listing is out of circulation within seconds of the first report; the review queue, not the user, bears the cost of a false report.
- Negative or risks: a determined user can hide up to three listings a day; employers may complain about suppression without notice, so `admin` needs a fast approve path and an employer notification; moderation load grows with users and must be measured (BR-057 scam reports per 1,000 listings).
- On acceptance: change `publishableJobs()` in `api/src/review.ts` from `>= 2` to `>= 1` (and the doc comment "reported twice"), add the per-user daily limit and the verified-employer exception to `reportJob()`, require authentication on `POST /v1/jobs/:id/report`, and update the ARCHITECTURE.md endpoint row; fix the `add-endpoint` skill's citation of BR-005 for `publishableJobs()` (BR-003 and BRL-004 are the right ids).
- What would make us revisit this: false-suppression rate above roughly 30% of reports once volume exists; reports per 1,000 listings high enough that one-business-day review is missed; a verified-employer programme large enough that the two-report exception needs its own policy.

## Verification
Checked in the repository on 2026-10-24: `api/src/review.ts` line 51 suppresses at
`reports.get(j.id)?.count >= 2` unless human-approved; `reportJob()` has no per-user limit and
the endpoint has no authentication; `frontend/src/app/page.tsx` says "One report from you
suppresses it pending review"; `frontend/src/components/TrustFooter.tsx` says "we pull it within
one business day"; ARCHITECTURE.md's endpoint row says two reports. BRD BR-005 text confirmed.
Estimates, not measured: the three-per-day limit, the 30% false-suppression threshold and the
assumption that verified employers attract spite reports; no report data exists yet. Nothing in
this record comes from a vendor claim or search snippet except the 84% scam-exposure figure,
which PLAN.md cites from the Global Anti-Scam Alliance via TechEconomy (search summary).
