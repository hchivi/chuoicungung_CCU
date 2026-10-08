import crypto from 'node:crypto';
import { AssistantError } from '../assistants/difyClient.js';
import { databaseResult, requireDatabase } from './supabaseRepository.js';

const requireOwner = owner => { if (!owner || typeof owner !== 'string') throw new AssistantError('SESSION_REQUIRED', 'Cần phiên sở hữu hợp lệ để lưu hoặc đọc dữ liệu riêng.', 401); };
const pick = (value, keys) => Object.fromEntries(keys.filter(key => value[key] !== undefined).map(key => [key, value[key]]));
const CONVERSATION_FIELDS = ['id', 'owner_id', 'previous_response_id', 'assistant_mode', 'dify_conversation_id', 'latest_results', 'slots', 'messages', 'status', 'created_at', 'updated_at'];
const DRAFT_FIELDS = ['category', 'product_service', 'quantity', 'unit', 'delivery_location', 'deadline', 'specifications', 'certifications', 'sample_required', 'notes'];

export function createSupabaseConversationStore({ client } = {}) {
  return {
    async create(initial = {}) {
      requireDatabase(client); requireOwner(initial.owner_id);
      const now = new Date().toISOString();
      const conversation = { id: `SUPPI-CONV-${crypto.randomUUID()}`, previous_response_id: null, assistant_mode: 'SUPPI', dify_conversation_id: null, latest_results: [], slots: {}, messages: [], status: 'ACTIVE', ...pick(initial, CONVERSATION_FIELDS.filter(key => !['id', 'created_at', 'updated_at'].includes(key))), created_at: now, updated_at: now };
      const { data } = await databaseResult(client.from('suppi_conversations').insert(conversation).select('*').single());
      return data;
    },
    async get(id) {
      requireDatabase(client);
      const { data } = await databaseResult(client.from('suppi_conversations').select('*').eq('id', id).maybeSingle());
      return data;
    },
    async save(conversation) {
      requireDatabase(client); requireOwner(conversation.owner_id);
      const { data } = await databaseResult(client.from('suppi_conversations').update({ ...pick(conversation, CONVERSATION_FIELDS.filter(key => !['id', 'owner_id', 'created_at'].includes(key))), updated_at: new Date().toISOString() }).eq('id', conversation.id).eq('owner_id', conversation.owner_id).select('*').maybeSingle());
      if (!data) throw new AssistantError('CONVERSATION_NOT_FOUND', 'Không tìm thấy cuộc trao đổi trong phiên này.', 404);
      return data;
    }
  };
}

export function createSupabaseDraftStore({ client } = {}) {
  return {
    async create(input) {
      requireDatabase(client); requireOwner(input.owner_id);
      if (!input.conversation_id || !input.category || !input.product_service) throw new AssistantError('VALIDATION_ERROR', 'Bản nháp thiếu thông tin bắt buộc.', 400);
      const now = new Date().toISOString();
      // A deterministic primary key makes duplicate concurrent requests safe too.
      const suffix = input.idempotency_key ? crypto.createHash('sha256').update(JSON.stringify([input.owner_id, input.conversation_id, input.idempotency_key])).digest('hex') : crypto.randomUUID();
      const draft = { ...pick(input, DRAFT_FIELDS), id: `REQ-DRAFT-${suffix}`, conversation_id: input.conversation_id, owner_id: input.owner_id, idempotency_key: input.idempotency_key || null, status: 'DRAFT', submitted_at: null, published_at: null, created_at: now, updated_at: now };
      await databaseResult(client.from('requirement_drafts').upsert(draft, { onConflict: 'id', ignoreDuplicates: true }));
      return this.get(draft.id, { owner_id: input.owner_id });
    },
    async get(id, { owner_id } = {}) {
      requireDatabase(client); requireOwner(owner_id);
      const { data } = await databaseResult(client.from('requirement_drafts').select('*').eq('id', id).eq('owner_id', owner_id).maybeSingle());
      return data;
    },
    async update(id, patch, { owner_id } = {}) {
      requireDatabase(client); requireOwner(owner_id);
      const { data } = await databaseResult(client.from('requirement_drafts').update({ ...pick(patch, DRAFT_FIELDS), updated_at: new Date().toISOString() }).eq('id', id).eq('owner_id', owner_id).eq('status', 'DRAFT').select('*').maybeSingle());
      return data;
    }
  };
}
