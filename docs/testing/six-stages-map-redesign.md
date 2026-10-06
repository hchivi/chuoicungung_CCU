# CCU six-stage lifecycle map — 2026-10-05

Scope: `/ban-do-6-giai-doan` only, plus a route-specific loading-height reservation in `src/App.jsx`. No backend, database, seed, migration, URL registry, deployment or commit changes. Existing unrelated edits were preserved, including the corrected `/logo_onlyc.png` breadcrumb asset.

## Customer journey and design

Taste + redesign-existing-projects influenced the result: bright industrial/editorial composition, photographic cover, one functional six-node lifecycle diagram, selected-stage photograph and description, native phase controls, task/need detail and existing ecosystem actions. Dials: variance 6, motion 3, density 5. The six category colors identify stages; green remains the action color. Heading typography inherits the existing actual Arial overrides. No theme toggle, scroll hijacking, new framework or UI dependency.

Customer journeys:

- A factory or investor locates its current stage and phase, reads the unchanged work and common needs, then opens a phase or keyword route to find sources.
- A supplier explores relevant phase needs and follows the public-demand directory.
- KCN and associations discover relevant roles and follow their existing ecosystem directories.
- A keyboard/mobile user can choose stages and phases without a hover dependency. Phase selection focuses its details; the return link focuses the phase list.

Preserved `stagesData` in `src/data/mockData.js` byte-for-byte at the parsed-data level, including all titles, summaries, tasks, common demands, outputs, roles, slugs, bilingual fields and other stored metadata. Six stages, eighteen phases. SHA-256 of original JSON: `136f1da869c4e261b52388666532db3d904625abb60d9619af39c339ddccd2c2`.

Preserved the original exported `PHASE_ORIENTATION_KEYWORDS` source block exactly: SHA-256 `ce2299242c0d48d03cd0bcaae0e7d7c5de9df23f7401329c8e4570dee90fe898`. Every keyword remains available through a native disclosure and the existing `/tu-khoa/:slug?q=...` route. No triple-repeated marquee copies.

Removed from this page's presentation, not from project data or other routes: hard-coded 24,000 verified-company claim, fabricated VIP supplier proof/financial metrics, unsourced mandatory-standards panel, mock case-study performance, fixed CTA obscuring content, and a competing 3D map with different phase wording. Replaced the invalid nested stage/phase URL with the registered canonical `/pha/:slug` route. No invented matching, supplier ranking, certifications or downloadable checklist.

## TDD evidence

Used the existing Node test runner and esbuild SSR setup; no additional testing dependency. Tests were written and executed before production edits.

Initial RED: `node --test src/pages/__tests__/sixStagesMap.test.js` — 1 pass / 5 fail. Missing selection helpers and absence of the intended interactive map were the expected failures. Preservation test already passed.

Second RED: loading-reservation and return-path regressions — 7 pass / 2 fail before the corresponding fixes. Initial browser smoke found dev CLS .186–.204; the route-specific reservation reduced it to 0 in the final measured run.

GREEN: same map target — 9/9 passed. Full frontend suite: `node --test src/pages/__tests__/*.test.js` — 62/62 passed. Existing 53 tests remain passing.

| Guarantee | Evidence | Result |
| --- | --- | --- |
| Complete six-stage/18-phase dataset and keyword block unchanged | SHA-256 assertions + SSR | PASS |
| Invalid, mismatched and missing saved choices resolve coherently | Unit tests | PASS |
| Stage/phase changes and overview preserve the correct parent | Unit tests + browser journeys | PASS |
| Canonical keyword links encode Vietnamese and reserved characters | Unit tests | PASS |
| Map has six native controls, selectable phases and no fictitious proof | SSR assertions | PASS |
| Body, muted and action colors have text contrast ≥4.5 on their surfaces | Color calculation tests | PASS |
| Choosing a phase reveals/focuses detail; return path restores list focus | Headless Chrome keyboard test | PASS |
| No horizontal overflow, overlapping nodes or missing visible images | Six viewport checks | PASS |
| No critical JS exceptions or HTTP ≥400 in checked journeys | Browser listeners | PASS |

Coverage command: `node --test --experimental-test-coverage --test-coverage-include='src/pages/sixStagesMapUi.js' src/pages/__tests__/sixStagesMap.test.js`. Helper coverage: lines 100%, functions 100%, branches 96%. This is helper coverage, not a claim of 100% React component or full-project coverage. React effects, rendering, navigation, disclosures and keyboard interactions are checked with SSR/browser tests. No checkpoint commits: workspace Git metadata is read-only and the task does not authorize commits.

## Browser/build verification

Command: `node docs/testing/qa-six-stages-map.mjs` with an ephemeral headless Chrome profile, localhost only. No real user account, payment, publishing or database mutations. Selection persistence is tested only in the ephemeral profile.

Widths: 320, 375, 414, 768, 1280, 1920. Each width exercises all six stages and all eighteen phase selections. Overview checks every original phase title/summary. Detail checks every original task/common-need/role. Additional checks: keywords, focus visibility, return navigation, saved overview/phase, corrupt storage, mismatched stage/phase, reduced motion and actual navigation to `/pha/cung-ung-dau-vao` without homepage fallback.

Final local development measurements:

| Width | LCP ms | CLS |
| --- | ---: | ---: |
| 320 | 532 | 0 |
| 375 | 204 | 0 |
| 414 | 152 | 0 |
| 768 | 128 | 0 |
| 1280 | 112 | 0 |
| 1920 | 148 | 0 |

These are one local development run, with caching varying between navigations. Not production field CWV, throttled Lighthouse or INP measurements.

`npm run build` — PASS, 2222 modules transformed. Existing large dataset chunk warning remains (enterprise chunk approximately 42 MB uncompressed). This redesign does not alter those dataset/backend boundaries. Repository has no frontend lint/typecheck script; no standalone lint/typecheck PASS claimed. Targeted diff whitespace check passes; `src/App.jsx` has unrelated pre-existing trailing whitespace outside this task. No credential/API code was introduced.

Screenshots: `/tmp/ccu-stages-before.png`, `/tmp/ccu-stages-after-1280.png`, `/tmp/ccu-stages-after-375.png`. Inspected before/after desktop and mobile layouts. No committed visual regression baseline: formal pixel regression is INCONCLUSIVE. Color/focus/landmark checks are not a full WCAG, axe-core or screen-reader audit.

## Asset provenance

New cover generated using the built-in image tool, inspected, then converted/resized with macOS sips to 1600×600 JPEG (approximately 381 KB). Saved project asset: `/Users/heymac/Documents/hchivi/CODE/CCU/public/images/six-stages-industrial-lifecycle-v1.jpg`. Original generation remains at `/Users/heymac/.codex/generated_images/01a0ec2e-7927-73c2-b6b1-aeaf05dabab3/exec-4536cc98-bdd9-4705-a528-a71210b98047.png`.

Prompt: "Use case: photorealistic-natural. Asset type: editorial panoramic cover for CCU Vietnamese B2B industrial lifecycle map. Elevated oblique drone photography of a modern Vietnamese industrial park: finished manufacturing halls with pale steel roofs, one orderly construction zone, internal truck roads and planted green buffers, humid bright morning daylight. Refined credible industrial composition, wide horizontal framing, no overlaid graphics, no text, no logos, no watermark, not a claimed real event. Intended UI pairs this image with a green interactive six-stage navigation, keep the photograph natural and calm."

Stage photographs reuse the existing `/stage1_hero.jpg` through `/stage6_hero.jpg` assets. Photos illustrate the lifecycle, not a specific delivered CCU event, verified company or endorsement. No visible AI caption per the user's established preference; provenance is recorded here.

## Known inherited boundaries

Stage/phase records are existing project mock data, not proof of production verification. Their content is intentionally unchanged. Original orientation keywords for 3.1 concern cleanroom/fit-out while its phase title is machinery installation; 3.2 has the inverse emphasis. This pre-existing content mismatch was not silently corrected because the user explicitly requested preservation. A separate approved content task can reconcile it.

Selected work/need/role lists remain in their original Vietnamese; English titles and summaries use existing translated fields. No invented translations of protected content. Downstream directory/phase pages retain their existing data and workflows. Posting a demand opens the existing page; it does not auto-submit/publish or promise prefilled phase context that the destination currently ignores.

## Self-evaluation

Overall 4.2/5. Accuracy 4: hashes, 62 tests and browser journeys verify the implementation; production data/INP not audited. Completeness 4: requested redesign and preserved content are delivered; inherited keyword mismatch intentionally preserved. Clarity 4: overview, phase and next action are distinct; extensive legal-phase source copy remains by request. Actionability 5: usable on running localhost with executable tests and canonical links. Conciseness 4: marquees and duplicated proof sections removed; all 18 phases remain available rather than being artificially shortened. No critical axes ≤2. Verdict: deliver local redesign; no production-ready backend claim. Self-check: the customer can locate a phase and take a real next step without sacrificing existing content.
