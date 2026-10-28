#!/usr/bin/env bash
# Single verification entry point, used locally and in CI.
# The checks and their order are defined in
# docs/decisions/0005-verification-strategy.md.
#
# Prerequisites: Node 22 (see .nvmrc), `npm ci`, and
# `npx playwright install chromium`.

set -euo pipefail

cd "$(dirname "$0")/.."

step() {
  echo
  echo "==> $1"
}

step "Checking shell script syntax"
bash -n scripts/verify.sh

step "Checking required project files"
required_files=(
  AGENTS.md
  CLAUDE.md
  README.md
  PRODUCT.md
  docs/architecture.md
  docs/decisions/README.md
  .claude/settings.json
  package-lock.json
)
missing=0
for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "  missing: $file"
    missing=1
  fi
done
if [[ "$missing" -ne 0 ]]; then
  echo "FAIL: required files are missing"
  exit 1
fi

step "Checking Node.js environment"
node -e '
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 12)) {
    console.error(`FAIL: Node ${process.version} found; 22.12 or newer is required (run: nvm use)`);
    process.exit(1);
  }
'
if [[ ! -d node_modules ]]; then
  echo "FAIL: dependencies are not installed (run: npm ci)"
  exit 1
fi

step "Formatting (prettier)"
npm run --silent format:check

step "Linting (eslint)"
npm run --silent lint

step "Type checking (astro check)"
npm run --silent check

step "Unit tests (vitest)"
npm run --silent test

step "Production build (astro build)"
npm run --silent build

step "End-to-end and accessibility tests (playwright + axe)"
npm run --silent test:e2e

echo
echo "OK: verification passed"
