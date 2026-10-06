import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import SuppliMascot from './components/SuppliMascot';
import { LanguageProvider } from './contexts/LanguageContext';

// Lazy-loaded Pages for instant initial load and code-splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const SixStagesMapPage = lazy(() => import('./pages/SixStagesMapPage'));
const StageDetailPage = lazy(() => import('./pages/StageDetailPage'));
const PhaseDetailPage = lazy(() => import('./pages/PhaseDetailPage'));

// Dedicated Standalone Pages for all 18 Phases
const Phase1_1Page = lazy(() => import('./pages/phases/Phase1_1Page'));
const Phase1_2Page = lazy(() => import('./pages/phases/Phase1_2Page'));
const Phase1_3Page = lazy(() => import('./pages/phases/Phase1_3Page'));
const Phase2_1Page = lazy(() => import('./pages/phases/Phase2_1Page'));
const Phase2_2Page = lazy(() => import('./pages/phases/Phase2_2Page'));
const Phase2_3Page = lazy(() => import('./pages/phases/Phase2_3Page'));
const Phase3_1Page = lazy(() => import('./pages/phases/Phase3_1Page'));
const Phase3_2Page = lazy(() => import('./pages/phases/Phase3_2Page'));
const Phase3_3Page = lazy(() => import('./pages/phases/Phase3_3Page'));
const Phase4_1Page = lazy(() => import('./pages/phases/Phase4_1Page'));
const Phase4_2Page = lazy(() => import('./pages/phases/Phase4_2Page'));
const Phase4_3Page = lazy(() => import('./pages/phases/Phase4_3Page'));
const Phase5_1Page = lazy(() => import('./pages/phases/Phase5_1Page'));
const Phase5_2Page = lazy(() => import('./pages/phases/Phase5_2Page'));
const Phase5_3Page = lazy(() => import('./pages/phases/Phase5_3Page'));
const Phase6_1Page = lazy(() => import('./pages/phases/Phase6_1Page'));
const Phase6_2Page = lazy(() => import('./pages/phases/Phase6_2Page'));
const Phase6_3Page = lazy(() => import('./pages/phases/Phase6_3Page'));
const EnterprisesPage = lazy(() => import('./pages/EnterprisesPage'));
const EnterpriseDetailPage = lazy(() => import('./pages/EnterpriseDetailPage'));
const ProductServiceDetailPage = lazy(() => import('./pages/ProductServiceDetailPage'));
const IndustrialParksPage = lazy(() => import('./pages/IndustrialParksPage'));
const IndustrialParkDetailPage = lazy(() => import('./pages/IndustrialParkDetailPage'));
const FactoriesPage = lazy(() => import('./pages/FactoriesPage'));
const FactoryDetailPage = lazy(() => import('./pages/FactoryDetailPage'));
const AssociationsPage = lazy(() => import('./pages/AssociationsPage'));
const AssociationDetailPage = lazy(() => import('./pages/AssociationDetailPage'));
const CataloguesPage = lazy(() => import('./pages/CataloguesPage'));
const CatalogueDetailPage = lazy(() => import('./pages/CatalogueDetailPage'));
const SponsorshipPage = lazy(() => import('./pages/SponsorshipPage'));
const DevelopmentPartnerPage = lazy(() => import('./pages/DevelopmentPartnerPage'));
const PartnershipHubPage = lazy(() => import('./pages/PartnershipHubPage'));
const RemotePresenceServicePage = lazy(() => import('./pages/RemotePresenceServicePage'));
const SourcingDossierDetailPage = lazy(() => import('./pages/SourcingDossierDetailPage'));
const DemandsPage = lazy(() => import('./pages/DemandsPage'));
const DemandDetailPage = lazy(() => import('./pages/DemandDetailPage'));
const PostDemandPage = lazy(() => import('./pages/PostDemandPage'));
const DiagnosticQuizPage = lazy(() => import('./pages/DiagnosticQuizPage'));
const VietnamMapPage = lazy(() => import('./pages/VietnamMapPage'));
const MarketDashboardPage = lazy(() => import('./pages/MarketDashboardPage'));
const FoundingPartnerPage = lazy(() => import('./pages/FoundingPartnerPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const EcosystemOverviewPage = lazy(() => import('./pages/EcosystemOverviewPage'));
const IndustryCategoryPage = lazy(() => import('./pages/IndustryCategoryPage'));
const KeywordDetailPage = lazy(() => import('./pages/KeywordDetailPage'));
const RecruitmentPage = lazy(() => import('./pages/RecruitmentPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const B2bTermsOfServicePage = lazy(() => import('./pages/B2bTermsOfServicePage'));
const B2bPrivacyPolicyPage = lazy(() => import('./pages/B2bPrivacyPolicyPage'));
const ToDzungPortfolioPage = lazy(() => import('./pages/ToDzungPortfolioPage'));
const TonyDongPortfolioPage = lazy(() => import('./pages/TonyDongPortfolioPage'));
const JennyTrinhPortfolioPage = lazy(() => import('./pages/JennyTrinhPortfolioPage'));
const SupplyChainExpoPage = lazy(() => import('./pages/SupplyChainExpoPage'));
const SupplyChainExpoRegistrationPage = lazy(() => import('./pages/SupplyChainExpoRegistrationPage'));
const ProgramDetailPage = lazy(() => import('./pages/ProgramDetailPage'));
const ProgramRegistrationPage = lazy(() => import('./pages/ProgramRegistrationPage'));
const ProgramLibraryPage = lazy(() => import('./pages/ProgramLibraryPage'));
const UserProgramsWorkspacePage = lazy(() => import('./pages/UserProgramsWorkspacePage'));
const AiWorkspacePage = lazy(() => import('./pages/AiWorkspacePage'));
const SuppiSearchPage = lazy(() => import('./pages/SuppiSearchPage'));
const DemandWorkspacePage = lazy(() => import('./pages/DemandWorkspacePage'));
const CreateProfilePage = lazy(() => import('./pages/CreateProfilePage'));
const ServicesCenterPage = lazy(() => import('./pages/ServicesCenterPage'));
const ServiceRequestPage = lazy(() => import('./pages/ServiceRequestPage'));
const UserRequestsWorkspacePage = lazy(() => import('./pages/UserRequestsWorkspacePage'));
const MatchmakingServicePage = lazy(() => import('./pages/MatchmakingServicePage'));
const MediaBrandingServicePage = lazy(() => import('./pages/MediaBrandingServicePage'));
const MerchandiseEventServicePage = lazy(() => import('./pages/MerchandiseEventServicePage'));

// Elegant brand loading placeholder with rotating logo_onlyc.png centered on PC and mobile
function PageLoadingFallback() {
  return (
    <div className="flex-1 min-h-[calc(100vh-280px)] sm:min-h-[calc(100vh-320px)] flex items-center justify-center p-6 w-full">
      <img 
        src="/logo_onlyc.png" 
        alt="Logo Chuỗi Cung Ứng" 
        className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 object-contain animate-spin select-none pointer-events-none drop-shadow-md"
        style={{ animationDuration: '2.5s' }}
      />
    </div>
  );
}

// Error boundary to prevent white screens
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CCU App Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0052cc] flex items-center justify-center mx-auto text-2xl font-black">
              ⚙️
            </div>
            <h2 className="text-xl font-black text-slate-900 font-heading">
              Đang tải lại hệ thống Chuỗi Cung Ứng
            </h2>
            {this.state.error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-left text-xs font-mono text-rose-700 overflow-auto max-h-40">
                <p className="font-bold">{this.state.error.toString()}</p>
              </div>
            )}
            <p className="text-xs text-slate-500 leading-relaxed">
              Trang web đang được tự động đồng bộ hóa phiên bản mới nhất. Vui lòng bấm nút bên dưới để tiếp tục.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold text-sm rounded-xl shadow-md transition"
            >
              Tải lại trang (Reload)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Parametric redirect helper for deduplicating alias URLs
function ParamRedirect({ toPrefix }) {
  const params = useParams();
  const id = params.id || params.slug || params.eventId || '';
  return <Navigate to={`${toPrefix}/${id}`} replace />;
}

function MainLayout({ children, onOpenSearch }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isToDzung = location.pathname.startsWith('/todzung');
  const isTonyDong = location.pathname.startsWith('/tonydong');
  const isJennyTrinh = location.pathname.startsWith('/jennytrinh') || location.pathname.startsWith('/mstrinh');
  const isAiWorkspace = location.pathname.startsWith('/tro-ly-ai') || location.pathname.startsWith('/ai');
  const hideHeaderFooter = isAdmin || isToDzung || isTonyDong || isJennyTrinh || isAiWorkspace;
  const isPhotographicRoute = ['/doi-tac-phat-trien', '/dich-vu/to-chuc-ket-noi'].includes(location.pathname);
  const isDemandMarketplace = location.pathname === '/san-nhu-cau';
  const isLifecycleMap = location.pathname === '/ban-do-6-giai-doan';

  return (
    <div className={`flex flex-col min-h-screen ${hideHeaderFooter ? '' : 'ccu-public-shell'} ${(isPhotographicRoute || isDemandMarketplace || isLifecycleMap) ? 'ccu-photographic-route' : ''}`}>
      {!hideHeaderFooter && <Navbar onOpenSearch={onOpenSearch} />}
      <div className="flex-1 min-w-0 flex flex-col" id="main-content">
        {children}
      </div>
      {!hideHeaderFooter && <Footer />}
      {!isAiWorkspace && !isAdmin && !isToDzung && !isJennyTrinh && <SuppliMascot />}
    </div>
  );
}

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          
          <MainLayout onOpenSearch={() => setIsSearchOpen(true)}>
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/ban-do-6-giai-doan" element={<SixStagesMapPage />} />
                
                {/* 6 Lifecycle Stages - Canonical Slugs & Legacy Redirects */}
                <Route path="/giai-doan/giai-doan-1" element={<Navigate to="/giai-doan/chuan-bi-dau-tu" replace />} />
                <Route path="/giai-doan/giai-doan-2" element={<Navigate to="/giai-doan/thiet-ke-xay-dung" replace />} />
                <Route path="/giai-doan/giai-doan-3" element={<Navigate to="/giai-doan/lap-dat-hoan-thien" replace />} />
                <Route path="/giai-doan/giai-doan-4" element={<Navigate to="/giai-doan/van-hanh-san-xuat" replace />} />
                <Route path="/giai-doan/giai-doan-5" element={<Navigate to="/giai-doan/nhan-su-hau-can" replace />} />
                <Route path="/giai-doan/giai-doan-6" element={<Navigate to="/giai-doan/mo-rong-toi-uu-chuyen-doi" replace />} />
                <Route path="/giai-doan/1" element={<Navigate to="/giai-doan/chuan-bi-dau-tu" replace />} />
                <Route path="/giai-doan/2" element={<Navigate to="/giai-doan/thiet-ke-xay-dung" replace />} />
                <Route path="/giai-doan/3" element={<Navigate to="/giai-doan/lap-dat-hoan-thien" replace />} />
                <Route path="/giai-doan/4" element={<Navigate to="/giai-doan/van-hanh-san-xuat" replace />} />
                <Route path="/giai-doan/5" element={<Navigate to="/giai-doan/nhan-su-hau-can" replace />} />
                <Route path="/giai-doan/6" element={<Navigate to="/giai-doan/mo-rong-toi-uu-chuyen-doi" replace />} />
                <Route path="/giai-doan/:id" element={<StageDetailPage />} />
                
                {/* 18 Technical Phases - Canonical Keyword Slugs */}
                <Route path="/pha/khao-sat-dinh-huong" element={<Phase1_1Page />} />
                <Route path="/pha/phap-ly-thu-tuc" element={<Phase1_2Page />} />
                <Route path="/pha/chon-dia-diem-mat-bang" element={<Phase1_3Page />} />
                <Route path="/pha/thiet-ke-quy-hoach" element={<Phase2_1Page />} />
                <Route path="/pha/thi-cong-xay-dung" element={<Phase2_2Page />} />
                <Route path="/pha/co-dien-ha-tang-ky-thuat" element={<Phase2_3Page />} />
                <Route path="/pha/lap-dat-may-day-chuyen" element={<Phase3_1Page />} />
                <Route path="/pha/hoan-thien-khong-gian-san-xuat" element={<Phase3_2Page />} />
                <Route path="/pha/kiem-tra-chay-thu" element={<Phase3_3Page />} />
                <Route path="/pha/cung-ung-dau-vao" element={<Phase4_1Page />} />
                <Route path="/pha/quan-ly-san-xuat-kiem-soat" element={<Phase4_2Page />} />
                <Route path="/pha/giao-nhan-phan-phoi" element={<Phase4_3Page />} />
                <Route path="/pha/tuyen-dung-lao-dong" element={<Phase5_1Page />} />
                <Route path="/pha/doi-song-phuc-loi" element={<Phase5_2Page />} />
                <Route path="/pha/dong-phuc-bao-ho" element={<Phase5_3Page />} />
                <Route path="/pha/mo-rong-cong-suat" element={<Phase6_1Page />} />
                <Route path="/pha/chuan-hoa-danh-gia" element={<Phase6_2Page />} />
                <Route path="/pha/chuyen-doi-tai-cau-truc" element={<Phase6_3Page />} />

                {/* Legacy Numeric Phase Redirects to Canonical Keyword Slugs */}
                <Route path="/pha/1.1" element={<Navigate to="/pha/khao-sat-dinh-huong" replace />} />
                <Route path="/pha/1-1" element={<Navigate to="/pha/khao-sat-dinh-huong" replace />} />
                <Route path="/pha/1-1-khao-sat-thue-dat-khu-cong-nghiep" element={<Navigate to="/pha/khao-sat-dinh-huong" replace />} />
                <Route path="/pha/1.2" element={<Navigate to="/pha/phap-ly-thu-tuc" replace />} />
                <Route path="/pha/1-2" element={<Navigate to="/pha/phap-ly-thu-tuc" replace />} />
                <Route path="/pha/1-2-phap-ly-thu-tuc-dau-tu" element={<Navigate to="/pha/phap-ly-thu-tuc" replace />} />
                <Route path="/pha/1.3" element={<Navigate to="/pha/chon-dia-diem-mat-bang" replace />} />
                <Route path="/pha/1-3" element={<Navigate to="/pha/chon-dia-diem-mat-bang" replace />} />
                <Route path="/pha/1-3-chon-dia-diem-mat-bang" element={<Navigate to="/pha/chon-dia-diem-mat-bang" replace />} />
                <Route path="/pha/2.1" element={<Navigate to="/pha/thiet-ke-quy-hoach" replace />} />
                <Route path="/pha/2-1" element={<Navigate to="/pha/thiet-ke-quy-hoach" replace />} />
                <Route path="/pha/2.2" element={<Navigate to="/pha/thi-cong-xay-dung" replace />} />
                <Route path="/pha/2-2" element={<Navigate to="/pha/thi-cong-xay-dung" replace />} />
                <Route path="/pha/2.3" element={<Navigate to="/pha/co-dien-ha-tang-ky-thuat" replace />} />
                <Route path="/pha/2-3" element={<Navigate to="/pha/co-dien-ha-tang-ky-thuat" replace />} />
                <Route path="/pha/3.1" element={<Navigate to="/pha/lap-dat-may-day-chuyen" replace />} />
                <Route path="/pha/3-1" element={<Navigate to="/pha/lap-dat-may-day-chuyen" replace />} />
                <Route path="/pha/3.2" element={<Navigate to="/pha/hoan-thien-khong-gian-san-xuat" replace />} />
                <Route path="/pha/3-2" element={<Navigate to="/pha/hoan-thien-khong-gian-san-xuat" replace />} />
                <Route path="/pha/3.3" element={<Navigate to="/pha/kiem-tra-chay-thu" replace />} />
                <Route path="/pha/3-3" element={<Navigate to="/pha/kiem-tra-chay-thu" replace />} />
                <Route path="/pha/4.1" element={<Navigate to="/pha/cung-ung-dau-vao" replace />} />
                <Route path="/pha/4-1" element={<Navigate to="/pha/cung-ung-dau-vao" replace />} />
                <Route path="/pha/4.2" element={<Navigate to="/pha/quan-ly-san-xuat-kiem-soat" replace />} />
                <Route path="/pha/4-2" element={<Navigate to="/pha/quan-ly-san-xuat-kiem-soat" replace />} />
                <Route path="/pha/4.3" element={<Navigate to="/pha/giao-nhan-phan-phoi" replace />} />
                <Route path="/pha/4-3" element={<Navigate to="/pha/giao-nhan-phan-phoi" replace />} />
                <Route path="/pha/5.1" element={<Navigate to="/pha/tuyen-dung-lao-dong" replace />} />
                <Route path="/pha/5-1" element={<Navigate to="/pha/tuyen-dung-lao-dong" replace />} />
                <Route path="/pha/5.2" element={<Navigate to="/pha/doi-song-phuc-loi" replace />} />
                <Route path="/pha/5-2" element={<Navigate to="/pha/doi-song-phuc-loi" replace />} />
                <Route path="/pha/5.3" element={<Navigate to="/pha/dong-phuc-bao-ho" replace />} />
                <Route path="/pha/5-3" element={<Navigate to="/pha/dong-phuc-bao-ho" replace />} />
                <Route path="/pha/6.1" element={<Navigate to="/pha/mo-rong-cong-suat" replace />} />
                <Route path="/pha/6-1" element={<Navigate to="/pha/mo-rong-cong-suat" replace />} />
                <Route path="/pha/6.2" element={<Navigate to="/pha/chuan-hoa-danh-gia" replace />} />
                <Route path="/pha/6-2" element={<Navigate to="/pha/chuan-hoa-danh-gia" replace />} />
                <Route path="/pha/6.3" element={<Navigate to="/pha/chuyen-doi-tai-cau-truc" replace />} />
                <Route path="/pha/6-3" element={<Navigate to="/pha/chuyen-doi-tai-cau-truc" replace />} />
                <Route path="/pha/:id" element={<PhaseDetailPage />} />
                
                {/* Sourcing Matchmaking (Sàn Nhu Cầu) - Deduplicated to /san-nhu-cau */}
                <Route path="/san-nhu-cau" element={<DemandsPage />} />
                <Route path="/san-nhu-cau/:id" element={<DemandDetailPage />} />
                <Route path="/nhu-cau" element={<Navigate to="/san-nhu-cau" replace />} />
                <Route path="/nhu-cau/:id" element={<ParamRedirect toPrefix="/san-nhu-cau" />} />
                <Route path="/san-giao-dich-b2b" element={<Navigate to="/san-nhu-cau" replace />} />
                <Route path="/san-giao-dich-b2b/:id" element={<ParamRedirect toPrefix="/san-nhu-cau" />} />
                <Route path="/dau-thau-mua-sam" element={<Navigate to="/san-nhu-cau" replace />} />
                <Route path="/dau-thau-mua-sam/:id" element={<ParamRedirect toPrefix="/san-nhu-cau" />} />
                <Route path="/dang-nhu-cau" element={<PostDemandPage />} />

                {/* Sourcing Demand Workspace */}
                <Route path="/tai-khoan/nhu-cau/:id" element={<DemandWorkspacePage />} />
                <Route path="/tai-khoan/nhu-cau" element={<DemandWorkspacePage />} />
                <Route path="/workspace/nhu-cau/:id" element={<ParamRedirect toPrefix="/tai-khoan/nhu-cau" />} />

                {/* Nhà Cung Ứng & Sản Phẩm - Deduplicated to /nha-cung-ung */}
                <Route path="/nha-cung-ung" element={<EnterprisesPage />} />
                <Route path="/nha-cung-ung/:id" element={<EnterpriseDetailPage />} />
                <Route path="/doanh-nghiep" element={<Navigate to="/nha-cung-ung" replace />} />
                <Route path="/doanh-nghiep/:id" element={<ParamRedirect toPrefix="/nha-cung-ung" />} />
                <Route path="/nha-cung-cap-xac-thuc" element={<Navigate to="/nha-cung-ung" replace />} />
                <Route path="/nha-cung-cap-xac-thuc/:id" element={<ParamRedirect toPrefix="/nha-cung-ung" />} />
                <Route path="/danh-ba-nha-cung-cap-xac-thuc" element={<Navigate to="/nha-cung-ung" replace />} />
                <Route path="/danh-ba-nha-cung-cap-xac-thuc/:id" element={<ParamRedirect toPrefix="/nha-cung-ung" />} />
                <Route path="/san-pham-dich-vu" element={<EnterprisesPage />} />
                <Route path="/san-pham-dich-vu/:slug" element={<ProductServiceDetailPage />} />
                <Route path="/tao-ho-so" element={<CreateProfilePage />} />

                {/* Phân Loại Ngành Hàng & Từ Khóa */}
                <Route path="/nganh-nghe/:slug" element={<IndustryCategoryPage />} />
                <Route path="/nha-cung-ung/nganh/:slug" element={<ParamRedirect toPrefix="/nganh-nghe" />} />
                <Route path="/danh-muc/:slug" element={<ParamRedirect toPrefix="/nganh-nghe" />} />
                <Route path="/tu-khoa/:slug" element={<KeywordDetailPage />} />
                <Route path="/nha-cung-ung/tu-khoa/:slug" element={<ParamRedirect toPrefix="/tu-khoa" />} />
                <Route path="/tim-kiem/:slug" element={<ParamRedirect toPrefix="/tu-khoa" />} />
                
                {/* Nhà Máy Sản Xuất - Deduplicated to /nha-may */}
                <Route path="/nha-may" element={<FactoriesPage />} />
                <Route path="/nha-may/:id" element={<FactoryDetailPage />} />
                <Route path="/mang-luoi-nha-may-fdi" element={<Navigate to="/nha-may" replace />} />
                <Route path="/mang-luoi-nha-may-fdi/:id" element={<ParamRedirect toPrefix="/nha-may" />} />
                <Route path="/chu-dau-tu-kcn" element={<Navigate to="/nha-may" replace />} />
                <Route path="/chu-dau-tu-kcn/:id" element={<ParamRedirect toPrefix="/nha-may" />} />
                
                {/* Khu Công Nghiệp - Deduplicated to /khu-cong-nghiep */}
                <Route path="/khu-cong-nghiep" element={<IndustrialParksPage />} />
                <Route path="/khu-cong-nghiep/:id" element={<IndustrialParkDetailPage />} />
                <Route path="/ban-do-khu-cong-nghiep-viet-nam" element={<Navigate to="/khu-cong-nghiep" replace />} />
                <Route path="/ban-do-khu-cong-nghiep-viet-nam/:id" element={<ParamRedirect toPrefix="/khu-cong-nghiep" />} />
                <Route path="/industrial-zones-vietnam" element={<Navigate to="/khu-cong-nghiep" replace />} />
                <Route path="/industrial-zones-vietnam/:id" element={<ParamRedirect toPrefix="/khu-cong-nghiep" />} />
                <Route path="/ban-do-quy-hoach-kcn" element={<Navigate to="/khu-cong-nghiep" replace />} />
                <Route path="/quy-hoach-kcn" element={<Navigate to="/khu-cong-nghiep" replace />} />

                {/* Hiệp Hội Doanh Nghiệp - Deduplicated to /hiep-hoi */}
                <Route path="/hiep-hoi" element={<AssociationsPage />} />
                <Route path="/hiep-hoi/:id" element={<AssociationDetailPage />} />
                <Route path="/hoi-hiep-hoi" element={<Navigate to="/hiep-hoi" replace />} />
                <Route path="/hoi-hiep-hoi/:id" element={<ParamRedirect toPrefix="/hiep-hoi" />} />
                <Route path="/hoi-hiep-hoi-to-chuc" element={<Navigate to="/hiep-hoi" replace />} />
                <Route path="/hoi-hiep-hoi-to-chuc/:id" element={<ParamRedirect toPrefix="/hiep-hoi" />} />
                <Route path="/mang-luoi-hiep-hoi-bao-chung" element={<Navigate to="/hiep-hoi" replace />} />
                <Route path="/mang-luoi-hiep-hoi-bao-chung/:id" element={<ParamRedirect toPrefix="/hiep-hoi" />} />
                
                {/* Catalogue & Ấn Phẩm - Deduplicated to /catalogue */}
                <Route path="/catalogue" element={<CataloguesPage />} />
                <Route path="/catalogue/:slug" element={<CatalogueDetailPage />} />
                <Route path="/an-pham" element={<Navigate to="/catalogue" replace />} />
                <Route path="/an-pham/:slug" element={<ParamRedirect toPrefix="/catalogue" />} />
                <Route path="/e-catalogue" element={<Navigate to="/catalogue" replace />} />
                <Route path="/e-catalogue/:slug" element={<ParamRedirect toPrefix="/catalogue" />} />
                <Route path="/catalogues" element={<Navigate to="/catalogue" replace />} />
                <Route path="/catalogues/:slug" element={<ParamRedirect toPrefix="/catalogue" />} />

                {/* Trung Tâm Dịch Vụ - Deduplicated to /dich-vu */}
                <Route path="/dich-vu" element={<ServicesCenterPage />} />
                <Route path="/trung-tam-dich-vu" element={<Navigate to="/dich-vu" replace />} />
                <Route path="/yeu-cau-dich-vu" element={<ServiceRequestPage />} />
                <Route path="/dich-vu/yeu-cau" element={<Navigate to="/yeu-cau-dich-vu" replace />} />
                <Route path="/dich-vu/truyen-thong-doanh-nghiep" element={<MediaBrandingServicePage />} />
                <Route path="/dich-vu/ho-so-truyen-thong" element={<Navigate to="/dich-vu/truyen-thong-doanh-nghiep" replace />} />
                <Route path="/dich-vu/vat-pham-su-kien" element={<MerchandiseEventServicePage />} />
                <Route path="/dich-vu/vat-pham-doanh-nghiep" element={<Navigate to="/dich-vu/vat-pham-su-kien" replace />} />
                <Route path="/dich-vu/hien-dien-tu-xa" element={<RemotePresenceServicePage />} />
                <Route path="/hien-dien-tu-xa" element={<Navigate to="/dich-vu/hien-dien-tu-xa" replace />} />
                <Route path="/dich-vu/to-chuc-ket-noi" element={<MatchmakingServicePage />} />
                <Route path="/bo-ho-so/:slug" element={<SourcingDossierDetailPage />} />
                <Route path="/tai-khoan/yeu-cau-dich-vu" element={<UserRequestsWorkspacePage />} />
                <Route path="/tai-khoan/dich-vu" element={<Navigate to="/tai-khoan/yeu-cau-dich-vu" replace />} />
                <Route path="/theo-doi-yeu-cau" element={<Navigate to="/tai-khoan/yeu-cau-dich-vu" replace />} />

                {/* Chương Trình & Hội Nghị Giao Thương - Deduplicated to /chuong-trinh */}
                <Route path="/chuong-trinh" element={<SupplyChainExpoPage />} />
                <Route path="/chuong-trinh/:slug/dang-ky" element={<ProgramRegistrationPage />} />
                <Route path="/chuong-trinh/:slug/thu-vien" element={<ProgramLibraryPage />} />
                <Route path="/chuong-trinh/:slug" element={<ProgramDetailPage />} />
                <Route path="/tai-khoan/chuong-trinh" element={<UserProgramsWorkspacePage />} />
                <Route path="/theo-doi-chuong-trinh" element={<Navigate to="/tai-khoan/chuong-trinh" replace />} />
                <Route path="/tim-hieu-hinh-thuc-tham-gia" element={<SupplyChainExpoRegistrationPage />} />
                <Route path="/dang-ky-ngay-hoi" element={<SupplyChainExpoRegistrationPage />} />
                <Route path="/ngay-hoi-chuoi-cung-ung" element={<Navigate to="/chuong-trinh" replace />} />
                <Route path="/ngay-hoi-chuoi-cung-ung/dang-ky" element={<SupplyChainExpoRegistrationPage />} />
                <Route path="/ngay-hoi-chuoi-cung-ung/:eventId" element={<ParamRedirect toPrefix="/chuong-trinh" />} />
                <Route path="/ngay-hoi" element={<Navigate to="/chuong-trinh" replace />} />
                <Route path="/ngay-hoi/:eventId" element={<ParamRedirect toPrefix="/chuong-trinh" />} />
                <Route path="/hoi-cho-chuoi-cung-ung" element={<Navigate to="/chuong-trinh" replace />} />
                <Route path="/hoi-cho-chuoi-cung-ung/:eventId" element={<ParamRedirect toPrefix="/chuong-trinh" />} />
                <Route path="/expo" element={<Navigate to="/chuong-trinh" replace />} />
                <Route path="/expo/:eventId" element={<ParamRedirect toPrefix="/chuong-trinh" />} />
                <Route path="/trien-lam-chuoi-cung-ung" element={<Navigate to="/chuong-trinh" replace />} />

                {/* Hợp Tác, Tài Trợ & Referral - Deduplicated to /hop-tac & /tai-tro */}
                <Route path="/hop-tac" element={<PartnershipHubPage />} />
                <Route path="/partnership" element={<Navigate to="/hop-tac" replace />} />
                <Route path="/founding-partner" element={<FoundingPartnerPage />} />
                <Route path="/tai-tro" element={<SponsorshipPage />} />
                <Route path="/dong-hanh" element={<Navigate to="/tai-tro" replace />} />
                <Route path="/sponsorship" element={<Navigate to="/tai-tro" replace />} />
                <Route path="/doi-tac-phat-trien" element={<DevelopmentPartnerPage />} />
                <Route path="/doi-tac" element={<Navigate to="/doi-tac-phat-trien" replace />} />
                <Route path="/referral" element={<Navigate to="/doi-tac-phat-trien" replace />} />

                {/* Thị Trường, Tuyển Dụng & Công Cụ Bổ Trợ */}
                <Route path="/thi-truong" element={<MarketDashboardPage />} />
                <Route path="/dinh-vi-doanh-nghiep" element={<DiagnosticQuizPage />} />
                <Route path="/ban-do-viet-nam" element={<VietnamMapPage />} />
                <Route path="/ban-do-so" element={<Navigate to="/ban-do-viet-nam" replace />} />
                <Route path="/tuyen-dung" element={<RecruitmentPage />} />
                <Route path="/tuyen-dung/viec-tim-nguoi" element={<RecruitmentPage defaultTab="jobs" />} />
                <Route path="/tuyen-dung/nguoi-tim-viec" element={<RecruitmentPage defaultTab="candidates" />} />
                <Route path="/viec-tim-nguoi" element={<Navigate to="/tuyen-dung/viec-tim-nguoi" replace />} />
                <Route path="/nguoi-tim-viec" element={<Navigate to="/tuyen-dung/nguoi-tim-viec" replace />} />
                <Route path="/viec-lam" element={<Navigate to="/tuyen-dung/viec-tim-nguoi" replace />} />
                <Route path="/tuyen-dung-kcn" element={<Navigate to="/tuyen-dung" replace />} />
                <Route path="/tuyen-dung/than-so-hoc" element={<RecruitmentPage />} />
                <Route path="/than-so-hoc" element={<RecruitmentPage />} />

                {/* Tổng Quan Hệ Sinh Thái & Lọc Bỏ /manifesto */}
                <Route path="/he-sinh-thai" element={<EcosystemOverviewPage />} />
                <Route path="/tam-nhin-ha-tang-quoc-gia" element={<EcosystemOverviewPage />} />
                <Route path="/tam-nhin-chien-luoc-quoc-gia" element={<EcosystemOverviewPage />} />
                <Route path="/manifesto" element={<Navigate to="/he-sinh-thai" replace />} />
                
                {/* Trợ Lý AI & Định Danh Lãnh Đạo */}
                <Route path="/tro-ly-ai" element={<AiWorkspacePage />} />
                <Route path="/tro-ly-ai-legacy" element={<Navigate to="/tro-ly-ai" replace />} />
                <Route path="/suppi-search" element={<SuppiSearchPage />} />
                <Route path="/ai" element={<Navigate to="/tro-ly-ai" replace />} />
                <Route path="/todzung" element={<ToDzungPortfolioPage />} />
                <Route path="/to-ngoc-dung" element={<Navigate to="/todzung" replace />} />
                <Route path="/ong-to-ngoc-dung" element={<Navigate to="/todzung" replace />} />
                <Route path="/giam-doc" element={<Navigate to="/todzung" replace />} />
                <Route path="/tonydong" element={<TonyDongPortfolioPage />} />
                <Route path="/tony-dong" element={<Navigate to="/tonydong" replace />} />
                <Route path="/jennytrinh" element={<JennyTrinhPortfolioPage />} />
                <Route path="/mstrinh" element={<Navigate to="/jennytrinh" replace />} />
                <Route path="/chi-trinh" element={<Navigate to="/jennytrinh" replace />} />
                <Route path="/ms-trinh" element={<Navigate to="/jennytrinh" replace />} />
                <Route path="/jenny-trinh" element={<Navigate to="/jennytrinh" replace />} />
                <Route path="/nguyen-thi-ha-trinh" element={<Navigate to="/jennytrinh" replace />} />
                
                {/* Pháp Lý & Bảo Mật B2B */}
                <Route path="/phap-ly/thoa-thuan-dich-vu-b2b" element={<B2bTermsOfServicePage />} />
                <Route path="/thoa-thuan-dich-vu-b2b" element={<Navigate to="/phap-ly/thoa-thuan-dich-vu-b2b" replace />} />
                <Route path="/dieu-khoan-su-dung" element={<Navigate to="/phap-ly/thoa-thuan-dich-vu-b2b" replace />} />
                <Route path="/dieu-khoan" element={<Navigate to="/phap-ly/thoa-thuan-dich-vu-b2b" replace />} />
                <Route path="/terms" element={<Navigate to="/phap-ly/thoa-thuan-dich-vu-b2b" replace />} />
                <Route path="/phap-ly/chinh-sach-bao-mat-du-lieu" element={<B2bPrivacyPolicyPage />} />
                <Route path="/chinh-sach-bao-mat-du-lieu" element={<Navigate to="/phap-ly/chinh-sach-bao-mat-du-lieu" replace />} />
                <Route path="/chinh-sach-bao-mat" element={<Navigate to="/phap-ly/chinh-sach-bao-mat-du-lieu" replace />} />
                <Route path="/privacy" element={<Navigate to="/phap-ly/chinh-sach-bao-mat-du-lieu" replace />} />
                
                {/* Đăng Nhập & Đăng Ký */}
                <Route path="/dang-nhap" element={<AuthPage />} />
                <Route path="/dang-ky" element={<AuthPage />} />
                <Route path="/login" element={<Navigate to="/dang-nhap" replace />} />
                <Route path="/register" element={<Navigate to="/dang-ky" replace />} />
                
                {/* Admin Portal & Category / Keyword / Stage Management Routes (Sections 8, 14 & 10) */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/danh-muc" element={<AdminDashboardPage defaultMenu="categories" />} />
                <Route path="/admin/danh-muc/:id" element={<AdminDashboardPage defaultMenu="categories" />} />
                <Route path="/admin/tu-khoa" element={<AdminDashboardPage defaultMenu="keywords" />} />
                <Route path="/admin/tu-khoa/:id" element={<AdminDashboardPage defaultMenu="keywords" />} />
                <Route path="/admin/giai-doan" element={<AdminDashboardPage defaultMenu="stages" />} />
                <Route path="/admin/giai-doan/:id" element={<AdminDashboardPage defaultMenu="stages" />} />
                <Route path="/admin/nhu-cau" element={<AdminDashboardPage defaultMenu="demands" />} />
                <Route path="/admin/nhu-cau/:id" element={<AdminDashboardPage defaultMenu="demands" />} />
                <Route path="/admin/dich-vu" element={<AdminDashboardPage defaultMenu="services" />} />
                <Route path="/admin/dich-vu/:id" element={<AdminDashboardPage defaultMenu="services" />} />
                <Route path="/admin/yeu-cau-dich-vu" element={<AdminDashboardPage defaultMenu="services" />} />
                <Route path="/admin/yeu-cau-dich-vu/:id" element={<AdminDashboardPage defaultMenu="services" />} />
                <Route path="/admin/yeu-cau-quan-ly-ho-so" element={<AdminDashboardPage defaultMenu="claims" />} />
                <Route path="/admin/to-chuc" element={<AdminDashboardPage defaultMenu="enterprises" />} />
                <Route path="/admin/to-chuc/:id" element={<AdminDashboardPage defaultMenu="enterprises" />} />
                <Route path="/admin/founding-partner" element={<AdminDashboardPage defaultMenu="partners" />} />
                <Route path="/admin/founding-partner/:id" element={<AdminDashboardPage defaultMenu="partners" />} />
                <Route path="/admin/doi-tac-sang-lap" element={<AdminDashboardPage defaultMenu="partners" />} />
                <Route path="/admin/doi-tac-sang-lap/:id" element={<AdminDashboardPage defaultMenu="partners" />} />
                <Route path="/admin/pipeline" element={<AdminDashboardPage defaultMenu="pipeline" />} />
                <Route path="/admin/connections" element={<AdminDashboardPage defaultMenu="connections" />} />
                <Route path="/admin/matching" element={<AdminDashboardPage defaultMenu="connections" />} />
                <Route path="/admin/chuong-trinh" element={<AdminDashboardPage defaultMenu="programs" />} />
                <Route path="/admin/khu-cong-nghiep" element={<AdminDashboardPage defaultMenu="industrial_parks" />} />
                <Route path="/admin/khu-cong-nghiep/:id" element={<AdminDashboardPage defaultMenu="industrial_parks" />} />
                <Route path="/admin/nha-may" element={<AdminDashboardPage defaultMenu="factories" />} />
                <Route path="/admin/nha-may/:id" element={<AdminDashboardPage defaultMenu="factories" />} />
                <Route path="/admin/catalogue" element={<AdminDashboardPage defaultMenu="catalogues" />} />
                <Route path="/admin/catalogue/:id" element={<AdminDashboardPage defaultMenu="catalogues" />} />
                <Route path="/admin/an-pham" element={<AdminDashboardPage defaultMenu="catalogues" />} />
                <Route path="/admin/tai-tro" element={<AdminDashboardPage defaultMenu="sponsorships" />} />
                <Route path="/admin/tai-tro/:id" element={<AdminDashboardPage defaultMenu="sponsorships" />} />
                <Route path="/admin/doi-tac-phat-trien" element={<AdminDashboardPage defaultMenu="development_partners" />} />
                <Route path="/admin/doi-tac-phat-trien/:id" element={<AdminDashboardPage defaultMenu="development_partners" />} />
                <Route path="/admin/hop-tac" element={<AdminDashboardPage defaultMenu="partnership_hub" />} />
                <Route path="/admin/hop-tac/:id" element={<AdminDashboardPage defaultMenu="partnership_hub" />} />
                <Route path="/admin/hien-dien-tu-xa" element={<AdminDashboardPage defaultMenu="remote_presence" />} />
                <Route path="/admin/hien-dien-tu-xa/:id" element={<AdminDashboardPage defaultMenu="remote_presence" />} />
                <Route path="/admin/bo-ho-so" element={<AdminDashboardPage defaultMenu="sourcing_dossiers" />} />
                <Route path="/admin/bo-ho-so/:id" element={<AdminDashboardPage defaultMenu="sourcing_dossiers" />} />
                <Route path="/admin/tasks" element={<AdminDashboardPage defaultMenu="tasks" />} />
                <Route path="/admin/tai-chinh" element={<AdminDashboardPage defaultMenu="tai-chinh" />} />
                <Route path="/admin/logs" element={<AdminDashboardPage defaultMenu="logs" />} />
                
                {/* Catch-all */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Suspense>
          </MainLayout>
      </BrowserRouter>
    </LanguageProvider>
  </ErrorBoundary>
  );
}
