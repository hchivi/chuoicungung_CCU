import { AssistantError } from '../assistants/difyClient.js';

export const ENTITY_TABLES = Object.freeze({ suppliers: 'enterprises', factories: 'factories', industrialParks: 'industrial_parks', organizations: 'organizations', associations: 'organizations' });
export const DOCUMENT_COLLECTIONS = new Set(['programs', 'catalogues', 'catalogueEditions', 'catalogueEntries', 'publicRequirements', 'productsServices', 'categories', 'categoriesAlphabetical', 'associationProfiles', 'programOrganizations', 'organizationMemberships', 'factoryProfiles', 'kcnOrganizations', 'supplyGaps']);
const HIDDEN_KEYS = /^(.*(?:email|phone|password|token|apiKey|secret).*|hotline|zalo|fax|tel|mobile|contact|legalRepresentative|author_name|contactPerson|contactName|representative.*|buyerInfo|owner.*|senderName|requesterName|receiverName|responsibleUser.*|confirmedBy|reviewedBy|evidenceNotes|internal.*|confidential.*|tax[_-]?code)$/i;
const isPrivate = record => record.publishable === false || record.isPublished === false || record.publicDisplay === false || ['PRIVATE', 'INTERNAL', 'ONLY_MATCHED', 'MATCHED_SUPPLIERS_ONLY', 'CHỈ NCC PHÙ HỢP'].includes(String(record.visibility).toUpperCase()) || ['DRAFT', 'ARCHIVED', 'REJECTED', 'PENDING'].includes(String(record.status).toUpperCase()) || ['REJECTED', 'PENDING'].includes(String(record.moderationStatus).toUpperCase());

export function publicRecord(record) {
  if (!record || typeof record !== 'object') return null;
  if (isPrivate(record)) return null;
  const clean = value => {
    if (Array.isArray(value)) return value.map(clean).filter(child => child !== null);
    if (!value || typeof value !== 'object') return value;
    if (isPrivate(value)) return null;
    if (String(value.visibility).toUpperCase() === 'PUBLIC_SUMMARY') {
      const summaryKeys = new Set(['id','slug','title','summary','category','province','visibility','status','createdAt','created_at']);
      return Object.fromEntries(Object.entries(value).filter(([key]) => summaryKeys.has(key)).map(([key, child]) => [key, clean(child)]));
    }
    return Object.fromEntries(Object.entries(value).filter(([key]) => !HIDDEN_KEYS.test(key)).map(([key, child]) => [key, clean(child)]));
  };
  return clean(record);
}

export async function databaseResult(query) {
  try {
    const result = await query;
    if (result.error) throw result.error;
    return result;
  } catch {
    throw new AssistantError('DATABASE_UNAVAILABLE', 'Chưa truy cập được Supabase. Không dùng dữ liệu cục bộ thay thế và chưa xác nhận thao tác lưu.', 503);
  }
}

export function requireDatabase(client) {
  if (!client) throw new AssistantError('DATABASE_UNAVAILABLE', 'Backend chưa cấu hình Supabase bằng secret/service-role key.', 503);
}

export function createSupabaseRepository({ client, cacheMs = 6 * 60 * 60 * 1000 } = {}) {
  const cache = new Map();
  const loading = new Map();
  const definition = collection => {
    if (ENTITY_TABLES[collection]) return { table: ENTITY_TABLES[collection], document: false };
    if (DOCUMENT_COLLECTIONS.has(collection)) return { table: 'ccu_documents', document: true };
    throw new AssistantError('INVALID_COLLECTION', 'Danh mục dữ liệu không được phép.', 400);
  };
  const fetchAll = async collection => {
    const { table, document } = definition(collection);
    requireDatabase(client);
    const records = [];
    for (let offset = 0; ; offset += 1000) {
      let query = client.from(table).select('*').order('id', { ascending: true }).range(offset, offset + 999);
      if (document) query = query.eq('collection', collection).eq('visibility', 'PUBLIC');
      const { data } = await databaseResult(query);
      if (!Array.isArray(data)) throw new AssistantError('DATABASE_UNAVAILABLE', 'Supabase chưa trả danh mục hợp lệ.', 503);
      for (const row of data) {
        if (collection === 'associations' && !row.roles?.includes('ASSOCIATION')) continue;
        const payload = document ? row.data : { ...(row.metadata || {}), ...row, ...(row.data || {}) };
        // Keep raw contacts out of every public endpoint and assistant context.
        const safe = publicRecord(payload);
        if (safe) {
          delete safe.data;
          delete safe.metadata;
          records.push(safe);
        }
      }
      if (data.length < 1000) break;
    }
    return records;
  };
  return {
    async all(collection) {
      definition(collection);
      const entry = cache.get(collection);
      if (entry && entry.expires > Date.now()) return structuredClone(entry.data);
      if (!loading.has(collection)) loading.set(collection, fetchAll(collection).then(data => {
        cache.set(collection, { data, expires: Date.now() + cacheMs });
        return data;
      }).finally(() => loading.delete(collection)));
      return structuredClone(await loading.get(collection));
    },
    async preview(collection, limit = 50) {
      const { table, document } = definition(collection);
      requireDatabase(client);
      let query = client.from(table).select('*').order('id', { ascending: true }).limit(limit);
      if (document) query = query.eq('collection', collection).eq('visibility', 'PUBLIC');
      const { data } = await databaseResult(query);
      if (!Array.isArray(data)) return [];
      const records = [];
      for (const row of data) {
        if (collection === 'associations' && !row.roles?.includes('ASSOCIATION')) continue;
        const payload = document ? row.data : { ...(row.metadata || {}), ...row, ...(row.data || {}) };
        const safe = publicRecord(payload);
        if (safe) {
          delete safe.data;
          delete safe.metadata;
          records.push(safe);
        }
      }
      return records;
    },
    async get(collection, id) {
      const records = await this.all(collection);
      return records.find(row => [row.id, row.slug, row.canonical_slug, row.factorySlug, row.code].some(value => value !== undefined && String(value) === String(id))) || null;
    },
    invalidate(collection) { cache.delete(collection); },
    async health() {
      requireDatabase(client);
      for (const table of ['enterprises', 'factories', 'industrial_parks', 'organizations', 'ccu_documents', 'ccu_submissions', 'suppi_conversations', 'requirement_drafts']) await databaseResult(client.from(table).select('id').limit(1));
      return { provider: 'supabase', connected: true };
    }
  };
}
