import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Calendar, Clock, DollarSign, ShieldCheck, 
  CheckCircle2, Phone, Mail, Globe, MessageSquare, FileText, 
  Download, ArrowLeft, Share2, Heart, Award, Sparkles, Send,
  Layers, ChevronRight, Eye, Users, AlertCircle, ExternalLink
} from 'lucide-react';
import { demandsMarketplaceData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function DemandDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const [bidForm, setBidForm] = useState({
    supplierName: '',
    contactPerson: '',
    phone: '',
    email: '',
    fabricTypesOffered: '',
    unitPriceEstimate: '',
    sampleDeliveryDate: '',
    note: ''
  });
  const [isBidSubmitted, setIsBidSubmitted] = useState(false);

  // Find demand by ID, fallback to Proser uniform demand if not found
  const demand = demandsMarketplaceData.find(d => String(d.id) === String(id)) || demandsMarketplaceData[0];

  const handleBidSubmit = (e) => {
    e.preventDefault();
    setIsBidSubmitted(true);
  };

  return (
    <div className="space-y-8 pb-20 pt-6 font-sans bg-slate-50 min-h-screen">
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs text-slate-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600 font-medium">
            {lang === 'en' ? 'Home' : 'Trang chủ'}
          </Link>
          <span>&gt;</span>
          <Link to="/san-nhu-cau" className="hover:text-blue-600 font-medium">
            {lang === 'en' ? 'Sourcing Marketplace' : 'Sàn Nhu Cầu B2B'}
          </Link>
          <span>&gt;</span>
          <span className="text-blue-600 font-semibold truncate max-w-xs sm:max-w-md">
            {demand.title}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Hero Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          
          {/* Top Badges & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-xs flex items-center gap-1 font-heading uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                {demand.isFoundingPartner ? 'Founding Partner Sourcing' : 'Nhu Cầu Doanh Nghiệp'}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {demand.status || 'Đang mở nhận báo giá'}
              </span>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold rounded-full">
                {demand.phaseName || 'Pha 5.3 Đồng phục & Bảo hộ (PPE)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${
                  isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
                <span>{isSaved ? 'Đã lưu' : 'Lưu tin'}</span>
              </button>
              <button 
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Đã sao chép liên kết nhu cầu vào clipboard!');
                  }
                }}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition text-xs font-bold flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Chia sẻ</span>
              </button>
            </div>
          </div>

          {/* Title & Key Highlights */}
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-heading leading-snug">
              {demand.title}
            </h1>

            {/* Key Metric Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl">
                <span className="text-[11px] text-blue-600 font-bold uppercase tracking-wider block font-heading">
                  Ngân sách ước tính
                </span>
                <span className="text-sm sm:text-base font-black text-blue-900 font-mono">
                  {demand.budget || '2,5 - 4,0 tỷ VND'}
                </span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider block font-heading">
                  Sản lượng yêu cầu
                </span>
                <span className="text-sm sm:text-base font-black text-emerald-900">
                  {demand.quantity || '50.000m - 100.000m / tháng'}
                </span>
              </div>

              <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl">
                <span className="text-[11px] text-purple-600 font-bold uppercase tracking-wider block font-heading">
                  Địa điểm nhận hàng
                </span>
                <span className="text-xs sm:text-sm font-bold text-purple-900 truncate block">
                  {demand.location || 'TP. Hồ Chí Minh & Toàn quốc'}
                </span>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl">
                <span className="text-[11px] text-amber-700 font-bold uppercase tracking-wider block font-heading">
                  Thời hạn nhận mẫu
                </span>
                <span className="text-xs sm:text-sm font-bold text-amber-900 block font-mono">
                  {demand.deadline || 'Ưu tiên trong 7 ngày'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Section: Chi tiết mô tả nhu cầu */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Mô tả chi tiết nhu cầu tìm nguồn cung
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {demand.description || 'Chuyên Gia Đồng Phục (Công ty TNHH Proser) đang mở rộng quy mô xưởng may và ký kết các hợp đồng may đo đồng phục doanh nghiệp FDI, chuỗi khách sạn và bảo hộ lao động nhà máy KCN. Chúng tôi cần tìm kiếm các đối tác dệt may uy tín cung ứng các chủng loại vải chất lượng cao, có bảng màu chuẩn và sẵn sàng gửi mẫu kiểm tra độ co giãn, độ bền màu.'}
              </p>

              {/* Bảng quy cách kỹ thuật chi tiết các loại vải */}
              {demand.detailedRequirements && demand.detailedRequirements.length > 0 && (
                <div className="pt-4 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-heading">
                    Quy cách kỹ thuật các chủng loại vải cần tìm:
                  </h3>
                  <div className="space-y-3">
                    {demand.detailedRequirements.map((req, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5 hover:bg-blue-50/30 transition">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-blue-900 font-heading">
                            {idx + 1}. {req.type}
                          </span>
                          <span className="px-2.5 py-0.5 bg-blue-100/70 text-blue-700 rounded-full text-[11px] font-bold">
                            {req.usage}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">
                          <strong>Thông số:</strong> {req.specs}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Điều kiện hợp tác */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 font-heading">
                  Yêu cầu đối với Nhà cung ứng tham gia:
                </h3>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  <li>Có chứng chỉ nguồn gốc xuất xứ (CO), chứng chỉ kiểm định chất lượng (CQ) hoặc tiêu chuẩn OEKO-TEX / ISO.</li>
                  <li>Sẵn sàng cung cấp tập mẫu vải (Swatches) và bảng màu chuẩn Pantone để tiến hành may mẫu thử.</li>
                  <li>Cam kết sản lượng cung ứng ổn định tối thiểu 50.000m/tháng và tiến độ giao hàng đúng cam kết tại xưởng.</li>
                  <li>Chấp nhận thanh toán theo hợp đồng nguyên tắc B2B định kỳ.</li>
                </ul>
              </div>
            </div>

            {/* Section: Doanh nghiệp đã quan tâm & theo dõi thời gian thực */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Doanh nghiệp & Nhà cung ứng đã quan tâm ({demand.totalInterestedCount || 24})
                </h2>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold animate-pulse">
                  ● Cập nhật thời gian thực
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Danh sách các nhà máy dệt may, đơn vị cung ứng nguyên phụ liệu đã xem hồ sơ nhu cầu và chuẩn bị gửi mẫu chào giá:
              </p>

              {/* Grid of Interested Suppliers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(demand.interestedSuppliers || []).map((sup) => (
                  <div key={sup.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 rounded-2xl flex items-center gap-3 transition">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-xs bg-gradient-to-br ${sup.bgGradient || 'from-blue-600 to-indigo-600'} shrink-0 shadow-xs`}>
                      {sup.monogram || 'NCC'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate font-heading">
                        {sup.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{sup.viewedAt || 'Vừa xem'}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">{sup.status || 'Đang quan tâm'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Form gửi báo giá & gửi mẫu vải trực tiếp */}
            <div className="bg-white rounded-3xl border border-blue-200 p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                    Gửi hồ sơ chào giá & đăng ký gửi mẫu vải
                  </h2>
                  <p className="text-xs text-slate-500">
                    Báo giá và thông tin của bạn sẽ được gửi trực tiếp đến Trưởng phòng Mua hàng của Proser.
                  </p>
                </div>
              </div>

              {isBidSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-900 font-heading">
                    Đã gửi thông tin chào giá thành công!
                  </h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Bộ phận Mua hàng của Chuyên Gia Đồng Phục (Proser) sẽ liên hệ lại với bạn qua số điện thoại <strong>{bidForm.phone || 'của bạn'}</strong> trong vòng 24 giờ làm việc.
                  </p>
                  <button 
                    onClick={() => setIsBidSubmitted(false)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                  >
                    Gửi thêm thông tin khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBidSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 font-heading">Tên công ty / Xưởng dệt *</label>
                      <input 
                        type="text" 
                        required
                        value={bidForm.supplierName}
                        onChange={(e) => setBidForm({...bidForm, supplierName: e.target.value})}
                        placeholder="VD: Công ty TNHH Dệt May..." 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 font-heading">Người đại diện / Chức vụ *</label>
                      <input 
                        type="text" 
                        required
                        value={bidForm.contactPerson}
                        onChange={(e) => setBidForm({...bidForm, contactPerson: e.target.value})}
                        placeholder="VD: Nguyễn Văn B - Trưởng phòng kinh doanh" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 font-heading">Số điện thoại / Zalo liên hệ *</label>
                      <input 
                        type="tel" 
                        required
                        value={bidForm.phone}
                        onChange={(e) => setBidForm({...bidForm, phone: e.target.value})}
                        placeholder="09xx xxx xxx" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono" 
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 font-heading">Email doanh nghiệp *</label>
                      <input 
                        type="email" 
                        required
                        value={bidForm.email}
                        onChange={(e) => setBidForm({...bidForm, email: e.target.value})}
                        placeholder="sales@company.com" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 font-heading">Chủng loại vải có thể cung ứng</label>
                      <input 
                        type="text" 
                        value={bidForm.fabricTypesOffered}
                        onChange={(e) => setBidForm({...bidForm, fabricTypesOffered: e.target.value})}
                        placeholder="VD: Kate Mỹ, Kaki Cotton 100%, Thun Cá Sấu..." 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 font-heading">Thời gian có thể gửi mẫu vải</label>
                      <input 
                        type="text" 
                        value={bidForm.sampleDeliveryDate}
                        onChange={(e) => setBidForm({...bidForm, sampleDeliveryDate: e.target.value})}
                        placeholder="VD: Có sẵn mẫu, gửi trong 24h" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 font-heading">Ghi chú năng lực sản xuất / Báo giá ước tính</label>
                    <textarea 
                      rows="3"
                      value={bidForm.note}
                      onChange={(e) => setBidForm({...bidForm, note: e.target.value})}
                      placeholder="Nhập thông số định lượng vải, đơn giá tham khảo hoặc giới thiệu xưởng dệt..." 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20 text-xs sm:text-sm uppercase tracking-wider font-heading transition"
                  >
                    Xác nhận gửi hồ sơ chào giá & mẫu vải
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Right Sidebar: Thông tin Doanh Nghiệp Đăng Tin (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Doanh nghiệp Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5 text-xs">
              <div className="text-center space-y-3 pb-4 border-b border-slate-100">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-white border border-slate-200 p-2 shadow-sm flex items-center justify-center">
                  <img 
                    src={demand.logo || "/images/founding-partners/chuyen-gia-dong-phuc-logo.png"} 
                    alt={demand.company}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span class="font-black text-blue-700 text-lg">PROSER</span>';
                    }}
                  />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[10px] font-bold inline-flex items-center gap-1 mb-1">
                    <Award className="w-3 h-3 text-amber-600" />
                    Đối tác Sáng lập Chuỗi Cung Ứng
                  </span>
                  <h3 className="text-sm font-black text-slate-900 font-heading">
                    {demand.company || 'Chuyên Gia Đồng Phục - Công Ty TNHH Proser'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    "cần ĐỒNG PHỤC có CHUYÊN GIA"
                  </p>
                </div>
              </div>

              {/* Contact Direct Box (Unlocked in Detail Page) */}
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-2">
                  <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block font-heading">
                    Liên hệ trực tiếp bộ phận Sourcing:
                  </span>
                  
                  {/* Hotline */}
                  <a 
                    href={`tel:${demand.contactInfo?.hotline || '0582877799'}`}
                    className="flex items-center justify-between p-2 bg-white rounded-xl border border-blue-200 hover:border-blue-400 text-blue-900 font-bold transition group"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span>Hotline / ĐT:</span>
                    </span>
                    <span className="font-mono font-black text-blue-700">
                      {demand.contactInfo?.hotline || '0582 87 77 99'}
                    </span>
                  </a>

                  {/* Zalo */}
                  <a 
                    href={demand.contactInfo?.zalo || "https://zalo.me/0582877799"}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat Zalo B2B:</span>
                    </span>
                    <span className="font-mono text-xs">Mở Zalo ➔</span>
                  </a>

                  {/* Email */}
                  <a 
                    href={`mailto:${demand.contactInfo?.email || 'contact@chuyengiadongphuc.com'}`}
                    className="flex items-center justify-between p-2 bg-white rounded-xl border border-blue-200 hover:border-blue-400 text-slate-700 font-medium transition text-[11px]"
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>Email:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 truncate max-w-[150px]">
                      {demand.contactInfo?.email || 'contact@chuyengiadongphuc.com'}
                    </span>
                  </a>
                </div>

                {/* Company Specs */}
                <div className="space-y-2 text-slate-600 text-[11px] pt-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>Địa chỉ:</strong> {demand.contactInfo?.address || '154 Phạm Văn Chiêu, P. 9, Q. Gò Vấp, TP. HCM'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Website:</strong> <a href={demand.contactInfo?.website || "https://chuyengiadongphuc.com/"} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">chuyengiadongphuc.com</a></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Mã số thuế:</strong> <span className="font-mono font-bold text-slate-800">{demand.contactInfo?.taxCode || '0316881973'}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span><strong>Năng lực xưởng may:</strong> 50.000+ sản phẩm / tháng</span>
                  </div>
                </div>

                {/* Link to Founding Partner Page */}
                <Link 
                  to="/founding-partner"
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 transition text-xs font-heading"
                >
                  <span>Xem hồ sơ Đối tác Sáng lập Proser</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Sourcing Safety Notice */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-5 space-y-2.5 text-xs">
              <h3 className="font-bold text-emerald-900 flex items-center gap-1.5 font-heading">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Cam kết minh bạch Sourcing B2B
              </h3>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Nhu cầu được đăng tải và xác thực trực tiếp bởi Chuỗi Cung Ứng . Com. Nhà cung ứng tham gia chào giá không mất bất kỳ khoản phí trung gian nào.
              </p>
            </div>

            {/* Back Button */}
            <button 
              onClick={() => navigate('/san-nhu-cau')}
              className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition text-xs font-heading"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Sàn Nhu Cầu B2B</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
