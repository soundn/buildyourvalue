---
name: release
description: Cut a release of Build Your Value: run every check, bump workspace versions, write the changelog entry, tag, and push. User-invoked only; never run as a side effect of another task.
argument-hint: <patch|minor|major> [notes]
disable-model-invocation: true
---

# Cut a release

A release is the one moment where a mistake reaches users or another repository, so this
skill is deliberately slower than a commit. It is user-invoked only: Claude must not decide
on its own that a release is due. Work through the stages in order and stop at the first
failure; a half-finished release (tag without push, bump without changelog) is worse than
none.

## Stage 0: preconditions

- Working tree clean (`git status --short` prints nothing). Otherwise stop and say what is
  uncommitted.
- On the branch the user expects to release from. Name the branch in the final message.
- The argument names the bump: `patch` for fixes, `minor` for new features, `major` for a
  breaking change to `@byv/core`'s exported API or to an HTTP contract in
  `docs/ARCHITECTURE.md`. If it is missing, ask rather than guess.

## Stage 1: verify

Run, in this order, and paste the last lines of each into the final message:

```bash
npm run typecheck
npm test
npm run build
```

Then start the built services and run the end-to-end check the prototype shipped with:

```bash
(PORT=4000 node api/dist/server.js &) ; (cd frontend && npx next start -p 3000 &) ; (cd admin && npx next start -p 3001 &)
sleep 6 && curl -sf localhost:4000/health && curl -sf -o /dev/null localhost:3000/ && curl -sf -o /dev/null localhost:3001/
```

Stop the servers afterwards. If any step fails, fix nothing in this skill: report the failure
and end. Fixes go through a normal commit, then the release is attempted again.

## Stage 2: version and changelog

- Bump every workspace together so `@byv/core` and its consumers always share a version:

```bash
npm version <bump> --workspaces --no-git-tag-version
npm version <bump> --no-git-tag-version
```

- Update the `@byv/core` dependency pin in `api`, `frontend` and `admin` to the new version.
- Prepend an entry to `CHANGELOG.md` (create it with a "Keep a Changelog" header on first
  use): the version, the date, and bullets under Added, Changed, Fixed, Security. Derive the
  bullets from `git log <previous-tag>..HEAD --oneline`; write them for the other founder,
  not for a machine. Include anything that changes a product rule or a price.

## Stage 3: commit, tag, push

```bash
git add -A
git commit -m "chore(release): v<version>"
git tag -a v<version> -m "v<version>"
git push origin HEAD && git push origin v<version>
```

The tag is what deployment and the future repository split will key on, so it is never
moved after push. If the push is rejected, do not force; report it.

## Stage 4: hand-off

Reply with: the version, the branch and tag, the three verification outputs, the changelog
entry, and the next manual steps (today: none beyond review; once hosting exists: the
deploy command and the smoke URL). If anything in `docs/TOOLING.md`'s unverified table
became verified during this release, say so, because that table is how the team tracks
what still rests on assumptions.
