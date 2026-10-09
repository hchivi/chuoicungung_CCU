// Server/CLI only. Never trust source badges as CCU verification or publication.
import { createHash } from 'node:crypto';

const present = value => typeof value === 'string' && value.trim().length > 0;
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]/g, '');
const unique = values => [...new Set(values.filter(present).map(value => value.trim()))];
const payload = row => ({ ...row, ...row.metadata, ...row.data });
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const fingerprint = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const sourceId = value => {
  try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'trangvangvietnam.com' ? url.pathname.match(/^\/listings\/(\d+)\//)?.[1] : null; } catch { return null; }
};
function validate(row) {
  if (!row || typeof row !== 'object' || !/^\d+$/.test(row.sourceId) || sourceId(row.sourceUrl) !== row.sourceId || !present(row.fetchedAt) || !Number.isFinite(Date.parse(row.fetchedAt))) throw new Error('Invalid Trang Vang source identity/date');
  for (const key of ['phones', 'emails', 'websites', 'images']) {
    if (row[key] !== undefined && (!Array.isArray(row[key]) || row[key].some(value => !present(value)))) throw new Error(`Invalid ${key}`);
  }
  if (!Array.isArray(row.categories) || row.categories.some(value => !value || !/^\d+$/.test(value.id) || !present(value.name))) throw new Error('Invalid source categories');
  for (const value of [...(row.images || []), ...(row.websites || []), ...(row.logo ? [row.logo] : [])]) {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid media/link protocol');
  }
}
function mergeSource(a, b) {
  const result = { ...a };
  for (const [key, value] of Object.entries(b)) if (present(value)) result[key] = value;
  for (const key of ['phones', 'emails', 'websites', 'images', 'imageCaptions']) result[key] = unique([...(a[key] || []), ...(b[key] || [])]);
  result.categories = [...new Map([...a.categories, ...b.categories].map(item => [item.id, item])).values()];
  return result;
}
function indexRows(rows) {
  const ids = new Map(), taxes = new Map(), names = new Map(), addresses = new Map();
  const add = (map, key, row) => { if (key) map.set(key, [...(map.get(key) || []), row]); };
  for (const row of rows) {
    const data = payload(row);
    const id = [data.sourceUrl, data.trangVangUrl, data.detailUrl, data.url, data.externalSource?.url].map(sourceId).find(Boolean);
    add(ids, id || (/^\d+$/.test(String(row.id)) ? String(row.id) : null), row);
    add(taxes, normalize(data.taxCode || data.tax_code), row);
    add(names, normalize(data.name), row);
    if (data.name && data.address) add(addresses, `${normalize(data.name)}:${normalize(data.address)}`, row);
  }
  return { ids, taxes, names, addresses };
}
export function planSupplierImport(incoming, existingRows) {
  if (!Array.isArray(incoming) || !Array.isArray(existingRows)) throw new Error('Import requires arrays');
  const grouped = new Map(), indexes = indexRows(existingRows), usedTargets = new Set();
  for (const row of incoming) { validate(row); grouped.set(row.sourceId, grouped.has(row.sourceId) ? mergeSource(grouped.get(row.sourceId), row) : row); }
  return [...grouped.values()].map(row => {
    const exact = indexes.ids.get(row.sourceId) || [];
    const tax = normalize(row.taxCode) ? indexes.taxes.get(normalize(row.taxCode)) || [] : [];
    const address = row.name && row.address ? indexes.addresses.get(`${normalize(row.name)}:${normalize(row.address)}`) || [] : [];
    const candidates = [...new Map([...exact, ...tax, ...address].map(item => [item.id, item])).values()];
    const review = reason => ({ action: 'review', sourceId: row.sourceId, reason });
    if (candidates.length > 1) return review('Multiple existing identities match');
    const before = candidates[0] || null;
    if (!before && (indexes.names.get(normalize(row.name)) || []).length) return review('Name-only match needs manual review');
    if (!before && !present(row.name)) return review('Missing supplier name');
    const old = before?.data || {};
    const oldTax = normalize(payload(before || {}).taxCode || payload(before || {}).tax_code);
    if (oldTax && row.taxCode && oldTax !== normalize(row.taxCode)) return review('Tax code conflicts with source identity');
    if (before && usedTargets.has(before.id)) return review('Another source listing already targets this CCU identity');
    if (before) usedTargets.add(before.id);
    const data = structuredClone(old);
    // Whitelist descriptive fields, never source verification, phases, owner or ACL.
    for (const key of ['name', 'address', 'businessType', 'mainMarkets', 'mainCustomers', 'establishedYear', 'employees', 'taxCode', 'logo', 'province']) if (present(row[key])) data[key] = row[key].trim();
    data.contact = { ...old.contact };
    for (const key of ['phones', 'emails', 'websites']) data.contact[key] = unique([...(old.contact?.[key] || []), ...(row[key] || [])]);
    if (present(row.description)) {
      // Source prose may repeat contacts; preserve the original only in private data.
      data.contact.sourceDescription = row.description;
      let description = row.description.trim();
      for (const value of [...(row.phones || []), ...(row.emails || [])]) description = description.split(value).join('[liên hệ được ẩn]');
      data.description = description.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email được ẩn]').replace(/(?:\+?\d[\s().-]*){9,15}/g, '[số liên hệ được ẩn]');
    }
    if (row.phones?.length) data.phone = row.phones[0];
    if (row.emails?.length) data.email = row.emails[0];
    data.sourceCategories = [...new Map([...(old.sourceCategories || []), ...row.categories].map(item => [item.id, item])).values()];
    data.keywords = unique([...(old.keywords || []), ...data.sourceCategories.map(item => item.name)]);
    data.gallery = unique([...(old.gallery || []).filter(value => typeof value === 'string'), ...(row.images || [])]);
    data.externalSource = { provider: 'trangvangvietnam', id: row.sourceId, url: row.sourceUrl, fetchedAt: row.fetchedAt };
    if (!before) Object.assign(data, { status: 'DRAFT', isPublished: false, phases: [], stages: [] });
    const after = { ...(before || {}), id: before?.id || `tv-${row.sourceId}`, name: data.name || before?.name, province: data.province || before?.province || '', data };
    return { action: before ? 'update' : 'insert', sourceId: row.sourceId, before: before ? structuredClone(before) : null, after };
  });
}
export async function applySupplierPlan(plan, io) {
  let applied = 0;
  for (const item of plan) {
    if (item.action === 'review') continue;
    if (!['update', 'insert'].includes(item.action)) throw new Error('Invalid plan action');
    const current = await io.read(item.after.id);
    if (item.before ? !current || fingerprint(current) !== fingerprint(item.before) : current) throw new Error(`Import conflict: ${item.after.id}`);
    // Implementations must fsync this backup and fail closed before the write.
    await io.backup(item);
    const saved = await io.write(item);
    if (!saved || saved.id !== item.after.id || saved.name !== item.after.name || fingerprint(saved.data) !== fingerprint(item.after.data)) throw new Error('Missing or invalid database ACK; inspect backup before retry');
    await io.receipt({ id: saved.id, action: item.action, updatedAt: saved.updated_at });
    applied++;
  }
  return { applied, review: plan.filter(item => item.action === 'review').length };
}
