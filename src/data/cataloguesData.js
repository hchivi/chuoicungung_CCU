// ============================================================================
// MASTER CATALOGUES & INDUSTRIAL PUBLICATIONS DATA SERVICE
// PAGE 30: DANH SÁCH CATALOGUE & ẤN PHẨM (/catalogue)
// Chuẩn hóa theo spec 30.txt - CHUOICUNGUNG.COM
// ============================================================================

const inMemoryStore = {};

function safeGetItem(key) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return inMemoryStore[key] || null;
    }
  }
  return inMemoryStore[key] || null;
}

function safeSetItem(key, val) {
  inMemoryStore[key] = val;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  }
}

const STORAGE_KEYS = {
  CATALOGUES: 'ccu_master_catalogues_v1',
  EDITIONS: 'ccu_catalogue_editions_v1',
  ENTRIES: 'ccu_catalogue_entries_v1',
  DISTRIBUTION_BATCHES: 'ccu_catalogue_distribution_batches_v1',
  QR_SCANS: 'ccu_catalogue_qr_scans_v1',
  PARTICIPATION_REQUESTS: 'ccu_catalogue_participation_requests_v1',
  AUDIT_LOGS: 'ccu_catalogue_audit_logs_v1'
};

// ----------------------------------------------------------------------------
// 1. CATALOGUE TYPES & STATUSES (SPEC SECTION 6 & 21)
// ----------------------------------------------------------------------------
export const CATALOGUE_TYPES = {
  CATEGORY_CATALOGUE: {
    id: 'CATEGORY_CATALOGUE',
    label: 'Theo Chuyên Mục & Ngành',
    shortName: 'Chuyên mục',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  PROGRAM_CATALOGUE: {
    id: 'PROGRAM_CATALOGUE',
    label: 'Theo Chương Trình & Sự Kiện',
    shortName: 'Chương trình',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  INDUSTRIAL_PARK_CATALOGUE: {
    id: 'INDUSTRIAL_PARK_CATALOGUE',
    label: 'Theo Khu Công Nghiệp',
    shortName: 'Khu công nghiệp',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  ASSOCIATION_CATALOGUE: {
    id: 'ASSOCIATION_CATALOGUE',
    label: 'Theo Hội & Hiệp Hội',
    shortName: 'Hiệp hội',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  SUPPLIER_SHORTLIST_CATALOGUE: {
    id: 'SUPPLIER_SHORTLIST_CATALOGUE',
    label: 'Top Tuyển Chọn & Bạch Thư',
    shortName: 'Top tuyển chọn',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  GENERAL_SUPPLIER_CATALOGUE: {
    id: 'GENERAL_SUPPLIER_CATALOGUE',
    label: 'Tổng Hợp Nhà Cung Cấp',
    shortName: 'Tổng hợp',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
  }
};

export const CATALOGUE_STATUSES = {
  PLANNING: { id: 'PLANNING', label: 'Lên Kế Hoạch', color: 'slate' },
  CONTENT_COLLECTION: { id: 'CONTENT_COLLECTION', label: 'Thu Thập Hồ Sơ', color: 'amber' },
  CONTENT_REVIEW: { id: 'CONTENT_REVIEW', label: 'Biên Tập & Thẩm Định', color: 'orange' },
  DIGITAL_PREVIEW: { id: 'DIGITAL_PREVIEW', label: 'Bản Xem Trước Số', color: 'blue' },
  APPROVED: { id: 'APPROVED', label: 'Đã Duyệt Nội Dung', color: 'indigo' },
  PUBLISHED_DIGITAL: { id: 'PUBLISHED_DIGITAL', label: 'Phát Hành Trực Tuyến', color: 'emerald' },
  PRINT_CONFIRMED: { id: 'PRINT_CONFIRMED', label: 'Xác Nhận In Ấn', color: 'purple' },
  PRINTED: { id: 'PRINTED', label: 'Đã In Thành Phẩm', color: 'teal' },
  DISTRIBUTING: { id: 'DISTRIBUTING', label: 'Đang Phân Phối', color: 'sky' },
  COMPLETED: { id: 'COMPLETED', label: 'Hoàn Tất Phát Hành', color: 'green' },
  ARCHIVED: { id: 'ARCHIVED', label: 'Lưu Trữ', color: 'gray' },
  CANCELLED: { id: 'CANCELLED', label: 'Hủy Bỏ', color: 'rose' }
};

export const ENTRY_APPROVAL_STATUSES = {
  SUBMITTED: 'SUBMITTED',
  NEED_MORE_INFO: 'NEED_MORE_INFO',
  CONTENT_PREPARATION: 'CONTENT_PREPARATION',
  CLIENT_REVIEW: 'CLIENT_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

export const SPONSOR_PLACEMENT_TYPES = {
  ORGANIC: { id: 'ORGANIC', label: 'Hồ sơ tiêu chuẩn' },
  SPONSORED: { id: 'SPONSORED', label: 'TÀI TRỢ', badge: 'bg-amber-500 text-white' },
  FOUNDING_PARTNER_ENTITLEMENT: { id: 'FOUNDING_PARTNER_ENTITLEMENT', label: 'ĐỐI TÁC ĐỒNG HÀNH', badge: 'bg-indigo-600 text-white' },
  STRATEGIC_CO_HOST: { id: 'STRATEGIC_CO_HOST', label: 'ĐỒNG CHỦ TRÌ', badge: 'bg-emerald-600 text-white' }
};

// ----------------------------------------------------------------------------
// 2. SEED MASTER CATALOGUES & EDITIONS (SPEC SECTION 4, 5, 13, 21, 31, 32, 36)
// ----------------------------------------------------------------------------
export const SEED_MASTER_CATALOGUES = [
  {
    id: 'CAT-DONG-PHUC-2026',
    slug: 'nha-cung-ung-dong-phuc-bao-ho-2026',
    title: 'Ấn Phẩm Năng Lực Cung Ứng: Đồng Phục Doanh Nghiệp & Bảo Hộ Lao Động 2026',
    shortDescription: 'Hồ sơ năng lực, xưởng may quy chuẩn, chứng chỉ OEKO-TEX / ISO và quy cách may đo công nghiệp của các nhà cung ứng tiêu biểu phục vụ nhà máy FDI và KCN toàn quốc.',
    catalogueType: 'CATEGORY_CATALOGUE',
    categoryId: 'dong-phuc-bao-ho',
    categoryName: 'Đồng Phục & Bảo Hộ Lao Động',
    keywordClusterId: 'may-dong-phuc-cong-nhan',
    topic: 'Đồng Phục Doanh Nghiệp, Áo Polo Công Nhân & Thiết Bị Bảo Hộ PPE Chuyên Dụng',
    provinceId: 'ho-chi-minh',
    provinceName: 'Toàn Quốc (Trọng điểm TP.HCM & Đông Nam Bộ)',
    industrialParkId: 'kcn-hiep-phuoc',
    industrialParkName: 'KCN Hiệp Phước & Các KCN Trọng Điểm',
    programId: 'vsip-binh-duong',
    programTitle: 'Ngày Hội Kết Nối Cung Ứng Doanh Nghiệp Phụ Trợ VSIP 1',
    publisherOrganizationId: 'ORG-PROSER-001',
    publisherName: 'Bàn Điều Phối Chuỗi Cung Ứng CCU & Hội Dệt May',
    coverUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    status: 'DISTRIBUTING',
    publishable: true,
    owner: 'Tô Ngọc Dũng (Media & Strategy Director)',
    nextAction: 'Đối soát 270 cuốn phát tại KCN Hiệp Phước và chuẩn bị đợt phát hành số tiếp theo',
    nextActionAt: '2026-04-05T09:00:00Z',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-25T14:30:00Z',
    currentEditionId: 'ED-DP-2026-V1',
    editions: [
      {
        id: 'ED-DP-2026-V1',
        catalogueId: 'CAT-DONG-PHUC-2026',
        editionCode: 'ED-2026-V1',
        editionName: 'Ấn bản Toàn diện Mùa Xuân 2026',
        publicationDate: '2026-03-15',
        onlinePublishedAt: '2026-03-10T10:00:00Z',
        printStatus: 'PRINTED',
        distributionStatus: 'IN_PROGRESS',
        // Hard Rule Section 10: plannedPrintQuantity != confirmedPrintQuantity
        plannedPrintQuantity: 1500,
        confirmedPrintQuantity: 800,
        distributedQuantity: 520, // Section 40: confirmedPrintQuantity != distributedQuantity
        fileAssetId: 'FILE-CAT-DP-2026-PDF',
        fileUrl: '/files/catalogues/proser-catalogue-2026.pdf',
        fileSize: '8.4 MB',
        pageCount: 36,
        status: 'DISTRIBUTING',
        format: 'BOTH', // 'ONLINE_ONLY' | 'PRINT_CONFIRMED' | 'BOTH'
        commercialBreakdown: {
          contentFee: 15000000,
          sponsoredPlacementFee: 5000000,
          printingCostPerCopy: 42000,
          distributionCost: 3500000,
          currency: 'VND'
        },
        distributionScopeSummary: 'Phân phối trực tiếp tại các bàn giao thương B2B, gửi Ban Quản lý 5 KCN phía Nam và bàn giao cho các nhà máy mua hàng FDI.',
        // Distribution Batches (Section 36, 37, 38)
        distributionBatches: [
          {
            id: 'BATCH-DP-01',
            channel: 'EXPO_TRADE_FAIR',
            channelLabel: 'Hội chợ / Bàn Giao Thương B2B',
            location: 'Trung tâm Hội nghị KCN VSIP 1, Bình Dương',
            plannedQuantity: 300,
            actualQuantity: 250,
            distributedAt: '2026-03-18',
            receiverOrganizationId: 'ORG-AMATA-003',
            receiverName: 'Đại diện Doanh nghiệp Mua hàng Tham quan',
            responsibleUserId: 'USER-DUNG-001',
            responsibleUserName: 'Tô Ngọc Dũng',
            evidenceNote: 'Biên bản bàn giao kèm hình ảnh quầy trưng bày ấn phẩm',
            status: 'COMPLETED'
          },
          {
            id: 'BATCH-DP-02',
            channel: 'INDUSTRIAL_PARK_DIRECT',
            channelLabel: 'Giao trực tiếp Văn phòng BQL KCN',
            location: 'Văn phòng Ban Quản Lý KCN Hiệp Phước, TP.HCM',
            plannedQuantity: 300,
            actualQuantity: 270,
            distributedAt: '2026-03-22',
            receiverOrganizationId: 'ORG-HIEP-PHUOC',
            receiverName: 'Phòng Xúc Tiến Đầu Tư & Hỗ Trợ Doanh Nghiệp',
            responsibleUserId: 'USER-KIET-002',
            responsibleUserName: 'Đặng Tuấn Kiệt',
            evidenceNote: 'Biên bản nhận 270 cuốn có mộc xác nhận',
            status: 'COMPLETED'
          },
          {
            id: 'BATCH-DP-03',
            channel: 'FACTORY_DIRECT',
            channelLabel: 'Giao tận nơi cho Phòng Mua Hàng Nhà Máy',
            location: 'Khu công nghệ cao TP.HCM & KCN Long Đức',
            plannedQuantity: 200,
            actualQuantity: 0,
            distributedAt: null,
            receiverOrganizationId: 'ORG-DENSO-VN',
            receiverName: 'Bộ phận Mua Hàng FDI Tuyển Chọn',
            responsibleUserId: 'USER-ADMIN-001',
            responsibleUserName: 'Phụ Trách Vận Chuyển',
            evidenceNote: 'Đang xếp lịch chuyển phát chuyên dụng',
            status: 'PLANNED'
          }
        ],
        // Metrics Separation (Section 19 & 40)
        metrics: {
          printedConfirmed: 800,
          distributedConfirmed: 520,
          qrScans: 1420,
          profileVisits: 980,
          contactRequests: 38,
          requirementsCreated: 14
        },
        // Approved Entries (Section 13, 14)
        entries: [
          {
            id: 'ENTRY-DP-PROSER',
            catalogueEditionId: 'ED-DP-2026-V1',
            organizationId: 'ORG-PROSER-001',
            organizationName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
            supplierProfileId: 'SUP-PROSER-001',
            factoryProfileId: 'FP-ORG-PROSER-001',
            position: 1,
            approvalStatus: 'APPROVED', // Section 14: Only APPROVED shows
            sponsorPlacementType: 'FOUNDING_PARTNER_ENTITLEMENT', // Section 32
            sponsorLabel: 'ĐỐI TÁC SÁNG LẬP',
            isIncludedInFoundingPartner: true, // Section 32: Avoid double charge
            canonicalUrl: '/doanh-nghiep/chuyen-gia-dong-phuc-proser',
            qrDestinationUrl: 'https://chuoicungung.com/doanh-nghiep/chuyen-gia-dong-phuc-proser?utm_source=catalogue&utm_medium=qr&edition=ED-DP-2026-V1&entry=ENTRY-DP-PROSER',
            contentSnapshot: {
              title: 'Chuyên Gia Đồng Phục Doanh Nghiệp & Bảo Hộ Lao Động Proser',
              summary: 'Quy mô xưởng may công nghiệp 150.000 sản phẩm/tháng. Đạt chứng chỉ OEKO-TEX Standard 100, ISO 9001:2015. Chuyên dòng áo polo cao cấp và đồng phục phòng sạch cleanroom.',
              keyCapabilities: ['May mặc đồng phục FDI', 'In thêu vi tính Tajima', 'Chống tĩnh điện ESD'],
              address: 'KCN Hiệp Phước, Huyện Nhà Bè, TP. Hồ Chí Minh'
            },
            profileLastUpdatedAt: '2026-03-28T10:15:00Z',
            mediaRefs: ['/images/founding-partners/chuyen-gia-dong-phuc-logo.png']
          },
          {
            id: 'ENTRY-DP-ANPHAT',
            catalogueEditionId: 'ED-DP-2026-V1',
            organizationId: 'ORG-ANPHAT-PPE',
            organizationName: 'Công ty Cổ phần Thiết Bị Bảo Hộ An Phát',
            supplierProfileId: 'SUP-ANPHAT-002',
            position: 2,
            approvalStatus: 'APPROVED',
            sponsorPlacementType: 'ORGANIC',
            sponsorLabel: null,
            isIncludedInFoundingPartner: false,
            canonicalUrl: '/doanh-nghiep/thiet-bi-bao-ho-an-phat',
            qrDestinationUrl: 'https://chuoicungung.com/doanh-nghiep/thiet-bi-bao-ho-an-phat?utm_source=catalogue&utm_medium=qr&edition=ED-DP-2026-V1&entry=ENTRY-DP-ANPHAT',
            contentSnapshot: {
              title: 'Thiết Bị Bảo Hộ & Giải Pháp An Toàn Công Nghiệp An Phát',
              summary: 'Nhà phân phối ủy quyền thiết bị 3M, Delta Plus, giày bảo hộ Jogger và kính chống hóa chất. Kho hàng sẵn có tại Bình Dương và Hải Phòng.',
              keyCapabilities: ['Găng tay cách điện', 'Giày bảo hộ tiêu chuẩn S3', 'Mặt nạ phòng độc'],
              address: 'KCN Sóng Thần 2, Dĩ An, Tỉnh Bình Dương'
            },
            profileLastUpdatedAt: '2026-03-20T08:00:00Z',
            mediaRefs: []
          },
          {
            id: 'ENTRY-DP-THALIMEX',
            catalogueEditionId: 'ED-DP-2026-V1',
            organizationId: 'ORG-THALIMEX-DRAFT',
            organizationName: 'Công ty Dệt May Thăng Long (Hồ Sơ Đang Duyệt)',
            supplierProfileId: null,
            position: 3,
            approvalStatus: 'SUBMITTED', // NOT APPROVED -> Must NOT show on public page
            sponsorPlacementType: 'ORGANIC',
            sponsorLabel: null,
            isIncludedInFoundingPartner: false,
            canonicalUrl: '/doanh-nghiep/det-may-thang-long',
            qrDestinationUrl: '',
            contentSnapshot: {
              title: 'Hồ sơ đang bổ sung kiểm xưởng',
              summary: 'Chưa đủ điều kiện xuất bản công khai',
              keyCapabilities: [],
              address: 'Hà Nội'
            },
            profileLastUpdatedAt: '2026-03-01T00:00:00Z'
          }
        ]
      },
      // Historical Edition (Section 5: Do not overwrite old editions)
      {
        id: 'ED-DP-2025-V2',
        catalogueId: 'CAT-DONG-PHUC-2026',
        editionCode: 'ED-2025-V2',
        editionName: 'Kỷ Yếu Năng Lực Cung Ứng May Mặc Mùa Thu 2025 (Lưu trữ)',
        publicationDate: '2025-09-20',
        onlinePublishedAt: '2025-09-15T08:00:00Z',
        printStatus: 'PRINTED',
        distributionStatus: 'COMPLETED',
        plannedPrintQuantity: 1000,
        confirmedPrintQuantity: 1000,
        distributedQuantity: 980,
        fileAssetId: 'FILE-CAT-DP-2025-PDF',
        fileUrl: '/files/catalogues/proser-catalogue-2025.pdf',
        fileSize: '6.5 MB',
        pageCount: 28,
        status: 'ARCHIVED',
        format: 'BOTH',
        entriesCount: 18,
        distributionBatches: [],
        metrics: {
          printedConfirmed: 1000,
          distributedConfirmed: 980,
          qrScans: 2840,
          profileVisits: 1890,
          contactRequests: 74,
          requirementsCreated: 29
        }
      }
    ]
  },
  {
    id: 'CAT-EXPO-DONG-NAI-2026',
    slug: 'catalogue-ngay-hoi-chuoi-cung-ung-dong-nai-2026',
    title: 'Kỷ Yếu & Catalogue Nhà Cung Ứng: Ngày Hội Chuỗi Cung Ứng Đồng Nai 2026',
    shortDescription: 'Tập hợp 120+ nhà cung cấp cơ khí chính xác, tự động hóa, bao bì, xử lý bề mặt và logistics phục vụ 32 khu công nghiệp trọng điểm tỉnh Đồng Nai.',
    catalogueType: 'PROGRAM_CATALOGUE',
    categoryId: 'co-khi-che-tao',
    categoryName: 'Cơ Khí, Tự Động Hóa & Phụ Trợ',
    keywordClusterId: 'gia-cong-co-khi-dong-nai',
    topic: 'Kỷ Yếu Kết Nối Doanh Nghiệp Chuỗi Cung Ứng Vùng Trọng Điểm Đồng Nai',
    provinceId: 'dong-nai',
    provinceName: 'Tỉnh Đồng Nai',
    industrialParkId: 'kcn-nhon-trach-1',
    industrialParkName: 'KCN Nhơn Trạch, KCN Amata & KCN Long Thành',
    programId: 'nhon-trach-long-thanh',
    programTitle: 'Ngày Hội Kết Nối Chuỗi Cung Ứng Vùng Nhơn Trạch - Long Thành 2026',
    publisherOrganizationId: 'ORG-AMATA-003',
    publisherName: 'Sở Công Thương Đồng Nai & Ban Tổ Chức CCU Expo',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    status: 'PRINTED',
    publishable: true,
    owner: 'Đặng Tuấn Kiệt (Head of Matchmaking Desk)',
    nextAction: 'Phát hành tại bàn đón tiếp lễ khai mạc ngày hội và phân phối 800 cuốn',
    nextActionAt: '2026-04-12T07:30:00Z',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-03-24T16:00:00Z',
    currentEditionId: 'ED-EXPO-DN-2026-V1',
    editions: [
      {
        id: 'ED-EXPO-DN-2026-V1',
        catalogueId: 'CAT-EXPO-DONG-NAI-2026',
        editionCode: 'ED-2026-EXPO-01',
        editionName: 'Kỷ Yếu Đại Biểu & Buyer Chính Thức',
        publicationDate: '2026-03-20',
        onlinePublishedAt: '2026-03-18T10:00:00Z',
        printStatus: 'PRINTED',
        distributionStatus: 'CONFIRMED',
        plannedPrintQuantity: 2000,
        confirmedPrintQuantity: 1200,
        distributedQuantity: 950,
        fileAssetId: 'FILE-EXPO-DN-PDF',
        fileUrl: '/files/catalogues/expo-dong-nai-2026.pdf',
        fileSize: '14.2 MB',
        pageCount: 52,
        status: 'PRINTED',
        format: 'BOTH',
        commercialBreakdown: {
          contentFee: 25000000,
          sponsoredPlacementFee: 12000000,
          printingCostPerCopy: 58000,
          distributionCost: 6000000,
          currency: 'VND'
        },
        distributionScopeSummary: 'Phát tay tại sảnh đại biểu, trao tặng các đoàn thu mua FDI Nhật Bản, Hàn Quốc và Đài Loan tham dự sự kiện.',
        distributionBatches: [
          {
            id: 'BATCH-EXPO-01',
            channel: 'EXPO_TRADE_FAIR',
            channelLabel: 'Bàn Đăng Ký Đại Biểu VIP & Buyer Lounge',
            location: 'Trung tâm Hội nghị Golden Palace, TP. Biên Hòa',
            plannedQuantity: 1000,
            actualQuantity: 950,
            distributedAt: '2026-03-21',
            receiverOrganizationId: 'ORG-AMATA-003',
            receiverName: 'Đoàn Buyer FDI và Ban Quản Lý KCN',
            responsibleUserId: 'USER-KIET-002',
            responsibleUserName: 'Đặng Tuấn Kiệt',
            evidenceNote: 'Đã phát 950 bộ kèm túi quà tặng hội nghị',
            status: 'COMPLETED'
          }
        ],
        metrics: {
          printedConfirmed: 1200,
          distributedConfirmed: 950,
          qrScans: 3100,
          profileVisits: 2240,
          contactRequests: 86,
          requirementsCreated: 31
        },
        entries: [
          {
            id: 'ENTRY-EXPO-PROSER',
            catalogueEditionId: 'ED-EXPO-DN-2026-V1',
            organizationId: 'ORG-PROSER-001',
            organizationName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
            approvalStatus: 'APPROVED',
            sponsorPlacementType: 'FOUNDING_PARTNER_ENTITLEMENT',
            sponsorLabel: 'NHÀ TÀI TRỢ VÀNG',
            isIncludedInFoundingPartner: true,
            canonicalUrl: '/doanh-nghiep/chuyen-gia-dong-phuc-proser',
            qrDestinationUrl: 'https://chuoicungung.com/doanh-nghiep/chuyen-gia-dong-phuc-proser?utm_source=catalogue&utm_medium=qr&edition=ED-EXPO-DN-2026-V1&entry=ENTRY-EXPO-PROSER',
            contentSnapshot: {
              title: 'Proser - Nhà Cung Ứng Đồng Phục Trọng Điểm KCN Đông Nam Bộ',
              summary: 'Nhà máy đạt chuẩn cung ứng đồng phục nhà xưởng, đồ phòng sạch và áo thun sự kiện cho hơn 300 đối tác công nghiệp.',
              keyCapabilities: ['Chuyền may công suất lớn', 'Đáp ứng đơn hàng gấp 7 ngày'],
              address: 'KCN Hiệp Phước, TP.HCM & VSIP 1 Bình Dương'
            },
            profileLastUpdatedAt: '2026-03-28T10:15:00Z'
          },
          {
            id: 'ENTRY-EXPO-TAHO',
            catalogueEditionId: 'ED-EXPO-DN-2026-V1',
            organizationId: 'ORG-TAHOMART-002',
            organizationName: 'Công ty Cổ phần Tập đoàn TAHOMART Việt Nam',
            approvalStatus: 'APPROVED',
            sponsorPlacementType: 'FOUNDING_PARTNER_ENTITLEMENT',
            sponsorLabel: 'ĐỐI TÁC SÁNG LẬP',
            isIncludedInFoundingPartner: true,
            canonicalUrl: '/doanh-nghiep/tap-doan-tahomart-viet-nam',
            qrDestinationUrl: 'https://chuoicungung.com/doanh-nghiep/tap-doan-tahomart-viet-nam?utm_source=catalogue&utm_medium=qr&edition=ED-EXPO-DN-2026-V1&entry=ENTRY-EXPO-TAHO',
            contentSnapshot: {
              title: 'Tahomart - Quà Tặng Doanh Nghiệp & Phúc Lợi Công Nhân KCN',
              summary: 'Giải pháp giỏ quà Tết, hộp quà tri ân đóng màng co nhiệt tự động. Cung cấp thực phẩm nông sản sấy thăng hoa cho căng tin nhà máy.',
              keyCapabilities: ['Đóng màng co nhiệt 9:16', 'Suất ăn công nghiệp sạch'],
              address: 'Hà Nội & Phố Nối A Hưng Yên'
            },
            profileLastUpdatedAt: '2026-03-22T09:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'CAT-KCN-HIEP-PHUOC-2026',
    slug: 'catalogue-nha-cung-ung-kcn-hiep-phuoc-2026',
    title: 'Sổ Tay & E-Catalogue Nhà Cung Ứng Dịch Vụ Công Nghiệp KCN Hiệp Phước 2026',
    shortDescription: 'Danh bạ số tích hợp QR Code dành cho các doanh nghiệp cơ khí chế tạo, kho lạnh, logistics cảng biển và cung ứng vật tư kỹ thuật tại KCN Hiệp Phước (Nhà Bè, TP.HCM).',
    catalogueType: 'INDUSTRIAL_PARK_CATALOGUE',
    categoryId: 'dich-vu-cong-nghiep',
    categoryName: 'Dịch Vụ & Hạ Tầng Công Nghiệp',
    topic: 'Cung Ứng Dịch Vụ Phụ Trợ, Cơ Khí & Cảng Biển KCN Hiệp Phước',
    provinceId: 'ho-chi-minh',
    provinceName: 'TP. Hồ Chí Minh',
    industrialParkId: 'kcn-hiep-phuoc',
    industrialParkName: 'Khu Công Nghiệp Hiệp Phước (TP.HCM)',
    isConfirmedRelation: true, // Section 24: KCN confirmed relation
    publisherOrganizationId: 'ORG-HIEP-PHUOC',
    publisherName: 'Công ty Cổ phần KCN Hiệp Phước & CCU Network',
    coverUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    status: 'PUBLISHED_DIGITAL', // Digital-first workflow (Section 11)
    publishable: true,
    owner: 'Trần Văn Hải (Chuyên viên Điều phối Phụ trợ)',
    nextAction: 'Chờ thẩm định ngân sách in ấn 500 bản phát tay quý 2',
    nextActionAt: '2026-04-15T10:00:00Z',
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-03-26T11:00:00Z',
    currentEditionId: 'ED-HP-2026-V1',
    editions: [
      {
        id: 'ED-HP-2026-V1',
        catalogueId: 'CAT-KCN-HIEP-PHUOC-2026',
        editionCode: 'ED-2026-DIGITAL-01',
        editionName: 'Bản Số Tương Tác E-Catalogue (Digital First)',
        publicationDate: '2026-03-12',
        onlinePublishedAt: '2026-03-12T09:00:00Z',
        printStatus: 'NOT_PRINTED', // Section 11: Online version exists before print
        distributionStatus: 'CONFIRMED',
        plannedPrintQuantity: 500,
        confirmedPrintQuantity: 0,
        distributedQuantity: 0,
        fileAssetId: null,
        fileUrl: null,
        fileSize: null,
        pageCount: 30,
        status: 'PUBLISHED_DIGITAL',
        format: 'ONLINE_ONLY',
        distributionScopeSummary: 'Phát hành trực tuyến trên website CCU, quét mã QR tại các bảng tin điện tử KCN Hiệp Phước.',
        distributionBatches: [],
        metrics: {
          printedConfirmed: 0,
          distributedConfirmed: 0,
          qrScans: 850,
          profileVisits: 620,
          contactRequests: 19,
          requirementsCreated: 6
        },
        entries: [
          {
            id: 'ENTRY-HP-PROSER',
            catalogueEditionId: 'ED-HP-2026-V1',
            organizationId: 'ORG-PROSER-001',
            organizationName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
            approvalStatus: 'APPROVED',
            sponsorPlacementType: 'ORGANIC',
            canonicalUrl: '/doanh-nghiep/chuyen-gia-dong-phuc-proser',
            qrDestinationUrl: 'https://chuoicungung.com/doanh-nghiep/chuyen-gia-dong-phuc-proser?utm_source=catalogue&utm_medium=qr&edition=ED-HP-2026-V1&entry=ENTRY-HP-PROSER',
            contentSnapshot: {
              title: 'Nhà Máy May Đồng Phục & Phòng Sạch Proser Hiệp Phước',
              summary: 'Nhà xưởng đặt tại Lô A, KCN Hiệp Phước. Cung cấp giải pháp bảo hộ lao động cho hơn 40 nhà máy trong cùng phân khu cảng.',
              keyCapabilities: ['Giao hàng 24h trong KCN', 'Bảo hành đường may trọn đời'],
              address: 'KCN Hiệp Phước, Nhà Bè, TP.HCM'
            },
            profileLastUpdatedAt: '2026-03-28T10:15:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'CAT-HAMEE-MECH-2026',
    slug: 'ky-yeu-cung-ung-hamee-2026',
    title: 'Kỷ Yếu Năng Lực Cơ Khí - Điện & Tự Động Hóa HAMEE 2026',
    shortDescription: 'Ấn phẩm giới thiệu 85 doanh nghiệp hội viên sản xuất khuôn mẫu, gia công CNC, dập kim loại, tủ điện công nghiệp và giải pháp tự động hóa nhà máy.',
    catalogueType: 'ASSOCIATION_CATALOGUE',
    categoryId: 'co-khi-che-tao',
    categoryName: 'Cơ Khí Chế Tạo & Điện Công Nghiệp',
    topic: 'Kỷ Yếu Doanh Nghiệp Hội Viên Hội Cơ Khí - Điện TP.HCM (HAMEE)',
    provinceId: 'ho-chi-minh',
    provinceName: 'TP. Hồ Chí Minh & Các Tỉnh Lân Cận',
    associationId: 'hamee',
    associationName: 'Hội Doanh Nghiệp Cơ Khí - Điện TP.HCM (HAMEE)',
    publisherOrganizationId: 'ORG-HAME-005',
    publisherName: 'Ban Thường Vụ HAMEE & Bàn Điều Phối CCU',
    coverUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    status: 'DISTRIBUTING',
    publishable: true,
    owner: 'Lê Hoàng Nam (Ban Thư ký Hiệp hội)',
    nextAction: 'Gửi ấn phẩm tới 50 nhà mua hàng thuộc đoàn công tác Nhật Bản (JETRO)',
    nextActionAt: '2026-04-08T14:00:00Z',
    createdAt: '2026-01-25T08:00:00Z',
    updatedAt: '2026-03-25T15:00:00Z',
    currentEditionId: 'ED-HAMEE-2026-V1',
    editions: [
      {
        id: 'ED-HAMEE-2026-V1',
        catalogueId: 'CAT-HAMEE-MECH-2026',
        editionCode: 'ED-HAMEE-2026-01',
        editionName: 'Kỷ Yếu Hội Viên Chính Thức 2026',
        publicationDate: '2026-03-01',
        onlinePublishedAt: '2026-02-28T08:00:00Z',
        printStatus: 'PRINTED',
        distributionStatus: 'IN_PROGRESS',
        plannedPrintQuantity: 1000,
        confirmedPrintQuantity: 600,
        distributedQuantity: 480,
        fileAssetId: 'FILE-HAMEE-PDF',
        fileUrl: '/files/catalogues/hamee-catalogue-2026.pdf',
        fileSize: '11.8 MB',
        pageCount: 44,
        status: 'DISTRIBUTING',
        format: 'BOTH',
        distributionScopeSummary: 'Phát hành tại Đại hội thường niên HAMEE, gửi các văn phòng xúc tiến thương mại quốc tế.',
        distributionBatches: [
          {
            id: 'BATCH-HAMEE-01',
            channel: 'ASSOCIATION_MEETING',
            channelLabel: 'Đại Hội Thường Niên & Diễn Đàn Cơ Khí',
            location: 'Khách sạn Rex Sài Gòn, Quận 1, TP.HCM',
            plannedQuantity: 500,
            actualQuantity: 480,
            distributedAt: '2026-03-05',
            receiverOrganizationId: 'ORG-HAME-005',
            receiverName: 'Đại Biểu Doanh Nghiệp Hội Viên',
            responsibleUserId: 'USER-HAMEE-ADMIN',
            responsibleUserName: 'Lê Hoàng Nam',
            evidenceNote: 'Đã ký nhận danh sách 480 cuốn',
            status: 'COMPLETED'
          }
        ],
        metrics: {
          printedConfirmed: 600,
          distributedConfirmed: 480,
          qrScans: 1950,
          profileVisits: 1410,
          contactRequests: 42,
          requirementsCreated: 18
        },
        entries: [
          {
            id: 'ENTRY-HAMEE-01',
            catalogueEditionId: 'ED-HAMEE-2026-V1',
            organizationId: 'ORG-DENSO-VN',
            organizationName: 'Công ty TNHH Denso Việt Nam',
            approvalStatus: 'APPROVED',
            sponsorPlacementType: 'STRATEGIC_CO_HOST',
            sponsorLabel: 'ĐỐI TÁC CHIẾN LƯỢC',
            canonicalUrl: '/nha-may/nha-may-denso-viet-nam-thang-long',
            qrDestinationUrl: 'https://chuoicungung.com/nha-may/nha-may-denso-viet-nam-thang-long?utm_source=catalogue&utm_medium=qr&edition=ED-HAMEE-2026-V1&entry=ENTRY-HAMEE-01',
            contentSnapshot: {
              title: 'Denso Việt Nam - Linh Kiện Cơ Khí Ô Tô & Tự Động Hóa Chính Xác',
              summary: 'Nhà máy quy chuẩn toàn cầu chuyên linh kiện điện cơ ô tô, dây chuyền lắp ráp tự động và hỗ trợ chuyển giao công nghệ cho doanh nghiệp phụ trợ nội địa.',
              keyCapabilities: ['Gia công cơ khí vi mô', 'Chuẩn IATF 16949'],
              address: 'KCN Thăng Long, Đông Anh, Hà Nội'
            },
            profileLastUpdatedAt: '2026-03-27T08:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'CAT-FOOD-AGRI-2026',
    slug: 'catalogue-nong-san-che-bien-qua-tang-doanh-nghiep-2026',
    title: 'Catalogue Nông Sản Chế Biến & Giải Pháp Quà Tặng Doanh Nghiệp B2B 2026',
    shortDescription: 'Tuyển chọn các nhà máy chế biến thực phẩm sạch đạt chứng nhận HACCP, ISO 22000, Halal; cung ứng suất ăn công nghiệp, hộp quà tết công nhân và nông sản xuất khẩu.',
    catalogueType: 'CATEGORY_CATALOGUE',
    categoryId: 'nong-san-thuc-pham',
    categoryName: 'Nông Sản & Thực Phẩm Chế Biến',
    topic: 'Nông Sản Chế Biến, Đóng Hộp & Quà Tặng Doanh Nghiệp Phúc Lợi B2B',
    provinceId: 'ha-noi',
    provinceName: 'Toàn Quốc (Hà Nội, ĐBSCL & Đông Nam Bộ)',
    publisherOrganizationId: 'ORG-TAHOMART-002',
    publisherName: 'Tập đoàn TAHOMART Việt Nam & CCU Network',
    coverUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    status: 'DISTRIBUTING',
    publishable: true,
    owner: 'Nguyễn Bích Thủy (Ban Dự Án Nông Sản)',
    nextAction: 'Chuẩn bị danh mục quà tặng công đoàn cho các KCN Bình Dương',
    nextActionAt: '2026-04-20T10:00:00Z',
    createdAt: '2026-02-18T08:00:00Z',
    updatedAt: '2026-03-22T14:00:00Z',
    currentEditionId: 'ED-FOOD-2026-V1',
    editions: [
      {
        id: 'ED-FOOD-2026-V1',
        catalogueId: 'CAT-FOOD-AGRI-2026',
        editionCode: 'ED-TAHO-2026-01',
        editionName: 'Catalogue Quà Tặng B2B & Nông Sản Xuất Khẩu 2026',
        publicationDate: '2026-02-25',
        onlinePublishedAt: '2026-02-22T09:00:00Z',
        printStatus: 'PRINTED',
        distributionStatus: 'COMPLETED',
        plannedPrintQuantity: 500,
        confirmedPrintQuantity: 500,
        distributedQuantity: 500,
        fileAssetId: 'FILE-TAHO-PDF',
        fileUrl: '/files/catalogues/tahomart-catalogue-2026.pdf',
        fileSize: '6.2 MB',
        pageCount: 32,
        status: 'DISTRIBUTING',
        format: 'BOTH',
        distributionScopeSummary: 'Gửi phòng Nhân sự, Công đoàn các nhà máy FDI tại Hà Nội, Hưng Yên và Đồng Nai.',
        distributionBatches: [
          {
            id: 'BATCH-FOOD-01',
            channel: 'BUYER_MATCHING_BAG',
            channelLabel: 'Túi Quà Tặng Trực Tiếp Buyer Doanh Nghiệp',
            location: 'Các khu công nghiệp Phố Nối A & Thăng Long',
            plannedQuantity: 500,
            actualQuantity: 500,
            distributedAt: '2026-02-28',
            receiverOrganizationId: 'ORG-TAHOMART-002',
            receiverName: 'Công Đoàn & Phòng Thu Mua Nhà Máy',
            responsibleUserId: 'USER-TAHO-ADMIN',
            responsibleUserName: 'Nguyễn Bích Thủy',
            evidenceNote: 'Đã hoàn tất bàn giao 500 cuốn',
            status: 'COMPLETED'
          }
        ],
        metrics: {
          printedConfirmed: 500,
          distributedConfirmed: 500,
          qrScans: 1650,
          profileVisits: 1120,
          contactRequests: 49,
          requirementsCreated: 15
        },
        entries: [
          {
            id: 'ENTRY-FOOD-TAHO',
            catalogueEditionId: 'ED-FOOD-2026-V1',
            organizationId: 'ORG-TAHOMART-002',
            organizationName: 'Công ty Cổ phần Tập đoàn TAHOMART Việt Nam',
            approvalStatus: 'APPROVED',
            sponsorPlacementType: 'FOUNDING_PARTNER_ENTITLEMENT',
            sponsorLabel: 'ĐỐI TÁC SÁNG LẬP',
            isIncludedInFoundingPartner: true,
            canonicalUrl: '/doanh-nghiep/tap-doan-tahomart-viet-nam',
            qrDestinationUrl: 'https://chuoicungung.com/doanh-nghiep/tap-doan-tahomart-viet-nam?utm_source=catalogue&utm_medium=qr&edition=ED-FOOD-2026-V1&entry=ENTRY-FOOD-TAHO',
            contentSnapshot: {
              title: 'Tahomart - Hệ Thống Nông Sản Chế Biến & Quà Tặng Doanh Nghiệp Chuẩn Quốc Tế',
              summary: 'Chuyên cung cấp giỏ quà Tết, trái cây sấy thăng hoa, nông sản đóng gói theo thương hiệu riêng (OEM/Private Label) đạt tiêu chuẩn HACCP và FDA.',
              keyCapabilities: ['Đóng màng co nhiệt tự động', 'Xưởng sấy lạnh Hưng Yên'],
              address: 'Nam Từ Liêm, Hà Nội & KCN Phố Nối A, Hưng Yên'
            },
            profileLastUpdatedAt: '2026-03-22T09:00:00Z'
          },
          {
            id: 'ENTRY-FOOD-MEKONG',
            catalogueEditionId: 'ED-FOOD-2026-V1',
            organizationId: 'ORG-MEKONG-FOOD-004',
            organizationName: 'Công ty Cổ phần Thực Phẩm Xanh Mekong',
            approvalStatus: 'APPROVED',
            sponsorPlacementType: 'ORGANIC',
            canonicalUrl: '/doanh-nghiep/thuc-pham-xanh-mekong',
            qrDestinationUrl: 'https://chuoicungung.com/doanh-nghiep/thuc-pham-xanh-mekong?utm_source=catalogue&utm_medium=qr&edition=ED-FOOD-2026-V1&entry=ENTRY-FOOD-MEKONG',
            contentSnapshot: {
              title: 'Thực Phẩm Xanh Mekong - Cung Ứng Nông Sản Sạch & Kho Lạnh KCN Long Hậu',
              summary: 'Nhà máy chế biến và hệ thống kho lạnh -18 độ C tại KCN Long Hậu. Cung ứng thủy hải sản và rau quả sơ chế cho chuỗi siêu thị và bếp ăn công nghiệp.',
              keyCapabilities: ['Kho lạnh -18C chuẩn ISO 22000', 'Chứng nhận HACCP'],
              address: 'KCN Long Hậu, Cần Giuộc, Tỉnh Long An'
            },
            profileLastUpdatedAt: '2026-03-15T10:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'CAT-TOP50-PACKAGING-2026',
    slug: 'top-50-nha-cung-ung-bao-bi-in-an-xanh-2026',
    title: 'Bạch Thư & Top 50 Nhà Cung Ứng Bao Bì, Thùng Carton & In Ấn Xanh 2026',
    shortDescription: 'Bộ hồ sơ chọn lọc 50 nhà máy sản xuất thùng carton sóng, màng bọc phân hủy sinh học, in offset cao cấp và giải pháp bao bì tiêu chuẩn xuất khẩu Hoa Kỳ/EU.',
    catalogueType: 'SUPPLIER_SHORTLIST_CATALOGUE',
    categoryId: 'bao-bi-dong-goi',
    categoryName: 'Bao Bì & In Ấn Đóng Gói',
    topic: 'Top 50 Nhà Máy Bao Bì Thân Thiện Môi Trường & Đáp Ứng ESG',
    provinceId: 'binh-duong',
    provinceName: 'Bình Dương, Đồng Nai & TP.HCM',
    publisherOrganizationId: 'ORG-CCU-EDITORIAL',
    publisherName: 'Hội Đồng Thẩm Định Độc Lập CCU & Chuyên Gia Chuỗi Cung Ứng',
    coverUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    status: 'DIGITAL_PREVIEW',
    publishable: true,
    owner: 'Nguyễn Văn Đạt (Lead Analyst)',
    nextAction: 'Hoàn thiện duyệt 5 nhà máy cuối trước khi chốt bản in 1.200 cuốn',
    nextActionAt: '2026-04-18T16:00:00Z',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-27T10:00:00Z',
    currentEditionId: 'ED-PACK-2026-PREVIEW',
    editions: [
      {
        id: 'ED-PACK-2026-PREVIEW',
        catalogueId: 'CAT-TOP50-PACKAGING-2026',
        editionCode: 'ED-TOP50-PACK-01',
        editionName: 'Bản Số Xem Trước (Digital Preview)',
        publicationDate: '2026-04-01',
        onlinePublishedAt: '2026-03-27T08:00:00Z',
        printStatus: 'PRINT_PLANNED',
        distributionStatus: 'PLANNED',
        plannedPrintQuantity: 1200,
        confirmedPrintQuantity: 0,
        distributedQuantity: 0,
        fileAssetId: null,
        fileUrl: null,
        fileSize: null,
        pageCount: 40,
        status: 'DIGITAL_PREVIEW',
        format: 'ONLINE_ONLY',
        distributionScopeSummary: 'Dự kiến phát hành tại Triển lãm Chuỗi Cung Ứng Quốc Tế và các diễn đàn chuyển đổi xanh.',
        distributionBatches: [],
        metrics: {
          printedConfirmed: 0,
          distributedConfirmed: 0,
          qrScans: 420,
          profileVisits: 310,
          contactRequests: 11,
          requirementsCreated: 3
        },
        entries: [
          {
            id: 'ENTRY-PACK-01',
            catalogueEditionId: 'ED-PACK-2026-PREVIEW',
            organizationId: 'ORG-TANTIEN-004',
            organizationName: 'Công ty TNHH Nhựa Kỹ Thuật Tân Tiến',
            approvalStatus: 'APPROVED',
            sponsorPlacementType: 'SPONSORED',
            sponsorLabel: 'ĐỐI TÁC TIÊU BIỂU',
            canonicalUrl: '/doanh-nghiep/nhua-ky-thuat-tan-tien',
            qrDestinationUrl: 'https://chuoicungung.com/doanh-nghiep/nhua-ky-thuat-tan-tien?utm_source=catalogue&utm_medium=qr&edition=ED-PACK-2026-PREVIEW&entry=ENTRY-PACK-01',
            contentSnapshot: {
              title: 'Nhựa Tân Tiến - Khay Nhựa Định Hình & Bao Bì Kỹ Thuật ESD',
              summary: 'Nhà máy tại KCN VSIP 1 Bình Dương chuyên sản xuất khay linh kiện điện tử, thùng Danpla chống tĩnh điện và bao bì nhựa kỹ thuật cao.',
              keyCapabilities: ['Khuôn ép chính xác 350-850T', 'Phòng sạch Class 10.000'],
              address: 'KCN VSIP 1, Thuận An, Tỉnh Bình Dương'
            },
            profileLastUpdatedAt: '2026-03-25T11:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'CAT-ALL-SUPPLIERS-2026',
    slug: 'tong-hop-nha-cung-ung-viet-nam-2026',
    title: 'E-Catalogue Tổng Hợp: Bản Đồ Cung Ứng Công Nghiệp & KCN Việt Nam 2026',
    shortDescription: 'Ấn phẩm số toàn diện hệ thống hóa hơn 1.200 nhà cung cấp và 14.000 nhà máy sản xuất dọc theo 6 giai đoạn vòng đời công nghiệp tại 63 tỉnh thành.',
    catalogueType: 'GENERAL_SUPPLIER_CATALOGUE',
    categoryId: 'tong-hop',
    categoryName: 'Tổng Hợp Hệ Sinh Thái',
    topic: 'Bản Đồ Năng Lực Cung Ứng & Kết Nối KCN Toàn Quốc',
    provinceId: 'all',
    provinceName: 'Toàn Quốc (63 Tỉnh Thành)',
    publisherOrganizationId: 'ORG-CCU-MASTER',
    publisherName: 'Hạ Tầng Dữ Liệu Quốc Gia CHUOICUNGUNG.COM',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    status: 'PUBLISHED_DIGITAL',
    publishable: true,
    owner: 'Ban Biên Tập CCU',
    nextAction: 'Cập nhật định kỳ hồ sơ doanh nghiệp đã được xác thực KYC Kim Cương',
    nextActionAt: '2026-04-30T17:00:00Z',
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-03-28T09:00:00Z',
    currentEditionId: 'ED-ALL-2026-V1',
    editions: [
      {
        id: 'ED-ALL-2026-V1',
        catalogueId: 'CAT-ALL-SUPPLIERS-2026',
        editionCode: 'ED-GLOBAL-2026-01',
        editionName: 'Bản Số Tương Tác Trực Tuyến Toàn Quốc',
        publicationDate: '2026-01-15',
        onlinePublishedAt: '2026-01-15T08:00:00Z',
        printStatus: 'NOT_PRINTED',
        distributionStatus: 'CONFIRMED',
        plannedPrintQuantity: 0,
        confirmedPrintQuantity: 0,
        distributedQuantity: 0,
        fileAssetId: null,
        fileUrl: null,
        fileSize: null,
        pageCount: 120,
        status: 'PUBLISHED_DIGITAL',
        format: 'ONLINE_ONLY',
        distributionScopeSummary: 'Truy cập trực tuyến không giới hạn qua web và app dành cho các bộ phận mua sắm B2B.',
        distributionBatches: [],
        metrics: {
          printedConfirmed: 0,
          distributedConfirmed: 0,
          qrScans: 8900,
          profileVisits: 6420,
          contactRequests: 210,
          requirementsCreated: 78
        },
        entries: [
          {
            id: 'ENTRY-ALL-PROSER',
            catalogueEditionId: 'ED-ALL-2026-V1',
            organizationId: 'ORG-PROSER-001',
            organizationName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
            approvalStatus: 'APPROVED',
            sponsorPlacementType: 'FOUNDING_PARTNER_ENTITLEMENT',
            sponsorLabel: 'ĐỐI TÁC SÁNG LẬP',
            canonicalUrl: '/doanh-nghiep/chuyen-gia-dong-phuc-proser',
            qrDestinationUrl: 'https://chuoicungung.com/doanh-nghiep/chuyen-gia-dong-phuc-proser?utm_source=catalogue&utm_medium=qr&edition=ED-ALL-2026-V1&entry=ENTRY-ALL-PROSER',
            contentSnapshot: {
              title: 'Proser - Nhà Cung Ứng May Mặc & Đồng Phục Doanh Nghiệp',
              summary: 'Nhà cung ứng tiêu biểu giai đoạn Pha 4 (Sản xuất gia công). Sở hữu 2 nhà máy tại TP.HCM và Bình Dương.',
              keyCapabilities: ['Đồng phục công nghiệp', 'Dệt kháng khuẩn'],
              address: 'TP.HCM'
            },
            profileLastUpdatedAt: '2026-03-28T10:15:00Z'
          }
        ]
      }
    ]
  }
];

// ----------------------------------------------------------------------------
// 3. UPCOMING EDITIONS CALL FOR PROFILES (SPEC SECTION 25: THAM GIA ẤN PHẨM TIẾP THEO)
// ----------------------------------------------------------------------------
export const UPCOMING_EDITIONS_CALL_FOR_PAPERS = [
  {
    id: 'UPCOMING-ED-NORTH-2026',
    title: 'Catalogue Nhà Cung Ứng Phụ Trợ & Công Nghệ Cao KCN Phía Bắc - Q3/2026',
    scope: 'KCN Bắc Ninh, Hải Phòng, Hà Nội, Vĩnh Phúc & Thái Nguyên',
    categoryTarget: 'Cơ khí chính xác, Khuôn mẫu, Ép nhựa kỹ thuật & Tự động hóa',
    deadline: '30/06/2026',
    publicationTargetDate: '15/08/2026',
    plannedPrintRun: 1500,
    targetDistributionEvents: 'Diễn đàn Chuỗi Cung Ứng Vùng Thủ Đô & Hội chợ Điện tử Quốc tế NEPCON',
    requirements: [
      'Có nhà máy/phân xưởng sản xuất thực tế tại Việt Nam (có kiểm xưởng hoặc ảnh đối chiếu)',
      'Hồ sơ pháp lý minh bạch, mã số thuế hợp lệ, không nợ đọng thuế tiêu cực',
      'Đạt tối thiểu 01 chứng nhận quản lý chất lượng (ISO 9001, IATF 16949 hoặc tương đương)',
      'Cam kết cung cấp mẫu vật phẩm và báo giá theo quy chuẩn B2B khi có yêu cầu từ Buyer'
    ],
    editorialProcess: [
      'Bước 1: Tiếp nhận hồ sơ & thẩm định sơ bộ tính đầy đủ pháp lý (3 ngày làm việc)',
      'Bước 2: Chuẩn hóa dữ liệu năng lực, quy cách máy móc và thẩm định bản quyền ảnh xưởng',
      'Bước 3: Xuất bản Bản Số Xem Trước (Digital Preview) và gửi doanh nghiệp duyệt (Client Review)',
      'Bước 4: Phê duyệt chính thức (Approved) ➔ Gắn mã QR định danh và xuất bản trên E-Catalogue',
      'Bước 5: Đưa vào danh sách in ấn thành phẩm khi hội đồng xuất bản ký lệnh in'
    ],
    pricingAndEntitlements: {
      standardFee: '12.000.000 VNĐ / Doanh nghiệp',
      foundingPartnerEntitlement: 'MIỄN PHÍ 100% (Đã bao gồm trong Quyền lợi Hợp đồng Đối tác Sáng lập - INCLUDED_IN_FOUNDING_PARTNER)',
      includes: '01 Trang hồ sơ chuẩn hóa song ngữ + 20 cuốn in thành phẩm gửi tận nơi + Trưng bày tại Bàn Giao Thương CCU'
    },
    status: 'ACCEPTING_SUBMISSIONS'
  },
  {
    id: 'UPCOMING-ED-GREEN-ESG-2026',
    title: 'Bạch Thư & E-Catalogue Nhà Máy Chuyển Đổi Xanh & Tiết Kiệm Năng Lượng 2026',
    scope: 'Toàn quốc (Ưu tiên các nhà máy KCN Sinh Thái)',
    categoryTarget: 'Năng lượng mặt trời mái nhà, Xử lý nước thải, Tái chế vật liệu & Chứng chỉ Carbon',
    deadline: '15/07/2026',
    publicationTargetDate: '20/09/2026',
    plannedPrintRun: 1000,
    targetDistributionEvents: 'Hội nghị Bàn tròn ESG Doanh Nghiệp FDI & Diễn đàn Sản Xuất Xanh',
    requirements: [
      'Có giải pháp hoặc dịch vụ giảm phát thải CO2, tiết kiệm điện/nước cho nhà xưởng',
      'Có case study hoặc dự án thực tế đã nghiệm thu tại ít nhất 01 khu công nghiệp'
    ],
    editorialProcess: [
      'Thẩm định tiêu chuẩn xanh ➔ Biên tập chuyên sâu ➔ Duyệt bản số ➔ Phát hành điện tử & in ấn'
    ],
    pricingAndEntitlements: {
      standardFee: '15.000.000 VNĐ / Doanh nghiệp',
      foundingPartnerEntitlement: 'MIỄN PHÍ (Theo hạn mức quyền lợi)',
      includes: 'Báo cáo độc lập + Mã QR tương tác + Bài viết chuyên đề trên Cổng thông tin CCU'
    },
    status: 'ACCEPTING_SUBMISSIONS'
  }
];

// ----------------------------------------------------------------------------
// 4. STORAGE HELPERS & DATA ACCESS API
// ----------------------------------------------------------------------------
export function getAllCatalogues(filters = {}) {
  let list = [];
  try {
    const raw = safeGetItem(STORAGE_KEYS.CATALOGUES);
    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = [...SEED_MASTER_CATALOGUES];
    }
  } catch (e) {
    list = [...SEED_MASTER_CATALOGUES];
  }

  // Filter: Search Term (Section 7)
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(item => {
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchTopic = (item.topic || '').toLowerCase().includes(q);
      const matchDesc = (item.shortDescription || '').toLowerCase().includes(q);
      const matchCategory = (item.categoryName || '').toLowerCase().includes(q);
      const matchProvince = (item.provinceName || '').toLowerCase().includes(q);
      const matchPark = (item.industrialParkName || '').toLowerCase().includes(q);
      const matchPublisher = (item.publisherName || '').toLowerCase().includes(q);
      const matchProgram = (item.programTitle || '').toLowerCase().includes(q);

      // Search in approved supplier entries
      const currentEd = (item.editions || []).find(e => e.id === item.currentEditionId) || item.editions?.[0];
      const matchEntry = (currentEd?.entries || []).some(entry => 
        entry.approvalStatus === 'APPROVED' && (entry.organizationName || '').toLowerCase().includes(q)
      );

      return matchTitle || matchTopic || matchDesc || matchCategory || matchProvince || matchPark || matchPublisher || matchProgram || matchEntry;
    });
  }

  // Filter: Category / Topic (Section 8)
  if (filters.categoryId && filters.categoryId !== 'ALL') {
    list = list.filter(item => item.categoryId === filters.categoryId);
  }

  // Filter: Catalogue Type (Section 8 & 21)
  if (filters.catalogueType && filters.catalogueType !== 'ALL') {
    list = list.filter(item => item.catalogueType === filters.catalogueType);
  }

  // Filter: Province / Region (Section 8)
  if (filters.provinceId && filters.provinceId !== 'ALL') {
    list = list.filter(item => item.provinceId === filters.provinceId || item.provinceId === 'all');
  }

  // Filter: Industrial Park (Section 8)
  if (filters.industrialParkId && filters.industrialParkId !== 'ALL') {
    list = list.filter(item => item.industrialParkId === filters.industrialParkId);
  }

  // Filter: Format (Section 8: Online / Print / Both)
  if (filters.format && filters.format !== 'ALL') {
    list = list.filter(item => {
      const curEd = item.editions?.find(e => e.id === item.currentEditionId) || item.editions?.[0];
      return curEd?.format === filters.format || curEd?.format === 'BOTH';
    });
  }

  // Filter: Status (Active vs Archived)
  if (filters.status && filters.status !== 'ALL') {
    if (filters.status === 'ARCHIVED') {
      list = list.filter(item => item.status === 'ARCHIVED');
    } else {
      list = list.filter(item => item.status !== 'ARCHIVED');
    }
  }

  return list;
}

export function getCatalogueBySlug(slug) {
  const all = getAllCatalogues();
  return all.find(c => c.slug === slug || c.id === slug) || null;
}

export function getCatalogueById(id) {
  const all = getAllCatalogues();
  return all.find(c => c.id === id) || null;
}

export function saveAllCatalogues(cats) {
  try {
    safeSetItem(STORAGE_KEYS.CATALOGUES, JSON.stringify(cats));
  } catch (e) {}
}

// ----------------------------------------------------------------------------
// 5. PUBLIC ENTRIES SANITIZATION (SPEC SECTION 14 & 50)
// ----------------------------------------------------------------------------
export function getPublicApprovedEntries(catalogueOrEdition) {
  if (!catalogueOrEdition) return [];
  let entries = [];

  if (catalogueOrEdition.entries) {
    entries = catalogueOrEdition.entries;
  } else if (catalogueOrEdition.editions) {
    const curEd = catalogueOrEdition.editions.find(e => e.id === catalogueOrEdition.currentEditionId) || catalogueOrEdition.editions[0];
    entries = curEd?.entries || [];
  }

  // Hard Rule Section 14: Only approved entries appear in public edition!
  return entries.filter(e => e.approvalStatus === 'APPROVED').sort((a, b) => (a.position || 99) - (b.position || 99));
}

// ----------------------------------------------------------------------------
// 6. ADMIN PRINT GATE BLOCKERS CHECK (SPEC SECTION 12 & 47)
// ----------------------------------------------------------------------------
export function checkPrintGate(edition) {
  if (!edition) {
    return { canPrint: false, blockers: ['Không tìm thấy ấn bản tương ứng'] };
  }

  const blockers = [];

  // Check 1: Approved content and approved supplier list
  const approvedEntries = (edition.entries || []).filter(e => e.approvalStatus === 'APPROVED');
  if (approvedEntries.length === 0) {
    blockers.push('Chưa có doanh nghiệp nào được duyệt nội dung chính thức (Approved entries = 0)');
  }

  // Check 2: Budget confirmed
  if (!edition.commercialBreakdown || !edition.commercialBreakdown.printingCostPerCopy) {
    blockers.push('Chưa xác nhận đơn giá in ấn và dự toán ngân sách xuất bản');
  }

  // Check 3: Print quantity confirmed
  if (!edition.confirmedPrintQuantity || edition.confirmedPrintQuantity <= 0) {
    blockers.push('Chưa xác nhận số lượng in thành phẩm thực tế (confirmedPrintQuantity <= 0)');
  }

  // Check 4: Distribution scope & plan confirmed
  if (!edition.distributionBatches || edition.distributionBatches.length === 0) {
    blockers.push('Thiếu kế hoạch phân phối (Chưa thiết lập đợt giao nhận hoặc kênh phân phối cụ thể)');
  }

  // Check 5: Responsible owner
  if (!edition.status || edition.status === 'PLANNING') {
    blockers.push('Ấn bản chưa hoàn thành thẩm định nội dung số (Phải đạt trạng thái APPROVED hoặc PUBLISHED_DIGITAL trước khi in)');
  }

  return {
    canPrint: blockers.length === 0,
    blockers
  };
}

// ----------------------------------------------------------------------------
// 7. QR CODE TRACKING & SCAN ENGINE (SPEC SECTION 17, 18, 19, 40)
// ----------------------------------------------------------------------------
export function generateCatalogueQrDestinationUrl(catalogueId, editionId, entryId, targetSlug) {
  const baseUrl = `https://chuoicungung.com${targetSlug.startsWith('/') ? targetSlug : '/' + targetSlug}`;
  return `${baseUrl}?utm_source=catalogue&utm_medium=qr&catalogue=${catalogueId}&edition=${editionId}&entry=${entryId}&scan_ts=${Date.now()}`;
}

export function trackCatalogueQrScan(catalogueId, editionId, entryId) {
  const scanEvent = {
    id: `SCAN-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    catalogueId,
    editionId,
    entryId,
    scannedAt: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
    // Hard Rule Section 19 & 40: QR Scan != Buyer Need, != Deal
    isQualifiedBuyerNeed: false,
    convertedToRequirement: false
  };

  try {
    const raw = safeGetItem(STORAGE_KEYS.QR_SCANS);
    const scans = raw ? JSON.parse(raw) : [];
    scans.push(scanEvent);
    safeSetItem(STORAGE_KEYS.QR_SCANS, JSON.stringify(scans.slice(-1000))); // Keep last 1000
  } catch (e) {}

  return scanEvent;
}

// ----------------------------------------------------------------------------
// 8. SERVICE REQUEST & PARTICIPATION REGISTRATION (SPEC SECTION 25, 26, 27)
// ----------------------------------------------------------------------------
export function submitCatalogueParticipation(participationData) {
  const submission = {
    id: `CAT-SUB-${Date.now()}`,
    serviceType: 'CATALOGUE_PARTICIPATION',
    targetEditionId: participationData.editionId || 'UPCOMING-ED-NORTH-2026',
    editionTitle: participationData.editionTitle || 'Ấn phẩm sắp tới',
    companyName: participationData.companyName,
    taxCode: participationData.taxCode,
    contactPerson: participationData.contactPerson,
    phone: participationData.phone,
    email: participationData.email,
    category: participationData.category,
    province: participationData.province,
    capabilitiesSummary: participationData.capabilitiesSummary,
    isFoundingPartner: !!participationData.isFoundingPartner,
    // Flow: ServiceRequest -> Review -> Scope -> Quote -> Preparation -> Approval -> Publish (Section 27)
    status: 'SUBMITTED', // Section 27: Form submit != Catalogue approval!
    createdAt: new Date().toISOString()
  };

  try {
    const raw = safeGetItem(STORAGE_KEYS.PARTICIPATION_REQUESTS);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(submission);
    safeSetItem(STORAGE_KEYS.PARTICIPATION_REQUESTS, JSON.stringify(list));
  } catch (e) {}

  // Ghi nhận AuditLog (Section 55 QA 17)
  logCatalogueAudit('CATALOGUE_PARTICIPATION_SUBMITTED', {
    submissionId: submission.id,
    companyName: submission.companyName,
    targetEditionId: submission.targetEditionId
  });

  return submission;
}

export function getAllCatalogueParticipations() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.PARTICIPATION_REQUESTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

// ----------------------------------------------------------------------------
// 9. AUDIT LOGGING (SPEC SECTION 45 & 55 QA 17)
// ----------------------------------------------------------------------------
export function logCatalogueAudit(action, metadata = {}, actor = 'System') {
  const entry = {
    id: `LOG-CAT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action,
    metadata,
    actor,
    timestamp: new Date().toISOString()
  };

  try {
    const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift(entry);
    safeSetItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 500)));
  } catch (e) {}

  return entry;
}

export function getAllCatalogueAuditLogs() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [
    {
      id: 'LOG-CAT-01',
      action: 'CATALOGUE_PUBLISHED_DIGITAL',
      metadata: { catalogueId: 'CAT-DONG-PHUC-2026', editionCode: 'ED-2026-V1' },
      actor: 'Tô Ngọc Dũng',
      timestamp: '2026-03-10T10:00:00Z'
    },
    {
      id: 'LOG-CAT-02',
      action: 'PRINT_BATCH_CONFIRMED',
      metadata: { catalogueId: 'CAT-DONG-PHUC-2026', confirmedCopies: 800 },
      actor: 'Đặng Tuấn Kiệt',
      timestamp: '2026-03-14T15:30:00Z'
    }
  ];
}

// ----------------------------------------------------------------------------
// 10. CATALOGUE B2B CONNECTION REQUEST (SPEC SECTION 40)
// ----------------------------------------------------------------------------
export function submitCatalogueConnectionRequest(data, actor = 'Buyer Partner') {
  const connection = {
    id: `CAT-CONN-${Date.now()}`,
    sourceCatalogueId: data.catalogueId,
    editionId: data.editionId,
    entryId: data.entryId,
    targetOrganizationId: data.targetOrganizationId,
    targetOrganizationName: data.targetOrganizationName,
    requesterName: data.contactName,
    requesterCompany: data.companyName,
    requesterPhone: data.contactPhone, // Kept private in CCU Desk
    requesterEmail: data.contactEmail,
    requirementSummary: data.requirementSummary || 'Yêu cầu kết nối cung ứng xuất phát từ ấn phẩm Catalogue',
    status: 'PENDING_COORDINATION', // Sent to CCU Coordination Desk
    createdAt: new Date().toISOString()
  };

  try {
    const raw = safeGetItem('ccu_catalogue_connections_v1');
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(connection);
    safeSetItem('ccu_catalogue_connections_v1', JSON.stringify(list));
  } catch (e) {}

  logCatalogueAudit('CATALOGUE_CONNECTION_REQUEST_CREATED', {
    connectionId: connection.id,
    catalogueId: data.catalogueId,
    targetOrganizationId: data.targetOrganizationId
  }, actor);

  return connection;
}

export function getAllCatalogueConnectionRequests(catalogueId = null) {
  try {
    const raw = safeGetItem('ccu_catalogue_connections_v1');
    if (raw) {
      const all = JSON.parse(raw);
      if (catalogueId) return all.filter(c => c.sourceCatalogueId === catalogueId);
      return all;
    }
  } catch (e) {}
  return [];
}

