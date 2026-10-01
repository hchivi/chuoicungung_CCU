import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Building2, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Crown,
  AlertCircle
} from 'lucide-react';
import { 
  UPCOMING_EDITIONS_CALL_FOR_PAPERS, 
  submitCatalogueParticipation 
} from '../../data/cataloguesData';

export default function CatalogueParticipationModal({ 
  isOpen, 
  onClose, 
  initialEditionId = null,
  initialCategory = '' 
}) {
  const [selectedEditionId, setSelectedEditionId] = useState(
    initialEditionId || UPCOMING_EDITIONS_CALL_FOR_PAPERS[0]?.id || ''
  );
  const [companyName, setCompanyName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(initialCategory || 'Cơ khí chính xác & Phụ trợ');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [capabilitiesSummary, setCapabilitiesSummary] = useState('');
  const [isFoundingPartner, setIsFoundingPartner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  if (!isOpen) return null;

  const currentUpcomingEdition = UPCOMING_EDITIONS_CALL_FOR_PAPERS.find(e => e.id === selectedEditionId) || UPCOMING_EDITIONS_CALL_FOR_PAPERS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPerson.trim() || !phone.trim()) {
      alert('Vui lòng điền đầy đủ tên doanh nghiệp, người phụ trách và số điện thoại liên hệ.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = submitCatalogueParticipation({
        editionId: selectedEditionId,
        editionTitle: currentUpcomingEdition?.title,
        companyName,
        taxCode,
        contactPerson,
        phone,
        email,
        category,
        province,
        capabilitiesSummary,
        isFoundingPartner
      });
      setIsSubmitting(false);
      setSubmittedData(res);
    }, 600);
  };

  const handleResetAndClose = () => {
    setSubmittedData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0052cc] to-blue-800 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Tiếp Nhận Hồ Sơ Ấn Phẩm B2B</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black font-heading leading-tight">
              Đăng Ký Giới Thiệu Doanh Nghiệp Trên Catalogue
            </h2>
            <p className="text-xs text-blue-100 max-w-lg">
              Kết nối trực tiếp tới hơn 5.000 phòng thu mua nhà máy FDI và đại biểu B2B tại các khu công nghiệp trọng điểm.
            </p>
          </div>
          <button 
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submittedData ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                Mã hồ sơ: {submittedData.id}
              </span>
              <h3 className="text-xl font-black text-slate-900 font-heading">
                Hồ Sơ Đã Được Tiếp Nhận Thành Công!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Ban biên tập CHUOICUNGUNG.COM sẽ đối chiếu thông tin pháp nhân và liên hệ với anh/chị <strong>{submittedData.contactPerson}</strong> trong vòng 48 giờ làm việc để chuẩn hóa bản số xem trước (Digital Preview).
              </p>
            </div>

            {/* Note on Review Flow (Section 27) */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2 text-slate-700">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Quy trình biên tập & thẩm định tiếp theo (Section 27 Spec 30.txt):</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                <li>Tiếp nhận & khảo sát năng lực sản xuất thực tế (không tự động xuất bản nếu chưa duyệt).</li>
                <li>Biên soạn hồ sơ năng lực 01 trang chuẩn B2B, gắn mã QR định danh trực tiếp.</li>
                <li>Gửi doanh nghiệp phê duyệt bản in (Client Approval) trước khi in ấn đại trà.</li>
              </ul>
            </div>

            <button
              onClick={handleResetAndClose}
              type="button"
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Đóng và tiếp tục xem Catalogue
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* 1. Target Edition Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Chọn ấn phẩm chuẩn bị phát hành:</span>
                <span className="text-[11px] text-blue-600 font-medium font-mono">
                  Hạn chót: {currentUpcomingEdition.deadline}
                </span>
              </label>
              <select
                value={selectedEditionId}
                onChange={(e) => setSelectedEditionId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition"
              >
                {UPCOMING_EDITIONS_CALL_FOR_PAPERS.map(ed => (
                  <option key={ed.id} value={ed.id}>
                    {ed.title} (Hạn: {ed.deadline})
                  </option>
                ))}
              </select>
            </div>

            {/* Edition Highlights Banner */}
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11.5px] text-blue-900 space-y-1">
              <div className="flex items-center space-x-1 font-bold">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Phạm vi phát hành: {currentUpcomingEdition.scope}</span>
              </div>
              <div className="text-[11px] text-blue-800/80">
                Sự kiện mục tiêu: {currentUpcomingEdition.targetDistributionEvents}
              </div>
            </div>

            {/* 2. Company Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tên doanh nghiệp / Nhà máy *</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Công ty TNHH Sản Xuất..."
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mã số thuế</label>
                <input 
                  type="text" 
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                  placeholder="0312345678"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition font-mono"
                />
              </div>
            </div>

            {/* Contact Person & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Người liên hệ *</label>
                <input 
                  type="text" 
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Số điện thoại *</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0908 123 456"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email công vụ</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition"
                />
              </div>
            </div>

            {/* Category & Province */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Chuyên mục ngành nghề</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition"
                >
                  <option value="Đồng Phục & Bảo Hộ Lao Động">Đồng Phục & Bảo Hộ Lao Động</option>
                  <option value="Cơ Khí Chính Xác & Khuôn Mẫu">Cơ Khí Chính Xác & Khuôn Mẫu</option>
                  <option value="Bao Bì & In Ấn Công Nghiệp">Bao Bì & In Ấn Công Nghiệp</option>
                  <option value="Nông Sản & Thực Phẩm Chế Biến">Nông Sản & Thực Phẩm Chế Biến</option>
                  <option value="Hóa Chất, Sơn & Xử Lý Bề Mặt">Hóa Chất, Sơn & Xử Lý Bề Mặt</option>
                  <option value="Logistics, Kho Bãi & Hạ Tầng KCN">Logistics, Kho Bãi & Hạ Tầng KCN</option>
                  <option value="Tự Động Hóa & Thiết Bị Điện">Tự Động Hóa & Thiết Bị Điện</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Địa bàn / Tỉnh thành nhà máy</label>
                <input 
                  type="text" 
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="TP.HCM, Bình Dương, Bắc Ninh..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition"
                />
              </div>
            </div>

            {/* Capabilities Summary */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tóm tắt năng lực sản xuất & máy móc chính</label>
              <textarea
                value={capabilitiesSummary}
                onChange={(e) => setCapabilitiesSummary(e.target.value)}
                placeholder="Ví dụ: Quy mô nhà máy 5.000m2 tại KCN VSIP 1, sở hữu 10 máy ép nhựa 350-850 tấn, chứng chỉ ISO 9001:2015..."
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition"
              />
            </div>

            {/* Section 32: Founding Partner Entitlement Checkbox */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={isFoundingPartner}
                  onChange={(e) => setIsFoundingPartner(e.target.checked)}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <div className="text-xs text-slate-800">
                  <div className="font-bold flex items-center space-x-1.5 text-amber-900">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>Doanh nghiệp đã ký Hợp đồng Đối tác Sáng lập (Founding Partner)</span>
                  </div>
                  <p className="text-[11px] text-amber-800/80 mt-0.5">
                    Hệ thống sẽ tự động gán nhãn <strong>INCLUDED_IN_FOUNDING_PARTNER</strong>, miễn phí 100% chi phí xuất bản và không tính phí trùng lặp (Section 32 Spec 30.txt).
                  </p>
                </div>
              </label>
            </div>

            {/* Disclaimer on Form Submission vs Approval (Section 27) */}
            <div className="flex items-start space-x-2 text-[11px] text-slate-500">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>
                Nộp hồ sơ <strong>không đồng nghĩa xuất bản tự động</strong>. Mọi thông tin sẽ qua các bước xác minh năng lực và duyệt bản số trước khi in ấn phát hành.
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Đang xử lý...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Đăng Ký Hồ Sơ</span>
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
