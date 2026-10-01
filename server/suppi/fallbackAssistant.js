const LOCATION_RULES = [
  { terms: ['long thành', 'long thanh'], province: 'Đồng Nai', district: 'Long Thành' },
  { terms: ['đồng nai', 'dong nai'], province: 'Đồng Nai', district: null },
  { terms: ['bình dương', 'binh duong'], province: 'Bình Dương', district: null },
  { terms: ['hồ chí minh', 'ho chi minh', 'tp.hcm', 'sài gòn'], province: 'TP. Hồ Chí Minh', district: null },
  { terms: ['long an'], province: 'Long An', district: null },
  { terms: ['bắc ninh', 'bac ninh'], province: 'Bắc Ninh', district: null },
  { terms: ['đà nẵng', 'da nang'], province: 'Đà Nẵng', district: null },
  { terms: ['hà nội', 'ha noi'], province: 'Hà Nội', district: null }
];

const INTENT_RULES = [
  { terms: ['khu công nghiệp', 'kcn'], tool: 'search_industrial_parks' },
  { terms: ['nhà máy', 'xưởng sản xuất'], tool: 'search_factories' },
  { terms: ['hiệp hội', 'hội doanh nghiệp'], tool: 'search_associations' },
  { terms: ['chương trình', 'sự kiện', 'ngày hội'], tool: 'search_programs' },
  { terms: ['catalogue', 'catalog'], tool: 'search_catalogues' },
  { terms: ['nhu cầu công khai', 'đơn hàng'], tool: 'search_public_requirements' }
];

function findLocation(text) {
  const lower = text.toLowerCase();
  const rule = LOCATION_RULES.find(item => item.terms.some(term => lower.includes(term)));
  return rule ? { province: rule.province, district: rule.district, industrial_park_id: null } : null;
}

function cleanQuery(text) {
  let cleaned = text.toLowerCase()
    .replace(/^(anh|chị|tôi|mình|em)\s+(đang\s+)?(cần|muốn|tìm)\s*/i, '')
    .replace(/^(cần|muốn|tìm)\s*/i, '')
    .replace(/[.!?]+$/g, '')
    .trim();
  for (const rule of LOCATION_RULES) {
    for (const term of rule.terms) cleaned = cleaned.replace(new RegExp(`\\b${term}\\b`, 'gi'), '');
  }
  return cleaned.replace(/\b(ở|tại|giao|cho)\b/gi, ' ').replace(/\s+/g, ' ').trim();
}

export function mergeConversationSlots(existing = {}, message = '') {
  const location = findLocation(message);
  const quantityMatch = message.match(/(\d[\d.,]*)\s*(áo|bộ|cái|chiếc|thùng|kg|tấn|suất)/i);
  const looksLikeOnlyLocation = location && cleanQuery(message).length < 3;
  const query = looksLikeOnlyLocation ? existing.query : (cleanQuery(message) || existing.query);
  return {
    ...existing,
    query,
    location: location || existing.location || null,
    quantity: quantityMatch ? {
      value: Number(quantityMatch[1].replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.')),
      unit: quantityMatch[2].toLowerCase()
    } : existing.quantity || null
  };
}

function toolFor(message, slots) {
  const lower = message.toLowerCase();
  const explicit = INTENT_RULES.find(rule => rule.terms.some(term => lower.includes(term)));
  if (explicit) return explicit.tool;
  if (/sản phẩm|dịch vụ/.test(lower)) return 'search_products_services';
  return slots.query ? 'search_suppliers' : null;
}

function searchArgs(slots) {
  return {
    query: slots.query || '', category_ids: null, industries: null, categories: null,
    location: slots.location || null, quantity: slots.quantity || null,
    deadline: null, specifications: null, certifications: null,
    industrial_park_id: null, capabilities: null, target_industries: null,
    minimum_area_ha: null, maximum_occupancy_percent: null, association_type: null,
    date_from: null, date_to: null, status: null, participant_role: null,
    organization_id: null, publish_status: 'PUBLISHED', deadline_from: null, deadline_to: null,
    supplier_id: null, limit: 5, cursor: null
  };
}

export async function runFallbackTurn({ message, conversation, executeTool }) {
  const slots = mergeConversationSlots(conversation.slots, message);
  if (slots.query && !slots.location) {
    return { slots, message: `Anh/chị cần ${slots.query} giao hoặc sử dụng ở khu vực nào?`, results: [] };
  }
  const tool = toolFor(message, slots);
  if (!tool) return { slots, message: 'Anh/chị đang cần tìm sản phẩm, nhà cung ứng, nhà máy hay KCN nào?', results: [] };
  const result = await executeTool(tool, searchArgs(slots));
  if (!result.items?.length) {
    return { slots, message: 'SUPPI chưa tìm thấy kết quả phù hợp trong dữ liệu CCU với các tiêu chí hiện có. Anh/chị có muốn nới địa bàn hoặc mô tả thêm quy cách không?', results: [] };
  }
  const lines = result.items.slice(0, 5).map((item, index) => {
    const reason = item.match_signals?.[0]?.value || 'Hồ sơ có nội dung liên quan';
    return `${index + 1}. ${item.name} — ${reason}.`;
  });
  return {
    slots,
    message: `SUPPI tìm thấy ${result.total} kết quả phù hợp với tiêu chí hiện có:\n${lines.join('\n')}`,
    results: result.items
  };
}
