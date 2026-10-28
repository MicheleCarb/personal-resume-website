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

## Selected direction: "Build log" structure in the Line Diagram world

- Structure (approved): one vertical track with station markers, a metadata column for status and dates, typographic entries, no cards; newest first; focal moment is the running station.
- World (chosen 2026-10-28 from the decision round): a metro/rail line diagram. The track is the line, stages are stations, the future is line under construction. Overlapping stages can branch as a loop (supported, unused in current content).
- Owner concern resolved in-world: the line flows upward. Direction chevrons on the track point up, the Bachelor is the origin terminus, so completed stations read as behind the train rather than after it.
- Rejected alternatives: Strip Board (air-traffic strips), Provenance Ribbon, category-standard timeline.

## Scope and boundaries

Single page per language: header (name, headline, location, links), intro, career pipeline, skills, certifications and languages, footer with build date. No projects, photo, email, or phone. Anti-goals are listed under Brand Commitments in PRODUCT.md.

## States and ranges

Five stages, one with three steps; completed stages ordered by start date (Stellantis follows the MSc, owner decision); collapsed summary per step and 3–8 highlights expanded. Light and dark themes following the system setting.

## Interaction and layout

Vertical at every width. Under ~640px: track plus content, metadata above titles, From ~960px: track | metadata gutter | content (~70ch). Native `<details>` for highlights; works without JavaScript. The running marker spins like a build in progress (owner request), static under reduced motion. Masthead shows the three addresses verbatim with the shared handle michelecarb aligned in one column.

## Constraints and open decisions

WCAG 2.2 AA in both themes, status never by color alone, `lang`/`hreflang` per page. Recorded later in DESIGN.md: exact tokens and type scale.

## Direction contract

THESIS: The career is a single transit line read like a station diagram: status, sequence and the current position are carried by the line and its station markers, not by cards, badges or charts. It refuses the dot-and-badge timeline every developer resume ships.

OWN-WORLD: White ground (deep navy-ink ground in dark mode), navy ink, one thick navy line with upward chevrons cut into it. Station markers are the only saturated colour: filled green with an authored check (completed), large blue ring with a static halo (running), dashed grey ring on dashed track (pending). One signage sans, self-hosted, with tabular figures; status codes in tracked capitals in their status colour. A heavy ink rule under the masthead like line signage.

STORY: A recruiter sees name, headline and links, then the running station first, understands progression by following the line down to its origin, and leaves through LinkedIn or the CV.

FIRST VIEWPORT: Masthead with name, headline, location and text links over a heavy ink rule; language switch top right; intro paragraph; "Career pipeline" heading; the line starting at the dashed pending station with the running Amadeus station and its newest step visible above the fold on desktop.

FORM: Line Diagram, position 1 on the ordered list (taken as IMPECCABLE'S PICK over assigned #6). seed:fbf3c92781285172

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
