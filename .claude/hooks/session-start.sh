#!/bin/bash
# SessionStart hook: make the workspace ready for typecheck, tests and builds.
# Runs only in Claude Code cloud sessions; local developers install once themselves.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Install workspace dependencies (idempotent; npm install reuses the cached container state).
npm install --no-audit --no-fund

# Build the shared core package so api, frontend and admin can resolve @byv/core.
npm run build -w core

# Make Playwright reuse the preinstalled Chromium instead of downloading one.
echo 'export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1' >> "${CLAUDE_ENV_FILE:-/dev/null}"
