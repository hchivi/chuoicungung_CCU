import React, { useState } from 'react';
import { 
  X, CheckCircle2, Shield, Building2, Send, Clock, FileCheck, 
  Sparkles, Lock, ArrowRight, Phone, Mail, User, Check
} from 'lucide-react';

export default function StageRequestQuoteModal({ 
  isOpen, 
  onClose, 
  supplier = null, 
  stageTitle = "Giai đoạn 1: Chuẩn bị & Đầu tư",
  phaseTitle = "Tất cả các pha",
  themeColor = "#8b5cf6"
}) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    workEmail: '',
    phone: '',
    projectScale: '10M - 30M USD',
    expectedDate: 'Quý 3/2026',
    requirements: '',
    agreeNDA: true,
    syncPortal: true
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={handleResetAndClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden z-10 transition-all my-auto">
        
        {/* Header with Stage Color Accent */}
        <div 
          className="p-6 sm:p-7 text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${themeColor} 0%, #0f172a 100%)`
          }}
        >
          {/* Close button */}
          <button 
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2 pr-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wide">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>B2B TRUSTED ESCROW MATCHING</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-heading uppercase">
              {supplier ? `Yêu Cầu Báo Giá: ${supplier.name}` : `Tạo Nhu Cầu Báo Giá (${stageTitle})`}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              Hồ sơ yêu cầu (RFQ) được gửi trực tiếp đến Ban Giám Đốc đối tác với cam kết phản hồi SLA &lt; 2h.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[78vh] overflow-y-auto">
          {submitted ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-900 font-heading">
                  Yêu Cầu Báo Giá Đã Gửi Thành Công!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Mã RFQ: <strong className="text-slate-900 font-mono font-bold">#CCU-RFQ-2026-089</strong>. Chuyên viên kết nối B2B và đại diện đối tác <strong>{supplier?.name || "doanh nghiệp"}</strong> sẽ liên hệ bạn trong vòng 2 giờ làm việc.
                </p>
              </div>

              {/* Status checklist */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center text-emerald-700 font-semibold">
                  <Check className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                  Đã kích hoạt thỏa thuận bảo mật dữ liệu NDA
                </div>
                <div className="flex items-center text-emerald-700 font-semibold">
                  <Check className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                  Đã đồng bộ hóa hồ sơ vào hệ thống Quản lý Đấu thầu B2B CCU
                </div>
                <div className="flex items-center text-slate-600">
                  <Clock className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                  Cam kết gửi bảng chào giá sơ bộ trước 17:00 hôm nay
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleResetAndClose}
                  style={{ backgroundColor: themeColor }}
                  className="px-8 py-3 text-white rounded-xl font-bold font-heading shadow-md hover:opacity-90 transition text-sm"
                >
                  Hoàn Tất & Đóng
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Target info badge */}
              {supplier && (
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{supplier.logo}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 font-heading">{supplier.name}</h4>
                      <p className="text-[11px] text-slate-500">{supplier.kycTierLabel} • Cam kết SLA: {supplier.slaHours}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                    ⚡ Xác thực KYC
                  </span>
                </div>
              )}

              {/* Grid 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Họ và tên người đại diện *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Tên Doanh nghiệp / Chủ đầu tư *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Công ty CP Đầu Tư ABC..."
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Email làm việc *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="purchasing@company.com"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Số điện thoại / Zalo *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Quy mô ngân sách dự kiến</label>
                  <select
                    value={formData.projectScale}
                    onChange={(e) => setFormData({ ...formData, projectScale: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  >
                    <option value="Dưới 5M USD">&lt; 5 Triệu USD</option>
                    <option value="5M - 10M USD">5M - 10M USD</option>
                    <option value="10M - 30M USD">10M - 30M USD</option>
                    <option value="30M - 100M USD">30M - 100M USD</option>
                    <option value="Trên 100M USD">&gt; 100 Triệu USD</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tiến độ triển khai</label>
                  <select
                    value={formData.expectedDate}
                    onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  >
                    <option value="Ngay trong tháng">Gấp - Trong 30 ngày tới</option>
                    <option value="Quý 3/2026">Quý 3/2026</option>
                    <option value="Quý 4/2026">Quý 4/2026</option>
                    <option value="Năm 2027">Kế hoạch dài hạn 2027</option>
                  </select>
                </div>
              </div>

              {/* Requirement Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Mô tả chi tiết hạng mục cần báo giá & Tiêu chuẩn yêu cầu *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ví dụ: Cần báo giá gói thẩm duyệt PCCC & kiểm định nền móng nhà máy 2ha tại KCN DEEP C Hải Phòng..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition leading-relaxed"
                />
              </div>

              {/* Toggles & Checkbox */}
              <div className="space-y-2.5 pt-1 border-t border-slate-100">
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeNDA}
                    onChange={(e) => setFormData({ ...formData, agreeNDA: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Áp dụng <strong>Thỏa thuận bảo mật thông tin (NDA 2 chiều)</strong> tự động</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.syncPortal}
                    onChange={(e) => setFormData({ ...formData, syncPortal: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Đồng bộ tiến độ báo giá qua <strong>Cổng B2B Portal</strong></span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  style={{ backgroundColor: themeColor }}
                  className="px-7 py-2.5 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-md hover:opacity-90 transition flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Yêu Cầu Báo Giá Nhanh</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
