# Association card design review

Preview-only comparison requested on 2026-10-07. No production route or component is imported by this entry, and `/hiep-hoi` is not replaced.

## Open

Run `npm run dev -- --host localhost --port 3002 --strictPort` from the repository root.

- A: http://localhost:3002/docs/testing/association-card-options/?option=publication — publication masthead with oversized organization acronym and complete information below.
- B: http://localhost:3002/docs/testing/association-card-options/?option=folio — open two-page dossier; identity and organization purpose opposite expertise, territory and programs.
- C: http://localhost:3002/docs/testing/association-card-options/?option=signature — compact executive directory card with expandable connection information.

Taste and Hallmark influenced structural variation, restrained CCU green, typography-led identity, absence of decorative icons/pastel covers, and progressive disclosure. Production design tokens and the real site's logo/header remain untouched. The preview imports existing tokens and adds local aliases only.

All three use the same three deduplicated source records. Existing photos are reused, not represented as newly verified official logos. Failed images retain readable initials. Source-recorded membership counts and years are labelled as profile facts; generated fallback values are suppressed. Unpublished program relationships retain title, role and date but receive no broken detail link. Published programs and organization profile links open the real app on port 3000. Catalogue availability links to the organization profile; it is not an invented PDF viewer.

“Chọn phương án” marks a preference in this preview only. Membership linking opens an explicitly labelled preview dialog; it does not submit or persist a real request.

## Verification

- `node --test docs/testing/association-card-options/preview.test.mjs`: 4/4 passing. Structural distinction, source data preservation, no fabricated defaults/links, and explicit interaction states.
- `node docs/testing/association-card-options/qa.mjs`: passing for all three options at 320, 375, 414, 768, 1024, 1280, 1440 and 1920px: 24 layout checks, no page/component overflow, visible controls at least 44px.
- Browser-tested disclosures, additional HAME programs, option selection, native dialog/Escape, keyboard focus, browser back/forward, reduced motion and eight state demonstrations.
- Six computed text/background contrast pairs range from 6.83:1 to 16.74:1.
- No browser page errors or localhost resource failures in the final run. External thumbnails may fail and are handled with initials; their availability is not guaranteed.
- Screenshots rendered at 375/768/1440px for each option in `/tmp/ccu-association-option-*.png`. Desktop and phone card screenshots were visually inspected.
- `git diff --check`: passing. No existing source file was edited for this preview.
- Hallmark component-scope review: no decorative icons, gradients, card-within-card treatment, fabricated metrics, raw colors outside tokens, hover scaling, clipping or two-line control labels. Program titles remain wrapping content links intentionally, rather than clipped button labels.
- Visual regression against a baseline: INCONCLUSIVE (new preview has no baseline). Core Web Vitals, full axe audit and screen-reader verification were not performed; this is a design-review preview, not a production accessibility/performance certification.

## Self-evaluation

Summary: 4.0/5 across five quality axes; ready for the user's design selection.

| Axis | Score | Evidence and remaining limitation |
| --- | --- | --- |
| Accuracy | 4 | Unit and browser checks pass; source organization facts have not been independently verified. |
| Completeness | 4 | Three working alternatives on a separate port, desktop/mobile checked; production application deliberately awaits the user's choice. |
| Clarity | 4 | Named alternatives and rationale are visible; final visual preference is subjective and needs user review. |
| Actionability | 4 | Direct URLs, real profile paths, functioning disclosures; preview selection is local state, not a persisted approval. |
| Conciseness | 4 | Shared model and components keep variants cohesive; hidden state-demo content is additional reviewer-only material. |

Critical issues: none. Self-check: the user can judge the three actual layouts without changing the live page; visual approval remains theirs. Next improvement after selection: integrate only the chosen card into the production directory, then run its existing filter and membership-flow regression suite. Verdict: deliver the preview as-is for selection.
