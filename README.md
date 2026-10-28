# Personal Resume Website

Source for a small, static personal resume website, to be published on GitHub Pages.

## Status

Architecture is defined; implementation has not started. The site will be a static, bilingual (English/Italian) Astro site published at `https://michelecarb.one`.

Requirements: Node 22 LTS (see `.nvmrc` once the foundation is initialized).

## Verification

```bash
./scripts/verify.sh
```

CI runs the same script on every push and pull request. Stack checks (format, lint, type check, tests, build, accessibility) are added when the foundation is initialized; see [ADR 0005](docs/decisions/0005-verification-strategy.md).

## Documentation

- [AGENTS.md](AGENTS.md): development workflow and expectations for AI assistants
- [PRODUCT.md](PRODUCT.md): product context
- [docs/architecture.md](docs/architecture.md): stack, structure, and deployment
- [docs/decisions/](docs/decisions/): architecture decision records
