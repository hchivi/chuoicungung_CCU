import { createHash, randomUUID } from 'node:crypto';
import { AssistantError } from '../assistants/difyClient.js';
import { databaseResult, requireDatabase } from './supabaseRepository.js';

export const SUBMISSION_KINDS = new Set(['programInterest','programNotification','programRegistration','catalogueParticipation','catalogueConnection','factoryConnection','supplierResponse','organizationClaim','organizationProposal','membershipClaim','demand','supplierRegistration','supplierQuote','serviceRequest']);
const CONTROLLED = /^(owner.*|status|.*Status|approved.*|published.*|confirmed.*|isVerified|isClaimed|userId|rolePermissions|permissions|payment.*|attendance.*|qrCode|admin.*)$/i;
export function createSubmissionStore({ client } = {}) {
  const owner = id => { if (!id) throw new AssistantError('SESSION_REQUIRED', 'Cần phiên truy cập hợp lệ.', 401); };
  return {
    async create({ kind, ownerId, data, idempotencyKey }) {
      owner(ownerId);
      if (!SUBMISSION_KINDS.has(kind) || !data || typeof data !== 'object' || Array.isArray(data) || !Object.keys(data).length || JSON.stringify(data).length > 100000) throw new AssistantError('INVALID_SUBMISSION', 'Biểu mẫu không hợp lệ.', 400);
      if (['programInterest','programNotification'].includes(kind) && data.consent === false) throw new AssistantError('CONSENT_REQUIRED', 'Cần đồng ý nhận thông tin.', 400);
      const safe = Object.fromEntries(Object.entries(data).filter(([key]) => !CONTROLLED.test(key)));
      const id = `CCU-${idempotencyKey ? createHash('sha256').update(JSON.stringify([kind, ownerId, String(idempotencyKey).slice(0, 200)])).digest('hex').slice(0, 40) : randomUUID()}`;
      requireDatabase(client);
      await databaseResult(client.from('ccu_submissions').upsert({ id, kind, owner_id: ownerId, idempotency_key: idempotencyKey || null, status: 'PENDING', data: safe }, { onConflict: 'id', ignoreDuplicates: true }));
      // Response edits are allowed only before review, scoped to the signed owner.
      if (kind === 'supplierResponse') {
        const { data: edited } = await databaseResult(client.from('ccu_submissions').update({ data: safe, updated_at: new Date().toISOString() }).eq('id', id).eq('owner_id', ownerId).eq('status', 'PENDING').select('id').maybeSingle());
        if (!edited) throw new AssistantError('SUBMISSION_REVIEWED', 'Phản hồi đã được rà soát, không thể ghi đè. Vui lòng liên hệ điều phối viên.', 409);
      }
      const { data: record } = await databaseResult(client.from('ccu_submissions').select('*').eq('id', id).eq('owner_id', ownerId).single());
      if (!record) throw new AssistantError('DATABASE_UNAVAILABLE', 'Chưa xác nhận đã lưu biểu mẫu.', 503);
      return record;
    },
    async list({ ownerId, kind } = {}) {
      owner(ownerId); requireDatabase(client);
      if (kind && !SUBMISSION_KINDS.has(kind)) throw new AssistantError('INVALID_SUBMISSION', 'Loại biểu mẫu không hợp lệ.', 400);
      let query = client.from('ccu_submissions').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false }).limit(1000);
      if (kind) query = query.eq('kind', kind);
      return (await databaseResult(query)).data;
    }
  };
}
