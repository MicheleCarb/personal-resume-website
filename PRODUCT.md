# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated: Astro with static output, chosen because the site is bilingual (built-in i18n routing avoids duplicating markup per language), career data benefits from schema-validated content collections, pages ship no JavaScript by default, and GitHub Pages subpath deployment is supported through the `base` setting. To be confirmed against alternatives during architecture definition and recorded as an ADR in `docs/decisions/`.

## Users

Primary: recruiters and hiring managers evaluating a software engineer, often arriving from LinkedIn on a phone, with seconds to judge fit. They need roles, dates, current position, and core skills at a glance, plus a resume to download or forward.

Secondary: engineers and tech leads who follow links to GitHub or expand stage details for technical depth.

## Product Purpose

A personal resume website that presents one software engineer's education and career clearly enough to support a hiring decision, and memorably enough to be recalled afterwards. Success: a recruiter can identify the current role, career progression, and key skills within a short scan, and can reach LinkedIn, GitHub, or the resume in one step.

## Positioning

The career is presented as a software-delivery pipeline: completed education and roles are passed stages, the current role is the running stage, and the future is a pending next build. The metaphor is native to the owner's profession and doubles as a chronological resume, so it carries meaning rather than decoration. It is inspired by CI/CD tooling such as Jenkins but must not reproduce Jenkins or read as an administration dashboard.

## Capabilities and Constraints

- Static site on GitHub Pages; no backend, database, authentication, or CMS.
- Published in English and Italian. Italian content must be supplied or approved by the owner, not machine-translated without review.
- Career stages have exactly three states: completed (`SUCCESS`), current (`RUNNING`), and future (`PENDING` / `NEXT BUILD`). The future stage names no speculative employer or role.
- Stage details use progressive disclosure; the page remains useful without JavaScript.
- Links to LinkedIn and GitHub, and a downloadable resume.
- Open decisions: whether projects sit inside the pipeline or in a separate section; whether an email address or location is public; light/dark mode; custom domain later.

## Brand Commitments

- Qualities: restrained, professional, technical, clear, accessible, fast, distinctive without being gimmicky.
- The pipeline is the single memorable concept; everything around it stays quiet.
- Status semantics: green for completed, blue for running, neutral grey for pending, always paired with a text label and marker.
- Explicitly rejected: generic portfolio-card grids, purple gradients, glassmorphism, fake terminals, decorative dashboards, meaningless metrics or charts, excessive rounded containers, large or continuous animation.

## Evidence on Hand

None yet. Name, title, introduction, career stages, dates, skills, links, photo, and resume PDF are all to be supplied by the owner. Nothing may be invented: no placeholder employers, achievements, metrics, testimonials, or future roles presented as fact.

## Product Principles

1. A resume first: scannability and chronology outrank the metaphor whenever they conflict.
2. The metaphor must carry information (status, sequence, current position), never only decorate.
3. Truthful and owner-supplied: every fact on the page comes from the owner.
4. Small and fast: every dependency and feature must earn its place.

## Accessibility & Inclusion

- Status is never conveyed by color alone.
- Full keyboard access with visible focus; logical reading order for screen readers.
- Motion respects `prefers-reduced-motion`; the running stage stays identifiable with motion disabled.
- Works on mobile and desktop; vertical pipeline on small screens, layout chosen by readability on larger ones.
- Correct `lang` attributes for English and Italian pages.
