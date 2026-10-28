# Personal Resume Website

Source for a small, static personal resume website, to be published on GitHub Pages.

## Status

A static, bilingual (English at `/`, Italian at `/it/`) Astro resume site, to be published at `https://michelecarb.one`.

## Setup

Requires Node 22 (pinned in `.nvmrc`).

```bash
nvm use
npm ci
npx playwright install chromium
```

## Development

```bash
npm run dev       # local dev server at http://localhost:4321
npm run build     # production build into dist/
npm run preview   # serve the production build
npm run format    # apply Prettier formatting
npm run images    # regenerate favicon, touch icon and link-preview image
```

## Verification

```bash
./scripts/verify.sh
```

Runs formatting, lint, type checks, unit tests, the production build, and end-to-end accessibility tests against the build ([ADR 0005](docs/decisions/0005-verification-strategy.md)). CI runs the same script on every push and pull request.

## Open items

- **CV PDF** (`TODO(cv)`): add `public/cv/michele-carbone-cv.pdf`, set `links.cv` in `src/content/profile.yaml`, and remove the `test.fixme` and the "coming soon" assertion in `tests/e2e/shell.spec.ts`. Until then the site shows "CV (PDF): coming soon".
- **Italian review**: all Italian text is a draft pending owner review.

## Documentation

- [AGENTS.md](AGENTS.md): development workflow and expectations for AI assistants
- [PRODUCT.md](PRODUCT.md): product context
- [docs/architecture.md](docs/architecture.md): stack, structure, and deployment
- [docs/decisions/](docs/decisions/): architecture decision records
