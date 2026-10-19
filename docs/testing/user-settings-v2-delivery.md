# User Settings v2 — delivery, 2026-10-13

## Architecture and route

Existing `/tai-khoan/cai-dat` and AuthContext/AuthForm remain the entry point. Seven sections: Account, Business, Connections, Events, Privacy, Payments, System. User profile/preferences remain in existing Supabase Auth metadata; confirmed user roles are read from app metadata. Existing organizations and factories are reused. Only the missing authenticated User–Organization membership relation was added. Business roles never grant staff or membership permissions.

The migration `server/migrations/20261013_user_settings.sql` was applied successfully to the connected Supabase project. It creates `ccu_org_user_memberships` and scoped server-only RPCs, with RLS and revoked anonymous/authenticated direct access. Organization roles retain the registry's uppercase canonical values. Transactional dedupe, ownership transfer, sole-owner protection, archive and restore are enforced at the database boundary. Claims remain pending review, not automatic ownership.

## APIs

- Existing POST `/api/auth/settings`: personal fields, declared roles and validated preferences.
- GET `/api/auth/settings`: capabilities, memberships and invitations.
- GET `/api/auth/settings/organizations/search?q=…`: dedupe search.
- GET `/api/auth/settings/organizations/:id`: membership-scoped members/facilities/permissions.
- POST `/api/auth/settings/organizations`: create, claim, roles, invite, accept, member, transfer, leave, archive, restore, facility, delete-account-request.
- GET `/api/auth/profiles/:id`: server-filtered profile/contact projection.
- POST `/api/auth/logout-all`: verified-user global session logout with confirmation.

All actor identities come from verified server authentication. Client role/context values cannot manufacture membership. RBAC covers owner/admin/buyer/sales/editor/finance/event_coordinator. Organization selection and role context are validated server-side. AI context is opt-in and scoped to the current authenticated user and selected organization. Consequential actions require confirmation. Private and matched-only requirements are excluded from public data; public summaries omit full specifications and attachments.

## Verification

- Full `npm test`: **179 passed, 0 failed**. Run with localhost server permissions; sandbox-only execution cannot run HTTP callback tests.
- Vite production build passed. Existing application bundle-size warnings remain unrelated to this settings change.
- SQL transaction fixture executed against the connected database: PASS; all synthetic users, organizations and submissions rolled back. Checks cover dedupe, role membership, invitation acceptance, forbidden escalation, private facilities, sole-owner guards, transfer, leave, archive/restore and RLS.
- Browser checked all seven sections, multi-role selection, context choices, canceling the global-logout confirmation, desktop and 390px mobile layout. Mobile DOM width/scrollWidth both 384px; no horizontal document overflow. No real user logout, account deletion, payment or invitation was performed during QA.
- Changed tracked files pass scoped `git diff --check`. Pre-existing whitespace issues elsewhere were left untouched.

## Explicit limitations

- CHAINY reminder and notification frequencies persist as preferences; no outbound email/Zalo dispatcher or digest scheduler exists yet. Those channels are not advertised as active delivery.
- MFA, individual session listing, Event Pass issuance, invoice/refund/payment processing are not implemented by the existing project. UI states this explicitly and keeps financial entry points separate.
- Account deletion is a guarded pending request through the existing submission workflow, not immediate hard deletion. Claims require administrator review; approval-to-membership automation is not part of this change.
- Matched-only contact access fails closed until a trusted approved-matching registry is available.
- SUPPI matching modes are passed as sourcing preferences, not represented as guaranteed deterministic matching quality.
- Avatar is an image URL field; email remains the verified login identity, not an unverified editable profile field.

## Files changed for this task

Frontend:
`src/components/auth/AccountSettings.jsx`, `AccountSettings.css`, `UserSettings.jsx`, `OrganizationSettings.jsx`, `SettingsPrimitives.jsx`; `src/data/accountRoles.js`, `src/data/userSettings.js`; `src/services/authSession.js`.

Server:
`server/auth/accountSettings.js`, `settingsPolicy.js`, `userSettingsService.js`, `matchingContext.js`, `service.js`; `server/routes/auth.js`, `assistants.js`, `submissions.js`; `server/assistants/service.js`; `server/storage/supabaseRepository.js`; `server/migrations/20261013_user_settings.sql`.

Tests/docs:
`server/tests/account-settings.test.js`, `user-settings-v2.test.js`, `user-settings-transaction.sql`; `docs/testing/user-settings-architecture.md`, this report.

## Self-evaluation

- Accuracy: 4/5 — unit/integration tests and real rollback SQL support the security and persistence claims; unsupported downstream engines explicitly excluded.
- Completeness: 4/5 — requested settings surface and core multi-organization/RBAC implemented; missing project-wide delivery/billing/MFA engines not fabricated.
- Clarity: 5/5 — seven compact sections, declared/confirmed distinction and capability notes.
- Actionability: 5/5 — working route, applied schema, exact APIs, source files and repeatable tests supplied.
- Conciseness: 4/5 — user-facing response short; technical evidence collected here.
