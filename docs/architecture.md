# Architecture

A static, bilingual, single-page resume site built with Astro and deployed to GitHub Pages at `https://michelecarb.one`. Rationale for each choice is in [decisions/](decisions/).

## Fixed constraints

- Static output only: no backend, database, authentication, CMS, or server-side runtime.
- No JavaScript is required to read or navigate the page.
- Minimal dependencies; each one is justified when added.
- Content is data, separate from presentation.

## Stack

| Concern | Choice | ADR |
|---|---|---|
| Site generator | Astro (static output, TypeScript, no UI framework integration), Node 22 LTS | [0001](decisions/0001-static-site-with-astro.md) |
| Hosting | GitHub Pages via Actions, custom domain, no base path | [0002](decisions/0002-github-pages-custom-domain.md) |
| Languages | English at `/`, Italian at `/it/`, no auto-redirect | [0003](decisions/0003-bilingual-routing.md) |
| Content | Zod-validated content collections, facts stored once, prose localized | [0004](decisions/0004-content-model.md) |
| Verification | `scripts/verify.sh` mirrored by CI; Vitest, Playwright + axe | [0005](decisions/0005-verification-strategy.md) |

## Project structure

Target layout once the foundation is initialized:

```text
astro.config.mjs, package.json, tsconfig.json, .nvmrc
eslint.config.js, .prettierrc.json, vitest.config.ts, playwright.config.ts
public/
  cv/michele-carbone-cv.pdf
src/
  content.config.ts        # collection schemas
  content/stages/*.yaml    # one file per career stage
  content/profile.yaml     # identity, links, skills, certifications
  i18n/ui.ts               # UI strings (en/it) and helpers
  layouts/Base.astro       # document shell, SEO and social metadata, hreflang
  components/              # page sections and pipeline components
  pages/index.astro        # English
  pages/it/index.astro     # Italian
  styles/                  # design tokens and global styles
tests/
  unit/                    # content-model rules (Vitest)
  e2e/                     # rendering and accessibility (Playwright + axe)
```

## Build and deployment

1. `scripts/verify.sh` runs formatting, lint, type checks, unit tests, the production build, and end-to-end accessibility tests.
2. CI (`.github/workflows/ci.yml`) runs the same script on every push and pull request.
3. A deploy workflow publishes `dist/` to GitHub Pages after verification passes on `main`.

## Related context

- Product truth: [PRODUCT.md](../PRODUCT.md)
- Page design brief: `.impeccable/surfaces/src-pages-index-astro.md`
- Design system: `DESIGN.md` (created during the visual-design increment)
- Resume content and its sources: [content-inventory.md](content-inventory.md)
