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
  {
    id: 'park_operator', label: 'Ban quản lý KCN', shortLabel: 'BQL KCN',
    title: 'Xúc tiến đầu tư. Đồng hành KCN.',
    description: 'Kết nối các doanh nghiệp trong KCN với mạng lưới nhà cung ứng và giới thiệu hạ tầng quỹ đất.',
    benefits: ['Giới thiệu quỹ đất & hạ tầng', 'Hỗ trợ nhà máy trong KCN', 'Thu hút đầu tư thứ cấp'],
    action: 'Kết nối KCN',
    href: '/khu-cong-nghiep',
  },
  {
    id: 'sponsor', label: 'Nhà tài trợ', shortLabel: 'Nhà tài trợ',
    title: 'Đồng hành thương hiệu. Mở rộng vị thế.',
    description: 'Hiện diện thương hiệu tại ngày hội B2B hàng đầu, tiếp cận trực tiếp 500+ nhà máy FDI & xưởng sản xuất.',
    benefits: ['Hiện diện thương hiệu VIP', 'Gian hàng ưu tiên tại ngày hội', 'Tiếp cận 500+ doanh nghiệp'],
    action: 'Xem gói tài trợ',
    href: '/tai-tro',
  },
];

export function resolveExpoRole(id) {
  return EXPO_HOME_ROLES.find(role => role.id === id) || EXPO_HOME_ROLES[0];
}
