# Homepage paired logo gears — 2026-10-05

Scope: only `src/components/home/DualGearsMatchingSection.jsx`, its new local stylesheet/helper, and tests/docs. No homepage layout, shared chrome, backend, database, asset overwrite, dependency, commit or deployment changes. Existing unrelated work is preserved.

User journeys derived from the screenshots and request: a factory sees its need on the left; a supplier sees the corresponding solution on the right; both keyword groups change together; either side opens a real existing route; customers can choose a stage or pause movement to read.

## Delivered design

Taste influenced the result: actual multicolor brand assets, clear white stationary circular centers, thin outlines and an unobtrusive contact connector; no monochrome mask, violet glow or fictitious live matching status. Dials: variance 4, motion 6, density 5. Symmetrical paired geometry and constant linear rotation intentionally express the user's gear metaphor. This is a stylized logo mechanism, not a physically accurate involute-gear simulation. Existing typography and bright theme are inherited.

Both rotors use `/logo_only.png`, inspected against image 2. The original image is not edited. CSS scales it around its transparent padding. Rotors turn in opposite directions at equal 36-second periods; the right rotor is offset half a six-petal pitch (30 degrees). Upright text does not rotate. Each 4.5-second timeout changes both groups through the same selected-stage object. Manual stage choice restarts that timer. One cleaned-up timer, no per-frame React state, WebGL or continuous JS animation loop.

Pause/resume controls stop rotation and keyword cycling. Live reduced-motion preference, a hidden tab, an offscreen section and focus on a changing hub link also stop automatic movement. Media/visibility listeners, the observer and timer all clean up on unmount. Mobile below 768px uses vertically interlocking gears rather than unreadable miniature side-by-side circles. Green primary actions remain; the right hub now opens the existing supplier directory rather than a posting form.

Preserved all six `MATCHING_STAGES` records, including keyword pairs, summaries and slugs. Exact source-block SHA-256: `be60a6a4180b7b4a79aca0f2a120bcaa16b828c8eceb41966372fe09cb6b7679`. The displayed pairs are the existing explanatory categories, not live verified database matches or guaranteed recommendations.

## TDD and verification

Before production edits: new target 1 PASS / 4 FAIL. Expected failures: missing cycling/pause helpers, absence of two actual multicolor logo images/native hubs/pause control and missing scoped animation CSS. Existing data-preservation test passed.

After implementation:

| Guarantee | Evidence | Result |
| --- | --- | --- |
| Six demand/solution pairs and canonical stage URLs preserved | Source hash + bundle assertions | PASS |
| Cycle wraps and handles invalid indices safely | Pure helper tests | PASS |
| Pause/reduced motion/hidden/offscreen/focus gates automatic updates | Unit tests + browser tests for all except actual OS tab hiding | PASS |
| Two native hub links, two original logo images, six controls and pause button | SSR | PASS |
| Equal opposite rotation, white outlined hubs, connector and mobile/reduced-motion rules | CSS assertions + browser | PASS |
| Every stage fits at seven widths without horizontal overflow, hub overlap or text bounding-box overflow | Headless Chrome | PASS |
| Actual transform changes, real 4.5-second paired change, pause stable for 4.7 seconds and resume | Headless Chrome, no accelerated clock | PASS |
| Keyboard focus visible, hub focus freezes changing target, native stage route works | Headless Chrome | PASS |

Commands actually run:

```sh
node --test src/pages/__tests__/dualGearsMatching.test.js
node --test src/pages/__tests__/*.test.js
node --test --experimental-test-coverage --test-coverage-include='src/components/home/dualGearsUi.js' src/pages/__tests__/dualGearsMatching.test.js
node docs/testing/qa-dual-gears.mjs
npm run build
```

Results: 5/5 target tests; 69/69 full frontend tests; helper lines/functions/branches 100% (not a claim of full component/project coverage). Browser widths 320, 375, 414, 768, 1024, 1280, 1920, all six stages at each. Page exceptions 0; observed HTTP >=400 responses 0. Browser runs use an ephemeral headless Chrome profile on localhost only, no user accounts/submissions and no interaction with the user's Zen window.

One QA run passed every assertion but retained a Node/CDP transport after its Chrome child had closed. Only that identified QA process was stopped. The script now bounds its own browser shutdown and exits after all successful awaited checks; a fresh complete run returned PASS with exit code 0. No user's browser was terminated.

Build PASS, 2226 modules, 16.25s. Existing large snapshot-chunk warning remains (~42MB enterprise chunk uncompressed); no unrelated bundle/data restructuring. No frontend lint/typecheck script exists. No checkpoint commits: Git metadata is read-only and commits are outside this task. No credential code was introduced.

Inspected screenshots: `/tmp/ccu-dual-gears-1280.png`, `/tmp/ccu-dual-gears-arena-1280.png`, `/tmp/ccu-dual-gears-arena-375.png`; final normal-motion screenshot `/tmp/ccu-dual-gears-running-1280.png`. These are review evidence, not approved pixel baselines. Formal visual regression is INCONCLUSIVE. No Lighthouse dependency is installed; production CWV/INP, Safari, actual OS tab-background behavior and a complete axe/screen-reader audit are not claimed. Hidden-tab gating is unit-tested and its listener cleanup reviewed.

## Self-evaluation

Summary: 4.2/5. Accuracy 4: hash, 69 tests and real-clock browser behavior verified; physical gear meshing is intentionally stylized. Completeness 4: requested visual/motion delivered across widths; Safari and actual background-tab behavior are not browser-tested. Clarity 4: static centers and paired words are readable; the smallest viewport still needs compact supporting text. Actionability 5: ready on running localhost, no new setup/dependency. Conciseness 4: fake status and ambient glow removed; full stage labels remain for navigation. None <=2. Improvements: cross-browser/manual accessibility testing and customer feedback on small-screen scanability. Self-check: the requested multicolor two-sided mechanism is visible and operable; final aesthetic acceptance belongs to the user. Verdict: deliver local change, no production deployment claim.
