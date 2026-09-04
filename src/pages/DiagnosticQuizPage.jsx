import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, CheckCircle2, ArrowRight, RotateCcw, Sparkles, 
  Building2, Factory, Users, ShieldCheck, MapPin, Download, 
  FileText, Clock, AlertTriangle, ChevronRight, Check
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function DiagnosticQuizPage() {
  const { t, lang } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('Doanh nghiệp');
  const [selectedStage, setSelectedStage] = useState(3);
  const [isCompleted, setIsCompleted] = useState(false);

  const matchedStage = stagesData.find(s => s.id === selectedStage) || stagesData[2];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-8 pb-20 pt-6 font-sans">
      
      {/* Breadcrumb & Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-xs text-slate-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
          <span>&gt;</span>
          <span className="text-blue-600 font-semibold">{lang === 'en' ? 'Enterprise Positioning & AI Assessment' : 'Định vị doanh nghiệp'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold border border-amber-200">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'en' ? 'AI Supply Chain Diagnostic & Positioning Engine' : 'Công cụ Chẩn đoán & Định vị Chuỗi Cung Ứng AI'}</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-heading uppercase">
              {lang === 'en' ? 'WHICH STAGE IS YOUR ENTERPRISE AT?' : 'TÔI ĐANG Ở GIAI ĐOẠN NÀO?'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === 'en' 
                ? 'Answer the diagnostic questions below to identify your current stage and phase, and receive tailored partner recommendations.' 
                : 'Trả lời các câu hỏi dưới đây để hệ thống xác định giai đoạn, pha hiện tại của bạn và đề xuất giải pháp phù hợp nhất.'}
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm text-right">
            <span className="text-xs text-slate-400 block">{lang === 'en' ? 'Assessment Progress' : 'Tiến độ khảo sát'}</span>
            <strong className="text-sm font-bold text-blue-600 font-mono">
              {isCompleted ? (lang === 'en' ? "100% Completed" : "100% Hoàn thành") : (lang === 'en' ? `${(currentStep / 5 * 100).toFixed(0)}% Completed` : `Hoàn thành ${(currentStep / 5 * 100).toFixed(0)}%`)}
            </strong>
          </div>
        </div>
      </div>

      {!isCompleted ? (
        /* QUIZ QUESTION VIEW */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Role Selector */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                {lang === 'en' ? 'WHO ARE YOU?' : 'BẠN LÀ AI?'}
              </h3>
              <div className="space-y-2">
                {[
                  { name: lang === 'en' ? "Enterprise" : "Doanh nghiệp", desc: lang === 'en' ? "I supply industrial products/services" : "Tôi đại diện cho doanh nghiệp cung ứng sản phẩm/dịch vụ" },
                  { name: lang === 'en' ? "Investor" : "Nhà đầu tư", desc: lang === 'en' ? "I am exploring investment in new plant construction" : "Tôi đang tìm hiểu cơ hội đầu tư xây dựng nhà máy mới" },
                  { name: lang === 'en' ? "Factory Owner" : "Nhà máy", desc: lang === 'en' ? "I operate an active factory needing supply chain optimization" : "Tôi đang vận hành nhà máy sản xuất cần tối ưu chuỗi" },
                  { name: lang === 'en' ? "Equipment Supplier" : "Nhà cung cấp", desc: lang === 'en' ? "I supply machinery, tooling, and industrial materials" : "Tôi cung cấp máy móc thiết bị, nguyên phụ liệu" },
                  { name: lang === 'en' ? "Association / Org" : "Đơn vị hỗ trợ", desc: lang === 'en' ? "I represent an industrial association or support entity" : "Tôi là tổ chức hỗ trợ, hiệp hội doanh nghiệp" }
                ].map((role, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedRole(role.name)}
                    className={`p-3 rounded-2xl border cursor-pointer transition ${
                      selectedRole === role.name
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80'
                    }`}
                  >
                    <strong className="text-xs text-slate-900 block">{role.name}</strong>
                    <span className="text-[11px] text-slate-500 leading-snug">{role.desc}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start space-x-2 text-xs text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{lang === 'en' ? 'Your inputs are strictly confidential and used solely for partner matching.' : 'Thông tin của bạn được bảo mật tuyệt đối và chỉ dùng để đề xuất đối tác phù hợp.'}</span>
              </div>
            </div>

            {/* Right Question Container */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-mono font-bold text-blue-600">{lang === 'en' ? `QUESTION ${currentStep}/5` : `CÂU HỎI ${currentStep}/5`}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-heading">
                  {lang === 'en' ? 'Which stage is your enterprise currently operating in the industrial lifecycle?' : 'Doanh nghiệp của bạn hiện đang ở giai đoạn nào trong vòng đời sản xuất?'}
                </h3>
              </div>

              {/* 6 Stage Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 1, title: lang === 'en' ? "Stage 1" : "Giai đoạn 1", sub: lang === 'en' ? "Investment Prep" : "Chuẩn bị đầu tư", desc: lang === 'en' ? "Surveying IPs, planning capital and permits" : "Tôi đang tìm hiểu, lập kế hoạch đầu tư, khảo sát KCN" },
                  { id: 2, title: lang === 'en' ? "Stage 2" : "Giai đoạn 2", sub: lang === 'en' ? "Design & EPC" : "Thành lập & Thiết kế", desc: lang === 'en' ? "Entity setup, engineering design, civil construction" : "Tôi đang thành lập pháp nhân, thiết kế và thi công xây dựng" },
                  { id: 3, title: lang === 'en' ? "Stage 3" : "Giai đoạn 3", sub: lang === 'en' ? "Installation & MEP" : "Xây dựng nhà máy", desc: lang === 'en' ? "Installing CNC machines, MEP, fire safety systems" : "Tôi đang lắp đặt máy móc, cơ điện, PCCC, hoàn thiện không gian" },
                  { id: 4, title: lang === 'en' ? "Stage 4" : "Giai đoạn 4", sub: lang === 'en' ? "Production & Ops" : "Vận hành sản xuất", desc: lang === 'en' ? "Active manufacturing, raw materials, inventory, QA" : "Tôi đã đi vào sản xuất, cần nguyên vật liệu, quản lý và logistics" },
                  { id: 5, title: lang === 'en' ? "Stage 5" : "Giai đoạn 5", sub: lang === 'en' ? "Logistics & HR" : "Mở rộng & Nhân sự", desc: lang === 'en' ? "Workforce recruitment, logistics, worker welfare" : "Tôi đang tuyển dụng, chuẩn bị phúc lợi và bảo hộ lao động" },
                  { id: 6, title: lang === 'en' ? "Stage 6" : "Giai đoạn 6", sub: lang === 'en' ? "Optimize & ESG" : "Chuyển đổi & Tối ưu", desc: lang === 'en' ? "Digital transformation, green energy, ESG expansion" : "Tôi đang chuyển đổi số, tối ưu hệ thống và phát triển bền vững" },
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedStage(opt.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                      selectedStage === opt.id
                        ? 'bg-sky-50 border-sky-500 shadow-md ring-2 ring-sky-200'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">{opt.title}</span>
                      <strong className="text-xs text-slate-900 block leading-tight">{opt.sub}</strong>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">{opt.desc}</p>
                    </div>

                    <button className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedStage === opt.id ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                    }`}>
                      {selectedStage === opt.id ? (lang === 'en' ? "Selected ✓" : "Đã chọn ✓") : (lang === 'en' ? "Select" : "Chọn")}
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{lang === 'en' ? 'Tip: Select the stage closest to your actual project status for precise supplier matching.' : 'Mẹo: Hãy chọn giai đoạn gần nhất với tình trạng thực tế của dự án để nhận danh sách đối tác chính xác nhất.'}</span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <button 
                  onClick={() => setIsCompleted(true)}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  {lang === 'en' ? 'Skip & View Diagnostics Result Instantly →' : 'Bỏ qua & Xem kết quả phân tích ngay →'}
                </button>

                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition"
                >
                  <span>{currentStep === 5 ? (lang === 'en' ? "View Positioning Result" : "Xem kết quả định vị") : (lang === 'en' ? "Next Question →" : "Tiếp tục câu hỏi sau →")}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* INSTANT DIAGNOSTIC RESULT VIEW (Page 18 in PDF) */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
          
          {/* Main Result Hero Card */}
          {/* Main Result Hero Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl flex-shrink-0">
                  {lang === 'en' ? `STG ${selectedStage}` : `GĐ ${selectedStage}`}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-heading">{lang === 'en' ? 'YOUR POSITIONING RESULT' : 'KẾT QUẢ ĐỊNH VỊ CỦA BẠN'}</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                    {lang === 'en' ? `You are at Stage ${selectedStage}: ${matchedStage.titleEn || matchedStage.title}` : `Bạn đang ở Giai đoạn ${selectedStage}: ${matchedStage.title}`}
                  </h2>
                  <span className="text-xs text-blue-600 font-bold">
                    {lang === 'en' 
                      ? `Key recommended phase: Phase ${matchedStage.phases[1]?.id || '2.3'} - ${matchedStage.phases[1]?.titleEn || matchedStage.phases[1]?.title || 'MEP & Fire Protection'}` 
                      : `Pha khuyến nghị trọng tâm: Pha ${matchedStage.phases[1]?.id || '2.3'} - ${matchedStage.phases[1]?.title || 'Cơ điện & PCCC'}`}
                  </span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition self-start sm:self-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Retake Assessment' : 'Làm lại bài đánh giá'}</span>
              </button>
            </div>

            {/* Tổng quan lộ trình */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                {lang === 'en' ? 'PROJECT LIFECYCLE ROADMAP OVERVIEW' : 'TỔNG QUAN LỘ TRÌNH VÒNG ĐỜI DỰ ÁN'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
                {stagesData.map(stg => (
                  <div
                    key={stg.id}
                    className={`p-3 rounded-2xl border transition ${
                      stg.id === selectedStage
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                        : stg.id < selectedStage
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-bold block">{lang === 'en' ? `Stage ${stg.id}` : `Giai đoạn ${stg.id}`}</span>
                    <strong className="text-xs text-slate-800 block mt-0.5 leading-tight">{lang === 'en' ? (stg.titleEn || stg.title) : stg.title}</strong>
                    <span className={`text-[10px] font-bold block mt-1 ${
                      stg.id === selectedStage ? 'text-emerald-600' : stg.id < selectedStage ? 'text-slate-400' : 'text-blue-500'
                    }`}>
                      {stg.id === selectedStage 
                        ? (lang === 'en' ? "In Progress" : "Đang thực hiện") 
                        : stg.id < selectedStage 
                        ? (lang === 'en' ? "Completed" : "Đã hoàn thành") 
                        : (lang === 'en' ? "Upcoming" : "Kế hoạch tiếp theo")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Metric Boxes */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 text-blue-600 mr-1" />
                  {lang === 'en' ? 'Est. Remaining Time' : 'Thời gian ước tính còn lại'}
                </span>
                <strong className="text-base font-black text-slate-900 block">{lang === 'en' ? '6 - 9 Months' : '6 - 9 tháng'}</strong>
                <span className="text-[10px] text-slate-400">{lang === 'en' ? 'until stage completion' : 'đến khi hoàn thành giai đoạn'}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-500 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1" />
                  {lang === 'en' ? 'Current Priorities' : 'Ưu tiên hiện tại'}
                </span>
                <strong className="text-base font-black text-slate-900 block">{lang === 'en' ? '3 Workstreams' : '3 nhóm việc'}</strong>
                <span className="text-[10px] text-slate-400">{lang === 'en' ? 'critical to finalize' : 'quan trọng cần hoàn tất'}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-500 flex items-center">
                  <FileText className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  {lang === 'en' ? 'Matched Demands' : 'Nhu cầu phù hợp'}
                </span>
                <strong className="text-base font-black text-slate-900 block">{lang === 'en' ? '18 Demands' : '18 nhu cầu'}</strong>
                <span className="text-[10px] text-slate-400">{lang === 'en' ? 'high priority to source' : 'cần ưu tiên kết nối'}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-500 flex items-center">
                  <Building2 className="w-3.5 h-3.5 text-purple-600 mr-1" />
                  {lang === 'en' ? 'Matched Suppliers' : 'Nhà cung cấp phù hợp'}
                </span>
                <strong className="text-base font-black text-slate-900 block">{lang === 'en' ? '126 Suppliers' : '126 nhà cung cấp'}</strong>
                <span className="text-[10px] text-slate-400">{lang === 'en' ? 'verified & active' : 'đã được xác thực uy tín'}</span>
              </div>
            </div>
          </div>

          {/* Detailed Matched Recommendations */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 font-heading">
              {lang === 'en' ? 'Recommendations Tailored For You' : 'Đề xuất dành riêng cho bạn'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Nhu cầu ưu tiên */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                  {lang === 'en' ? 'PRIORITY SOURCING DEMANDS' : 'NHU CẦU CẦN ƯU TIÊN'}
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-red-50 text-red-900 rounded-xl border border-red-100">
                    <strong className="block">{lang === 'en' ? 'Automated Fire Safety System' : 'Hệ thống PCCC tự động'}</strong>
                    <span className="text-[10px] text-red-600 font-bold">{lang === 'en' ? 'Highest Priority' : 'Ưu tiên cao nhất'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <strong className="block text-slate-800">{lang === 'en' ? 'Industrial Power Substation' : 'Hệ thống điện công nghiệp'}</strong>
                    <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Design & EPC Substation' : 'Thiết kế & thi công trạm'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <strong className="block text-slate-800">{lang === 'en' ? 'Industrial Wastewater Treatment' : 'Xử lý nước thải sản xuất'}</strong>
                    <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Capacity: 500 m3/day' : 'Công suất 500 m3/ngày'}</span>
                  </div>
                </div>
              </div>

              {/* Nhà cung cấp phù hợp */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                  {lang === 'en' ? 'MATCHED SUPPLIERS' : 'NHÀ CUNG CẤP PHÙ HỢP'}
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-800 block">Hoa Binh Fire Safety</strong>
                      <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Fire Protection EPC' : 'Thi công PCCC'}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">98%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-800 block">SEAREFICO</strong>
                      <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Industrial Electrical' : 'Điện công nghiệp'}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">96%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-800 block">WEPAR Environmental</strong>
                      <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Wastewater Treatment' : 'Xử lý nước thải'}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">94%</span>
                  </div>
                </div>
              </div>

              {/* KCN phù hợp */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                  {lang === 'en' ? 'MATCHED INDUSTRIAL PARKS' : 'KCN PHÙ HỢP VỚI BẠN'}
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-800 block">VSIP Bac Ninh</strong>
                      <span className="text-[10px] text-slate-400">Bac Ninh</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">98%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-800 block">Amata Long Thanh</strong>
                      <span className="text-[10px] text-slate-400">Dong Nai</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">96%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-800 block">DEEP C Hai Phong</strong>
                      <span className="text-[10px] text-slate-400">Hai Phong</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">94%</span>
                  </div>
                </div>
              </div>

              {/* Tài liệu khuyến nghị */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                  {lang === 'en' ? 'RECOMMENDED GUIDES & STANDARDS' : 'TÀI LIỆU KHUYẾN NGHỊ'}
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    lang === 'en' ? "Fire Protection EPC Checklist (PDF)" : "Checklist thi công PCCC (PDF)",
                    lang === 'en' ? "Factory Fire Safety Standards (PDF)" : "Quy chuẩn PCCC nhà xưởng (PDF)",
                    lang === 'en' ? "MEP Acceptance Dossier Template (PDF)" : "Hồ sơ nghiệm thu MEP (PDF)"
                  ].map((doc, idx) => (
                    <div 
                      key={idx}
                      onClick={() => alert(lang === 'en' ? `Downloading: ${doc}` : `Tải xuống: ${doc}`)}
                      className="p-2.5 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-100 flex justify-between items-center cursor-pointer group"
                    >
                      <span className="font-medium text-slate-800 group-hover:text-blue-600 truncate">{doc}</span>
                      <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Consultation Booking Card */}
          <div className="bg-gradient-to-r from-[#072847] to-blue-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-heading">{lang === 'en' ? `Need tailored 1:1 consultation for Stage ${selectedStage}?` : `Cần tư vấn chi tiết cho giai đoạn ${selectedStage} của bạn?`}</h3>
              <p className="text-xs text-blue-200">
                {lang === 'en' 
                  ? 'Our team of industrial experts is ready to provide 1:1 consultation, connect right suppliers, and optimize supply chain costs.' 
                  : 'Đội ngũ chuyên gia của Chuỗi Cung Ứng.vn sẵn sàng đồng hành tư vấn 1:1, kết nối đúng nhà cung cấp và tối ưu chi phí.'}
              </p>
            </div>
            <button
              onClick={() => alert(lang === 'en' ? "Registered for 1:1 free consultation successfully!" : "Đăng ký tư vấn 1:1 miễn phí thành công!")}
              className="px-6 py-3 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300 transition whitespace-nowrap shadow-lg font-heading"
            >
              {lang === 'en' ? 'Register Free Consultation →' : 'Đăng ký tư vấn miễn phí →'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
