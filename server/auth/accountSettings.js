import { AssistantError } from '../assistants/difyClient.js';
import { BUSINESS_ROLE_IDS, businessRolesFromMetadata } from '../../src/data/accountRoles.js';
import { readPreferences } from './settingsPolicy.js';

const invalid = () => new AssistantError('AUTH_VALIDATION', 'Kiểm tra thông tin và vai trò doanh nghiệp đã chọn.', 400);
export function settingsFromUser(user) {
  const businessRoles = businessRolesFromMetadata(user.user_metadata);
  const preferred = user.user_metadata?.primary_business_role;
  return { businessRoles, primaryBusinessRole: businessRoles.includes(preferred) ? preferred : businessRoles[0] || null,
    confirmedBusinessRoles: businessRolesFromMetadata({ business_roles: user.app_metadata?.confirmed_business_roles }),
    title: String(user.user_metadata?.title || '').slice(0, 120), phone: String(user.user_metadata?.phone || '').slice(0, 40), zalo: String(user.user_metadata?.zalo || '').slice(0, 200),
    language: user.user_metadata?.language === 'en' ? 'en' : 'vi', timezone: String(user.user_metadata?.timezone || 'Asia/Ho_Chi_Minh'),
    preferences: readPreferences(user.user_metadata?.settings_v2) };
}
export function validateAccountSettings(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw invalid();
  const { fullName, companyName, businessRoles, primaryBusinessRole } = input;
  if (typeof fullName !== 'string' || !fullName.trim() || fullName.length > 200 || typeof companyName !== 'string' || companyName.length > 200) throw invalid();
  if (!Array.isArray(businessRoles) || businessRoles.length > BUSINESS_ROLE_IDS.length || businessRoles.some(role => !BUSINESS_ROLE_IDS.includes(role))) throw invalid();
  const roles = [...new Set(businessRoles)];
  if (roles.length ? !roles.includes(primaryBusinessRole) : !['', null].includes(primaryBusinessRole)) throw invalid();
  return { full_name: fullName.trim(), company_name: companyName.trim(), business_roles: roles, primary_business_role: primaryBusinessRole || null };
}
export function registrationBusinessRoles(input) {
  // Business roles personalize the account; never interpret legacy `role` as a staff grant.
  const roles = businessRolesFromMetadata({ business_roles: input.roles || input.businessRoles });
  return { business_roles: roles, primary_business_role: roles[0] || null };
}
