import { readPreferences } from './settingsPolicy.js';
import { createUserSettingsService } from './userSettingsService.js';
import { databaseResult } from '../storage/supabaseRepository.js';
const text = value => typeof value === 'string' ? value.slice(0, 400) : '';
export async function buildMatchingContext({ user, client }) {
  if (!user) return null;
  const preferences = readPreferences(user.preferences);
  const flags = preferences.suppi;
  if (![flags.useProfile, flags.useCapability, flags.useNeeds, flags.useEvents].some(Boolean)) return null;
  const context = { mode: flags.mode, role: preferences.context.role, buyerSuggestions: flags.buyerSuggestions, supplierSuggestions: flags.supplierSuggestions, requireConfirmation: true };
  if (flags.useProfile) context.profile = { name: text(user.fullName), title: text(user.title) };
  if (flags.useCapability && preferences.context.organizationId) {
    const state = await createUserSettingsService({ client }).organizationsFor(user);
    const org = state.organizations.find(item => item.id === preferences.context.organizationId && item.status !== 'ARCHIVED');
    if (org) {
      const { data } = await databaseResult(client.from('organizations').select('name,roles,metadata').eq('id', org.id).single());
      context.organization = { name: text(data.name), roles: data.roles, capability: text(data.metadata?.capabilitySummary || data.metadata?.capability) };
    }
  }
  const kinds = [flags.useNeeds ? 'demand' : null, flags.useEvents ? 'programRegistration' : null].filter(Boolean);
  if (kinds.length) {
    let query = client.from('ccu_submissions').select('kind,data').eq('owner_id', `auth:${user.id}`).in('kind', kinds);
    if (preferences.context.organizationId) query = query.contains('data', { organizationId: preferences.context.organizationId });
    const { data } = await databaseResult(query.order('created_at', { ascending: false }).limit(12));
    if (flags.useNeeds) context.needs = data.filter(row => row.kind === 'demand').map(row => ({ title: text(row.data?.title), category: text(row.data?.category), product: text(row.data?.product || row.data?.productService) }));
    if (flags.useEvents) context.events = data.filter(row => row.kind === 'programRegistration').map(row => ({ program: text(row.data?.programTitle || row.data?.programSlug || row.data?.programId) }));
  }
  return context;
}
