import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, Sparkles, Send, Building2, User, Mail, Phone, Tag } from 'lucide-react';
import { registerProgramInterest } from '../../data/programsData';

export default function ProgramInterestModal({ program, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    role: 'SUPPLIER',
    needs: '',
    consent: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!program) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      setErrorMsg('Vui lòng tích chọn đồng ý nhận thông báo từ Ban tổ chức.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      registerProgramInterest({
        programId: program.id,
        programTitle: program.title || program.name,
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        categoryId: program.relations?.categoryIds?.[0] || null,
        provinceId: program.provinceId || null,
        needs: formData.needs,
        consent: true
      });

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tiếp Nhận Quan Tâm Chương Trình</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black font-heading line-clamp-2">
            {program.title || program.name}
          </h3>
          <p className="text-xs text-blue-200/90 mt-1">
            Mã chương trình: <strong className="font-mono text-white">{program.publicCode || program.id}</strong> • {program.location}
          </p>
        </div>

        {/* Disclaimer Notice (Hard Rule Section 14) */}
        <div className="p-4 bg-amber-50 border-b border-amber-200/80 text-xs text-amber-900 flex items-start space-x-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-black uppercase tracking-wide block text-[11px] text-amber-800">
              Quy Tắc Vận Hành: Đăng Ký Quan Tâm ≠ Đăng Ký Tham Gia
            </span>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              Việc để lại thông tin tại bước này giúp Ban tổ chức gửi thông báo sớm nhất khi mở cổng chính thức.
              <strong> Không giữ chỗ, không tạo phiên gặp và không phát sinh bất kỳ khoản phí nào.</strong>
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900 font-heading">
                Tiếp Nhận Quan Tâm Thành Công!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Hệ thống đã lưu thông tin và sẽ gửi email/tin nhắn thông báo đến quý doanh nghiệp ngay khi chương trình mở đăng ký chính thức.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Họ và tên người liên hệ *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Vai trò của doanh nghiệp *</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="SUPPLIER">Nhà cung ứng (Supplier)</option>
                    <option value="BUYER">Người mua / Nhà máy (Buyer)</option>
                    <option value="FACTORY">Nhà xưởng sản xuất (Factory)</option>
                    <option value="PARTNER">KCN / Hiệp hội / Đối tác</option>
                  </select>
                </div>
              </div>

              {/* Company */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tên công ty / Tổ chức *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Công ty TNHH Cơ Khí & Tự Động Hóa Vina"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email doanh nghiệp *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Số điện thoại / Zalo *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Needs Note */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Năng lực hoặc Nhóm nhu cầu mong muốn kết nối:
                </label>
                <textarea
                  rows={2}
                  value={formData.needs}
                  onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                  placeholder="Ví dụ: Mong muốn tiếp cận các nhà máy FDI ngành bán dẫn, giới thiệu đồ gá jig..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-600 leading-snug">
                    Tôi xác nhận đồng ý nhận thông báo cập nhật về sự kiện này từ Ban Điều Phối CHUOICUNGUNG.COM qua Email/Zalo.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-slate-600 transition"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Đăng Ký Quan Tâm'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
