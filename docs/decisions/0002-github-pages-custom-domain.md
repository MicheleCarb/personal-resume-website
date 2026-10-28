# 0002. GitHub Pages via Actions on a custom domain

- Status: Accepted
- Date: 2026-10-28

## Context

The site must be hosted statically at no cost. The owner's identity is unified under the handle `michelecarb`, and the site will live at `michelecarb.one`. Serving from a repository subpath (`/personal-resume-website/`) would require base-path handling for every asset and link.

## Decision

- Deploy to **GitHub Pages** with a GitHub Actions workflow using only the official `actions/*` actions (`checkout`, `setup-node`, `upload-pages-artifact`, `deploy-pages`).
- Deploy only after the verification job passes, on pushes to `main`.
- Workflow permissions are limited to `contents: read`, `pages: write`, `id-token: write`.
- Serve from the custom domain root: Astro `site: 'https://michelecarb.one'`, no `base`.

## Consequences

- No base-path handling in application code.
- Manual one-time setup by the owner: Pages source "GitHub Actions"; DNS `A`/`AAAA` records for the apex and a `www` `CNAME` to `micheleCarb.github.io`; domain verification in GitHub account settings; custom domain and "Enforce HTTPS" in repository Pages settings.
- The repository must remain public for free GitHub Pages hosting.
- No server-side headers or redirects are available.
