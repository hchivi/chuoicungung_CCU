import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, CheckCircle2, ArrowRight, ArrowLeft, Shield, 
  Clock, DollarSign, HelpCircle, Phone, Mail, MessageSquare, 
  FileText, Upload, Sparkles, Building2, Factory
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function PostDemandPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    category: 'Sản phẩm',
    industry: 'Bao bì & In ấn',
    location: 'Bắc Ninh',
    kcn: 'Yên Phong I',
    searchType: 'Chào giá cạnh tranh',
    orgType: 'Nhà máy',
    companyName: '',
    taxCode: '',
    scale: '100 - 500 nhân viên',
    website: '',
    contactName: '',
    position: 'Trưởng phòng mua hàng',
    email: '',
    phone: '',
    preferredContact: 'Email & Điện thoại',
    address: '',
    stageId: '1',
    phaseId: '1.2',
    budgetMin: '1.000.000.000',
    budgetMax: '1.500.000.000',
    deadline: '2024-06-30'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await fetch('/api/demands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title || 'Nhu cầu Sourcing B2B',
            stageId: parseInt(formData.stageId) || 1,
            phaseId: formData.phaseId || '1.2',
            category: formData.category || 'Sản phẩm',
            authorName: formData.contactName || 'Người đại diện',
            authorCompany: formData.companyName || 'Doanh nghiệp',
            authorEmail: formData.email || 'contact@company.com',
            authorPhone: formData.phone || '0901234567',
            location: formData.address || 'Toàn quốc',
            budget: `${formData.budgetMin || '1.000.000.000'} - ${formData.budgetMax || '1.500.000.000'} VNĐ`,
            deadline: formData.deadline || '2024-12-31',
            requirements: formData.shortDesc || formData.title,
            status: 'approved'
          })
        });
      } catch (err) {
        console.warn('API error, saving locally:', err);
      }
      setIsSuccess(true);
      setCurrentStep(6);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { num: 1, label: lang === 'en' ? "Basic Information" : "Thông tin nhu cầu" },
    { num: 2, label: lang === 'en' ? "Specifications & Tech" : "Chi tiết yêu cầu" },
    { num: 3, label: lang === 'en' ? "Budget & Timeline" : "Ngân sách & thời gian" },
    { num: 4, label: lang === 'en' ? "Docs & Attachments" : "Hồ sơ & tài liệu" },
    { num: 5, label: lang === 'en' ? "Review & Confirm" : "Xem lại & xác nhận" },
    { num: 6, label: lang === 'en' ? "Completed" : "Hoàn tất" },
  ];

  return (
    <div className="space-y-8 pb-20 pt-6 font-sans">
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-xs text-slate-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
          <span>&gt;</span>
          <Link to="/nhu-cau" className="hover:text-blue-600">{lang === 'en' ? 'Demands' : 'Nhu cầu'}</Link>
          <span>&gt;</span>
          <span className="text-blue-600 font-semibold">{lang === 'en' ? 'Post Sourcing Demand' : 'Đăng nhu cầu'}</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {lang === 'en' ? 'Post Sourcing & Procurement Demand' : 'Đăng nhu cầu tìm kiếm nhà cung cấp'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === 'en' 
              ? 'Post your procurement needs for industrial products, MEP, machinery, or services and receive qualified quotes within 24 hours.' 
              : 'Đăng tải nhu cầu tìm kiếm nhà cung cấp sản phẩm, dịch vụ, giải pháp phù hợp và nhận báo giá trong 24h.'}
          </p>
        </div>

        {/* 6 Step Progress Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {steps.map(s => (
              <div 
                key={s.num}
                className={`flex items-center space-x-2 p-2 rounded-xl text-xs transition ${
                  currentStep === s.num
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : currentStep > s.num
                    ? 'text-emerald-700 font-medium'
                    : 'text-slate-400'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentStep === s.num
                    ? 'bg-blue-600 text-white'
                    : currentStep > s.num
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {currentStep > s.num ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : s.num}
                </span>
                <span className="truncate font-heading">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout: Form (8 cols) + Helper Sidebar (4 cols) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Area */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            
            {currentStep === 6 ? (
              /* Success View */
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-heading">{lang === 'en' ? 'Demand Published Successfully!' : 'Đăng nhu cầu thành công!'}</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  {lang === 'en' 
                    ? 'Your demand has been received. Our team will review and distribute it to qualified industrial suppliers within 24 hours.' 
                    : 'Nhu cầu của bạn đã được tiếp nhận. Đội ngũ kiểm duyệt Chuỗi Cung Ứng.vn sẽ duyệt và thông báo tới các nhà cung cấp phù hợp trong vòng 24h.'}
                </p>
                <div className="pt-4 flex justify-center space-x-3">
                  <Link to="/san-nhu-cau" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition font-heading uppercase shadow-md shadow-blue-500/20">
                    {lang === 'en' ? '👉 Go to Sourcing Marketplace' : '👉 Đến Sàn Nhu Cầu B2B Xem Tin Vừa Đăng'}
                  </Link>
                  <button onClick={() => { setCurrentStep(1); setIsSuccess(false); }} className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition font-heading uppercase">
                    {lang === 'en' ? 'Post Another Demand' : 'Đăng nhu cầu khác'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNext} className="space-y-8 text-xs">
                
                {/* Step 1 Content */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide font-heading">
                        {lang === 'en' ? '1. Basic Sourcing Information' : '1. Thông tin nhu cầu cơ bản'}
                      </h3>
                      <p className="text-slate-500 mt-0.5">{lang === 'en' ? 'Provide high-level details about the products / services you require.' : 'Cung cấp thông tin tổng quan về sản phẩm / dịch vụ bạn cần tìm.'}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Demand Title *' : 'Tiêu đề nhu cầu *'}</label>
                        <input
                          required
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder={lang === 'en' ? "e.g. Seeking supplier for 3-ply carton packaging for export" : "VD: Tìm nhà cung cấp bao bì carton 3 lớp in flexo xuất khẩu"}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Brief Description (max 200 chars) *' : 'Mô tả ngắn gọn (tối đa 200 ký tự) *'}</label>
                        <textarea
                          required
                          rows="2"
                          maxLength="200"
                          name="shortDesc"
                          value={formData.shortDesc}
                          onChange={handleChange}
                          placeholder={lang === 'en' ? "Summarize quantity, specs, technical standards, delivery timeline..." : "Tóm tắt nhanh số lượng, quy cách, yêu cầu kỹ thuật và mục đích sử dụng..."}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Demand Category *' : 'Loại nhu cầu *'}</label>
                          <select 
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                          >
                            <option value="Sản phẩm">{lang === 'en' ? 'Product / Materials' : 'Sản phẩm'}</option>
                            <option value="Dịch vụ">{lang === 'en' ? 'Service / Maintenance' : 'Dịch vụ'}</option>
                            <option value="Giải pháp">{lang === 'en' ? 'Turnkey Solution' : 'Giải pháp'}</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Industry Group *' : 'Nhóm ngành *'}</label>
                          <select 
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                          >
                            <option value="Bao bì & In ấn">{lang === 'en' ? 'Packaging & Printing' : 'Bao bì & In ấn'}</option>
                            <option value="May mặc & Đồng phục">{lang === 'en' ? 'Apparel & Uniforms' : 'May mặc & Đồng phục'}</option>
                            <option value="Cơ điện & MEP">{lang === 'en' ? 'MEP & Industrial Automation' : 'Cơ điện & MEP'}</option>
                            <option value="Linh kiện điện tử">{lang === 'en' ? 'Electronic Components' : 'Linh kiện điện tử'}</option>
                            <option value="Xử lý môi trường">{lang === 'en' ? 'Environmental & Waste' : 'Xử lý môi trường'}</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Sourcing Method' : 'Hình thức tìm kiếm'}</label>
                          <select 
                            name="searchType"
                            value={formData.searchType}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                          >
                            <option value="Chào giá cạnh tranh">{lang === 'en' ? 'Competitive Bidding' : 'Chào giá cạnh tranh'}</option>
                            <option value="Chỉ định thầu">{lang === 'en' ? 'Direct Appointment' : 'Chỉ định thầu'}</option>
                            <option value="Hợp đồng nguyên tắc dài hạn">{lang === 'en' ? 'Long-term Master Agreement' : 'Hợp đồng nguyên tắc dài hạn'}</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Province / City *' : 'Tỉnh / Thành phố *'}</label>
                          <select 
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                          >
                            <option value="Bắc Ninh">Bắc Ninh</option>
                            <option value="Hải Phòng">Hải Phòng</option>
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="Đồng Nai">Đồng Nai</option>
                            <option value="Bình Dương">Bình Dương</option>
                            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Industrial Park / Delivery Address' : 'Khu công nghiệp / Địa điểm giao nhận'}</label>
                          <input
                            type="text"
                            name="kcn"
                            value={formData.kcn}
                            onChange={handleChange}
                            placeholder={lang === 'en' ? "e.g. Yen Phong I IP" : "VD: KCN Yên Phong I"}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Thông tin doanh nghiệp */}
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide font-heading">
                          {lang === 'en' ? '2. Enterprise / Factory Information' : '2. Thông tin Doanh nghiệp / Nhà máy'}
                        </h3>
                        <p className="text-slate-500 mt-0.5">{lang === 'en' ? 'This profile data helps suppliers verify and tailor suitable proposals.' : 'Thông tin này giúp nhà cung cấp hiểu rõ hơn về doanh nghiệp của bạn.'}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex gap-4">
                          {[
                            { key: "Nhà máy", label: lang === 'en' ? "Factory / Plant" : "Nhà máy" },
                            { key: "Doanh nghiệp", label: lang === 'en' ? "Enterprise" : "Doanh nghiệp" },
                            { key: "Tổ chức", label: lang === 'en' ? "Organization" : "Tổ chức" },
                            { key: "Cá nhân", label: lang === 'en' ? "Individual" : "Cá nhân" }
                          ].map(type => (
                            <label key={type.key} className="flex items-center space-x-2 cursor-pointer font-heading">
                              <input 
                                type="radio" 
                                name="orgType" 
                                value={type.key}
                                checked={formData.orgType === type.key}
                                onChange={handleChange}
                                className="text-blue-600 focus:ring-0" 
                              />
                              <span className="font-medium text-slate-700">{type.label}</span>
                            </label>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Company / Factory Name *' : 'Tên Doanh nghiệp / Nhà máy *'}</label>
                            <input
                              required
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleChange}
                              placeholder={lang === 'en' ? "e.g. ABC Precision Electronics Co., Ltd" : "VD: Công ty TNHH Điện tử ABC"}
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Tax ID / Enterprise Code (Optional)' : 'Mã số thuế (không bắt buộc)'}</label>
                            <input
                              type="text"
                              name="taxCode"
                              value={formData.taxCode}
                              onChange={handleChange}
                              placeholder="0102030405"
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Contact Person *' : 'Người liên hệ *'}</label>
                            <input
                              required
                              type="text"
                              name="contactName"
                              value={formData.contactName}
                              onChange={handleChange}
                              placeholder={lang === 'en' ? "Full Name" : "Họ và tên"}
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Official Inquiry Email *' : 'Email nhận báo giá *'}</label>
                            <input
                              required
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="procurement@company.com"
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Phone Number *' : 'Số điện thoại *'}</label>
                            <input
                              required
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="0901 234 567"
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Phân loại theo 6 giai đoạn */}
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide font-heading">
                          {lang === 'en' ? '3. Lifecycle Classification (6 Stages)' : '3. Phân loại theo Hệ thống 6 Giai đoạn'}
                        </h3>
                        <p className="text-slate-500 mt-0.5">{lang === 'en' ? 'Tagging the specific stage & phase routes your RFQ directly to matched specialist suppliers.' : 'Xác định giai đoạn và pha giúp kết nối chính xác nhất với nhà cung cấp chuyên trách.'}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Supply Stage *' : 'Giai đoạn *'}</label>
                          <select 
                            name="stageId"
                            value={formData.stageId}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                          >
                            {stagesData.map(s => (
                              <option key={s.id} value={s.id}>{lang === 'en' ? `Stage ${s.id}: ${s.title}` : `Giai đoạn ${s.id}: ${s.title}`}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 font-heading">{lang === 'en' ? 'Specific Phase' : 'Pha cụ thể'}</label>
                          <select 
                            name="phaseId"
                            value={formData.phaseId}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                          >
                            <option value="1.1">1.1 Khảo sát & Định hướng</option>
                            <option value="1.2">1.2 Pháp lý & Thủ tục</option>
                            <option value="1.3">1.3 Chọn địa điểm & Mặt bằng</option>
                            <option value="2.2">2.2 Thi công xây dựng</option>
                            <option value="2.3">2.3 Cơ điện & PCCC</option>
                            <option value="4.1">4.1 Cung ứng NVL, linh kiện</option>
                            <option value="5.3">5.3 Đồng phục & Bảo hộ (PPE)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Steps 2-5 Mock Flow */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 font-heading uppercase">{lang === 'en' ? 'Technical Specifications & Quality Standards' : 'Chi tiết yêu cầu kỹ thuật & Tiêu chuẩn'}</h3>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 font-heading">{lang === 'en' ? 'Technical Standards / Required Certifications' : 'Yêu cầu tiêu chuẩn kỹ thuật / Chứng chỉ bắt buộc'}</label>
                      <textarea rows="4" placeholder={lang === 'en' ? "e.g. ISO 9001:2015, RoHS compliant, minimum monthly capacity 50,000 units..." : "VD: Đạt ISO 9001:2015, có chứng chỉ RoHs, năng lực sản xuất tối thiểu 50.000 sản phẩm/tháng..."} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"></textarea>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 font-heading">{lang === 'en' ? 'Packaging Spec & Incoterms Delivery' : 'Quy cách đóng gói & Điều khoản giao hàng (Incoterms)'}</label>
                      <input type="text" placeholder={lang === 'en' ? "e.g. DDP Delivery at Yen Phong I IP, Bac Ninh" : "Giao hàng DDP tại nhà máy Yên Phong I, Bắc Ninh"} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 font-heading uppercase">{lang === 'en' ? 'Estimated Budget & Bidding Deadline' : 'Ngân sách dự kiến & Thời hạn'}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1 font-heading">{lang === 'en' ? 'Estimated Budget (VND)' : 'Ngân sách dự kiến (VND)'}</label>
                        <input type="text" value={formData.budgetMin + " - " + formData.budgetMax} onChange={() => {}} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-700 font-mono" />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1 font-heading">{lang === 'en' ? 'Proposal Submission Deadline' : 'Hạn chót nhận báo giá'}</label>
                        <input type="date" value={formData.deadline} onChange={() => {}} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 font-heading uppercase">{lang === 'en' ? 'Bidding Documents & Technical Drawings' : 'Hồ sơ mời thầu & File đính kèm'}</h3>
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2 hover:border-blue-500 transition cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="font-bold text-slate-700 font-heading">{lang === 'en' ? 'Drag and drop technical drawing or RFP files here' : 'Kéo thả file bản vẽ, file thông số kỹ thuật vào đây'}</p>
                      <p className="text-[11px] text-slate-400">{lang === 'en' ? 'Supports PDF, DOCX, XLSX, DWG, ZIP (Max 25MB)' : 'Hỗ trợ PDF, DOCX, XLSX, DWG, ZIP (Tối đa 25MB)'}</p>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 font-heading uppercase">{lang === 'en' ? 'Review & Verify Information' : 'Xem lại & Xác nhận thông tin'}</h3>
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs">
                      <p><strong>{lang === 'en' ? 'Demand Title:' : 'Tiêu đề:'}</strong> {formData.title || "Tìm nhà cung cấp bao bì carton 3 lớp"}</p>
                      <p><strong>{lang === 'en' ? 'Company:' : 'Doanh nghiệp:'}</strong> {formData.companyName || "Công ty TNHH Samsung Electronics"}</p>
                      <p><strong>{lang === 'en' ? 'Category:' : 'Loại nhu cầu:'}</strong> {formData.category} - {formData.industry}</p>
                      <p><strong>{lang === 'en' ? 'Location:' : 'Địa điểm:'}</strong> {formData.kcn}, {formData.location}</p>
                      <p><strong>{lang === 'en' ? 'Contact:' : 'Người liên hệ:'}</strong> {formData.contactName || "Nguyễn Văn A"} ({formData.phone || "0901234567"})</p>
                    </div>
                  </div>
                )}

                {/* Navigation Action Buttons */}
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center font-heading uppercase">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center space-x-1.5 transition"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{lang === 'en' ? 'Back' : 'Quay lại'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/san-nhu-cau')}
                      className="text-slate-400 hover:text-slate-600 font-medium"
                    >
                      {lang === 'en' ? 'Cancel' : 'Hủy bỏ'}
                    </button>
                  )}

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-2 transition"
                  >
                    <span>{currentStep === 5 ? (lang === 'en' ? "Confirm & Publish" : "Xác nhận & Đăng tải") : (lang === 'en' ? `Continue to Step ${currentStep + 1} →` : `Tiếp tục bước ${currentStep + 1} →`)}</span>
                  </button>
                </div>

              </form>
            )}

            {/* 4 Value Badges at bottom */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-blue-900 block font-heading">{lang === 'en' ? 'Matched Suppliers' : 'Tiếp cận đúng NCC'}</span>
                <span className="text-[10px] text-slate-500">{lang === 'en' ? 'Industry precision matching' : 'Kết nối đúng chuyên ngành'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-emerald-900 block font-heading">{lang === 'en' ? 'Save Time' : 'Tiết kiệm thời gian'}</span>
                <span className="text-[10px] text-slate-500">{lang === 'en' ? 'Receive quotes in 24h' : 'Nhận báo giá nhanh chóng'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-amber-900 block font-heading">{lang === 'en' ? 'Secure & Confidential' : 'An toàn & Bảo mật'}</span>
                <span className="text-[10px] text-slate-500">{lang === 'en' ? 'Protected enterprise data' : 'Thông tin được bảo vệ'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-purple-900 block font-heading">{lang === 'en' ? '100% Free' : 'Hoàn toàn miễn phí'}</span>
                <span className="text-[10px] text-slate-500">{lang === 'en' ? 'No hidden fees' : 'Không phụ phí ẩn'}</span>
              </div>
            </div>

          </div>

          {/* Right Sidebar Guide & Trust (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Hướng dẫn đăng nhu cầu */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                {lang === 'en' ? 'POSTING GUIDELINE' : 'HƯỚNG DẪN ĐĂNG NHU CẦU'}
              </h3>
              <ol className="space-y-2.5 text-slate-600">
                <li className="flex items-start space-x-2">
                  <strong className="text-blue-600 font-mono">1.</strong>
                  <span><strong>{lang === 'en' ? 'Fill basic info:' : 'Điền thông tin cơ bản:'}</strong> {lang === 'en' ? 'Title, category, delivery location.' : 'Tiêu đề, danh mục và địa điểm nhận hàng.'}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <strong className="text-blue-600 font-mono">2.</strong>
                  <span><strong>{lang === 'en' ? 'Detail specs:' : 'Mô tả chi tiết yêu cầu:'}</strong> {lang === 'en' ? 'Technical specs and required standards.' : 'Quy cách kỹ thuật và tiêu chuẩn cần có.'}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <strong className="text-blue-600 font-mono">3.</strong>
                  <span><strong>{lang === 'en' ? 'Set budget & timeline:' : 'Thiết lập ngân sách & thời gian:'}</strong> {lang === 'en' ? 'Budget frame and RFQ deadline.' : 'Khung giá và hạn chót nhận báo giá.'}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <strong className="text-blue-600 font-mono">4.</strong>
                  <span><strong>{lang === 'en' ? 'Upload files:' : 'Tải lên hồ sơ, tài liệu:'}</strong> {lang === 'en' ? 'Attach drawings or tender files.' : 'Đính kèm bản vẽ hoặc file mời thầu.'}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <strong className="text-blue-600 font-mono">5.</strong>
                  <span><strong>{lang === 'en' ? 'Review & submit:' : 'Xem lại & xác nhận:'}</strong> {lang === 'en' ? 'Verify accuracy before publishing.' : 'Kiểm tra độ chính xác trước khi xuất bản.'}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <strong className="text-blue-600 font-mono">6.</strong>
                  <span><strong>{lang === 'en' ? 'Receive bids:' : 'Nhận báo giá:'}</strong> {lang === 'en' ? 'Suppliers reply directly through system.' : 'Nhà cung cấp phản hồi trực tiếp qua hệ thống.'}</span>
                </li>
              </ol>
            </div>

            {/* Lưu ý quan trọng */}
            <div className="bg-amber-50/60 rounded-3xl border border-amber-200/80 p-6 space-y-3 text-xs">
              <h3 className="font-bold text-amber-900 flex items-center font-heading">
                <Sparkles className="w-4 h-4 mr-1 text-amber-600" />
                {lang === 'en' ? 'Important Notes' : 'Lưu ý quan trọng'}
              </h3>
              <ul className="space-y-1.5 text-amber-800 text-[11px]">
                <li>• {lang === 'en' ? 'Fields marked with * are required.' : 'Thông tin có dấu * là bắt buộc.'}</li>
                <li>• {lang === 'en' ? 'Detailed specs result in more accurate supplier bids.' : 'Mô tả càng chi tiết, càng nhận được báo giá sát thực tế.'}</li>
                <li>• {lang === 'en' ? 'Demands are vetted within 24 hours.' : 'Nhu cầu sẽ được duyệt trong vòng 24h.'}</li>
                <li>• {lang === 'en' ? 'You can edit or close your demand anytime.' : 'Bạn có thể chỉnh sửa hoặc đóng nhu cầu bất kỳ lúc nào.'}</li>
              </ul>
            </div>

            {/* Cần hỗ trợ */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                {lang === 'en' ? 'NEED SUPPORT?' : 'CẦN HỖ TRỢ?'}
              </h3>
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Hotline: <strong className="text-slate-900 font-mono">1900 8688</strong> (8h - 18h)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="font-mono">support@chuoicungung.vn</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
