import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle, FileText, Building2, Phone, Mail, User, Clock, Sparkles } from 'lucide-react';
import { getEnterpriseAvatarImage, getEnterpriseKYCLevel } from '../../utils/companyUtils';

export default function SupplierRequestQuoteModal({ supplier, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    projectName: '',
    requirements: '',
    quantity: '',
    targetDeadline: '',
    contactName: '',
    phone: '',
    email: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !supplier) return null;

  const kyc = getEnterpriseKYCLevel(supplier);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      projectName: '',
      requirements: '',
      quantity: '',
      targetDeadline: '',
      contactName: '',
      phone: '',
      email: '',
      companyName: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#072348] via-[#0052cc] to-[#0284c7] text-white p-5 sm:p-6 relative">
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 p-1 shrink-0 overflow-hidden flex items-center justify-center">
              <img 
                src={getEnterpriseAvatarImage(supplier)} 
                alt={supplier.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-sky-200 flex items-center gap-1 font-mono">
                  {kyc.icon} KYC {kyc.label}
                </span>
                <span className="text-[11px] text-white/80 font-mono">MST: {supplier.taxCode || 'Xác thực'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black font-heading line-clamp-1 text-white">
                Gửi Yêu Cầu Báo Giá: {supplier.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-8 sm:p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-slate-900 font-heading">
                Yêu Cầu Báo Giá Đã Được Gửi Thành Công!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Hệ thống sàn B2B Chuỗi Cung Ứng đã chuyển tiếp yêu cầu của bạn tới bộ phận kinh doanh của <strong className="text-slate-900">{supplier.name}</strong>.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 max-w-md mx-auto text-left space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Cam kết phản hồi trong vòng 24 giờ làm việc.</span>
              </div>
              <p className="text-blue-700 text-[11px]">Thông báo chi tiết và file báo giá sơ bộ sẽ được gửi về email & Zalo của bạn.</p>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Project / Product Name */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#0052cc]" />
                  Tên sản phẩm / Gói thầu / Yêu cầu gia công *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Báo giá 5.000 hộp quà tết 9:16 hoặc Gia công 500 jig CNC..."
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none"
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Số lượng dự kiến *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 1.000 cái, 5 tấn, 1 lô..."
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none"
                />
              </div>

              {/* Deadline */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Thời hạn cần báo giá</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Trong 24h, Trước ngày 15/10..."
                  value={formData.targetDeadline}
                  onChange={(e) => setFormData({ ...formData, targetDeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none"
                />
              </div>

              {/* Requirements & Specs */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Mô tả quy cách kỹ thuật & Tiêu chuẩn yêu cầu</label>
                <textarea
                  rows="3"
                  placeholder="Kích thước, vật liệu (Inox 304, giấy Kraft 350gsm...), tiêu chuẩn xuất khẩu, chứng nhận ISO..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none"
                />
              </div>

              {/* Contact Info Header */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-[#0052cc] uppercase tracking-wider font-mono">
                  Thông Tin Người Mua / Đơn Vị Mời Thầu
                </span>
              </div>

              {/* Contact Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Họ và tên người liên hệ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Số điện thoại / Zalo *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0912 345 678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email nhận báo giá *
                </label>
                <input
                  type="email"
                  required
                  placeholder="purchasing@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none"
                />
              </div>

              {/* Company Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Công ty / Nhà máy mời thầu
                </label>
                <input
                  type="text"
                  placeholder="Công ty TNHH Sản Xuất ABC..."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-[#0047a5] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Yêu Cầu Báo Giá Ngay</span>
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
