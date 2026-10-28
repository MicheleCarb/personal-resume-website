# Development Conventions

These apply once application code exists. Workflow rules are in `AGENTS.md`.

- Prefer the platform: semantic HTML and CSS before JavaScript, native elements before custom widgets.
- Keep content (resume data) separate from presentation.
- Accessibility is a baseline requirement: keyboard operability, visible focus, sufficient contrast, `prefers-reduced-motion` support, and no information conveyed by color alone.
- Do not add a dependency when a few lines of code will do. Justify every new dependency in the increment plan.
- Match the existing style, naming, and comment density of surrounding code.
- When the stack changes verification needs, update `scripts/verify.sh` and keep CI calling that script rather than duplicating commands.
