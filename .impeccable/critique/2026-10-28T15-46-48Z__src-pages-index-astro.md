---
target: resume home page (section focus)
total_score: 22
max_score: 32
na_heuristics: 5,9
p0_count: 0
p1_count: 1
target_identity: "file:/mnt/d/Code/AICoding/personal-resume-website/src/pages/index.astro"
target_fingerprint: "sha256:fac19286e6acff75fa2ca47c2f9d24e3fff53fbe18eb5bad9a4afbfe5eb2c3f9"
target_path: /mnt/d/Code/AICoding/personal-resume-website/src/pages/index.astro
timestamp: 2026-10-28T15-46-48Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design-review sub-agent · B: detector/browser sub-agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | RUNNING + spinner clear on desktop; on a 360px phone the current employer is not in the first viewport |
| 2 | Match System / Real World | 3 | Metro/CI metaphor carries data, but PENDING at the top can read as "unresolved"; up-chevrons vs downward reading |
| 3 | User Control and Freedom | 3 | Native details, language switch, skip link; no way back to links from the bottom |
| 4 | Consistency and Standards | 3 | Coherent system; two identical "Polytechnic of Turin" headings; role titles repeat with the differentiator last |
| 5 | Error Prevention | n/a | Static, read-only page |
| 6 | Recognition Rather Than Recall | 3 | Status always paired with text; "Details" gives no hint of size or content |
| 7 | Flexibility and Efficiency | 2 | No CV yet, no jump to Skills; ~5,050px page on phones |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained; location repeated in intro; dead CV slot in the masthead |
| 9 | Error Recovery | n/a | No error states |
| 10 | Help and Documentation | 2 | Plain meanings of SUCCESS/RUNNING/PENDING exist only for screen readers |
| **Total** | | **22/32** | **Acceptable, edge of Good** |

## Design Specificity Verdict

LLM: authored, not interchangeable — the chevroned ink line, dashed "under construction" segment, tabular metadata column and the aligned michelecarb identity block belong to this product. Weaker: Skills and Certifications & Languages end the page in a generic resume voice; the CV placeholder occupies the masthead's most valuable slot.

Deterministic: source scan clean (exit 0). Built HTML: 6 findings (3 per language): low-contrast on hover (false positive — mixed dark-mode text token as a background), repeating-stripes-gradient (intentional dashed pending segment), marketing-buzzword "mission-critical" (true, low priority; amadeus.yaml). Overlay (headless only): stragglers ("applications.", "Master", "Manager", IT "certificato."), IT .step-summary ~91ch lines at 1280px. axe: 0 violations in 40 runs incl. dimmed states; dimmed text worst 5.14:1 light / 5.28:1 dark; dimmed markers 1.4–2.7:1 (below 3:1); light pending line 2.99:1 at full opacity. Overflow 0, console errors 0, reduced motion disables all animation.

## Priority Issues

1. [P1] Current employer not in the phone's first viewport — Amadeus sits at y≈880 at 360×800. Fix: say where the train is in the masthead ("at Amadeus IT Group") and/or hide the CV placeholder and the duplicated location sentence. Command: /impeccable layout, /impeccable clarify.
2. [P2] Section focus is plural on desktop, absent at mobile first load, and dims status markers to 1.4–2.7:1 so completed stations read as pending; the 0.78 text fade is near-imperceptible. Fix: drop the text fade, dim markers by colour-mixing toward the ground (opaque) with a ~3:1 floor, narrow the band to a reading line, exclude the pending station. Command: /impeccable animate (or /impeccable quieter).
3. [P2] Current role is ~1,800px tall on phones with details open by default, pushing the rest of the line 3–4 screens down. Fix: collapse by default below 44rem, or show the 3 quantified bullets inline. Command: /impeccable distill.
4. [P2] No exit at the end: the page ends on "French · B2" with LinkedIn/CV only at the top. Fix: a terminus row after Credentials with LinkedIn and CV in the masthead's style. Command: /impeccable layout.
5. [P3] Typesetting and copy: stragglers, IT summary over measure, role titles wrap at the middle dot with the differentiator last, "mission-critical", 7 skill groups with two agentic groups split. Fix: text-wrap pretty/balance, non-breaking separators, merge agentic groups. Command: /impeccable typeset, /impeccable clarify.

## Persona Red Flags

- Recruiter on a phone (project persona): no employer on the first screen; dead CV slot; ~2,700px to the previous employer; no LinkedIn/CV at the bottom; PENDING may read as "looking".
- Casey (distracted mobile): all actions at the top, out of the thumb zone; only visible marker on load is a 0.35 ghost.
- Jordan (non-technical first-timer): SUCCESS/RUNNING/PENDING read as jargon; consecutive "Polytechnic of Turin" stations look duplicated; up-chevrons unexplained.
- Sam (accessibility): strong semantics (aria-current, hidden meanings, focus, skip link); dimmed marks 1.8:1 contradict "mark before hue"; scaling a spinning marker adds motion load.

## Minor Observations

- Intro repeats "currently based in Nice, France".
- Technologies line repeats Skills.
- "Pipeline continues" heading as large as real employers.
- Skills grid orphans "Agentic development" at 1280px.
- Light pending dashed line 2.99:1, just under 3:1.

## Questions to Consider

- Does section focus earn its place next to the spinner and chevrons, or is the page more confident with one authored moment?
- What if the masthead said where the train is now?
- Should the line end at a real terminus that holds LinkedIn and the CV?
