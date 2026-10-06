# Homepage SUPPI / CHAINY — approved duo stage

Implemented locally on 2026-10-06. Scope: the existing homepage assistant block, its approved preview A, scoped colors and tests. No backend, database, Dify configuration, route registration, production deployment or shared navigation/footer changes.

## User requirements delivered

- Preserve the approved screenshot composition: large SUPPI at upper left, original laptop mascot pair in the middle, large CHAINY at lower right, light mint stage.
- SUPPI name and CTA are blue; CHAINY name and CTA are pink. The rest of the public site's green branding is unchanged.
- Lower the mascot pair relative to the original preview. Names are on local layer 1, mascots on layer 2; captions, explanations and actions remain readable. No automatic animation or opacity effect is introduced.
- Explain the purposes without promising automated delivery: SUPPI helps clarify product/specification/location, look up suppliers and prepare quotation requests; CHAINY helps prepare connection information, meetings, samples, quotations and next steps.
- Keep the exact existing `/mascots/suppi-directions.webp?v=8` and `/mascots/chainy-directions.webp?v=8` assets and laptop poses. No regeneration or recoloring of either mascot.
- Preserve `/tro-ly-ai?assistant=suppi` and `/tro-ly-ai?assistant=chainy`. The production block uses React Router links; preview A uses native links.

Taste + Hallmark influenced the shared, non-card-grid composition, scoped tokens, restrained movement, readable copy and responsive layout. The approved screenshot takes priority over inventing another layout. This is a component redesign, not a new page: sitewide hero/nav/footer rotations and new theme controls are intentionally out of scope.

## Implementation

- `src/components/home/AssistantDuoStage.jsx`: shared stage, purpose copy, original sprite clipping, reserved image boxes and image-error fallback.
- `src/components/home/AssistantDuoStage.css`: scoped styling, mobile stack, foreground layer order, blue/pink actions, focus/press/disabled/state styling and reduced motion.
- `src/components/home/SuppiChainyConciseSection.jsx`: preserves the existing homepage mount and delegates to the new stage.
- `src/components/home/AssistantHomepageOptions.jsx` and `.css`: preview A shares the production component; B and C remain alternatives.
- `tokens.css` and `design.md`: record the explicit blue/pink exception for this block only.

## Verification evidence

1. RED before implementation: three new homepage contract assertions failed as expected. GREEN: `node --test src/pages/__tests__/assistantDuoStage.test.js src/pages/__tests__/assistantHomepageOptions.test.js` — 7/7 pass.
2. `node docs/testing/qa-assistant-stage.mjs` — 8 viewport widths pass: 320, 375, 414, 768, 1024, 1280, 1440 and 1920. No document/component horizontal overflow, both names remain on one line, both original images load, CTA targets are at least 48px tall, and computed gradients remain distinct blue/pink under the site's actual shared CSS.
3. Both CTA links navigate with keyboard Enter to their existing URL/query. Focus rings are visible. Simulated mascot image failures preserve both names and both links. No page exceptions in the checked flow.
4. Measured WCAG ratios: SUPPI name/mint 6.30:1; CHAINY name/mint 5.21:1; white-ish CTA text/blue gradient stops 5.82–7.18:1; CTA text/pink gradient stops 5.21–5.94:1; muted copy/surface 7.33:1. All checked text pairs exceed 4.5:1.
5. Preview regression check `node docs/testing/qa-assistant-options.mjs` — 24 combinations pass (3 variants × 8 widths), keyboard selection for both desk tasks, three image-failure cases and invalid-option fallback.
6. `npm run build` passes (14.18 seconds for the last color revision). Existing large data-bundle warnings remain; this task does not claim to resolve page-wide performance.
7. Full frontend suite: 84 tests, 81 pass, 3 fail in the existing `dualGearsMatching.test.js` assertions. The failures concern demand/solution pair contents, old gear markup and old animation selectors, not this assistant block. No gear source or tests were edited in this task.
8. Final screenshot captures are in `/tmp/ccu-home-assistant-stage-{320,375,414,768,1280,1920}.png`. Review captures exclude the sticky global navigation from the component crop; no runtime navigation style was changed.

The first browser-harness attempt queried before the lazy homepage had mounted; explicit render waits fixed the harness. A subsequent keyboard pass also needed to wait after returning to the lazy homepage. These were test-timing fixes, not application changes.

## Design gate review and limitations

Hallmark component review: Roman display typography, no fabricated metrics, no fake browser chrome, no nested card grid, one icon library, scoped semantic colors, named spacing scale, explicit layering, short non-wrapping CTAs, responsive image tracks and instant keyboard focus. The screenshot's original mascots and user-selected blue/pink are intentional brand exceptions. No inputs, carousel, hero, navigation or footer were added, so their structural gates are not claimed as new work. No full-page 58/58 assertion is made.

No committed visual-regression baseline, Lighthouse/Core Web Vitals score or complete accessibility audit is available for this change. Manual screenshot review and targeted geometry/contrast/keyboard checks are the evidence provided. No chat message was sent; assistant routing behavior inside the existing AI workspace, Gemini/Dify responses and live coordination integrations are not verified or changed here. No git commit was made, and no production deployment was performed.

## Self-evaluation

Overall 4.6/5: accuracy 4 (verified rendering, routes and colors; AI behavior not verified); completeness 4 (requested block delivered with responsive/error checks; no baseline or full accessibility audit); clarity 5 (roles and boundaries explicit); actionability 5 (mounted on the running homepage, repeatable tests); conciseness 5 (short visible purpose copy, no unsupported statistics). No axis ≤2. Verdict: deliver the scoped frontend change; retain the unrelated gear failures and backend verification limitations explicitly.
