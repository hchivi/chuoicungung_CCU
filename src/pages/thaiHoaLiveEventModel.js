export const EVENT_ID = 'biz-matching-kcn-thai-hoa-team-kcn';

const list = value => Array.isArray(value) ? value : [];
const approved = value => value?.visibility === 'PUBLIC' && value?.publishStatus === 'PUBLISHED';
const text = value => typeof value === 'string' ? value.trim() : '';
const timestamp = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? Date.parse(value) : null;
export const MEETING_STATES = [
  { id: 'UPCOMING', label: 'Sắp diễn ra' },
  { id: 'LIVE', label: 'Đang diễn ra' },
  { id: 'COMPLETED', label: 'Đã hoàn thành' },
  { id: 'RESCHEDULED', label: 'Đổi lịch' },
  { id: 'CANCELLED', label: 'Đã hủy' },
];

const isSameProgram = (itemProgramId, targetId) => {
  if (!itemProgramId || !targetId) return true;
  if (itemProgramId === targetId) return true;
  const aliases = [EVENT_ID, 'PRG-2026-TEAMKCN-THAIHOA', 'biz-matching-kcn-thai-hoa-team-kcn'];
  return aliases.includes(itemProgramId) && aliases.includes(targetId);
};

// Only public operating data belongs in the bootstrap snapshot. Personal passes
// and check-in tokens must come from an authenticated, owner-scoped endpoint.
export function liveEventSnapshot(program = {}, participants = []) {
  const source = program.workflowContent?.liveEvent;
  const programId = program.id || EVENT_ID;
  const scoped = item => approved(item) && (!item.programId || isSameProgram(item.programId, programId));
  const published = scoped(source);
  const data = published ? source : {};
  const byId = new Map(participants.map(p => [p.id, p]));
  const present = [...new Set(list(data.presentParticipantIds))].map(id => byId.get(id)).filter(Boolean);
  const metrics = Object.fromEntries(['registered', 'buyersPresent', 'suppliersPresent', 'meetingsCompleted'].map(key => [key, Number.isSafeInteger(data.metrics?.[key]) && data.metrics[key] >= 0 ? data.metrics[key] : null]));
  const seenMeetings = new Set();
  const meetings = list(data.meetings).filter(item => {
    if (!scoped(item) || !text(item.id) || seenMeetings.has(item.id) || !MEETING_STATES.some(s => s.id === item.status) || !byId.has(item.buyerId) || !byId.has(item.supplierId) || byId.get(item.buyerId).role !== 'buyer' || byId.get(item.supplierId).role !== 'supplier' || timestamp(item.startAt) === null) return false;
    seenMeetings.add(item.id);
    return true;
  }).map(item => ({ id: item.id, startAt: timestamp(item.startAt), table: text(item.table), buyer: byId.get(item.buyerId), supplier: byId.get(item.supplierId), topic: text(item.publicTopic), status: item.status })).sort((a, b) => a.startAt - b.startAt);
  const seenAnnouncements = new Set();
  const announcements = list(data.announcements).filter(item => {
    if (!scoped(item) || !text(item.id) || !text(item.text) || seenAnnouncements.has(item.id)) return false;
    seenAnnouncements.add(item.id);
    return true;
  }).map(item => ({ id: item.id, text: text(item.text), publishedAt: timestamp(item.publishedAt) })).sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  const seenSuggestions = new Set();
  const suggestions = list(data.suggestions).filter(item => {
    if (!scoped(item) || !byId.has(item.participantId) || byId.get(item.participantId).role !== 'supplier' || seenSuggestions.has(item.participantId)) return false;
    seenSuggestions.add(item.participantId);
    return true;
  }).map(item => ({ participant: byId.get(item.participantId), reason: text(item.publicReason), present: present.some(p => p.id === item.participantId) }));
  return { published, metrics, updatedAt: timestamp(data.updatedAt), present, meetings, announcements, suggestions };
}

export function agendaAt(agenda, startAt, endAt, now) {
  const start = Date.parse(startAt), end = Date.parse(endAt);
  if (![start, end, now].every(Number.isFinite) || now < start || now >= end) return -1;
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(start);
  return agenda.findIndex(item => {
    const times = item.time.match(/\d{2}:\d{2}/g) || [];
    if (!times.length) return false;
    const from = Date.parse(`${date}T${times[0]}:00+07:00`);
    const to = times[1] ? Date.parse(`${date}T${times[1]}:00+07:00`) : end;
    return now >= from && now < to;
  });
}

export const THAI_HOA_DEFAULT_LIVE_EVENT = {
  visibility: 'PUBLIC',
  publishStatus: 'PUBLISHED',
  programId: EVENT_ID,
  isHypothetical: true,
  updatedAt: '2026-10-07T11:30:00+07:00',
  metrics: {
    registered: 72,
    buyersPresent: 24,
    suppliersPresent: 44,
    meetingsCompleted: 86
  },
  presentParticipantIds: [
    'thaihoa-xttm-group-a-bm-102',
    'thaihoa-xttm-group-a-bm-104',
    'thaihoa-xttm-group-a-bm-105',
    'thaihoa-xttm-group-a-bm-111-1',
    'thaihoa-xttm-group-a-bm-114',
    'thaihoa-xttm-group-a-bm-116',
    'thaihoa-xttm-group-a-bm-301',
    'thaihoa-xttm-group-a-bm-302-1',
    'thaihoa-xttm-group-a-bm-304',
    'thaihoa-xttm-group-a-bm-307',
    'thaihoa-xttm-group-a-bm-310',
    'thaihoa-xttm-group-a-bm-312-1',
    'thaihoa-xttm-group-b-bm-101',
    'thaihoa-xttm-group-b-bm-103',
    'thaihoa-xttm-group-b-bm-107',
    'thaihoa-xttm-group-b-bm-108',
    'thaihoa-xttm-group-b-bm-110',
    'thaihoa-xttm-group-b-bm-302',
    'thaihoa-xttm-group-b-bm-303',
    'thaihoa-xttm-group-b-bm-306',
    'thaihoa-xttm-group-b-bm-315',
    'thaihoa-xttm-group-c-bm-109',
    'thaihoa-xttm-group-c-bm-113',
    'thaihoa-xttm-group-c-bm-115',
    'thaihoa-xttm-group-c-bm-301',
    'thaihoa-xttm-group-c-bm-305-3',
    'thaihoa-xttm-group-c-bm-308',
    'thaihoa-xttm-group-c-bm-316',
    'thaihoa-xttm-group-c-bm-318',
    'thaihoa-xttm-group-d-bm-106',
    'thaihoa-xttm-group-d-bm-117',
    'thaihoa-xttm-group-d-bm-303',
    'thaihoa-xttm-group-d-bm-304',
    'thaihoa-xttm-group-d-bm-305-j',
    'thaihoa-xttm-group-d-bm-309',
    'thaihoa-xttm-group-d-bm-311',
    'thaihoa-xttm-group-d-bm-313',
    'thaihoa-xttm-group-d-bm-314',
    'thaihoa-xttm-group-d-bm-317',
    'thaihoa-xttm-group-d-bm-319'
  ],
  announcements: [
    {
      id: 'th-live-ann-5',
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      publishedAt: '2026-10-07T11:00:00+07:00',
      text: 'Tổng kết phiên kết nối & trân trọng kính mời quý đại biểu tham dự Tiệc trưa giao thương tại Nhà hàng KCN Thái Hòa. Biên bản làm việc đang được tổng hợp cho báo cáo tổng quan sau sự kiện.'
    },
    {
      id: 'th-live-ann-4',
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      publishedAt: '2026-10-07T10:15:00+07:00',
      text: 'Khu vực trưng bày sản phẩm mẫu và bàn kết nối mở đã sẵn sàng đón tiếp các doanh nghiệp có nhu cầu trao đổi thêm ngoài lịch hẹn chính thức.'
    },
    {
      id: 'th-live-ann-3',
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      publishedAt: '2026-10-07T09:00:00+07:00',
      text: 'Chính thức bắt đầu phiên kết nối Business Matching 1:1. Các cặp doanh nghiệp theo lịch hẹn Suppi di chuyển về bàn tròn tương ứng tại Hội trường A & B.'
    },
    {
      id: 'th-live-ann-2',
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      publishedAt: '2026-10-07T08:30:00+07:00',
      text: 'Khai mạc chương trình Ngày hội Chuỗi Cung Ứng KCN Thái Hòa 2026 với sự tham gia của đại diện BQL KCN Thái Hòa, Team KCN Miền Nam và hơn 68 đại biểu doanh nghiệp.'
    },
    {
      id: 'th-live-ann-1',
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      publishedAt: '2026-10-07T08:00:00+07:00',
      text: 'Chào đón các đoàn đại biểu, đại diện nhà máy và nhà cung ứng check-in, nhận thẻ tham dự và tài liệu matching tại quầy lễ tân KCN Thái Hòa.'
    }
  ],
  suggestions: [
    {
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      participantId: 'thaihoa-xttm-group-a-bm-301',
      publicReason: 'Giải pháp hóa chất công nghiệp, xử lý nước lò hơi & hệ thống tuần hoàn làm mát phù hợp nhà máy hóa chất và chế biến.'
    },
    {
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      participantId: 'thaihoa-xttm-group-a-bm-304',
      publicReason: 'Dịch vụ vận tải, logistics container và thông quan cảng biển giúp tối ưu chi phí vận chuyển nguyên phụ liệu cho nhà máy KCN.'
    },
    {
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      participantId: 'thaihoa-xttm-group-a-bm-307',
      publicReason: 'Tư vấn năng lượng tái tạo, điện mặt trời mái nhà và giải pháp giảm phát thải carbon theo định hướng KCN sinh thái.'
    },
    {
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      participantId: 'thaihoa-xttm-group-a-bm-310',
      publicReason: 'Thu gom, xử lý chất thải công nghiệp nguy hại & dịch vụ bảo vệ môi trường trọn gói theo quy định pháp lý hiện hành.'
    }
  ],
  meetings: [
    {
      id: 'th-live-m-01',
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      buyerId: 'thaihoa-xttm-group-a-bm-102',
      supplierId: 'thaihoa-xttm-group-a-bm-301',
      table: 'Bàn 01',
      publicTopic: 'Hóa chất công nghiệp & xử lý nước lò hơi nhà máy',
      status: 'COMPLETED',
      startAt: '2026-10-07T09:00:00+07:00'
    },
    {
      id: 'th-live-m-02',
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      buyerId: 'thaihoa-xttm-group-a-bm-104',
      supplierId: 'thaihoa-xttm-group-a-bm-304',
      table: 'Bàn 02',
      publicTopic: 'Logistics kho bãi & vận chuyển container đường bộ',
      status: 'COMPLETED',
      startAt: '2026-10-07T09:20:00+07:00'
    },
    {
      id: 'th-live-m-03',
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      buyerId: 'thaihoa-xttm-group-a-bm-105',
      supplierId: 'thaihoa-xttm-group-a-bm-307',
      table: 'Bàn 03',
      publicTopic: 'Điện mặt trời áp mái & tối ưu chi phí điện công nghiệp',
      status: 'COMPLETED',
      startAt: '2026-10-07T09:40:00+07:00'
    },
    {
      id: 'th-live-m-04',
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      buyerId: 'thaihoa-xttm-group-a-bm-111-1',
      supplierId: 'thaihoa-xttm-group-a-bm-310',
      table: 'Bàn 04',
      publicTopic: 'Xử lý chất thải công nghiệp & nước thải định kỳ',
      status: 'COMPLETED',
      startAt: '2026-10-07T10:00:00+07:00'
    },
    {
      id: 'th-live-m-05',
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      buyerId: 'thaihoa-xttm-group-a-bm-114',
      supplierId: 'thaihoa-xttm-group-a-bm-302-1',
      table: 'Bàn 05',
      publicTopic: 'Hệ thống HVAC, lọc khí & bảo trì điều hòa nhà xưởng',
      status: 'COMPLETED',
      startAt: '2026-10-07T10:20:00+07:00'
    },
    {
      id: 'th-live-m-06',
      visibility: 'PUBLIC',
      publishStatus: 'PUBLISHED',
      programId: EVENT_ID,
      buyerId: 'thaihoa-xttm-group-a-bm-102',
      supplierId: 'thaihoa-xttm-group-a-bm-304',
      table: 'Bàn 06',
      publicTopic: 'Cước vận chuyển nội địa & gom hàng chung trong KCN',
      status: 'COMPLETED',
      startAt: '2026-10-07T10:40:00+07:00'
    }
  ]
};

