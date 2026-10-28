---
name: Michele Carbone · Career Pipeline
description: A resume drawn as one transit line, read like a station diagram.
colors:
  ground: "#ffffff"
  ink: "#14213d"
  ink-muted: "#3a4353"
  rule: "#d8dde5"
  line: "#14213d"
  on-line: "#ffffff"
  success: "#0e5631"
  running: "#16439c"
  pending: "#3a4353"
  pending-line: "#8d96a2"
  selection: "#d6e3fb"
  dark-ground: "#0d1424"
  dark-ink: "#e6ebf3"
  dark-ink-muted: "#a7b1c2"
  dark-rule: "#28324a"
  dark-line: "#dbe2ee"
  dark-success: "#4cc48a"
  dark-running: "#7eaaff"
  dark-pending: "#9aa3b2"
  dark-pending-line: "#6f7a8c"
typography:
  display:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.5rem + 3.2vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  station:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  station-running:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  role:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  status:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 800
    letterSpacing: "0.12em"
  meta:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
rounded:
  marker: "50%"
  focus: "2px"
  card: "0.5rem" # experiment-only (exp/scrollytelling pinned cards)
  branch: "2.5rem"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4.5rem"
components:
  line:
    backgroundColor: "{colors.line}"
    width: "0.75rem"
  marker-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-line}"
    rounded: "{rounded.marker}"
    size: "1.75rem"
  marker-running:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.marker}"
    size: "1.75rem"
  marker-pending:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.marker}"
    size: "1.75rem"
  details-summary:
    textColor: "{colors.running}"
    height: "2.75rem"
---

# Design System: Michele Carbone · Career Pipeline

## Overview

The career is one transit line drawn down the page, read like a station diagram. Stations are stages, the running station is where the train is now, the dashed segment above it is line under construction, and the oldest station is the line's origin. Chevrons cut into the line point upward: the line flows towards today, so completed stations read as behind the train while the page still lists the newest first for a recruiter's scan.

Everything that is not the line stays quiet: ink type on a plain ground, one heavy signage rule under the masthead, no cards, badges, charts or shadows. Light and dark follow the system setting; both are first-class.

## Colors

Restrained strategy: neutrals plus three status colours, and the status colours appear only on the line's station markers and the status codes beside them.

### Primary

- **Ink** (`#14213d` / dark `#e6ebf3`): all text, the line, the masthead rule.
- **Running blue** (`#16439c` / dark `#7eaaff`): the running marker, its status code, interactive text (Details summaries, hover, focus ring, caret).

### Status

- **Success green** (`#0e5631` / dark `#4cc48a`): completed markers and status codes.
- **Pending grey** (`#3a4353` text, `#8d96a2` dashed line / dark `#9aa3b2`, `#6f7a8c`).

### Neutral

- **Ground** (`#ffffff` / dark `#0d1424`), **ink-muted** (`#3a4353` / dark `#a7b1c2`) for dates and secondary lines, **rule** (`#d8dde5` / dark `#28324a`) for hairlines between role steps.

### Named Rules

- **Colour lives on the line.** No coloured backgrounds, borders or panels anywhere else.
- **Text colours keep a margin above AA.** The light-theme muted and status colours were darkened for an earlier text-dimming effect; text no longer dims, but keep new text colours at least as dark.
- **A status is a mark before it is a hue.** Filled check, ring, dashed ring, plus the text code; colour only reinforces.

## Typography

One self-hosted variable sans, Hanken Grotesk (OFL, via `@fontsource-variable/hanken-grotesk`), with tabular figures everywhere so dates align. No monospace: dates and durations are set in the same face as signage would be.

### Hierarchy

- **Display** (name): 800, fluid 2.25–3.5rem, tight tracking.
- **Station** (h3, organization): 800, 1.5rem; the running station grows to 2rem.
- **Role** (h4): 700, 1.125rem.
- **Body**: 400, 1.0625rem / 1.6, measure capped at 68ch; the intro is set one step larger.
- **Status code**: 800, 0.8125rem, tracked 0.12em, in its status colour, kept in English on both language versions.
- **Meta** (dates, durations, locations): 600, 0.9375rem, ink-muted.

## Layout

- Single column, max 68rem, side gutter `clamp(1rem, 4vw, 2.5rem)`.
- The line sits 1.1rem from the column edge; station content is indented 3.25rem.
- Stations are 3rem apart; role steps within a station 1.5rem apart, separated by a hairline.
- Container query on each station: from 44rem of station width, status and dates move into a 10rem left column and content takes the rest; narrower stations stack (phones, and the two parallel stations on desktop).
- From 72rem of viewport, parallel stations (when the content has any) sit side by side and the line branches into a loop that passes through the second station and rejoins in the gap below.
- Completed stations are ordered by start date, newest first.

## Elevation & Depth

Flat. No shadows and no depth effects.

## Shapes

Circles for station markers, a straight line with rounded corners only where the parallel branch turns (2.5rem radius). Everything else is square: no rounded containers.

## Components

### Line

`0.75rem` wide ink bar per segment, masked with upward chevrons. The topmost segment (above running) is a dashed pending-line pattern without chevrons; the bottom segment stops at the origin station's marker.

### Station markers

1.75rem circles centred on the line. Success: green fill, ink border, authored SVG check in the ground colour. Running: ground fill on a pale running-blue ring, with a running-blue arc spinning around it (1.1s linear, like a build in progress); under reduced motion the arc becomes a complete static ring. Pending: ground fill, dashed pending-line border. Markers are `aria-hidden`; the status is always in text.

### Parallel branch

Supported by the content model (`parallelWith`) but unused in the current content. When present: a half-width ink line drawn as a rounded loop from the main line to the second station and back, with a small muted "Parallel stages" label above it.

### Identity links

The masthead lists LinkedIn, GitHub and the website as their real addresses, split around the shared handle. A three-column subgrid aligns every `michelecarb` in one column: prefix right-aligned in ink-muted, handle in 800 ink with a rule-coloured underline (running blue on hover), suffix in 800 ink. Each link's accessible name is "<Service>: <address>". From 48rem the block sits to the right of the name; the CV link follows it.

### Details

Native `<details>`. Summary in running blue, 700, min 2.75rem tall, with a CSS-drawn chevron that rotates on open (no transition under reduced motion). Highlights are a plain bulleted list at reading measure.

### Links

Ink text, 0.1em underline at 0.22em offset, running blue on hover, 3px running-blue focus ring with 3px offset. Masthead links get 0.5rem vertical padding for touch.

### Skills and credentials

After the pipeline, two quiet sections in the same type system: a definition list of skill groups (group in 700 ink, items comma-separated in ink-muted) in an auto-fill grid of 18rem minimum columns, then certifications and spoken languages as two plain lists side by side. No bars, percentages, ratings or badges.

### Motion

- **Running spinner:** described under Station markers.
- **Section focus** (CSS `view-timeline` per station, no JavaScript): a band from 40% to 60% of the viewport (`view-timeline-inset: 40% 40%`). A station is fully in focus from a quarter of the way into its entry (its heading is centred) until a quarter into its exit, and has fully handed over by 60% of its exit, so exactly one station is in focus at a time. In focus, the marker scales to 1.3 and a 0.2rem ring in the station's status colour fades and scales in around it (`.stage::after`). Nothing is ever dimmed; the pending station never takes focus.
- Verify scroll-driven effects against a production build (`npm run build && npm run preview`): the dev server's hot reload does not reliably apply edits to these scoped styles.
- **Chevron flow:** the chevrons travel upward with page scroll (`mask-position` on `scroll(root)`).
- Opacity and transform only (plus the chevron mask position). Static under reduced motion and in browsers without scroll timelines.
- Write animation longhands, never the `animation` shorthand next to `animation-timeline`: the CSS minifier folds them into a shorthand that browsers reject.

### Pinned scrollytelling (experiment, `exp/scrollytelling`)

`src/scripts/scrollytelling.ts` adds `.is-scrolly` to the pipeline section when `(min-width: 64rem) and (prefers-reduced-motion: no-preference)` matches.

- **Stage:** sticky at a 16px offset, sized for its final state (last card open), so the pin releases exactly where that layout ends. The stations are absolutely positioned inside it; the pending row stays at the top.
- **Schedule:** measured once and on resize. Each card holds for 15vh plus any scroll needed to read content taller than its window; consecutive cards are joined by a 35vh transition with smoothstep easing. Progress `p` (0, 1, 2) is a pure function of scroll position.
- **Per card, from its distance to `p`:** weight `w = 1 - |i - p|` drives the window height (compact header to full content, capped to the viewport), the accent (border and 6% tint mixed toward the status colour), the marker scale (1 + 0.3w) and the focus ring. Previous cards scale to 0.97 and fade to 0.78; upcoming cards fade at most to 0.89. While a card holds, its content moves up inside the window to reveal overflow, easing back to its header as it collapses.
- **Card frame:** 1px border mixed from `--rule` toward the status colour, 0.5rem radius, bottom-edge fade mask so a compact window never shows a sliver of the next line. Experiment-only exception to "no cards".
- **Line:** one continuous segment on the list (`--line-top`, `--line-height`) from the first card's marker to the last, with the chevron flow; the per-station segments are hidden.
- **Following content:** offset by `--scrolly-pull` (on the page wrapper) so it always sits right under the last card; it reaches zero when the pin releases.
- **Access:** nothing is unmounted; content outside a window stays in the page. Focus entering a card scrolls to where it is fully open.

### Hero sequence (experiment, `exp/scrollytelling`)

One shared progress: every hero animation uses `animation-timeline: scroll(root)` over `0 → --hero-end` (200px, set on `.masthead`), so they move as one sequence and reverse cleanly. `src/scripts/name-split.ts` only measures, with the animation class removed so transforms never skew the numbers.

- **Layout:** from 48rem the intro is `min(32rem, 100% - 22rem)` wide, opening a right-hand column beside it.
- **Contact block:** descends by `--links-dy` (whole pixels; centred beside the intro, or 0 when the intro leaves no room) with a mid-way scale dip to 0.97 and an ease-out. Transform only, so the links stay readable and clickable and nothing reflows.
- **Name copies:** `aria-hidden`, `pointer-events: none`. "Michele Carb" ×3 and "one" are measured with DOM Ranges; each targets its handle's final (descended) position. Two legs: first into its own original handle slot (already at handle size, keeping the rows' spacing), then down with the block. Staggered by 20px of scroll, the website row first, so the rows spread rather than converge. "one" is running blue from departure. Each copy switches from name style to blue lowercase handle style sequentially (out 38–46%, in 46–54%) and fades out on landing.
- **Landing zone:** while flying, `.is-splitting` fades the real handles and suffix to 0 and dims prefixes to 0.8, restoring all at the end.
- Active from 48rem with motion allowed and scroll-timeline support; otherwise nothing is built and the links stay top right.

### Details default

The current role's first step opens by default; every other step starts collapsed.

### Raster assets

Organization logos in `public/logos/` (96×96 PNG, shown at 2.25rem on a white tile with a 1px rule ring) were supplied by the owner and resized with ffmpeg; a small image-tool watermark in the Stellantis source was painted out in its background colour (#263780).


`public/favicon.png` (64px), `public/apple-touch-icon.png` (180px) and `public/og-image.png` (1200×630) are rendered by `scripts/generate-images.mjs` from HTML using the site's font and light-theme tokens: a lowercase white "mc" monogram on ink, and a link preview showing a segment of the line beside the name, headline and the aligned `michelecarb` addresses.

## Do's and Don'ts

- **Do** keep every new piece of colour on the line or a status code.
- **Do** add stages by editing content files; the line, order and loop are derived.
- **Don't** wrap stages in cards, add badges or pills, or put a label above a heading.
- **Don't** introduce a second typeface or monospace for "technical" flavour.
- **Don't** add motion beyond the running spinner and the pipeline's scroll-driven effects, and never without a reduced-motion fallback.
- **Do** regenerate raster assets with `npm run images` rather than editing them.
