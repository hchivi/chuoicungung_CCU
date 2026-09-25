import React, { useState } from 'react';
import { 
  AlertTriangle, TrendingUp, Zap, Clock, ShieldCheck, 
  ArrowRight, Sparkles, CheckCircle2, DollarSign, X, Send, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ActionableAlertsList({ lang = 'vi' }) {
  const navigate = useNavigate();
  const [selectedActionAlert, setSelectedActionAlert] = useState(null);
  const [submittedAlert, setSubmittedAlert] = useState(false);
  const [actionForm, setActionForm] = useState({
    companyName: '',
    phone: '',
    capacity: '5.000 - 20.000 đơn vị / tháng',
    note: ''
  });

  const alerts = [
    {
      id: 1,
      tag: 'CẢNH BÁO CHI PHÍ NGUYÊN LIỆU',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
      title: 'Chi phí sản xuất túi canvas & giỏ màng co dự kiến tăng 10% vào quý sau',
      content: 'Do biến động giá sợi cotton nhập khẩu và màng bọc co nhiệt PE, các xưởng đóng gói quà tặng và thời trang công nghiệp đang khuyến nghị chốt hợp đồng cố định giá sớm.',
      time: '15 phút trước',
      actionText: 'Chốt Nguồn Cung Cố Định Giá Ngay',
      actionType: 'lock_price',
      targetDemand: 'Túi canvas & giỏ màng co bọc quà',
      urgency: 'Cao'
    },
    {
      id: 2,
      tag: 'THIẾU HỤT CUNG ỨNG NÔNG SẢN',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
      title: 'Khát nguồn cung Trà ô long Cozy, Cà phê G7 & Thập cẩm sấy Nut Farm cho chuỗi TAHOMART',
      content: 'Chuỗi bán lẻ và đối tác quà tặng doanh nghiệp đang mở thầu thu mua khẩn cấp hơn 50.000 hộp nông sản sấy thăng hoa (Nut Farm, Mít sấy Nam Huy) cho chiến dịch Quý 3-4.',
      time: '32 phút trước',
      actionText: 'Đăng Ký Cung Ứng Nông Sản',
      actionType: 'supply_food',
      targetDemand: 'Trà ô long Cozy, Cà phê G7, Mít sấy Nam Huy',
      urgency: 'Rất Cao'
    },
    {
      id: 3,
      tag: 'GÓI THẦU QUÀ TẶNG DOANH NGHIỆP',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
      title: 'Khối Ngân Hàng HDBank & VietinBank mở RFQ 15.000 Hộp quà dọc tỷ lệ 9:16',
      content: 'Yêu cầu quy cách: Hộp cứng cao cấp dáng đứng 9:16 ép kim logo thương hiệu, có khay định hình nhung. Ngân sách dự kiến 1.85 tỷ VNĐ, đóng thầu trong 48h.',
      time: '1 giờ trước',
      actionText: 'Tham Gia Đấu Thầu Ngay',
      actionType: 'bid_rfq',
      targetDemand: 'Hộp quà dọc 9:16 Ép kim',
      urgency: 'Khẩn cấp'
    },
    {
      id: 4,
      tag: 'CẢNH BÁO BÁN DẪN & SMT',
      tagColor: 'bg-sky-100 text-sky-800 border-sky-200',
      title: 'Nguồn linh kiện thụ động SMD tại KCN Bắc Ninh sụt giảm 18%',
      content: 'Các chuỗi cung ứng SMT khuyến nghị kích hoạt mạng lưới nhà cung ứng phụ trợ vệ tinh tại KCN Hải Phòng và Bình Dương để tránh đứt gãy dây chuyền.',
      time: '2 giờ trước',
      actionText: 'Kích Hoạt Nguồn Dự Phòng Phía Nam',
      actionType: 'backup_source',
      targetDemand: 'Linh kiện thụ động SMD & Dây cáp',
      urgency: 'Trung bình'
    }
  ];

  const handleActionSubmit = (e) => {
    e.preventDefault();
    setSubmittedAlert(true);
    setTimeout(() => {
      setSubmittedAlert(false);
      setSelectedActionAlert(null);
      alert(`Đã gửi phản hồi hành động thành công! Đội ngũ điều phối CCU & Bộ phận Thu mua sẽ liên hệ với ${actionForm.companyName || 'quý doanh nghiệp'} trong vòng 30 phút.`);
    }, 1200);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-heading">
            {lang === 'en' ? 'Actionable Market Intelligence & Alerts' : 'Cảnh Báo Hành Động & Tình Báo Nguồn Cung (Actionable Alerts)'}
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
          LIVE RADAR
        </span>
      </div>

      {/* Alerts Cards List */}
      <div className="space-y-3">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 space-y-3"
          >
            {/* Tag & Time */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono border ${item.tagColor}`}>
                {item.tag}
              </span>
              <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                <Clock className="w-3 h-3" />
                <span>{item.time}</span>
              </div>
            </div>

            {/* Title */}
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm font-heading leading-snug">
              {item.title}
            </h4>

            {/* Content */}
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {item.content}
            </p>

            {/* Action CTA Button */}
            <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono">
                Mức độ cấp thiết: <strong className="text-rose-600">{item.urgency}</strong>
              </span>

              <button
                onClick={() => setSelectedActionAlert(item)}
                className="px-4 py-2 bg-gradient-to-r from-[#0052cc] via-[#0047a5] to-[#0284c7] hover:from-[#003d8f] hover:to-[#0052cc] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 font-heading cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Modal (When a user clicks any Action CTA) */}
      {selectedActionAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedActionAlert(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-6">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 text-blue-800">
                PHẢN HỒI HÀNH ĐỘNG B2B
              </span>
              <h3 className="text-base sm:text-lg font-black font-heading text-slate-900">
                {selectedActionAlert.actionText}
              </h3>
              <p className="text-xs text-slate-500">
                Mục tiêu: {selectedActionAlert.targetDemand}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleActionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 font-heading">
                  Tên Doanh Nghiệp / Nhà Máy <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Công ty TNHH Sản Xuất & Bao Bì Tân Phát"
                  value={actionForm.companyName}
                  onChange={(e) => setActionForm({...actionForm, companyName: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0052cc] font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-heading">
                    Số Điện Thoại / Zalo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={actionForm.phone}
                    onChange={(e) => setActionForm({...actionForm, phone: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0052cc] font-sans"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-heading">
                    Năng Lực Đáp Ứng
                  </label>
                  <select
                    value={actionForm.capacity}
                    onChange={(e) => setActionForm({...actionForm, capacity: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0052cc] font-sans bg-white"
                  >
                    <option>5.000 - 20.000 đơn vị / tháng</option>
                    <option>20.000 - 100.000 đơn vị / tháng</option>
                    <option>&gt; 100.000 đơn vị / tháng</option>
                    <option>Cung ứng theo dự án RFQ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-heading">
                  Ghi Chú Đề Xuất Giá / Nguồn Cung
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả quy cách, chứng chỉ ISO/RoHS, mức giá cố định mong muốn..."
                  value={actionForm.note}
                  onChange={(e) => setActionForm({...actionForm, note: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0052cc] font-sans"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittedAlert}
                  className="w-full py-3 bg-gradient-to-r from-[#0052cc] to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 font-heading cursor-pointer text-xs sm:text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittedAlert ? 'Đang Xử Lý Kết Nối...' : 'Xác Nhận & Gửi Phản Hồi Ngay'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
