# SUPPI & CHAINY: local design alternatives

2026-10-06. User requested multiple alternatives in a separate localhost tab, using Taste and Hallmark, preserving the two existing mascots. This task does not select or replace the homepage block.

## Review

- A: `/docs/testing/assistant-homepage-options.html?option=journey`. “Sân khấu bộ đôi”: large original mascot pair on one mint stage, diagonal oversized identities and a sourcing-to-coordination action rail.
- B: `/docs/testing/assistant-homepage-options.html?option=desk`. “Chọn trợ lý”: large clickable characters select concise preparation guidance and prioritize the corresponding existing assistant link.
- C: `/docs/testing/assistant-homepage-options.html?option=editorial`. “Poster thương hiệu”: two open, alternating character-and-identity compositions, without boxed service cards.

The review entry is noindex/nofollow and is not imported by App/HomePage. The existing `SuppiChainyConciseSection.jsx`, its mount, App routes, global fonts, shared navigation/footer, backend and database were not edited. Scoped tokens were added to the existing `tokens.css`; other token scopes were preserved. Existing unrelated dirty-worktree changes were preserved. No commit, deployment or migration.

## Design rationale

Taste: redesign-preserve, variance 8 / motion 3 / density 3. Bright-only CCU green; inherited SpaceGrotesk / Poppins. No generated illustrations, ambient blobs, fake chat responses, invented metrics, gradients on type or automatic motion. Single-line controls and explicit mobile collapse. Hallmark component scope skips page macrostructure/chrome rotation and project-memory writes. The locked `design.md` takes precedence over stale preflight colors. The context question was sent once; inferred audience = factories, suppliers, associations/organizations; action = choose the right assistant; tone = expressive, friendly B2B.

Original illustration provenance: exact `/mascots/suppi-directions.webp?v=8` and `/mascots/chainy-directions.webp?v=8` sprite files used by `DualMascotInteractive`. The initial down-left/down-right laptop cells are displayed, not redrawn, recolored or replaced by standing characters. This review uses still poses; it does not copy cursor-following/reaction behavior. Image space is reserved and load failure leaves readable names and both assistant links. No assets were modified.

Copy summarizes existing sourcing/coordination intent and removes unsupported supplier-count claims from these alternatives only. It does not claim automatic booking, verified matching or guaranteed order outcomes. Existing `/tro-ly-ai?assistant=suppi` and `assistant=chainy` routes are preserved. Caveat: the existing workspace query-effect reads role/q but does not explicitly consume assistant in that effect; automatic assistant selection and AI/backend functionality have not been verified or changed in this design task.

## TDD and verification evidence

Revision 2 responds to the user's rejection of the initial layouts as too similar to other blocks. Only preview components, their option labels, scoped tokens, tests and this report were changed. Composition tests first failed on the missing `duo-stage` marker, then passed after replacement. Visual inspection caught CHAINY wrapping at 320px; a new browser assertion reproduced that failure before the mobile identity layout was corrected.

Journeys: compare three designs; recognize original mascots; identify each assistant's work; choose a task by keyboard; reach existing assistant destinations; retain actions if assets fail.

| Check | Evidence | Outcome |
| --- | --- | --- |
| RED | `node --test src/pages/__tests__/assistantHomepageOptions.test.js` after fixing a test setup typo | 3 intended failures: new preview component did not exist |
| GREEN, revision 2 | Same test target, including three new composition contracts | 4/4 pass |
| Helper coverage | `node --test --experimental-test-coverage --test-coverage-include='src/components/home/assistantHomepageOptionsUi.js' src/pages/__tests__/assistantHomepageOptions.test.js` | 100% lines/branches/functions for the option resolver only; not overall UI/backend coverage |
| Browser, revision 2 | `node docs/testing/qa-assistant-options.mjs` using isolated headless Chrome | 24 variant/viewport combinations pass at 320/375/414/768/1024/1280/1440/1920; no horizontal overflow or split mascot names; desktop mascot viewport widths at least 300px |
| Interaction | Both B tasks via focus + Enter; selected state and corresponding guide checked | Pass; focus outline present |
| Image failure | Block both original sprite requests in each variant | 3/3 retain fallback names and both routes |
| Contrast, revision 2 | Browser Canvas sRGB conversion of ten token pairs | Minimum tested text ratio 5.83:1; primary light gradient stop 6.75:1 |
| Console | Browser pageerror collection during review | No runtime errors |
| Build | `npm run build` | Pass; existing large-chunk warnings. Preview entry excluded from dist |
| Full frontend regression, initial revision only | `node --test src/pages/__tests__/*.test.js` | Previously 77/80 pass; 3 existing unrelated dual-gears contract failures; not rerun for revision 2 |
| Scope/security | Preview files contain no fetch/storage/API credentials; no App/HomePage import; scoped whitespace check | Edited scope checked; global diff whitespace check reports unrelated pre-existing issues |

The 3 full-suite failures concern six existing demand/solution pairs, old traced-inner contour markup, and opposite six-lobe rotation contracts. No matching-gear files or those tests were changed. Project-wide readiness is not claimed.

Desktop/mobile screenshots were rendered under `/tmp/ccu-assistant-{journey,desk,editorial}-{320,375,414,768,1280}.png`; representative layouts were visually inspected and corrected. Visual regression against a committed baseline is INCONCLUSIVE because no baseline exists. Browser QA uses Puppeteer already installed in the project, rather than adding Playwright. No full axe/screen-reader audit or production Core Web Vitals measurement was performed. Lint and TypeScript scripts are absent. Git checkpoint commits from the TDD skill were intentionally omitted: this task does not authorize commits and the Git directory is read-only.

Hallmark universal/component checks: tokenized color/font styling, Roman headings, meaningful two-role grouping, native controls, no nested feature cards, no fake chrome/proof, focus/press/disabled styling, eight-state button demo, reduced motion, unclipped labels. Page-only gates are N/A, not reported as 58/58. Green button gradients and original multicolor mascots inherit explicit project/user constraints.

## Self-evaluation

Overall 4.0/5. Accuracy 4: verified tests and exact assets, but assistant routing/backend behavior remains unvalidated. Completeness 4: three working designs and responsive checks, but no full assistive-technology audit. Clarity 4: visibly different A/B/C choices; some technical evidence belongs only in this report. Actionability 4: three direct local URLs; app open requests returned queued rather than confirming visible tabs. Conciseness 4: local instructions are short, though the evidence report is longer than the choice screen.

Hallmark critique: Philosophy 4 / Hierarchy 4 / Execution 4 / Specificity 5 / Restraint 4 / Variety 4. Improvements: choose a design before production integration; verify assistant-specific workspace behavior in a separately scoped functional task. Self-check: the user can compare now without changing the homepage; aesthetic preference still requires their choice. Verdict: ready for local design review, not a production release claim.
