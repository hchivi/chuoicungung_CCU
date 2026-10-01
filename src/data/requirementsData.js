// ============================================================================
// MASTER REQUIREMENTS & PUBLIC B2B DEMANDS SERVICE
// PAGE 11: SÀN NHU CẦU (/san-nhu-cau)
// Chuẩn hóa theo spec 11.txt - CHUOICUNGUNG.COM
// ============================================================================

// Storage keys
const STORAGE_KEYS = {
  MASTER_REQUIREMENTS: 'ccu_master_requirements_v2',
  SUPPLIER_RESPONSES: 'ccu_supplier_requirement_responses',
  AUDIT_LOGS: 'ccu_requirement_audit_logs',
  SUPPLIER_MATCHES: 'ccu_supplier_matches',
  USER_SESSION: 'ccu_user_session'
};

// ----------------------------------------------------------------------------
// 1. SEED REQUIREMENTS (Dữ liệu gốc chuẩn hóa B2B)
// ----------------------------------------------------------------------------
export const SEED_REQUIREMENTS = [
  {
    id: 'NC-2026-00125',
    publicCode: 'NC-2026-00125',
    title: 'Cần tìm nhà máy may 500 bộ đồng phục công nhân & kỹ sư xưởng',
    category: 'May mặc & Bảo hộ lao động',
    categorySlug: 'may-mac-dong-phuc',
    keyword: 'Đồng phục công nhân may kỹ',
    keywordSlug: 'dong-phuc-cong-nhan-may-ky',
    stageId: 5,
    stageName: 'Giai đoạn 5 - Nhân sự & Hậu cần',
    productService: 'Đồng phục công nhân kaki & áo thun polo',
    quantity: '500',
    unit: 'bộ',
    allowPublicQuantity: true,
    province: 'Đồng Nai',
    location: 'Đồng Nai',
    industrialPark: 'KCN Amata, TP. Biên Hòa',
    allowPublicIndustrialPark: true,
    deadline: 'Trước 15/11/2026',
    sampleRequired: true,
    surveyRequired: false,
    publicSummary: 'Nhà máy sản xuất linh kiện điện tử tại KCN Amata cần tìm nguồn cung cấp 500 bộ đồng phục công nhân (vải Kaki 65/35 may 2 kim bền chắc) và áo thun polo văn phòng.',
    publicRequirements: [
      'Chất liệu Kaki 65/35 chống nhăn, thoáng mát, độ bền cơ học cao',
      'Đầy đủ bảng size từ S đến 3XL',
      'Yêu cầu gửi mẫu vải và mẫu may đối chứng trước khi ký hợp đồng'
    ],
    status: 'ACTIVE_SOURCING', // ACTIVE_SOURCING | CLOSED | PAUSED
    visibility: 'PUBLIC_SUMMARY', // PUBLIC_SUMMARY | ONLY_MATCHED | PRIVATE
    moderationStatus: 'APPROVED', // APPROVED | PENDING | REJECTED
    publishedAt: '2026-09-25T08:30:00Z',
    publishedBy: 'Coordinator CCU Admin',
    responseDeadline: '2026-11-10T17:00:00Z',
    // Private Buyer Data (Strictly sanitized, NEVER exposed to public API)
    buyerInfo: {
      companyName: 'Công ty TNHH Điện Tử Precision Tech Đồng Nai',
      allowPublicCompanyName: false,
      buyerSummary: 'Nhà máy sản xuất điện tử FDI tại KCN Amata (Đồng Nai)',
      contactPerson: 'Nguyễn Văn Nam - Trưởng phòng Mua hàng',
      phone: '0903 888 999',
      email: 'procurement@precisiontech.vn',
      internalBudget: '120.000.000 - 150.000.000 VNĐ',
      targetPrice: '250.000 VNĐ / bộ',
      internalNotes: 'Ưu tiên đơn vị có chứng nhận OEKO-TEX và có xưởng trực tiếp tại Đồng Nai hoặc Bình Dương.',
      confidentialAttachments: ['Bang_du_toan_noi_bo.xlsx', 'Yeu_cau_ky_thuat_mat_2026.pdf']
    }
  },
  {
    id: 'NC-2026-00128',
    publicCode: 'NC-2026-00128',
    title: 'Tìm đơn vị gia công 10.000 chi tiết tiện phay CNC nhôm anode',
    category: 'Cơ khí & Chế tạo',
    categorySlug: 'co-khi-che-tao-khuon-mau',
    keyword: 'Gia công CNC nhôm anode',
    keywordSlug: 'gia-cong-cnc-nhom-anode',
    stageId: 4,
    stageName: 'Giai đoạn 4 - Vận hành Sản xuất',
    productService: 'Chi tiết gá kẹp jig nhôm 6061 phay CNC',
    quantity: '10.000',
    unit: 'chi tiết / đợt',
    allowPublicQuantity: true,
    province: 'Bình Dương',
    location: 'Bình Dương',
    industrialPark: 'KCN VSIP 1',
    allowPublicIndustrialPark: true,
    deadline: 'Trước 30/10/2026',
    sampleRequired: true,
    surveyRequired: true,
    publicSummary: 'Doanh nghiệp FDI ngành robot tự động hóa tại KCN VSIP 1 tìm đối tác gia công chính xác chi tiết nhôm A6061-T6, dung sai ±0.01mm, bề mặt xử lý Anode hóa cứng.',
    publicRequirements: [
      'Máy phay CNC 4 trục hoặc 5 trục độ chính xác cao',
      'Có máy đo CMM 3D kiểm tra dung sai và cung cấp báo cáo FAI',
      'Khảo sát năng lực xưởng trước khi giao đơn chính thức'
    ],
    status: 'ACTIVE_SOURCING',
    visibility: 'PUBLIC_SUMMARY',
    moderationStatus: 'APPROVED',
    publishedAt: '2026-09-26T09:15:00Z',
    publishedBy: 'Coordinator CCU Admin',
    responseDeadline: '2026-10-25T17:00:00Z',
    buyerInfo: {
      companyName: 'Tập đoàn Chế tạo Tự động Hóa Mecatech Global',
      allowPublicCompanyName: false,
      buyerSummary: 'Doanh nghiệp FDI tự động hóa công nghiệp tại Bình Dương',
      contactPerson: 'Trần Minh Đức - Quản lý Kỹ thuật & Mua hàng',
      phone: '0912 345 678',
      email: 'duc.tran@mecatech.com',
      internalBudget: '650.000.000 VNĐ',
      targetPrice: '60.000 VNĐ / chi tiết',
      internalNotes: 'Khách hàng Nhật rất khắt khe về vết trầy xước bề mặt sau anode.',
      confidentialAttachments: ['Ban_ve_jig_mat_A09.dwg']
    }
  },
  {
    id: 'NC-2026-00132',
    publicCode: 'NC-2026-00132',
    title: 'Cung cấp 20.000 thùng carton 5 lớp sóng BC in flexo định kỳ',
    category: 'Bao bì & Đóng gói',
    categorySlug: 'bao-bi-dong-goi',
    keyword: 'Thùng carton 5 lớp xuất khẩu',
    keywordSlug: 'thung-carton-5-lop-xuat-khau',
    stageId: 4,
    stageName: 'Giai đoạn 4 - Vận hành Sản xuất',
    productService: 'Thùng carton 5 lớp sóng BC kích thước 60x40x40cm',
    quantity: '20.000',
    unit: 'thùng / tháng',
    allowPublicQuantity: true,
    province: 'Long An',
    location: 'Long An',
    industrialPark: 'KCN Long Hậu',
    allowPublicIndustrialPark: true,
    deadline: 'Trước 05/11/2026',
    sampleRequired: true,
    surveyRequired: false,
    publicSummary: 'Nhà máy chế biến thực phẩm đóng gói xuất khẩu tại Long An cần nhà cung cấp thùng carton 5 lớp chịu bục tốt, in flexo 2 màu logo thương hiệu, giao định kỳ hàng tuần.',
    publicRequirements: [
      'Chỉ số chịu bục mullen tối thiểu 14 kg/cm2',
      'Giấy mặt Kraft nhập ngoại hoặc Việt Trì chất lượng cao',
      'Cam kết giao hàng đúng tiến độ theo lịch gọi hàng 3 ngày/lần'
    ],
    status: 'ACTIVE_SOURCING',
    visibility: 'PUBLIC_SUMMARY',
    moderationStatus: 'APPROVED',
    publishedAt: '2026-09-27T07:45:00Z',
    publishedBy: 'Coordinator CCU Admin',
    responseDeadline: '2026-11-01T17:00:00Z',
    buyerInfo: {
      companyName: 'Công ty CP Thực Phẩm Xanh Mekong',
      allowPublicCompanyName: false,
      buyerSummary: 'Nhà máy chế biến thực phẩm xuất khẩu tại KCN Long Hậu (Long An)',
      contactPerson: 'Lê Thu Trang - Thu mua Bao bì',
      phone: '0938 111 222',
      email: 'trang.le@mekongfoods.vn',
      internalBudget: '350.000.000 VNĐ / tháng',
      targetPrice: '16.500 VNĐ / thùng',
      internalNotes: 'Nhà máy kiểm tra độ ẩm thùng dưới 12% khi nhập kho.',
      confidentialAttachments: ['Tieu_chuan_bao_bi_thuc_pham.pdf']
    }
  },
  {
    id: 'NC-2026-00135',
    publicCode: 'NC-2026-00135',
    title: 'Khảo sát và lắp đặt hệ thống lọc bụi túi vải nhà xưởng 3.000m²',
    category: 'Môi trường & Xử lý khí thải',
    categorySlug: 'he-thong-loc-bui-khi-thai',
    keyword: 'Hệ thống lọc bụi túi vải xưởng gỗ',
    keywordSlug: 'loc-bui-tui-vai-xuong-go',
    stageId: 3,
    stageName: 'Giai đoạn 3 - Lắp đặt & Hoàn thiện',
    productService: 'Hệ thống hút lọc bụi cyclone kết hợp lọc túi vải',
    quantity: '1',
    unit: 'hệ thống trọn gói',
    allowPublicQuantity: true,
    province: 'Bình Phước',
    location: 'Bình Phước',
    industrialPark: 'KCN Minh Hưng',
    allowPublicIndustrialPark: true,
    deadline: 'Trước 20/11/2026',
    sampleRequired: false,
    surveyRequired: true,
    publicSummary: 'Nhà máy sản xuất đồ gỗ nội thất tại Bình Phước cần tìm nhà thầu M&E môi trường khảo sát hiện trạng, thiết kế và thi công hệ thống hút bụi trung tâm công suất 45.000 m³/h.',
    publicRequirements: [
      'Năng lực thi công PCCC và chứng chỉ hành nghề môi trường hợp lệ',
      'Bắt buộc khảo sát đo đạc thực tế mặt bằng nhà xưởng trước khi lên dự toán',
      'Bảo hành hệ thống tối thiểu 24 tháng'
    ],
    status: 'ACTIVE_SOURCING',
    visibility: 'PUBLIC_SUMMARY',
    moderationStatus: 'APPROVED',
    publishedAt: '2026-09-27T14:20:00Z',
    publishedBy: 'Coordinator CCU Admin',
    responseDeadline: '2026-11-15T17:00:00Z',
    buyerInfo: {
      companyName: 'Công ty TNHH Gỗ Tân Uyên Phát',
      allowPublicCompanyName: false,
      buyerSummary: 'Nhà máy chế biến đồ gỗ xuất khẩu tại Bình Phước',
      contactPerson: 'Hoàng Quốc Việt - Giám đốc kỹ thuật',
      phone: '0977 654 321',
      email: 'viet.hq@tanuyenwood.vn',
      internalBudget: '1.200.000.000 VNĐ',
      targetPrice: '1.100.000.000 VNĐ',
      internalNotes: 'Cần hỗ trợ hồ sơ nghiệm thu môi trường cấp phép KCN.',
      confidentialAttachments: ['So_do_mat_bang_nha_xuong_A.dwg']
    }
  },
  {
    id: 'NC-2026-00140',
    publicCode: 'NC-2026-00140',
    title: 'Cần 300 suất quà tết hộp cứng cao cấp cho công nhân viên nhà máy',
    category: 'Quà tặng & Phúc lợi doanh nghiệp',
    categorySlug: 'qua-tang-phuc-loi',
    keyword: 'Hộp quà tết công nhân viên',
    keywordSlug: 'hop-qua-tet-doanh-nghiep',
    stageId: 5,
    stageName: 'Giai đoạn 5 - Nhân sự & Hậu cần',
    productService: 'Hộp quà tết thiết yếu trà cà phê bánh mứt',
    quantity: '300',
    unit: 'suất',
    allowPublicQuantity: true,
    province: 'TP. Hồ Chí Minh',
    location: 'TP. Hồ Chí Minh',
    industrialPark: 'KCX Tân Thuận, Quận 7',
    allowPublicIndustrialPark: true,
    deadline: 'Trước 15/12/2026',
    sampleRequired: true,
    surveyRequired: false,
    publicSummary: 'Công đoàn nhà máy may xuất khẩu tại KCX Tân Thuận tìm đơn vị cung cấp 300 suất quà tết đầy đủ xuất xứ, bao bì hộp cứng in thông điệp công ty, giao trước Tết 3 tuần.',
    publicRequirements: [
      'Hàng hóa có thương hiệu uy tín, hạn sử dụng tối thiểu 12 tháng',
      'Có mẫu hộp quà thực tế để ban công đoàn đánh giá trực tiếp',
      'Hóa đơn VAT và chứng từ kiểm định an toàn vệ sinh thực phẩm'
    ],
    status: 'ACTIVE_SOURCING',
    visibility: 'PUBLIC_SUMMARY',
    moderationStatus: 'APPROVED',
    publishedAt: '2026-09-28T08:10:00Z',
    publishedBy: 'Coordinator CCU Admin',
    responseDeadline: '2026-12-05T17:00:00Z',
    buyerInfo: {
      companyName: 'Công ty TNHH May Mặc Tân Thuận Export',
      allowPublicCompanyName: false,
      buyerSummary: 'Doanh nghiệp FDI may mặc tại KCX Tân Thuận (TP. HCM)',
      contactPerson: 'Võ Thị Hồng - Chủ tịch Công đoàn',
      phone: '0988 234 567',
      email: 'congdoan@tanthuan-export.vn',
      internalBudget: '150.000.000 VNĐ',
      targetPrice: '450.000 VNĐ / suất',
      internalNotes: 'Công nhân thích các sản phẩm thiết yếu như dầu ăn, bánh mứt, hạt dưa.',
      confidentialAttachments: ['Danh_sach_phan_bo_qua.xlsx']
    }
  },

  // --------------------------------------------------------------------------
  // CÁC NHU CẦU CÔNG KHAI CỦA NHÀ MÁY (PAGE 28 & 29 SPEC INTEGRATION)
  // --------------------------------------------------------------------------
  {
    id: 'NC-2026-FAC-PROSER-01',
    publicCode: 'NC-2026-FAC-PROSER-01',
    title: 'Tìm nguồn cung cấp 10.000m vải kaki 65/35 chống xù lông & chỉ may công nghiệp 40/2',
    category: 'Nguyên phụ liệu may mặc',
    categorySlug: 'nguyen-phu-lieu-may-mac',
    keyword: 'Vải kaki 65/35 may bảo hộ',
    keywordSlug: 'vai-kaki-65-35',
    stageId: 4,
    stageName: 'Giai đoạn 4 - Vận hành Sản xuất',
    productService: 'Vải kaki 65/35 mật độ sợi dày, chỉ may 40/2 bền cao',
    quantity: '10.000',
    unit: 'mét',
    allowPublicQuantity: true,
    province: 'TP. Hồ Chí Minh',
    location: 'TP. Hồ Chí Minh',
    industrialPark: 'KCN Hiệp Phước',
    allowPublicIndustrialPark: true,
    deadline: 'Trước 20/11/2026',
    sampleRequired: true,
    surveyRequired: false,
    publicSummary: 'Nhà máy Chuyên Gia Đồng Phục Proser tại KCN Hiệp Phước cần tìm nhà dệt cung cấp định kỳ 10.000m vải kaki 65/35 chống xù, cầm màu tốt phục vụ các đơn hàng đồ bảo hộ lao động.',
    publicRequirements: [
      'Độ bền màu giặt cấp 4 trở lên, tỷ lệ co giãn dưới 2%',
      'Cung cấp mẫu test swatch vải đạt chuẩn an toàn dệt may OEKO-TEX',
      'Giao hàng tại xưởng Proser KCN Hiệp Phước'
    ],
    status: 'ACTIVE_SOURCING',
    visibility: 'PUBLIC_SUMMARY',
    moderationStatus: 'APPROVED',
    publishedAt: '2026-09-28T09:00:00Z',
    publishedBy: 'Coordinator CCU Admin',
    responseDeadline: '2026-11-15T17:00:00Z',
    buyerOrganizationId: 'ORG-PROSER-001',
    factoryId: 'FP-ORG-PROSER-001',
    buyerInfo: {
      companyName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
      allowPublicCompanyName: true,
      buyerSummary: 'Nhà máy sản xuất may mặc công nghiệp Proser',
      contactPerson: 'Nguyễn Văn Nam - Trưởng phòng Vật tư',
      phone: '0903 111 222',
      email: 'vattu@proser.vn',
      internalBudget: '450.000.000 VNĐ',
      targetPrice: '45.000 VNĐ / mét',
      internalNotes: 'Cần kiểm tra kỹ độ lệch màu giữa các cây vải.',
      confidentialAttachments: ['Bang_mau_vai_chuan_proser.pdf']
    }
  },
  {
    id: 'NC-2026-FAC-PROSER-02',
    publicCode: 'NC-2026-FAC-PROSER-02',
    title: 'Dịch vụ bảo trì và hiệu chuẩn định kỳ 180 máy may công nghiệp & máy đo điện trở ESD',
    category: 'Bảo trì & Thiết bị sản xuất',
    categorySlug: 'bao-tri-thiet-bi',
    keyword: 'Bảo trì máy may công nghiệp',
    keywordSlug: 'bao-tri-may-may',
    stageId: 4,
    stageName: 'Giai đoạn 4 - Vận hành Sản xuất',
    productService: 'Hiệu chuẩn thiết bị may & phòng sạch',
    quantity: '1',
    unit: 'gói dịch vụ 12 tháng',
    allowPublicQuantity: true,
    province: 'TP. Hồ Chí Minh',
    location: 'TP. Hồ Chí Minh',
    industrialPark: 'KCN Hiệp Phước',
    allowPublicIndustrialPark: true,
    deadline: 'Trước 10/11/2026',
    sampleRequired: false,
    surveyRequired: true,
    publicSummary: 'Nhà máy Proser tìm đơn vị kỹ thuật M&E chuyên nghiệp thực hiện bảo dưỡng phòng ngừa cho 180 máy may Juki và hiệu chuẩn thiết bị kiểm tra điện trở ESD hàng quý.',
    publicRequirements: [
      'Đội ngũ kỹ thuật viên có chứng chỉ bảo trì thiết bị công nghiệp',
      'Cam kết thời gian xử lý sự cố trong vòng 4 giờ kể từ khi nhận báo sự cố',
      'Cung cấp chứng chỉ hiệu chuẩn có giá trị pháp lý'
    ],
    status: 'ACTIVE_SOURCING',
    visibility: 'PUBLIC_SUMMARY',
    moderationStatus: 'APPROVED',
    publishedAt: '2026-09-28T10:30:00Z',
    publishedBy: 'Coordinator CCU Admin',
    responseDeadline: '2026-11-05T17:00:00Z',
    buyerOrganizationId: 'ORG-PROSER-001',
    factoryId: 'FP-ORG-PROSER-001',
    buyerInfo: {
      companyName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
      allowPublicCompanyName: true,
      buyerSummary: 'Nhà máy sản xuất may mặc công nghiệp Proser',
      contactPerson: 'Trần Văn Kiên - Quản đốc phân xưởng',
      phone: '0908 333 444',
      email: 'kien.tv@proser.vn',
      internalBudget: '120.000.000 VNĐ / năm',
      targetPrice: '10.000.000 VNĐ / tháng',
      internalNotes: 'Ưu tiên đơn vị có kho linh kiện sẵn tại TP.HCM.'
    }
  },
  {
    id: 'NC-2026-FAC-PROSER-PRIV-01',
    publicCode: 'NC-2026-FAC-PROSER-PRIV-01',
    title: 'Kế hoạch mua sắm nội bộ: Đầu tư máy ép tem chuyển nhiệt cao tần tự động',
    category: 'Máy móc & Thiết bị may',
    categorySlug: 'may-moc-thiet-bi',
    stageId: 4,
    stageName: 'Giai đoạn 4 - Vận hành Sản xuất',
    productService: 'Máy ép tem chuyển nhiệt công nghệ cao',
    quantity: '2',
    unit: 'máy',
    province: 'TP. Hồ Chí Minh',
    location: 'TP. Hồ Chí Minh',
    status: 'ACTIVE_SOURCING',
    visibility: 'PRIVATE', // PRIVATE: Tuyệt đối không xuất hiện trên public
    moderationStatus: 'APPROVED',
    buyerOrganizationId: 'ORG-PROSER-001',
    factoryId: 'FP-ORG-PROSER-001',
    buyerInfo: {
      companyName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
      allowPublicCompanyName: false,
      buyerSummary: 'Ban Giám Đốc Proser',
      contactPerson: 'CEO Proser Private',
      phone: '0909 999 888',
      email: 'ceo@proser.vn',
      internalBudget: '850.000.000 VNĐ',
      targetPrice: '800.000.000 VNĐ',
      internalNotes: 'Dự án bí mật cải tiến công nghệ in ép.'
    }
  },
  {
    id: 'NC-2026-FAC-TAHOMART-01',
    publicCode: 'NC-2026-FAC-TAHOMART-01',
    title: 'Cung cấp 50.000 cuộn màng co nhiệt POF khổ 45cm và màng nhôm bảo quản',
    category: 'Bao bì & Đóng gói',
    categorySlug: 'bao-bi-dong-goi',
    keyword: 'Màng co nhiệt POF đóng gói',
    keywordSlug: 'mang-co-nhiet-pof',
    stageId: 4,
    stageName: 'Giai đoạn 4 - Vận hành Sản xuất',
    productService: 'Màng co nhiệt POF thân thiện môi trường độ dày 15 micron',
    quantity: '50.000',
    unit: 'cuộn',
    allowPublicQuantity: true,
    province: 'Hà Nội',
    location: 'Hà Nội',
    industrialPark: 'KCN Quang Minh',
    allowPublicIndustrialPark: true,
    deadline: 'Trước 25/11/2026',
    sampleRequired: true,
    surveyRequired: false,
    publicSummary: 'Phân xưởng đóng gói Tahomart tại KCN Quang Minh cần tìm nhà sản xuất màng co POF độ trong suốt cao, độ co đều 4 hướng phục vụ đóng gói giỏ quà tết công nhân viên.',
    publicRequirements: [
      'Đạt chứng nhận an toàn tiếp xúc thực phẩm FDA / SGS',
      'Độ dày chuẩn 15 micron, không rách khi gia nhiệt máy bọc tự động',
      'Cung cấp cuộn mẫu thử nghiệm trên dây chuyền trước khi đặt hàng'
    ],
    status: 'ACTIVE_SOURCING',
    visibility: 'PUBLIC_SUMMARY',
    moderationStatus: 'APPROVED',
    publishedAt: '2026-09-28T11:00:00Z',
    publishedBy: 'Coordinator CCU Admin',
    responseDeadline: '2026-11-20T17:00:00Z',
    buyerOrganizationId: 'ORG-TAHOMART-002',
    factoryId: 'FP-ORG-TAHOMART-002',
    buyerInfo: {
      companyName: 'Tập đoàn TAHOMART Việt Nam',
      allowPublicCompanyName: true,
      buyerSummary: 'Tập đoàn phân phối và đóng gói nông sản Tahomart',
      contactPerson: 'Phạm Thu Thảo - Trưởng phòng Thu mua',
      phone: '0915 222 333',
      email: 'thao.pt@tahomart.vn',
      internalBudget: '320.000.000 VNĐ',
      targetPrice: '6.400 VNĐ / mét',
      internalNotes: 'Yêu cầu cuộn đóng màng chống bụi sạch sẽ.'
    }
  },
  {
    id: 'NC-2026-PRIV-901',
    publicCode: 'NC-2026-PRIV-901',
    title: 'Nhu cầu riêng tư: Mua sắm bản quyền dây chuyền sản xuất bo mạch SMT',
    category: 'Điện tử & Bán dẫn',
    categorySlug: 'dien-tu-ban-dan',
    stageId: 3,
    stageName: 'Giai đoạn 3 - Lắp đặt & Hoàn thiện',
    productService: 'Dây chuyền máy dán chip SMT tốc độ cao',
    quantity: '2',
    unit: 'line',
    province: 'Bắc Ninh',
    location: 'Bắc Ninh',
    deadline: 'Trước 01/11/2026',
    status: 'ACTIVE_SOURCING',
    visibility: 'PRIVATE', // Tuyệt đối KHÔNG xuất hiện trên /san-nhu-cau
    moderationStatus: 'APPROVED',
    publishedAt: '2026-09-20T10:00:00Z',
    buyerInfo: {
      companyName: 'Bán dẫn Hàn Quốc Semiconductor',
      allowPublicCompanyName: false,
      buyerSummary: 'Tập đoàn linh kiện bán dẫn công nghệ cao',
      contactPerson: 'Mr. Lee',
      phone: '0999 111 222',
      email: 'lee@koreasemi.kr'
    }
  },
  {
    id: 'NC-2026-MATCH-802',
    publicCode: 'NC-2026-MATCH-802',
    title: 'Nhu cầu chỉ NCC phù hợp: Cung cấp hóa chất xi mạ kẽm niken đặc chủng',
    category: 'Hóa chất & Xi mạ',
    categorySlug: 'hoa-chat-xi-ma',
    stageId: 4,
    stageName: 'Giai đoạn 4 - Vận hành Sản xuất',
    productService: 'Hóa chất xi mạ Zn-Ni đạt chuẩn ASTM B841',
    quantity: '5.000',
    unit: 'lít',
    province: 'Hải Phòng',
    location: 'Hải Phòng',
    deadline: 'Trước 15/10/2026',
    status: 'ACTIVE_SOURCING',
    visibility: 'ONLY_MATCHED', // Tuyệt đối KHÔNG xuất hiện trên /san-nhu-cau (chỉ Coordinator ghép đôi)
    moderationStatus: 'APPROVED',
    publishedAt: '2026-09-22T11:00:00Z',
    buyerInfo: {
      companyName: 'Nhà máy Phụ tùng Ô tô Hải Phòng',
      allowPublicCompanyName: false,
      buyerSummary: 'Nhà cung cấp Tier 1 ngành linh kiện ô tô tại Hải Phòng',
      contactPerson: 'Đặng Tuấn Anh',
      phone: '0933 444 555',
      email: 'anh.dt@haiphong-parts.com'
    }
  }
];

// ----------------------------------------------------------------------------
// 2. DATA SANITIZATION SERVICE (ENFORCE SECURITY AT DATA LAYER)
// ----------------------------------------------------------------------------
/**
 * Chuyển đổi Requirement gốc thành Public Summary an toàn tuyệt đối.
 * Loại bỏ toàn bộ thông tin nhạy cảm (Tên cá nhân, SĐT, Email, Ngân sách nội bộ,
 * Target price, Ghi chú nội bộ, File mật) trước khi hiển thị trên Sàn Nhu Cầu.
 */
export function toPublicRequirementSummary(rawRequirement) {
  if (!rawRequirement) return null;

  // Quyết định tên hiển thị của Buyer:
  // Nếu buyer chưa cho phép công bố tên công ty, trả về tóm tắt ẩn danh
  let buyerDisplayName = rawRequirement.buyerInfo?.buyerSummary || 'Nhà máy sản xuất B2B trong nước';
  if (rawRequirement.buyerInfo?.allowPublicCompanyName && rawRequirement.buyerInfo?.companyName) {
    buyerDisplayName = rawRequirement.buyerInfo.companyName;
  }

  return {
    id: rawRequirement.id,
    publicCode: rawRequirement.publicCode || rawRequirement.biddingCode || `NC-${rawRequirement.id}`,
    title: rawRequirement.title,
    category: rawRequirement.category,
    categorySlug: rawRequirement.categorySlug,
    keyword: rawRequirement.keyword || rawRequirement.productService,
    keywordSlug: rawRequirement.keywordSlug,
    stageId: rawRequirement.stageId,
    stageName: rawRequirement.stageName,
    productService: rawRequirement.productService,
    quantity: rawRequirement.allowPublicQuantity !== false ? rawRequirement.quantity : null,
    unit: rawRequirement.unit || 'sản phẩm',
    province: rawRequirement.province || rawRequirement.location,
    location: rawRequirement.province || rawRequirement.location,
    industrialPark: rawRequirement.allowPublicIndustrialPark !== false ? rawRequirement.industrialPark : null,
    deadline: rawRequirement.deadline,
    sampleRequired: !!rawRequirement.sampleRequired,
    surveyRequired: !!rawRequirement.surveyRequired,
    publicSummary: rawRequirement.publicSummary || rawRequirement.description || '',
    publicRequirements: Array.isArray(rawRequirement.publicRequirements) ? rawRequirement.publicRequirements : [],
    status: rawRequirement.status || 'ACTIVE_SOURCING',
    visibility: rawRequirement.visibility || 'PUBLIC_SUMMARY',
    publishedAt: rawRequirement.publishedAt || new Date().toISOString(),
    responseDeadline: rawRequirement.responseDeadline || rawRequirement.deadline,
    buyerDisplayName: buyerDisplayName,
    // Số lượng phản hồi thật (được đếm từ cơ sở dữ liệu response)
    responsesCount: getRequirementResponsesCount(rawRequirement.id)
  };
}

// ----------------------------------------------------------------------------
// 3. RETRIEVE MASTER REQUIREMENTS (TÍCH HỢP DB / LOCALSTORAGE)
// ----------------------------------------------------------------------------
export function getAllMasterRequirements() {
  let requirements = [...SEED_REQUIREMENTS];
  try {
    if (typeof localStorage !== 'undefined') {
      const customListStr = localStorage.getItem(STORAGE_KEYS.MASTER_REQUIREMENTS);
    if (customListStr) {
      const parsed = JSON.parse(customListStr);
      // Gộp các requirement tùy biến mới thêm
      const ids = new Set(requirements.map(r => r.id));
      parsed.forEach(item => {
        if (!ids.has(item.id)) {
          requirements.unshift(item);
        }
      });
    }

    // Tích hợp cả nhu cầu do người dùng vừa đăng qua /dang-nhu-cau
    const userDemandsStr = localStorage.getItem('ccu_user_demands');
    if (userDemandsStr) {
      const userDemands = JSON.parse(userDemandsStr);
      userDemands.forEach(d => {
        const existingIdx = requirements.findIndex(r => r.id === d.id);
        const mapped = {
          id: d.id,
          publicCode: d.publicCode || `NC-${d.id.replace('REQ-', '')}`,
          title: d.title,
          category: d.category || 'Sản phẩm & Dịch vụ công nghiệp',
          categorySlug: d.categorySlug || 'san-pham-cong-nghiep',
          keyword: d.productService || d.title,
          stageId: Number(d.stageId) || 4,
          stageName: `Giai đoạn ${d.stageId || 4}`,
          productService: d.productService,
          quantity: d.quantity,
          unit: d.unit,
          allowPublicQuantity: true,
          province: d.province || d.location || 'Toàn quốc',
          location: d.location || d.province || 'Toàn quốc',
          industrialPark: d.kcn || d.industrialParkId || null,
          allowPublicIndustrialPark: true,
          deadline: d.deadline,
          sampleRequired: !!d.sampleRequired,
          surveyRequired: !!d.surveyRequired,
          publicSummary: d.specifications || d.title,
          publicRequirements: d.certificationRequirements ? [d.certificationRequirements] : [],
          status: d.status === 'CLOSED' ? 'CLOSED' : 'ACTIVE_SOURCING',
          visibility: d.visibility || 'ONLY_MATCHED',
          moderationStatus: d.visibility === 'PUBLIC' ? 'APPROVED' : 'PENDING',
          publishedAt: d.createdAt || new Date().toISOString(),
          buyerInfo: {
            companyName: d.companyName,
            allowPublicCompanyName: false,
            buyerSummary: `Nhà máy tại ${d.location || 'Việt Nam'}`,
            contactPerson: d.contactName,
            phone: d.phone,
            email: d.email,
            internalBudget: `${d.budgetMin || ''} - ${d.budgetMax || ''} VNĐ`
          }
        };

        if (existingIdx >= 0) {
          requirements[existingIdx] = mapped;
        } else {
          requirements.unshift(mapped);
        }
      });
    }
    }
  } catch (e) {
    console.warn('Lỗi đọc master requirements:', e);
  }
  return requirements;
}

// ----------------------------------------------------------------------------
// 4. PUBLIC SOURCING QUERY (ÁP DỤNG SECTION 2 & 4)
// ----------------------------------------------------------------------------
/**
 * Lấy danh sách nhu cầu được phép hiển thị trên Sàn Nhu Cầu (/san-nhu-cau).
 * Bắt buộc thỏa mãn:
 * 1. visibility === 'PUBLIC_SUMMARY' (hoặc 'PUBLIC')
 * 2. status !== 'CLOSED' && status !== 'CANCELLED' (trừ khi lọc theo trạng thái)
 * 3. moderationStatus === 'APPROVED'
 * TUYỆT ĐỐI LOẠI BỎ: PRIVATE, MATCHED_SUPPLIERS_ONLY / ONLY_MATCHED
 */
export function getPublicRequirements(filters = {}) {
  const all = getAllMasterRequirements();

  // 1. Lọc điều kiện bắt buộc theo quy định công bố
  const publicOnly = all.filter(r => {
    const isPublicVisibility = r.visibility === 'PUBLIC_SUMMARY' || r.visibility === 'PUBLIC';
    const isApproved = r.moderationStatus === 'APPROVED';
    return isPublicVisibility && isApproved;
  });

  // 2. Áp dụng các bộ lọc người dùng
  const filtered = publicOnly.filter(r => {
    // Search keyword
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      const matchTitle = (r.title || '').toLowerCase().includes(q);
      const matchProduct = (r.productService || '').toLowerCase().includes(q);
      const matchSummary = (r.publicSummary || '').toLowerCase().includes(q);
      const matchCode = (r.publicCode || '').toLowerCase().includes(q);
      const matchCat = (r.category || '').toLowerCase().includes(q);
      if (!matchTitle && !matchProduct && !matchSummary && !matchCode && !matchCat) return false;
    }

    // Stage filter
    if (filters.stageId && filters.stageId !== 'all') {
      if (String(r.stageId) !== String(filters.stageId)) return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (r.categorySlug !== filters.category && r.category !== filters.category) return false;
    }

    // Province filter
    if (filters.province && filters.province !== 'all') {
      if (!r.province || !r.province.toLowerCase().includes(filters.province.toLowerCase())) return false;
    }

    // Industrial Park filter
    if (filters.industrialPark && filters.industrialPark !== 'all') {
      if (!r.industrialPark || !r.industrialPark.toLowerCase().includes(filters.industrialPark.toLowerCase())) return false;
    }

    // Sample Required
    if (filters.sampleRequired === true) {
      if (!r.sampleRequired) return false;
    }

    // Survey Required
    if (filters.surveyRequired === true) {
      if (!r.surveyRequired) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'open' && r.status !== 'ACTIVE_SOURCING') return false;
      if (filters.status === 'closed' && r.status !== 'CLOSED') return false;
    }

    return true;
  });

  // 3. Sắp xếp kết quả (Mới nhất, Sắp hết hạn)
  if (filters.sortBy === 'expiring_soon') {
    filtered.sort((a, b) => new Date(a.responseDeadline || a.deadline) - new Date(b.responseDeadline || b.deadline));
  } else {
    // Mặc định: Mới nhất
    filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }

  // 4. Sanitize trả về dữ liệu an toàn
  return filtered.map(r => toPublicRequirementSummary(r));
}

/**
 * Lấy chi tiết công khai của một Nhu cầu
 */
export function getPublicRequirementById(id) {
  const all = getAllMasterRequirements();
  const found = all.find(r => r.id === id || r.publicCode === id);
  if (!found) return null;

  // Kiểm tra quyền công bố
  const isPublic = (found.visibility === 'PUBLIC_SUMMARY' || found.visibility === 'PUBLIC') && found.moderationStatus === 'APPROVED';
  if (!isPublic) return null;

  return toPublicRequirementSummary(found);
}

// ----------------------------------------------------------------------------
// 5. SUPPLIER RESPONSE SERVICE (ENTITY: supplier_requirement_responses)
// ----------------------------------------------------------------------------
export function getAllResponses() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUPPLIER_RESPONSES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveAllResponses(responses) {
  try {
    localStorage.setItem(STORAGE_KEYS.SUPPLIER_RESPONSES, JSON.stringify(responses));
  } catch (e) {
    console.error('Lỗi lưu responses:', e);
  }
}

/**
 * Đếm số response thật của một Nhu cầu
 */
export function getRequirementResponsesCount(requirementId) {
  const responses = getAllResponses();
  return responses.filter(r => r.requirementId === requirementId).length;
}

/**
 * Kiểm tra Nhà cung ứng đã phản hồi nhu cầu này chưa (Tránh duplicate response - Section 10)
 */
export function getSupplierResponseForRequirement(requirementId, supplierOrgId) {
  if (!supplierOrgId) return null;
  const responses = getAllResponses();
  return responses.find(r => r.requirementId === requirementId && r.supplierOrganizationId === supplierOrgId) || null;
}

/**
 * Lấy danh sách responses của một nhu cầu theo phân quyền (Section 4 & 16 & 23)
 * - Nếu là Admin: xem được tất cả phản hồi để shortlist/kiểm duyệt.
 * - Nếu là Supplier: CHỈ xem được phản hồi của chính mình, TUYỆT ĐỐI không xem được đối thủ.
 */
export function getResponsesForRequirement(requirementId, currentSupplierOrgId = null, isAdmin = false) {
  const responses = getAllResponses().filter(r => r.requirementId === requirementId);
  if (isAdmin) return responses;
  if (currentSupplierOrgId) {
    return responses.filter(r => r.supplierOrganizationId === currentSupplierOrgId);
  }
  return [];
}

/**
 * Gửi phản hồi “TÔI CÓ KHẢ NĂNG ĐÁP ỨNG” (Section 7, 8, 9, 10)
 */
export function submitSupplierResponse({
  requirementId,
  supplierOrganizationId,
  supplierName,
  productServiceOffered,
  capabilityNote,
  serviceArea,
  moqCapacity,
  leadTimeEstimated,
  sampleAvailable = false,
  surveyAvailable = false,
  message = '',
  attachments = []
}) {
  const allResponses = getAllResponses();
  const existingIdx = allResponses.findIndex(
    r => r.requirementId === requirementId && r.supplierOrganizationId === supplierOrganizationId
  );

  const now = new Date().toISOString();

  let savedRecord = null;
  if (existingIdx >= 0) {
    // Cập nhật phản hồi đã có, KHÔNG tạo record duplicate (Section 10)
    savedRecord = {
      ...allResponses[existingIdx],
      productServiceOffered: productServiceOffered || allResponses[existingIdx].productServiceOffered,
      capabilityNote: capabilityNote || allResponses[existingIdx].capabilityNote,
      serviceArea: serviceArea || allResponses[existingIdx].serviceArea,
      moqCapacity: moqCapacity || allResponses[existingIdx].moqCapacity,
      leadTimeEstimated: leadTimeEstimated || allResponses[existingIdx].leadTimeEstimated,
      sampleAvailable: sampleAvailable ?? allResponses[existingIdx].sampleAvailable,
      surveyAvailable: surveyAvailable ?? allResponses[existingIdx].surveyAvailable,
      message: message || allResponses[existingIdx].message,
      attachments: attachments.length > 0 ? attachments : allResponses[existingIdx].attachments,
      updatedAt: now
    };
    allResponses[existingIdx] = savedRecord;

    logRequirementAudit({
      action: 'SUPPLIER_RESPONSE_UPDATED',
      requirementId,
      actor: supplierName,
      details: `Nhà cung ứng ${supplierName} đã cập nhật hồ sơ phản hồi năng lực.`
    });
  } else {
    // Tạo mới phản hồi
    savedRecord = {
      id: `RESP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      requirementId,
      supplierOrganizationId,
      supplierName,
      productServiceOffered,
      capabilityNote,
      serviceArea,
      moqCapacity,
      leadTimeEstimated,
      sampleAvailable,
      surveyAvailable,
      message,
      attachments,
      responseStatus: 'SUBMITTED', // SUBMITTED | UNDER_REVIEW | NEED_MORE_INFO | SHORTLISTED | NOT_SUITABLE | CONVERTED_TO_MATCH
      submittedAt: now,
      updatedAt: now
    };
    allResponses.unshift(savedRecord);

    logRequirementAudit({
      action: 'SUPPLIER_RESPONSE_SUBMITTED',
      requirementId,
      actor: supplierName,
      details: `Nhà cung ứng ${supplierName} gửi phản hồi "Tôi có khả năng đáp ứng".`
    });
  }

  saveAllResponses(allResponses);
  return { success: true, response: savedRecord };
}

// ----------------------------------------------------------------------------
// 6. MATCHING RELEVANCE EVALUATION (SECTION 12)
// ----------------------------------------------------------------------------
/**
 * Đánh giá tính liên quan thực tế giữa Nhu cầu và Hồ sơ Năng lực NCC đang đăng nhập.
 * KHÔNG dùng điểm phần trăm giả tạo (VD: 95%).
 * Giải thích theo từng tiêu chí cụ thể: Ngành hàng, Địa bàn, Năng lực mẫu thử.
 */
export function evaluateSupplierRelevance(requirement, supplierProfile) {
  if (!supplierProfile) return null;

  const checks = [];

  // 1. Kiểm tra nhóm ngành hàng
  const reqCategory = (requirement.categorySlug || requirement.category || '').toLowerCase();
  const supIndustry = (supplierProfile.industry || supplierProfile.category || '').toLowerCase();
  const matchCategory = reqCategory && (supIndustry.includes(reqCategory) || reqCategory.includes(supIndustry));
  checks.push({
    title: 'Nhóm sản phẩm / Chuyên mục',
    pass: matchCategory,
    note: matchCategory ? 'Khớp năng lực sản xuất chính' : 'Chưa khớp chuyên mục chính'
  });

  // 2. Kiểm tra địa bàn giao hàng
  const reqProvince = (requirement.province || requirement.location || '').toLowerCase();
  const supLoc = (supplierProfile.location || supplierProfile.address || '').toLowerCase();
  const matchLocation = reqProvince && (supLoc.includes(reqProvince) || reqProvince.includes(supLoc) || supLoc.includes('toàn quốc'));
  checks.push({
    title: 'Địa bàn phục vụ',
    pass: matchLocation,
    note: matchLocation ? `Sẵn sàng phục vụ tại ${requirement.province}` : 'Cần xác nhận chi phí vận chuyển'
  });

  // 3. Kiểm tra yêu cầu mẫu thử
  if (requirement.sampleRequired) {
    checks.push({
      title: 'Mẫu thử đối chứng',
      pass: null, // Cần xác nhận
      note: 'Buyer yêu cầu gửi mẫu thực tế trước khi ký kết'
    });
  }

  const allPassed = checks.filter(c => c.pass === true).length;
  let overall = 'RELEVANT';
  if (allPassed === 0) overall = 'NEEDS_VERIFICATION';
  else if (allPassed < checks.length) overall = 'PARTIALLY_RELEVANT';

  return {
    overall,
    badgeText: overall === 'RELEVANT' ? 'Phù hợp năng lực của bạn' : 'Cần kiểm tra thêm điều kiện',
    checks
  };
}

// ----------------------------------------------------------------------------
// 7. AUDIT LOG & ADMIN MUTATIONS (SECTION 15, 16, 24)
// ----------------------------------------------------------------------------
export function getAllAuditLogs() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function logRequirementAudit({ action, requirementId, actor = 'System Admin', details = '' }) {
  const logs = getAllAuditLogs();
  const entry = {
    id: `LOG-${Date.now()}`,
    action,
    requirementId,
    actor,
    timestamp: new Date().toISOString(),
    details
  };
  logs.unshift(entry);
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 200)));
  } catch (e) {}
  return entry;
}

/**
 * Admin duyệt trạng thái response: SHORTLISTED, NEED_MORE_INFO, NOT_SUITABLE
 */
export function adminReviewSupplierResponse({
  responseId,
  newStatus,
  reason = '',
  actor = 'System Admin'
}) {
  const allResponses = getAllResponses();
  const idx = allResponses.findIndex(r => r.id === responseId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy phản hồi' };

  const resp = allResponses[idx];
  const oldStatus = resp.responseStatus;
  resp.responseStatus = newStatus;
  resp.reviewNote = reason;
  resp.reviewedAt = new Date().toISOString();
  resp.reviewedBy = actor;

  allResponses[idx] = resp;
  saveAllResponses(allResponses);

  // Nếu Shortlist: tạo/cập nhật SupplierMatch (Section 16)
  if (newStatus === 'SHORTLISTED') {
    createOrUpdateSupplierMatch(resp.requirementId, resp.supplierOrganizationId, resp.supplierName);
  }

  logRequirementAudit({
    action: `RESPONSE_${newStatus}`,
    requirementId: resp.requirementId,
    actor,
    details: `Chuyển trạng thái phản hồi của ${resp.supplierName} từ ${oldStatus} -> ${newStatus}. Lý do: ${reason || 'Đạt tiêu chuẩn đánh giá.'}`
  });

  return { success: true, response: resp };
}

/**
 * Tạo kết nối SupplierMatch khi Admin shortlist
 */
function createOrUpdateSupplierMatch(requirementId, supplierOrgId, supplierName) {
  try {
    const rawMatches = localStorage.getItem(STORAGE_KEYS.SUPPLIER_MATCHES);
    let matches = rawMatches ? JSON.parse(rawMatches) : [];
    const existing = matches.find(m => m.requirementId === requirementId && m.supplierOrgId === supplierOrgId);
    if (!existing) {
      matches.unshift({
        id: `MATCH-${Date.now()}`,
        requirementId,
        supplierOrgId,
        supplierName,
        status: 'COORDINATOR_SHORTLISTED',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.SUPPLIER_MATCHES, JSON.stringify(matches));
    }
  } catch (e) {}
}

/**
 * Cập nhật visibility của Requirement từ Admin
 */
export function adminUpdateRequirementVisibility(requirementId, newVisibility, actor = 'System Admin') {
  const all = getAllMasterRequirements();
  const item = all.find(r => r.id === requirementId);
  if (!item) return { success: false };

  const old = item.visibility;
  item.visibility = newVisibility;
  if (newVisibility === 'PUBLIC_SUMMARY') {
    item.moderationStatus = 'APPROVED';
    item.publishedAt = new Date().toISOString();
  }

  try {
    localStorage.setItem(STORAGE_KEYS.MASTER_REQUIREMENTS, JSON.stringify(all));
  } catch (e) {}

  logRequirementAudit({
    action: 'VISIBILITY_CHANGED',
    requirementId,
    actor,
    details: `Thay đổi phạm vi chia sẻ từ [${old}] sang [${newVisibility}].`
  });

  return { success: true, item };
}
