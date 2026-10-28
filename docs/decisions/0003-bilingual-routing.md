# 0003. Bilingual routing

- Status: Accepted
- Date: 2026-10-28

## Context

The site is published in English and Italian. GitHub Pages cannot perform server-side language negotiation, and automatic client-side redirects by browser language are unreliable and frustrate visitors who prefer the other language.

## Decision

- English is the default language at `/`; Italian lives at `/it/` (Astro i18n routing, `prefixDefaultLocale: false`).
- No automatic redirect. A visible language switch links between equivalent pages.
- Each page sets `lang` and declares `hreflang` alternates (including `x-default` → English).
- UI strings live in one typed module; content prose is localized in the content files (see [0004](0004-content-model.md)).
- One English CV PDF is linked from both languages.

## Consequences

- Shared URLs are stable and language-explicit.
- Every visible string needs an Italian equivalent before release; tests enforce completeness.
