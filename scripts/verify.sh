#!/usr/bin/env bash
# Single verification entry point, used locally and in CI.
#
# The application has not been initialized yet, so this only checks the
# repository governance files. The stack checks listed in
# docs/decisions/0005-verification-strategy.md are added with the foundation.

set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Checking shell script syntax"
bash -n scripts/verify.sh

echo "==> Checking required project files"
required_files=(
  AGENTS.md
  CLAUDE.md
  README.md
  PRODUCT.md
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
echo "NOTE: Application not initialized yet. Stack checks (format, lint,"
echo "      type check, unit tests, build, accessibility tests) are added"
echo "      with the foundation increment; see ADR 0005."
echo
echo "OK: verification passed"
