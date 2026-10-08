import express from 'express';
import { requireStaff } from '../auth/service.js';
import { AssistantError } from '../assistants/difyClient.js';
import { databaseResult, DOCUMENT_COLLECTIONS, ENTITY_TABLES } from '../storage/supabaseRepository.js';

const invalid = () => new AssistantError('ADMIN_VALIDATION', 'Thông tin quản trị không hợp lệ.', 400);
const allowed = collection => {
  if (ENTITY_TABLES[collection]) return { table: ENTITY_TABLES[collection], document: false };
  if (DOCUMENT_COLLECTIONS.has(collection)) return { table: 'ccu_documents', document: true };
  throw invalid();
};
const safeRpc = async query => {
  const result = await query;
  if (result.error?.code === '40001') throw new AssistantError('EDIT_CONFLICT', 'Dữ liệu đã thay đổi. Tải lại trước khi lưu để không ghi đè thao tác của người khác.', 409);
  if (result.error?.code === '42501') throw new AssistantError('FORBIDDEN', 'Quyền quản trị đã bị thu hồi hoặc không đủ.', 403);
  if (result.error?.code === 'P0002') throw new AssistantError('NOT_FOUND', 'Không tìm thấy bản ghi.', 404);
  if (result.error?.code === '22023') throw invalid();
  return (await databaseResult(Promise.resolve(result))).data;
};
export function createAdminRouter({ client, authService, invalidate = () => {} }) {
  const router = express.Router();
  router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); }, requireStaff(authService));
  router.get('/submissions', async (req, res) => {
    const page = Math.max(1, Math.min(100000, Number.parseInt(req.query.page, 10) || 1));
    let query = client.from('ccu_submissions').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range((page - 1) * 25, page * 25 - 1);
    if (req.query.status && req.query.status !== 'ALL') query = query.eq('status', req.query.status);
    if (req.query.kind && req.query.kind !== 'ALL') query = query.eq('kind', req.query.kind);
    const { data, count } = await databaseResult(query);
    res.json({ success: true, data: data.map(({ owner_id, idempotency_key, ...row }) => row), total: count, page });
  });
  router.post('/submissions/:id/review', requireStaff(authService, ['admin', 'moderator']), async (req, res) => {
    const { status, note, expectedUpdatedAt } = req.body || {};
    if (!['APPROVED', 'REJECTED', 'NEED_MORE_INFO'].includes(status) || typeof note !== 'string' || !note.trim() || note.length > 2000 || !expectedUpdatedAt || Number.isNaN(Date.parse(expectedUpdatedAt))) throw invalid();
    const data = await safeRpc(client.rpc('ccu_review_submission', { p_id: req.params.id, p_status: status, p_note: note.trim(), p_expected_updated_at: expectedUpdatedAt, p_actor: req.authIdentity.user.id }));
    res.json({ success: true, data, message: 'Đã lưu kết quả rà soát. Chưa công bố thông tin hoặc gửi liên hệ.' });
  });
  router.get('/audit', async (req, res) => {
    const { data } = await databaseResult(client.from('ccu_admin_audit').select('id,actor_id,action,entity_type,entity_id,note,created_at').order('created_at', { ascending: false }).limit(100));
    res.json({ success: true, data });
  });
  router.get('/data/:collection', async (req, res) => {
    const collection = req.params.collection, def = allowed(collection);
    const page = Math.max(1, Math.min(100000, Number.parseInt(req.query.page, 10) || 1));
    let query = client.from(def.table).select('*', { count: 'exact' }).order('id').range((page - 1) * 25, page * 25 - 1);
    if (def.document) query = query.eq('collection', collection);
    const search = String(req.query.q || '').trim().slice(0, 100).replace(/[%_\\]/g, '');
    if (search) query = query.ilike(def.document ? 'data->>title' : 'name', `%${search}%`);
    const { data, count } = await databaseResult(query);
    res.json({ success: true, data, total: count, page });
  });
  router.patch('/data/:collection/:id', requireStaff(authService, ['admin']), async (req, res) => {
    const collection = req.params.collection; allowed(collection);
    const { patch, expectedUpdatedAt, note } = req.body || {};
    const fields = new Set(['name', 'title', 'description', 'industry', 'category', 'province', 'location', 'phase', 'phases', 'stage', 'stages']);
    if (!patch || typeof patch !== 'object' || Array.isArray(patch) || !Object.keys(patch).length || Object.keys(patch).some(key => !fields.has(key)) || JSON.stringify(patch).length > 20000 || !expectedUpdatedAt || Number.isNaN(Date.parse(expectedUpdatedAt)) || typeof note !== 'string' || !note.trim() || note.length > 2000) throw invalid();
    for (const [key, value] of Object.entries(patch)) {
      if (['phases','stages'].includes(key) ? !Array.isArray(value) || value.length > 18 || value.some(v => !['string','number'].includes(typeof v)) : !['string','number'].includes(typeof value)) throw invalid();
      if (key === 'phases' && value.some(v => !/^[1-6]\.[1-3]$/.test(String(v)))) throw invalid();
      if (key === 'stages' && value.some(v => !/^[1-6]$/.test(String(v)))) throw invalid();
      if (key === 'phase' && !/^[1-6]\.[1-3]$/.test(String(value))) throw invalid();
      if (key === 'stage' && !/^[1-6]$/.test(String(value))) throw invalid();
    }
    const data = await safeRpc(client.rpc('ccu_admin_patch_content', { p_collection: collection, p_id: req.params.id, p_patch: patch, p_note: note.trim(), p_expected_updated_at: expectedUpdatedAt, p_actor: req.authIdentity.user.id }));
    invalidate(collection);
    res.json({ success: true, data });
  });
  return router;
}
