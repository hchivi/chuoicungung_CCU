// Presentation and client validation only. The existing form engine owns persistence.
export const SERVICE_PRESENTATION = {
  TO_CHUC_KET_NOI: {
    title: 'Kết nối doanh nghiệp',
    description: 'Phiên gặp gỡ B2B, tìm nguồn và kết nối theo nhu cầu.',
    guidance: 'Đối tượng muốn kết nối, ngành hàng, quy mô và nguồn lực sẵn có.',
  },
  VAT_PHAM_SU_KIEN: {
    title: 'Vật phẩm & quà tặng',
    description: 'Đồng phục, bộ vật phẩm và quà tặng doanh nghiệp.',
    guidance: 'Loại vật phẩm, số lượng, chất liệu, nhận diện và địa điểm giao.',
  },
  TRUYEN_THONG_DOANH_NGHIEP: {
    title: 'Hồ sơ & truyền thông',
    description: 'Hồ sơ năng lực, hình ảnh, video và catalogue.',
    guidance: 'Năng lực cần giới thiệu, tài liệu hiện có và thời hạn bàn giao.',
  },
  HIEN_DIEN_TU_XA: {
    title: 'Hiện diện từ xa',
    description: 'Giới thiệu năng lực tại chương trình khi chưa thể tham dự.',
    guidance: 'Chương trình quan tâm, tài liệu giới thiệu và đầu mối phản hồi.',
  },
  TAI_TRO: {
    title: 'Tài trợ & đồng hành',
    description: 'Trao đổi phạm vi và quyền lợi đồng hành chương trình.',
    guidance: 'Chương trình quan tâm, hình thức đóng góp và ngân sách dự kiến.',
  },
};

export function getServiceRequestErrors(data) {
  const errors = {};
  if (!data.companyName?.trim()) errors.companyName = 'Vui lòng nhập tên doanh nghiệp hoặc tổ chức.';
  if (!data.customerName?.trim()) errors.customerName = 'Vui lòng nhập tên người liên hệ.';
  if (!data.phone?.trim() && !data.email?.trim()) {
    errors.phone = 'Cung cấp số điện thoại hoặc email để CCU liên hệ.';
    errors.email = 'Cung cấp email hoặc số điện thoại để CCU liên hệ.';
  } else if (data.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Vui lòng kiểm tra lại địa chỉ email.';
  }
  if (!data.description?.trim()) errors.description = 'Mô tả ngắn công việc doanh nghiệp cần triển khai.';
  return errors;
}

const DETAIL_FIELDS = {
  TO_CHUC_KET_NOI: ['matchmaking', [
    ['formatType', 'Hình thức triển khai'], ['scale', 'Quy mô'],
    ['targetAudience', 'Đối tượng kết nối'], ['existingResources', 'Nguồn lực hiện có'],
    ['ccuSupportNeeded', 'Phần việc CCU hỗ trợ'],
  ]],
  VAT_PHAM_SU_KIEN: ['merchandise', [
    ['productTypes', 'Vật phẩm'], ['quantities', 'Số lượng'], ['sizeChart', 'Bảng kích cỡ'],
    ['specifications', 'Chất liệu & quy cách'], ['printRequirements', 'In / thêu'],
    ['deliveryLocation', 'Địa điểm giao'],
  ]],
  TRUYEN_THONG_DOANH_NGHIEP: ['media', [
    ['targetProducts', 'Năng lực cần giới thiệu'], ['shootingLocation', 'Địa điểm quay chụp'],
    ['existingDocs', 'Tài liệu hiện có'], ['contentApprover', 'Người duyệt nội dung'],
    ['deadline', 'Thời hạn bàn giao'],
  ]],
  HIEN_DIEN_TU_XA: ['remotePresence', [
    ['targetProgramId', 'Chương trình'], ['physicalSampleTypes', 'Mẫu sản phẩm'],
    ['buyerContactPerson', 'Người phản hồi'], ['videoCatalogueLink', 'Video / catalogue'],
  ]],
  TAI_TRO: ['sponsorship', [
    ['sponsoredProgramId', 'Chương trình quan tâm'], ['contributionType', 'Hình thức đóng góp'],
    ['sponsorshipBudget', 'Ngân sách dự kiến'],
  ]],
};

export function getServiceRequestDetails(data, { formats = [], programs = [] } = {}) {
  const definition = DETAIL_FIELDS[data.serviceType];
  if (!definition) return [];
  const [branch, fields] = definition;
  return fields.map(([key, label]) => {
    let value = data[branch]?.[key];
    if (key === 'formatType') value = formats.find(item => item.id === value)?.name || value;
    if (key === 'targetProgramId') {
      const program = programs.find(item => item.id === value);
      value = program?.title || program?.name || value;
    }
    if (Array.isArray(value)) value = value.join(', ');
    return [label, typeof value === 'string' && value.trim() ? value : 'Chưa bổ sung'];
  });
}
