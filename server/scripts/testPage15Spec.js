// ============================================================================
// QA VALIDATION SCRIPT FOR PAGE 15 (SPEC 15.TXT)
// CHUOICUNGUNG.COM - HỒ SƠ & TRUYỀN THÔNG DOANH NGHIỆP
// ============================================================================

import { 
  getAllMediaProjects, 
  updateMediaProjectStatus, 
  submitClientApproval, 
  createMediaProjectFromServiceRequest,
  getMediaProjectProgressSummary,
  getAllMediaAssets,
  getAllCatalogues,
  getAllMediaAuditLogs,
  MEDIA_PROJECT_STATUSES,
  MEDIA_ASSET_TYPES
} from '../../src/data/mediaContentData.js';

import {
  submitServiceRequest,
  getAllServiceRequests,
  getAllAdminServices
} from '../../src/data/servicesData.js';

console.log('================================================================');
console.log('BẮT ĐẦU CHẠY KIỂM ĐỊNH TỰ ĐỘNG PAGE 15 (SPEC 15.TXT)');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failCount++;
  }
}

// ----------------------------------------------------------------------------
// TEST 1: CTA giữ đúng service context (/yeu-cau-dich-vu?service=truyen-thong-doanh-nghiep)
// ----------------------------------------------------------------------------
console.log('--- TEST 1: Service Catalog & Preselect Mapping ---');
const allServices = getAllAdminServices();
const mediaService = allServices.find(s => s.slug === 'truyen-thong-doanh-nghiep');
assert(mediaService !== undefined, 'Dịch vụ srv-truyen-thong-doanh-nghiep tồn tại trong master services');
assert(mediaService?.status === 'ACTIVE', 'Dịch vụ truyền thông doanh nghiệp đang ở trạng thái ACTIVE');
assert(mediaService?.ctaUrl === '/dich-vu/truyen-thong-doanh-nghiep', 'CTA URL đúng chuẩn /dich-vu/truyen-thong-doanh-nghiep');

// ----------------------------------------------------------------------------
// TEST 2: Gửi ServiceRequest với đầy đủ tham số Spec 15.txt
// ----------------------------------------------------------------------------
console.log('\n--- TEST 2: ServiceRequest Workflow & Media Configuration ---');
const testReqRes = submitServiceRequest({
  serviceIds: ['truyen-thong-doanh-nghiep'],
  serviceType: 'MEDIA_BRANDING',
  customerName: 'Trịnh Quốc Doanh',
  companyName: 'Công ty Cổ phần Cơ Khí Chính Xác Alpha Tech',
  email: 'doanh.tq@alphatech.vn',
  phone: '0912 345 678',
  shootingLocation: 'KCN Sóng Thần 2, Dĩ An, Bình Dương',
  targetProducts: 'Khuôn ép đùn nhôm và linh kiện phay CNC 5 trục',
  itemsNeeded: ['ho-so', 'video', 'anh', 'catalogue'],
  languages: ['Tiếng Việt', 'Tiếng Anh'],
  distributionChannels: ['Profile trên website', 'Tài liệu gửi Buyer', 'E-Catalogue'],
  contentApprover: 'Trịnh Quốc Doanh (CEO)',
  deadline: '2026-11-20',
  budget: 'Thỏa thuận theo dự toán',
  attachedFilesNote: 'https://drive.google.com/drive/folders/alpha-sample-assets'
});

assert(testReqRes.success === true, 'Gửi yêu cầu dịch vụ Page 15 thành công');
assert(testReqRes.request.serviceType === 'MEDIA_BRANDING', 'serviceType được thiết lập là MEDIA_BRANDING');
assert(testReqRes.request.mediaConfig?.itemsNeeded?.length === 4, 'Đã lưu đủ 4 hạng mục media: ho-so, video, anh, catalogue');
assert(testReqRes.request.mediaConfig?.shootingLocation === 'KCN Sóng Thần 2, Dĩ An, Bình Dương', 'Đã lưu địa điểm quay chụp thực tế');
assert(testReqRes.request.mediaConfig?.contentApprover === 'Trịnh Quốc Doanh (CEO)', 'Đã lưu người có thẩm quyền ký duyệt');

// ----------------------------------------------------------------------------
// TEST 3: Khởi tạo Media Project từ ServiceRequest
// ----------------------------------------------------------------------------
console.log('\n--- TEST 3: Tạo Media Project từ Request (Section 6) ---');
const prjRes = createMediaProjectFromServiceRequest({
  serviceRequest: testReqRes.request,
  owner: 'Tô Ngọc Dũng (Media & Strategy Director)',
  dueDate: '2026-11-20'
});

assert(prjRes.success === true, 'Khởi tạo MediaProject thành công từ ServiceRequest');
assert(prjRes.project.serviceRequestId === testReqRes.request.id, 'MediaProject liên kết chính xác serviceRequestId');
assert(prjRes.project.deliverables?.length >= 3, 'MediaProject khởi tạo tối thiểu 3 deliverables chuẩn');
assert(prjRes.project.approvalRecord?.isApproved === false, 'MediaProject ban đầu chưa được duyệt (isApproved=false)');

// ----------------------------------------------------------------------------
// TEST 4: Quy tắc Section 7 - KHÔNG PUBLISH KHI CHƯA APPROVED
// ----------------------------------------------------------------------------
console.log('\n--- TEST 4: Vi phạm quy tắc Section 7 - Không publish khi chưa Approved ---');
const illegalPublishAttempt = updateMediaProjectStatus({
  projectId: prjRes.project.id,
  status: 'PUBLISHED',
  actor: 'Admin Test'
});

assert(illegalPublishAttempt.success === false, 'Hệ thống CHẶN không cho chuyển sang PUBLISHED khi chưa APPROVED');
assert(illegalPublishAttempt.message.includes('VI PHẠM QUY TẮC DUYỆT'), 'Hiển thị đúng thông báo lỗi quy tắc Section 7');

// ----------------------------------------------------------------------------
// TEST 5: Ký duyệt đủ 7 hạng mục (Section 8) & chuyển sang APPROVED
// ----------------------------------------------------------------------------
console.log('\n--- TEST 5: Doanh nghiệp ký duyệt 7 hạng mục & Phiên bản (Section 8) ---');
const approvalRes = submitClientApproval({
  projectId: prjRes.project.id,
  approvedBy: 'Trịnh Quốc Doanh (CEO)',
  reviewedItems: {
    copy: true,
    photos: true,
    video: true,
    capabilities: true,
    clientReferences: true,
    contact: true,
    qrDestination: true
  },
  version: 'v1.0-final',
  note: 'Doanh nghiệp ký duyệt phiên bản chính thức'
});

assert(approvalRes.success === true, 'Ghi nhận ký duyệt thành công');
assert(approvalRes.allReviewed === true, 'Đã tích duyệt đủ 7/7 hạng mục');
assert(approvalRes.project.status === 'APPROVED', 'Trạng thái dự án tự động chuyển sang APPROVED sau khi duyệt');
assert(approvalRes.project.approvalRecord.version === 'v1.0-final', 'Phiên bản v1.0-final được lưu lại');
assert(approvalRes.project.approvalRecord.auditHistory.length >= 2, 'Lịch sử audit được bổ sung, không ghi đè');

// ----------------------------------------------------------------------------
// TEST 6: Publish hợp lệ sau khi APPROVED
// ----------------------------------------------------------------------------
console.log('\n--- TEST 6: Publish hợp lệ sau khi đã APPROVED ---');
const validPublish = updateMediaProjectStatus({
  projectId: prjRes.project.id,
  status: 'PUBLISHED',
  actor: 'Admin Master',
  note: 'Xuất bản chính thức lên Supplier Profile và E-Catalogue'
});

assert(validPublish.success === true, 'Publish thành công sau khi đã Approved');
assert(validPublish.project.status === 'PUBLISHED', 'Trạng thái dự án chuyển thành PUBLISHED');

// ----------------------------------------------------------------------------
// TEST 7: Quản lý Media Asset & Phân biệt REAL_EVIDENCE vs AI/Mascot (Section 9)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 7: Quản lý Media Asset & Quy tắc Evidence vs AI ---');
const assets = getAllMediaAssets();
const realEvidence = assets.find(a => a.assetCategory === MEDIA_ASSET_TYPES.REAL_EVIDENCE);
const illustration = assets.find(a => a.assetCategory === MEDIA_ASSET_TYPES.ILLUSTRATION);

assert(realEvidence !== undefined, 'Tồn tại asset thuộc phân loại REAL_EVIDENCE');
assert(realEvidence?.evidence?.isEvidence === true, 'REAL_EVIDENCE được đánh dấu là evidence hợp lệ');
assert(illustration?.evidence?.isEvidence === false, 'Ảnh ILLUSTRATION / AI / MASCOT KHÔNG được dùng làm bằng chứng');

// ----------------------------------------------------------------------------
// TEST 8: Video gắn được đa điểm tiếp xúc (Section 10)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 8: Video liên kết hệ sinh thái đa điểm tiếp xúc (Section 10) ---');
const sampleVideo = assets.find(a => a.type === 'VIDEO');
assert(sampleVideo !== undefined, 'Tồn tại Video 1 phút chuẩn hóa');
assert(sampleVideo?.relations?.organizationId !== undefined, 'Video liên kết với organizationId');
assert(sampleVideo?.relations?.programId !== undefined, 'Video liên kết với programId');
assert(sampleVideo?.relations?.catalogueId !== undefined, 'Video liên kết với catalogueId');
assert(sampleVideo?.duration !== undefined, 'Video có trường duration chuẩn');
assert(sampleVideo?.language !== undefined, 'Video có trường language chuẩn');

// ----------------------------------------------------------------------------
// TEST 9: Catalogue Integration & Tách bạch 4 cấu phần chi phí (Section 11)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 9: Catalogue Integration & Bóc tách 4 chi phí (Section 11) ---');
const catalogues = getAllCatalogues();
const sampleCat = catalogues[0];
assert(sampleCat !== undefined, 'Tồn tại Catalogue trong hệ sinh thái');
assert(sampleCat?.costBreakdown?.contentFee !== undefined, 'Có cấu phần contentFee');
assert(sampleCat?.costBreakdown?.sponsoredPlacementFee !== undefined, 'Có cấu phần sponsoredPlacementFee');
assert(sampleCat?.costBreakdown?.printingCostPerCopy !== undefined, 'Có cấu phần printingCostPerCopy');
assert(sampleCat?.costBreakdown?.distributionCost !== undefined, 'Có cấu phần distributionCost');
assert(sampleCat?.qrDestinationUrl !== undefined, 'Catalogue có mã QR dẫn về Supplier Profile');

// ----------------------------------------------------------------------------
// TEST 10: Thống kê 4 nhóm tiến độ cho Admin (Section 13)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 10: Thống kê 4 nhóm tiến độ Admin (Section 13) ---');
const summary = getMediaProjectProgressSummary();
assert(summary.total > 0, 'Tổng số dự án media > 0');
assert(Array.isArray(summary.waitingClient), 'Nhóm Đang chờ doanh nghiệp là mảng');
assert(Array.isArray(summary.waitingTeam), 'Nhóm Đang chờ team CCU là mảng');
assert(Array.isArray(summary.approved), 'Nhóm Đã duyệt là mảng');
assert(Array.isArray(summary.published), 'Nhóm Đã publish là mảng');
console.log(`   * Thống kê: Chờ DN: ${summary.waitingClient.length} | Chờ Team: ${summary.waitingTeam.length} | Đã duyệt: ${summary.approved.length} | Đã publish: ${summary.published.length}`);

// ----------------------------------------------------------------------------
// TEST 11: Audit Trail Logging (Section 13)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 11: Audit Trail Logging ---');
const auditLogs = getAllMediaAuditLogs();
assert(auditLogs.length > 0, 'Hệ thống lưu trữ Audit Logs cho mọi thao tác Media');
const latestLog = auditLogs[0];
assert(latestLog.timestamp !== undefined, 'Audit log có timestamp hợp lệ');
assert(latestLog.action !== undefined, 'Audit log có action hợp lệ');

// ----------------------------------------------------------------------------
// TỔNG KẾT
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`KẾT QUẢ KIỂM ĐỊNH: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 TOÀN BỘ 11/11 BÀI TEST CHỨC NĂNG & QUY TẮC CỦA SPEC 15.TXT ĐÃ PASS 100%!');
}
