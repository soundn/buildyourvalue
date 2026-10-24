# ADR-0001: Keep the four services in one npm workspace until a second contributor or the first production deploy

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: ARCHITECTURE.md §Architecture and repository strategy, §How to split later; TOOLING.md (Turborepo deferral); CLAUDE.md §Workspace. No PLAN.md section or BRD id covers repository layout.

## Context
The product is four deployable services (`core`, `api`, `frontend`, `admin`) and the founders
want each to live in its own repository once building starts in earnest ("when we want to
build they should have repo for api, admin, frontend etc"). Today there are two people, no CI,
no deploy target and a prototype that changes shape weekly, so the cost of cross-repository
coordination (publishing `@byv/core`, version pinning, four pipelines) would be paid before
anything that needs it exists. The constraint that matters most is the two-person team's time.

## Decision
We keep all four services in this repository as an npm workspace (root `package.json`
`workspaces: ["core", "api", "frontend", "admin"]`), with each folder already shaped as a
standalone repository: its own `package.json`, `tsconfig.json`, scripts and `.env.example`
(`core` needs none), and `api`, `frontend` and `admin` depending on `@byv/core` by the
workspace reference `"@byv/core": "0.1.0"`. We split into four repositories
(`buildyourvalue-core` published as the private package `@byv/core`, `buildyourvalue-api`,
`buildyourvalue-frontend`, `buildyourvalue-admin`) following ARCHITECTURE.md "How to split
later" when the first of these happens: a second regular contributor joins, or the first
production deploy is set up. Until then the boundary rules in CLAUDE.md ("Rules that keep the
split clean") are what keep the split cheap.

Amended 2026-10-24 (ADR-0008): "a second regular contributor" means a regular contributor beyond the two founders; Philip is one of the two founders and his first commit does not trigger the split.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Split into four repositories immediately | Four repositories need a private registry for `@byv/core`, version bumps on every shared-type change, four CI configurations and four checkouts for one person's change. With two founders and no deploy target this is pure overhead; the folder layout already makes the later split a copy plus a dependency swap. |
| Single-repository monolith with no workspace boundaries | Fastest today, but `core` would gain framework imports and `frontend` would start scoring locally, and the split the founders want would then be a rewrite rather than a move. The workspace costs almost nothing and keeps the boundaries enforceable (separate `package.json`, typecheck per workspace). |
| Monorepo tool (Turborepo or Nx) now | Nothing here is published and four packages do not need a remote build cache or task graph; TOOLING.md already says to skip Turborepo until a measured pain appears. Adding a tool now also deepens the commitment to a monorepo the team intends to leave. |

## Consequences
- Positive: one checkout, one `npm run dev`, one `npm install`; shared-type changes land in a single commit; the PostToolUse typecheck hook covers whichever workspace was edited; no registry, tokens or publish step to maintain yet.
- Negative or risks: the workspace reference hides the publish step, so the first split will surface anything that only worked because `core` was built in place (path imports, unbuilt `dist/`, root-level dev dependencies). Service-level access control and separate release cadence are impossible until the split. A rule in CLAUDE.md is the only guard against boundary leaks; a test or lint that fails on `core` importing a framework does not exist yet.
- What would make us revisit this: either trigger above (second regular contributor, or first production deploy being set up). Also revisit earlier if a workspace needs a different Node version or deploy platform than the others, or if `npm install` or typecheck time across the four workspaces becomes a daily complaint.

## Verification
Checked in the repository on 2026-10-24: root `package.json` lists the four workspaces;
`api`, `frontend` and `admin` depend on `"@byv/core": "0.1.0"`; each folder has its own
`package.json` and `tsconfig.json`, and all but `core` have an `.env.example`; there is no
`.github/`, Fly, Railway or Vercel configuration, so the "first production deploy" trigger has
not fired. Assumed, not verified: that GitHub Packages or npm private packages will be the
registry for `@byv/core` (ARCHITECTURE.md names both; neither has been priced or set up), and
that the three service folders move to new repositories without path changes beyond the
dependency swap. The Turborepo and Nx assessment is TOOLING.md's own estimate, not a measured
build-time comparison.
