import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  FileText 
} from 'lucide-react';
import { submitCatalogueConnectionRequest } from '../../data/cataloguesData';

export default function CatalogueBusinessRequestModal({ 
  isOpen, 
  onClose, 
  catalogue, 
  edition, 
  entry 
}) {
  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [requirementSummary, setRequirementSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  if (!isOpen || !entry) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) {
      alert('Vui lòng điền họ tên người liên hệ và số điện thoại.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = submitCatalogueConnectionRequest({
        catalogueId: catalogue?.id,
        editionId: edition?.id,
        entryId: entry?.id,
        targetOrganizationId: entry.organizationId,
        targetOrganizationName: entry.organizationName,
        contactName,
        companyName,
        contactPhone,
        contactEmail,
        requirementSummary
      });
      setIsSubmitting(false);
      setSubmittedResult(res);
    }, 500);
  };

  const handleResetAndClose = () => {
    setSubmittedResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-[#072847] text-white flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
              Kết Nối B2B Chính Ngạch Qua Bàn Điều Phối
            </span>
            <h2 className="text-base sm:text-lg font-black font-heading leading-tight">
              Gửi Yêu Cầu Cung Ứng
            </h2>
            <div className="text-xs text-blue-200 truncate max-w-sm">
              Tới: <strong className="text-white">{entry.organizationName}</strong>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submittedResult ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-mono font-bold">
                Mã kết nối: {submittedResult.id}
              </span>
              <h3 className="text-base font-black text-slate-900 font-heading">
                Yêu Cầu Kết Nối Đã Được Khởi Tạo!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Yêu cầu đã được chuyển tới Bàn Điều Phối Trung Tâm CCU để thẩm định nhu cầu và mở kênh kết nối an toàn với <strong>{entry.organizationName}</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Bảo mật danh tính & thông tin liên hệ (Section 40):</span>
              </div>
              <div>Số điện thoại của quý khách không bị công khai trên website. Bàn Điều Phối sẽ trực tiếp hỗ trợ ghép nối báo giá và lịch trao đổi mẫu phẩm.</div>
            </div>

            <button
              onClick={handleResetAndClose}
              type="button"
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            
            <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 flex items-center justify-between">
              <span className="truncate">Nguồn: <strong>{catalogue?.title}</strong></span>
              <span className="text-slate-500 shrink-0 font-mono ml-2">{edition?.editionCode}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Họ và tên bạn *</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tên doanh nghiệp / Nhà máy</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nhà máy ABC..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="0912 345 678"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email công vụ</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="buyer@factory.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nội dung nhu cầu / Yêu cầu báo giá</label>
              <textarea
                value={requirementSummary}
                onChange={(e) => setRequirementSummary(e.target.value)}
                placeholder="Ví dụ: Cần báo giá 500 bộ đồng phục công nhân kaki và 200 áo polo cao cấp giao tại KCN VSIP 1 trong tháng 5..."
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition"
              />
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-[10.5px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Yêu cầu được bảo mật thông tin liên lạc và điều phối chính ngạch bởi CCU.</span>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Đang gửi...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Yêu Cầu Kết Nối</span>
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
