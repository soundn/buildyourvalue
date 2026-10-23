# Build Your Value

A SoundTechWorks solution. An AI-assisted career platform for Nigerian job seekers. Members get a CV built or
improved by AI, a personalised digest of fit-scored jobs delivered by email, and,
when the CV is weak, a curated learning path that measurably closes the gap.

> Working name. The research recommends **Ladda** as the product brand, with
> "Build your value" as the tagline and "a SoundTechWorks solution" as the
> parent line, pending domain, CAC and trademark checks.

## Status

First prototype running: CV builder, six-component weakness score, scam-screened and
fit-scored job matches, learning path, digest preview, admin review queue.
Sample listings are fictional. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Repository layout

The prototype is an npm workspace. Each folder is a self-contained service that will
move to its own repository (`buildyourvalue-core`, `-api`, `-frontend`, `-admin`).

| Folder | What it is | Port |
|---|---|---|
| `core/` | Shared domain logic and types (`@byv/core`): scoring, scam screen, matching, learning paths, rewrite rules, sample data. Unit tests live here. | library |
| `api/` | HTTP API (Node + Hono). Only service that scores, matches or calls Claude. | 4000 |
| `frontend/` | Job-seeker PWA (Next.js): onboarding, dashboard, CV, digest preview, pricing. | 3000 |
| `admin/` | Staff console (Next.js): listing review queue. | 3001 |

## Run it

Requires Node 22+.

```bash
npm install
npm run build -w core     # once, or after changing core
npm run dev               # starts api, frontend and admin together
```

Then open http://localhost:3000 and click "Load a sample profile" on the onboarding
page, or fill in your own. The admin queue is at http://localhost:3001.

Other commands:

```bash
npm test                  # core unit tests (vitest)
npm run typecheck         # all workspaces
npm run build             # all workspaces
```

### Optional AI engine

Copy `api/.env.example` to `api/.env` and set `ANTHROPIC_API_KEY` to have the
"Improve my CV" step call Claude through the Anthropic SDK with structured output.
Without a key the API uses the deterministic rewrite rules in `core`, and it falls
back to them automatically if the model refuses or the call fails. `ANTHROPIC_MODEL`
overrides the default model.

## Documents

| Document | What it is |
|---|---|
| [docs/TOOLING.md](docs/TOOLING.md) | State-of-the-art stack and tooling report: feature bar set by leading career products, AI capability stack with per-user costs, application stack layer by layer, developer tooling (plugins, skills, MCP, hooks), adoption plan and run-rate, unverified items. |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Service boundaries, the plan for splitting into separate repositories, API endpoints, and what is stubbed in the prototype versus the MVP. |
| [docs/BRD.md](docs/BRD.md) | Business Requirements Document: objectives and KPIs, scope by phase, stakeholders and RACI, 60 numbered business requirements, functional and non-functional requirements, compliance, integrations, business rules, financials, risks, milestones, go/no-go gates, open questions and traceability matrix. |
| [docs/PLAN.md](docs/PLAN.md) | The research-backed product, business and launch plan (positioning, name, pricing, MVP scope, phased roadmap, architecture, learning-path design, go-to-market, compliance, risks, metrics, and a list of what still needs verifying). |
| [docs/research/nigeria_job_seeker_market.md](docs/research/nigeria_job_seeker_market.md) | Labour-market data, job-seeker segments, channels, pain points, device and data access, willingness to pay. |
| [docs/research/competitor_landscape.md](docs/research/competitor_landscape.md) | Nigerian and global job boards, AI CV tools, learning products, alert channels, user complaints, and the gap to own. |
| [docs/research/monetization_payments_compliance.md](docs/research/monetization_payments_compliance.md) | Naira pricing benchmarks, Paystack/Flutterwave mechanics, affiliate and employer revenue, NDPA/GAID, CAC, Startup Act, VAT, scraping risk, unit economics. |
| [docs/research/technical_architecture.md](docs/research/technical_architecture.md) | Job-data sources and their terms, AI CV and matching pipeline, skills taxonomies, course APIs, email and WhatsApp delivery, stack and cost model. |
| [docs/research/upskilling_skills_demand.md](docs/research/upskilling_skills_demand.md) | In-demand roles and skills in Nigeria, the skills gap, remote work, course sources and outcomes, learning-path design, CV-weakness scoring rubric. |
| [docs/research/gtm_and_naming.md](docs/research/gtm_and_naming.md) | Growth channels, partnerships, trust building, comparable startup outcomes, positioning, naming shortlist, metrics. |

## Headline recommendations

- **Sell trust and relevance, not the CV document.** The jobs-to-be-done are "get shortlisted", "know why I failed" and "never pay a fake recruiter".
- **Price the core tier at ₦1,999/month**, under Paystack's ₦2,500 fee cliff and inside the band Spotify and YouTube have proven Nigerians pay. Offer a ₦1,999 one-off 7-day "Finished CV" pass, a ₦4,999 Pro tier, and employer and course-affiliate revenue from day one.
- **Ship a mobile PWA, not a native app**, on Next.js + Supabase/pgvector, fed by Google-for-Jobs aggregators and Remotive. Do not scrape LinkedIn or Indeed.
- **Validate before building.** Phase 0 is an eight-week paid pilot: hand-served CVs, manually curated email digests, and Paystack pre-orders. Proceed to the MVP only if 10%+ pre-pay and 40%+ open the digests.
- **Register with the NDPC before the 200th CV**, confirm SoundTechWorks is (or the product sits under) a CAC-registered limited company whose objects cover the product, and display both as trust signals.

## Caveat on sources

The research was compiled from search-result summaries because the research
environment could not open vendor, regulator or registrar pages directly.
Every figure carries its source URL, and `docs/PLAN.md` ends with a table of
items the founder must verify personally before committing money.
