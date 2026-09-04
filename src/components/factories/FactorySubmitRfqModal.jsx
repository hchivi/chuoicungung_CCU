import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, Building2, MapPin, Sparkles, FileText, Lock, AlertCircle } from 'lucide-react';

export default function FactorySubmitRfqModal({ factory, demand, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    supplierName: '',
    taxCode: '',
    contactPerson: '',
    phone: '',
    email: '',
    phaseId: demand?.phaseId || '4.1',
    capabilities: '',
    quoteEstimate: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const targetName = factory?.name || demand?.factoryName || 'Ban Mua Hàng Nhà Máy FDI';
  const targetLocation = factory?.province || demand?.location || 'Khu Công Nghiệp';
  const targetKcn = factory?.kcnName || demand?.location || 'KCN';

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003d8f] via-[#0052cc] to-[#0066d6] text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="space-y-1.5 min-w-0 pr-6">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-mono font-bold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>CỔNG NỘP HỒ SƠ NĂNG LỰC & BÁO GIÁ B2B</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-heading line-clamp-1">
              Gửi Hồ Sơ Tới {targetName}
            </h3>
            <p className="text-xs text-blue-100 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
              <span>{targetKcn} • {targetLocation}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-black shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 font-heading">
                  Đã Gửi Hồ Sơ Thành Công!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Hồ sơ năng lực của doanh nghiệp bạn đã được chuyển thẳng vào hộp thư xét duyệt của <strong>{targetName}</strong>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2 text-slate-700 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mã tiếp nhận RFQ:</span>
                  <span className="font-bold text-[#0052cc]">RFQ-CCU-{Math.floor(Math.random() * 89999 + 10000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Thời gian phản hồi:</span>
                  <span className="font-bold text-emerald-600">Trong 24h làm việc</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Hoàn tất & Đóng
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Data Masking Notice Alert */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3 text-xs text-blue-900 flex items-start space-x-2.5">
                <Lock className="w-4 h-4 text-[#0052cc] shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-relaxed">
                  <strong className="font-bold">Bảo Mật & Tránh Spam B2B:</strong>
                  <p className="text-[11px] text-blue-800">
                    Hệ thống bảo vệ danh tính & thông tin liên lạc trực tiếp của Trưởng phòng Mua hàng. Hồ sơ của bạn được gửi trực tiếp vào hệ thống tiếp nhận để nhà máy chủ động liên hệ lại.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tên Doanh Nghiệp Nhà Cung Cấp *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Công Ty TNHH Sản Xuất ABC..."
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mã Số Thuế (MST) *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0100584933"
                    value={formData.taxCode}
                    onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Người Liên Hệ & Chức Vụ *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A - GĐ Kinh Doanh"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Số Điện Thoại Zalo / Hotline *</label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0908 123 456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Năng Lực Cung Ứng & Thế Mạnh Nổi Bật</label>
                <textarea
                  rows="3"
                  placeholder="Mô tả sản phẩm, công suất xưởng, chứng chỉ ISO/CE, kinh nghiệm cung ứng cho các nhà máy tương tự..."
                  value={formData.capabilities}
                  onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs font-bold shadow-md transition flex items-center space-x-2 font-heading disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Đang gửi hồ sơ...' : 'Gửi Hồ Sơ Trực Tiếp'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
