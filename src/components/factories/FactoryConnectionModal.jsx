import React, { useState } from 'react';
import { X, Building2, Send, CheckCircle2, Shield, AlertCircle, FileText } from 'lucide-react';
import { submitFactoryConnectionRequest } from '../../data/factoriesData.js';

export default function FactoryConnectionModal({ isOpen, onClose, factory }) {
  const [formData, setFormData] = useState({
    targetType: 'SUPPLIER_CAPABILITY',
    requirementTitle: '',
    message: '',
    senderName: '',
    senderCompany: '',
    senderEmail: '',
    senderPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !factory) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.senderName || !formData.senderPhone || !formData.message) {
      setErrorMsg('Vui lòng điền họ tên, số điện thoại và nội dung yêu cầu kết nối.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const result = submitFactoryConnectionRequest({
        factoryId: factory.id,
        factoryName: factory.name,
        organizationId: factory.organizationId,
        targetType: formData.targetType,
        requirementTitle: formData.requirementTitle || `Kết nối cung ứng tới ${factory.name}`,
        message: formData.message,
        senderName: formData.senderName,
        senderCompany: formData.senderCompany,
        senderEmail: formData.senderEmail,
        senderPhone: formData.senderPhone
      }, formData.senderName);

      setSuccessResult(result);
    } catch (err) {
      setErrorMsg('Đã có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessResult(null);
    setFormData({
      targetType: 'SUPPLIER_CAPABILITY',
      requirementTitle: '',
      message: '',
      senderName: '',
      senderCompany: '',
      senderEmail: '',
      senderPhone: ''
    });
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative">
        
        {/* Close Button */}
        <button 
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {successResult ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Gửi Yêu Cầu Kết Nối Thành Công!
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Mã kết nối: <span className="font-mono font-bold text-blue-600">{successResult.connectionId}</span>
              <br />
              {successResult.message}
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 max-w-md mx-auto text-left flex items-start space-x-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Chuyên viên Bàn Điều Phối CCU sẽ bảo mật thông tin và điều phối phiên làm việc với đại diện nhà máy trong vòng 24 giờ.</span>
            </div>
            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition font-heading"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider font-heading">
                <Building2 className="w-4 h-4" />
                <span>Gửi yêu cầu B2B tới nhà máy</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading mt-1">
                {factory.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chủ quản: {factory.ownerOrganization?.legalName || factory.ownerOrganization?.name || factory.organizationId}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Target Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Loại yêu cầu hợp tác <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.targetType}
                onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
              >
                <option value="SUPPLIER_CAPABILITY">Mua hàng / Đặt sản xuất sản phẩm đầu ra</option>
                <option value="OEM_ORDER">Gia công OEM / ODM / Nhãn riêng</option>
                <option value="SAMPLE_REQUEST">Yêu cầu gửi mẫu thử & Bảng giá B2B</option>
                <option value="SURVEY_REQUEST">Đề nghị khảo sát năng lực trực tiếp tại xưởng</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tiêu đề nhu cầu / Tên nhóm sản phẩm
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Đặt may 500 bộ đồng phục Kaki hoặc yêu cầu gia công OEM linh kiện..."
                value={formData.requirementTitle}
                onChange={(e) => setFormData({ ...formData, requirementTitle: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nội dung yêu cầu chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Mô tả cụ thể về số lượng dự kiến, yêu cầu kỹ thuật, thời gian giao hàng mong muốn..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                required
              />
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên của bạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên doanh nghiệp / Đơn vị
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Công ty TNHH Cơ Khí Hải Phòng"
                  value={formData.senderCompany}
                  onChange={(e) => setFormData({ ...formData, senderCompany: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số điện thoại liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Ví dụ: 0903 123 456"
                  value={formData.senderPhone}
                  onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email công việc
                </label>
                <input
                  type="email"
                  placeholder="Ví dụ: procurement@company.com"
                  value={formData.senderEmail}
                  onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Privacy note */}
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-[11px] text-blue-800 flex items-start space-x-2">
              <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Bảo mật thông tin:</strong> Hệ thống không công khai số điện thoại của nhà máy hoặc người gửi. Mọi yêu cầu được chuyển giao an toàn qua Bàn Điều Phối CCU.
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center space-x-1.5 font-heading disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu kết nối'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
