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

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: it runs `./scripts/verify.sh` (which also builds `dist/`) and, only if everything passes, publishes `dist/` to GitHub Pages. It can also be started by hand from the Actions tab (Deploy, "Run workflow").

The site is built for the domain root (`site: https://michelecarb.one`, no base path; [ADR 0002](docs/decisions/0002-github-pages-custom-domain.md)). One-time setup:

1. **Pages source:** repository Settings, Pages, Build and deployment, Source: **GitHub Actions**.
2. **Verify the domain** (prevents takeover): your GitHub account Settings, Pages, "Add a domain", `michelecarb.one`; add the TXT record GitHub shows at your DNS provider, then click Verify.
3. **DNS at your registrar** for `michelecarb.one`:
   - `A` records for the apex: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` records for the apex: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME` for `www`: `michelecarb.github.io`
4. **Custom domain:** repository Settings, Pages, Custom domain: `michelecarb.one`, Save; once the DNS check passes and the certificate is issued, tick **Enforce HTTPS**.

Until the custom domain is attached, the default `github.io` address shows the page without styles, because assets are referenced from the domain root.

## Open items

- **CV PDF** (`TODO(cv)`): add `public/cv/michele-carbone-cv.pdf`, set `links.cv` in `src/content/profile.yaml`, and remove the `test.fixme` and the "coming soon" assertion in `tests/e2e/shell.spec.ts`. Until then the site shows "CV (PDF): coming soon".

## Documentation

- [AGENTS.md](AGENTS.md): development workflow and expectations for AI assistants
- [PRODUCT.md](PRODUCT.md): product context
- [docs/architecture.md](docs/architecture.md): stack, structure, and deployment
- [docs/decisions/](docs/decisions/): architecture decision records
