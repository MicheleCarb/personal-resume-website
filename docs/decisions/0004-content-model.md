# 0004. Career content model

- Status: Accepted
- Date: 2026-10-28

## Context

The career pipeline must represent completed, current, and future stages; group several roles at one employer; show overlapping stages; and exist in two languages without the facts drifting apart.

## Decision

Career data lives in Astro content collections validated with Zod schemas: one file per stage under `src/content/stages/`, plus a single profile file.

```ts
Stage {
  id: string
  kind: 'education' | 'work' | 'next'
  status: 'success' | 'running' | 'pending'
  organization?: string | Localized   // e.g. Polytechnic of Turin / Politecnico di Torino
  employmentNote?: Localized
  location?: string | Localized
  parallelWith?: string            // id of an overlapping stage
  steps: Step[]                    // roles within the stage; none for 'next'
  technologies?: string[]
  link?: URL
}
Step {
  role: Localized
  start: 'YYYY' | 'YYYY-MM'        // year only when the month is unknown
  end: 'YYYY' | 'YYYY-MM' | null
  summary?: Localized
  highlights?: Localized<string[]>
}
Localized = { en: string; it: string }
```

Facts (dates, technologies, links) are stored once; prose is localized, and names that differ by language (institutions, cities) may be localized. Dates keep the precision of the source: a year-only date is never padded with an invented month.

Validation rules, enforced at build time and covered by tests:

- exactly one `running` stage, whose last step has `end: null`;
- at most one `pending` stage, with no organization and no dates;
- only the running stage's last step may have an open end;
- dates are well-formed and `start` ≤ `end`;
- `parallelWith` references an existing stage whose dates overlap;
- steps within a stage are ordered oldest first;
- English and Italian highlight lists have the same length;
- every Italian field is present (enforced by the schema), and no `[PLACEHOLDER` text reaches the production build.

Single-stage rules run inside the Zod schema; collection-wide rules run in `getStages()` and fail the build. All rules live in `src/content/stage-rules.ts`, which is unit-tested directly.

## Consequences

- Updating the resume means editing data files, not components.
- Invalid or incomplete content fails the build instead of shipping.
- Stages are rendered newest first; ordering is derived from dates, not file order.
