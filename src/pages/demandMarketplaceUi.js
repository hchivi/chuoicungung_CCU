// UI queries use public summaries only. Never accept raw buyer/private records here.
const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();

export function getDemandFilterOptions(demands) {
  const values = key => [...new Set(demands.map(demand => demand[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));
  return { categories: values('category'), provinces: values('province') };
}

function deadlineTime(value) {
  if (!value) return Infinity;
  const match = String(value).match(/^(?:Trước\s+)?(\d{1,2})\/(\d{1,2})\/(\d{4})$/i);
  if (match) {
    const [, day, month, year] = match.map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date.getTime() : Infinity;
  }
  // Parse only complete ISO dates, not ambiguous strings such as "Tháng 11".
  if (!/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(String(value))) return Infinity;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : Infinity;
}

export function formatDemandDeadline(value) {
  const time = deadlineTime(value);
  return Number.isFinite(time) ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' }).format(time) : (value || 'Chưa công bố');
}

export function formatDemandQuantity(demand) {
  if (demand.quantity === null || demand.quantity === undefined || demand.quantity === '') return 'Chưa công bố';
  return `${demand.quantity} ${demand.unit || ''}`.trim();
}

export function getDemandStatus(status) {
  if (status === 'ACTIVE_SOURCING') return { label: 'Đang tìm nguồn', canRespond: true, className: 'is-open' };
  if (status === 'PAUSED') return { label: 'Tạm dừng tiếp nhận', canRespond: false, className: 'is-paused' };
  if (status === 'CLOSED') return { label: 'Đã đóng tiếp nhận', canRespond: false, className: 'is-closed' };
  return { label: 'Chưa mở tiếp nhận', canRespond: false, className: 'is-closed' };
}

export function filterPublicDemands(demands, filters = {}) {
  const query = normalize(filters.search);
  const filtered = demands.filter(demand => {
    if (query && ![demand.title, demand.productService, demand.publicSummary, demand.publicCode, demand.category, demand.province].some(value => normalize(value).includes(query))) return false;
    if (filters.category && filters.category !== 'all' && demand.category !== filters.category) return false;
    if (filters.province && filters.province !== 'all' && demand.province !== filters.province) return false;
    if (filters.stageId && filters.stageId !== 'all' && String(demand.stageId) !== String(filters.stageId)) return false;
    if (filters.sampleRequired && !demand.sampleRequired) return false;
    if (filters.surveyRequired && !demand.surveyRequired) return false;
    if (filters.status && filters.status !== 'all' && demand.status !== (filters.status === 'open' ? 'ACTIVE_SOURCING' : filters.status)) return false;
    return true;
  });
  return filtered.sort((a, b) => {
    if (filters.sortBy === 'expiring_soon') {
      const first = deadlineTime(a.responseDeadline || a.deadline);
      const second = deadlineTime(b.responseDeadline || b.deadline);
      if (first !== second) return first - second;
    }
    return (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0);
  });
}
