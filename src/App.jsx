import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import { LanguageProvider } from './contexts/LanguageContext';

// Lazy-loaded Pages for instant initial load and code-splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const SixStagesMapPage = lazy(() => import('./pages/SixStagesMapPage'));
const StageDetailPage = lazy(() => import('./pages/StageDetailPage'));
const PhaseDetailPage = lazy(() => import('./pages/PhaseDetailPage'));
const EnterprisesPage = lazy(() => import('./pages/EnterprisesPage'));
const EnterpriseDetailPage = lazy(() => import('./pages/EnterpriseDetailPage'));
const IndustrialParksPage = lazy(() => import('./pages/IndustrialParksPage'));
const IndustrialParkDetailPage = lazy(() => import('./pages/IndustrialParkDetailPage'));
const FactoriesPage = lazy(() => import('./pages/FactoriesPage'));
const FactoryDetailPage = lazy(() => import('./pages/FactoryDetailPage'));
const AssociationsPage = lazy(() => import('./pages/AssociationsPage'));
const AssociationDetailPage = lazy(() => import('./pages/AssociationDetailPage'));
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

// Elegant loading placeholder during route transition
function PageLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase font-mono">Đang tải dữ liệu...</p>
      </div>
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

function MainLayout({ children, onOpenSearch }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar onOpenSearch={onOpenSearch} />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdmin && <Footer />}
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
                <Route path="/giai-doan/:id" element={<StageDetailPage />} />
                <Route path="/pha/:id" element={<PhaseDetailPage />} />
                
                <Route path="/doanh-nghiep" element={<EnterprisesPage />} />
                <Route path="/doanh-nghiep/:id" element={<EnterpriseDetailPage />} />
                <Route path="/nha-cung-ung" element={<EnterprisesPage />} />
                <Route path="/nha-cung-ung/:id" element={<EnterpriseDetailPage />} />
                <Route path="/nganh-nghe/:slug" element={<IndustryCategoryPage />} />
                <Route path="/nha-cung-ung/nganh/:slug" element={<IndustryCategoryPage />} />
                <Route path="/danh-muc/:slug" element={<IndustryCategoryPage />} />
                <Route path="/tu-khoa/:slug" element={<KeywordDetailPage />} />
                <Route path="/nha-cung-ung/tu-khoa/:slug" element={<KeywordDetailPage />} />
                <Route path="/tim-kiem/:slug" element={<KeywordDetailPage />} />
                
                <Route path="/khu-cong-nghiep" element={<IndustrialParksPage />} />
                <Route path="/khu-cong-nghiep/:id" element={<IndustrialParkDetailPage />} />
                
                <Route path="/nha-may" element={<FactoriesPage />} />
                <Route path="/nha-may/:id" element={<FactoryDetailPage />} />
                
                <Route path="/hoi-hiep-hoi" element={<AssociationsPage />} />
                <Route path="/hoi-hiep-hoi/:id" element={<AssociationDetailPage />} />
                <Route path="/hoi-hiep-hoi-to-chuc" element={<AssociationsPage />} />
                <Route path="/hoi-hiep-hoi-to-chuc/:id" element={<AssociationDetailPage />} />
                <Route path="/hiep-hoi" element={<AssociationsPage />} />
                <Route path="/hiep-hoi/:id" element={<AssociationDetailPage />} />
                
                <Route path="/san-nhu-cau" element={<DemandsPage />} />
                <Route path="/san-nhu-cau/:id" element={<DemandDetailPage />} />
                <Route path="/nhu-cau" element={<DemandsPage />} />
                <Route path="/nhu-cau/:id" element={<DemandDetailPage />} />
                <Route path="/dang-nhu-cau" element={<PostDemandPage />} />
                
                <Route path="/tuyen-dung" element={<RecruitmentPage />} />
                <Route path="/tuyen-dung/viec-tim-nguoi" element={<RecruitmentPage defaultTab="jobs" />} />
                <Route path="/tuyen-dung/nguoi-tim-viec" element={<RecruitmentPage defaultTab="candidates" />} />
                <Route path="/tuyen-dung/than-so-hoc" element={<RecruitmentPage />} />
                <Route path="/than-so-hoc" element={<RecruitmentPage />} />
                <Route path="/viec-tim-nguoi" element={<RecruitmentPage defaultTab="jobs" />} />
                <Route path="/nguoi-tim-viec" element={<RecruitmentPage defaultTab="candidates" />} />
                <Route path="/viec-lam" element={<RecruitmentPage defaultTab="jobs" />} />
                <Route path="/tuyen-dung-kcn" element={<RecruitmentPage />} />
                
                <Route path="/dinh-vi-doanh-nghiep" element={<DiagnosticQuizPage />} />
                <Route path="/ban-do-viet-nam" element={<VietnamMapPage />} />
                <Route path="/ban-do-so" element={<VietnamMapPage />} />
                <Route path="/thi-truong" element={<MarketDashboardPage />} />
                
                <Route path="/founding-partner" element={<FoundingPartnerPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/he-sinh-thai" element={<EcosystemOverviewPage />} />
                
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
