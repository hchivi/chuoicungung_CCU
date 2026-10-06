# CCU: bright service and partnership pages

Scope: the five existing bright service/partnership pages plus the 2026-10-05 redesign of `/doi-tac-phat-trien` and `/dich-vu/to-chuc-ket-noi`. The latest user request also authorizes a public-site brand-color refresh and green footer. Shared navigation/footer layout, links, routes, data layers and backend stay in place.

2026-10-05 lifecycle-map addition (approved v2): `/ban-do-6-giai-doan` is a customer-facing interactive journey. Preserve the complete six-stage/eighteen-phase dataset and all orientation keywords. Use the approved Industrial Cinematic cover, one floating six-card lifecycle board around the actual CCU logo, selected-stage photography, six-color phase selection and a focused task/need detail surface. Do not display mock supplier counts, fictional certification proof or paid ranking as verified matching results.

2026-10-05 addition: `/san-nhu-cau` becomes a compact, customer-first marketplace below its preserved photographic hero. Public page H1/hero title presentation is uppercase through the public-shell stylesheet, without rewriting wording or SEO strings. Private admin/AI/ToDzung layouts are excluded. The marketplace inherits the site's actual runtime typography, including existing Arial overrides; this task does not swap global fonts.

## Position

2026-10-06 supplier directory addition: `/nha-cung-ung` keeps its hero, data and routes. The four discovery blocks use a bright B2B workbench: six numbered lifecycle columns with all eighteen full phase labels, an A–Z industry index plus a keyword side rail, compact native filter controls, and photo-led supplier records. Use variance 5, motion 2, density 6. Preserve the existing image sources and recorded phase associations; prioritise a selected phase only when the supplier actually serves it. Keep contact numbers masked with request-to-connect actions, and never display fabricated MOQ, delivery time or generic capacity claims. Shared chrome is out of scope. Colors and controls are scoped to `.sd-directory`.

Customer-first B2B: show what a factory, supplier, KCN, association or partner can do here, then give one clear next step. Short content, useful photography and transparent boundaries. No invented customer counts, performance metrics, endorsements or guaranteed matching outcomes.

## Visual system

Modern-minimal, bright premium. Inherit CCU's SpaceGrotesk display and Poppins body typography. Forest green is the action color, not a full-page fill. Shared public-brand roles and scoped `.ec-page` / `.mm-page` colors live in `tokens.css`. Primary green is #006039; footer green is #082415. References: Rolex's restrained green direction and Lacoste Vietnam's computed footer color; this is not a copy of either site's layout or brand assets.

Display: 36–68px responsive. Section title: 28–40px. Body: 16px. Supporting copy: 14px minimum. Controls: 44–52px touch height; form text 16px to avoid mobile auto-zoom. Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Media radius 24px; controls 12px. User-requested exception: restrained two-stop green gradients on primary buttons. No gradient text, decorative blobs, animated counters or hover scaling in the redesigned pages. The footer's green surface is an explicit user requirement, not a new accent-fill rule for page sections.

## Page-specific composition

| Page | Structure | Main customer action |
| --- | --- | --- |
| Remote presence | Photograph-led split, outcome rail, preparation, programs, intake | Choose a program and send approved material |
| Merchandise | Product collection, sample-first brief, responsibility toggle, process | Request a kit or send custom specifications |
| Media | Wide editorial cover, visual mosaic, use-context switch, approval sequence | Request a profile, photo, video or catalogue |
| Partnership | Compact photographic introduction, sticky role navigator, changing brief, intake | Select the right partnership role |
| Sponsorship | Uneven paired photography, visual opportunity catalogue, rights brief, activity filter, intake | Select an activity and propose a contribution |
| Development partner | Network contribution selector, four-step working agreement, labeled intake | Select a contribution and register for discussion |
| Matchmaking | Four-format visual catalogue, three-stage process selector, scope and FAQ | Send a brief with preserved service/format parameters |
| Demand marketplace | Preserved hero, search/filters, two-column opportunities, compact participation guide | Read requirements and submit a capability response, or post a buyer need |
| Six-stage map | Full-bleed cinematic industrial cover, stage shortcut rail, floating six-card board, stage photograph, six-color phase explorer, task/need detail, ecosystem links | Locate the current phase, explore its needs and open the existing phase/source workflow |

Use a consistent theme for the multi-page request, but vary the discovery surface. This intentionally supersedes per-run palette rotation. Preserve global chrome rather than introducing five new navigations.

Marketplace Taste dials: variance 5, motion 2, density 5. It is a working discovery surface, not a full marketing landing page. Keep the existing hero asset and wording as explicitly requested. Do not force new illustrations, extra persuasion sections or a theme toggle onto this page. Show primary filters first, disclose stage/sample/survey filters on demand, and use registered canonical routes for secondary links. Never manufacture quantity, urgency, buyer contact, matching scores or verification claims to decorate a card.

Lifecycle-map Taste dials (approved v2): variance 7, motion 3, density 5. Industrial Cinematic: full-bleed photograph with green scrim and uppercase title, otherwise bright content. The dark photographic hero is an explicit user choice. The six existing category colors now extend to tinted phase surfaces, readable darker inks and selected states; primary actions remain green. Stage numbers represent actual order. Radial symmetry and gentle card tilts intentionally follow the user's floating-board screenshot. The three phase cards are a real three-phase grouping, not an arbitrary feature grid. Below 1024px the board becomes a two-column navigator; below 640px it becomes one column. Board activation focuses the phase list; phase activation focuses task/need detail, with a return link. CSS hover lift only, no automatic motion or WebGL; reduced motion disables hover movement and makes scrolling immediate. Keyword disclosures preserve every keyword. Inherit actual runtime typography; do not change sitewide fonts. Protected stage-6 en-dashes remain by the user's preservation requirement.

## Copy and image rules

2026-10-06 approved assistant block: apply preview A “Sân khấu bộ đôi” through the existing `SuppiChainyConciseSection` homepage mount. Preserve both original laptop mascot sprites. SUPPI identity and CTA use scoped blue; CHAINY identity and CTA use scoped pink, an explicit user exception to green-only actions. Keep the light mint stage and existing fonts. Mascots sit slightly lower; local layers may overlap identity lettering, never role captions or controls. Explain SUPPI's sourcing/specification/RFQ purpose and CHAINY's preparation/coordination purpose without promising automatic booking or guaranteed outcomes. Keep existing assistant destinations and all other homepage sections unchanged. No backend changes or deployment.

2026-10-06 homepage program selection: user approved A exhibition invitation, explicitly removing the yellow “Xem mẫu. Gặp đối tác.” overlay. The real homepage and A preview now share an ivory ticket frame, invitation salutation, large two-line event heading, green program CTA, unobstructed wide photograph and perforated participation rail. Prioritize Nhà máy, Nhà cung cấp, Hội / Hiệp hội / Tổ chức; preserve their existing destinations. B/C remain preview-only reference alternatives at `docs/testing/expo-homepage-options.html`, excluded from the production entry. The ivory surface is scoped to this component, not a sitewide palette change. This approved composition supersedes the split-layout program block below. All other homepage blocks remain unchanged. No deployment.

Homepage program-block addition (2026-10-05 evening): redesign only the existing `SupplyChainExpoPaper3D` entry point under the preserved `#chuong-trinh` anchor. Reading: a bright, photograph-led B2B program invitation for factories, suppliers and KCN/associations. Taste dials: DESIGN_VARIANCE 6, MOTION_INTENSITY 3, VISUAL_DENSITY 4. Keep the site's green action palette and actual runtime heading/body fonts; native CSS within the existing React/Tailwind 3 project, not a new design-system package. Replace the blurry portrait canvas pass and giant background wordmark with a two-line event heading, short benefit statement and large editorial photograph. A compact role selector beneath changes practical preparation benefits and the existing destination query; no automatic carousel or WebGL. Desktop: asymmetric image/copy composition; mobile: one column and one-row role choices. Lazy responsive images reserve a 3:2 box, with a readable load-error fallback. Motion is limited to hover/press feedback and honors reduced motion. Bright-only mode intentionally inherits the homepage rather than introducing a section-level theme switch. Generated photography describes a meeting, not attendance evidence for a named event. No invented dates, attendance counts, rankings or guaranteed outcomes. Keep all other homepage blocks and backend untouched.

Homepage matching-diagram addition (2026-10-05): only `DualGearsMatchingSection` is changed. The user requests two original multicolor `/logo_only.png` marks as interlocking gears, white stationary centers with outlines/connector, and continuously paired demand/solution keywords. Dials: DESIGN_VARIANCE 4, MOTION_INTENSITY 6, VISUAL_DENSITY 5. Symmetry is deliberate for this two-sided mechanism; 36-second opposite rotations use constant linear speed rather than spring physics, an intentional mechanical-animation exception. Preserve all six existing keyword pairs and stage routes. Change both sides every 4.5 seconds, keep text upright, and expose pause/resume. Stop automatic movement for reduced motion, offscreen/hidden states, and focus on a changing hub link. Stack the pair below 768px. Bright theme, green controls, circular white hubs and actual rainbow brand assets are explicit user constraints. Do not generate or recolor a replacement logo, alter the rest of the homepage, or present this illustration as live database matching.

Content derives from the existing CCU master context and service data. Investor discussions are separate from sponsorship. Founding Partner is commercial category presence, not equity. Paid presence does not change matching or supplier verification.

Local photographic assets explain the service; they are not testimonials, event attendance evidence or proof of delivered work. Do not label a generated scene as a specific real CCU event. The user requested no visible AI-illustration captions. Keep asset provenance in the testing report instead. Remove seeded report metrics and simulated approvals from the public persuasion layer.

## Interaction and accessibility

Use native buttons, links, selects and dialogs. Changing choices expose `aria-pressed`. Dialogs support Escape, focus containment and return focus. Form controls have associated labels, visible focus and unchanged required-field/consent handling. Show errors with `role="alert"`. Motion stays restrained and has reduced-motion alternatives.

All image grid tracks use `minmax(0, ...)`. Controls cannot exceed their containers. On mobile the page becomes one column, role navigation remains usable, and buttons keep short single-line labels. Scope clipping to these pages; do not apply global HTML/body overrides to unrelated routes.

## Implementation boundary

Do not change backend endpoints, persistence, seeded records, production hosting, URL slugs or shared site layout in this task. Intake success means the existing local submission handler completed, not that production email, CRM or database delivery has been verified. Development-partner intake explicitly discloses local browser storage before and after submission. Production data wiring needs a separate task.

## Shared-color boundaries

`.ccu-public-shell` owns public brand variables. Private admin, ToDzung and AI-workspace layouts are excluded. Primary action buttons and known legacy blue interactive classes receive green compatibility styling; neutral selectors remain light, destructive/error states and lifecycle category colors retain meaning. The shared stylesheet is append-only except for the required top-of-file token import. Footer links and copy are not rewritten.

## Portable exports

Runtime source of truth is `tokens.css`; these snippets are copyable mappings, not additional runtime styles. CCU uses Tailwind 3, so do not paste a v4 `@theme` block into this project or upgrade its framework for a color change.

CSS roles (scoped to the public shell at runtime):

```css
.ccu-public-shell {
  --brand-green: #006039;
  --brand-green-light: #127b4b;
  --brand-green-dark: #00472a;
  --brand-footer: #082415;
  --brand-on-green: #ffffff;
}
```

Tailwind v4 equivalent for a future compatible project:

```css
@theme {
  --color-primary: #006039;
  --color-primary-light: #127b4b;
  --color-primary-dark: #00472a;
  --color-footer: #082415;
  --font-display: 'SpaceGrotesk', sans-serif;
  --font-body: 'Poppins', sans-serif;
}
```

DTCG:

```json
{
  "color": {
    "primary": { "$type": "color", "$value": "#006039" },
    "primaryLight": { "$type": "color", "$value": "#127b4b" },
    "primaryDark": { "$type": "color", "$value": "#00472a" },
    "footer": { "$type": "color", "$value": "#082415" }
  },
  "font": {
    "display": { "$type": "fontFamily", "$value": ["SpaceGrotesk", "sans-serif"] },
    "body": { "$type": "fontFamily", "$value": ["Poppins", "sans-serif"] }
  }
}
```

shadcn/ui role mapping, modern OKLCH triple syntax:

```css
.ccu-public-shell {
  --background: 98.5% 0.004 155;
  --foreground: 27% 0.028 155;
  --card: 99.8% 0.002 155;
  --card-foreground: 27% 0.028 155;
  --primary: 42% 0.09 155;
  --primary-foreground: 99% 0.004 155;
  --secondary: 96% 0.012 155;
  --secondary-foreground: 38% 0.028 155;
  --muted: 96% 0.012 155;
  --muted-foreground: 46% 0.018 155;
  --accent: 94% 0.024 155;
  --accent-foreground: 27% 0.028 155;
  --border: 88% 0.016 155;
  --input: 65% 0.025 155;
  --ring: 39% 0.08 155;
  --radius: 0.75rem;
}
```
