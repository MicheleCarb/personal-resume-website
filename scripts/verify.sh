#!/usr/bin/env bash
# Single verification entry point, used locally and in CI.
#
# No technology stack has been selected yet, so this only checks the
# repository governance files. Lint, type-check, test, and build commands
# will be added here once the stack is chosen.

set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Checking shell script syntax"
bash -n scripts/verify.sh

echo "==> Checking required project files"
required_files=(
  AGENTS.md
  CLAUDE.md
  README.md
  docs/architecture.md
  docs/decisions/README.md
  .claude/settings.json
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

echo "==> Validating JSON configuration"
if command -v python3 >/dev/null 2>&1; then
  python3 -m json.tool .claude/settings.json >/dev/null
else
  echo "  skipped: python3 not available"
fi

echo
echo "NOTE: No technology stack selected yet. Stack-specific checks"
echo "      (lint, type-check, tests, production build) will be added"
echo "      after the stack decision is recorded in docs/decisions/."
echo
echo "OK: verification passed"
