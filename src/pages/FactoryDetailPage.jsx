import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Factory, MapPin, Globe, Phone, Mail, CheckCircle2, 
  Calendar, Users, FileText, Share2, Star, ArrowRight, 
  ChevronRight, Award, Shield, Sparkles, Navigation, DollarSign, Layers, PlusCircle, Handshake
} from 'lucide-react';
import { factoriesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function FactoryDetailPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams();
  const factoryId = id || "factory-1";
  
  const [factory, setFactory] = useState(
    () => factoriesData.find(f => String(f.id) === String(factoryId)) || factoriesData[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchFactory = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/factories/${factoryId}`);
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setFactory(json.data);
        }
      } catch (e) {
        console.warn('API error in factory detail:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchFactory();
    return () => { isMounted = false; };
  }, [factoryId]);

  const tabs = [
    { id: 'overview', label: lang === 'en' ? 'Overview' : 'Tổng quan' },
    { id: 'specs', label: lang === 'en' ? 'Technical Specs' : 'Thông tin chi tiết' },
    { id: 'demands', label: lang === 'en' ? 'Demands' : 'Nhu cầu' },
    { id: 'suppliers', label: lang === 'en' ? 'Suppliers' : 'Nhà cung ứng' },
    { id: 'products', label: lang === 'en' ? 'Products & Tech' : 'Sản phẩm & Công nghệ' },
    { id: 'contact', label: lang === 'en' ? 'Contact' : 'Liên hệ' },
  ];

  return (
    <div className="space-y-8 pb-20 pt-6 font-sans">
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs text-slate-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600 font-medium">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
          <span>&gt;</span>
          <Link to="/nha-may" className="hover:text-blue-600 font-medium">{lang === 'en' ? 'Factories Directory' : 'Danh mục Nhà máy'}</Link>
          <span>&gt;</span>
          <span className="text-blue-600 font-bold font-heading">{factory.name}</span>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            
            {/* Left Info */}
            <div className="space-y-4 max-w-3xl">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 font-heading">
                {factory.status || (lang === 'en' ? "Operating Active" : "Đang hoạt động")}
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">{factory.name}</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {factory.companyName}
              </p>

              {/* Meta Chips */}
              <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                  {factory.ipName}
                </span>
                <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center font-medium">
                  <Users className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  {factory.employees}
                </span>
                <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center font-medium">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
                  {factory.investment || "6.5+ tỷ USD"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/dang-nhu-cau"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center space-x-1.5 font-heading uppercase"
                >
                  <Handshake className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Connect for Partnership' : 'Kết nối hợp tác'}</span>
                </Link>

                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 font-heading ${
                    isFollowing 
                      ? 'bg-blue-50 text-blue-600 border-blue-300' 
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>{isFollowing ? (lang === 'en' ? "Following" : "Đang theo dõi") : (lang === 'en' ? "Follow" : "Theo dõi")}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert(lang === 'en' ? "Factory profile link copied!" : "Đã sao chép liên kết nhà máy!");
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 font-heading"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Share' : 'Chia sẻ'}</span>
                </button>
              </div>
            </div>

            {/* Right Photo Preview */}
            <div className="lg:w-80 space-y-2 flex-shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-md group">
                <img 
                  src={factory.img || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60"} 
                  alt={factory.name} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/70 text-white text-[10px] font-bold rounded-lg backdrop-blur-sm font-heading">
                  {lang === 'en' ? 'View all (15 photos)' : 'Xem tất cả (15 ảnh)'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition font-heading uppercase ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Row 1: Con số nổi bật (5 boxes) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xl font-black text-blue-600 font-mono">20.000+</span>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{lang === 'en' ? 'Employees' : 'Nhân viên'}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xl font-black text-emerald-600 font-mono">6.5+ tỷ USD</span>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{lang === 'en' ? 'Total Investment' : 'Tổng vốn đầu tư'}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xl font-black text-amber-600 font-mono">1.35M m²</span>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{lang === 'en' ? 'Complex Area' : 'Diện tích tổ hợp'}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xl font-black text-purple-600 font-mono">120+</span>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{lang === 'en' ? 'Domestic Tier 1-2 Suppliers' : 'Nhà cung ứng nội địa'}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xl font-black text-sky-600 font-mono">Top 1</span>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{lang === 'en' ? 'Export Turnover' : 'Kim ngạch xuất khẩu'}</p>
          </div>
        </div>

        {/* Row 2: Sản phẩm chính & Biểu đồ kim ngạch xuất khẩu */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sản phẩm chính */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
              {lang === 'en' ? 'PRIMARY MANUFACTURED PRODUCTS' : 'SẢN PHẨM CHÍNH SẢN XUẤT'}
            </h3>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 block font-heading">{lang === 'en' ? 'Smartphones' : 'Điện thoại thông minh'}</span>
                <span className="text-[10px] text-slate-500">Galaxy S, Z Fold, A Series</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 block font-heading">{lang === 'en' ? 'Tablets' : 'Máy tính bảng'}</span>
                <span className="text-[10px] text-slate-500">Galaxy Tab Series</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 block font-heading">{lang === 'en' ? 'Wearables & Accessories' : 'Thiết bị đeo & Phụ kiện'}</span>
                <span className="text-[10px] text-slate-500">Galaxy Watch, Buds</span>
              </div>
            </div>
          </div>

          {/* Biểu đồ kim ngạch xuất khẩu (Tỷ USD) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                {lang === 'en' ? 'ANNUAL EXPORT TURNOVER ($ BILLIONS)' : 'KIM NGẠCH XUẤT KHẨU (TỶ USD)'}
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">2020 - 2024E</span>
            </div>

            <div className="h-28 flex items-end justify-between px-4 pt-4">
              {(factory.exportYears || [
                { year: "2020", value: 34.2 },
                { year: "2021", value: 38.5 },
                { year: "2022", value: 41.0 },
                { year: "2023", value: 39.5 },
                { year: "2024 (E)", value: 44.0 }
              ]).map((it, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1.5">
                  <span className="text-[10px] font-bold text-blue-700 font-mono">{it.value}</span>
                  <div 
                    style={{ height: `${it.value * 1.8}px` }} 
                    className="w-8 bg-blue-600 rounded-t"
                  ></div>
                  <span className="text-[10px] text-slate-500 font-mono">{it.year}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Nhu cầu đang tìm kiếm */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide font-heading">
              {lang === 'en' ? 'ACTIVE SOURCING RFQS & DEMANDS' : 'NHU CẦU ĐANG TÌM KIẾM CUNG ỨNG'}
            </h3>
            <Link to="/nhu-cau" className="text-xs text-blue-600 font-bold hover:underline font-heading">
              {lang === 'en' ? 'View All Demands →' : 'Xem tất cả nhu cầu →'}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(factory.activeDemands || [
              { title: lang === 'en' ? "Uniform supply for 5,000 workers/month" : "Cung cấp đồng phục công nhân 5.000 bộ/tháng", type: lang === 'en' ? "Products" : "Sản phẩm", budget: "1.2 - 1.5 tỷ VND", deadline: lang === 'en' ? "31 days left" : "Còn 31 ngày" },
              { title: lang === 'en' ? "Air freight & customs forwarder needed" : "Tìm đơn vị vận chuyển quốc tế hàng không", type: lang === 'en' ? "Services" : "Dịch vụ", budget: lang === 'en' ? "Negotiable" : "Thương thảo", deadline: lang === 'en' ? "15 days left" : "Còn 15 ngày" },
              { title: lang === 'en' ? "Supplier for ESD anti-static plastic trays" : "Nhà cung ứng khay nhựa chống tĩnh điện ESD", type: lang === 'en' ? "Products" : "Sản phẩm", budget: "500 - 800 triệu VND", deadline: lang === 'en' ? "20 days left" : "Còn 20 ngày" },
              { title: lang === 'en' ? "Hazardous sludge treatment plant contractor" : "Thầu nhà máy xử lý bùn thải nguy hại", type: lang === 'en' ? "Solutions" : "Giải pháp", budget: "1.5 - 2 tỷ VND", deadline: lang === 'en' ? "25 days left" : "Còn 25 ngày" }
            ]).map((dem, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded font-heading">
                    {dem.type}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2">{dem.title}</h4>
                </div>

                <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>{lang === 'en' ? 'Budget:' : 'Ngân sách:'}</span>
                    <strong className="text-blue-700 font-mono">{dem.budget}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{lang === 'en' ? 'Deadline:' : 'Hạn chót:'}</span>
                    <span>{dem.deadline}</span>
                  </div>
                </div>

                <Link 
                  to="/dang-nhu-cau"
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition text-center font-heading uppercase"
                >
                  {lang === 'en' ? 'Submit Quotation →' : 'Nộp báo giá →'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Nhà cung cấp & Đối tác tiêu biểu */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
            {lang === 'en' ? 'KEY STRATEGIC SUPPLIERS & PARTNERS' : 'NHÀ CUNG CẤP & ĐỐI TÁC TIÊU BIỂU'}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs">
            {(factory.featuredSuppliers || ["Samsung SDI", "LG Innotek", "Hana Micron", "SEMV", "Dongjin", "JNTC", "YURA"]).map((sup, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border border-slate-100 flex items-center justify-center font-heading">
                {sup}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#072847] to-blue-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold font-heading">{lang === 'en' ? `Seeking supply chain partnership with ${factory.name}?` : `Bạn đang tìm kiếm cơ hội hợp tác với ${factory.name}?`}</h3>
            <p className="text-xs text-slate-300">{lang === 'en' ? 'Connect directly to qualify as a verified supplier in their tier network.' : 'Kết nối trực tiếp để trở thành đối tác trong chuỗi cung ứng toàn cầu.'}</p>
          </div>
          <Link 
            to="/dang-nhu-cau"
            className="px-5 py-2.5 bg-sky-400 text-slate-900 font-bold rounded-xl text-xs hover:bg-sky-300 transition whitespace-nowrap font-heading uppercase"
          >
            {lang === 'en' ? 'Apply for Partnership Now →' : 'Đăng ký kết nối ngay →'}
          </Link>
        </div>
      </section>

    </div>
  );
}

