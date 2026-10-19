import { AssistantError } from '../assistants/difyClient.js';
import { settingsFromUser } from './accountSettings.js';
import { organizationPermissions, projectProfile, requireOrgPermission } from './settingsPolicy.js';
import { BUSINESS_ROLE_IDS } from '../../src/data/accountRoles.js';
import { MEMBER_ROLES } from '../../src/data/userSettings.js';

const unavailable = () => new AssistantError('SETTINGS_SCHEMA_REQUIRED', 'Quản lý doanh nghiệp cần áp dụng migration User Settings trên database.', 503);
const invalid = () => new AssistantError('AUTH_VALIDATION', 'Kiểm tra thông tin doanh nghiệp hoặc thao tác đã chọn.', 400);
const requireUser = user => { if (!user?.id) throw new AssistantError('AUTH_REQUIRED', 'Vui lòng đăng nhập.', 401); };
async function query(promise) {
  const result = await promise;
  if (result.error) throw new AssistantError('SETTINGS_UNAVAILABLE', 'Chưa tải được dữ liệu cài đặt. Vui lòng thử lại.', 503);
  return result.data || [];
}
export function createUserSettingsService({ client }) {
  async function memberships(userId) {
    const result = await client.from('ccu_org_user_memberships').select('organization_id,user_id,roles,status,created_at').eq('user_id', userId);
    if (result.error?.code === 'PGRST205' || result.error?.code === '42P01') return null;
    if (result.error) throw new AssistantError('SETTINGS_UNAVAILABLE', 'Chưa tải được membership doanh nghiệp.', 503);
    return result.data || [];
  }
  async function organizationsFor(user) {
    requireUser(user);
    const links = await memberships(user.id);
    if (links === null) return { schemaReady: false, organizations: [], invitations: [] };
    const ids = links.map(link => link.organization_id);
    if (!ids.length) return { schemaReady: true, organizations: [], invitations: [] };
    const organizations = await query(client.from('organizations').select('id,name,roles,status,verification_status,metadata').in('id', ids));
    const rows = organizations.map(org => {
      const membership = links.find(link => link.organization_id === org.id);
      return { id: org.id, name: org.name, roles: org.roles || [], confirmedRoles: org.metadata?.confirmed_roles || [], status: org.status, verificationStatus: org.verification_status, membership, permissions: organizationPermissions(membership) };
    });
    return { schemaReady: true, organizations: rows.filter(org => org.membership.status === 'ACTIVE'), invitations: rows.filter(org => org.membership.status === 'INVITED') };
  }
  async function requireMembership(user, organizationId, permission = 'view') {
    const state = await organizationsFor(user);
    if (!state.schemaReady) throw unavailable();
    const org = state.organizations.find(item => item.id === organizationId && item.status !== 'ARCHIVED');
    requireOrgPermission(org?.membership, permission);
    return org;
  }
  return {
    organizationsFor,
    async state(user) {
      const state = await organizationsFor(user);
      return { ...state, preferences: settingsFromUser(user).preferences,
        capabilities: { reminders: false, dailyDigest: false, emailNotifications: false, zaloNotifications: false, mfa: false, paymentProcessing: false, eventPass: false, allSessions: false },
        providers: [...new Set([...(user.identities || []).map(item => item.provider), user.app_metadata?.provider, user.user_metadata?.social_provider].filter(Boolean))],
        currentSession: { label: 'Phiên đăng nhập hiện tại', verified: true },
      };
    },
    async organizationDetails(user, organizationId) {
      const org = await requireMembership(user, organizationId);
      const [members, facilities] = await Promise.all([
        query(client.from('ccu_org_user_memberships').select('user_id,roles,status,created_at').eq('organization_id', organizationId)),
        query(client.from('factories').select('id,name,province,industrial_park').contains('data', { organization_id: organizationId })),
      ]);
      // Member names are projected by a scoped RPC, never by exposing auth.users.
      const names = await query(client.rpc('ccu_settings_member_names', { p_actor: user.id, p_organization: organizationId }));
      return { ...org, members: members.map(member => ({ ...member, name: names.find(item => item.user_id === member.user_id)?.name || 'Thành viên' })), facilities };
    },
    async organizationAction(user, input) {
      requireUser(user);
      const state = await organizationsFor(user);
      if (!state.schemaReady) throw unavailable();
      const allowed = ['create', 'claim', 'roles', 'invite', 'accept', 'member', 'transfer', 'leave', 'archive', 'restore', 'facility', 'delete-account-request'];
      if (!allowed.includes(input.action)) throw invalid();
      if (input.action !== 'create' && input.action !== 'delete-account-request' && (typeof input.organizationId !== 'string' || !/^[\w-]{1,100}$/.test(input.organizationId))) throw invalid();
      const patch = {};
      for (const key of ['name', 'taxCode', 'website', 'email', 'targetUserId', 'province', 'reason']) {
        if (input[key] === undefined) continue;
        if (typeof input[key] !== 'string' || input[key].length > 300) throw invalid();
        patch[key] = input[key].trim();
      }
      if (input.roles !== undefined) {
        const roleSet = input.action === 'roles' || input.action === 'create' ? BUSINESS_ROLE_IDS : MEMBER_ROLES;
        if (!Array.isArray(input.roles) || !input.roles.length || input.roles.length > roleSet.length || input.roles.some(role => !roleSet.includes(role))) throw invalid();
        patch.roles = [...new Set(input.roles)];
      }
      if (['create', 'facility'].includes(input.action) && !patch.name) throw invalid();
      if (['archive', 'restore', 'leave', 'transfer', 'delete-account-request'].includes(input.action) && input.confirm !== true) throw new AssistantError('CONFIRMATION_REQUIRED', 'Vui lòng xác nhận thao tác trước khi thực hiện.', 400);
      const result = await client.rpc('ccu_settings_org_action', { p_actor: user.id, p_action: input.action, p_organization: input.organizationId || null, p_input: patch });
      if (result.error) {
        const messages = { SOLE_OWNER: ['Bạn là chủ sở hữu duy nhất. Hãy chuyển quyền sở hữu trước.', 409], FORBIDDEN: ['Bạn không có quyền thực hiện thao tác này.', 403], DUPLICATE_ORGANIZATION: ['Doanh nghiệp đã tồn tại. Hãy tìm và yêu cầu nhận quản lý hồ sơ.', 409], INVALID_INPUT: ['Thông tin không hợp lệ hoặc trạng thái đã thay đổi.', 400] };
        const code = Object.keys(messages).find(key => result.error.message?.includes(key));
        if (code) throw new AssistantError(code, ...messages[code]);
        throw new AssistantError('SETTINGS_UNAVAILABLE', 'Chưa hoàn tất thao tác doanh nghiệp.', 503);
      }
      return result.data;
    },
    async searchOrganizations(user, term) {
      requireUser(user);
      if (typeof term !== 'string' || term.trim().length < 2 || term.length > 100) return [];
      const safe = term.trim().replace(/[%_,()]/g, '');
      return query(client.from('organizations').select('id,name,roles,verification_status').eq('status', 'PUBLISHED').or(`name.ilike.%${safe}%,tax_code.eq.${safe}`).limit(12));
    },
    async publicProfile(viewer, targetId) {
      if (typeof targetId !== 'string' || !/^[\w-]{1,100}$/.test(targetId)) throw invalid();
      const { data, error } = await client.auth.admin.getUserById(targetId);
      if (error || !data?.user) throw new AssistantError('NOT_FOUND', 'Không tìm thấy hồ sơ.', 404);
      let member = false;
      if (viewer && viewer.id !== targetId) {
        const [a, b] = await Promise.all([memberships(viewer.id), memberships(targetId)]);
        member = Boolean(a?.some(x => x.status === 'ACTIVE' && b?.some(y => y.status === 'ACTIVE' && y.organization_id === x.organization_id)));
      }
      // No approved-match registry exists yet: MATCHED_ONLY stays closed, regardless of query flags.
      const raw = data.user;
      return projectProfile({ id: raw.id, email: raw.email, fullName: raw.user_metadata?.full_name || '', avatar: raw.user_metadata?.avatar_url || '', ...settingsFromUser(raw) }, { self: viewer?.id === raw.id, member, matched: false });
    },
  };
}
