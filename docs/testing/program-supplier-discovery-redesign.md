# Program and supplier discovery redesign — 2026-10-07

## Delivered scope

- `/chuong-trinh`: six fully visible program categories; labelled primary search, location, industry and status filters; role, format and time in an expandable rail. Existing filter rules stay in the page.
- Program cards: original photography, date block, full name/description, every recorded need, full venue/KCN/host, recorded buyer/supplier counts and status-dependent actions. Fee teasers removed only from cards. At most three cards per row.
- `/nha-cung-ung`: capability-first header, original three-photo gallery, recorded phase labels, native expandable expertise keywords, masked contacts and existing connection/profile destinations. At most three cards per row; grid/list retained.
- Supplier results heading and view controls redesigned; sidebar registration invitation now explains the actual profile action rather than claiming competitors receive daily leads.
- Heroes, shared navigation/footer, routes, source records, backend and hosting unchanged. No deployment or commit performed.

## Design rationale and skill application

Taste and Hallmark informed a bright CCU exhibition catalogue, not a generic feature landing page. A buyer can scan the date and relevant purchasing needs before reading logistics. A supplier record begins with business identity and recorded capability rather than an anonymous image collage. Photography remains unobstructed; green actions, quiet stage tints and full text replace multiple badges, animated dots and clipped metadata.

Scope exceptions are intentional: real result grids have up to three equal columns because the user requested this; the six category tiles represent actual filters, not feature marketing. Existing runtime typography and shared chrome are inherited. Short metadata uses 11–13px; body/needs use 14–16px and form text uses 16px. Original dataset photos are retained, not regenerated or certified as evidence of an event. Masking is a presentation rule, not proof of server-side privacy.

Hallmark review: no new gradient text, decorative blobs, hover scaling, automatic card motion, invented metrics or fake verification. Color roles are scoped in `tokens.css`. Primary button gradients follow the already approved green system. Category labels and CTA text stay on one line; titles and needs intentionally wrap without truncation. Scoped text/action/input/focus token pairs meet measured WCAG thresholds. This is not a full-site accessibility certification.

## Verification

- RED: the first five new tests failed against the prior interface: the fourth need was hidden, new discovery/model/style modules were absent, and supplier capability/disclosure markup was absent.
- GREEN: `node --test --experimental-test-coverage --test-coverage-include='src/components/programs/programCardModel.js' --test-coverage-lines=80 src/pages/__tests__/programDiscovery.test.js src/pages/__tests__/supplierDirectory.test.js` — **13/13 pass**. The small new status model has **100% line, branch and function coverage**; this does not claim 100% JSX/browser coverage.
- Full frontend suite: **97 tests; 93 pass, 4 fail**. Same unrelated failures documented in `supplier-directory-redesign.md`: three legacy assertions in `dualGearsMatching.test.js`, and the old photo-dimension assertion in `expoHomepage.test.js`. Their test/component files were not edited here.
- `npm run build` succeeds. Existing large data chunk warning remains (enterprise snapshot approximately 42MB uncompressed). No lint/typecheck script is configured.
- `git diff --check` passes.

## Browser QA

Chrome headless against localhost; reduced-motion mode. No form submissions or external delivery calls made.

- `node docs/testing/qa-program-supplier-discovery.mjs` passes. Widths **320, 375, 414, 768, 1024, 1280, 1440, 1920**: no document overflow, no clipped primary CTA or result/menu controls, no result grid over three columns, 11 program and 24 initial supplier cards.
- Program interactions: all six types and seven statuses, need search, empty recovery, location, industry, role, format, time, reset, keyboard focus, interest/recap open-close, detail navigation.
- Supplier interactions: expertise disclosure, three photos, masked-only contact markup, grid/list including narrow screens, five representative phase matches, contact modal open-close. Pinned A–Z expansion does not change document height.
- `node docs/testing/qa-supplier-directory.mjs` passes: eighteen phase choices, A–Z, accent-insensitive local industry search, KYC, province, technical switches, reset, mobile selector and contacts.
- Program text/action contrast samples: minimum **6.24:1**; input boundary **3.58:1**; focus **11.10:1**. Supplier text/stage samples: minimum **4.78:1**.
- No captured browser JavaScript errors. Remote logo/photo availability is not guaranteed; the existing fallback treatment remains.
- Network availability and Core Web Vitals were not comprehensively audited. Automated pixel regression verdict: **INCONCLUSIVE**, because no committed comparable baseline exists; responsive/interaction assertions above pass independently.
- Captures: `/tmp/ccu-program-discovery-{320,375,414,768,1440}.png`, `/tmp/ccu-supplier-discovery-{320,375,414,768,1440}.png`, `/tmp/ccu-supplier-list-1440.png`. Mobile/tablet/desktop captures visually reviewed; no automated before/after pixel-equivalence claim.

## Agent self-debug report

- Failure: repeated pointer QA could not activate supplier grid/list controls after scrolling.
- Capture: button position alternated between approximately `y=-4` and `y=1060` on a 1100px viewport; pointer hit the site header or floating mascot instead. Re-positioning the test pointer alone did not solve it.
- Root cause: the same `expanded` state controlled both the in-flow A–Z catalogue and the pinned panel. Sticky transitions removed/reinserted about 532px of document content, causing a scroll-height feedback loop.
- Contained recovery: separate `stickyExpanded` from the in-flow catalogue state; scrolling changes only the floating panel. Keep filters, groups and keywords intact.
- Result: success. Real pointer grid/list clicks, small-scroll position stability and pinned open/close document-height checks pass; targeted regression test added. No DOM-programmatic click workaround was used to hide the failure.
- Prevention: test anchored controls across sticky transitions, not only individual handlers. Repeated full QA reruns were inefficient; the geometry/hit-target diagnostic isolated the actual cause.

## Self-evaluation

Overall **4.2/5** across five axes.

| Axis | Score | Evidence and remaining improvement |
| --- | --- | --- |
| Accuracy | 4 | Recorded information and actions covered by 13 targeted tests and browser QA; existing KYC heuristics and raw public data are not independently verified. |
| Completeness | 4 | Both requested discovery/card surfaces, fee removal and three-column cap delivered; real-device and screen-reader testing not performed. |
| Clarity | 4 | Dates, needs, phases and next actions have distinct hierarchy; preserved source company names can still be lengthy. |
| Actionability | 5 | Working localhost pages, repeatable QA, build output and scoped source changes available immediately. |
| Conciseness | 4 | Program cards expose every need as requested; long source descriptions still increase card height. |

Critical issues (axes ≤2): none. Verdict: deliver the scoped redesign for visual review. Self-check: the user can judge the live pages; do not assume aesthetic approval from test results.

Recommended follow-ups, outside this implementation: review with a real screen reader/touch device; curate original business names/photos with the data owner; reconcile the four stale homepage assertions in a separate scoped task.

## 2026-10-07 follow-up: filter frames and invitation intake

User requested complete side borders for program filters, a compact supplier filter menu clear of the pinned A–Z bar, and a stronger registration surface. Hallmark applied at component scope, inheriting the locked CCU fonts/colors and preserving all program cards, photography, routes and datasets.

- Program filters now have four-sided borders, inner spacing and a rounded frame. The six category selectors remain icon-free.
- Supplier KYC uses a labelled native select with all four levels and qualification descriptions. Technical criteria and quick-region chips use native disclosures; province and all eighteen lifecycle phases remain available. The frame stays intact while its body can scroll on short viewports. A ResizeObserver measures the actual fixed A–Z panel and sets sidebar clearance; registration-note explanation is disclosed separately to keep the default phase selector visible at 1440×900.
- Invitation intake is a bright mint/white typographic split with a prominent green CTA, seven associated field labels, required contact fields and consent. Existing localStorage key, payload and selections are preserved. No backend/email wiring added. Local-only storage is disclosed before submission and on success; a storage failure now leaves the form open with an inline error instead of false success.

Verification for this follow-up:

- RED: new frame/intake assertions and compact-KYC assertion failed before implementation. GREEN: **16/16** targeted program/supplier tests pass.
- `npm run build` and `git diff --check` pass. The existing large data-chunk warning remains. Full frontend suite was not rerun for this component follow-up; earlier unrelated baseline failures above remain documented, not claimed resolved.
- Both `qa-program-supplier-discovery.mjs` and updated `qa-supplier-directory.mjs` pass. Existing phase, A–Z, search, grid/list, contact-mask and status actions preserved. Additional assertions check all four borders, pinned-bar clearance, visible default phase selector, compact KYC options, technical switches, region selection and mobile disclosure.
- Intake checked at **320, 375, 414, 768, 1440px** with no document/control overflow. Required-field and unchecked-consent validation block saving. Fake fixture data saves correctly in an ephemeral Chrome profile; simulated blocked storage produces an error without success. No external registration/delivery requests made; the temporary profile is discarded on browser close.
- Desktop/mobile captures visually inspected: `/tmp/ccu-filter-sticky-1440.png`, `/tmp/ccu-compact-filter-375.png`, `/tmp/ccu-invitation-intake-{320,375,414,768,1440}.png`. Measured inherited contrast pairs pass. Pixel-regression remains INCONCLUSIVE without committed baselines; no screen-reader or real-device certification claimed.

Self-evaluation: **4.2/5** — accuracy 4 (16 tests plus browser checks, no delivery verification); completeness 4 (all three requested surfaces covered, real-device review pending); clarity 4 (visible field/selection hierarchy, native select options can be long); actionability 5 (working localhost pages and reproducible QA); conciseness 4 (disclosures reduce menu density, seven required existing intake fields retained). No critical issues. Highest-impact follow-up outside scope: connect the intake to an approved backend before enabling real invitation delivery. Self-check: visual approval belongs to the user, not automated tests. Verdict: deliver for visual review.
