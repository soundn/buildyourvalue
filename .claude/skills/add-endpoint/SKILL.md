---
name: add-endpoint
description: Add or change an HTTP endpoint in the Build Your Value API (api/src/server.ts, Hono + Zod). Use this whenever a task adds a route, exposes core logic over HTTP, adds an admin or employer action, or wires a new call from frontend or admin to the API, even if the request only says "the dashboard needs X from the server" or "expose Y". It covers the Zod schema, the handler, the typed client in frontend/admin, the architecture table, and the smoke test.
argument-hint: <METHOD /v1/path> <one-line purpose>
---

# Add an API endpoint

The API is the only service allowed to score, match, read data or call Claude (CLAUDE.md,
"Rules that keep the split clean"). Every new capability the web apps need therefore lands
here first, and the web apps only ever get a typed client call. Follow the steps in order; each
exists because skipping it has a specific cost noted beside it.

## 1. Decide where the logic lives

- Pure computation over profiles, jobs, courses or roles belongs in `core/` as a tested
  function, and the endpoint only validates input and calls it. Reason: `core` is the part
  that will be published as `@byv/core` and reused by workers later; logic trapped in a
  handler cannot be.
- Anything touching state (the in-memory review store today, Postgres later), secrets or
  the network stays in `api/`.
- If the endpoint changes a product rule (what users may see, what they pay, what counts as
  a scam), re-read the matching line in `docs/BRD.md` and CLAUDE.md before writing code.

## 2. Validate input with Zod at the edge

Define a schema next to the others at the top of `api/src/server.ts` (or in a new
`api/src/schemas.ts` once there are more than three). Parse with `safeParse` and return
`400` with `{ error: "<snake_case_code>", issues }` on failure, exactly as `/v1/evaluate`
does. Consistent error shapes let the frontend show one error component everywhere.

Reuse `ProfileSchema` for anything that takes a profile. Do not accept fields the handler
does not use; CVs are personal data and the less the API accepts, the less it must protect.

## 3. Write the handler

- Routes are versioned under `/v1/`. Admin and staff routes live under `/v1/admin/` and
  carry the comment that they are open on localhost in the prototype and behind staff auth
  in the MVP. Keep that comment honest.
- Return JSON only. Use `c.json(body, status)`.
- User-facing listing endpoints must pass through `publishableJobs()` from `./review.js`
  so review-flagged and rejected listings never reach users (BR-005).
- Never put raw user text into a prompt string. If the endpoint calls Claude, add the call
  in `api/src/ai.ts` with a structured output schema and a rules fallback, as
  `improveWithClaude` does.

## 4. Expose it to the web apps

- Add a method to `frontend/src/lib/api.ts` or `admin/src/lib/api.ts` (or both). Keep the
  `post<T>` helper pattern so errors surface uniformly.
- Add any new shared types to `core/src/types.ts` rather than redefining them in the app.

## 5. Document and verify

- Add a row to the endpoints table in `docs/ARCHITECTURE.md`. That table is the API's public
  contract until OpenAPI generation arrives.
- Typecheck the touched workspaces: `npm run typecheck -w api` (and `-w frontend` or
  `-w admin`). The PostToolUse hook does this on each edit, but run it once more at the end.
- Smoke-test the running handler, not just the types:

```bash
cd api && PORT=4010 npx tsx src/server.ts &   # start on a spare port
sleep 3
curl -s -X POST localhost:4010/v1/<path> -H 'content-type: application/json' -d '<json>'
curl -s -X POST localhost:4010/v1/<path> -H 'content-type: application/json' -d '{}'   # expect 400
pkill -f "tsx src/server.ts"
```

Paste the two responses into the final message so the reviewer can see the happy path and
the validation failure without rerunning anything.

## Output

Finish with: the route and method, the request and response shapes, which workspaces changed,
and the two smoke-test responses. If a product rule was touched, say which BRD requirement
it maps to.
