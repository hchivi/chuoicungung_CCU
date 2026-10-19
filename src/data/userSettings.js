export const SETTINGS_SECTIONS = [
  { id: 'account', label: 'Account', title: 'Hồ sơ cá nhân' },
  { id: 'business', label: 'Business', title: 'Doanh nghiệp & vai trò' },
  { id: 'connections', label: 'Connections', title: 'SUPPI & CHAINY' },
  { id: 'events', label: 'Events', title: 'Sự kiện & người tham dự' },
  { id: 'privacy', label: 'Privacy', title: 'Quyền riêng tư' },
  { id: 'payments', label: 'Payments', title: 'Thanh toán & hợp đồng' },
  { id: 'system', label: 'System', title: 'Thông báo & bảo mật' },
];
export const MEMBER_ROLES = ['owner', 'admin', 'buyer', 'sales', 'editor', 'finance', 'event_coordinator'];
export const NOTIFICATION_TYPES = { matching: 'Matching', requirement: 'Phản hồi nhu cầu', meeting: 'Cuộc gặp', quote: 'Báo giá', sample: 'Mẫu sản phẩm', followUp: 'Follow-up', event: 'Sự kiện', system: 'Hệ thống / bảo mật' };
export const DEFAULT_PREFERENCES = {
  context: { organizationId: null, role: null },
  suppi: { useProfile: false, useCapability: false, useNeeds: false, useEvents: false, mode: 'Balanced', buyerSuggestions: true, supplierSuggestions: true },
  chainy: { meeting: true, quote: true, sample: true, nextAction: true, overdue: true, inApp: true, email: false, zalo: false, confirmActions: true },
  privacy: { profile: 'MEMBERS', email: 'HIDDEN', phone: 'HIDDEN', zalo: 'HIDDEN', requirement: 'PRIVATE' },
  events: { allowMeetingRequests: false, showCompany: false, suppiSuggestions: false, shareContactAfterApproval: false },
  notifications: { matching: 'REALTIME', requirement: 'REALTIME', meeting: 'REALTIME', quote: 'REALTIME', sample: 'REALTIME', followUp: 'REALTIME', event: 'REALTIME', system: 'REALTIME' },
};
