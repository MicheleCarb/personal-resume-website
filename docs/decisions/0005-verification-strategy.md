# 0005. Verification strategy

- Status: Accepted
- Date: 2026-10-28

## Context

Each increment must be verifiable locally and in CI with the same commands. Accessibility and responsive rendering are core requirements, not polish.

## Decision

`scripts/verify.sh` is the single entry point; CI runs it unchanged. In order:

1. governance checks (required files, JSON validity)
2. `prettier --check` (with `prettier-plugin-astro`)
3. `eslint` (with `eslint-plugin-astro` and `typescript-eslint`)
4. `astro check` (TypeScript and template diagnostics)
5. `vitest run`: unit tests for content-model rules
6. `astro build`: production build
7. `playwright test` against the built site (Chromium only), with `@axe-core/playwright` accessibility scans at 360px and 1280px, in both languages and both color schemes

Until the content model exists, Vitest runs with `--passWithNoTests` rather than placeholder tests.

## Consequences

- One command answers "is this increment done?".
- CI installs Playwright's Chromium, which adds time to each run; this is accepted for real accessibility coverage.
- Any new check is added to `verify.sh`, never only to CI.
