import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, Zap, Building2, Lock, Sparkles } from 'lucide-react';

export default function FastRfqModal({ isOpen, onClose, initialData = {} }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    phaseId: initialData.phaseId || '1.1',
    isAnonymous: initialData.isAnonymous ?? true,
    budget: '',
    quantity: '',
    companyName: '',
    phone: '',
    email: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003d8f] via-[#0052cc] to-[#0284c7] text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wide">
                  Fast-RFQ • Đăng Nhu Cầu Nhanh
                </span>
                <h3 className="text-base sm:text-lg font-black font-heading text-white">
                  Phát Lệnh Thu Mua B2B Tức Thì
                </h3>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h4 className="text-xl font-black font-heading text-slate-900">
                Đã Phát Lệnh Thu Mua Lên Sàn Thành Công!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Thuật toán Auto-Match đã kích hoạt và gửi thông báo Zalo/Email tới các nhà cung ứng đủ chuẩn KYC thuộc đúng Pha năng lực.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-left text-xs text-slate-700 space-y-1">
              <div className="flex items-center space-x-2 font-bold text-[#0052cc]">
                <ShieldCheck className="w-4 h-4" />
                <span>Trạng thái bảo vệ danh tính (Data Masking)</span>
              </div>
              <p className="text-[11.5px] text-slate-600">
                {formData.isAnonymous 
                  ? 'Nhu cầu của bạn được hiển thị ẨN DANH để tránh bị sale làm phiền. Chỉ khi bạn bấm duyệt nhà cung ứng, số điện thoại mới được kết nối.'
                  : 'Nhu cầu được hiển thị công khai kèm thông tin doanh nghiệp.'}
              </p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-8 py-3 bg-[#0052cc] hover:bg-blue-700 text-white font-bold text-xs font-heading uppercase rounded-xl shadow-md transition cursor-pointer"
            >
              Xác nhận &amp; Xem Sàn Giao Dịch
            </button>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Title / Description */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-800">
                Tên gói nhu cầu / Chi tiết cần mua: *
              </label>
              <textarea
                required
                rows={3}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="VD: Cần tìm nhà máy may 5.000 bộ đồng phục chống tĩnh điện ESD Cleanroom cho KCN Yên Phong..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:bg-white text-slate-900 resize-none text-xs"
              />
            </div>

            {/* Phase selection & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Chọn Pha Chuỗi Cung Ứng:</label>
                <select
                  value={formData.phaseId}
                  onChange={(e) => setFormData({ ...formData, phaseId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
                >
                  <option value="1.1">Pha 1.1 - Logistics Siêu trường & Hải quan</option>
                  <option value="2.1">Pha 2.1 - Tổng thầu Xây dựng EPC & M&E</option>
                  <option value="2.3">Pha 2.3 - Môi trường & PCCC</option>
                  <option value="4.1">Pha 4.1 - Bao bì, Thùng Carton & In ấn</option>
                  <option value="5.1">Pha 5.1 - Tuyển dụng & Đào tạo lao động</option>
                  <option value="5.3">Pha 5.3 - Đồng phục & Bảo hộ (PPE)</option>
                  <option value="6.1">Pha 6.1 - Quà tặng, Bao bì & Phúc lợi</option>
                  <option value="6.3">Pha 6.3 - Số hóa, Phần mềm MES & Tự động hóa</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Ngân sách dự kiến (Tùy chọn):</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="VD: 1 - 2 Tỷ VNĐ"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
                />
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5 pr-3">
                <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Đấu thầu Ẩn danh (Bảo vệ thông tin Buyer)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Mã hóa tên công ty và số điện thoại, chống telesale làm phiền.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0052cc]"></div>
              </label>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Tên Nhà máy / Doanh nghiệp: *</label>
                <input
                  required
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Tên doanh nghiệp của bạn"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Số điện thoại / Zalo người phụ trách: *</label>
                <input
                  required
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="09xx xxx xxx"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-xs transition"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-[#003d8f] via-[#0052cc] to-[#0284c7] hover:from-[#002f70] hover:to-[#0041a3] text-white font-extrabold text-xs font-heading uppercase rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang phát lệnh...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Phát Lệnh Thu Mua</span>
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
