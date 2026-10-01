import React, { useState } from 'react';
import { Mail, Phone, Building2, Bell, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { registerProgramNotificationConsent, PROGRAM_INDUSTRIES, PROGRAM_ZONES } from '../../data/programsData';

export default function ProgramCustomNotificationBlock() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    role: 'SUPPLIER',
    category: 'Cơ khí chính xác & Bán dẫn',
    zone: 'Miền Nam',
    province: '',
    consent: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      setErrorMsg('Vui lòng tích chọn đồng ý nhận thông báo từ hệ thống.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      registerProgramNotificationConsent({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        category: formData.category,
        zone: formData.zone,
        province: formData.province,
        consent: true
      });

      setIsSubmitted(true);
      setIsSubmitting(false);
    } catch (err) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl border border-blue-900/60 p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        
        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5 text-blue-400" />
            <span>Thông Báo Tự Động Phù Hợp Nhu Cầu</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-heading text-white">
            CHƯA CÓ CHƯƠNG TRÌNH PHÙ HỢP?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Đăng ký nhận thông tin khi có chương trình kết nối giao thương phù hợp với địa bàn và nhóm nhu cầu chuyên biệt của doanh nghiệp bạn.
          </p>
        </div>

        {/* Content Form */}
        {isSubmitted ? (
          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-3 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white font-heading">
              Đăng Ký Nhận Thông Báo Thành Công!
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hệ thống sẽ chủ động gửi thư mời ngay khi có chương trình khớp với ngành <strong>{formData.category}</strong> tại khu vực <strong>{formData.zone}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Họ tên người đại diện *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Tên công ty / Tổ chức *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Công ty TNHH Cơ Khí..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Email nhận thông báo *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Số điện thoại / Zalo *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912 345 678"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Vai trò tham gia *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/20 text-white focus:outline-none focus:border-blue-400 text-xs"
                >
                  <option value="SUPPLIER">Nhà cung ứng (Supplier)</option>
                  <option value="BUYER">Người mua / Nhà máy (Buyer)</option>
                  <option value="PARTNER">KCN / Hiệp hội / Đối tác</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Ngành quan tâm *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/20 text-white focus:outline-none focus:border-blue-400 text-xs"
                >
                  {PROGRAM_INDUSTRIES.filter(i => i !== 'Tất cả ngành hàng').map((ind, idx) => (
                    <option key={idx} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Địa bàn / KCN mong muốn</label>
                <select
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/20 text-white focus:outline-none focus:border-blue-400 text-xs"
                >
                  {PROGRAM_ZONES.filter(z => z.id !== 'all').map((zone, idx) => (
                    <option key={idx} value={zone.name}>{zone.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Consent check */}
            <div className="pt-2">
              <label className="flex items-start space-x-2.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-400"
                />
                <span className="text-[11px] leading-snug">
                  Đồng ý nhận thông báo qua Email/Zalo khi có chương trình mới đúng nhóm ngành và địa bàn đăng ký. Dữ liệu này được lưu riêng và không tự ý gửi quảng cáo rác.
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-3 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Đang lưu...' : 'ĐĂNG KÝ NHẬN THÔNG TIN CHƯƠNG TRÌNH'}
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
}
