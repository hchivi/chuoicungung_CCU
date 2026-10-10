export const REGISTRATION_ROLES = [
  { id: 'buyer', canonical: 'BUYER', title: 'Nhà máy / Bên mua', description: 'Tìm nhà cung ứng phù hợp', section: 'buyerData' },
  { id: 'supplier', canonical: 'SUPPLIER', title: 'Nhà cung ứng', description: 'Chào sản phẩm, gặp bên mua', section: 'supplierData' },
  { id: 'association', canonical: 'PARTNER', title: 'Hội / Hiệp hội', description: 'Kết nối đoàn hội viên', section: 'partnerData' },
  { id: 'sponsor', canonical: 'SPONSOR', title: 'Nhà tài trợ', description: 'Đồng hành & giới thiệu năng lực', section: 'sponsorData' }
];
const list = value => Array.isArray(value) ? value : [];
export function workflowContent(program = {}) {
  const source = program.workflowContent || program;
  return { agenda: list(source.agenda), packages: list(source.sponsorshipPackages), pairs: list(source.matchedPairs), photos: list(source.gallery), associations: list(source.participatingAssociations) };
}
export function registrationState(program = {}) {
  const status = program.programStatus || program.status;
  const open = ['REGISTRATION_OPEN', 'dang-nhan-dang-ky'].includes(status);
  return { open, message: open ? 'Đang nhận hồ sơ đăng ký' : 'Chương trình chưa mở hoặc đã đóng đăng ký. Xem trạng thái ở đầu trang để biết bước tiếp theo.' };
}
export function feeLabel(option = {}) {
  if (option.feeType === 'FREE') return 'Miễn phí';
  if (option.feeType === 'FIXED' && Number.isFinite(option.amount) && option.amount >= 0) return `${option.amount.toLocaleString('vi-VN')} ${option.currency || 'VND'}`;
  return 'Chờ công bố mức phí';
}
export function meetingTarget(type, item) {
  return type === 'buyer'
    ? { role: 'supplier', name: item.buyerSummary || item.title, needId: item.id || '', product: item.title || '' }
    : { role: 'buyer', name: item.name, needId: '', product: list(item.productsServices).join(', ') };
}
export function buildRegistration(program, roleId, fields, optionId) {
  const role = REGISTRATION_ROLES.find(item => item.id === roleId);
  if (!role || !registrationState(program).open) throw new Error('Chương trình chưa nhận đăng ký cho lựa chọn này.');
  const text = key => String(fields[key] || '').trim();
  if (!text('companyName') || !text('contactPerson')) throw new Error('Vui lòng điền đơn vị và người phụ trách.');
  if (!/^\+?[\d\s().-]{8,20}$/.test(text('phone'))) throw new Error('Vui lòng kiểm tra số điện thoại liên hệ.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text('email'))) throw new Error('Vui lòng điền email hợp lệ để nhận lịch gặp.');
  if (!fields.consent) throw new Error('Cần đồng ý gửi thông tin cho ban điều phối.');
  if (roleId === 'buyer' && !text('productsNeeded')) throw new Error('Vui lòng mô tả sản phẩm cần mua.');
  if (roleId === 'supplier' && (!text('productsOffered') || !text('targetFactories'))) throw new Error('Vui lòng điền sản phẩm cung cấp và nhà máy muốn gặp.');
  if (roleId === 'association' && (!Number.isInteger(Number(fields.memberCount)) || Number(fields.memberCount) < 1)) throw new Error('Số doanh nghiệp trong đoàn phải là số nguyên từ 1 trở lên.');
  if (roleId === 'association' && !text('productsOffered')) throw new Error('Vui lòng mô tả sản phẩm / ngành hàng của đoàn.');
  if (roleId === 'sponsor' && !text('presentationTopic')) throw new Error('Vui lòng điền chủ đề giới thiệu hoặc sản phẩm của nhà tài trợ.');
  const attendeesCount = fields.attendeesCount == null ? 1 : Number(fields.attendeesCount);
  if (!Number.isInteger(attendeesCount) || attendeesCount < 1) throw new Error('Số đại biểu phải là số nguyên từ 1 trở lên.');
  const options = [...list(program.participationOptions), ...workflowContent(program).packages.map(item => ({ ...item, role: 'SPONSOR' }))];
  const option = options.find(item => item.id === optionId);
  if (optionId && (!option || ![role.canonical, 'ALL'].includes(option.role))) throw new Error('Gói tham gia không phù hợp với vai trò. Vui lòng chọn lại.');
  const common = { companyName: text('companyName'), contactPerson: text('contactPerson'), email: text('email'), phone: text('phone'), attendeesCount };
  const details = {
    buyer: { needTitle: text('productsNeeded'), needDescription: text('productsNeeded'), productsOffered: text('productsOffered'), targetSuppliers: text('targetSuppliers'), estimatedQuantity: text('estimatedVolume'), technicalStandards: text('technicalStandards') },
    supplier: { productsServices: text('productsOffered'), productsNeeded: text('productsNeeded'), meetingRequest: text('targetFactories'), capabilities: text('technicalStandards') },
    association: { associationName: text('companyName'), delegationLeader: text('contactPerson'), memberCount: Number(fields.memberCount), memberIndustry: text('productsOffered'), productsNeeded: text('productsNeeded'), targetFactories: text('targetFactories') },
    sponsor: { packageId: optionId || '', budgetProposal: text('budgetProposal'), presentationTopic: text('presentationTopic'), productsServices: text('productsOffered') }
  };
  return { programId: program.id, programPublicCode: program.publicCode || '', programTitle: program.title, role: role.canonical, ...common, participationOptionId: optionId || '', [role.section]: details[roleId], meetingPreferences: { target: roleId === 'buyer' ? text('targetSuppliers') : text('targetFactories'), needId: text('needId'), preferredTime: text('preferredTime'), presentationTime: text('presentationTime') }, consent: true };
}
export async function sendRegistration(payload, persist) {
  const receipt = await persist('programRegistration', payload);
  if (!receipt?.id || receipt.persisted !== true) throw new Error('Chưa xác nhận đã lưu đăng ký. Vui lòng thử lại.');
  return receipt;
}
export function safeMediaUrl(value) {
  if (typeof value !== 'string' || /[\s\\]/.test(value)) return '';
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? value : ''; } catch { return ''; }
}
export function publicResults(program = {}) {
  const content = workflowContent(program);
  const published = item => item && item.visibility === 'PUBLIC' && item.publishStatus === 'PUBLISHED' && (!item.programId || item.programId === program.id);
  return {
    pairs: content.pairs.filter(item => published(item) && item.buyer && item.supplier).map(item => ({ id: item.id, buyer: item.buyer, supplier: item.supplier, product: item.product, status: item.status || 'Đã kết nối', nextAction: item.publicNextAction || '', meetingTime: item.meetingTime || '', table: item.table || '' })),
    photos: content.photos.filter(item => published(item) && safeMediaUrl(item.url)).map(item => ({ id: item.id || item.url, url: safeMediaUrl(item.url), caption: item.caption || 'Hình ảnh chương trình', pairId: item.pairId || '' }))
  };
}
