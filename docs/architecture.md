# Architecture

## Status

No technology stack has been confirmed. The proposed stack is Astro with static output (rationale in [PRODUCT.md](../PRODUCT.md#stack)); it becomes binding only once recorded as an ADR in [decisions/](decisions/). This document will then describe the stack, project structure, and build/deployment pipeline.

## Fixed constraints

- Static output, deployed to GitHub Pages.
- No backend, database, authentication, or server-side runtime.
- Minimal dependencies.
- Content must be easy to update without touching presentation code.
