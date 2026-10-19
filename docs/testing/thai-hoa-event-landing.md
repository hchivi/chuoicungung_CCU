# KCN Thái Hòa — landing page delivery

Verified locally on 2026-10-12. Scope: redesign the event page from `KCN_TH.txt` and the supplied desktop/mobile reference, preserving real brand assets and existing registration workflows.

## Delivered

- Canonical route: `/chuong-trinh/ngay-hoi-chuoi-cung-ung-kcn-thai-hoa-2026`; registration anchor: `#dang_ky`. The previous business-matching route redirects to this route and anchor.
- New compact header, illustrated hero, lifecycle tabs, role-specific entry cards, matching gears, participant lists, agenda, connection groups, fee table and sponsorship cards.
- Logo order: supplied VIETSON → original Chuỗi Cung Ứng brand lockup → supplied Team KCN. The original brand text and tagline are preserved.
- Existing matching, registration and post-matching components are reused. Sponsor CTAs preselect their package; buyer/supplier CTAs select the corresponding form.
- Program identity is retained for existing Supabase registration records. Approved public records are projected without private contact fields. No production database writes or test registrations were made.
- Date-based status uses the source date, 07/10/2026, and registration deadline, 29/09/2026. The event is now past; the public page defaults to the after-event tab and blocks registration submission.
- Fees follow the source: 750,000/1,000,000 VND per attendee and 1,500,000/2,000,000 VND per display table, member/non-member respectively.
- Planned attendance is explicitly labelled as planned. Mockup statistics, sponsor prices and invented participant companies are not published as real records.

## Verification

- `node --test src/pages/__tests__/programDiscovery.test.js src/pages/__tests__/programWorkflow.test.js src/pages/__tests__/thaiHoaEventLanding.test.js`: **27 passed, 0 failed**.
- `npm run build`: **passed**.
- Browser widths checked: 390, 430, 768 and 1440px; no horizontal page overflow. At final desktop and mobile checks, all rendered images loaded.
- Verified old-route redirect, supplier form selection, sponsor package selection and lifecycle tab changes. No payment or form submission was performed.
- TDD: new tests initially failed before the model existed, then passed after implementation. A checkpoint commit was unavailable because the environment denies writes to `.git/index.lock`; no commit was created.
- Existing unrelated worktree whitespace warnings were not rewritten.

Screenshots:

- [Desktop 1440px](thai-hoa-landing/desktop-1440.png)
- [Mobile 430px](thai-hoa-landing/mobile-430.png)

## Data and remaining boundaries

The page consumes the program's published cloud configuration. Participants require `visibility: PUBLIC`, `publishStatus: PUBLISHED`, and `status: CONFIRMED` or `APPROVED`. Sponsor prices require an approved fixed amount; unapproved prices show “Chờ công bố”. Sponsor rights are marked as proposed until approved.

The generic Admin form has **not** been expanded into a dedicated editor for sponsor packages, participant approvals or post-event results. Those publishing controls, actual approved participant/result data and final sponsor terms remain separate work. This delivery does not assert full back-office completion or pixel-identical reproduction: supplied logos, honest empty states and the real event status intentionally differ from the reference.

## Image generation record

Mode: new generation with the supplied layout image as a visual reference. Final web asset: `public/images/events/thai-hoa-hero.jpg` (2172 × 724, approximately 492 KB). Existing compressed Team KCN video remains click-to-play with `preload="none"`.

Prompt: “Create a production website hero backdrop, not a UI screenshot. Wide horizontal 3:1 composition. Leftmost 22%: realistic Vietnamese eco-industrial park entrance and lush landscaping, blue sky, with a friendly polished white-and-blue 3D assistant robot with cyan eyes, subtle orange accent, holding a blue tablet in foreground near bottom. Rightmost 22%: realistic industrial business exhibition hall and executives, with a second polished white-and-blue 3D assistant robot holding a tablet in foreground near bottom. Middle 56% is bright white with faint pale blue sky and a very soft fade at both sides, absolutely empty for HTML typography and three real logos to overlay. Robots face the center. Architecture and conference photos softly fade into the white center. No text, inscriptions, logos, speech bubbles, buttons, gears, menus or panels. Illustrative backdrop, not evidence of a real event.”

## Self-evaluation

| Axis | Score / 5 | Evidence and limitation |
| --- | --- | --- |
| Accuracy | 4 | Source dates/fees, original logos, approved-only public data; no invented sponsor prices. |
| Completeness | 4 | Requested page, slug, registration anchor and responsive views delivered; dedicated Admin publishing editor remains outside this implementation. |
| Clarity | 4 | Distinct buyer/supplier entry, compact information panels and honest pending/closed states. |
| Actionability | 4 | Working local route and role/package selection verified; real registration is closed by the source deadline. |
| Conciseness | 4 | Dense reference-inspired first screen with detailed workflows below; this QA record holds implementation detail outside the user handoff. |

Overall: **4.0/5**. Self-check: no claim of production deployment, successful database mutation, approved commercial terms, or pixel-perfect identity. Follow-ups: publish real approved event records; add dedicated Admin publishing controls if requested; confirm a revised event date before reopening registration.
