# Founding Partner: pricing and color refresh

Date: 2026-10-03. Target: http://localhost:3000/founding-partner.

## Customer perspective and scope

A customer assessing an annual budget needs to see all three prices immediately,
understand the intended scope, inspect deliverables, then start a non-binding exchange.
The previous selector hid two prices until clicked. This refresh exposes all prices
and gives each tier a distinct, legible visual identity.

Design direction: corporate B2B, light editorial surfaces. Design variance 6/10,
motion 2/10, density 5/10. Used design-taste-frontend and
redesign-existing-projects with the existing React, native CSS, fonts and Lucide icons.
The user's request for more color overrides the skills' single-accent default:
silver/slate, champagne gold and mineral teal identify commercial tiers, not claims
of quality or popularity. No fake scarcity, partner logos, testimonials or rankings.

Changed only page-local JSX/CSS and the page test; retained URL, shared navigation,
footer, existing scope identifiers, form payload and persistence behavior. No new
dependencies, database changes, commit or deployment. Existing reference prices
remain 300 - 500 million, from 1 billion, and 2 - 3 billion VNĐ per year.

## Implemented guarantees

- All three prices, annual unit and intended purpose are visible without selecting.
- Tier buttons retain native keyboard operation and a single pressed state.
- Accessible descriptions associate each button with its price and purpose.
- Selecting a tier updates the detail panel and its semantic color.
- The exchange CTA carries the selected tier's existing budget into the form.
- The hero links directly to pricing. Reference-price and matching-neutrality
  disclosures remain explicit. The final exchange banner uses champagne accents.
- Mobile/tablet collapse the selector into readable horizontal rows; desktop uses
  the three short selectors above a shared, expanded detail panel.

## TDD evidence

Journeys derived from this user request; no external plan was executed.

1. Added an SSR test for all three prices, tier purposes, semantic variants and
   single pressed state. Ran `node --test src/pages/__tests__/foundingPartnerUi.test.js`.
   RED: 7 passed / 1 failed, `reference price must be visible: Bạc`.
2. Implemented pricing selectors. GREEN: 14/14 page tests passed.
3. Extended the test for accessible price/purpose descriptions. RED: 7 passed /
   1 failed, `price and purpose need accessible descriptions: Bạc`.
4. Added the description associations. GREEN: 14/14 page tests passed again.

Coverage command:
`node --test --experimental-test-coverage --test-coverage-include='src/pages/foundingPartnerUi.js' src/pages/__tests__/*.test.js`

Result: 100% lines, branches and functions for the existing scope/validation helper.
This is not a claim of 100% page or repository coverage. No checkpoint commits
were created; evidence remains in this report and the test.

Final verification: `node --test src/pages/__tests__/*.test.js` passed 14/14.
`npm run build` completed successfully in 12.99s; the existing large shared
data-chunk warning remains. Scoped `git diff --check` passed for the tracked JSX.

## Browser evidence

Read-only/local QA through the connected in-app browser, in a temporary tab.
User-owned tabs were preserved. No final save, purchase or real inquiry submitted.

| Check | Observed result |
| --- | --- |
| Desktop 1440 × 1000 | Three prices visible; Vàng selection colors detail consistently; no page overflow |
| Tablet 768 × 1024 | Stacked selectors; 32px horizontal section padding; no page overflow |
| Mobile 375 × 812 | Readable stacked selectors; 20px section padding; no elements overflow viewport |
| Tier actions | Bạc/Vàng/Kim Cương CTAs populate corresponding existing annual budget |
| Keyboard | Enter selects Kim Cương; Space selects Bạc; matching detail heading appears |
| Invalid form | Six fields marked invalid; first required company field receives focus |
| Review | Synthetic contact data reaches review, with the local-only save button; not saved |
| Console | No errors observed; pre-existing React Router v7 future-flag warnings only |

Screenshots: `/private/tmp/ccu-founding-pricing-color-desktop.png`,
`/private/tmp/ccu-founding-pricing-color-tablet.png`,
`/private/tmp/ccu-founding-pricing-color-mobile.png`.

## Verification limits

Automated pixel regression is INCONCLUSIVE: no committed screenshot baseline.
No Lighthouse, network-status audit, axe scan or screen-reader session performed.
The existing inquiry flow still stores locally, not on a server; this refresh does
not change that fact. Existing large shared data-bundle build warnings remain out
of this page-only scope. Commercial prices/rights still require owner confirmation.

## Self-evaluation

Summary: 4.2/5 across five axes; ready for local review.

| Axis | Score | Evidence and improvement |
| --- | --- | --- |
| Accuracy | 4 | Preserved prices/payload; tests and browser confirm selection. Commercial terms are reference data, not independently verified. Confirm them before publishing. |
| Completeness | 4 | Pricing, color, responsive layout and core form journey verified. Not every tier/viewport combination has a separate screenshot; expand that matrix for release QA. |
| Clarity | 4 | Price, annual unit and purpose visible together. Small disclosure text warrants user readability testing before publication. |
| Actionability | 5 | Implemented in the existing local page; direct URL and screenshots allow immediate review, without setup or dependencies. |
| Conciseness | 4 | Shared detail panel avoids repeating three feature towers. Matching-neutrality notices still repeat elsewhere on the existing page; consolidate only in a later approved content pass. |

Critical issues: none in this refresh. Would the user agree? Functional evidence
supports the assessment; visual approval remains the user's decision.
Verdict: deliver for local review. Release follow-ups: confirm commercial copy,
run accessibility/performance audits, and expand responsive state screenshots.
