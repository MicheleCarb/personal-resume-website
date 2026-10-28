# Personal Resume Website

Source for a small, static personal resume website, to be published on GitHub Pages.

## Status

Foundation in place: a static, bilingual (English at `/`, Italian at `/it/`) Astro site, to be published at `https://michelecarb.one`. Page content is not implemented yet.

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
```

## Verification

```bash
./scripts/verify.sh
```

Runs formatting, lint, type checks, unit tests, the production build, and end-to-end accessibility tests against the build ([ADR 0005](docs/decisions/0005-verification-strategy.md)). CI runs the same script on every push and pull request.

## Documentation

- [AGENTS.md](AGENTS.md): development workflow and expectations for AI assistants
- [PRODUCT.md](PRODUCT.md): product context
- [docs/architecture.md](docs/architecture.md): stack, structure, and deployment
- [docs/decisions/](docs/decisions/): architecture decision records
