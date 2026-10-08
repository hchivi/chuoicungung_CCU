import express from 'express';
import { getSupabase, isSupabaseConfigured } from '../supabase.js';
import { createSupabaseRepository, databaseResult, requireDatabase, DOCUMENT_COLLECTIONS, ENTITY_TABLES, publicRecord } from '../storage/supabaseRepository.js';
import { AssistantError } from '../assistants/difyClient.js';

export const normalizeSearch = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
const selected = value => value && !['all', 'Tất cả', 'Toàn quốc'].includes(value);
const contains = (value, query) => normalizeSearch(value).includes(normalizeSearch(query));
const values = value => Array.isArray(value) ? value : value == null ? [] : [value];

export function filterDirectory(records, query = {}) {
  return records.filter(row => {
    if (selected(query.q) && !contains([row.name, row.title, row.industry, row.category, ...values(row.products), row.description, row.address, row.location, row.kcnName, row.type].join(' '), query.q)) return false;
    if (selected(query.stage) && !values(row.stages ?? row.stage).some(value => String(value) === String(query.stage))) return false;
    if (selected(query.phase) && !values(row.phases ?? row.phase).includes(query.phase)) return false;
    for (const key of ['province', 'region', 'type', 'industry']) if (selected(query[key]) && !contains(row[key], query[key])) return false;
    if (selected(query.category) && ![row.category, row.industry].some(value => value && contains(value, query.category))) return false;
    if (selected(query.kcnId) && String(row.kcnId) !== String(query.kcnId)) return false;
    if (selected(query.kcn) && !contains(row.kcnName, query.kcn)) return false;
    if (selected(query.letter) && !normalizeSearch(row.name).startsWith(normalizeSearch(query.letter))) return false;
    return true;
  });
}

export function paginated(records, query = {}) {
  const pageSize = Math.min(1000, Math.max(1, Number.parseInt(query.limit, 10) || 24));
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const currentPage = Math.min(totalPages, Math.max(1, Number.parseInt(query.page, 10) || 1));
  const data = records.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return { success: true, source: 'supabase', total: records.length, count: data.length, totalPages, currentPage, pageSize, data };
}

export function createApiRouter({ repository = createSupabaseRepository({ client: getSupabase() }), client = getSupabase() } = {}) {
  const router = express.Router();
  router.get('/status', async (_req, res) => {
    let connected = false;
    try { await repository.health(); connected = true; } catch { /* Liveness remains online; readiness is separate. */ }
    res.json({ status: 'online', database: { provider: 'supabase', connected }, supabase: { configured: isSupabaseConfigured(), connected }, timestamp: new Date().toISOString() });
  });
  for (const [route, collection] of Object.entries({ enterprises: 'suppliers', factories: 'factories', 'industrial-parks': 'industrialParks' })) {
    router.get(`/${route}`, async (req, res) => res.json(paginated(filterDirectory(await repository.all(collection), req.query), req.query)));
    router.get(`/${route}/:id`, async (req, res) => {
      const data = await repository.get(collection, req.params.id);
      if (!data) throw new AssistantError('ENTITY_NOT_FOUND', 'Không tìm thấy hồ sơ được xuất bản.', 404);
      res.json({ success: true, source: 'supabase', data });
    });
  }
  router.get('/categories', async (_req, res) => { const data = await repository.all('categories'); res.json({ success: true, source: 'supabase', count: data.length, data }); });
  router.get('/categories/alphabetical', async (_req, res) => {
    const rows = await repository.all('categoriesAlphabetical');
    res.json({ success: true, source: 'supabase', data: Object.fromEntries(rows.map(row => [row.id, row.items])) });
  });
  router.get('/data/:collection', async (req, res) => {
    const { collection } = req.params;
    if (!DOCUMENT_COLLECTIONS.has(collection) && !ENTITY_TABLES[collection]) throw new AssistantError('INVALID_COLLECTION', 'Danh mục không được phép.', 400);
    res.json(paginated(filterDirectory(await repository.all(collection), req.query), req.query));
  });
  router.get('/demands', async (_req, res) => {
    requireDatabase(client);
    const { data } = await databaseResult(client.from('demands').select('id,title,stage_id,phase_id,category,location,budget,deadline,requirements,status,responses_count,created_at').eq('status', 'approved').order('created_at', { ascending: false }).limit(1000));
    res.json({ success: true, source: 'supabase', data: data.map(publicRecord).filter(Boolean), count: data.length });
  });
  router.post('/demands', async (req, res) => {
    const body = req.body || {};
    const mandatory = ['title', 'category', 'requirements', 'authorName', 'authorEmail', 'authorPhone', 'location'];
    if (mandatory.some(key => typeof body[key] !== 'string' || !body[key].trim() || body[key].length > 10000)) throw new AssistantError('VALIDATION_ERROR', 'Vui lòng cung cấp đầy đủ thông tin bắt buộc.', 400);
    requireDatabase(client);
    const payload = { title: body.title.trim(), stage_id: Number(body.stageId) || 1, phase_id: String(body.phaseId || '1.1'), category: body.category, author_name: body.authorName, author_company: String(body.authorCompany || ''), author_email: body.authorEmail, author_phone: body.authorPhone, location: body.location, budget: String(body.budget || ''), deadline: String(body.deadline || ''), requirements: body.requirements, status: 'pending' };
    const { data } = await databaseResult(client.from('demands').insert(payload).select('id,status,created_at').single());
    res.status(201).json({ success: true, source: 'supabase', data, message: 'Nhu cầu đã lưu trên Supabase và đang chờ duyệt.' });
  });
  return router;
}
export default createApiRouter();
