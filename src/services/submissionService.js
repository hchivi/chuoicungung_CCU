const privateRecords = new Map();
export function getPrivateSubmissions(kind) { return privateRecords.get(kind) || []; }
const project = record => ({ ...record.data, id: record.id, status: record.status === 'PENDING' ? 'SUBMITTED' : record.status, createdAt: record.created_at, persisted: true });
export async function loadPrivateSubmissions() {
  const response = await fetch('/api/submissions', { credentials: 'same-origin' });
  const body = await response.json();
  if (!response.ok || !body.success || body.source !== 'supabase' || !Array.isArray(body.data)) throw new Error(body.error?.message || 'Chưa tải được biểu mẫu đã lưu.');
  privateRecords.clear();
  for (const record of body.data) {
    if (!privateRecords.has(record.kind)) privateRecords.set(record.kind, []);
    privateRecords.get(record.kind).push(project(record));
  }
}
export async function persistSubmission(kind, data) {
  // Identical retries must not create duplicate registrations after a lost ACK.
  const { id, createdAt, updatedAt, ...fields } = data;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify([kind, fields])));
  const key = kind === 'supplierResponse' && id ? String(id) : Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  const response = await fetch(`/api/submissions/${kind}`, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: JSON.stringify({ data }) });
  const body = await response.json();
  if (!response.ok || !body.success || body.source !== 'supabase' || !body.data?.id || !body.data?.data || !body.data?.status) throw new Error(body.error?.message || 'Chưa lưu được dữ liệu. Vui lòng thử lại.');
  const saved = project(body.data);
  privateRecords.set(kind, [saved, ...getPrivateSubmissions(kind).filter(row => row.id !== saved.id)]);
  return saved;
}
export async function persistInquiry(domain, data) {
  const saved = await persistSubmission('serviceRequest', { ...data, domain });
  const receipt = { ...saved, publicCode: saved.id, requestPublicCode: saved.id, owner: 'Chờ điều phối viên tiếp nhận', nextAction: 'Rà soát thông tin và xác nhận phạm vi trao đổi' };
  return { ...receipt, success: true, request: receipt, inquiry: receipt, application: receipt, publicCode: saved.id };
}
