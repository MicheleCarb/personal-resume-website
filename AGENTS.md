# Agent Guidelines

Tool-neutral expectations for any AI assistant (Claude Code, GitHub Copilot, or other) working in this repository. Tool-specific files should reference this one rather than repeat it.

## Project

A small, static personal resume website, to be hosted on GitHub Pages. No backend, database, or authentication.

The technology stack has **not** been selected yet. Do not initialize a framework, create `package.json`, or install dependencies until the stack decision is recorded in `docs/decisions/`.

## Content integrity

- Never invent personal information: names, dates, employers, institutions, roles, achievements, skills, projects, links, or contact details.
- Use only content the owner explicitly provides. Where content is missing, use a clearly marked placeholder such as `[PLACEHOLDER: LinkedIn URL]`.
- Do not embellish or exaggerate supplied facts. Grammar and consistency fixes are fine.

## Workflow

Work in small, independently verifiable increments:

1. Agree on the scope of the increment.
2. Before changing files, state the commands you will run, the files you will create or modify, and any dependency you intend to add (with a justification).
3. Implement only that increment. No unrelated refactors or "while I'm here" additions.
4. Run `./scripts/verify.sh` and any focused checks.
5. Review the complete diff.
6. Report changed files, verification results, warnings, and remaining work.

**Never create commits or push** unless the owner explicitly asks.

## Where things live

| Topic | Location |
|---|---|
| Architecture and stack | `docs/architecture.md` |
| Architecture decision records | `docs/decisions/` |
| Verification entry point | `scripts/verify.sh` (CI runs the same script) |
| Product context (users, purpose, constraints) | `PRODUCT.md` |
| Design system | `DESIGN.md`, created by the Impeccable design workflow once a visual direction is built |

Record significant technical decisions as ADRs in `docs/decisions/` instead of scattering rationale across other files.
