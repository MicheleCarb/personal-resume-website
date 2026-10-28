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
  - Section focus while scrolling: the one station whose heading reaches the middle of the viewport has its marker grown to 1.3 and ringed in its status colour; focus hands over to the next station as you scroll. Nothing is ever dimmed, and the pending station never takes focus. The line's chevrons also flow upward with scroll.
  - **Experimental, `exp/scrollytelling` branch only:** on desktop (from 64rem wide) with motion allowed, the career pipeline becomes a sticky stage of three persistent cards (Amadeus, Stellantis, Polytechnic of Turin). Scroll position maps to one continuous progress value through a fixed, measured track; each card's position, height, scale, opacity and accent border are interpolated from it, so transitions never jump. The active card shows all of its content (a card taller than its window is read by scrolling its content within the window); previous cards recede (scale 0.97, opacity down to 0.78, the AA-safe floor) and keep a compact header with company, role and dates; upcoming cards wait below. The vertical line and markers stay continuous. Content after the pipeline follows the last card directly, so no large empty band opens. SUCCESS / RUNNING / PENDING labels, `aria-current`, reading order and all content are unchanged and reachable by keyboard and screen readers. Built with CSS sticky positioning and a small dependency-free script; native scrolling is never intercepted or snapped. Cards (border, radius, tint) are an experiment-only exception to "no cards". On phones, under `prefers-reduced-motion`, or without JavaScript, the page is the standard static pipeline.
  - **Experimental, `exp/scrollytelling` branch only — hero sequence:** over the first 200px of scroll (desktop, motion allowed), one shared scroll timeline drives the hero. Decorative `aria-hidden` copies of "Michele Carbone" split at "Carb|one": the three "Michele Carb" copies sweep right one after another into the contact rows, and "one" (in running blue) leads into ".one", so michelecarb.one is the destination. At the same time the contact block descends from the top right to the column beside the narrowed intro and settles there. The real heading and link text never change; links stay readable, focusable and clickable throughout (prefixes dim only to 0.8, AA-safe); nothing reflows and the pipeline does not move. Static on phones, under reduced motion, and where scroll timelines are unsupported.
  - Organization logos (Amadeus, Stellantis, Polytechnic of Turin), supplied by the owner, sit beside each station name on a white tile.
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
