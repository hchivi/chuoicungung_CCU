import React, { useState } from 'react';
import { 
  X, Building2, Calendar, MapPin, ShieldCheck, Mail, Phone, 
  User, CheckCircle2, AlertTriangle, Sparkles, Send, Lock, ArrowRight,
  Globe, Briefcase
} from 'lucide-react';

const FREE_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'mail.ru'];

export default function KcnSiteVisitModal({ isOpen, onClose, kcn, logisticsInfo }) {
  const [formData, setFormData] = useState({
    companyName: '',
    corporateEmail: '',
    contactName: '',
    phone: '',
    investorCountry: 'Japan (Nhật Bản)',
    desiredArea: '3 - 5 Ha',
    startDate: 'Q1 / 2026',
    industry: 'Điện tử & Bán dẫn',
    notes: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !kcn) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Check Corporate Email (Block personal free emails to prevent spam as per FDI guidelines)
    const emailParts = formData.corporateEmail.trim().toLowerCase().split('@');
    if (emailParts.length !== 2 || FREE_EMAIL_DOMAINS.includes(emailParts[1])) {
      setErrorMsg('Vui lòng sử dụng Email Doanh nghiệp chính thức (VD: name@samsung.com, contact@corporation.com). Hệ thống từ chối các email cá nhân (Gmail, Yahoo...) để đảm bảo tiêu chuẩn làm việc B2B với Ban Quản Lý KCN.');
      return;
    }

    if (!formData.companyName.trim() || !formData.contactName.trim() || !formData.phone.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-r from-[#003d8f] via-[#0052cc] to-[#0284c7] text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold font-mono uppercase tracking-wider mb-2 border border-white/20">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>CỔNG THẨM ĐỊNH THỰC ĐỊA B2B CHÍNH THỨC</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
            Đăng Ký Khảo Sát & Làm Việc Thực Địa KCN
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 font-normal mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Địa điểm: <strong className="text-white font-bold">{kcn.name}</strong> ({kcn.province})</span>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 font-heading">
                  Yêu Cầu Khảo Sát Đã Được Gửi Thành Công!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Hồ sơ thẩm định đầu tư của <strong>{formData.companyName}</strong> đã được chuyển trực tiếp đến Ban Quản Lý <strong>{kcn.name}</strong> và Đội ngũ Pháp lý Đầu tư CCU.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs text-slate-600 space-y-1 max-w-md mx-auto font-mono">
                <div>🏢 <strong>Chủ đầu tư:</strong> {kcn.name}</div>
                <div>📩 <strong>Email DN tiếp nhận:</strong> {formData.corporateEmail}</div>
                <div>📐 <strong>Quỹ đất đăng ký:</strong> {formData.desiredArea}</div>
                <div>📅 <strong>Thời gian phản hồi:</strong> Trong vòng 2 - 4 giờ làm việc</div>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-[#0052cc] hover:bg-[#0041a3] text-white rounded-xl font-bold text-xs font-heading uppercase transition shadow-md"
              >
                Hoàn Tất & Đóng
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Anti-Spam Notice */}
              <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200/80 flex items-start space-x-3 text-xs text-blue-900">
                <Lock className="w-4 h-4 text-[#0052cc] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="font-bold">Bảo Mật & Tiêu Chuẩn B2B FDI:</strong>
                  <p className="text-slate-600 leading-snug">
                    Hệ thống tự động lọc email spam. Yêu cầu quý doanh nghiệp nhập đúng Email Doanh Nghiệp để Ban Quản Lý KCN tiếp nhận và xuất trình xe đưa đón khảo sát thực địa.
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 flex items-start space-x-2.5 text-xs text-rose-700 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Company Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tên Doanh Nghiệp / Tập Đoàn FDI <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="VD: Samsung Electronics Vietnam / Mitsui Corp"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"
                    required
                  />
                </div>

                {/* Corporate Email */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Doanh Nghiệp (Corporate Email) <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="email"
                    name="corporateEmail"
                    value={formData.corporateEmail}
                    onChange={handleChange}
                    placeholder="name@company.com (Chặn Gmail/Yahoo)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-medium text-slate-900"
                    required
                  />
                </div>

                {/* Contact Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Họ Tên Người Phụ Trách / Giám Đốc <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="VD: Mr. Tanaka / Nguyễn Văn An"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Số Điện Thoại / WhatsApp / Zalo <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+84 9xx xxx xxx / +81 90 xxxx xxxx"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-medium text-slate-900"
                    required
                  />
                </div>

                {/* Investor Country */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Quốc Gia Nguồn Vốn</span>
                  </label>
                  <select
                    name="investorCountry"
                    value={formData.investorCountry}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-slate-900"
                  >
                    <option value="Japan (Nhật Bản)">Nhật Bản (Japan)</option>
                    <option value="South Korea (Hàn Quốc)">Hàn Quốc (South Korea)</option>
                    <option value="Taiwan (Đài Loan)">Đài Loan (Taiwan)</option>
                    <option value="Singapore">Singapore</option>
                    <option value="USA / EU (Mỹ & Châu Âu)">Mỹ & Châu Âu (USA / EU)</option>
                    <option value="China (Trung Quốc)">Trung Quốc (China)</option>
                    <option value="Vietnam (Doanh nghiệp Việt Nam)">Việt Nam (Nội địa)</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                {/* Desired Area */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Nhu Cầu Diện Tích Đất</span>
                  </label>
                  <select
                    name="desiredArea"
                    value={formData.desiredArea}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-slate-900"
                  >
                    <option value="1 - 3 Ha">1 - 3 Ha (Quy mô vừa)</option>
                    <option value="3 - 5 Ha">3 - 5 Ha (Tiêu chuẩn)</option>
                    <option value="5 - 10 Ha">5 - 10 Ha (Quy mô lớn)</option>
                    <option value="10 - 20 Ha+">10 - 20 Ha+ (Tập đoàn lớn)</option>
                    <option value="Thuê nhà xưởng xây sẵn (5.000m² - 20.000m²)">Thuê nhà xưởng xây sẵn (RBF)</option>
                  </select>
                </div>

                {/* Industry */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ngành Nghề Sản Xuất Mục Tiêu</span>
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-slate-900"
                  >
                    <option value="Điện tử & Bán dẫn (Semiconductor / Electronics)">Điện tử & Bán dẫn (Semiconductor / Electronics)</option>
                    <option value="Cơ khí chính xác & Tự động hóa">Cơ khí chính xác & Chế tạo máy</option>
                    <option value="Dệt may, Giày da & Thời trang xuất khẩu">Dệt may, Giày da & Thời trang xuất khẩu</option>
                    <option value="Bao bì, Màng co & In ấn công nghiệp">Bao bì, Màng co & In ấn công nghiệp</option>
                    <option value="Chế biến Thực phẩm & F&B (HACCP/ISO)">Chế biến Thực phẩm & F&B (HACCP/ISO)</option>
                    <option value="Dược phẩm & Thiết bị Y tế (GMP Cleanroom)">Dược phẩm & Thiết bị Y tế (GMP Cleanroom)</option>
                    <option value="Logistics & Kho bãi thương mại">Logistics, Kho vận & Chuỗi cung ứng</option>
                  </select>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#003d8f] via-[#0052cc] to-[#0284c7] hover:from-[#002f70] hover:to-[#0041a3] text-white rounded-xl text-xs font-bold uppercase font-heading tracking-wide shadow-md transition flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Đang Thẩm Định...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Yêu Cầu Thực Địa</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
