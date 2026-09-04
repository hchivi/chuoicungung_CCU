import React, { useState } from 'react';
import { X, Send, CheckCircle, Building2, Phone, Mail, User, ShieldCheck, MapPin, Sparkles, Layers } from 'lucide-react';

export default function SupplierRegistrationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    taxCode: '',
    industry: '',
    phaseCoordinate: '4.1',
    address: '',
    province: 'Hồ Chí Minh',
    contactName: '',
    phone: '',
    email: '',
    isApiReady: false,
    hasISO: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

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

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-sky-200 text-[11px] font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>GIA NHẬP MẠNG LƯỚI NHÀ CUNG CẤP XÁC THỰC 18 PHA</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-heading text-white">
              Đăng Ký Hồ Sơ Năng Lực Doanh Nghiệp (SME)
            </h3>
            <p className="text-xs text-white/80">
              Nhận kết nối thầu trực tiếp từ khối FDI, Ban quản lý KCN và hơn 20.000 đối tác trên toàn quốc.
            </p>
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
                Đăng Ký Thành Công Hồ Sơ 18 Pha!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Ban xác thực hệ thống Chuỗi Cung Ứng sẽ tiến hành đối soát thông tin pháp nhân & thực địa của <strong className="text-slate-900">{formData.companyName}</strong> trong 24h để cấp huy hiệu KYC.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              Hoàn tất & Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Company Name */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#0052cc]" />
                  Tên đầy đủ Doanh nghiệp / Nhà máy *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Công ty Cổ Phần Sản Xuất & Chế Tạo..."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Tax Code */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mã số thuế (MST) *</label>
                <input
                  type="text"
                  required
                  placeholder="0312345678"
                  value={formData.taxCode}
                  onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* 18-Phase Coordinate */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#0052cc]" />
                  Tọa độ Pha 18 Chuỗi Cung Ứng *
                </label>
                <select
                  value={formData.phaseCoordinate}
                  onChange={(e) => setFormData({ ...formData, phaseCoordinate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
                >
                  <option value="1.1">Pha 1.1 Khảo sát & Định hướng</option>
                  <option value="1.2">Pha 1.2 Pháp lý & Thủ tục</option>
                  <option value="1.3">Pha 1.3 Chọn địa điểm & Mặt bằng KCN</option>
                  <option value="2.1">Pha 2.1 Thiết kế & Quy hoạch</option>
                  <option value="2.2">Pha 2.2 Thi công xây dựng nhà xưởng</option>
                  <option value="2.3">Pha 2.3 Cơ điện MEP & Hạ tầng kỹ thuật</option>
                  <option value="3.1">Pha 3.1 Lắp đặt máy & Dây chuyền</option>
                  <option value="3.2">Pha 3.2 Hoàn thiện không gian & Phòng sạch</option>
                  <option value="3.3">Pha 3.3 Kiểm tra & Nghiệm thu</option>
                  <option value="4.1">Pha 4.1 Cung ứng NVL & Linh kiện</option>
                  <option value="4.2">Pha 4.2 Gia công CNC & Quản lý SX</option>
                  <option value="4.3">Pha 4.3 Logistics & Phân phối</option>
                  <option value="5.1">Pha 5.1 Tuyển dụng & Lao động</option>
                  <option value="5.2">Pha 5.2 Suất ăn & Đời sống</option>
                  <option value="5.3">Pha 5.3 Đồng phục & Bảo hộ (PPE)</option>
                  <option value="6.1">Pha 6.1 Mở rộng công suất</option>
                  <option value="6.2">Pha 6.2 Audit & ISO Chuẩn hóa</option>
                  <option value="6.3">Pha 6.3 Chuyển đổi số & Tự động hóa</option>
                </select>
              </div>

              {/* Industry / Category */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Sản phẩm / Dịch vụ chủ lực</label>
                <input
                  type="text"
                  placeholder="Bao bì carton sóng, Gia công jig CNC, May áo thun đồng phục..."
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Province */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Tỉnh / Thành phố *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Hồ Chí Minh, Bình Dương, Bắc Ninh..."
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Địa chỉ nhà xưởng / Trụ sở</label>
                <input
                  type="text"
                  placeholder="KCN VSIP 1, Thuận An, Bình Dương..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Contact Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Người đại diện liên hệ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A - GĐ Kinh doanh"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Số điện thoại / Hotline *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0909 123 456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email nhận đơn hàng B2B *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sales@company.vn"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Tech Badges Checkboxes */}
              <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isApiReady}
                    onChange={(e) => setFormData({ ...formData, isApiReady: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Sẵn sàng kết nối API / Hệ thống ERP & Quản trị doanh nghiệp
                  </span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasISO}
                    onChange={(e) => setFormData({ ...formData, hasISO: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Có chứng nhận tiêu chuẩn (ISO 9001 / HACCP / ESG / CE / FDA)
                  </span>
                </label>
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
                    <span>Đang gửi hồ sơ...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Xác Thực & Đăng Ký Hồ Sơ</span>
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
