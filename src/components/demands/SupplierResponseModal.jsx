import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, AlertCircle, Send, Building2, MapPin, 
  Clock, ShieldCheck, FileText, Upload, Sparkles, AlertTriangle,
  FileCheck, HelpCircle, Layers, ArrowRight
} from 'lucide-react';
import { 
  getSupplierResponseForRequirement, 
  submitSupplierResponse 
} from '../../data/requirementsData';

export default function SupplierResponseModal({
  isOpen,
  onClose,
  requirement,
  currentUser,
  onOpenAuth,
  onResponseSubmitted
}) {
  const [formData, setFormData] = useState({
    productServiceOffered: '',
    capabilityNote: '',
    serviceArea: 'Toàn quốc',
    moqCapacity: '',
    leadTimeEstimated: '3-7 ngày',
    sampleAvailable: true,
    surveyAvailable: true,
    message: '',
    agreedTerms: false
  });

  const [existingResponse, setExistingResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Lấy ID tổ chức của nhà cung ứng (derive từ session, không giả mạo)
  const supplierOrgId = currentUser?.orgId || currentUser?.taxId || (currentUser?.name ? `SUP-${currentUser.name.replace(/\s+/g, '_')}` : 'SUP_ACTIVE_ORG');
  const supplierName = currentUser?.orgName || currentUser?.companyName || 'Công ty TNHH Cung Ứng Chuỗi Giá Trị Việt';

  useEffect(() => {
    if (isOpen && requirement && currentUser?.isLoggedIn) {
      const existing = getSupplierResponseForRequirement(requirement.id, supplierOrgId);
      if (existing) {
        setExistingResponse(existing);
        setFormData({
          productServiceOffered: existing.productServiceOffered || '',
          capabilityNote: existing.capabilityNote || '',
          serviceArea: existing.serviceArea || 'Toàn quốc',
          moqCapacity: existing.moqCapacity || '',
          leadTimeEstimated: existing.leadTimeEstimated || '3-7 ngày',
          sampleAvailable: existing.sampleAvailable ?? true,
          surveyAvailable: existing.surveyAvailable ?? true,
          message: existing.message || '',
          agreedTerms: true
        });
      } else {
        setExistingResponse(null);
        setFormData(prev => ({
          ...prev,
          productServiceOffered: requirement.productService || requirement.title,
          serviceArea: requirement.province || 'Toàn quốc',
          agreedTerms: false
        }));
      }
      setSubmitSuccess(false);
    }
  }, [isOpen, requirement, currentUser, supplierOrgId]);

  if (!isOpen || !requirement) return null;

  // 1. KIỂM TRA ĐĂNG NHẬP (SECTION 7)
  if (!currentUser?.isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[1200] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0052cc] flex items-center justify-center mx-auto shadow-inner">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 font-heading">
              Xác thực Hồ sơ Doanh nghiệp
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Để phản hồi cơ hội tìm nguồn <strong>{requirement.publicCode}</strong>, doanh nghiệp cần đăng nhập với vai trò <strong>Nhà cung ứng (Supplier)</strong>.
            </p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Thông tin hồ sơ năng lực của bạn sẽ được tự động liên kết mà không cần nhập lại tên hay mã số thuế.</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Đóng lại
            </button>
            <button
              onClick={() => {
                onClose();
                if (onOpenAuth) onOpenAuth();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1.5"
            >
              Đăng nhập ngay
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. KIỂM TRA NHU CẦU ĐÃ ĐÓNG (SECTION 14)
  if (requirement.status === 'CLOSED') {
    return (
      <div className="fixed inset-0 z-[1200] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 font-heading">
            Nhu cầu đã ngừng nhận hồ sơ
          </h3>
          <p className="text-xs text-slate-600">
            Nhu cầu <strong>{requirement.publicCode}</strong> đã đủ hồ sơ phản hồi hoặc quá hạn tiếp nhận. Vui lòng khám phá các nhu cầu khác trên Sàn Nhu Cầu.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition"
          >
            Đã hiểu & Đóng lại
          </button>
        </div>
      </div>
    );
  }

  // XỬ LÝ SUBMIT PHẢN HỒI
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreedTerms) {
      alert('Vui lòng tích cam kết xác nhận có năng lực đáp ứng nhu cầu này.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = submitSupplierResponse({
        requirementId: requirement.id,
        supplierOrganizationId: supplierOrgId,
        supplierName: supplierName,
        productServiceOffered: formData.productServiceOffered,
        capabilityNote: formData.capabilityNote,
        serviceArea: formData.serviceArea,
        moqCapacity: formData.moqCapacity,
        leadTimeEstimated: formData.leadTimeEstimated,
        sampleAvailable: formData.sampleAvailable,
        surveyAvailable: formData.surveyAvailable,
        message: formData.message
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
      if (onResponseSubmitted) onResponseSubmitted(res.response);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6 max-h-[92vh] overflow-y-auto space-y-6 text-slate-900 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-4 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0052cc] text-[11px] font-bold font-mono">
              {requirement.publicCode}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
              {requirement.category}
            </span>
            {existingResponse && (
              <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                ● Bạn đã phản hồi (Trạng thái: {existingResponse.responseStatus})
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading leading-snug">
            Phản hồi: Tôi có khả năng đáp ứng
          </h2>
          <p className="text-xs text-slate-500 line-clamp-1">
            Nhu cầu: {requirement.title}
          </p>
        </div>

        {/* Existing Profile Reuse Badge (Section 7: Không bắt nhập lại dữ liệu đã có) */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              NCC
            </div>
            <div>
              <div className="font-bold text-slate-800 font-heading">{supplierName}</div>
              <div className="text-[11px] text-slate-500">Mã định danh hệ thống: {supplierOrgId}</div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Hồ sơ năng lực đã liên kết
          </span>
        </div>

        {submitSuccess ? (
          /* Success Notification (Section 9: Không gọi SUBMITTED là đã trúng) */
          <div className="p-6 bg-blue-50/60 border border-blue-200 rounded-3xl text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-blue-950 font-heading">
                Đã ghi nhận hồ sơ phản hồi năng lực thành công!
              </h3>
              <p className="text-xs text-blue-800 leading-relaxed max-w-md mx-auto">
                Trạng thái hiện tại: <strong className="font-bold underline">SUBMITTED (Đang chờ thẩm định)</strong>.
                Ban Điều Phối Chuỗi Cung Ứng sẽ rà soát năng lực và thông báo cho bạn khi hồ sơ được đưa vào danh sách Shortlist kết nối với Buyer.
              </p>
            </div>
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-[#0052cc] text-white text-xs font-bold hover:bg-[#0047a5] transition shadow-xs"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          /* Response Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Sản phẩm / Dịch vụ chào ứng */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Sản phẩm / Dịch vụ doanh nghiệp có thể cung cấp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.productServiceOffered}
                onChange={e => setFormData({ ...formData, productServiceOffered: e.target.value })}
                placeholder="VD: May đồng phục Kaki 65/35 may kỹ 2 kim..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none transition"
              />
            </div>

            {/* Năng lực & Mô tả khả năng đáp ứng */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Mô tả năng lực, công nghệ máy móc & kinh nghiệm đáp ứng <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.capabilityNote}
                onChange={e => setFormData({ ...formData, capabilityNote: e.target.value })}
                placeholder="Mô tả tóm tắt năng lực sản xuất, chứng nhận chất lượng (ISO, OEKO-TEX, v.v.) và dự án tương tự đã thực hiện..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none transition leading-relaxed"
              />
            </div>

            {/* Grid: Địa bàn, MOQ, Lead time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  Khu vực phục vụ / Giao hàng
                </label>
                <input
                  type="text"
                  value={formData.serviceArea}
                  onChange={e => setFormData({ ...formData, serviceArea: e.target.value })}
                  placeholder="VD: Đồng Nai, Bình Dương, Toàn quốc"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0052cc]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  Năng lực cung ứng / MOQ
                </label>
                <input
                  type="text"
                  value={formData.moqCapacity}
                  onChange={e => setFormData({ ...formData, moqCapacity: e.target.value })}
                  placeholder="VD: 50.000 bộ / tháng"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0052cc]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  Lead time dự kiến
                </label>
                <input
                  type="text"
                  value={formData.leadTimeEstimated}
                  onChange={e => setFormData({ ...formData, leadTimeEstimated: e.target.value })}
                  placeholder="VD: 5 - 10 ngày sau duyệt mẫu"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0052cc]"
                />
              </div>
            </div>

            {/* Checkbox: Sẵn sàng gửi mẫu & Khảo sát hiện trường */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Điều kiện kiểm chứng thực tế
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sampleAvailable}
                    onChange={e => setFormData({ ...formData, sampleAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="font-semibold text-slate-700">Sẵn sàng gửi mẫu thử đối chứng</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.surveyAvailable}
                    onChange={e => setFormData({ ...formData, surveyAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="font-semibold text-slate-700">Sẵn sàng đón tiếp khảo sát nhà máy</span>
                </label>
              </div>
            </div>

            {/* Thông điệp gửi Hội đồng điều phối & Buyer */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Thông điệp hoặc ghi chú thêm (Tùy chọn)
              </label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Nhập ghi chú thêm cho ban điều phối kết nối..."
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0052cc]"
              />
            </div>

            {/* Cam kết tuân thủ */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreedTerms}
                  onChange={e => setFormData({ ...formData, agreedTerms: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 mt-0.5 shrink-0"
                />
                <span className="text-slate-700 leading-relaxed">
                  Tôi xác nhận doanh nghiệp <strong>{supplierName}</strong> có đủ năng lực cung ứng, cam kết tính chính xác của hồ sơ và đồng ý để Ban Điều Phối rà soát chuyển tiếp tới Buyer.
                </span>
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-6 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang gửi phản hồi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{existingResponse ? 'Cập nhật phản hồi' : 'Gửi phản hồi năng lực'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
