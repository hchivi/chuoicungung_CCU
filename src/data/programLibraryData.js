// ============================================================================
// MASTER PROGRAM MEDIA & DOCUMENT LIBRARY DATA ENGINE
// PAGE 23: THƯ VIỆN CHƯƠNG TRÌNH
// ROUTE: /chuong-trinh/[slug]/thu-vien
// Chuẩn hóa theo spec 23.txt - CHUOICUNGUNG.COM
// ============================================================================

import { getProgramByIdOrSlug, getAllProgramAuditLogs, inMemoryAuditLogs } from './programsData.js';
import { SEED_ORGANIZATIONS } from './organizationsData.js';

export const STORAGE_KEYS = {
  PROGRAM_MEDIA_ASSETS: 'ccu_program_media_assets_v1',
  PROGRAM_ALBUMS: 'ccu_program_albums_v1',
  LIBRARY_EXCHANGE_REQUESTS: 'ccu_library_exchange_requests_v1',
  MEDIA_DOWNLOAD_LOGS: 'ccu_media_download_logs_v1'
};

// ----------------------------------------------------------------------------
// 1. CANONICAL ENUMS (SECTIONS 4, 5, 6, 17, 20)
// ----------------------------------------------------------------------------

export const MEDIA_TYPE_ENUM = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  DOCUMENT: 'DOCUMENT'
};

export const MEDIA_VISIBILITY_ENUM = {
  PUBLIC: 'PUBLIC',
  PROGRAM_PARTICIPANTS: 'PROGRAM_PARTICIPANTS',
  ORGANIZATION_ONLY: 'ORGANIZATION_ONLY',
  SPECIFIC_USERS: 'SPECIFIC_USERS',
  INTERNAL: 'INTERNAL'
};

export const DOWNLOAD_PERMISSION_ENUM = {
  PUBLIC: 'PUBLIC',
  PARTICIPANTS_ONLY: 'PARTICIPANTS_ONLY',
  AUTHORIZED_ONLY: 'AUTHORIZED_ONLY',
  NONE: 'NONE'
};

export const MEDIA_PUBLISH_STATUS_ENUM = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  PUBLISHED: 'PUBLISHED',
  RESTRICTED: 'RESTRICTED',
  ARCHIVED: 'ARCHIVED',
  UNPUBLISHED: 'UNPUBLISHED'
};

export const SESSION_TAGS_ENUM = {
  CHECK_IN: 'CHECK_IN',
  OPENING: 'OPENING',
  B2B_MEETING: 'B2B_MEETING',
  BOOTH_SHOWCASE: 'BOOTH_SHOWCASE',
  PRESENTATION: 'PRESENTATION',
  NETWORKING: 'NETWORKING',
  MASCOT_MOMENTS: 'MASCOT_MOMENTS'
};

export const USAGE_RIGHTS_ENUM = {
  PUBLIC_PRESS_EDITORIAL: 'PUBLIC_PRESS_EDITORIAL',
  PARTICIPANT_INTERNAL_USE: 'PARTICIPANT_INTERNAL_USE',
  COMMERCIAL_EXCLUSIVE: 'COMMERCIAL_EXCLUSIVE',
  LIMITED_TIME_EVENT: 'LIMITED_TIME_EVENT'
};

// ----------------------------------------------------------------------------
// 2. SEED PROGRAM ALBUMS (SECTION 8, 9, 18)
// ----------------------------------------------------------------------------

export const SEED_PROGRAM_ALBUMS = [
  {
    id: 'ALB-VSIP-01',
    programId: 'vsip-binh-duong',
    title: 'Phiên Giao Thương Trực Tiếp 1:1 Giữa FDI & Nhà Cung Ứng',
    description: 'Các phiên làm việc kín và thảo luận thông số kỹ thuật chi tiết tại phòng VIP.',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    sortOrder: 1,
    coverUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80',
    itemCount: 8,
    createdAt: '2026-09-26T14:00:00+07:00'
  },
  {
    id: 'ALB-VSIP-02',
    programId: 'vsip-binh-duong',
    title: 'Khu Trưng Bày Linh Kiện Mẫu & Bàn Giao Thương',
    description: 'Ảnh các gian bàn trưng bày phôi cơ khí chính xác, bo mạch và giải pháp phòng sạch.',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    sortOrder: 2,
    coverUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    itemCount: 12,
    createdAt: '2026-09-26T14:30:00+07:00'
  },
  {
    id: 'ALB-VSIP-03',
    programId: 'vsip-binh-duong',
    title: 'Check-In Cùng Suppi & Chainy',
    description: 'Khoảnh khắc đại biểu chụp hình lưu niệm cùng bộ đôi linh vật chuỗi cung ứng.',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    sortOrder: 3,
    coverUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    itemCount: 6,
    isMascotAlbum: true, // Section 9 rule: Mascot album không phải chứng minh thẩm định
    createdAt: '2026-09-26T15:00:00+07:00'
  },
  {
    id: 'ALB-DEEPC-01',
    programId: 'trang-due-deep-c',
    title: 'Lễ Khai Mạc & Toạ Đàm Chuỗi Cung Ứng DEEP C Hải Phòng',
    description: 'Toàn cảnh phiên khai mạc cùng đại diện BQL Khu Kinh tế Hải Phòng.',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    sortOrder: 1,
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    itemCount: 10,
    createdAt: '2026-09-27T10:00:00+07:00'
  }
];

// ----------------------------------------------------------------------------
// 3. SEED MEDIA ASSETS (SECTIONS 4, 8, 10, 12, 13, 14)
// ----------------------------------------------------------------------------

export const SEED_PROGRAM_MEDIA_ASSETS = [
  // 1. Ảnh phiên 1:1 (vsip-binh-duong)
  {
    id: 'MEDIA-VSIP-IMG-001',
    programId: 'vsip-binh-duong',
    albumId: 'ALB-VSIP-01',
    type: MEDIA_TYPE_ENUM.IMAGE,
    title: 'Phiên làm việc giữa MicroTech Precision và VinaFastener',
    description: 'Thảo luận về hợp đồng gia công bu lông ốc vít inox vi sinh cho dây chuyền phòng sạch.',
    url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&auto=format&fit=crop&q=80',
    sessionTag: SESSION_TAGS_ENUM.B2B_MEETING,
    providerOrganizationId: 'ORG-PROSER-001',
    relatedOrganizationId: 'ORG-MICROTECH-01',
    relatedSupplierProfileId: 'ORG-VINAFASTENER-02',
    enterpriseName: 'Tập đoàn Điện tử MicroTech & VinaFastener',
    boothCode: 'TABLE-VIP-03',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    downloadPermission: DOWNLOAD_PERMISSION_ENUM.PUBLIC,
    usageRights: USAGE_RIGHTS_ENUM.PUBLIC_PRESS_EDITORIAL,
    consentStatus: 'GRANTED',
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PUBLISHED,
    capturedAt: '2026-09-26T10:15:00+07:00',
    fileSize: '2.4 MB',
    dimensions: '3840x2160',
    createdAt: '2026-09-26T11:00:00+07:00'
  },
  {
    id: 'MEDIA-VSIP-IMG-002',
    programId: 'vsip-binh-duong',
    albumId: 'ALB-VSIP-01',
    type: MEDIA_TYPE_ENUM.IMAGE,
    title: 'Ký kết biên bản ghi nhớ hợp tác ban đầu (MOU) tại bàn VIP 1',
    description: 'Biên bản thỏa thuận khung về khảo sát năng lực sản xuất thực tế tại xưởng.',
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80',
    sessionTag: SESSION_TAGS_ENUM.B2B_MEETING,
    providerOrganizationId: 'ORG-PROSER-001',
    relatedOrganizationId: 'ORG-VINAFASTENER-02',
    enterpriseName: 'Công ty Cổ phần Cơ Khí Chính Xác VinaFastener',
    boothCode: 'TABLE-VIP-01',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    downloadPermission: DOWNLOAD_PERMISSION_ENUM.PARTICIPANTS_ONLY,
    usageRights: USAGE_RIGHTS_ENUM.PARTICIPANT_INTERNAL_USE,
    consentStatus: 'GRANTED',
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PUBLISHED,
    capturedAt: '2026-09-26T11:45:00+07:00',
    fileSize: '3.1 MB',
    dimensions: '4000x2667',
    createdAt: '2026-09-26T12:30:00+07:00'
  },
  // 2. Gian hàng & Doanh nghiệp (vsip-binh-duong)
  {
    id: 'MEDIA-VSIP-IMG-003',
    programId: 'vsip-binh-duong',
    albumId: 'ALB-VSIP-02',
    type: MEDIA_TYPE_ENUM.IMAGE,
    title: 'Gian trưng bày giải pháp đồng phục phòng sạch Proser',
    description: 'Giới thiệu mẫu vải chống tĩnh điện đạt chuẩn ISO Class 4 cho nhà máy bán dẫn.',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop&q=80',
    sessionTag: SESSION_TAGS_ENUM.BOOTH_SHOWCASE,
    providerOrganizationId: 'ORG-PROSER-001',
    relatedOrganizationId: 'ORG-PROSER-001',
    enterpriseName: 'Chuyên Gia Đồng Phục Proser',
    category: 'May mặc & Bảo hộ lao động',
    capabilitySnippet: 'May đồng phục kỹ thuật viên & Bảo hộ ESD tiêu chuẩn châu Âu',
    boothCode: 'BOOTH-A12',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    downloadPermission: DOWNLOAD_PERMISSION_ENUM.PUBLIC,
    usageRights: USAGE_RIGHTS_ENUM.PUBLIC_PRESS_EDITORIAL,
    consentStatus: 'GRANTED',
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PUBLISHED,
    capturedAt: '2026-09-26T09:30:00+07:00',
    fileSize: '1.9 MB',
    dimensions: '3000x2000',
    createdAt: '2026-09-26T10:00:00+07:00'
  },
  {
    id: 'MEDIA-VSIP-IMG-004',
    programId: 'vsip-binh-duong',
    albumId: 'ALB-VSIP-02',
    type: MEDIA_TYPE_ENUM.IMAGE,
    title: 'Khu vực trưng bày hộp mẫu bu lông DIN VinaFastener',
    description: 'Hơn 50 chi tiết bu lông tán đai ốc đặc chủng phục vụ lắp ráp máy tự động.',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=400&auto=format&fit=crop&q=80',
    sessionTag: SESSION_TAGS_ENUM.BOOTH_SHOWCASE,
    providerOrganizationId: 'ORG-VINAFASTENER-02',
    relatedOrganizationId: 'ORG-VINAFASTENER-02',
    enterpriseName: 'Cơ Khí Chính Xác VinaFastener',
    category: 'Cơ khí & Phụ trợ cơ điện',
    capabilitySnippet: 'Bu lông cấp bền 8.8 - 12.9, Inox 304/316 vi sinh dung sai 0.01mm',
    boothCode: 'BOOTH-B05',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    downloadPermission: DOWNLOAD_PERMISSION_ENUM.PUBLIC,
    usageRights: USAGE_RIGHTS_ENUM.PUBLIC_PRESS_EDITORIAL,
    consentStatus: 'GRANTED',
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PUBLISHED,
    capturedAt: '2026-09-26T09:45:00+07:00',
    fileSize: '2.8 MB',
    dimensions: '3600x2400',
    createdAt: '2026-09-26T10:30:00+07:00'
  },
  // 3. Album Mascot Moments (Section 9)
  {
    id: 'MEDIA-VSIP-IMG-005',
    programId: 'vsip-binh-duong',
    albumId: 'ALB-VSIP-03',
    type: MEDIA_TYPE_ENUM.IMAGE,
    title: 'Đại biểu chụp hình lưu niệm cùng bộ đôi linh vật Suppi & Chainy',
    description: 'Khu vực photobooth sảnh chính trung tâm hội nghị VSIP 1.',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&auto=format&fit=crop&q=80',
    sessionTag: SESSION_TAGS_ENUM.MASCOT_MOMENTS,
    enterpriseName: 'Ban Tổ Chức CCU & Khách Mời',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    downloadPermission: DOWNLOAD_PERMISSION_ENUM.PUBLIC,
    usageRights: USAGE_RIGHTS_ENUM.PUBLIC_PRESS_EDITORIAL,
    consentStatus: 'GRANTED',
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PUBLISHED,
    capturedAt: '2026-09-26T08:45:00+07:00',
    fileSize: '2.1 MB',
    dimensions: '3500x2333',
    createdAt: '2026-09-26T09:00:00+07:00'
  },
  // 4. Video Giới Thiệu (Section 12)
  {
    id: 'MEDIA-VSIP-VID-001',
    programId: 'vsip-binh-duong',
    type: MEDIA_TYPE_ENUM.VIDEO,
    title: 'Video giới thiệu năng lực dây chuyền xưởng may Proser (1 phút 15 giây)',
    description: 'Trực quan toàn bộ 80 chuyền may máy Brother điện tử và bàn cắt tự động tại xưởng.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    sessionTag: SESSION_TAGS_ENUM.BOOTH_SHOWCASE,
    providerOrganizationId: 'ORG-PROSER-001',
    relatedOrganizationId: 'ORG-PROSER-001',
    enterpriseName: 'Chuyên Gia Đồng Phục Proser',
    category: 'May mặc & Bảo hộ lao động',
    duration: '01:15',
    language: 'Tiếng Việt (Phụ đề Tiếng Anh)',
    caption: 'Video thẩm định năng lực thực tế xưởng sản xuất phục vụ kết nối Buyer FDI.',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    downloadPermission: DOWNLOAD_PERMISSION_ENUM.NONE, // Video embed, không cho download direct
    usageRights: USAGE_RIGHTS_ENUM.COMMERCIAL_EXCLUSIVE,
    consentStatus: 'GRANTED',
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PUBLISHED,
    capturedAt: '2026-09-25T14:00:00+07:00',
    createdAt: '2026-09-26T08:00:00+07:00'
  },
  {
    id: 'MEDIA-VSIP-VID-002',
    programId: 'vsip-binh-duong',
    type: MEDIA_TYPE_ENUM.VIDEO,
    title: 'Clip tổng quan giải pháp kho lạnh & bảo quản nông sản Tahomart',
    description: 'Hệ thống kho nhiệt độ kiểm soát -18°C đến +5°C đạt chứng nhận HACCP quốc tế.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    sessionTag: SESSION_TAGS_ENUM.BOOTH_SHOWCASE,
    providerOrganizationId: 'ORG-TAHOMART-002',
    relatedOrganizationId: 'ORG-TAHOMART-002',
    enterpriseName: 'Tập đoàn TAHOMART Việt Nam',
    category: 'Nông sản, Thực phẩm & Kho vận',
    duration: '02:04',
    language: 'Tiếng Việt',
    caption: 'Giới thiệu năng lực cung ứng giỏ quà và thực phẩm sạch cho bếp ăn công nghiệp KCN.',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    downloadPermission: DOWNLOAD_PERMISSION_ENUM.NONE,
    usageRights: USAGE_RIGHTS_ENUM.COMMERCIAL_EXCLUSIVE,
    consentStatus: 'GRANTED',
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PUBLISHED,
    capturedAt: '2026-09-25T15:00:00+07:00',
    createdAt: '2026-09-26T08:30:00+07:00'
  },
  // 5. Catalogue & Tài Liệu (Section 13)
  {
    id: 'MEDIA-VSIP-DOC-001',
    programId: 'vsip-binh-duong',
    type: MEDIA_TYPE_ENUM.DOCUMENT,
    title: 'Kỷ Yếu Danh Bạ Nhà Cung Ứng KCN VSIP 1 & 2 (Bản điện tử chính thức)',
    description: 'Tổng hợp năng lực, chứng chỉ chất lượng ISO và thông tin liên hệ của 120 nhà cung cấp đã rà soát.',
    url: '/files/catalogues/proser-catalogue-2026.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    fileSize: '8.4 MB',
    pageCount: 64,
    providerOrganizationId: 'ORG-PROSER-001',
    providerName: 'Ban Tổ Chức CCU & BQL KCN VSIP',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    downloadPermission: DOWNLOAD_PERMISSION_ENUM.PUBLIC, // Cho phép tải về
    usageRights: USAGE_RIGHTS_ENUM.PUBLIC_PRESS_EDITORIAL,
    consentStatus: 'GRANTED',
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PUBLISHED,
    createdAt: '2026-09-26T08:00:00+07:00'
  },
  {
    id: 'MEDIA-VSIP-DOC-002',
    programId: 'vsip-binh-duong',
    type: MEDIA_TYPE_ENUM.DOCUMENT,
    title: 'E-Catalogue Năng Lực Bu Lông Inox & Đồ Gá VinaFastener 2026',
    description: 'Bản vẽ quy cách, tiêu chuẩn vật liệu DIN 933, DIN 912 và bảng kiểm soát dung sai.',
    url: '/files/catalogues/tahomart-catalogue-2026.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
    fileSize: '4.2 MB',
    pageCount: 28,
    providerOrganizationId: 'ORG-VINAFASTENER-02',
    providerName: 'Công ty Cổ phần Cơ Khí Chính Xác VinaFastener',
    relatedOrganizationId: 'ORG-VINAFASTENER-02',
    enterpriseName: 'Cơ Khí Chính Xác VinaFastener',
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    downloadPermission: DOWNLOAD_PERMISSION_ENUM.PUBLIC,
    usageRights: USAGE_RIGHTS_ENUM.PUBLIC_PRESS_EDITORIAL,
    consentStatus: 'GRANTED',
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PUBLISHED,
    createdAt: '2026-09-26T08:30:00+07:00'
  },
  {
    id: 'MEDIA-VSIP-DOC-003',
    programId: 'vsip-binh-duong',
    type: MEDIA_TYPE_ENUM.DOCUMENT,
    title: 'Tài Liệu Hướng Dẫn Thẩm Định Nhà Cung Cấp Xanh & Kiểm Toán Carbon Cho Doanh Nghiệp FDI',
    description: 'Tài liệu độc quyền dành cho các giám đốc nhà máy và quản lý thu mua đã tham dự sự kiện.',
    url: '/files/guidelines/green-supply-chain-audit-guide.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80',
    fileSize: '5.6 MB',
    pageCount: 36,
    providerOrganizationId: 'ORG-AMATA-003',
    providerName: 'Chuyên gia Chuỗi Cung Ứng & ESG',
    visibility: MEDIA_VISIBILITY_ENUM.PROGRAM_PARTICIPANTS, // Chỉ dành cho người tham gia
    downloadPermission: DOWNLOAD_PERMISSION_ENUM.PARTICIPANTS_ONLY,
    usageRights: USAGE_RIGHTS_ENUM.PARTICIPANT_INTERNAL_USE,
    consentStatus: 'GRANTED',
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PUBLISHED,
    createdAt: '2026-09-26T09:00:00+07:00'
  },
  // 6. Tài liệu chưa được duyệt (Section 20 - Draft/Pending Review)
  {
    id: 'MEDIA-VSIP-DOC-004-PENDING',
    programId: 'vsip-binh-duong',
    type: MEDIA_TYPE_ENUM.DOCUMENT,
    title: 'Bản đề xuất thông số kỹ thuật nội bộ đang thẩm định',
    description: 'Tài liệu đang trong hàng đợi phê duyệt của ban điều phối.',
    url: '/files/private/internal-spec-draft.pdf',
    visibility: MEDIA_VISIBILITY_ENUM.INTERNAL,
    downloadPermission: DOWNLOAD_PERMISSION_ENUM.NONE,
    usageRights: USAGE_RIGHTS_ENUM.LIMITED_TIME_EVENT,
    consentStatus: 'PENDING',
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PENDING_REVIEW, // Phải bị ẩn với public
    createdAt: '2026-09-27T10:00:00+07:00'
  }
];

// In-memory runtime state with fallback support
let inMemoryMediaAssets = [...SEED_PROGRAM_MEDIA_ASSETS];
let inMemoryAlbums = [...SEED_PROGRAM_ALBUMS];
let inMemoryExchangeRequests = [];

// ----------------------------------------------------------------------------
// 4. STORAGE ACCESS & REPOSITORY HELPERS
// ----------------------------------------------------------------------------

export function getAllProgramMediaAssets() {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.PROGRAM_MEDIA_ASSETS);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.PROGRAM_MEDIA_ASSETS, JSON.stringify(SEED_PROGRAM_MEDIA_ASSETS));
    }
  } catch (err) {
    // fallback to in-memory
  }
  return inMemoryMediaAssets;
}

export function getAllProgramAlbums() {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.PROGRAM_ALBUMS);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.PROGRAM_ALBUMS, JSON.stringify(SEED_PROGRAM_ALBUMS));
    }
  } catch (err) {
    // fallback to in-memory
  }
  return inMemoryAlbums;
}

// ----------------------------------------------------------------------------
// 5. PERMISSION & AUTHORIZATION CONTROLS (SECTIONS 5, 6, 7, 23, 24)
// ----------------------------------------------------------------------------

/**
 * Kiểm tra quyền XEM (View Permission)
 */
export function canUserViewAsset(asset, userContext = null) {
  if (!asset) return false;

  // Q tắc Section 20: Asset chưa duyệt (DRAFT / PENDING_REVIEW / RESTRICTED) không được public
  if (asset.publishStatus !== MEDIA_PUBLISH_STATUS_ENUM.PUBLISHED) {
    // Chỉ admin hoặc internal role mới được xem
    return userContext?.isAdmin || userContext?.role === 'ADMIN' || userContext?.role === 'COORDINATOR';
  }

  // Section 19: Consent phải được cấp
  if (asset.consentStatus !== 'GRANTED') {
    return userContext?.isAdmin || false;
  }

  // Visibility Rules
  if (asset.visibility === MEDIA_VISIBILITY_ENUM.PUBLIC) {
    return true;
  }

  if (asset.visibility === MEDIA_VISIBILITY_ENUM.PROGRAM_PARTICIPANTS) {
    // Section 24: Kiểm tra xem user có phải là người tham dự chương trình hợp lệ
    if (!userContext || !userContext.isAuthenticated) return false;
    if (userContext.isAdmin) return true;
    return !!(userContext.isProgramParticipant && userContext.participatedProgramId === asset.programId);
  }

  if (asset.visibility === MEDIA_VISIBILITY_ENUM.ORGANIZATION_ONLY) {
    if (!userContext || !userContext.isAuthenticated) return false;
    return userContext.organizationId === asset.providerOrganizationId || userContext.organizationId === asset.relatedOrganizationId;
  }

  if (asset.visibility === MEDIA_VISIBILITY_ENUM.INTERNAL) {
    return userContext?.isAdmin || userContext?.isInternalCoordinator || false;
  }

  return false;
}

/**
 * Kiểm tra quyền TẢI XUỐNG (Download Permission - Section 6 & 7)
 * Tách biệt hoàn toàn: canView ≠ canDownload
 */
export function canUserDownloadAsset(asset, userContext = null) {
  if (!asset) return false;

  // Trước hết phải xem được
  if (!canUserViewAsset(asset, userContext)) return false;

  // Kiểm tra permission download riêng biệt
  if (asset.downloadPermission === DOWNLOAD_PERMISSION_ENUM.NONE) {
    return false;
  }

  if (asset.downloadPermission === DOWNLOAD_PERMISSION_ENUM.PUBLIC) {
    return true;
  }

  if (asset.downloadPermission === DOWNLOAD_PERMISSION_ENUM.PARTICIPANTS_ONLY) {
    if (!userContext || !userContext.isAuthenticated) return false;
    if (userContext.isAdmin) return true;
    return !!(userContext.isProgramParticipant && userContext.participatedProgramId === asset.programId);
  }

  if (asset.downloadPermission === DOWNLOAD_PERMISSION_ENUM.AUTHORIZED_ONLY) {
    return userContext?.isAdmin || userContext?.organizationId === asset.providerOrganizationId || false;
  }

  return false;
}

/**
 * YÊU CẦU TẢI XUỐNG BẢO MẬT (SECTION 7: Không dùng direct URL)
 */
export function requestAssetDownload(assetId, userContext = null) {
  const all = getAllProgramMediaAssets();
  const asset = all.find(a => a.id === assetId);
  if (!asset) {
    throw new Error('Tài liệu không tồn tại hoặc đã bị xóa.');
  }

  if (!canUserDownloadAsset(asset, userContext)) {
    throw new Error('Bạn không có quyền tải xuống tệp này. Vui lòng đăng nhập với tài khoản tham dự được cấp quyền.');
  }

  // Ghi nhật ký tải xuống (Section 36 & 43)
  const downloadLog = {
    id: `LOG-DL-${Date.now()}`,
    assetId: asset.id,
    programId: asset.programId,
    userId: userContext?.userId || 'guest',
    organizationId: userContext?.organizationId || null,
    timestamp: new Date().toISOString()
  };

  try {
    if (typeof localStorage !== 'undefined') {
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEDIA_DOWNLOAD_LOGS) || '[]');
      logs.unshift(downloadLog);
      localStorage.setItem(STORAGE_KEYS.MEDIA_DOWNLOAD_LOGS, JSON.stringify(logs));
    }
  } catch (err) {
    // safe ignore
  }

  // Trả về secure temporary download token
  return {
    success: true,
    assetId: asset.id,
    filename: asset.title,
    downloadUrl: asset.url,
    secureToken: `DL-SECURE-${asset.id}-${Date.now().toString(36).toUpperCase()}`,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 phút
  };
}

// ----------------------------------------------------------------------------
// 6. RETRIEVAL & QUERY ENGINE (SECTIONS 3, 15, 16, 17)
// ----------------------------------------------------------------------------

export function getProgramLibrary(programSlugOrId, options = {}, userContext = null) {
  const program = getProgramByIdOrSlug(programSlugOrId);
  if (!program) return null;

  const {
    keyword = '',
    type = 'ALL',
    albumId = 'ALL',
    sessionTag = 'ALL',
    organizationId = 'ALL'
  } = options;

  const allAssets = getAllProgramMediaAssets();
  const allAlbums = getAllProgramAlbums().filter(alb => alb.programId === program.id);

  // 1. Lọc theo programId và quyền xem (Visibility Enforcement)
  let visibleAssets = allAssets.filter(asset => {
    if (asset.programId !== program.id && asset.programId !== program.slug) return false;
    return canUserViewAsset(asset, userContext);
  });

  // 2. Lọc theo Search Keyword (Section 15: Tìm theo tên tài liệu, doanh nghiệp, album, booth)
  if (keyword && keyword.trim()) {
    const q = keyword.trim().toLowerCase();
    visibleAssets = visibleAssets.filter(a =>
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.description && a.description.toLowerCase().includes(q)) ||
      (a.enterpriseName && a.enterpriseName.toLowerCase().includes(q)) ||
      (a.boothCode && a.boothCode.toLowerCase().includes(q)) ||
      (a.category && a.category.toLowerCase().includes(q))
    );
  }

  // 3. Lọc theo Type (IMAGE, VIDEO, DOCUMENT)
  if (type !== 'ALL') {
    visibleAssets = visibleAssets.filter(a => a.type === type);
  }

  // 4. Lọc theo Album
  if (albumId !== 'ALL') {
    visibleAssets = visibleAssets.filter(a => a.albumId === albumId);
  }

  // 5. Lọc theo Session Tag (Section 17: Buổi sáng, 1:1 meeting, opening...)
  if (sessionTag !== 'ALL') {
    visibleAssets = visibleAssets.filter(a => a.sessionTag === sessionTag);
  }

  // 6. Lọc theo Organization
  if (organizationId !== 'ALL') {
    visibleAssets = visibleAssets.filter(a => 
      a.relatedOrganizationId === organizationId || a.providerOrganizationId === organizationId
    );
  }

  // Phân loại các section cho UI (Section 3)
  const momentsPhotos = visibleAssets.filter(a => a.type === MEDIA_TYPE_ENUM.IMAGE);
  
  // Gian hàng & Doanh nghiệp (nhóm theo doanh nghiệp)
  const enterpriseCardsMap = new Map();
  visibleAssets.forEach(a => {
    if (a.relatedOrganizationId && (a.enterpriseName || a.category)) {
      if (!enterpriseCardsMap.has(a.relatedOrganizationId)) {
        enterpriseCardsMap.set(a.relatedOrganizationId, {
          organizationId: a.relatedOrganizationId,
          name: a.enterpriseName,
          category: a.category || 'Công nghiệp & Phụ trợ',
          capabilitySnippet: a.capabilitySnippet || a.description || 'Cung ứng vật tư nhà máy KCN',
          boothCode: a.boothCode || 'Khu giao thương',
          coverImage: a.url || a.thumbnailUrl,
          relatedAssetsCount: 1,
          slug: a.relatedOrganizationId.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
      } else {
        const item = enterpriseCardsMap.get(a.relatedOrganizationId);
        item.relatedAssetsCount += 1;
      }
    }
  });
  const enterpriseShowcases = Array.from(enterpriseCardsMap.values());

  const videos = visibleAssets.filter(a => a.type === MEDIA_TYPE_ENUM.VIDEO);
  const documents = visibleAssets.filter(a => a.type === MEDIA_TYPE_ENUM.DOCUMENT);

  return {
    program,
    albums: allAlbums,
    totalAssetsCount: visibleAssets.length,
    momentsPhotos,
    enterpriseShowcases,
    videos,
    documents
  };
}

// ----------------------------------------------------------------------------
// 7. GỬI YÊU CẦU TRAO ĐỔI (WORKFLOW THẬT - SECTION 10 & 11)
// ----------------------------------------------------------------------------

export function createLibraryExchangeRequest(data) {
  const {
    programId,
    targetOrganizationId,
    targetEnterpriseName = '',
    mediaId = null,
    senderName,
    senderPhone,
    senderEmail,
    senderCompany,
    requirementId = null,
    notes = ''
  } = data;

  if (!programId || !targetOrganizationId) {
    throw new Error('Thiếu thông tin chương trình hoặc doanh nghiệp tiếp nhận.');
  }
  if (!senderName || !senderPhone || !senderPhone.trim()) {
    throw new Error('Vui lòng nhập họ tên và số điện thoại người liên hệ.');
  }

  const requestId = `REQ-EXCHANGE-${Date.now()}`;
  const exchangeRequest = {
    id: requestId,
    source: 'PROGRAM_LIBRARY', // Section 11 Source tracking
    sourceProgramId: programId,
    sourceMediaId: mediaId,
    targetOrganizationId,
    targetEnterpriseName,
    sender: {
      name: senderName.trim(),
      phone: senderPhone.trim(),
      email: senderEmail ? senderEmail.trim() : '',
      company: senderCompany ? senderCompany.trim() : 'Đại diện phòng thu mua'
    },
    requirementId: requirementId || null,
    notes: notes.trim(),
    status: 'PENDING_COORDINATION', // Đi vào Bàn điều phối Page 19
    assignedOwner: 'Lê Minh Quân (Coordinator)',
    nextAction: 'Liên hệ xác minh nhu cầu ghép nối với doanh nghiệp mục tiêu',
    nextActionAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  };

  inMemoryExchangeRequests.unshift(exchangeRequest);

  try {
    if (typeof localStorage !== 'undefined') {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIBRARY_EXCHANGE_REQUESTS) || '[]');
      list.unshift(exchangeRequest);
      localStorage.setItem(STORAGE_KEYS.LIBRARY_EXCHANGE_REQUESTS, JSON.stringify(list));
    }
  } catch (err) {
    // safe ignore
  }

  // Ghi Audit Log (Section 43)
  inMemoryAuditLogs.unshift({
    id: `LOG-EXCHANGE-${Date.now()}`,
    actorUserId: senderEmail || 'guest_buyer',
    action: 'CREATE_LIBRARY_EXCHANGE_REQUEST',
    entityType: 'CONNECTION_REQUEST',
    entityId: requestId,
    programId,
    targetOrganizationId,
    timestamp: new Date().toISOString()
  });

  return {
    success: true,
    requestId,
    exchangeRequest
  };
}

// ----------------------------------------------------------------------------
// 8. ADMIN MANAGEMENT & REVIEW QUEUE (SECTIONS 28, 29, 31, 43)
// ----------------------------------------------------------------------------

export function getMediaReviewQueue(programId = null) {
  const all = getAllProgramMediaAssets();
  return all.filter(a => {
    if (programId && a.programId !== programId) return false;
    return a.publishStatus === MEDIA_PUBLISH_STATUS_ENUM.PENDING_REVIEW || a.publishStatus === MEDIA_PUBLISH_STATUS_ENUM.DRAFT;
  });
}

export function updateMediaAssetAdmin(assetId, updatePayload, adminUserId = 'admin_super') {
  const all = getAllProgramMediaAssets();
  const index = all.findIndex(a => a.id === assetId);
  if (index === -1) {
    throw new Error(`Không tìm thấy tư liệu: ${assetId}`);
  }

  const before = { ...all[index] };
  const after = { ...all[index], ...updatePayload, updatedAt: new Date().toISOString() };

  all[index] = after;
  inMemoryMediaAssets = all;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROGRAM_MEDIA_ASSETS, JSON.stringify(all));
    }
  } catch (err) {
    // safe ignore
  }

  // Ghi Audit Log
  inMemoryAuditLogs.unshift({
    id: `LOG-MEDIA-${Date.now()}`,
    actorUserId: adminUserId,
    action: 'UPDATE_PROGRAM_MEDIA_ASSET',
    entityType: 'MEDIA_ASSET',
    entityId: assetId,
    programId: after.programId,
    before: { publishStatus: before.publishStatus, visibility: before.visibility },
    after: { publishStatus: after.publishStatus, visibility: after.visibility },
    timestamp: new Date().toISOString()
  });

  return { success: true, asset: after };
}

export function approveMediaAssetAdmin(assetId, adminUserId = 'admin_super') {
  return updateMediaAssetAdmin(assetId, {
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PUBLISHED,
    consentStatus: 'GRANTED',
    reviewedBy: adminUserId,
    reviewedAt: new Date().toISOString()
  }, adminUserId);
}

export function bulkUploadMediaAssetsAdmin(programId, filesArray, { defaultAlbumId = null, adminUserId = 'admin_super' } = {}) {
  const all = getAllProgramMediaAssets();
  const newAssets = filesArray.map((f, idx) => ({
    id: `MEDIA-UPLOAD-${Date.now()}-${idx}`,
    programId,
    albumId: defaultAlbumId,
    type: f.type || MEDIA_TYPE_ENUM.IMAGE,
    title: f.title || `Ảnh tải lên ${idx + 1}`,
    description: f.description || '',
    url: f.url || 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: f.thumbnailUrl || f.url || 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&auto=format&fit=crop&q=80',
    dimensions: f.dimensions || '3840x2160',
    fileSize: f.fileSize || '2.4 MB',
    sessionTag: f.sessionTag || SESSION_TAGS_ENUM.OPENING,
    visibility: MEDIA_VISIBILITY_ENUM.PUBLIC,
    downloadPermission: DOWNLOAD_PERMISSION_ENUM.PUBLIC,
    usageRights: USAGE_RIGHTS_ENUM.PUBLIC_PRESS_EDITORIAL,
    consentStatus: 'GRANTED',
    // Section 29 Hard Rule: Bulk uploads default to DRAFT/PENDING_REVIEW, NEVER auto published
    publishStatus: MEDIA_PUBLISH_STATUS_ENUM.PENDING_REVIEW,
    createdBy: adminUserId,
    createdAt: new Date().toISOString()
  }));

  all.unshift(...newAssets);
  inMemoryMediaAssets = all;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROGRAM_MEDIA_ASSETS, JSON.stringify(all));
    }
  } catch (err) {
    // safe ignore
  }

  // Audit
  inMemoryAuditLogs.unshift({
    id: `LOG-BULK-UPLOAD-${Date.now()}`,
    actorUserId: adminUserId,
    action: 'BULK_UPLOAD_PROGRAM_MEDIA',
    entityType: 'MEDIA_ASSET_BATCH',
    entityId: `${programId}-batch-${Date.now()}`,
    count: newAssets.length,
    timestamp: new Date().toISOString()
  });

  return { success: true, count: newAssets.length, assets: newAssets };
}
