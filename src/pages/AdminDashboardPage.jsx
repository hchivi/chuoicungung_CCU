import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, MapPin, Layers, Users, Crown, 
  FileText, FolderOpen, UserCheck, Handshake, Image, BarChart3, 
  Settings, History, ChevronLeft, ChevronRight, Search, Bell, 
  CheckCircle2, Clock, MoreVertical, ArrowUpRight, TrendingUp, Filter
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BrandLogo from '../components/BrandLogo';

export default function AdminDashboardPage() {
  const { t, lang } = useLanguage();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('overview');

  // Approval state demo
  const [registrations, setRegistrations] = useState([
    { id: 1, name: "Công ty TNHH ABC", industry: "Sản xuất linh kiện điện tử", loc: "Hà Nội", stage: "Giai đoạn 1", date: "31/05/2024", status: "Chờ duyệt" },
    { id: 2, name: "Công ty Cổ phần DEF", industry: "Sản xuất cơ khí", loc: "Bắc Ninh", stage: "Giai đoạn 2", date: "31/05/2024", status: "Đã duyệt" },
    { id: 3, name: "Công ty TNHH GHI", industry: "Logistics", loc: "Hải Phòng", stage: "Giai đoạn 1", date: "30/05/2024", status: "Chờ duyệt" },
    { id: 4, name: "Công ty Cổ phần JKL", industry: "Sản xuất bao bì", loc: "Bình Dương", stage: "Giai đoạn 3", date: "30/05/2024", status: "Đã duyệt" },
    { id: 5, name: "Công ty TNHH MNO", industry: "Thực phẩm & Đồ uống", loc: "Đồng Nai", stage: "Giai đoạn 2", date: "29/05/2024", status: "Chờ duyệt" },
  ]);

  const toggleStatus = (id) => {
    setRegistrations(registrations.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: r.status === "Đã duyệt" ? "Chờ duyệt" : "Đã duyệt"
        };
      }
      return r;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Admin Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-2.5 flex justify-between items-center shadow-xs">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <BrandLogo variant="light" size="sm" />
            <span className="text-xs text-slate-400 font-bold hidden sm:inline border-l border-slate-200 pl-2">
              {lang === 'en' ? 'Admin Portal' : 'Quản trị hệ thống'}
            </span>
          </Link>
          <div className="border-l border-slate-200 pl-4 hidden md:block">
            <h2 className="text-xs font-bold text-slate-800 font-heading">{lang === 'en' ? 'Administration Command Center' : 'Dashboard quản trị'}</h2>
            <p className="text-[10px] text-slate-400">{lang === 'en' ? 'Welcome back, System Admin!' : 'Chào mừng trở lại, Admin!'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={lang === 'en' ? "Search administrative entities..." : "Tìm kiếm quản trị..."}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-48 focus:w-64 transition-all focus:outline-none"
            />
          </div>

          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
          </button>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-[#0b3f6d] text-white flex items-center justify-center font-bold text-xs font-heading">
              A
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight font-heading">Admin Master</span>
              <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Super Administrator' : 'Quản trị viên'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Layout: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className={`bg-[#072847] text-slate-300 flex-shrink-0 transition-all duration-300 flex flex-col justify-between ${
          isSidebarCollapsed ? 'w-16' : 'w-60'
        }`}>
          <div className="py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
            {[
              { id: 'overview', label: lang === 'en' ? 'Overview' : 'Tổng quan', icon: LayoutDashboard, path: '/admin' },
              { id: 'enterprises', label: lang === 'en' ? 'Suppliers' : 'Doanh nghiệp', icon: Building2, count: "1,254" },
              { id: 'kcn', label: lang === 'en' ? 'Industrial Parks' : 'Khu công nghiệp', icon: MapPin, count: "436" },
              { id: 'phases', label: lang === 'en' ? 'Phase Blueprints' : 'Pha mẫu', icon: Layers, count: "18" },
              { id: 'stages', label: lang === 'en' ? '6-Stage Master' : 'Bản đồ 6 giai đoạn', icon: FolderOpen },
              { id: 'associations', label: lang === 'en' ? 'Associations' : 'Hội / Hiệp hội', icon: Users, count: "32" },
              { id: 'partners', label: 'Founding Partner', icon: Crown },
              { id: 'news', label: lang === 'en' ? 'News & Articles' : 'Bài viết & Tin tức', icon: FileText },
              { id: 'library', label: lang === 'en' ? 'Doc Repository' : 'Thư viện tài liệu', icon: FolderOpen },
              { id: 'users', label: lang === 'en' ? 'Users & Accounts' : 'Người dùng', icon: UserCheck, count: "24.5k" },
              { id: 'clients', label: lang === 'en' ? 'Partners & Clients' : 'Đối tác & Khách hàng', icon: Handshake },
              { id: 'banners', label: lang === 'en' ? 'Banners & Media' : 'Banner & Truyền thông', icon: Image },
              { id: 'analytics', label: lang === 'en' ? 'Reports & Analytics' : 'Báo cáo & Thống kê', icon: BarChart3 },
              { id: 'config', label: lang === 'en' ? 'System Settings' : 'Cấu hình hệ thống', icon: Settings },
              { id: 'logs', label: lang === 'en' ? 'Audit Logs' : 'Nhật ký hoạt động', icon: History },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center px-4 py-2.5 text-xs font-semibold transition ${
                    activeMenu === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <div className="ml-3 flex-1 flex justify-between items-center text-left">
                      <span className="truncate">{item.label}</span>
                      {item.count && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {item.count}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom collapse button */}
          <div className="p-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
            {!isSidebarCollapsed && <span>{lang === 'en' ? 'Version 1.0.0' : 'Phiên bản 1.0.0'}</span>}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 hover:text-white rounded hover:bg-slate-800"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Main Admin View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Top 5 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* KPI 1 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'ENTERPRISES' : 'DOANH NGHIỆP'}</span>
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">1,254</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center font-mono">
                <TrendingUp className="w-3 h-3 mr-1" /> ↑ 12.5% {lang === 'en' ? 'MoM growth' : 'so với tháng trước'}
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'INDUSTRIAL PARKS' : 'KHU CÔNG NGHIỆP'}</span>
                <MapPin className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">436</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center font-mono">
                <TrendingUp className="w-3 h-3 mr-1" /> ↑ 8.7% {lang === 'en' ? 'MoM growth' : 'so với tháng trước'}
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'PHASE BLUEPRINTS' : 'PHA MẪU'}</span>
                <Layers className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">18</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center font-mono">
                <TrendingUp className="w-3 h-3 mr-1" /> ↑ 5.6% {lang === 'en' ? 'MoM growth' : 'so với tháng trước'}
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'ASSOCIATIONS' : 'HỘI / HIỆP HỘI'}</span>
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">32</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center font-mono">
                <TrendingUp className="w-3 h-3 mr-1" /> ↑ 3.2% {lang === 'en' ? 'MoM growth' : 'so với tháng trước'}
              </div>
            </div>

            {/* KPI 5 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'USERS & MEMBERS' : 'NGƯỜI DÙNG'}</span>
                <UserCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">24,568</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center font-mono">
                <TrendingUp className="w-3 h-3 mr-1" /> ↑ 15.3% {lang === 'en' ? 'MoM growth' : 'so với tháng trước'}
              </div>
            </div>

          </div>

          {/* Row 2: Charts & Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Chart 1: Tổng quan doanh nghiệp mới (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs text-slate-800 font-heading">{lang === 'en' ? 'New Enterprise Registrations' : 'Tổng quan doanh nghiệp mới'}</h3>
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">{lang === 'en' ? 'Last 30 days' : '30 ngày qua'}</span>
              </div>

              {/* Vector SVG Mock Chart */}
              <div className="h-44 flex items-end justify-between pt-6 px-2">
                {[120, 240, 410, 280, 320, 480, 620, 510, 750].map((h, idx) => (
                  <div key={idx} className="flex flex-col items-center space-y-1 group">
                    <div 
                      style={{ height: `${h / 9}px` }} 
                      className="w-6 bg-gradient-to-t from-blue-600 to-sky-400 rounded-t group-hover:brightness-110 transition"
                    ></div>
                    <span className="text-[9px] text-slate-400 font-mono">{`0${idx*3 + 1}/05`}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>{lang === 'en' ? 'Monthly Growth:' : 'Tăng trưởng tháng:'} <strong className="text-blue-600 font-mono">+12.5%</strong></span>
                <span>{lang === 'en' ? 'New Enterprises:' : 'Doanh nghiệp mới:'} <strong className="text-slate-800 font-mono">142</strong></span>
              </div>
            </div>

            {/* Chart 2: Cơ cấu theo giai đoạn (3 cols) */}
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-center">
              <h3 className="font-bold text-xs text-slate-800 text-left font-heading">{lang === 'en' ? 'Enterprises by Lifecycle Stage' : 'Doanh nghiệp theo giai đoạn'}</h3>
              
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                {/* SVG Donut */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#0284c7" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="0"></circle>
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="20 80" strokeDashoffset="-25"></circle>
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="4" strokeDasharray="18 82" strokeDashoffset="-45"></circle>
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="17 83" strokeDashoffset="-63"></circle>
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="12 88" strokeDashoffset="-80"></circle>
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeDasharray="8 92" strokeDashoffset="-92"></circle>
                </svg>
                <div className="absolute flex flex-col">
                  <span className="text-sm font-black text-slate-800 font-mono">1,254</span>
                  <span className="text-[9px] text-slate-400 font-heading">{lang === 'en' ? 'Total' : 'Tổng DN'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600 text-left pt-2 font-medium">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-sky-600 mr-1"></span> {lang === 'en' ? 'Stage 1' : 'GD 1'} (25%)</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> {lang === 'en' ? 'Stage 2' : 'GD 2'} (20%)</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-cyan-500 mr-1"></span> {lang === 'en' ? 'Stage 3' : 'GD 3'} (18%)</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span> {lang === 'en' ? 'Stage 4' : 'GD 4'} (17%)</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span> {lang === 'en' ? 'Stage 5' : 'GD 5'} (12%)</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> {lang === 'en' ? 'Stage 6' : 'GD 6'} (8%)</span>
              </div>
            </div>

            {/* Hoạt động gần đây (4 cols) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs text-slate-800 font-heading">{lang === 'en' ? 'Recent Audit Trail' : 'Hoạt động gần đây'}</h3>
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer font-heading">{lang === 'en' ? 'View all' : 'Xem tất cả'}</span>
              </div>

              <div className="space-y-3 text-xs">
                {(lang === 'en' ? [
                  { text: "Registered new supplier ABC Co., Ltd", time: "2 mins ago", icon: Building2, col: "text-blue-600" },
                  { text: "Updated master info for VSIP Bac Ninh IP", time: "15 mins ago", icon: MapPin, col: "text-emerald-600" },
                  { text: "Approved profile for XYZ Joint Stock Company", time: "30 mins ago", icon: CheckCircle2, col: "text-amber-600" },
                  { text: "Added phase template: Logistics & Warehousing", time: "1 hour ago", icon: Layers, col: "text-purple-600" },
                  { text: "Published article: Vietnam Industry Outlook 2024", time: "2 hours ago", icon: FileText, col: "text-sky-600" },
                ] : [
                  { text: "Thêm mới doanh nghiệp Công ty TNHH ABC", time: "2 phút trước", icon: Building2, col: "text-blue-600" },
                  { text: "Cập nhật thông tin KCN VSIP Bắc Ninh", time: "15 phút trước", icon: MapPin, col: "text-emerald-600" },
                  { text: "Duyệt doanh nghiệp Công ty Cổ phần XYZ", time: "30 phút trước", icon: CheckCircle2, col: "text-amber-600" },
                  { text: "Thêm mới pha mẫu Logistics & Kho bãi", time: "1 giờ trước", icon: Layers, col: "text-purple-600" },
                  { text: "Cập nhật bài viết Thị trường công nghiệp 2024", time: "2 giờ trước", icon: FileText, col: "text-sky-600" },
                ]).map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <div key={idx} className="flex items-start space-x-2.5 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                      <Icon className={`w-4 h-4 ${act.col} mt-0.5 flex-shrink-0`} />
                      <div className="flex-1">
                        <p className="text-slate-800 text-[11px] font-medium leading-snug">{act.text}</p>
                        <span className="text-[10px] text-slate-400">{act.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Row 3: Doanh nghiệp mới đăng ký & Thống kê theo lĩnh vực */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Table: Doanh nghiệp mới đăng ký (8 cols) */}
            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs text-slate-800 font-heading">{lang === 'en' ? 'Pending Supplier Approvals' : 'Doanh nghiệp mới đăng ký cần duyệt'}</h3>
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer font-heading">{lang === 'en' ? 'View all' : 'Xem tất cả'}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold font-heading">
                    <tr>
                      <th className="p-2.5 rounded-l-lg">{lang === 'en' ? 'Enterprise Name' : 'Tên Doanh nghiệp'}</th>
                      <th className="p-2.5">{lang === 'en' ? 'Industry' : 'Ngành nghề'}</th>
                      <th className="p-2.5">{lang === 'en' ? 'Location' : 'Địa điểm'}</th>
                      <th className="p-2.5">{lang === 'en' ? 'Stage' : 'Giai đoạn'}</th>
                      <th className="p-2.5">{lang === 'en' ? 'Reg. Date' : 'Ngày đăng ký'}</th>
                      <th className="p-2.5">{lang === 'en' ? 'Status' : 'Trạng thái'}</th>
                      <th className="p-2.5 rounded-r-lg text-center">{lang === 'en' ? 'Action' : 'Thao tác'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registrations.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-800 font-heading">{row.name}</td>
                        <td className="p-2.5 text-slate-600">{row.industry}</td>
                        <td className="p-2.5 text-slate-600">{row.loc}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold font-mono">
                            {row.stage}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400 font-mono text-[11px]">{row.date}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-heading ${
                            row.status === "Đã duyệt"
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {row.status === "Đã duyệt" ? (lang === 'en' ? "Approved" : "Đã duyệt") : (lang === 'en' ? "Pending" : "Chờ duyệt")}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => toggleStatus(row.id)}
                            className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded transition font-heading uppercase"
                          >
                            {row.status === "Chờ duyệt" ? (lang === 'en' ? "Approve" : "Duyệt") : (lang === 'en' ? "Revoke" : "Hủy duyệt")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bar Chart: Thống kê theo lĩnh vực (4 cols) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs text-slate-800 font-heading">{lang === 'en' ? 'Statistics by Sector' : 'Thống kê theo lĩnh vực'}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{lang === 'en' ? 'Last 30 days' : '30 ngày qua'}</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { name: lang === 'en' ? "Electronics & Components" : "Sản xuất linh kiện điện tử", count: 356, pct: 100 },
                  { name: lang === 'en' ? "Mechanical & Precision" : "Cơ khí chế tạo", count: 278, pct: 78 },
                  { name: lang === 'en' ? "Logistics & Warehousing" : "Logistics & Kho bãi", count: 189, pct: 53 },
                  { name: lang === 'en' ? "Food & Beverage" : "Thực phẩm & Đồ uống", count: 156, pct: 43 },
                  { name: lang === 'en' ? "Textile & Footwear" : "Dệt may & Da giày", count: 98, pct: 28 },
                  { name: lang === 'en' ? "Building Materials" : "Vật liệu xây dựng", count: 77, pct: 22 },
                  { name: lang === 'en' ? "Other Technical Services" : "Khác", count: 100, pct: 30 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-slate-700">{item.name}</span>
                      <strong className="text-slate-900 font-mono">{item.count}</strong>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${item.pct}%` }} 
                        className="h-full bg-blue-600 rounded-full"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}

