---
name: adr
description: Record an architecture or product decision as an ADR in docs/adr/. Use this whenever a choice is made between alternatives with lasting consequences (a library, a vendor, a data model, a pricing rule, a security posture, a repository split) and whenever the user says "let's go with", "we decided", "document why we chose", or asks what was decided earlier. Also use it to supersede an earlier decision. Two founders will forget why a choice was made within a month; the ADR is what they read instead of re-arguing it.
argument-hint: <short decision title>
---

# Write an architecture decision record

## Why this matters here

The plan, the BRD and the tooling report contain dozens of recommendations with caveats
("verify before budgeting", "snippet, not fetched"). When one becomes a real decision, the
reasoning and the alternatives considered need a home that is shorter than the plan and
survives the next rewrite of it. ADRs are that home. They are also what a third engineer
reads on day one.

## Procedure

1. List `docs/adr/` and read `docs/adr/README.md` (the index). Pick the next number.
   If the folder is empty, create the index with the table header shown below.
2. Search the existing ADRs and `docs/PLAN.md` for the same topic. If an ADR already
   covers it, this is a supersession: write a new ADR and mark the old one
   `Superseded by ADR-NNNN` in its status line. Do not edit the old reasoning.
3. Write `docs/adr/NNNN-<kebab-title>.md` from the template below. Keep it to one screen.
   The value is in "Alternatives" and "Consequences", not in a long context section.
4. Add a row to the index. Then link the ADR with one sentence from `docs/PLAN.md` or
   `docs/ARCHITECTURE.md` whenever the ADR adds, narrows or changes a commitment those
   documents state or imply (including supplying a "when" they left open), so readers of
   the plan are not misled by a stale or vaguer recommendation.
5. If the decision changes code conventions, add or adjust the matching line in
   `CLAUDE.md` so future sessions follow it without reading the ADR. CLAUDE.md already
   points at `docs/adr/`, so a first ADR needs no further mention there.

## Template

```markdown
# ADR-NNNN: <Title in the imperative, e.g. "Use Voyage voyage-4-lite for job embeddings">

- Status: Proposed | Accepted | Superseded by ADR-NNNN
- Date: YYYY-MM-DD
- Deciders: <names>
- Related: whichever apply of PLAN.md §<section>, BRD <ids>, ARCHITECTURE.md, TOOLING.md, ADR-NNNN

## Context
Two to five sentences. What forced the decision now, and the constraint that matters most
(cost, Nigerian market fit, two-person team, compliance).

## Decision
One paragraph in the present tense. What we do, where in the code it shows up.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| ... | ... |

## Consequences
- Positive: ...
- Negative or risks: ...
- What would make us revisit this: a concrete trigger (a price, a metric, a date).

## Verification
What was checked before deciding and what is still assumed. Mark anything taken from a
search snippet or vendor claim as unverified.
```

## Index format (`docs/adr/README.md`)

```markdown
# Architecture decision records

| ADR | Title | Status | Date |
|---|---|---|---|
| [0001](0001-example.md) | ... | Accepted | 2026-10-24 |
```

## Finish

Reply with the ADR number, title and status, the one-line decision, and which documents
were linked or updated. Keep the ADR itself out of the chat reply; the file is the record.
