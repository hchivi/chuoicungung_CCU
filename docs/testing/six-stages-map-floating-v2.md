# CCU lifecycle map: approved floating-board v2 — 2026-10-05

Delivered scope: `/ban-do-6-giai-doan` only. The user approved option 1, hero 1, the floating six-card board from screenshot 1, and six-color phase cards. No backend, database, URL, shared navigation/footer, dependency, deployment or commit changes. Existing unrelated working-tree edits are preserved.

## Design and customer path

Taste + redesign-existing-projects guided a premium industrial exhibition, not an analytics dashboard. Dials: variance 7, motion 3, density 5. The initial audit found a small flat ring, a split hero that lacked the requested prominence, predominantly green phase cards, and forced 288–355px card bodies with unnecessary empty space.

Shipped:

- Full-width industrial photographic hero, forest-green scrim, uppercase preserved title, clear primary CTA and six functional stage shortcuts.
- One page-only floating board: CCU logo in the center; six raised, gently tilted native button cards around it. Each card contains its actual three phase titles, not the legacy diagram's different phase descriptions or fictional supplier totals.
- Purple, emerald, orange, blue, amber and red identity borders with corresponding readable dark inks, light surfaces and stronger selected states. The six-color palette is a user-approved semantic system; green still owns primary actions.
- A selected-stage photographic summary below the board, compact phase cards without forced blank heights, preserved task/need/role details, keyword disclosures and canonical links.
- Board selection reveals/focuses the relevant phase list. Phase selection reveals/focuses its details. The hero rail reveals the board. Overview and the return link work with keyboards, not just pointers.
- CSS hover lift/tilt, no automatic animation, new motion engine, WebGL canvas, scroll hijacking or continuous event loop. Reduced motion disables hover movement and uses immediate navigation.

Intentional exceptions: radial symmetry reproduces the user reference; three phase cards mirror the actual data grouping; stage numbers are meaningful; the cinematic dark-green photographic hero is explicitly approved on an otherwise bright page; protected en-dashes remain. Global typography is inherited, not replaced. No new bitmap was generated: the existing 1600×600 lifecycle cover and six stage photos are reused. Their provenance and data boundaries remain documented in `six-stages-map-redesign.md`; they are illustrations, not verified CCU event/company evidence.

Desktop board height is 850px (920px from 1024–1199px to accommodate narrower cards). Below 1024px, the board becomes two columns; below 640px, one column. No overlapping targets or horizontal overflow in measured viewports, including the center button.

## Preservation and TDD

Production edits followed an initial RED run of the extended page tests: 8 pass, 3 fail (missing palette helpers, missing cinematic/floating CSS and old SSR layout). Final target: 11/11 PASS. Full frontend suite: 64/64 PASS.

Unchanged parsed six-stage/eighteen-phase dataset SHA-256: `136f1da869c4e261b52388666532db3d904625abb60d9619af39c339ddccd2c2`.

Unchanged orientation-keyword source block SHA-256: `ce2299242c0d48d03cd0bcaae0e7d7c5de9df23f7401329c8e4570dee90fe898`.

Tests verify selection/overview normalization, saved-state corruption, parent-stage consistency, Vietnamese keyword URL encoding, all six palettes' distinct inks and text contrast >=4.5 on white/tinted/selected surfaces, responsive/reduced-motion rules, six native board controls, all eighteen canonical board phase titles, three initial phase controls, canonical stage/phase links and no fictitious proof.

Commands:

```sh
node --test src/pages/__tests__/sixStagesMap.test.js
node --test src/pages/__tests__/*.test.js
node --test --experimental-test-coverage --test-coverage-include='src/pages/sixStagesMapUi.js' src/pages/__tests__/sixStagesMap.test.js
node docs/testing/qa-six-stages-map.mjs
npm run build
```

Helper coverage: lines 100%, functions 100%, branches 96.43%. Not a claim about full React/project coverage. Node's existing experimental localStorage warning is harmless; tests pass. No frontend lint/typecheck script exists, so neither is reported as PASS. Targeted tracked diff whitespace check passes; unrelated existing App whitespace is unchanged.

## Browser and build evidence

Ephemeral headless Chrome on localhost, not the user's Zen window. No signed-in user, real submission, publishing or database mutation. Selection/language persistence is tested only in that temporary profile.

Eight widths, each exercising six stages and eighteen phase selections: 320, 375, 414, 768, 900, 1024, 1280, 1920. Additional short-display/bilingual checks: VI 375×812 and 1440×800; EN 320×812, 1024×900 and 1280×1000.

PASS: hero CTA visible; uppercase title; eagerly loaded visible imagery; no target overlap or horizontal overflow; every board phase title; six distinct computed phase surfaces; hero shortcuts; phase-list and detail focus; every preserved task/need/role; all overview titles/summaries; keyword disclosure; saved overview/phase; corrupt/mismatched storage; reduced-motion static hover; visible keyboard outline; actual canonical phase-page navigation. Critical page exceptions: 0. Observed HTTP >=400: 0.

Last local-development run (variable cache; not production field CWV, throttled Lighthouse or INP):

| Width | LCP ms | CLS |
| --- | ---: | ---: |
| 320 | 476 | .002413 |
| 375 | 184 | 0 |
| 414 | 152 | 0 |
| 768 | 108 | 0 |
| 900 | 112 | .000019 |
| 1024 | 116 | .001082 |
| 1280 | 136 | 0 |
| 1920 | 136 | 0 |

Build PASS: 2223 modules transformed, 12.67s; existing >2000KB chunk warning remains (enterprise snapshot ~42MB uncompressed). No data/bundle restructuring outside this page's scope. Standalone lint/typecheck, screen-reader/axe audit and formal pixel regression are not performed; without an approved pixel baseline the latter is INCONCLUSIVE, not PASS.

Visually inspected desktop hero, entire floating board, phase cards, mobile hero and mobile board. Screenshots: `/tmp/ccu-stages-v2-hero-1280.png`, `/tmp/ccu-stages-v2-board-1280.png`, `/tmp/ccu-stages-v2-phases-1280.png`, `/tmp/ccu-stages-v2-hero-375.png`, `/tmp/ccu-stages-v2-board-375.png`. Screenshots are temporary review evidence, not committed golden baselines. Earlier screenshots/report are retained as history.

## Self-evaluation

Summary: 4.2/5 across five quality axes.

| Axis | Score | Evidence / remaining gap | Improvement |
| --- | ---: | --- | --- |
| Accuracy | 4 | Data/keyword hashes, 64 tests and browser journeys pass; production performance is not measured. | Measure production field performance after a separately authorized deployment. |
| Completeness | 4 | All three approved elements, mobile/bilingual layout and interactions delivered; current checks are not a full screen-reader audit. | Add screen-reader/axe testing to the accessibility QA task. |
| Clarity | 4 | Stage colors, phase focus and next actions are distinct; protected phase summaries still contain specialist terms. | Review those terms only if a separate content revision is approved. |
| Actionability | 5 | Existing running localhost serves the result, verified canonical links and executable tests; no new dependency/configuration needed. | None required for this local handoff. |
| Conciseness | 4 | Duplicate overview and forced card heights removed; six full preview cards deliberately repeat phase names for navigation. | Evaluate scanability with customer feedback before shortening protected copy. |

Critical issues (axes <=2): none. Self-check: the approved combination is visibly implemented without losing the six-stage/eighteen-phase workflow; final aesthetic acceptance belongs to the user. Top follow-ups are production performance verification and a full accessibility audit, not blockers to this scoped local redesign. Verdict: deliver the local redesign, with no claim of a production deployment or database readiness.
