import React, { useState } from 'react';
import { 
  X, Lock, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, 
  Building2, Send, AlertTriangle, Gem, Award, FileText, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FactoryKycPaywallModal({ factory, demand, isOpen, onClose, onUpgradeKyc }) {
  const [activeTab, setActiveTab] = useState('paywall'); // 'paywall' | 'submit_fast'
  const [formData, setFormData] = useState({
    supplierName: '',
    taxCode: '',
    contactName: '',
    phone: '',
    email: '',
    keywords: '',
    proposalNote: ''
  });
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const targetName = factory?.name || demand?.factoryName || 'Nhà Máy FDI';
  const targetKcn = factory?.kcnName || demand?.location || 'Khu Công Nghiệp';
  const targetProvince = factory?.province || 'Toàn quốc';

  const handleSubmitFast = (e) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#003d8f] via-[#0052cc] to-[#0066d6] text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="space-y-1.5 min-w-0 pr-4">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[10.5px] font-mono font-bold backdrop-blur-md">
              <Lock className="w-3 h-3 text-amber-300" />
              <span>BẢO VỆ DỮ LIỆU & XÁC THỰC B2B (KYC PAYWALL)</span>
            </div>
            <h3 className="text-base sm:text-lg font-black font-heading line-clamp-1">
              {targetName}
            </h3>
            <p className="text-xs text-blue-100 flex items-center gap-1">
              <span>📍 {targetKcn} • {targetProvince}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
          
          {isSent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black font-heading text-slate-950">
                  Hồ Sơ Của Bạn Đã Được Đóng Gói!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Dữ liệu năng lực đã được chuyển vào hàng đợi duyệt của <strong>{targetName}</strong>. Doanh nghiệp nâng cấp KYC Lớp 2/3 sẽ được thuật toán ưu tiên đẩy lên Top đầu.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs font-mono space-y-1.5 text-slate-700 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mã định danh RFQ:</span>
                  <span className="font-bold text-[#0052cc]">PUSH-FDI-{Math.floor(Math.random() * 89999 + 10000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Trạng thái đẩy hồ sơ:</span>
                  <span className="font-bold text-emerald-600">✓ Đã chuyển tiếp tự động</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Đóng cửa sổ
                </button>
                <Link
                  to="/hoi-hiep-hoi"
                  className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Gem className="w-3.5 h-3.5 text-amber-300" />
                  <span>Xác thực KYC Lớp 3</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Paywall Banner Explanation */}
              <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-black text-amber-950 font-heading">
                      Thông Tin Liên Hệ Được Bảo Vệ Chống Spam B2B
                    </h4>
                    <p className="text-[11.5px] text-amber-900 leading-relaxed">
                      Để đảm bảo tính minh bạch, Ban Thu Mua & FDI không tiếp nhận cuộc gọi chào hàng trực tiếp. Hệ thống sẽ <strong>đóng gói Hồ Sơ Năng Lực (Profile)</strong> của bạn và đẩy tự động (Push Notification) vào Dashboard của Trưởng phòng Thu Mua.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-700 bg-white/80 p-2 rounded-xl border border-amber-200/60 font-medium">
                    <Award className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>KYC Lớp 2 (Vàng):</strong> Xác thực Nhà xưởng</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-700 bg-white/80 p-2 rounded-xl border border-amber-200/60 font-medium">
                    <Gem className="w-4 h-4 text-sky-600 shrink-0" />
                    <span><strong>KYC Lớp 3 (Kim Cương):</strong> Bảo chứng Hiệp hội</span>
                  </div>
                </div>
              </div>

              {/* Fast Profile Dispatch Form */}
              <form onSubmit={handleSubmitFast} className="space-y-3.5">
                <div className="text-xs font-black font-heading text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#0052cc]" />
                  <span>Đóng Gói Profile Năng Lực & Đẩy Vào Dashboard FDI</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Tên Nhà Cung Ứng / Doanh Nghiệp *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Cty TNHH Nam Huy Đồng Nai..."
                      value={formData.supplierName}
                      onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Mã Số Thuế (MST) *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: 0300123456"
                      value={formData.taxCode}
                      onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Người Phụ Trách & SĐT Zalo *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Nguyễn Văn Nam - 0908 123 456"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Từ Khóa Năng Lực Cung Ứng *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Thùng carton 5 lớp, Màng PE, ĐTM..."
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Đề Xuất Chào Giá Sơ Bộ / Năng Lực Cung Ứng</label>
                  <textarea
                    rows="2"
                    placeholder="Mô tả nhanh công suất xưởng, chứng chỉ ISO, mức chiết khấu B2B hoặc kinh nghiệm giao hàng..."
                    value={formData.proposalNote}
                    onChange={(e) => setFormData({ ...formData, proposalNote: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                  ></textarea>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to="/hoi-hiep-hoi"
                    className="text-xs text-[#0052cc] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Lộ trình nâng cấp KYC Lớp 3</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs font-bold shadow-md transition flex items-center space-x-1.5 font-heading cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Đẩy Profile Trực Tiếp</span>
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
