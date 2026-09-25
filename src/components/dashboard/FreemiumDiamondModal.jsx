import React, { useState } from 'react';
import { 
  Crown, Sparkles, ShieldCheck, CheckCircle2, Lock, 
  X, ArrowRight, Star, DollarSign, Building2, Phone, Mail
} from 'lucide-react';

export default function FreemiumDiamondModal({ isOpen, onClose, lang = 'vi' }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    role: 'Giám Đốc Mua Hàng (Procurement Director)',
    phone: '',
    email: '',
    interestedIndustry: 'Toàn bộ 6 giai đoạn chuỗi cung ứng'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      alert('Đăng ký trải nghiệm Gói Tình Báo FDI Kim Cương thành công! Chuyên viên dữ liệu vĩ mô CCU sẽ kích hoạt quyền truy cập VIP và liên hệ qua điện thoại trong vòng 15 phút.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#071329] text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-amber-500/40 space-y-6 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Diamond Crown */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>FDI VIP DIAMOND INTELLIGENCE SUITE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-heading bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">
            Nâng Cấp Đối Tác Kim Cương — Mở Khóa Tình Báo Vĩ Mô Real-Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Dành riêng cho các Giám đốc Mua hàng FDI, Tổng Giám đốc Nhà máy và Trưởng ban Chuỗi cung ứng muốn nắm bắt trọn vẹn dữ liệu ngách và đối thủ cạnh tranh.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { title: 'Tình Báo Ngách Real-Time', desc: 'Xem chi tiết biên độ giá trúng thầu & sản lượng của đối thủ trong từng KCN.' },
            { title: 'Cảnh Báo Đứt Gãy Nguồn Cung Sớm', desc: 'Dự báo AI trước 30-60 ngày các điểm nghẽn nguyên phụ liệu thô.' },
            { title: 'Khớp Lệnh Ưu Tiên 1-Click', desc: 'Đẩy RFQ lên đầu hàng chờ kết nối với 10.256 nhà máy xác thực.' },
            { title: 'Xuất Dữ Liệu Raw ERP & API', desc: 'Tích hợp luồng dữ liệu tự động vào hệ thống SAP / Oracle / Fast ERP của doanh nghiệp.' }
          ].map((f, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center space-x-2 text-amber-300 font-bold font-heading">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{f.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1 font-heading">
                Họ và Tên <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Văn Hưng"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1 font-heading">
                Chức Danh / Vị Trí <span className="text-amber-400">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              >
                <option>Giám Đốc Mua Hàng (Procurement Director)</option>
                <option>Giám Đốc Nhà Máy (Factory Director)</option>
                <option>Trưởng Phòng Chuỗi Cung Ứng (SCM Manager)</option>
                <option>Tổng Giám Đốc / Chủ Tịch (CEO / Founder)</option>
                <option>Nhà Đầu Tư FDI / Quỹ Đầu Tư</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1 font-heading">
                Tên Doanh Nghiệp / FDI <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Tập đoàn Foxconn / HDBank / TAHOMART"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1 font-heading">
                Số Điện Thoại / Zalo <span className="text-amber-400">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="0912 345 678"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={submitted}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 font-heading cursor-pointer text-xs sm:text-sm tracking-wide"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>{submitted ? 'Đang Đăng Ký...' : 'Kích Hoạt Dùng Thử 14 Ngày Bản Quyền Kim Cương'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
