# 0001. Static site with Astro

- Status: Accepted
- Date: 2026-10-28

## Context

The site is a small, bilingual (English/Italian) resume with one signature component, the career pipeline. Requirements: static output for GitHub Pages, content separated from presentation, validated career data, minimal dependencies, and no JavaScript needed to read the page.

Options considered:

- **Plain HTML/CSS/JS**: zero dependencies, but two languages mean duplicating every page by hand, or writing a custom build script to merge data and templates.
- **Lightweight static generator (Astro, 11ty)**: built-in templating and i18n; Astro adds TypeScript-validated content collections.
- **React framework (Next.js)**: capable, but ships a client runtime and a large dependency tree for a single static page.

## Decision

Use **Astro** with static output and TypeScript, **without a UI framework integration** (no React/Vue/Svelte). Pin Astro to an exact version at initialization (7.3.x, which requires Node 22.12 or newer); the Node version is pinned in `.nvmrc`.

## Consequences

- Pages render to plain HTML and CSS; interactivity uses native elements (`<details>`/`<summary>`), so the site works without JavaScript.
- Career data is validated against a schema at build time (see [0004](0004-content-model.md)).
- Contributors need Node 22 LTS locally.
- Astro major upgrades are a deliberate change, not automatic.
