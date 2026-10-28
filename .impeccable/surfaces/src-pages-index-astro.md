---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/it/index.astro"]
---

# Surface brief: Resume home page (EN `/`, IT `/it/`)

Approved in architecture definition (2026-10-28). Visual world and direction contract are still to be established through the new-work flow in the visual-design increment; this brief is its input.

## Job and audience

Recruiters and hiring managers, often on a phone from LinkedIn, deciding in seconds whether the profile fits. Mode: **Read**. They must grasp current role, progression, and core skills, then reach LinkedIn, GitHub, or the CV in one step.

## Outcome and proof

Success is a confident 30-second scan. Proof is the owner's real career only (see `docs/content-inventory.md`); no metrics, charts, or claims beyond it.

## Selected direction: "Build log"

- One vertical track with status markers: success (filled check), running (ring), pending (dashed hollow).
- A narrow monospace metadata gutter (status label, dates, duration) is the only tooling voice; content is typographic resume entries, no cards.
- Newest first, like a build history: Pipeline continues → Amadeus (running, three role steps) → Stellantis ∥ MSc (parallel branch) → Bachelor.
- Focal moment: the running stage. Everything else stays quiet.
- Rejected alternative: a horizontal stage strip (duplicates content, too close to Jenkins' stage view).

## Scope and boundaries

Single page per language: header (name, headline, location, links), intro, career pipeline, skills, certifications and languages, footer with build date. No projects, photo, email, or phone. Anti-goals are listed under Brand Commitments in PRODUCT.md.

## States and ranges

Five stages, one with three steps; one pair of parallel stages; collapsed summary per step and 3–8 highlights expanded. Light and dark themes following the system setting.

## Interaction and layout

Vertical at every width. Under ~640px: track plus content, metadata above titles, parallel stages stacked. From ~960px: track | metadata gutter | content (~70ch). Native `<details>` for highlights; works without JavaScript. Optional subtle pulse on the running marker only, disabled under reduced motion.

## Constraints and open decisions

WCAG 2.2 AA in both themes, status never by color alone, `lang`/`hreflang` per page. Open for the visual increment: typefaces, exact palette values, marker drawing, treatment of the parallel branch at desktop width.
