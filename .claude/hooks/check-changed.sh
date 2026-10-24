#!/bin/bash
# PostToolUse hook for Edit|Write. Reads the hook JSON on stdin, finds which workspace
# the edited TypeScript file belongs to, typechecks that workspace and, for core,
# runs its unit tests. Exit 2 feeds the errors back to Claude so it fixes them.
set -uo pipefail

file="$(jq -r '.tool_response.filePath // .tool_input.file_path // empty')"
[ -n "$file" ] || exit 0
case "$file" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
rel="${file#"$root"/}"
ws="${rel%%/*}"
case "$ws" in
  core|api|frontend|admin|mobile) ;;
  *) exit 0 ;;
esac

cd "$root" || exit 0
out="$(npm run --silent typecheck -w "$ws" 2>&1)"
status=$?
if [ "$status" -ne 0 ]; then
  printf 'Typecheck failed in %s after editing %s:\n%s\n' "$ws" "$rel" "$out" >&2
  exit 2
fi

if [ "$ws" = "core" ]; then
  out="$(npx vitest run --root core --reporter=dot 2>&1)"
  status=$?
  if [ "$status" -ne 0 ]; then
    printf 'Core tests failed after editing %s:\n%s\n' "$rel" "$out" >&2
    exit 2
  fi
fi
exit 0
