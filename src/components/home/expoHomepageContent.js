// Program capabilities, not attendance evidence or promised commercial outcomes.
export const EXPO_HOME_ROLES = [
  {
    id: 'buyer', label: 'Nhà máy',
    title: 'Mang nhu cầu. Gặp người cung ứng.',
    description: 'Chuẩn bị yêu cầu kỹ thuật để xem mẫu, trao đổi năng lực và thảo luận báo giá.',
    benefits: ['Trao đổi nhu cầu mua sắm', 'Xem mẫu & năng lực', 'Thảo luận báo giá'],
    action: 'Chuẩn bị tham gia',
    href: '/tim-hieu-hinh-thuc-tham-gia?role=buyer',
  },
  {
    id: 'supplier', label: 'Nhà cung cấp',
    title: 'Mang sản phẩm. Giới thiệu năng lực.',
    description: 'Chuẩn bị mẫu và catalogue để trao đổi với doanh nghiệp đang tìm nguồn.',
    benefits: ['Giới thiệu sản phẩm', 'Trao đổi yêu cầu kỹ thuật', 'Kết nối người phụ trách'],
    action: 'Chuẩn bị tham gia',
    href: '/tim-hieu-hinh-thuc-tham-gia?role=supplier',
  },
  {
    id: 'organizer', label: 'Hội / Hiệp hội / Tổ chức', shortLabel: 'Hội / Tổ chức',
    title: 'Tạo cuộc gặp cho mạng lưới.',
    description: 'Tổng hợp nhu cầu nhà máy, hội viên và phối hợp chương trình kết nối.',
    benefits: ['Tổng hợp nhu cầu', 'Mời doanh nghiệp liên quan', 'Điều phối phiên gặp gỡ'],
    action: 'Xem cách tổ chức',
    href: '/dich-vu/to-chuc-ket-noi',
  },
];

export function resolveExpoRole(id) {
  return EXPO_HOME_ROLES.find(role => role.id === id) || EXPO_HOME_ROLES[0];
}
