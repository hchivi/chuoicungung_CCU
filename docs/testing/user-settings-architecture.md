# User Settings: architecture audit and implementation contract

## Existing architecture to reuse

- Identity: Supabase Auth, cookie-only sessions, server `auth.getUser`, `/api/auth`, shared AuthContext and AuthForm. Staff rights remain exclusively in `ccu_staff_roles`.
- Organization registry: `organizations` with multiple `roles`; `factories` for facilities. `organizationMemberships` in public documents represents organization/network relationships, not authenticated User–Organization permissions. Legacy browser membership storage cannot authorize server mutations.
- Claim/create: existing `organizationClaim` / `organizationProposal` submissions and `/tao-ho-so`. Claims remain pending until reviewed. No automatic ownership from a declared role.
- Programs/services: private `ccu_submissions`, existing owner workspaces. Payment and Event Pass values from browser proposals are not proof of payment or attendance.
- SUPPI/CHAINY: public sourcing plus private owner conversations; no automatic outbound messaging, scheduling or payment tools. CHAINY currently drafts coordination, not an automated reminder dispatcher.

## Necessary changes

Extend the existing user metadata settings and declared-role catalog. Add only the missing authenticated User–Organization membership relation, referencing existing Auth users and existing organizations. Keep confirmed user roles in server-managed app metadata and confirmed Organization roles in server-managed Organization metadata. Never duplicate an Organization for another role. Business context is a user preference validated against membership; it is not an authorization grant.

Membership RBAC: owner, admin, buyer, sales, editor, finance, event_coordinator. Membership mutation, transfer, leave and archive run transactionally after locking the existing Organization row. A sole owner cannot leave or request account deletion. Financial permissions and flows remain distinct from sourcing/event preferences.

Settings sidebar: Account, Business, Connections, Events, Privacy, Payments, System. Unsupported delivery/MFA/billing capabilities must be labeled, never presented as active integrations. Personal and AI/event/privacy/notification preferences persist in the existing Auth metadata. No parallel account or role registry.

## Acceptance tests

- Personal profile and ten declared roles save/reload without modifying confirmed roles or staff permissions.
- Multi-organization switches reject non-members; context switches reject roles outside the selected Organization/user declaration.
- Role and membership changes require server RBAC; ordinary members cannot promote themselves; administrators cannot grant ownership.
- Dedupe runs server-side inside Organization creation, regardless of the originating UI or selected role.
- Private contact projection applies visibility server-side and fails closed when approved matching evidence is unavailable.
- Owner transfer precedes sole-owner leave/account deletion; archive is distinct from leave and account lifecycle.
- AI context includes only opted-in owner/context data. Consequential AI actions remain confirmation-only.
- Existing auth/security tests and responsive browser checks remain green.
