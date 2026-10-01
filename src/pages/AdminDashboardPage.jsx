// ============================================================================
// PAGE 19 / MODULE 19: BÀN ĐIỀU PHỐI NỘI BỘ (ADMIN COMMAND CENTER)
// ROOT: /admin
// Chuẩn hóa theo spec 19.txt - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, MapPin, Layers, Users, Crown, 
  FileText, FolderOpen, UserCheck, Handshake, Image, BarChart3, 
  Settings, History, ChevronLeft, ChevronRight, Search, Bell, 
  CheckCircle2, Clock, MoreVertical, ArrowUpRight, TrendingUp, Filter, FolderTree, Key, ShoppingBag,
  ShieldCheck, Briefcase, Zap, DollarSign, ShieldAlert, Award, Bot, X, Check
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BrandLogo from '../components/BrandLogo';

// Sub-components
import AdminUnifiedOverview from '../components/admin/AdminUnifiedOverview';
import AdminUnifiedPipelineKanban from '../components/admin/AdminUnifiedPipelineKanban';
import AdminConnectionsManagement from '../components/admin/AdminConnectionsManagement';
import AdminTasksAndOverdueCenter from '../components/admin/AdminTasksAndOverdueCenter';
import AdminFinanceBoard from '../components/admin/AdminFinanceBoard';
import AdminDataQualityQueue from '../components/admin/AdminDataQualityQueue';
import AdminCategoriesManagement from '../components/admin/AdminCategoriesManagement';
import AdminKeywordsManagement from '../components/admin/AdminKeywordsManagement';
import AdminStagesManagement from '../components/admin/AdminStagesManagement';
import AdminDemandsManagement from '../components/admin/AdminDemandsManagement';
import AdminClaimsManagement from '../components/admin/AdminClaimsManagement';
import AdminServicesManagement from '../components/admin/AdminServicesManagement';
import AdminFoundingPartnersManagement from '../components/admin/AdminFoundingPartnersManagement';
import AdminProgramsManagement from '../components/admin/AdminProgramsManagement';
import AdminAssociationsManagement from '../components/admin/AdminAssociationsManagement';
import AdminIndustrialParksManagement from '../components/admin/AdminIndustrialParksManagement';
import AdminFactoriesManagement from '../components/admin/AdminFactoriesManagement';
import AdminCataloguesManagement from '../components/admin/AdminCataloguesManagement';
import AdminSponsorshipsManagement from '../components/admin/AdminSponsorshipsManagement';
import AdminDevelopmentPartnersManagement from '../components/admin/AdminDevelopmentPartnersManagement';
import AdminRemotePresenceManagement from '../components/admin/AdminRemotePresenceManagement';
import AdminSourcingDossiersManagement from '../components/admin/AdminSourcingDossiersManagement';
import AdminPartnershipHubManagement from '../components/admin/AdminPartnershipHubManagement';
import { Landmark, Factory, BookOpen, Radio, FileCheck } from 'lucide-react';

// Services
import {
  ADMIN_ROLES,
  getActiveAdminRole,
  setActiveAdminRole,
  searchAdminGlobal,
  getAllAdminAuditLogs
} from '../data/adminUnifiedCoordinationData';

export default function AdminDashboardPage({ defaultMenu = 'overview' }) {
  const { t, lang } = useLanguage();
  const { id: routeParamId } = useParams();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(defaultMenu);
  
  // RBAC State (Section 21)
  const [currentRole, setCurrentRole] = useState(getActiveAdminRole());
  
  // Global Search State (Section 11)
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (defaultMenu) {
      setActiveMenu(defaultMenu);
    }
  }, [defaultMenu]);

  // Handle Global Search Input
  useEffect(() => {
    if (globalSearchTerm.trim().length >= 2) {
      const results = searchAdminGlobal(globalSearchTerm);
      setGlobalSearchResults(results);
      setIsSearching(true);
    } else {
      setGlobalSearchResults([]);
      setIsSearching(false);
    }
  }, [globalSearchTerm]);

  // Handle Role Change
  const handleRoleChange = (roleId) => {
    const updated = setActiveAdminRole(roleId);
    setCurrentRole(updated);
  };

  // Close search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-900">
      
      {/* 1. Admin Top Header (Central Command Navigation) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-2.5 flex justify-between items-center shadow-xs">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2">
            <BrandLogo variant="light" size="sm" />
            <span className="text-xs text-slate-400 font-bold hidden sm:inline border-l border-slate-200 pl-2 font-mono">
              BÀN ĐIỀU PHỐI P0
            </span>
          </Link>
          <div className="border-l border-slate-200 pl-3 hidden md:block">
            <h2 className="text-xs font-black text-slate-800 font-heading uppercase tracking-wide">
              ADMIN COMMAND CENTER
            </h2>
            <p className="text-[10px] text-slate-400">
              Điều phối Đăng Nhu Cầu → Tìm Nguồn → Kết Nối → Theo Dõi → Kết Quả
            </p>
          </div>
        </div>

        {/* Global Search Bar (Section 11) */}
        <div ref={searchRef} className="relative flex-1 max-w-xs sm:max-w-md mx-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={globalSearchTerm}
              onChange={(e) => setGlobalSearchTerm(e.target.value)}
              placeholder="Tìm mã NC, MST, Công ty, NCC, Dịch vụ..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0052cc] outline-none transition font-medium"
            />
            {globalSearchTerm && (
              <button
                onClick={() => setGlobalSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearching && globalSearchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 max-h-80 overflow-y-auto divide-y divide-slate-100">
              {globalSearchResults.map((res, rIdx) => (
                <div
                  key={rIdx}
                  onClick={() => {
                    setIsSearching(false);
                    setGlobalSearchTerm('');
                    if (res.type === 'REQUIREMENT') {
                      setActiveMenu('pipeline');
                    } else if (res.type === 'ORGANIZATION') {
                      setActiveMenu('enterprises');
                    } else if (res.type === 'SERVICE_REQUEST') {
                      setActiveMenu('services');
                    } else if (res.type === 'FOUNDING_PARTNER') {
                      setActiveMenu('partners');
                    }
                  }}
                  className="p-3 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">
                        {res.type}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{res.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{res.subtitle}</div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{res.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Header: Role Switcher & Profile */}
        <div className="flex items-center space-x-3">
          
          {/* Live RBAC Role Switcher (Section 21) */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold hidden lg:inline">
              Vai trò:
            </span>
            <select
              value={currentRole.id}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-transparent font-bold text-xs text-[#0052cc] outline-none cursor-pointer font-heading"
              title="Chuyển đổi vai trò để kiểm tra phân quyền RBAC"
            >
              {Object.values(ADMIN_ROLES).map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-[#0b3f6d] text-white flex items-center justify-center font-bold text-xs font-heading shadow-xs">
              {currentRole.name[0]}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight font-heading">
                {currentRole.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentRole.id}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Admin Layout: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation (Exact Spec Section 8) */}
        <aside className={`bg-[#072847] text-slate-300 flex-shrink-0 transition-all duration-300 flex flex-col justify-between ${
          isSidebarCollapsed ? 'w-16' : 'w-60'
        }`}>
          <div className="py-3 space-y-1 overflow-y-auto max-h-[calc(100vh-110px)] scrollbar-thin">
            {[
              { id: 'overview', label: 'Tổng quan (5 câu hỏi)', icon: LayoutDashboard },
              { id: 'pipeline', label: 'Dòng chảy 5 cột (Kanban)', icon: Layers, highlight: true },
              { id: 'demands', label: 'B1. Nhu Cầu B2B', icon: ShoppingBag, count: '5+' },
              { id: 'connections', label: 'B3. Kết Nối Từng NCC', icon: Handshake, count: '3+' },
              { id: 'enterprises', label: 'B2. Hồ Sơ & Thiếu', icon: Building2, count: '1,254' },
              { id: 'claims', label: 'Yêu cầu quản lý hồ sơ', icon: ShieldCheck, count: '1+' },
              { id: 'programs', label: 'B4. Chương trình B2B', icon: Calendar },
              { id: 'associations', label: 'Hội & Hiệp Hội', icon: Landmark, count: '6+' },
              { id: 'industrial_parks', label: 'Khu Công Nghiệp', icon: Factory, count: '480' },
              { id: 'factories', label: 'Nhà Máy Sản Xuất', icon: Factory, count: '14k+' },
              { id: 'catalogues', label: 'Catalogue & Ấn Phẩm', icon: BookOpen, count: '7+' },
              { id: 'sponsorships', label: 'Tài Trợ & Đồng Hành', icon: Award, count: '3+' },
              { id: 'development_partners', label: 'Đối Tác Phát Triển', icon: Handshake, count: '3+' },
              { id: 'partnership_hub', label: 'Trung Tâm Hợp Tác', icon: Handshake, count: '3+' },
              { id: 'remote_presence', label: 'Hiện Diện Từ Xa', icon: Radio, count: '2+' },
              { id: 'sourcing_dossiers', label: 'Bộ Hồ Sơ Tuyển Chọn', icon: FileCheck, count: '3+' },
              { id: 'services', label: 'B5. Dịch Vụ & Desk', icon: Briefcase, count: '4' },
              { id: 'partners', label: 'B5. Founding Partner', icon: Crown, count: '2' },
              { id: 'tasks', label: 'Công Việc & Quá Hạn', icon: Clock, count: '4' },
              { id: 'tai-chinh', label: 'B6. Thu Chi & Hợp Đồng', icon: DollarSign, isFinanceOnly: true },
              { id: 'categories', label: 'Chuyên mục / Ngành', icon: FolderTree },
              { id: 'keywords', label: 'Nhu cầu / Từ khóa', icon: Key },
              { id: 'stages', label: 'Bản đồ 6 giai đoạn', icon: FolderOpen },
              { id: 'logs', label: 'Nhật ký Audit Logs', icon: History }
            ].map(item => {
              const Icon = item.icon;
              // Guard finance menu visually
              if (item.isFinanceOnly && currentRole.id !== 'SUPER_ADMIN' && currentRole.id !== 'FINANCE') {
                return null;
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center px-4 py-2.5 text-xs font-semibold transition cursor-pointer ${
                    activeMenu === item.id 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${item.highlight ? 'text-amber-400' : ''}`} />
                  {!isSidebarCollapsed && (
                    <div className="ml-3 flex-1 flex justify-between items-center text-left">
                      <span className={`truncate ${item.highlight ? 'font-black text-amber-300' : ''}`}>
                        {item.label}
                      </span>
                      {item.count && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
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
            {!isSidebarCollapsed && <span className="font-mono">P0 UNIFIED V1.0</span>}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* 3. Main Admin View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* View 1: Unified Command Overview (Section 2, 18, 41) */}
          {activeMenu === 'overview' ? (
            <AdminUnifiedOverview 
              onNavigateMenu={(menuId) => setActiveMenu(menuId)} 
            />
          ) : activeMenu === 'pipeline' ? (
            /* View 2: 5-Column Core Operational Kanban (Section 3, 4, 6, 12) */
            <AdminUnifiedPipelineKanban initialRequirementId={routeParamId} />
          ) : activeMenu === 'demands' ? (
            /* View 3: Board 01 Nhu Cầu B2B */
            <AdminDemandsManagement initialRequirementId={routeParamId} />
          ) : activeMenu === 'connections' ? (
            /* View 4: Board 03 Kết Nối Từng NCC */
            <AdminConnectionsManagement />
          ) : activeMenu === 'enterprises' ? (
            /* View 5: Board 02 Hồ Sơ & Data Quality Queue */
            <AdminDataQualityQueue />
          ) : activeMenu === 'tasks' ? (
            /* View 6: Overdue Center, My Work & Unified Task Engine */
            <AdminTasksAndOverdueCenter />
          ) : activeMenu === 'tai-chinh' ? (
            /* View 7: Board 06 Finance, Invoices & Reconciliation */
            <AdminFinanceBoard />
          ) : activeMenu === 'services' ? (
            /* View 8: Board 05 Unified Service Desk */
            <AdminServicesManagement initialRequestId={routeParamId} />
          ) : activeMenu === 'partners' ? (
            /* View 9: Board 05 Founding Partners Management */
            <AdminFoundingPartnersManagement initialPartnerId={routeParamId} />
          ) : activeMenu === 'categories' ? (
            <AdminCategoriesManagement />
          ) : activeMenu === 'keywords' ? (
            <AdminKeywordsManagement />
          ) : activeMenu === 'stages' ? (
            <AdminStagesManagement />
          ) : activeMenu === 'claims' ? (
            <AdminClaimsManagement />
          ) : activeMenu === 'programs' ? (
            /* Board 04: Chương trình & Lịch gặp B2B (Page 20 / Section 25 & 26) */
            <AdminProgramsManagement />
          ) : activeMenu === 'associations' ? (
            /* Board 04b: Quản lý Hội & Hiệp hội (Page 24) */
            <AdminAssociationsManagement />
          ) : activeMenu === 'industrial_parks' ? (
            /* Board: Quản trị KCN & Hệ sinh thái địa bàn (Page 26 / Section 28-32) */
            <AdminIndustrialParksManagement initialKcnId={routeParamId} />
          ) : activeMenu === 'factories' ? (
            /* Board: Quản trị Nhà máy & Phân tách Buy/Sell (Page 28 / Section 38-42) */
            <AdminFactoriesManagement initialFactoryId={routeParamId} />
          ) : activeMenu === 'catalogues' ? (
            /* Board: Quản lý Catalogue & Ấn phẩm B2B (Page 30 / Section 44-49) */
            <AdminCataloguesManagement />
          ) : activeMenu === 'sponsorships' ? (
            /* Board: Quản trị Tài Trợ & Đồng Hành (Page 32 / Section 41-47) */
            <AdminSponsorshipsManagement initialSponsorshipId={routeParamId} />
          ) : activeMenu === 'development_partners' ? (
            /* Board: Quản trị Đối Tác Phát Triển & Mạng Lưới Referral (Page 33 / Section 37-43) */
            <AdminDevelopmentPartnersManagement initialPartnerId={routeParamId} />
          ) : activeMenu === 'remote_presence' ? (
            /* Board: Quản trị Hiện Diện Từ Xa (Page 34 / Section 56-60) */
            <AdminRemotePresenceManagement />
          ) : activeMenu === 'sourcing_dossiers' ? (
            /* Board: Quản trị Bộ Hồ Sơ Tuyển Chọn (Page 35 / Section 46-48) */
            <AdminSourcingDossiersManagement />
          ) : activeMenu === 'partnership_hub' || activeMenu === 'hop_tac' ? (
            /* Board: Quản trị Trung Tâm Hợp Tác Hệ Sinh Thái (Page 37 / Section 54-58) */
            <AdminPartnershipHubManagement initialInquiryId={routeParamId} />
          ) : activeMenu === 'logs' ? (
            /* View 10: Unified Audit Logs (Section 30) */
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading">
                    Nhật Ký Hoạt Động Hệ Thống (Unified Audit Logs)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ghi lại mọi thay đổi trạng thái Nhu Cầu, Task, Ghép Nối NCC, Dịch Vụ và Hợp Đồng.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold">
                  Section 30 Compliant
                </span>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto divide-y divide-slate-100">
                {getAllAdminAuditLogs().map(log => (
                  <div key={log.id} className="pt-2.5 pb-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                          {log.action}
                        </span>
                        <span className="font-bold text-slate-800">{log.actor}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{log.details}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {log.timestamp?.slice(0, 19).replace('T', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <AdminUnifiedOverview onNavigateMenu={(menuId) => setActiveMenu(menuId)} />
          )}

        </main>
      </div>

    </div>
  );
}
