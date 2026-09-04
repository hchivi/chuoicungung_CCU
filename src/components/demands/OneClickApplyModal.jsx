import React, { useState } from 'react';
import { 
  X, ShieldCheck, CheckCircle2, Zap, Send, FileText, 
  Building2, Lock, ArrowRight, Award, Layers, Sparkles 
} from 'lucide-react';

export default function OneClickApplyModal({ isOpen, onClose, demand, onApplySuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [leadTime, setLeadTime] = useState('7 - 10 ngày');
  const [notes, setNotes] = useState('');

  if (!isOpen || !demand) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onApplySuccess) onApplySuccess(demand.id);
    }, 1200);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 transition-all">
        
        {/* Header with Dark Modern Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wide">
                  Thuật toán Đóng Gói 1-Click Apply
                </span>
                <h3 className="text-base sm:text-lg font-black font-heading text-white line-clamp-1">
                  Nộp Hồ Sơ Báo Giá Trực Tiếp Đến ERP Nhà Máy
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

            <div className="space-y-2 max-w-lg mx-auto">
              <h4 className="text-xl font-black font-heading text-slate-900">
                Đã Đẩy Hồ Sơ Thành Công Vào Hệ Thống Của Buyer!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Hồ sơ định danh 18 Pha (Catalogue ISO 9001/14001, Báo giá sơ bộ, Huy hiệu KYC Kim Cương) đã được mã hóa và truyền thẳng vào Odoo/ERP của <strong>{demand.isAnonymousBuyer ? demand.anonymousBuyerName : demand.company}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-left text-xs text-slate-700 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-[#0052cc]">
                <ShieldCheck className="w-4 h-4" />
                <span>Quy tắc Bảo mật Danh tính Buyer (Data Masking)</span>
              </div>
              <p className="text-[11.5px] leading-relaxed text-slate-600">
                Khi Trưởng phòng Mua hàng duyệt hồ sơ của bạn và nhấn <strong>[Chấp Thuận Mở Kết Nối]</strong>, số điện thoại & Zalo liên hệ của 2 bên sẽ tự động được hiển thị và gửi thông báo SMS/Zalo.
              </p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-8 py-3 bg-[#0052cc] hover:bg-blue-700 text-white font-bold text-xs font-heading uppercase rounded-xl shadow-md transition cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            
            {/* Target Demand Recap */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  {demand.phaseBadge || `Pha ${demand.phaseId}`}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Mã gói: {demand.biddingCode || demand.id}
                </span>
              </div>

              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 font-heading leading-snug">
                {demand.title}
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Đơn vị mời thầu:</span>
                  <span className="font-bold text-slate-800">
                    {demand.isAnonymousBuyer ? demand.anonymousBuyerName : demand.company}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Ngân sách ước tính:</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    {demand.estBudget || demand.budget}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10.5px]">Khu vực / KCN:</span>
                  <span className="font-bold text-slate-800">
                    {demand.kcn || demand.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Auto-Fetched Digital Profile Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-start space-x-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                <Award className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-amber-900">
                  Hệ thống tự động đính kèm Hồ sơ năng lực số (Digital Profile)
                </span>
                <p className="text-[11.5px] text-amber-800 leading-snug">
                  Bao gồm: Hồ sơ KYC Lớp 3 Kim Cương, Chứng nhận ISO 9001:2015, E-Catalogue sản phẩm và Năng lực nhà máy đã xác thực.
                </p>
              </div>
            </div>

            {/* Inputs: Báo giá & Thời gian giao hàng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Mức giá chào sơ bộ (VNĐ):</span>
                  <span className="text-slate-400 font-normal text-[10.5px]">Tùy chọn</span>
                </label>
                <input
                  type="text"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="VD: 950.000.000 VNĐ hoặc Xem bảng chào giá đính kèm"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:bg-white text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Thời gian triển khai / Giao hàng mẫu:
                </label>
                <input
                  type="text"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  placeholder="VD: 5 - 7 ngày sau khi duyệt mẫu"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Note for Buyer */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">
                Ghi chú cam kết kỹ thuật & điều khoản thanh toán:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Cam kết đúng tiêu chuẩn kỹ thuật, sẵn sàng gửi mẫu tận nơi trong 24h..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:bg-white text-slate-900 resize-none text-xs"
              />
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
                className="px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs font-heading uppercase rounded-xl shadow-lg shadow-orange-600/20 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang đóng gói & truyền API...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>1-Click Nộp Hồ Sơ Trực Tiếp</span>
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
