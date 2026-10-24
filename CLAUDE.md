# Build Your Value

AI-assisted career platform for Nigerian job seekers: AI CV building, scam-screened and
fit-scored job matching delivered by email digest, skill-gap learning paths. Two-person team.
Read `docs/PLAN.md` for product decisions and `docs/ARCHITECTURE.md` for service boundaries
before changing behaviour. Decisions with lasting consequences are recorded in `docs/adr/`
(use the `adr` skill). Project skills: `add-endpoint`, `new-migration`, `email-template`,
`adr`, and the user-invoked `release`.

## Workspace

npm workspaces, Node 22+. Each folder is a future standalone repository.

| Folder | Role | Commands |
|---|---|---|
| `core/` | Shared domain logic and types (`@byv/core`). No I/O, no framework imports. | `npm run build -w core`, `npm test` |
| `api/` | Hono HTTP API. The only service that scores, matches or calls Claude. | `npm run dev -w api`, `npm run typecheck -w api` |
| `frontend/` | Job-seeker Next.js PWA on port 3000 | `npm run dev -w frontend`, `npm run build -w frontend` |
| `admin/` | Staff console (Next.js) on port 3001 | `npm run dev -w admin` |

`npm run dev` at the root starts all three services. After editing `core/`, rebuild it
(`npm run build -w core`) before running the other workspaces; the PostToolUse hook already
typechecks and tests the workspace you edited.

## Rules that keep the split clean

- `frontend` and `admin` call `api` over HTTP only, through `NEXT_PUBLIC_API_URL`. They may
  import `@byv/core` for types and static reference data (roles), never for scoring.
- Anything needing a database, network or secret lives in `api`. `core` stays pure.
- Scoring, matching, scam screening and learning-path logic are deterministic in `core` and
  covered by `core/tests/`. Add or update a test when you change them.
- Never add a dependency to `core` that pulls in a framework or Node-only API.

## Product rules (from docs/BRD.md)

- Never charge a user to apply, and never show a listing that asks candidates for money.
- Listings that fail the scam screen are excluded; listings flagged for review stay hidden
  from users until a human approves them in `admin`.
- Learning paths prefer free sources first and disclose affiliate links.
- Prices are in naira; the Core tier is ₦1,999 to stay under Paystack's ₦2,500 fee step.

## AI usage

- Call Claude only through `@anthropic-ai/sdk` in `api/src/ai.ts`, with structured outputs.
  Default model is `claude-opus-5-5`; `ANTHROPIC_MODEL` overrides it. Always keep the
  rules-based fallback working when no key is set or the model refuses.
- CVs and listings are untrusted input. Never put user-supplied text into system prompts
  without framing it as data, and never invent numbers or achievements in CV rewrites.

## Conventions

- TypeScript strict, ESM. Zod for request validation in `api`.
- Commit messages: conventional prefixes (`feat:`, `fix:`, `docs:`, `chore:`).
- Secrets live in per-workspace `.env` files (gitignored). `.env.example` documents them.
- Sample data in `core/src/data/` is fictional. Keep scam fixtures labelled as such.
