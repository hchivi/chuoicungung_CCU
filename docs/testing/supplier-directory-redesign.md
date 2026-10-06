# Supplier directory redesign — 2026-10-06

Scope: the four requested blocks on `/nha-cung-ung`. Taste + Hallmark informed the bright, compact B2B workbench, full lifecycle labels, A–Z index, and photo-led supplier records. Shared hero, navigation, footer, advertising/showcase blocks, data snapshots, backend and routes remain in place. Existing record images are reused, not regenerated.

## Customer journeys

- Select any of the six stages or eighteen phases; see corresponding supplier records.
- Browse the existing alphabet, industry detail links and keyword detail links. Search the industry index without replacing the main supplier query. Reveal all categories instead of stopping at the former first sixty.
- Combine the existing KYC, geography and three infrastructure/standard switches; reset all filters including the URL letter.
- Compare supplier photos and recorded phase associations. Open the existing profile or quote form without a direct phone/email address in card links.

## Changes and limits

- All recorded valid phases appear on a card; a matching selected phase comes first. Unknown phases are labelled rather than defaulted to `4.1`.
- Three existing thumbnails become a lead photo and two supporting photos; original avatar source remains. Failed photos keep a labelled visual fallback rather than a broken image icon.
- MOQ, lead time and confirmation notes render only when provided by the record. Former fabricated fallback values are removed.
- Only recorded phone/hotline fields are masked. Missing contacts no longer invoke the pre-existing deterministic phone generator.
- Contact masking is a display treatment, **not** server-side access control. The existing public snapshot still contains underlying data. No claim of data protection beyond the rendered cards is made.
- Contact icons open the existing quote form. The quote form is pre-existing and simulates completion with a timer; this redesign does **not** implement sending a real quote/contact request. Read-only QA opened/closed the form but never submitted it.
- KYC and standard filters keep their existing heuristic rules. This work does not validate certifications or prove ERP integration/24-hour response capabilities.

## TDD evidence

Journeys derived from the user's four screenshots and request. No checkpoint commits created; changes remain available for review.

- RED: `node --test src/pages/__tests__/supplierDirectory.test.js` executed five tests, all failed because the requested new components/helper did not yet exist.
- Additional RED: the recorded-phone test executed and failed because `getSupplierMaskedPhone` was not implemented; it passed after introducing the recorded-only masking helper.
- GREEN: seven tests pass, including accent-insensitive industry search and recorded-only contact masking.
- `node --test --experimental-test-coverage --test-coverage-include='src/components/suppliers/supplierDirectoryModel.js' src/pages/__tests__/supplierDirectory.test.js`: seven passed; helper line/branch/function coverage 100%. This is **not** a whole-page coverage claim. Components are SSR-tested and interactions are browser-tested.
- `node --test src/pages/__tests__/*.test.js`: 91 tests, 87 pass, 4 fail. Existing unrelated failures: three `dualGearsMatching.test.js` cases and the image-dimension case in `expoHomepage.test.js`. Those files/components were not modified.
- `npm run build`: succeeds. Existing large snapshot chunk warnings remain (enterprise data chunk approximately 42MB uncompressed). No lint or typecheck script exists in this JavaScript project.
- `git diff --check`: clean.

## Browser verification

Command: `node docs/testing/qa-supplier-directory.mjs` with locally installed Chrome and Puppeteer. Read-only; no form submissions or network mutations.

- Widths 320, 375, 414, 768, 1024, 1280, 1440, 1920: no page horizontal overflow; all 18 phase controls present; 24 initial supplier records; primary controls at least 44px high.
- Representative phase selections `1.1`, `2.3`, `4.3`, `5.3`, `6.3`: every displayed record has the selected phase as its first phase.
- Keyboard Enter, focus ring, alphabet selection, unmatched industry search + recovery, KYC, province, all three switches, complete reset, grid/list, masked-contact modal and mobile phase selection: pass.
- Twelve palette text/background combinations all exceed WCAG 4.5:1; minimum 4.78:1. The cyan stage text was darkened after an initial contrast failure.
- No browser JavaScript errors captured. Existing remote images may fail independently; fallback is provided and no universal image availability is claimed.
- Before screenshot: `/tmp/ccu-suppliers-before.png`. After explorer/workspace captures: `/tmp/ccu-supplier-{explorer,results}-{375,768,1440}.png`. Visually inspected desktop explorer, desktop cards and mobile layouts. The old screenshot and new captures are differently framed, so an automated pixel-regression verdict is inconclusive.
- Lighthouse is not installed; no Lighthouse score, Core Web Vitals or full screen-reader audit claimed.

## Self-evaluation

Overall 4.0/5. Accuracy 4: recorded phases and masked markup are tested; existing KYC heuristics remain a data limitation. Completeness 4: all four surfaces rebuilt and responsive; a full screen-reader audit was not performed. Clarity 4: complete phase names and honest missing values; long company names are retained rather than silently rewritten. Actionability 4: live localhost ready to inspect; real quote dispatch remains outside this task. Conciseness 4: nested visual frames reduced, but existing promotional/showcase blocks remain unchanged as outside the four requested blocks.

Highest-impact follow-ups, only if separately requested: audit the public data/contact authorization boundary; replace the pre-existing simulated quote submission with a real delivery workflow. The user can assess the visual result immediately, but no perfect design or production-readiness score is asserted.
