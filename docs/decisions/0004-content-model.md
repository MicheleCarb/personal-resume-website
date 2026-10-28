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
  organization?: string
  employmentNote?: Localized
  location?: string
  parallelWith?: string            // id of an overlapping stage
  steps: Step[]                    // one or more roles within the stage
  technologies?: string[]
  link?: URL
}
Step {
  role: Localized
  start: 'YYYY-MM'
  end: 'YYYY-MM' | null
  summary: Localized
  highlights?: Localized<string[]>
}
Localized = { en: string; it: string }
```

Facts (organizations, dates, technologies, links) are stored once; only prose is localized.

Validation rules, enforced at build time and covered by tests:

- exactly one `running` stage, whose last step has `end: null`;
- at most one `pending` stage, with no organization and no dates;
- only the running stage's last step may have an open end;
- dates are well-formed and `start` ≤ `end`;
- `parallelWith` references an existing stage;
- every Italian field is present before release, and no `[PLACEHOLDER` text reaches the production build.

## Consequences

- Updating the resume means editing data files, not components.
- Invalid or incomplete content fails the build instead of shipping.
- Stages are rendered newest first; ordering is derived from dates, not file order.
