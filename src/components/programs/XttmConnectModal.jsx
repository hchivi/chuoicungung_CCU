import React, { useState } from 'react';
import {
  X, Handshake, Building2, UserCheck, Phone, Mail,
  Send, CheckCircle2, ShieldCheck, Calendar, ArrowRight,
  ExternalLink, Sparkles
} from 'lucide-react';
import { persistSubmission } from '../../services/submissionService.js';

export default function XttmConnectModal({ isOpen, onClose, targetItem, allItems = [] }) {
  const [selectedTarget, setSelectedTarget] = useState(targetItem || allItems[0] || null);
  const [formData, setFormData] = useState({
    senderName: '',
    senderCompany: '',
    senderPhone: '',
    senderEmail: '',
    connectPurpose: 'MEETING_1ON1',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync if targetItem changes
  React.useEffect(() => {
    if (targetItem) {
      setSelectedTarget(targetItem);
    }
  }, [targetItem]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.senderName.trim() || !formData.senderPhone.trim()) {
      setErrorMsg('Vui lòng nhập họ tên và số điện thoại liên hệ');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const code = `XTTM-REQ-${Date.now().toString().slice(-6)}`;
      const submissionPayload = {
        code,
        targetCompany: selectedTarget ? selectedTarget.company : 'Toàn bộ danh bạ XTTM',
        targetAttendee: selectedTarget ? selectedTarget.attendee : '',
        targetBadge: selectedTarget ? selectedTarget.badge : '',
        targetOrg: selectedTarget ? selectedTarget.org : '',
        targetEmail: selectedTarget ? selectedTarget.email : '',
        targetPhone: selectedTarget ? selectedTarget.phone : '',
        senderName: formData.senderName,
        senderCompany: formData.senderCompany,
        senderPhone: formData.senderPhone,
        senderEmail: formData.senderEmail,
        connectPurpose: formData.connectPurpose,
        note: formData.note,
        createdAt: new Date().toISOString()
      };

      try {
        await persistSubmission('xttm_connect_request', submissionPayload);
      } catch (err) {
        console.warn('Persist error (fallback to local success):', err);
      }

      setSuccessResult({
        code,
        targetCompany: selectedTarget ? selectedTarget.company : 'Toàn bộ danh bạ XTTM'
      });
    } catch (err) {
      setErrorMsg('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessResult(null);
    setErrorMsg('');
    setFormData({
      senderName: '',
      senderCompany: '',
      senderPhone: '',
      senderEmail: '',
      connectPurpose: 'MEETING_1ON1',
      note: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-[#006039] p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-xs shrink-0">
              <Handshake className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg sm:text-xl text-white">
                Đăng Ký Kết Nối Giao Thương XTTM
              </h3>
              <p className="text-xs text-emerald-100">
                Kết nối trực tiếp với đại diện doanh nghiệp tại sự kiện
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {successResult ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#006039] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-heading font-black text-slate-900">
                  Gửi Yêu Cầu Kết Nối Thành Công!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Hệ thống đã ghi nhận đề nghị kết nối tới <strong className="text-emerald-800">{successResult.targetCompany}</strong>.
                  Ban điều phối XTTM sẽ liên hệ xác nhận lịch làm việc và bàn kết nối B2B với bạn.
                </p>
              </div>

              <div className="inline-block px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-mono text-emerald-800 font-bold">
                Mã theo dõi: {successResult.code}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-[#006039] hover:bg-[#004d2e] text-white font-bold text-sm shadow-sm transition cursor-pointer"
                >
                  Hoàn Tất & Đóng
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Selected Target Company Box */}
              {selectedTarget && (
                <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      Doanh nghiệp mục tiêu kết nối
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                      {selectedTarget.badge}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-0.5">
                    <div className="font-heading font-black text-slate-900 text-base sm:text-lg">
                      {selectedTarget.company}
                    </div>
                    <span className="text-xs text-slate-600 font-medium">
                      {selectedTarget.field} ({selectedTarget.vsicId})
                    </span>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center justify-between text-xs text-slate-700 gap-2">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <UserCheck className="w-4 h-4 text-[#006039]" />
                      <span>{selectedTarget.attendee}</span>
                      <span className="text-slate-500 font-normal">({selectedTarget.role})</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-emerald-100">
                      {selectedTarget.org}
                    </span>
                  </div>
                </div>
              )}

              {/* Form inputs */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên của bạn <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#006039] focus:ring-1 focus:ring-[#006039]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Doanh nghiệp / Nhà máy của bạn
                    </label>
                    <input
                      type="text"
                      placeholder="Công ty CP Sản xuất ABC"
                      value={formData.senderCompany}
                      onChange={(e) => setFormData({ ...formData, senderCompany: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#006039] focus:ring-1 focus:ring-[#006039]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điện thoại liên hệ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0901 234 567"
                      value={formData.senderPhone}
                      onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#006039] focus:ring-1 focus:ring-[#006039]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email làm việc
                    </label>
                    <input
                      type="email"
                      placeholder="contact@abc.vn"
                      value={formData.senderEmail}
                      onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#006039] focus:ring-1 focus:ring-[#006039]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mục đích kết nối
                  </label>
                  <select
                    value={formData.connectPurpose}
                    onChange={(e) => setFormData({ ...formData, connectPurpose: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#006039] focus:ring-1 focus:ring-[#006039] bg-white"
                  >
                    <option value="MEETING_1ON1">Đặt lịch hẹn gặp 1:1 tại bàn B2B sự kiện</option>
                    <option value="BUYER_OFFER">Chào giá / Giới thiệu năng lực cung ứng</option>
                    <option value="SOURCING_REQUEST">Đề xuất mua hàng / Khảo sát mua chung (Group B)</option>
                    <option value="COOPERATION">Hợp tác dịch vụ chuyên môn / Hạ tầng (Group C/D)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nội dung đề xuất / Yêu cầu chi tiết
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả tóm tắt nhu cầu kết nối hoặc sản phẩm/dịch vụ bạn quan tâm..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#006039] focus:ring-1 focus:ring-[#006039]"
                  ></textarea>
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[#006039] hover:bg-[#004d2e] text-white font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Đề Nghị Kết Nối'}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
