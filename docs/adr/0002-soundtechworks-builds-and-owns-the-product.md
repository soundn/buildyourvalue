# ADR-0002: SoundTechWorks builds and owns Build Your Value

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: PLAN.md §Naming, §Compliance; BRD §1 Document control, §11 CR-05, §19 Open question 1; ADR-0001

## Context
The plan assumed a new limited company would be incorporated for the product, and the BRD
listed the entity question as its first open item. The founder has an existing company,
SoundTechWorks, and a second founder, Philip, is joining to run the project. The constraint
that matters most is compliance: the entity named on the CAC record, the NDPC registration,
the Paystack merchant account and the footer must all be the same, and a business name
cannot take Startup Act labelling or investment.

## Decision
SoundTechWorks is the builder and legal owner of Build Your Value. The product ships as
"a SoundTechWorks solution": that line and SoundTechWorks' CAC number appear in the app
footer, the privacy notice and the Paystack merchant descriptor. The product brand (working
name Build Your Value; Ladda recommended) is registered as a trading name of SoundTechWorks,
not as a separate company. Philip's participation is structured inside SoundTechWorks (equity,
options or a shareholders' agreement), which is a founder-level decision outside this record.
Until the user says otherwise, the co-founder brief shared with Philip does not yet carry
the SoundTechWorks framing; the repository and all product documents do.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Incorporate a new Ltd for the product | Duplicates CAC, NDPC, tax and bank setup for a two-person team before revenue exists. Revisit if an investor requires a clean-cap-table vehicle. |
| Register the brand as a standalone business name | A business name cannot hold Startup Act labelling or take investment, and would split the compliance identity from the operating company. |
| Build under Philip and the founder personally with no entity | No contract counterparty for Paystack, employers or state programmes; unlimited liability. |

## Consequences
- Positive: one compliance identity; CAC, NDPC, VAT and Paystack onboarding happen once; the
  trust footer can show a real registration number from day one.
- Negative or risks: SoundTechWorks' existing activities and liabilities sit alongside the
  product; if it is not a limited company, Startup Act labelling and investment need a
  restructure first.
- What would make us revisit this: an investor term sheet requiring a dedicated vehicle, or
  confirmation that SoundTechWorks is a business name rather than a Ltd.

## Verification
Decided by the founder in this session. Still unverified: whether SoundTechWorks is a CAC
limited company or a business name; whether its registered objects cover recruitment,
training and software services; whether a Labour Act private-employment-agency licence is
required for an AI matching service (BRD CR-05). These three items stay on the Phase 0
checklist in PLAN.md and BRD §19.
