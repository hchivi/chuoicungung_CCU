const states = [
  ['dang-nhan-dang-ky', 'REGISTRATION_OPEN', 'Đang nhận đăng ký', 'open', 'detail', 'Chi tiết & đăng ký'],
  ['sap-mo-dang-ky', 'UPCOMING', 'Sắp mở đăng ký', 'upcoming', 'interest', 'Nhận lịch mở đăng ký'],
  ['dang-khao-sat', 'NEEDS_DISCOVERY', 'Đang khảo sát nhu cầu', 'discovery', 'interest', 'Đăng ký quan tâm'],
  ['da-dong-dang-ky', 'REGISTRATION_CLOSED', 'Đã đóng đăng ký', 'closed', 'detail', 'Xem chi tiết'],
  ['da-dien-ra', 'COMPLETED', 'Đã diễn ra', 'completed', 'recap', 'Xem kết quả'],
  ['hoan', 'POSTPONED', 'Hoãn', 'postponed', 'detail', 'Xem thông báo hoãn'],
  ['huy', 'CANCELLED', 'Đã hủy', 'cancelled', 'detail', 'Xem thông báo hủy'],
];

export function getProgramCardState(program = {}) {
  const state = states.find(([legacy, canonical]) => program.status === legacy || program.programStatus === canonical);
  if (!state) return { label: program.statusName || 'Chương trình', tone: 'closed', action: 'detail', cta: 'Xem chi tiết' };
  const [, , label, tone, action, cta] = state;
  return { label, tone, action, cta };
}
