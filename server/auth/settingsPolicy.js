import { AssistantError } from '../assistants/difyClient.js';
import { DEFAULT_PREFERENCES, MEMBER_ROLES } from '../../src/data/userSettings.js';
import { BUSINESS_ROLE_IDS, normalizeBusinessRole } from '../../src/data/accountRoles.js';

const invalid = () => new AssistantError('AUTH_VALIDATION', 'Cài đặt không hợp lệ. Vui lòng kiểm tra lựa chọn.', 400);
export const orgForbidden = () => new AssistantError('FORBIDDEN', 'Bạn chưa có quyền thực hiện thao tác trong doanh nghiệp này.', 403);
const visibility = ['PUBLIC', 'MEMBERS', 'MATCHED_ONLY', 'HIDDEN'];
const enums = { 'suppi.mode': ['Exact', 'Balanced', 'Explore'], 'privacy.profile': visibility, 'privacy.phone': visibility, 'privacy.email': visibility, 'privacy.zalo': visibility, 'privacy.requirement': ['PRIVATE', 'MATCHED_SUPPLIERS_ONLY', 'PUBLIC_SUMMARY'] };
export function validatePreferences(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw invalid();
  const result = structuredClone(DEFAULT_PREFERENCES);
  for (const [section, values] of Object.entries(input)) {
    if (!Object.hasOwn(result, section) || !values || typeof values !== 'object' || Array.isArray(values)) throw invalid();
    for (const [key, value] of Object.entries(values)) {
      if (!Object.hasOwn(result[section], key)) throw invalid();
      if (section === 'context') {
        if (key === 'organizationId' ? value !== null && (typeof value !== 'string' || !/^[\w-]{1,100}$/.test(value)) : value !== null && !BUSINESS_ROLE_IDS.includes(value)) throw invalid();
      } else if (section === 'notifications') {
        if (!['REALTIME', 'DAILY', 'OFF'].includes(value) || (key === 'system' && value !== 'REALTIME')) throw invalid();
      } else if (enums[`${section}.${key}`]) {
        if (!enums[`${section}.${key}`].includes(value)) throw invalid();
      } else if (typeof value !== 'boolean' || (key === 'confirmActions' && !value)) throw invalid();
      result[section][key] = value;
    }
  }
  return result;
}
export function readPreferences(value) { try { return validatePreferences(value || {}); } catch { return structuredClone(DEFAULT_PREFERENCES); } }
export function validatePersonalSettings(input) {
  const limits = { title: 120, phone: 40, zalo: 200, avatar: 500, language: 2, timezone: 80 };
  const result = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (!Object.hasOwn(input, key)) continue;
    const value = input[key];
    if (typeof value !== 'string' || value.length > limit) throw invalid();
    if (key === 'language' && !['vi', 'en'].includes(value)) throw invalid();
    if (key === 'timezone') { try { new Intl.DateTimeFormat('vi', { timeZone: value }).format(); } catch { throw invalid(); } }
    if (key === 'avatar' && value) {
      if (!/^\/(?!\/)/.test(value)) { let url; try { url = new URL(value); } catch { throw invalid(); } if (url.protocol !== 'https:' || url.username || url.password) throw invalid(); }
    }
    result[key === 'avatar' ? 'avatar_url' : key] = value.trim();
  }
  return result;
}
const permissions = {
  view: MEMBER_ROLES, members: ['owner', 'admin'], roles: ['owner', 'admin'], facilities: ['owner', 'admin', 'editor'],
  finance: ['owner', 'admin', 'finance'], events: ['owner', 'admin', 'event_coordinator'], sourcing: ['owner', 'admin', 'buyer'],
  selling: ['owner', 'admin', 'sales'], transfer: ['owner'], archive: ['owner'],
};
export function requireOrgPermission(membership, action) {
  if (membership?.status !== 'ACTIVE' || !permissions[action]?.some(role => membership.roles?.includes(role))) throw orgForbidden();
  return true;
}
export function organizationPermissions(membership) { return Object.fromEntries(Object.keys(permissions).map(key => [key, membership?.status === 'ACTIVE' && permissions[key].some(role => membership.roles?.includes(role))])); }
export function validateContext(context, organizations, declaredRoles) {
  const organization = context.organizationId ? organizations.find(org => org.id === context.organizationId && org.membership?.status === 'ACTIVE' && org.status !== 'ARCHIVED') : null;
  if (context.organizationId && !organization) throw orgForbidden();
  const allowed = organization ? organization.roles.map(normalizeBusinessRole).filter(Boolean) : declaredRoles;
  if (context.role && !allowed.includes(context.role)) throw invalid();
  return { organizationId: organization?.id || null, role: context.role || null };
}
export function assertCanLeave(members, userId) {
  const active = members.filter(member => member.status === 'ACTIVE');
  if (active.some(member => member.user_id === userId && member.roles.includes('owner')) && !active.some(member => member.user_id !== userId && member.roles.includes('owner'))) throw new AssistantError('SOLE_OWNER', 'Bạn là chủ sở hữu duy nhất. Hãy chuyển quyền sở hữu trước.', 409);
}
export function projectProfile(user, access = {}) {
  const privacy = user.preferences.privacy;
  const visible = value => access.self || value === 'PUBLIC' || (value === 'MEMBERS' && access.member) || (value === 'MATCHED_ONLY' && access.matched && user.preferences.events.shareContactAfterApproval);
  if (!visible(privacy.profile)) return null;
  const result = { id: user.id, fullName: user.fullName, title: user.title, avatar: user.avatar };
  for (const key of ['email', 'phone', 'zalo']) if (visible(privacy[key])) result[key] = user[key];
  return result;
}
