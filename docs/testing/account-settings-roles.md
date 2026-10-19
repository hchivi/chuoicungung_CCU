# Account settings and business roles, 2026-10-13

## Delivered behavior

`/tai-khoan` and `/tai-khoan/cai-dat` render account settings with profile fields, multi-role selection, a primary role, role workspaces and existing password management. All five workspace headings are visible. Unselected groups render a selection notice and an Add role action; their function links are not rendered. Draft selections do not unlock groups until the server confirms the save. Clearing all roles locks all groups again.

Roles: `factory`, `supplier`, `kcn`, `association`, `partner`. Existing public routes and authenticated owner workspaces are reused. These self-selected business roles personalize navigation; they do not grant organization ownership, access to another user's data, or staff rights.

## Persistence and boundary

- `POST /api/auth/settings` verifies the Supabase access token and confirmed user, derives the target user ID from that token, validates the role allowlist and primary membership, and updates the user's Supabase Auth metadata through the server client.
- Database fields: `auth.users.raw_user_meta_data.business_roles`, `primary_business_role`, `full_name`, `company_name`. No schema migration is required. Other provider metadata is preserved.
- Session/login responses read the saved roles from Supabase. Email registration now persists its existing role selection. OAuth users select roles in account settings after login.
- Staff permissions continue to come only from `ccu_staff_roles`. Submitted user IDs, staff roles and unrelated properties cannot change the target or grant staff rights.
- Existing same-site mutation checks, cookies, rate limiting and database failure handling remain in effect. The browser updates the active account only if the response belongs to that account, then broadcasts a session refresh to other tabs.
- No localStorage fallback or simulated successful database save.

## TDD evidence

RED: five initial tests failed for the intended missing method, endpoint and signup-role persistence. Additional clear-all test failed before support was implemented. GREEN: 34/34 authentication, account settings and client tests pass.

Command: `node --test --experimental-test-coverage --test-coverage-include='server/auth/accountSettings.js' --test-coverage-include='src/data/accountRoles.js' --test-coverage-lines=80 --test-coverage-branches=80 server/tests/account-settings.test.js server/tests/auth-client.test.js server/tests/auth-admin.test.js server/tests/auth-social.test.js`

Coverage: 100% lines, branches and functions for the new role/validation modules. This does not claim 100% frontend or full authentication-service coverage. API tests verify owner isolation, rejection of invalid roles, persistence across reads, stripping staff metadata, error behavior and response token exclusion. Browser-store tests verify settings cannot switch the active user.

Git checkpoint commits were not created: the supplied permissions make `.git` read-only and the checkout contains extensive pre-existing changes. The test stages are recorded here instead. No unrelated changes were reset.

## Live validation

- Backend successfully connected to Supabase. Reloaded only the process listening on port 5050; frontend and other processes were not stopped.
- `.env` has the production SITE_URL. The dev backend was started with the process-only `SITE_URL=http://localhost:3000` override for localhost OAuth. The file was not edited.
- Real Google login completed with the owner's existing account. Initial saved business roles were empty.
- Selected factory, saved successfully, reloaded the page: factory workspace remained enabled and the other four were locked.
- Added supplier and saved: factory and supplier enabled together; three other groups remained locked.
- Opened a second tab: it independently loaded the two persisted roles. Verified 390px rendering with no horizontal overflow.
- Restored empty roles and no primary role after testing, preserving the user's original preference and profile values. All groups locked again. No staff permissions changed.
- Production frontend compilation passed. The existing post-build bootstrap export separately reports Supabase network access failure in the restricted build environment; no live deployment or successful data-export claim is made.
- Existing unrelated whitespace at `src/App.jsx:95` is reported by diff-check and was left unchanged.

Proofs: `/private/tmp/ccu-settings-factory.png`, `/private/tmp/ccu-settings-roles.png`, `/private/tmp/ccu-settings-mobile.png`, `/private/tmp/ccu-settings-complete.png`.

## Self-evaluation

Accuracy 5/5: real save/reload and isolated tests agree. Completeness 4/5: five role workspaces, profile editing, primary role, add/remove and persistence delivered; no new ownership verification or downstream notification engine is implied. Clarity 5/5: locked notices and unsaved changes distinguish selection from persisted state. Actionability 5/5: both existing account route and dedicated settings route work locally. Conciseness 4/5: profile and roles are grouped; functional descriptions remain brief.
