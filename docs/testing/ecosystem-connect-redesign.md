# Ecosystem closing CTA — 2026-10-07

Scope: `/he-sinh-thai`, final CTA only. Hallmark influenced the asymmetric statement/photo composition, clear role-specific actions and removal of the centered blue gradient. Runtime fonts, shared navigation/footer, content above the CTA and existing destinations remain unchanged.

## Checks

- RED: four new component tests initially failed because the component did not exist.
- GREEN: `node --test src/pages/__tests__/ecosystemConnect.test.js src/pages/__tests__/ecosystemServicePages.test.js` — 17 passed.
- Browser: `node docs/testing/qa-ecosystem-connect.mjs` — widths 320, 375, 414, 768, 1024, 1280, 1440 and 1920. No document/local horizontal overflow; all four borders present; loaded local image; both CTA labels remain one line with 50px targets.
- Both CTA clicks render the existing `/dang-nhu-cau` and `/tao-ho-so` pages. No form submission or external write performed.
- Keyboard focus visible; Tab moves between the two actions. Reduced-motion mode checked. Nine palette pairs exceed 4.5:1 (lowest 7.36:1). This is a scoped check, not a complete accessibility certification.
- Screenshots reviewed at desktop and mobile; tablet capture retained. No committed visual baseline exists, so automated visual regression comparison is inconclusive.
- `npm run build` succeeds. Existing large-data-chunk warning remains unrelated to this component.
- No backend/data change, deployment or new image generation.

## Design review

P4 H4 E4 S4 R5 V4: clear buyer/supplier purpose, distinct statement/action hierarchy, reserved image geometry, no decorative icons/metrics, responsive layout and scoped tokens. Existing project typography overrides are deliberately inherited; local line-height/weight overrides keep this component compact. Page-level hero/nav/footer and form-only state gates do not apply. Links have default/hover/focus/active styles, not simulated loading/error/success states.

## Self-evaluation

Overall: 4.0/5. No critical issues.

| Axis | Score | Evidence / improvement |
| --- | --- | --- |
| Accuracy | 4 | Tests and real browser navigation verify both routes. A complete site-wide regression run is outside this component check. |
| Completeness | 4 | Requested block replaced and eight widths checked. Final visual preference still requires user review. |
| Clarity | 4 | Each role has purpose, preparation and one action. Production copy may be shortened further after customer feedback. |
| Actionability | 4 | Runs on existing localhost with working destinations. This is not a deployment. |
| Conciseness | 4 | One extracted component and scoped stylesheet. Mobile necessarily stacks the two role paths. |

Self-check: the implementation is verifiable; whether it is sufficiently attractive is the user's judgment, not a test result. Suggested next refinement only if needed: user review of the new composition, rather than additional decorative elements.
