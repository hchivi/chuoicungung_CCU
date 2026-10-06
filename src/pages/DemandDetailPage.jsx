import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Calendar, Clock, ShieldCheck, 
  CheckCircle2, FileText, ArrowLeft, Share2, Heart, 
  Sparkles, Send, Layers, ChevronRight, Users, 
  AlertCircle, Bot, ArrowRight, Check
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getPublicRequirementById, 
  getAllMasterRequirements,
  toPublicRequirementSummary,
  getSupplierResponseForRequirement
} from '../data/requirementsData';
import SupplierResponseModal from '../components/demands/SupplierResponseModal';
import SuppiDemandAssistantModal from '../components/demands/SuppiDemandAssistantModal';
import AuthModal from '../components/auth/AuthModal';

export default function DemandDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  
  // Modals
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [suppiModalOpen, setSuppiModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Authenticated user state from session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_user_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      isLoggedIn: false,
      name: 'Khách vãng lai',
      role: 'Guest',
      orgName: '',
      orgId: null
    };
  });

  // Tìm nhu cầu công khai đã sanitize an toàn
  const demand = getPublicRequirementById(id) || (() => {
    const all = getAllMasterRequirements();
    const fallback = all.find(d => String(d.id) === String(id) || String(d.publicCode) === String(id)) || all[0];
    return toPublicRequirementSummary(fallback);
  })();

  const existingResponse = currentUser?.isLoggedIn
    ? getSupplierResponseForRequirement(demand.id, currentUser.orgId || currentUser.name)
    : null;

  const isClosed = demand.status === 'CLOSED';

  return (
    <div className="space-y-6 pb-20 pt-6 font-sans bg-slate-50 min-h-screen text-slate-900">
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs text-slate-500 flex items-center space-x-2">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_onlyc.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/san-nhu-cau" className="hover:text-[#0052cc] font-medium">
            Sàn Nhu Cầu B2B
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#0052cc] font-semibold truncate max-w-xs sm:max-w-md">
            {demand.publicCode} - {demand.title}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Hero Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          
          {/* Top Badges & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-xs flex items-center gap-1 font-mono uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                MÃ: {demand.publicCode}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                isClosed ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isClosed ? 'Đã đóng tiếp nhận' : 'Đang mở nhận hồ sơ'}
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold rounded-full">
                {demand.category}
              </span>
              {demand.stageName && (
                <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold rounded-full">
                  {demand.stageName}
                </span>
              )}
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

            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Đăng bởi: <strong>{demand.buyerDisplayName}</strong></span>
              <span>•</span>
              <span>Đăng ngày: {new Date(demand.publishedAt).toLocaleDateString('vi-VN')}</span>
            </div>

            {/* Key Metric Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl">
                <span className="text-[11px] text-blue-600 font-bold uppercase tracking-wider block font-heading">
                  Sản phẩm / Dịch vụ
                </span>
                <span className="text-xs sm:text-sm font-bold text-blue-900 truncate block">
                  {demand.productService}
                </span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider block font-heading">
                  Sản lượng yêu cầu
                </span>
                <span className="text-sm sm:text-base font-black text-emerald-900">
                  {demand.quantity ? `${demand.quantity} ${demand.unit}` : 'Theo thỏa thuận'}
                </span>
              </div>

              <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl">
                <span className="text-[11px] text-purple-600 font-bold uppercase tracking-wider block font-heading">
                  Địa bàn nhận hàng
                </span>
                <span className="text-xs sm:text-sm font-bold text-purple-900 truncate block">
                  {demand.province} {demand.industrialPark ? `(${demand.industrialPark})` : ''}
                </span>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl">
                <span className="text-[11px] text-amber-700 font-bold uppercase tracking-wider block font-heading">
                  Thời hạn cần
                </span>
                <span className="text-xs sm:text-sm font-bold text-amber-900 block font-mono">
                  {demand.deadline || 'Sớm nhất'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Section: Mô tả tóm tắt nhu cầu */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Bản tóm tắt nhu cầu tìm nguồn cung
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {demand.publicSummary}
              </p>

              {/* Yêu cầu điều kiện tham gia */}
              {demand.publicRequirements && demand.publicRequirements.length > 0 && (
                <div className="pt-2 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-heading">
                    Quy cách kỹ thuật & Tiêu chí lựa chọn nhà cung ứng:
                  </h3>
                  <div className="space-y-2">
                    {demand.publicRequirements.map((req, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quy định bảo mật thông tin Buyer (Section 4) */}
              <div className="p-4 bg-blue-50/60 border border-blue-200/70 rounded-2xl space-y-2 text-xs text-blue-900">
                <div className="flex items-center gap-2 font-bold font-heading">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Quy trình bảo mật danh tính & Ghép đôi B2B
                </div>
                <p className="text-[11px] leading-relaxed text-blue-800">
                  Để đảm bảo sự công bằng và tính bảo mật giao dịch, thông tin danh tính chi tiết, số điện thoại cá nhân và ngân sách nội bộ của Buyer được mã hóa. Nhà cung ứng gửi phản hồi <strong>"Tôi có khả năng đáp ứng"</strong> sẽ được Ban Điều Phối thẩm định năng lực và đưa vào danh sách Shortlist kết nối chính thức.
                </p>
              </div>

            </div>

            {/* Section: CTA Phản hồi năng lực */}
            <div className="bg-white rounded-3xl border border-blue-200 p-6 sm:p-8 shadow-xs space-y-5 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                    Doanh nghiệp của bạn có năng lực đáp ứng nhu cầu này?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gửi xác nhận năng lực, hồ sơ kỹ thuật và mẫu sản phẩm tới Ban Điều Phối để được ghép đôi với Buyer.
                  </p>
                </div>

                <button
                  disabled={isClosed}
                  onClick={() => setResponseModalOpen(true)}
                  className={`py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 shrink-0 ${
                    isClosed
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : existingResponse
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-[#0052cc] hover:bg-[#0047a5] text-white shadow-blue-500/20'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{existingResponse ? 'XEM / CẬP NHẬT PHẢN HỒI' : 'TÔI CÓ KHẢ NĂNG ĐÁP ỨNG'}</span>
                </button>
              </div>

              {existingResponse && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                  <span>Trạng thái hồ sơ của bạn: <strong>{existingResponse.responseStatus}</strong></span>
                  <span className="text-[11px] text-amber-700">Gửi lúc: {new Date(existingResponse.submittedAt).toLocaleString('vi-VN')}</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar: Điều phối & SUPPI (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Sourcing Coordinator Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  CCU
                </div>
                <div>
                  <h4 className="font-black text-slate-900 font-heading">
                    Ban Điều Phối Chuỗi Cung Ứng
                  </h4>
                  <p className="text-[10px] text-slate-400">CHUOICUNGUNG.COM Sourcing Desk</p>
                </div>
              </div>

              <div className="space-y-2 text-slate-600 leading-relaxed">
                <p>
                  Mọi phản hồi được giám sát độc lập bởi Hội đồng Điều phối nhằm tránh tình trạng chào thầu ảo, quấy rối doanh nghiệp và phá vỡ chuỗi cung ứng.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                  <div>✓ Thẩm định năng lực pháp lý & xưởng</div>
                  <div>✓ Bảo mật thông tin kỹ thuật dự án</div>
                  <div>✓ Hỗ trợ kết nối Buyer - Supplier trực tiếp</div>
                </div>
              </div>

              <button
                onClick={() => setSuppiModalOpen(true)}
                className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold transition flex items-center justify-center gap-1.5"
              >
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>Hỏi Trợ lý SUPPI về nhu cầu này</span>
              </button>
            </div>

            {/* Tiêu chí kiểm chứng đối chứng */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs">
              <h4 className="font-extrabold uppercase text-slate-500 font-heading text-[11px] tracking-wider">
                Yêu cầu kiểm chứng thực tế:
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-700">Mẫu thử đối chứng:</span>
                  <strong className={demand.sampleRequired ? 'text-amber-700 font-bold' : 'text-slate-500'}>
                    {demand.sampleRequired ? 'BẮT BUỘC' : 'Không bắt buộc'}
                  </strong>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-700">Khảo sát nhà máy:</span>
                  <strong className={demand.surveyRequired ? 'text-purple-700 font-bold' : 'text-slate-500'}>
                    {demand.surveyRequired ? 'CÓ KHẢO SÁT' : 'Không bắt buộc'}
                  </strong>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Modals */}
      <SupplierResponseModal
        isOpen={responseModalOpen}
        onClose={() => setResponseModalOpen(false)}
        requirement={demand}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <SuppiDemandAssistantModal
        isOpen={suppiModalOpen}
        onClose={() => setSuppiModalOpen(false)}
        requirement={demand}
        currentUser={currentUser}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab="login"
      />

    </div>
  );
}
