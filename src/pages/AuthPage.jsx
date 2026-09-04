import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Lock, ArrowRight, Building2, Factory, 
  Users, MapPin, Layers, CheckCircle2, Sparkles, KeyRound,
  Eye, EyeOff, Search, Compass, Award, Globe
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { useLanguage } from '../contexts/LanguageContext';

const MOCK_TAX_DATABASE = {
  '0101234567': {
    companyName: 'Công ty Cổ phần Tập đoàn TAHOMART Việt Nam',
    legalRepresentative: 'Nguyễn Văn Thành',
    address: 'Tầng 12, Tòa nhà Keangnam Landmark 72, Đường Phạm Hùng, Q. Nam Từ Liêm, Hà Nội',
    industry: 'Phân phối & Bán lẻ FMCG',
    defaultRole: 'Nhà máy / Chủ đầu tư'
  },
  '0314567890': {
    companyName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
    legalRepresentative: 'Đặng Tuấn Kiệt',
    address: '154 Phạm Văn Chiêu, Phường 9, Quận Gò Vấp, TP. Hồ Chí Minh',
    industry: 'Dệt may & Đồng phục Bảo hộ PPE',
    defaultRole: 'Nhà cung ứng'
  },
  '0209876543': {
    companyName: 'Tập đoàn Điện tử Samsung Electronics Việt Nam (SEV)',
    legalRepresentative: 'Park Hyun Suk',
    address: 'KCN Yên Phong I, Xã Yên Trung, Huyện Yên Phong, Tỉnh Bắc Ninh',
    industry: 'Điện tử & Bán dẫn',
    defaultRole: 'Nhà máy / Chủ đầu tư'
  },
  '3600123456': {
    companyName: 'Công ty TNHH Cơ Khí Chính Xác Long Thành M&E',
    legalRepresentative: 'Trần Đình Trọng',
    address: 'Đường số 3, KCN Long Thành, Huyện Long Thành, Tỉnh Đồng Nai',
    industry: 'Cơ khí & Chế tạo 18 Pha',
    defaultRole: 'Nhà cung ứng'
  }
};

export default function AuthPage() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isRegisterInitial = location.pathname.includes('dang-ky') || location.pathname.includes('register');
  const [tab, setTab] = useState(isRegisterInitial ? 'register' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    taxId: '',
    companyName: '',
    legalRepresentative: '',
    address: '',
    role: 'Nhà cung ứng',
    fullName: '',
    phone: ''
  });

  const [taxLookupLoading, setTaxLookupLoading] = useState(false);
  const [taxLookupSuccess, setTaxLookupSuccess] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('dang-ky') || location.pathname.includes('register')) {
      setTab('register');
    } else {
      setTab('login');
    }
  }, [location.pathname]);

  const isCorporateEmail = (email) => {
    if (!email || !email.includes('@')) return false;
    const commonFreeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1]?.toLowerCase().trim();
    return domain && !commonFreeDomains.includes(domain) && domain.includes('.');
  };

  const isFormValid = tab === 'login' 
    ? (formData.emailOrPhone.trim().length > 3 && formData.password.length >= 6)
    : (formData.emailOrPhone.trim().length > 3 && formData.password.length >= 6 && formData.companyName.trim().length > 2);

  const handleTaxLookup = () => {
    const cleanTax = formData.taxId.replace(/\s+/g, '');
    if (!cleanTax) return;

    setTaxLookupLoading(true);
    setTaxLookupSuccess(false);

    setTimeout(() => {
      const match = MOCK_TAX_DATABASE[cleanTax] || {
        companyName: `Doanh Nghiệp Đăng Ký MST: ${cleanTax}`,
        legalRepresentative: 'Đại diện theo pháp luật',
        address: 'Khu Công Nghiệp Việt Nam',
        industry: 'Sản xuất & Chuỗi cung ứng',
        defaultRole: formData.role
      };

      setFormData(prev => ({
        ...prev,
        companyName: match.companyName,
        legalRepresentative: match.legalRepresentative,
        address: match.address,
        role: match.defaultRole || prev.role
      }));

      setTaxLookupSuccess(true);
      setTaxLookupLoading(false);
    }, 600);
  };

  const handleSSOLogin = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Đăng nhập thành công qua ${provider}! Hệ thống đã tự động liên kết KYC Cấp 2 Hạng Vàng.`);
      navigate('/doanh-nghiep');
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (tab === 'login') {
        const input = formData.emailOrPhone.toLowerCase();
        if (input.includes('taho') || input.includes('samsung') || input.includes('fdi')) {
          alert('Đăng nhập thành công với vai trò Trưởng phòng Thu Mua! Chuyển hướng về Sàn Nhu Cầu Mua Sắm B2B.');
          navigate('/san-nhu-cau');
        } else if (input.includes('proser') || input.includes('supply') || input.includes('supplier')) {
          alert('Đăng nhập thành công với vai trò Nhà Cung Ứng! Chuyển hướng về Bản đồ 18 Pha kỹ thuật.');
          navigate('/ban-do-6-giai-doan');
        } else {
          alert(`Đăng nhập thành công! Chào mừng bạn vào Cổng Định Danh Chuỗi Cung Ứng.`);
          navigate('/doanh-nghiep');
        }
      } else {
        alert(`Đăng ký tài khoản thành công cho Doanh nghiệp: ${formData.companyName}! Vui lòng kiểm tra email để kích hoạt tài khoản.`);
        navigate('/dinh-vi-doanh-nghiep');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-10 sm:py-16 px-4 flex items-center justify-center font-sans antialiased text-slate-900">
      
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-400/20 via-indigo-300/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Intro Banner (B2G FDI Infrastructure) */}
        <div className="lg:col-span-5 space-y-6 hidden lg:block">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0052cc] text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CỔNG ĐỊNH DANH B2B / B2G</span>
            </div>
            <h1 className="text-3xl font-black text-[#072348] font-heading tracking-tight leading-tight">
              Hạ Tầng Kết Nối Chuỗi Cung Ứng & FDI Toàn Quốc
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mạng lưới định danh doanh nghiệp chính thức được bảo trợ bởi VCCI, kết nối trực tiếp hơn 620+ nhà máy FDI, 400+ Khu Công Nghiệp và các nhà cung ứng 18 pha kỹ thuật đạt chuẩn.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                ✓
              </div>
              <span>Xác thực pháp nhân & MST tức thì trong 10 giây</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                ✓
              </div>
              <span>Tích hợp Odoo ERP & BNI Connect SSO</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                ✓
              </div>
              <span>Bảo mật 2FA & Mã hóa dữ liệu SSL 256-bit</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-slate-200/90 space-y-5">
          
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <BrandLogo variant="light" size="md" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#072348] font-heading tracking-tight">
                Cổng Định Danh Chuỗi Cung Ứng Quốc Gia
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {tab === 'login' 
                  ? 'Đăng nhập bảo mật vào mạng lưới 620+ nhà máy FDI' 
                  : 'Đăng ký nhanh tài khoản doanh nghiệp B2B xác thực'}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="relative bg-slate-100 p-1 rounded-2xl flex items-center text-xs font-bold font-heading">
            <button
              type="button"
              onClick={() => { setTab('login'); navigate('/dang-nhap'); }}
              className={`flex-1 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-[#0052cc] shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>

            <button
              type="button"
              onClick={() => { setTab('register'); navigate('/dang-ky'); }}
              className={`flex-1 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-[#0052cc] shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Đăng Ký Doanh Nghiệp</span>
            </button>
          </div>

          {/* SSO Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 font-heading">
              <span>Đăng nhập nhanh qua hệ thống quản trị:</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono font-bold">
                ✓ KYC Cấp 2
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleSSOLogin('Odoo ERP')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 bg-slate-50 text-slate-800 font-bold transition flex flex-col items-center justify-center text-center gap-1 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">
                  O
                </div>
                <span className="text-[10.5px] font-heading leading-tight group-hover:text-purple-700">Odoo ERP</span>
              </button>

              <button
                type="button"
                onClick={() => handleSSOLogin('BNI Connect')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 bg-slate-50 text-slate-800 font-bold transition flex flex-col items-center justify-center text-center gap-1 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center text-[10px] font-black">
                  BNI
                </div>
                <span className="text-[10.5px] font-heading leading-tight group-hover:text-rose-700">BNI Connect</span>
              </button>

              <button
                type="button"
                onClick={() => handleSSOLogin('Microsoft Azure AD')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 bg-slate-50 text-slate-800 font-bold transition flex flex-col items-center justify-center text-center gap-1 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-[#0078D4] text-white flex items-center justify-center text-[10px] font-black">
                  MS
                </div>
                <span className="text-[10.5px] font-heading leading-tight group-hover:text-[#0078D4]">Azure AD</span>
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium">hoặc đăng nhập thủ công</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
          </div>

          {/* Role selector - REGISTER ONLY */}
          {tab === 'register' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block font-heading">
                Chọn tư cách tham gia hệ sinh thái:
              </label>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { role: 'Nhà máy / Chủ đầu tư', title: 'Nhà máy / Chủ đầu tư', desc: 'FDI, Nhà máy KCN', icon: Factory, color: 'text-blue-600' },
                  { role: 'Nhà cung ứng', title: 'Nhà cung ứng 18 Pha', desc: 'Xưởng, Vật tư, M&E', icon: Layers, color: 'text-emerald-600' },
                  { role: 'Hội / Hiệp hội', title: 'Hội / Hiệp hội', desc: 'Tổ chức xúc tiến B2B', icon: Users, color: 'text-indigo-600' },
                  { role: 'Khu công nghiệp', title: 'Khu công nghiệp', desc: 'Chủ đầu tư quỹ đất', icon: MapPin, color: 'text-amber-600' }
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = formData.role === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: item.role })}
                      className={`p-3 rounded-2xl border text-left transition flex items-start space-x-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/90 border-[#0052cc] ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className={`p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs shrink-0 ${item.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold font-heading truncate ${isSelected ? 'text-[#0052cc]' : 'text-slate-800'}`}>
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            {/* Auto-fill MST */}
            {tab === 'register' && (
              <div className="space-y-3 p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 block text-xs font-heading">
                    Nhập Mã Số Thuế Doanh Nghiệp (MST) *
                  </label>
                  <span className="text-[10px] text-[#0052cc] font-mono font-bold">
                    ⚡ Auto-fill 10 giây
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="VD: 0101234567 hoặc 0314567890"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc] text-xs font-mono"
                    />
                    {taxLookupSuccess && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleTaxLookup}
                    disabled={taxLookupLoading || !formData.taxId}
                    className="px-4 py-2.5 bg-[#0052cc] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{taxLookupLoading ? 'Đang tra...' : 'Tra Cứu'}</span>
                  </button>
                </div>

                {taxLookupSuccess && (
                  <div className="space-y-2 pt-1 text-[11px] animate-in fade-in">
                    <div>
                      <span className="font-bold text-slate-700">Tên Doanh nghiệp: </span>
                      <strong className="text-slate-900">{formData.companyName}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Trụ sở: </span>
                      <span className="text-slate-600">{formData.address}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input with corporate email checkmark */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 block text-xs font-heading">
                  {tab === 'login' ? 'Tài khoản đăng nhập *' : 'Email doanh nghiệp hoặc SĐT *'}
                </label>

                {isCorporateEmail(formData.emailOrPhone) && (
                  <span className="inline-flex items-center text-[10.5px] font-bold text-emerald-600 font-mono">
                    <CheckCircle2 className="w-3 h-3 mr-0.5" />
                    Corporate Email Verified
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  required
                  type="text"
                  placeholder="Email doanh nghiệp hoặc SĐT (VD: hr@samsung.vn)"
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                  className={`w-full pl-3.5 pr-10 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:bg-white text-xs sm:text-sm transition ${
                    isCorporateEmail(formData.emailOrPhone)
                      ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                      : 'border-slate-200 focus:ring-2 focus:ring-[#0052cc]'
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isCorporateEmail(formData.emailOrPhone) ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Building2 className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700 block text-xs font-heading">
                  Mật khẩu *
                </label>
                {tab === 'login' && (
                  <a 
                    href="#forgot" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      alert("Vui lòng liên hệ Hotline B2B: 1900 8686 hoặc email: hotro@chuoicungung.com để cấp lại mật khẩu xác thực."); 
                    }} 
                    className="text-[11px] text-[#0052cc] hover:underline font-semibold"
                  >
                    Quên mật khẩu?
                  </a>
                )}
              </div>

              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-3.5 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:bg-white text-xs sm:text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full py-3.5 rounded-xl font-bold font-heading shadow-md transition flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer ${
                  isFormValid
                    ? 'bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-blue-600 hover:from-[#003d8f] hover:to-[#004fa8] text-white shadow-blue-500/25 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xác thực định danh...</span>
                  </div>
                ) : (
                  <>
                    <span>{tab === 'login' ? 'Đăng Nhập Chuỗi Cung Ứng' : 'Hoàn Tất Đăng Ký Doanh Nghiệp'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mã hóa 2FA & Chuẩn bảo mật SSL 256-bit FDI</span>
              </div>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
