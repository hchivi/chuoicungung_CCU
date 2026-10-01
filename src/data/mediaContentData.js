// ============================================================================
// MASTER MEDIA & CONTENT PROJECTS SERVICE
// PAGE 15: HỒ SƠ & TRUYỀN THÔNG DOANH NGHIỆP
// ROUTE: /dich-vu/truyen-thong-doanh-nghiep
// Chuẩn hóa theo spec 15.txt - CHUOICUNGUNG.COM
// ============================================================================

import { SEED_ORGANIZATIONS } from './organizationsData.js';
import { PROGRAMS_DATA } from './programsData.js';

const STORAGE_KEYS = {
  MEDIA_PROJECTS: 'ccu_media_content_projects_v1',
  MEDIA_ASSETS: 'ccu_media_assets_registry_v1',
  CATALOGUES: 'ccu_catalogues_registry_v1',
  MEDIA_AUDIT_LOGS: 'ccu_media_audit_logs_v1'
};

// ----------------------------------------------------------------------------
// 1. WORKFLOW TRẠNG THÁI DỰ ÁN NỘI DUNG (SECTION 7 SPEC 15.TXT)
// ----------------------------------------------------------------------------
export const MEDIA_PROJECT_STATUSES = [
  { id: 'REQUEST', name: 'Đề bài mới tiếp nhận', color: 'blue', group: 'WAITING_TEAM' },
  { id: 'NEED_MORE_INFO', name: 'Cần thêm thông tin / tư liệu', color: 'amber', group: 'WAITING_CLIENT' },
  { id: 'SCOPE_CONFIRMED', name: 'Đã thống nhất phạm vi', color: 'cyan', group: 'WAITING_TEAM' },
  { id: 'PROPOSAL_SENT', name: 'Đã gửi báo giá & đề xuất', color: 'purple', group: 'WAITING_CLIENT' },
  { id: 'ACCEPTED', name: 'Doanh nghiệp đã xác nhận', color: 'emerald', group: 'WAITING_TEAM' },
  { id: 'CONTENT_PREPARATION', name: 'Chuẩn bị dữ liệu & kịch bản', color: 'indigo', group: 'WAITING_TEAM' },
  { id: 'PRODUCTION', name: 'Đang sản xuất (quay/chụp/biên soạn)', color: 'blue', group: 'WAITING_TEAM' },
  { id: 'CLIENT_REVIEW', name: 'Gửi doanh nghiệp duyệt', color: 'amber', group: 'WAITING_CLIENT' },
  { id: 'REVISION', name: 'Đang chỉnh sửa theo góp ý', color: 'orange', group: 'WAITING_TEAM' },
  { id: 'APPROVED', name: 'Doanh nghiệp đã duyệt chính thức', color: 'teal', group: 'APPROVED' },
  { id: 'DELIVERED', name: 'Đã bàn giao file gốc', color: 'sky', group: 'APPROVED' },
  { id: 'PUBLISHED', name: 'Đã công bố lên hệ sinh thái', color: 'emerald', group: 'PUBLISHED' }
];

// ----------------------------------------------------------------------------
// 2. PHÂN LOẠI MEDIA ASSET (SECTION 9 SPEC 15.TXT)
// Phân biệt rõ: REAL_EVIDENCE vs ILLUSTRATION / AI / MASCOT
// ----------------------------------------------------------------------------
export const MEDIA_ASSET_TYPES = {
  REAL_EVIDENCE: 'REAL_EVIDENCE', // Ảnh chụp thực tế xưởng/máy móc/giấy tờ
  ILLUSTRATION: 'ILLUSTRATION',   // Bản vẽ kỹ thuật / Đồ họa
  AI_GENERATED: 'AI_GENERATED',   // Ảnh do AI tạo
  MASCOT: 'MASCOT'                // Linh vật nhận diện
};

// ----------------------------------------------------------------------------
// 3. SEED MEDIA ASSETS (SECTION 9 & 10 SPEC 15.TXT)
// ----------------------------------------------------------------------------
export const SEED_MEDIA_ASSETS = [
  {
    id: 'ASSET-2026-VID-01',
    title: 'Video giới thiệu xưởng may Proser (1 phút)',
    type: 'VIDEO',
    assetCategory: 'REAL_EVIDENCE',
    url: 'https://pic.trangvangvietnam.com/pics_low/395785472/ao-thun-dong-phuc-doanh-nghiep-T408.jpg',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    duration: '01:15',
    language: 'Tiếng Việt (Phụ đề Tiếng Anh)',
    caption: 'Ghi hình trực tiếp dây chuyền may 80 chuyền và khu vực kiểm tra KCS tại xưởng may Proser Gò Vấp.',
    source: 'CHUOICUNGUNG_PRODUCTION',
    ownerOrganizationId: 'ORG-PROSER-001',
    capturedAt: '2026-03-10',
    usageRights: 'FULL_COMMERCIAL_PERPETUAL',
    visibility: 'PUBLIC',
    publishStatus: 'PUBLISHED',
    relations: {
      organizationId: 'ORG-PROSER-001',
      facilityId: 'FAC-PROSER-GOVAP',
      capabilityIds: ['May mặc bảo hộ lao động', 'Đồng phục doanh nghiệp FDI'],
      productServiceSlugs: ['ao-thun-polo-proser', 'dong-phuc-cong-nhan-kaki'],
      programId: 'vsip-binh-duong',
      catalogueId: 'CAT-PROSER-2026'
    },
    evidence: {
      isEvidence: true,
      evidenceType: 'FACILITY_INSPECTION',
      verifiedAt: '2026-03-15T10:00:00Z',
      verifiedBy: 'Tô Ngọc Dũng (Media & Strategy Director)',
      evidenceNote: 'Đã quay trực tiếp mặt bằng máy may Brother điện tử và bàn cắt vải tự động tại xưởng.'
    }
  },
  {
    id: 'ASSET-2026-IMG-02',
    title: 'Bộ ảnh dây chuyền đóng gói màng co tự động Tahomart',
    type: 'PHOTO_SET',
    assetCategory: 'REAL_EVIDENCE',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    duration: null,
    language: null,
    caption: 'Chụp tại nhà máy chế biến nông sản và đóng gói màng co nhiệt Tahomart.',
    source: 'CLIENT_PROVIDED_AND_VERIFIED',
    ownerOrganizationId: 'ORG-TAHOMART-002',
    capturedAt: '2026-02-18',
    usageRights: 'B2B_PARTNERSHIP_PROMOTION',
    visibility: 'PUBLIC',
    publishStatus: 'PUBLISHED',
    relations: {
      organizationId: 'ORG-TAHOMART-002',
      facilityId: 'FAC-TAHO-HN',
      capabilityIds: ['Đóng gói màng co nhiệt tự động', 'Nông sản chế biến xuất khẩu'],
      productServiceSlugs: ['gio-qua-mang-co-9-16'],
      programId: 'fdi-bac-ninh-2026',
      catalogueId: 'CAT-TAHO-2026'
    },
    evidence: {
      isEvidence: true,
      evidenceType: 'PRODUCTION_LINE',
      verifiedAt: '2026-02-20T14:30:00Z',
      verifiedBy: 'Đặng Tuấn Kiệt (Head of Matchmaking Desk)',
      evidenceNote: 'Ảnh chụp máy co màng nhiệt buồng hầm công nghiệp.'
    }
  },
  {
    id: 'ASSET-2026-ILL-03',
    title: 'Sơ đồ luồng chuyền may công nghệ Lean',
    type: 'DIAGRAM',
    assetCategory: 'ILLUSTRATION',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    duration: null,
    language: 'Tiếng Việt',
    caption: 'Bản vẽ minh họa luồng quy trình điều phối theo phương pháp Lean Kaizen.',
    source: 'INTERNAL_GRAPHIC',
    ownerOrganizationId: 'ORG-PROSER-001',
    capturedAt: '2026-03-01',
    usageRights: 'EXCLUSIVE_PLATFORM',
    visibility: 'PUBLIC',
    publishStatus: 'PUBLISHED',
    relations: {
      organizationId: 'ORG-PROSER-001',
      catalogueId: 'CAT-PROSER-2026'
    },
    evidence: {
      isEvidence: false, // Ảnh đồ họa không được dùng làm Evidence
      evidenceType: null,
      verifiedAt: null,
      verifiedBy: null,
      evidenceNote: 'Minh họa quy trình. Không sử dụng như chứng nhận pháp lý hoặc năng lực xưởng thực tế.'
    }
  }
];

// ----------------------------------------------------------------------------
// 4. CATALOGUES & ENTRIES (SECTION 11 SPEC 15.TXT)
// ----------------------------------------------------------------------------
export const SEED_CATALOGUES = [
  {
    id: 'CAT-PROSER-2026',
    title: 'E-Catalogue Đồng Phục Doanh Nghiệp & Bảo Hộ Lao Động 2026',
    organizationId: 'ORG-PROSER-001',
    organizationName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
    version: '2.1',
    pdfUrl: '/files/catalogues/proser-catalogue-2026.pdf',
    fileSize: '4.8 MB',
    pageCount: 24,
    qrDestinationUrl: 'https://chuoicungung.com/doanh-nghiep/chuyen-gia-dong-phuc-proser',
    status: 'PUBLISHED', // DRAFT | REVIEWING | PUBLISHED
    reviewedBy: 'Tô Ngọc Dũng (Media & Strategy Director)',
    reviewedAt: '2026-03-12T15:00:00Z',
    printStatus: 'AVAILABLE_ON_DEMAND',
    distributionChannels: ['WEBSITE', 'EXPO_BOOTH', 'BUYER_DIRECT_MAIL'],
    costBreakdown: {
      contentFee: 12000000,
      sponsoredPlacementFee: 5000000,
      printingCostPerCopy: 45000,
      distributionCost: 2000000,
      currency: 'VND'
    }
  },
  {
    id: 'CAT-TAHO-2026',
    title: 'Catalogue Nông Sản Chế Biến & Quà Tặng Doanh Nghiệp Tahomart',
    organizationId: 'ORG-TAHOMART-002',
    organizationName: 'Công ty Cổ phần Tập đoàn TAHOMART Việt Nam',
    version: '1.0',
    pdfUrl: '/files/catalogues/tahomart-catalogue-2026.pdf',
    fileSize: '6.2 MB',
    pageCount: 32,
    qrDestinationUrl: 'https://chuoicungung.com/doanh-nghiep/tap-doan-tahomart-viet-nam',
    status: 'PUBLISHED',
    reviewedBy: 'Đặng Tuấn Kiệt (Head of Matchmaking Desk)',
    reviewedAt: '2026-02-22T09:00:00Z',
    printStatus: 'PRINTED_500_COPIES',
    distributionChannels: ['EXPO_BOOTH', 'BUYER_MATCHING_BAG'],
    costBreakdown: {
      contentFee: 15000000,
      sponsoredPlacementFee: 0,
      printingCostPerCopy: 55000,
      distributionCost: 3500000,
      currency: 'VND'
    }
  }
];

// ----------------------------------------------------------------------------
// 5. MASTER CONTENT / MEDIA PROJECTS (SECTION 6, 7, 8, 12, 13 SPEC 15.TXT)
// ----------------------------------------------------------------------------
export const SEED_MEDIA_PROJECTS = [
  {
    id: 'PRJ-MEDIA-2026-01',
    serviceRequestId: 'DV-2026-00130',
    organizationId: 'ORG-TANTIEN-004',
    organizationName: 'Công ty TNHH Nhựa Kỹ Thuật Tân Tiến',
    taxCode: '3702123456',
    contactPerson: 'Nguyễn Bích Thủy',
    roleTitle: 'Trưởng phòng Phát triển Kinh doanh',
    phone: '0908 123 456',
    email: 'thuy.nb@tantienplastic.vn',
    title: 'Gói Truyền Thông: Hồ Sơ Năng Lực & Video 1 Phút Nhà Máy Tân Tiến VSIP 1',
    owner: 'Tô Ngọc Dũng (Media & Strategy Director)',
    status: 'PRODUCTION', // Đang trong quá trình sản xuất (quay/chụp/biên soạn)
    dueDate: '2026-10-15',
    currentRevisionRound: 1,
    maxRevisionRounds: 3,
    usageRights: 'Bản quyền sử dụng trọn đời trên website, hồ sơ gửi Buyer và tài liệu triển lãm',
    relatedProgramId: 'vsip-binh-duong',
    relatedCatalogueId: null,
    deliverables: [
      {
        id: 'deliv-01',
        title: 'Hồ sơ năng lực chuẩn hóa (Company Profile)',
        format: 'PDF Song ngữ & Trình duyệt trực tuyến',
        quantity: '1 bộ (20 trang)',
        status: 'CONTENT_PREPARATION', // PENDING | CONTENT_PREPARATION | CLIENT_REVIEW | APPROVED | DELIVERED
        reviewNotes: 'Đang tổng hợp thông tin pháp nhân, dàn máy ép 350-850 tấn và tiêu chuẩn ISO 9001:2015'
      },
      {
        id: 'deliv-02',
        title: 'Video giới thiệu 1 phút nhà xưởng thực tế',
        format: 'MP4 4K 16:9 + Bản dọc 9:16 cho Mobile',
        quantity: '1 video chính thức (thời lượng 70 giây)',
        status: 'PRODUCTION',
        reviewNotes: 'Lịch quay dự kiến: Thứ Năm ngày 03/10/2026 tại xưởng VSIP 1'
      },
      {
        id: 'deliv-03',
        title: 'Bộ ảnh năng lực & cơ sở vật chất (30 ảnh)',
        format: 'File RAW + JPG Full-Res chỉnh sửa màu sắc chuẩn công nghiệp',
        quantity: '30 ảnh bàn giao (chụp 50+ cảnh)',
        status: 'PRODUCTION',
        reviewNotes: 'Bao gồm phân xưởng ép nhựa, kho khuôn, phòng kiểm tra CMM và kho thành phẩm'
      },
      {
        id: 'deliv-04',
        title: 'Nội dung trang Profile số trên CHUOICUNGUNG.COM',
        format: 'Supplier Profile tương tác tích hợp QR Code',
        quantity: '1 trang hồ sơ bảo chứng chính thức',
        status: 'CONTENT_PREPARATION',
        reviewNotes: 'Đã liên kết vào danh mục Ép nhựa kỹ thuật'
      }
    ],
    // Quản lý kịch bản video (Card 02 Spec 15.txt)
    videoScript: {
      durationSeconds: 70,
      scenes: [
        { sec: '00-10', content: 'Tổng quan nhà máy Tân Tiến tại VSIP 1, diện tích 4.500m²' },
        { sec: '10-25', content: 'Dàn 18 máy ép nhựa tự động Sumitomo / Toshiba từ 350T đến 850T' },
        { sec: '25-45', content: 'Quy trình QA/QC, đo kiểm phòng sạch bằng máy đo quang học và CMM' },
        { sec: '45-60', content: 'Năng lực gia công chi tiết linh kiện điện tử, phụ tùng xe máy cho khách hàng FDI' },
        { sec: '60-70', content: 'CTA kết nối, quét mã QR dẫn trực tiếp về hồ sơ chi tiết tại CHUOICUNGUNG.COM' }
      ],
      shootingLocation: 'Đường số 6, KCN VSIP 1, TP. Thuận An, Bình Dương',
      languages: ['Tiếng Việt', 'Phụ đề Tiếng Anh'],
      reshootPolicy: 'Quay bổ sung tính phí nếu phát sinh cảnh quay ngoài kịch bản đã chốt'
    },
    // Quản lý ảnh (Card 03 Spec 15.txt)
    photoPlan: {
      targetScenes: [
        'Toàn cảnh cổng và văn phòng điều hành',
        'Toàn cảnh phân xưởng ép nhựa nhìn từ trên cao',
        'Cận cảnh cánh tay robot gắp sản phẩm tự động',
        'Kỹ sư vận hành tinh chỉnh khuôn ép',
        'Phòng đo lường kiểm chuẩn KCS',
        'Kho lưu khuôn thép và bảo trì định kỳ',
        'Đóng gói thành phẩm vào thùng nhựa Danpla ESD',
        'Chân dung Ban Giám đốc và đội ngũ kỹ thuật nòng cốt'
      ],
      deliveredCount: 30,
      retouchedCount: 30,
      evidenceCategory: 'REAL_EVIDENCE',
      aiMascotUsage: 'NONE' // Tuyệt đối không dùng AI giả lập bằng chứng
    },
    // Quản lý dự toán chi phí minh bạch (Section 3 & 15 Spec 15.txt)
    commercialTerms: {
      quotationCode: 'BG-2026-MEDIA-042',
      contentPreparationFee: 8000000,
      videoProductionFee: 16000000,
      photoProductionFee: 8000000,
      catalogueIntegrationFee: 3000000,
      travelCost: 'Bao gồm (nội ô Bình Dương / TP.HCM)',
      additionalShootingCostPerDay: 5000000,
      additionalLanguageCost: 2000000,
      revisionPolicy: 'Tối đa 3 vòng chỉnh sửa kịch bản & dựng phim. Từ vòng 4 phụ phí 1.500.000đ/lần.',
      itemsNotIncluded: [
        'Chi phí xin phép quay phim tại bên thứ ba nếu có',
        'Chi phí in ấn catalogue số lượng lớn (báo giá theo số lượng đặt thực tế)',
        'Chi phí chạy quảng cáo Facebook/Google Ads (CHUOICUNGUNG.COM chỉ cung cấp hạ tầng kết nối B2B)'
      ],
      disclaimer: 'Dịch vụ chuẩn hóa hồ sơ và hình ảnh không bao gồm cam kết sản lượng đơn hàng, số lượng Buyer hay ký kết hợp đồng thương mại nếu không có phạm vi thẩm định riêng.'
    },
    // Lịch sử duyệt (Section 8 Spec 15.txt)
    approvalRecord: {
      isApproved: false,
      approvedBy: null,
      approvedAt: null,
      version: 'v0.9-draft',
      reviewedItems: {
        copy: false,
        photos: false,
        video: false,
        capabilities: false,
        clientReferences: false,
        contact: false,
        qrDestination: false
      },
      auditHistory: [
        {
          timestamp: '2026-09-28T09:30:00Z',
          action: 'PROJECT_INITIALIZED',
          actor: 'Tô Ngọc Dũng',
          note: 'Khởi tạo Media Project từ Service Request DV-2026-00130'
        },
        {
          timestamp: '2026-09-28T14:00:00Z',
          action: 'SCRIPT_DRAFTED',
          actor: 'Tô Ngọc Dũng',
          note: 'Biên soạn dự thảo kịch bản video 5 cảnh và danh mục 8 cảnh chụp'
        }
      ]
    },
    createdAt: '2026-09-28T09:30:00Z',
    updatedAt: '2026-09-28T14:00:00Z'
  },
  {
    id: 'PRJ-MEDIA-2026-02',
    serviceRequestId: 'DV-2026-00115',
    organizationId: 'ORG-PROSER-001',
    organizationName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
    taxCode: '0314567890',
    contactPerson: 'Trần Văn Proser',
    roleTitle: 'Giám đốc Điều hành',
    phone: '0903 999 888',
    email: 'admin@chuyengiadongphuc.com',
    title: 'Gói Truyền Thông: Chuẩn Hóa Hồ Sơ Năng Lực, Video 1 Phút & E-Catalogue 2026',
    owner: 'Tô Ngọc Dũng (Media & Strategy Director)',
    status: 'PUBLISHED',
    dueDate: '2026-03-15',
    currentRevisionRound: 2,
    maxRevisionRounds: 3,
    usageRights: 'Bản quyền vĩnh viễn trên tất cả các kênh xúc tiến B2B và chương trình kết nối',
    relatedProgramId: 'vsip-binh-duong',
    relatedCatalogueId: 'CAT-PROSER-2026',
    deliverables: [
      {
        id: 'deliv-pr-01',
        title: 'Hồ sơ năng lực Proser 2026 (Song ngữ Anh - Việt)',
        format: 'PDF High-Res 300dpi + Digital Flipbook',
        quantity: '1 bộ (24 trang)',
        status: 'PUBLISHED',
        reviewNotes: 'Đã hoàn tất bàn giao và upload lên hồ sơ doanh nghiệp'
      },
      {
        id: 'deliv-pr-02',
        title: 'Video giới thiệu 1 phút phân xưởng may Gò Vấp',
        format: 'MP4 4K Full HD',
        quantity: '1 video chính thức',
        status: 'PUBLISHED',
        reviewNotes: 'Đã gắn vào thẻ Video trên trang chi tiết nhà cung cấp'
      },
      {
        id: 'deliv-pr-03',
        title: 'Bộ ảnh tư liệu thực tế xưởng may 50 tấm',
        format: 'JPG + RAW',
        quantity: '50 ảnh đạt chuẩn kiểm định',
        status: 'PUBLISHED',
        reviewNotes: 'Phân loại đầy đủ máy may, bàn ủi hơi nước công nghiệp và kho vải'
      }
    ],
    videoScript: {
      durationSeconds: 75,
      shootingLocation: '154 Phạm Văn Chiêu, Phường 9, Quận Gò Vấp, TP. Hồ Chí Minh',
      languages: ['Tiếng Việt', 'Tiếng Anh'],
      reshootPolicy: 'Không phát sinh'
    },
    commercialTerms: {
      quotationCode: 'BG-2026-MEDIA-018',
      contentPreparationFee: 10000000,
      videoProductionFee: 18000000,
      photoProductionFee: 10000000,
      catalogueIntegrationFee: 5000000,
      travelCost: 'Bao gồm',
      disclaimer: 'Đã hoàn thành nghiệm thu theo hợp đồng.'
    },
    approvalRecord: {
      isApproved: true,
      approvedBy: 'Trần Văn Proser (CEO)',
      approvedAt: '2026-03-12T16:45:00Z',
      version: 'v2.1-final',
      reviewedItems: {
        copy: true,
        photos: true,
        video: true,
        capabilities: true,
        clientReferences: true,
        contact: true,
        qrDestination: true
      },
      auditHistory: [
        {
          timestamp: '2026-03-01T08:00:00Z',
          action: 'PROJECT_INITIALIZED',
          actor: 'Tô Ngọc Dũng',
          note: 'Tiếp nhận đề bài chuẩn hóa hồ sơ xúc tiến thị trường FDI'
        },
        {
          timestamp: '2026-03-10T17:00:00Z',
          action: 'DELIVERED_PREVIEW',
          actor: 'Tô Ngọc Dũng',
          note: 'Gửi bản preview v2.0 video và bộ ảnh 50 tấm'
        },
        {
          timestamp: '2026-03-12T16:45:00Z',
          action: 'CLIENT_APPROVED',
          actor: 'Trần Văn Proser',
          note: 'Doanh nghiệp ký duyệt phiên bản v2.1-final không chỉnh sửa thêm'
        },
        {
          timestamp: '2026-03-15T09:00:00Z',
          action: 'PUBLISHED_TO_ECOSYSTEM',
          actor: 'Admin Master',
          note: 'Đã xuất bản lên Supplier Profile, liên kết Catalogue CAT-PROSER-2026 và sự kiện VSIP'
        }
      ]
    },
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-15T09:00:00Z'
  }
];

// ----------------------------------------------------------------------------
// 6. STORAGE RETRIEVAL & PERSISTENCE (LocalStorage with Memory Fallback)
// ----------------------------------------------------------------------------
const memoryStorage = {};

function safeGetItem(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {}
  return memoryStorage[key] || null;
}

function safeSetItem(key, val) {
  memoryStorage[key] = val;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
    }
  } catch (e) {}
}

export function getAllMediaProjects() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.MEDIA_PROJECTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [...SEED_MEDIA_PROJECTS];
}

export function saveAllMediaProjects(projects) {
  try {
    safeSetItem(STORAGE_KEYS.MEDIA_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Lỗi lưu danh sách Media Projects:', e);
  }
}

export function getMediaProjectById(id) {
  const all = getAllMediaProjects();
  return all.find(p => p.id === id || p.serviceRequestId === id) || null;
}

export function getAllMediaAssets() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.MEDIA_ASSETS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [...SEED_MEDIA_ASSETS];
}

export function saveAllMediaAssets(assets) {
  try {
    safeSetItem(STORAGE_KEYS.MEDIA_ASSETS, JSON.stringify(assets));
  } catch (e) {}
}

export function getAllCatalogues() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.CATALOGUES);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [...SEED_CATALOGUES];
}

export function saveAllCatalogues(cats) {
  try {
    safeSetItem(STORAGE_KEYS.CATALOGUES, JSON.stringify(cats));
  } catch (e) {}
}

export function getAllMediaAuditLogs() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.MEDIA_AUDIT_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [
    {
      id: 'LOG-MEDIA-01',
      timestamp: '2026-09-28T09:30:00Z',
      action: 'MEDIA_PROJECT_CREATED',
      actor: 'Admin Master',
      projectId: 'PRJ-MEDIA-2026-01',
      details: 'Khởi tạo dự án truyền thông nhà xưởng cho Công ty Nhựa Tân Tiến.'
    },
    {
      id: 'LOG-MEDIA-02',
      timestamp: '2026-03-15T09:00:00Z',
      action: 'MEDIA_ASSET_PUBLISHED',
      actor: 'Tô Ngọc Dũng',
      projectId: 'PRJ-MEDIA-2026-02',
      details: 'Xuất bản Video 1 phút và Catalogue Proser v2.1 lên Supplier Profile.'
    }
  ];
}

export function logMediaAudit({ action, projectId, actor = 'System Admin', details = '' }) {
  try {
    const logs = getAllMediaAuditLogs();
    const newEntry = {
      id: `LOG-M-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      projectId,
      actor,
      details
    };
    logs.unshift(newEntry);
    safeSetItem(STORAGE_KEYS.MEDIA_AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {}
}

// ----------------------------------------------------------------------------
// 7. ACTION HANDLERS (WORKFLOW, APPROVAL, CREATION)
// ----------------------------------------------------------------------------

/**
 * Tạo Content Project từ ServiceRequest khi Scope/Proposal được chốt (Section 6)
 */
export function createMediaProjectFromServiceRequest({
  serviceRequest,
  owner = 'Tô Ngọc Dũng (Media & Strategy Director)',
  dueDate = '2026-11-15'
}) {
  const projects = getAllMediaProjects();
  const existing = projects.find(p => p.serviceRequestId === serviceRequest.id);
  if (existing) return { success: true, project: existing, alreadyExisted: true };

  const newId = `PRJ-MEDIA-2026-${String(Date.now()).slice(-4)}`;

  const newProject = {
    id: newId,
    serviceRequestId: serviceRequest.id,
    organizationId: serviceRequest.organizationId || `ORG-${Date.now()}`,
    organizationName: serviceRequest.companyName || 'Doanh nghiệp đăng ký',
    taxCode: '',
    contactPerson: serviceRequest.customerName,
    roleTitle: 'Người liên hệ đại diện',
    phone: serviceRequest.phone,
    email: serviceRequest.email,
    title: `Dự án nội dung & truyền thông: ${serviceRequest.companyName}`,
    owner,
    status: 'ACCEPTED',
    dueDate,
    currentRevisionRound: 0,
    maxRevisionRounds: 3,
    usageRights: 'Bản quyền sử dụng B2B không độc quyền trên CHUOICUNGUNG.COM và kênh khách hàng',
    relatedProgramId: serviceRequest.programId || null,
    relatedCatalogueId: null,
    deliverables: [
      {
        id: `deliv-${Date.now()}-1`,
        title: 'Hồ sơ năng lực chuẩn hóa (Company Profile)',
        format: 'PDF & Trực tuyến',
        quantity: '1 bộ tài liệu',
        status: 'CONTENT_PREPARATION',
        reviewNotes: 'Khởi tạo theo đề bài dịch vụ'
      },
      {
        id: `deliv-${Date.now()}-2`,
        title: 'Video giới thiệu ngắn (khoảng 1 phút)',
        format: 'MP4 4K 16:9 + 9:16',
        quantity: '1 video chính thức',
        status: 'CONTENT_PREPARATION',
        reviewNotes: 'Biên soạn kịch bản 6 phần chuẩn B2B'
      },
      {
        id: `deliv-${Date.now()}-3`,
        title: 'Bộ ảnh năng lực & cơ sở vật chất thực tế',
        format: 'JPG Full-Res',
        quantity: '25-30 ảnh chất lượng cao',
        status: 'CONTENT_PREPARATION',
        reviewNotes: 'Chụp phân xưởng và sản phẩm thực tế'
      }
    ],
    videoScript: {
      durationSeconds: 60,
      shootingLocation: serviceRequest.location || 'Địa chỉ nhà máy doanh nghiệp',
      languages: ['Tiếng Việt'],
      reshootPolicy: 'Quay lại có phụ phí nếu thay đổi mặt bằng hoặc kịch bản ngoài phạm vi'
    },
    commercialTerms: {
      quotationCode: `BG-${Date.now().toString().slice(-6)}`,
      contentPreparationFee: 8000000,
      videoProductionFee: 15000000,
      photoProductionFee: 7000000,
      catalogueIntegrationFee: 3000000,
      travelCost: 'Thống nhất theo cự ly thực tế',
      additionalShootingCostPerDay: 4500000,
      additionalLanguageCost: 2000000,
      revisionPolicy: 'Tối đa 3 vòng chỉnh sửa',
      itemsNotIncluded: ['Chạy quảng cáo trả phí ngoài nền tảng', 'In ấn số lượng lớn'],
      disclaimer: 'Không hứa hẹn hoặc cam kết số lượng views/leads/deals ngoài phạm vi kỹ thuật.'
    },
    approvalRecord: {
      isApproved: false,
      approvedBy: null,
      approvedAt: null,
      version: 'v1.0-draft',
      reviewedItems: {
        copy: false,
        photos: false,
        video: false,
        capabilities: false,
        clientReferences: false,
        contact: false,
        qrDestination: false
      },
      auditHistory: [
        {
          timestamp: new Date().toISOString(),
          action: 'PROJECT_CREATED_FROM_REQUEST',
          actor: 'System Admin',
          note: `Khởi tạo dự án từ yêu cầu ${serviceRequest.id}`
        }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  projects.unshift(newProject);
  saveAllMediaProjects(projects);

  logMediaAudit({
    action: 'PROJECT_CREATED',
    projectId: newId,
    actor: owner,
    details: `Tạo dự án truyền thông cho ${newProject.organizationName}.`
  });

  return { success: true, project: newProject };
}

/**
 * Cập nhật tiến độ dự án nội dung (Section 7 Spec 15.txt)
 */
export function updateMediaProjectStatus({
  projectId,
  status,
  owner,
  dueDate,
  actor = 'Admin Master',
  note = ''
}) {
  const projects = getAllMediaProjects();
  const idx = projects.findIndex(p => p.id === projectId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy dự án' };

  const prj = projects[idx];
  const oldStatus = prj.status;

  // RULE SECTION 7: Không publish khi chưa APPROVED
  if (status === 'PUBLISHED' && !prj.approvalRecord.isApproved) {
    return {
      success: false,
      message: 'VI PHẠM QUY TẮC DUYỆT (SECTION 7): Không được công bố (PUBLISHED) khi doanh nghiệp chưa ký duyệt chính thức (APPROVED).'
    };
  }

  prj.status = status || prj.status;
  if (owner) prj.owner = owner;
  if (dueDate) prj.dueDate = dueDate;
  prj.updatedAt = new Date().toISOString();

  // Thêm vào audit history
  prj.approvalRecord.auditHistory.unshift({
    timestamp: new Date().toISOString(),
    action: `STATUS_CHANGED_TO_${status}`,
    actor,
    note: note || `Đổi trạng thái từ ${oldStatus} sang ${status}`
  });

  projects[idx] = prj;
  saveAllMediaProjects(projects);

  logMediaAudit({
    action: 'STATUS_UPDATED',
    projectId,
    actor,
    details: `Cập nhật trạng thái dự án ${projectId}: [${oldStatus}] -> [${status}]. ${note}`
  });

  return { success: true, project: prj };
}

/**
 * Doanh nghiệp duyệt nội dung chính thức (Section 8 Spec 15.txt)
 * Bắt buộc duyệt: copy, ảnh, video, năng lực, contact, QR destination
 * Lưu version, không ghi đè lịch sử duyệt.
 */
export function submitClientApproval({
  projectId,
  approvedBy,
  reviewedItems = {},
  version = 'v1.0-approved',
  note = ''
}) {
  const projects = getAllMediaProjects();
  const idx = projects.findIndex(p => p.id === projectId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy dự án' };

  const prj = projects[idx];

  // Kiểm tra các hạng mục duyệt
  const updatedReviewedItems = {
    ...prj.approvalRecord.reviewedItems,
    ...reviewedItems
  };

  const allReviewed = Object.values(updatedReviewedItems).every(Boolean);

  prj.approvalRecord = {
    ...prj.approvalRecord,
    isApproved: allReviewed,
    approvedBy: approvedBy || prj.contactPerson,
    approvedAt: new Date().toISOString(),
    version,
    reviewedItems: updatedReviewedItems
  };

  // Nếu tất cả đã duyệt -> chuyển trạng thái thành APPROVED
  if (allReviewed) {
    prj.status = 'APPROVED';
  }

  prj.approvalRecord.auditHistory.unshift({
    timestamp: new Date().toISOString(),
    action: allReviewed ? 'CLIENT_FORMALLY_APPROVED' : 'CLIENT_PARTIAL_REVIEW',
    actor: approvedBy || prj.contactPerson,
    note: note || `Ký duyệt phiên bản ${version}. Toàn bộ hạng mục: ${allReviewed ? 'ĐÃ ĐẠT' : 'ĐANG CHỜ BỔ SUNG'}.`
  });

  prj.updatedAt = new Date().toISOString();
  projects[idx] = prj;
  saveAllMediaProjects(projects);

  logMediaAudit({
    action: 'CLIENT_APPROVAL_SUBMITTED',
    projectId,
    actor: approvedBy,
    details: `Doanh nghiệp duyệt phiên bản ${version} cho dự án ${projectId}.`
  });

  return { success: true, project: prj, allReviewed };
}

/**
 * Thống kê 4 nhóm trạng thái cho Admin (Section 13 Spec 15.txt)
 * 1. Đang chờ doanh nghiệp
 * 2. Đang chờ team
 * 3. Đã duyệt
 * 4. Đã publish
 */
export function getMediaProjectProgressSummary() {
  const projects = getAllMediaProjects();

  const waitingClient = projects.filter(p => ['NEED_MORE_INFO', 'PROPOSAL_SENT', 'CLIENT_REVIEW'].includes(p.status));
  const waitingTeam = projects.filter(p => ['REQUEST', 'SCOPE_CONFIRMED', 'ACCEPTED', 'CONTENT_PREPARATION', 'PRODUCTION', 'REVISION'].includes(p.status));
  const approved = projects.filter(p => ['APPROVED', 'DELIVERED'].includes(p.status));
  const published = projects.filter(p => p.status === 'PUBLISHED');

  return {
    total: projects.length,
    waitingClient,
    waitingTeam,
    approved,
    published
  };
}
