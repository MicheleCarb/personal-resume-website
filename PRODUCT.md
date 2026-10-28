# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated to the assistant and confirmed by the owner: Astro, static output. See [docs/decisions/0001](docs/decisions/0001-static-site-with-astro.md).

## Users

Primary: recruiters and hiring managers evaluating a software engineer, often arriving from LinkedIn on a phone, with seconds to judge fit. They need roles, dates, current position, and core skills at a glance, plus a resume to download or forward.

Secondary: engineers and tech leads who follow links to GitHub or expand stage details for technical depth.

## Product Purpose

A personal resume website that presents one software engineer's education and career clearly enough to support a hiring decision, and memorably enough to be recalled afterwards. Success: a recruiter can identify the current role, career progression, and key skills within a short scan, and can reach LinkedIn, GitHub, or the resume in one step.

## Positioning

The career is presented as a software-delivery pipeline: completed education and roles are passed stages, the current role is the running stage, and the future is a pending next build. The metaphor is native to the owner's profession and doubles as a chronological resume, so it carries meaning rather than decoration. It is inspired by CI/CD tooling such as Jenkins but must not reproduce Jenkins or read as an administration dashboard.

## Capabilities and Constraints

- Static site on GitHub Pages; no backend, database, authentication, or CMS.
- Published in English and Italian. Italian text is drafted by the assistant from the English and must be reviewed and approved by the owner before publishing.
- Career stages have exactly three states: completed (`SUCCESS`), current (`RUNNING`), and future (`PENDING` / `NEXT BUILD`). The future stage names no speculative employer or role.
- Stage details use progressive disclosure; the page remains useful without JavaScript.
- Links to LinkedIn and GitHub, and a downloadable resume.
- Published at the custom domain `michelecarb.one` (served from the domain root, not a repository subpath).
- No phone number or email address is published; contact goes through LinkedIn.
- Internal employer application names are not published.
- Light and dark themes follow the system setting.
- No projects section in the first version.

## Brand Commitments

- Identity: Michele Carbone, under the single handle `michelecarb` across the website (`michelecarb.one`), LinkedIn (`linkedin.com/in/michelecarb`), and GitHub (`github.com/MicheleCarb`). The three should read as one consistent presence.
- Qualities: restrained, professional, technical, clear, accessible, fast, distinctive without being gimmicky.
- The pipeline is the single memorable concept; everything around it stays quiet.
- Status semantics: green for completed, blue for running, neutral grey for pending, always paired with a text label and marker.
- Explicitly rejected: generic portfolio-card grids, purple gradients, glassmorphism, fake terminals, decorative dashboards, meaningless metrics or charts, excessive rounded containers, large or continuous animation.
- Owner-approved exceptions:
  - The running station's marker spins like a build in progress.
  - Section focus while scrolling: the station crossing the viewport's central reading band is at full opacity and its marker is highlighted on the line; the other stations are attenuated (text never below 0.78 opacity, so every text colour stays at WCAG AA). The line's chevrons also flow upward with scroll.
  - All motion is opacity/transform only (plus the chevrons' mask position), CSS-only with no JavaScript, gated behind `@supports`, and fully static under `prefers-reduced-motion` or where scroll timelines are unsupported.
- The shared handle `michelecarb` is shown verbatim in the masthead for LinkedIn, GitHub and the website, aligned so the three read as one identity.

## Evidence on Hand

Owner-supplied resume content (education, roles, dates, skills, certifications, languages, links) is collected with sources in [docs/content-inventory.md](docs/content-inventory.md). Still missing: the final resume PDF (the site shows "CV (PDF): coming soon" until it is added; see `TODO(cv)`). No photo for now. Nothing may be invented: no placeholder employers, achievements, metrics, testimonials, or future roles presented as fact.

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
