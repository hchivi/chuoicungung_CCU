export const BUSINESS_ROLE_IDS = Object.freeze(['factory', 'supplier', 'kcn', 'association', 'partner', 'sponsor', 'founding_partner', 'development_partner', 'advisor', 'investor']);
export const businessRolesFromMetadata = metadata => {
  const roles = Array.isArray(metadata?.business_roles) ? metadata.business_roles : [];
  return [...new Set(roles.filter(role => BUSINESS_ROLE_IDS.includes(role)))];
};

export const ACCOUNT_ROLE_GROUPS = [
  { id: 'factory', label: 'Nhà máy / Buyer', description: 'Tìm nguồn cung và theo dõi nhu cầu mua của nhà máy.', items: [
    { title: 'Nhu cầu mua hàng', description: 'Đăng nhu cầu và nhận đề xuất từ nhà cung ứng.', to: '/dang-nhu-cau' },
    { title: 'Theo dõi nhu cầu', description: 'Quản lý nhu cầu và các trao đổi của bạn.', to: '/tai-khoan/nhu-cau' },
    { title: 'Tìm nhà cung ứng', description: 'Tra cứu đối tác theo năng lực và ngành hàng.', to: '/nha-cung-ung' },
  ] },
  { id: 'supplier', label: 'Nhà cung ứng / Supplier', description: 'Giới thiệu năng lực và tiếp cận nhu cầu phù hợp.', items: [
    { title: 'Hồ sơ nhà cung ứng', description: 'Đăng ký giới thiệu doanh nghiệp và năng lực cung ứng.', to: '/tao-ho-so' },
    { title: 'Cơ hội cung ứng', description: 'Khám phá các nhu cầu mua trên sàn B2B.', to: '/san-nhu-cau' },
    { title: 'Catalogue doanh nghiệp', description: 'Tìm hiểu các ấn phẩm và hình thức tham gia.', to: '/catalogue' },
  ] },
  { id: 'kcn', label: 'Khu công nghiệp', description: 'Kết nối doanh nghiệp trong khu và các đối tác dịch vụ.', items: [
    { title: 'Danh bạ khu công nghiệp', description: 'Tra cứu thông tin và hệ sinh thái khu công nghiệp.', to: '/khu-cong-nghiep' },
    { title: 'Mạng lưới nhà máy', description: 'Tìm các doanh nghiệp sản xuất trong hệ sinh thái.', to: '/nha-may' },
    { title: 'Phối hợp chương trình', description: 'Khám phá các hoạt động kết nối doanh nghiệp.', to: '/chuong-trinh' },
  ] },
  { id: 'association', label: 'Hiệp hội / Tổ chức', description: 'Mở rộng mạng lưới hội viên và hoạt động kết nối.', items: [
    { title: 'Mạng lưới hiệp hội', description: 'Tra cứu các hội, hiệp hội và tổ chức ngành hàng.', to: '/hiep-hoi' },
    { title: 'Chương trình kết nối', description: 'Tìm hoạt động dành cho doanh nghiệp và hội viên.', to: '/chuong-trinh' },
    { title: 'Hợp tác tổ chức', description: 'Khám phá các hình thức đồng hành cùng nền tảng.', to: '/hop-tac' },
  ] },
  { id: 'partner', label: 'Dịch vụ / Đối tác', description: 'Tham gia cung cấp dịch vụ và phát triển hợp tác.', items: [
    { title: 'Dịch vụ doanh nghiệp', description: 'Tìm hiểu các giải pháp hỗ trợ doanh nghiệp.', to: '/dich-vu' },
    { title: 'Yêu cầu của tôi', description: 'Theo dõi các yêu cầu dịch vụ đã gửi.', to: '/tai-khoan/yeu-cau-dich-vu' },
    { title: 'Đối tác phát triển', description: 'Tìm hiểu chương trình hợp tác phát triển mạng lưới.', to: '/doi-tac-phat-trien' },
  ] },
  { id: 'sponsor', label: 'Sponsor / Nhà tài trợ', items: [{ title: 'Tài trợ sự kiện', to: '/tai-tro' }] },
  { id: 'founding_partner', label: 'Founding Partner', items: [{ title: 'Đối tác sáng lập', to: '/founding-partner' }] },
  { id: 'development_partner', label: 'Development Partner', items: [{ title: 'Đối tác phát triển', to: '/doi-tac-phat-trien' }] },
  { id: 'advisor', label: 'Advisor / Cố vấn', items: [{ title: 'Hợp tác chuyên gia', to: '/hop-tac' }] },
  { id: 'investor', label: 'Investor / Nhà đầu tư', items: [{ title: 'Hệ sinh thái đầu tư', to: '/khu-cong-nghiep' }] },
];

export const normalizeBusinessRole = role => ({ SUPPLIER: 'supplier', FACTORY: 'factory', BUYER: 'factory', INDUSTRIAL_PARK: 'kcn', KCN: 'kcn', ASSOCIATION: 'association', SERVICE_PARTNER: 'partner', PARTNER: 'partner', SPONSOR: 'sponsor', FOUNDING_PARTNER: 'founding_partner', DEVELOPMENT_PARTNER: 'development_partner', ADVISOR: 'advisor', INVESTOR: 'investor' }[role] || (BUSINESS_ROLE_IDS.includes(role) ? role : null));

export function accountRoleSections(roles) {
  const selected = new Set(Array.isArray(roles) ? roles : []);
  return ACCOUNT_ROLE_GROUPS.map(group => ({ ...group, enabled: selected.has(group.id) }));
}
