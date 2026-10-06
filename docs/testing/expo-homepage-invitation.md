# Homepage program block — 2026-10-06

## Scope and current approval state

User requested a more distinctive block through Hallmark, then requested three implemented alternatives to choose from. Priorities: Nhà máy, Nhà cung cấp, Hội / Hiệp hội / Tổ chức. No KCN choice in the primary role list. All existing role IDs, destination routes and query parameters remain intact.

- A: Exhibition invitation — approved for localhost homepage. Latest revision: ivory ticket frame, invitation salutation, wide photograph without the yellow note, green program CTA and perforated participation rail.
- B: Meeting table — spatial role selectors around the chairs, generated product-sample table. Local preview only.
- C: Event poster — photographic stage, cut-in title paper, practical participation rail. Local preview only.

Comparison: `http://localhost:3000/docs/testing/expo-homepage-options.html`. User chose A, then requested removal of the yellow note and stronger invitation styling. A is applied under the existing homepage #chuong-trinh anchor. Switching B/C still changes preview only; preview links open existing destination pages in a new tab. No preference is persisted to the database. No deployment or commit.

The source on disk at the start was the original text-left/photo-right v1, matching the user's screenshot. The reason earlier work was absent is unknown; do not attribute it to browser cache or another editor without evidence.

## Boundaries

Modified in place: SupplyChainExpoPaper3D.jsx, ExpoHomepage.css, expoHomepageContent.js, scoped tokens.css, expoHomepage.test.js. Added standalone local-review HTML, preview JSX/CSS, and QA script. Updated design-system documentation. Did not alter HomePage's anchor/mount, shared nav/footer, other homepage blocks, backend, database or URLs.

Vite build entry is the existing application. Preview JSX is not imported by App/HomePage. The docs HTML and option selector are not emitted by the production build. B/C need explicit user selection and a subsequent homepage wiring step.

## Hallmark application

Component scope: skip page macrostructure/nav/footer rotation. Locked design.md wins over catalog palette/font rotation and global overflow changes. Existing runtime fonts, forest-green actions, 4pt spacing and restrained green button gradients preserved. The ivory ticket is scoped; the yellow photo note and its CSS were removed. No fake attendance numbers, dates, testimonials, matching guarantees, WebGL, autoplay or global theme changes.

Default, hover, focus, press, disabled, loading, error and success styling exists. Standalone review includes a collapsed eight-state demo; simulated processing states are explicitly marked as demonstrations and never issue API requests. Real image load/error/success states retain usable controls. Native role changes expose aria-pressed and announce practical content through a stable polite live region. Full organizer accessible label is preserved when mobile uses shortened visible text in A.

Scoped review: readable solid text, no gradient text, no card-in-card grid, no invented metrics, no fake browser chrome; one hover effect per control, reduced-motion handling, 44px+ targets, one-line clickable labels. No claim of 58/58 page gates: component run, with page nav/footer/diversification gates not applicable. Pre-emit assessment P4/H5/E4/S5/R4/V5; aesthetics remain subject to user selection.

## Verification evidence

### Approved A revision — 2026-10-06

Journeys: read an exhibition invitation without an obstructing yellow note; select one of the three requested business roles and reach its unchanged preparation destination; retain usable navigation if the photograph fails.

- RED: changed the invitation SSR test to require ticket framing and invitation salutation and forbid the removed note. Actual run: 6 passed / 1 intended failure (missing ticket).
- GREEN: same `node --test src/pages/__tests__/expoHomepage.test.js`: 7/7 passed after the scoped component/CSS changes.
- Coverage: existing content-helper coverage 100% lines/branches/functions; not JSX, CSS or whole-project coverage.
- Homepage browser QA: 24/24 combinations passed, all existing routes/keyboard controls/photo-failure behavior preserved. Removed note and ticket presence asserted. No page errors or failed HTTP responses.
- Options browser QA: 72/72 combinations passed, 3/3 blocked-photo fallbacks remain usable. Ivory ticket text contrast measured 11.88:1.
- Visual inspection: real-homepage 375px and 1280px screenshots. Formal regression remains INCONCLUSIVE without a committed baseline.
- `npm run build`: PASS, 14.85s, existing large-chunk warnings. No lint/typecheck scripts configured.
- Fresh full frontend suite: 77 tests, 74 pass, 3 existing dual-gears failures; same out-of-scope failures as the earlier option run.
- Scoped tracked whitespace check and credential/log/TODO scan: clean. No unrelated source changes, forms submitted, production mutation or deployment.
- TDD checkpoint commits omitted: .git is read-only; preserve the existing dirty worktree.

### Earlier option-development evidence (historical)

- TDD: new invitation structure/state tests first: 5 pass / 2 intended failures. After implementation: 7/7 pass.
- Priority-label assertion first: 6 pass / 1 expected failure on old supplier label. Updated shared content: 7/7 pass.
- `node --test src/pages/__tests__/expoHomepage.test.js`: 7/7 pass, SSR intent/routes/selected state, photo sizing/errors, mobile/reduced-motion/state styling, actual scoped hex-token contrast.
- Helper coverage command: `node --test --experimental-test-coverage --test-coverage-include='src/components/home/expoHomepageContent.js' src/pages/__tests__/expoHomepage.test.js`. 100% lines/branches/functions for this helper only; not a full JSX/project coverage claim.
- `node docs/testing/qa-expo-homepage.mjs`: 24 combinations pass (3 roles × 8 widths), native keyboard/focus, program/role routes, image failure, hover/reduced motion and bright-only behavior. No unexpected page/network errors.
- `node docs/testing/qa-expo-options.mjs`: 72 combinations pass (3 options × 3 roles × 8 widths: 320/375/414/768/1024/1280/1440/1920). Selected content/destination, focus, control sizing and viewport overflow checked. All 3 photo failure cases remain usable. Neutral-cream note actual sRGB contrast 10.28:1.
- Screenshot visual review: A/B/C at 375px and 1280px; images under `/tmp/ccu-expo-{invitation,table,poster}-{375,1280}.png`. Formal visual regression inconclusive: no committed baseline.
- `npm run build`: PASS, 15.20s, existing large data-chunk warnings. Preview selector not emitted in dist.
- Full frontend suite: 77 tests, 74 pass, 3 pre-existing dual-gears contract/CSS failures remain out of scope. They were not hidden or changed.
- Scoped tracked diff whitespace check passed; broad repository diff has pre-existing whitespace issues elsewhere. No lint/typecheck scripts configured. No Lighthouse/CWV or full WCAG/screen-reader certification performed.

Browser checks used isolated headless Chrome; no Zen desktop control, credentials, form submission or production mutation. TDD commits omitted because .git is read-only and unrelated user changes are present.

## Asset provenance

Reused existing local generated concept assets `sourcing-meeting-home-v1*.jpg` and `sourcing-table-home-v2*.jpg`. They illustrate B2B product review, not documentary evidence that a named CCU event occurred. No new imagery generation or company endorsement was added this turn.

## Self-evaluation

Approved A revision: Accuracy 4/5 (SSR/build/browser evidence; no full-WCAG certification), Completeness 4/5 (note removed, homepage wired, responsive roles retained; visual appeal needs user feedback), Clarity 4/5 (one invitation hierarchy; mobile organizer label abbreviated with full accessible name), Actionability 5/5 (working homepage anchor and preparation routes), Conciseness 4/5 (no new persuasion sections; three role benefits retained). Overall 4.2/5. Hallmark P4/H5/E4/S5/R5/V4: no invented proof, no WebGL/glow/auto-motion, unobstructed photograph, component-scoped tokens and native controls. Next improvements are subjective layout refinement and a separately scoped full accessibility/performance audit. Would the user agree? Not yet confirmed; the chosen direction and explicit removal are implemented.

Earlier option-development evaluation (historical):

Accuracy 4/5: build and scoped/browser checks pass; no production or full-WCAG claim. Completeness 4/5: three working options and requested priorities; final homepage selection pending by design. Clarity 4/5: a dedicated A/B/C comparison and identical content; subjective preference needs human feedback. Actionability 5/5: local comparison works immediately and canonical links remain usable. Conciseness 4/5: compact block content; B is taller due to spatial table. Overall 4.2/5. No critical gaps within preview scope. Highest next improvement: user chooses an option, then refine its size/composition in actual homepage context. Would the user agree? Not yet known; approval is intentionally pending.
