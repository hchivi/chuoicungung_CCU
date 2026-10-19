import { safeMediaUrl } from '../components/programs/programWorkflowModel.js';
import { THAI_HOA_EVENT_GALLERY } from '../data/thaiHoaEventMedia.js';
import { XTTM_DIRECTORY_ITEMS } from '../data/xttmDirectoryData.js';
import { THAI_HOA_DEFAULT_LIVE_EVENT } from './thaiHoaLiveEventModel.js';

export const EVENT_PATH = '/chuong-trinh/ngay-hoi-chuoi-cung-ung-kcn-thai-hoa-2026';
export const EVENT_ID = 'biz-matching-kcn-thai-hoa-team-kcn';
export function findEventRecord(records) {
  return records.find(p => [EVENT_ID, 'PRG-2026-TEAMKCN-THAIHOA'].includes(p.id)
    || [EVENT_PATH.split('/').at(-1), EVENT_ID].includes(p.slug)
    || ['PRG-2026-TEAMKCN-THAIHOA', 'TEAMKCN-TH-2026'].includes(p.publicCode)) || {};
}
export const EVENT_FACTS = {
  title: 'Ngày hội Chuỗi Cung Ứng — Business Matching KCN Thái Hòa 2026',
  startAt: '2026-10-07T08:00:00+07:00', endAt: '2026-10-07T11:00:00+07:00', closeAt: '2026-09-29T23:59:59+07:00',
  venue: 'Văn phòng Ban Quản lý KCN Thái Hòa', address: 'Ấp Tân Hòa, xã Đức Lập III, tỉnh Tây Ninh',
  agenda: [
    { time: '08:00 – 08:30', title: 'Check-in & giao lưu' },
    { time: '08:30 – 08:45', title: 'Giới thiệu KCN Thái Hòa' },
    { time: '08:45 – 09:00', title: 'Giới thiệu Team KCN Miền Nam' },
    { time: '09:00 – 11:00', title: 'Giới thiệu doanh nghiệp & Business Matching' },
    { time: '11:00 – 13:00', title: 'Tổng kết & Tiệc trưa kết nối' },
  ],
  fees: [{ title: 'Tham dự (mỗi người)', member: 750000, nonmember: 1000000 }, { title: 'Bàn trưng bày', member: 1500000, nonmember: 2000000 }],
};
export function eventState(program = {}, now = Date.now()) {
  const start = Date.parse(program.eventStartAt || EVENT_FACTS.startAt);
  const end = Date.parse(program.eventEndAt || EVENT_FACTS.endAt);
  const close = Date.parse(program.registrationCloseAt || EVENT_FACTS.closeAt);
  const valid = [start, end, close, now].every(Number.isFinite) && end > start && close <= start;
  const override = program.statusOverride;
  const tab = override === 'POST_EVENT' ? 'after' : override === 'LIVE' ? 'during' : valid && now >= end ? 'after' : valid && now >= start ? 'during' : 'before';
  const blocked = ['CANCELLED', 'POSTPONED', 'CLOSED', 'POST_EVENT', 'LIVE'].includes(override);
  const open = valid && now <= close && now < start && !blocked;
  const label = override === 'CANCELLED' ? 'Chương trình đã hủy' : override === 'POSTPONED' ? 'Chương trình hoãn' : tab === 'after' ? 'Sau sự kiện · Chờ công bố kết quả' : tab === 'during' ? 'Đang diễn ra' : open ? 'Đang nhận đăng ký' : 'Đã hết hạn đăng ký';
  return { tab, open, label };
}
export function eventViewTab(search, hash, lifecycleTab) {
  const requested = new URLSearchParams(search).get('stage');
  if (['before', 'during', 'after'].includes(requested)) return requested;
  return ['#dang_ky', '#dang-ky-tai-tro'].includes(hash) ? 'before' : lifecycleTab;
}
const list = value => Array.isArray(value) ? value : [];
export const FEATURED_PAGE_SIZE = 8;
export function featuredParticipants(participants, role) {
  const items = participants.filter(item => item.role === role);
  const isPlatform = item => String(item.name || '').normalize('NFD').replace(/\p{M}/gu, '').trim().replace(/\s+/g, ' ').toLowerCase() === 'chuoi cung ung';
  return role === 'supplier' ? items.sort((a, b) => Number(isPlatform(b)) - Number(isPlatform(a))) : items;
}
export function featuredParticipantPage(items, page, expanded) {
  const lastPage = Math.max(0, Math.ceil(items.length / FEATURED_PAGE_SIZE) - 1);
  const current = Math.max(0, Math.min(page, lastPage));
  return { current, lastPage, shown: expanded ? items : items.slice(current * FEATURED_PAGE_SIZE, (current + 1) * FEATURED_PAGE_SIZE) };
}
const publicApproved = p => p && p.visibility === 'PUBLIC' && p.publishStatus === 'PUBLISHED';
export function publicParticipants(program = {}) {
  const seen = new Set();
  return list(program.participants || program.workflowContent?.participants).filter(p => {
    if (!publicApproved(p) || !['CONFIRMED', 'APPROVED'].includes(p.status) || !p.id || !p.name || (p.programId && p.programId !== (program.id || EVENT_ID)) || seen.has(p.id)) return false;
    seen.add(p.id); return true;
  }).map(p => ({ id: p.id, name: p.name, role: ['BUYER', 'FACTORY', 'buyer'].includes(p.role) ? 'buyer' : p.role === 'PARTNER' ? 'association' : 'supplier', logo: safeMediaUrl(p.logo), industry: String(p.industry || ''), summary: String(p.publicSummary || ''), productsServices: list(p.productsServices).filter(v => typeof v === 'string'), profilePath: typeof p.profilePath === 'string' && /^\/(nha-cung-ung|nha-may|doanh-nghiep|hiep-hoi)\/[a-zA-Z0-9_-]+$/.test(p.profilePath) ? p.profilePath : '', booth: p.isExhibitor === true ? String(p.publicBoothCode || 'Chờ xếp bàn') : '' }));
}
const defaultPackages = [
  { id: 'diamond', title: 'Kim Cương', rights: ['Logo trên backdrop & ấn phẩm', 'Phát biểu giới thiệu tại sự kiện', '1 bàn trưng bày VIP', 'Tham gia tiệc trưa cùng BTC', 'Kết nối toàn bộ doanh nghiệp', 'Truyền thông trước, sau sự kiện'] },
  { id: 'gold', title: 'Vàng', rights: ['Logo trên backdrop & ấn phẩm', '1 bàn trưng bày ưu tiên', 'Tham gia tiệc trưa cùng BTC', 'Kết nối nhà máy & nhà cung cấp', 'Truyền thông sự kiện'] },
  { id: 'silver', title: 'Bạc', rights: ['Logo trên ấn phẩm sự kiện', '1 bàn trưng bày tiêu chuẩn', 'Tham gia tiệc trưa cùng BTC', 'Kết nối doanh nghiệp tham gia'] },
];
// Event-owner requested rates (VND). Explicit Admin configuration takes precedence.
const approvedEventSponsorPrices = { diamond: 50000000, gold: 30000000, silver: 15000000 };
export function sponsorPackages(program = {}) {
  const configured = list(program.workflowContent?.sponsorshipPackages || program.sponsorshipPackages);
  return defaultPackages.map(base => {
    const p = configured.find(p => p.id === base.id || p.tier === base.id) || { amount: approvedEventSponsorPrices[base.id], feeType: 'FIXED', priceApproved: true };
    const approved = p.priceApproved === true && p.feeType === 'FIXED' && Number.isFinite(p.amount) && p.amount >= 0;
    return { ...base, title: String(p.title || base.title), price: approved ? p.amount : null, rights: p.rightsApproved === true && Array.isArray(p.rights) ? p.rights.filter(v => typeof v === 'string') : base.rights, rightsApproved: p.rightsApproved === true, priceApproved: approved, feeType: approved ? 'FIXED' : 'CONTACT', amount: approved ? p.amount : null };
  });
}
export const THAI_HOA_DEFAULT_POST_EVENT = {
  visibility: 'PUBLIC',
  publishStatus: 'PUBLISHED',
  programId: EVENT_ID,
  isHypothetical: true,
  metrics: {
    registered: 150,
    attended: 45,
    checkedIn: 42,
    buyers: 16,
    suppliers: 24,
    meetings: 68,
    needs: 52,
    nextActions: 38
  },
  matchedSuggestions: 86,
  outcomes: [
    { id: 'CONTINUE', count: 28 },
    { id: 'QUOTE', count: 15 },
    { id: 'SAMPLE', count: 10 },
    { id: 'SURVEY', count: 7 },
    { id: 'SECOND_MEETING', count: 5 },
    { id: 'NOT_FIT', count: 3 }
  ],
  demandThemes: [
    { label: 'Bao bì giấy & Thùng carton', count: 18 },
    { label: 'Hóa chất xử lý nước & công nghiệp', count: 15 },
    { label: 'Vận tải, xe nâng & Logistics KCN', count: 12 },
    { label: 'Xử lý chất thải & Dịch vụ môi trường', count: 10 },
    { label: 'Đồng phục & Thiết bị bảo hộ', count: 8 },
    { label: 'Cơ điện, HVAC & Bảo trì nhà xưởng', count: 7 }
  ],
  documents: [
    {
      id: 'doc-danh-sach-doanh-nghiep-xttm',
      title: 'Danh sách doanh nghiệp tham gia kết nối & matching KCN Thái Hòa 2026',
      url: 'https://docs.google.com/spreadsheets/d/1TwLGGOaPU2Yq7nKzDKyeq3Pm5GKX-Upw/edit?gid=370501853#gid=370501853',
      kind: 'SPREADSHEET',
      sizeBytes: null,
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID
    }
  ]
};

export function defaultThaiHoaParticipants() {
  const seen = new Set();
  const list = [];
  for (const item of XTTM_DIRECTORY_ITEMS) {
    const name = String(item.company || '').trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const role = item.org === 'THIP Members' ? 'buyer' : 'supplier';
    list.push({
      id: `thaihoa-xttm-${item.id || item.stt || name}`,
      name,
      role,
      industry: String(item.field || ''),
      summary: `Mục tiêu kết nối: ${item.groupName || ''}.`,
      productsServices: item.products ? [item.products] : [],
      logo: '',
      profilePath: '',
      status: 'CONFIRMED',
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID
    });
  }
  return list;
}

export function eventProgram(record = {}, now = Date.now()) {
  const state = eventState(record, now);
  const source = record.workflowContent || record;
  const configuredGallery = source.gallery;
  const gallery = Array.isArray(configuredGallery) && configuredGallery.length > 0
    ? configuredGallery
    : (configuredGallery === undefined ? THAI_HOA_EVENT_GALLERY : []);
  const postEvent = source.postEvent || THAI_HOA_DEFAULT_POST_EVENT;
  const liveEvent = source.liveEvent || THAI_HOA_DEFAULT_LIVE_EVENT;
  return { ...record, id: record.id || EVENT_ID, slug: EVENT_PATH.split('/').at(-1), title: EVENT_FACTS.title, date: '07/10/2026', time: '08:00 – 11:00', location: EVENT_FACTS.venue, kcn: 'KCN Thái Hòa', programStatus: state.open ? 'REGISTRATION_OPEN' : state.tab === 'after' ? 'COMPLETED' : 'REGISTRATION_CLOSED', workflowContent: { ...source, agenda: EVENT_FACTS.agenda, sponsorshipPackages: sponsorPackages(record).map(p => ({ ...p, feeType: p.price === null ? 'CONTACT' : 'FIXED', amount: p.price })), matchedPairs: list(source.matchedPairs), gallery, postEvent, liveEvent, participatingAssociations: list(source.participatingAssociations).filter(publicApproved) } };
}
export function eventStructuredData(program, origin) {
  return { '@context': 'https://schema.org', '@type': 'BusinessEvent', name: EVENT_FACTS.title, description: 'Kết nối nhu cầu nhà máy với năng lực nhà cung ứng, chuẩn bị matching và theo dõi kết quả hợp tác.', url: origin + EVENT_PATH, startDate: program.eventStartAt || EVENT_FACTS.startAt, endDate: program.eventEndAt || EVENT_FACTS.endAt, eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', location: { '@type': 'Place', name: EVENT_FACTS.venue, address: { '@type': 'PostalAddress', streetAddress: EVENT_FACTS.address, addressCountry: 'VN' } } };
}
