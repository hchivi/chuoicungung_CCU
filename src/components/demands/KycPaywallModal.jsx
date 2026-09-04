import React from 'react';
import { X, Lock, ShieldCheck, Award, ArrowRight, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KycPaywallModal({ isOpen, onClose, demand }) {
  if (!isOpen || !demand) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 transition-all">
        
        {/* Top Lock Icon Badge with Glowing Aura */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Golden Aura & Lock */}
          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30 mb-4 animate-pulse">
            <Lock className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>

          <span className="inline-block text-[11px] font-mono font-bold tracking-widest uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full mb-2">
            RÀO CẢN BẢO CHỨNG KYC B2B
          </span>

          <h3 className="text-lg sm:text-xl font-black font-heading text-white leading-tight">
            Gói Thầu Này Yêu Cầu Đối Tác KYC Lớp 2 (Odoo) Hoặc Lớp 3
          </h3>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Để bảo vệ các Nhà máy FDI khỏi tình trạng thư rác &amp; phá giá không bảo đảm chất lượng, hệ thống chỉ mở cổng đấu thầu trực tiếp cho Doanh nghiệp đã xác thực KYC.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Target Demand Info */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-blue-700">{demand.phaseBadge || `Pha ${demand.phaseId}`}</span>
              <span className="font-mono text-slate-500">Mã: {demand.biddingCode || demand.id}</span>
            </div>
            <p className="font-bold text-slate-800 line-clamp-1">{demand.title}</p>
            <div className="text-emerald-700 font-mono font-bold text-right pt-0.5">
              Ngân sách: {demand.estBudget || demand.budget}
            </div>
          </div>

          {/* Benefits of KYC Upgrade */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-slate-900 font-heading uppercase text-[11px] tracking-wider text-slate-500">
              Quyền lợi khi nâng cấp Huy hiệu KYC Doanh nghiệp:
            </h4>

            <ul className="space-y-2">
              <li className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>1-Click Nộp Báo Giá:</strong> Đẩy thẳng Digital Profile vào ERP/Odoo của Buyer.</span>
              </li>
              <li className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Mở khóa liên hệ Trưởng phòng Mua hàng:</strong> Xem Zalo/Số điện thoại sau khi được duyệt.</span>
              </li>
              <li className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Nhận thông báo Zalo Auto-Match tức thì:</strong> Khi có gói thầu phù hợp năng lực 18 Pha.</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/dinh-vi-doanh-nghiep"
              onClick={onClose}
              className="w-full sm:flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs font-heading uppercase rounded-xl shadow-lg shadow-amber-600/20 transition flex items-center justify-center space-x-2 text-center"
            >
              <Sparkles className="w-4 h-4" />
              <span>Nâng Cấp KYC Ngay (Không Bỏ Lỡ Deal)</span>
            </Link>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Đóng
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
