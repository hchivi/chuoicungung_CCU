import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Building2, ChevronRight, ArrowRight, RotateCcw, 
  ShieldCheck, Tag, Phone, Globe, ArrowUp, ChevronDown, Key, Sparkles,
  ChevronLeft, ArrowLeft, Wrench, Factory, Cpu, Truck, Users, Leaf
} from 'lucide-react';
import enterprisesFullList from '../data/enterprisesFull.json';
import { useLanguage } from '../contexts/LanguageContext';
import { getEnterpriseBaseVotes } from './EnterprisesPage';
import { slugify } from './IndustryCategoryPage';
import { 
  getCompanyMonogram, 
  getMonogramGradient, 
  isValidCustomLogo, 
  getCategoryBannerImage,
  getEnterpriseAvatarImage,
  detectPhaseAndStage
} from '../utils/companyUtils';
import SupplierTopNavigationBlocks from '../components/SupplierTopNavigationBlocks';

const PROVINCES = [
  "Toàn quốc", "Bình Dương", "Đồng Nai", "TP. Hồ Chí Minh", "Hà Nội", "Bắc Ninh", 
  "Hải Phòng", "Long An", "Đà Nẵng", "Bà Rịa - Vũng Tàu", "Hưng Yên", "Hải Dương", 
  "Vĩnh Phúc", "Bắc Giang", "Quảng Nam", "Quảng Ngãi", "Khánh Hòa", "Cần Thơ", "Thái Nguyên"
];

export default function KeywordDetailPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const keywordLabel = useMemo(() => {
    const fromParam = searchParams.get('q') || searchParams.get('label') || searchParams.get('name');
    if (fromParam) return fromParam;
    return (slug || '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }, [slug, searchParams]);

  const [selectedProvince, setSelectedProvince] = useState('Toàn quốc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  // Local voting state
  const [votes, setVotes] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_supplier_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [userVoteActions, setUserVoteActions] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_user_vote_actions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleVote = (ent, delta) => {
    const key = String(ent.id || ent._id || ent.name);
    const currentAction = userVoteActions[key] || 0;
    let newDelta = delta;
    let newAction = delta;

    if (currentAction === delta) {
      newDelta = -delta;
      newAction = 0;
    } else if (currentAction !== 0) {
      newDelta = delta * 2;
      newAction = delta;
    }

    setVotes(prev => {
      const updated = { ...prev, [key]: (prev[key] || 0) + newDelta };
      try { localStorage.setItem('ccu_supplier_votes', JSON.stringify(updated)); } catch {}
      return updated;
    });

    setUserVoteActions(prev => {
      const updated = { ...prev, [key]: newAction };
      try { localStorage.setItem('ccu_user_vote_actions', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // Filter matching suppliers by keyword query tokens
  const matchingEnterprises = useMemo(() => {
    const qClean = keywordLabel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').trim();
    const queryTokens = qClean.split(/\s+/).filter(Boolean);

    let list = enterprisesFullList.filter(e => {
      const tokens = e._searchTokens || (
        `${e.name || ''} ${e.category || ''} ${e.industry || ''} ${e.province || ''} ${Array.isArray(e.products) ? e.products.join(' ') : ''}`
      ).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

      return queryTokens.every(tok => tokens.includes(tok));
    });

    // If exact multi-token matched 0, match any token
    if (list.length === 0 && queryTokens.length > 1) {
      list = enterprisesFullList.filter(e => {
        const tokens = (
          `${e.name || ''} ${e.category || ''} ${e.industry || ''} ${e.province || ''}`
        ).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
        return queryTokens.some(tok => tokens.includes(tok));
      });
    }

    if (selectedProvince !== 'Toàn quốc') {
      list = list.filter(e => e.province && (e.province === selectedProvince || e.province.includes(selectedProvince)));
    }

    list.sort((a, b) => {
      const keyA = String(a.id || a._id || a.name);
      const keyB = String(b.id || b._id || b.name);
      const totalA = getEnterpriseBaseVotes(a) + (votes[keyA] || 0);
      const totalB = getEnterpriseBaseVotes(b) + (votes[keyB] || 0);
      return totalB - totalA;
    });

    return list;
  }, [keywordLabel, selectedProvince, votes]);

  const totalCount = matchingEnterprises.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const displayedEnterprises = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return matchingEnterprises.slice(start, start + pageSize);
  }, [matchingEnterprises, currentPage]);

  return (
    <div className="min-h-screen bg-[#FBFBFC] pb-24 font-sans text-slate-900 antialiased space-y-8">
      
      {/* Top Main Layout Container: TOP TO BOTTOM EXACT ORDER AS REQUESTED */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* =========================================================================
            VỊ TRÍ 1: BLOCK ĐƯỢC CHỌN LÊN TRÊN CÙNG (PANORAMIC B2B SPOTLIGHT BANNER)
           ========================================================================= */}
        <div className="relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:p-10 space-y-5">
          
          {/* Right Half Relevant Keyword Photo with Smooth Left-to-Right Fade */}
          <div className="absolute top-0 right-0 w-full sm:w-[65%] md:w-[60%] lg:w-[55%] h-full pointer-events-none overflow-hidden z-0 select-none">
            <img 
              src={getCategoryBannerImage(keywordLabel)} 
              alt={keywordLabel}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.src = "/images/supplier_b2b_hero.jpg";
              }}
            />
            {/* Left-to-right white gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/80 via-40% to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/30 pointer-events-none" />
          </div>

          {/* Foreground Content (z-10) */}
          <div className="relative z-10 max-w-2xl space-y-4">
            
            {/* Breadcrumbs & Quick Return */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                <Link to="/" className="hover:text-[#0052cc] transition">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <Link to="/nha-cung-ung" className="hover:text-[#0052cc] transition">{lang === 'en' ? 'Suppliers Directory' : 'Nhà Cung Ứng & Phụ Trợ'}</Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[#0052cc] font-bold truncate max-w-[200px] sm:max-w-xs">{keywordLabel}</span>
              </nav>

              <Link
                to="/nha-cung-ung"
                className="text-xs font-bold text-slate-600 hover:text-[#0052cc] flex items-center space-x-1.5 transition bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-slate-200/80"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>Về Danh bạ Tổng hợp</span>
              </Link>
            </div>

            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-50/95 border border-amber-200/80 text-amber-800 text-[11px] font-bold font-heading tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>TỪ KHÓA TÌM KIẾM ĐANG CHỌN (ACTIVE)</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-slate-950 leading-[1.15]">
                "{keywordLabel}"
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading tracking-tight bg-gradient-to-r from-amber-600 via-orange-600 to-[#0052cc] bg-clip-text text-transparent leading-tight">
                Danh Bạ Sản Phẩm & Phụ Trợ Chuyên Ngành
              </h2>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              {lang === 'en'
                ? `Search results for manufacturing suppliers, equipment providers, and raw materials matching keyword "${keywordLabel}".`
                : `Danh sách các cơ sở sản xuất, chế tạo phụ trợ, đại lý cung cấp thiết bị và nguyên vật liệu liên quan tới từ khóa "${keywordLabel}".`}
            </p>

            {/* Quick Action Pills & Stats */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="px-4 py-2 bg-slate-100/90 text-slate-800 text-xs font-bold rounded-xl border border-slate-200/80 flex items-center space-x-2 shadow-2xs">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>{totalCount.toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN')} Nhà cung ứng phù hợp</span>
              </div>

              <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200/80 flex items-center space-x-2 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% {lang === 'en' ? 'Profile Verified' : 'Xác thực hồ sơ'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            VỊ TRÍ 2: BLOCK NHÀ CUNG CẤP NỔI BẬT (IMAGE 2: FOUNDING PARTNER)
            VỊ TRÍ 3: BLOCK 18 PHA / 6 GIAI ĐOẠN (IMAGE 3: ACTIVE PHASE & STAGE)
            VỊ TRÍ 4: BLOCK MỤC LỤC A-Z (IMAGE 4: ACTIVE KEYWORD TAG)
           ========================================================================= */}
        <SupplierTopNavigationBlocks
          selectedKeyword={keywordLabel}
          layoutOrder="active-first"
        />

        {/* =========================================================================
            VỊ TRÍ 5: PHẦN CÒN LẠI Ở PHÍA DƯỚI GIỮ NGUYÊN (TỈNH THÀNH & DANH SÁCH)
           ========================================================================= */}
        {/* Province Filter */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs font-bold text-slate-700 font-heading">Lọc theo Tỉnh / Thành phố:</span>
            <div className="w-full sm:w-72">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer font-sans"
              >
                {PROVINCES.map(p => (
                  <option key={p} value={p}>{p === "Toàn quốc" ? "📍 Toàn quốc (34 Tỉnh thành)" : `📍 ${p}`}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {displayedEnterprises.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Không tìm thấy kết quả phù hợp cho "{keywordLabel}"
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Vui lòng chọn lại khu vực "Toàn quốc" hoặc quay lại danh bạ chính để tìm kiếm.
            </p>
            <Link
              to="/nha-cung-ung"
              className="inline-block px-5 py-2 bg-[#0052cc] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Xem toàn bộ nhà cung ứng
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {displayedEnterprises.map((ent) => {
              const entId = ent.id || ent._id || ent.taxCode || ent.name;
              const totalVotes = getEnterpriseBaseVotes(ent) + (votes[String(entId)] || 0);
              const userAction = userVoteActions[String(entId)] || 0;
              const detailUrl = `/doanh-nghiep/${ent.id || ent._id}`;

              return (
                <div
                  key={entId}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-[#0052cc]/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      {/* Logo / Avatar Image Container */}
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-0.5 shrink-0 overflow-hidden shadow-2xs flex items-center justify-center group-hover:border-[#0052cc]/50 transition-colors relative">
                        <img 
                          src={getEnterpriseAvatarImage(ent)} 
                          alt={ent.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            const fallbackUrl = getCategoryBannerImage(ent.category || ent.industry || ent.name);
                            if (e.target.src !== fallbackUrl) {
                              e.target.src = fallbackUrl;
                            }
                          }}
                        />
                      </div>

                      {/* Name & Dual Vote */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 bg-blue-50 text-[#0052cc] text-[10px] font-bold rounded-md font-mono shrink-0">
                            📍 {ent.province || 'Toàn quốc'}
                          </span>

                          {/* Dual Vote Buttons */}
                          <div className="flex items-center rounded-lg border border-slate-200/90 bg-slate-50/80 p-0.5 shadow-2xs shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(ent, 1);
                              }}
                              className={`p-1 rounded-md transition-all cursor-pointer ${
                                userAction === 1
                                  ? 'bg-emerald-600 text-white shadow-2xs scale-105'
                                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={userAction === 1 ? "Bỏ bình chọn (+1)" : "Bình chọn uy tín (+1)"}
                            >
                              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                            </button>

                            <span className={`px-1.5 text-[11px] font-mono font-bold select-none min-w-[20px] text-center ${
                              userAction === 1 
                                ? 'text-emerald-700 font-black' 
                                : userAction === -1 
                                ? 'text-rose-600 font-black' 
                                : 'text-slate-700'
                            }`}>
                              {totalVotes}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(ent, -1);
                              }}
                              className={`p-1 rounded-md transition-all cursor-pointer ${
                                userAction === -1
                                  ? 'bg-rose-600 text-white shadow-2xs scale-105'
                                  : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              }`}
                              title={userAction === -1 ? "Bỏ đánh giá (-1)" : "Đánh giá thấp (-1)"}
                            >
                              <ChevronDown className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>

                        <Link
                          to={detailUrl}
                          className="font-black text-xs sm:text-[13px] text-slate-950 group-hover:text-[#0052cc] transition line-clamp-2 font-heading leading-tight"
                          title={ent.name}
                        >
                          {ent.name}
                        </Link>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-800">
                        <Tag className="w-3 h-3 text-[#0052cc] shrink-0" />
                        <span className="truncate">{ent.category || ent.industry || "Nhà cung ứng công nghiệp"}</span>
                      </div>
                      {ent.address && (
                        <div className="flex items-start space-x-1.5 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{ent.address}</span>
                        </div>
                      )}
                    </div>

                    {Array.isArray(ent.products) && ent.products.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {ent.products.slice(0, 3).map((prod, pIdx) => (
                          <span 
                            key={pIdx} 
                            className="px-2 py-0.5 bg-slate-100/90 text-slate-600 text-[10px] rounded font-medium truncate max-w-[140px]"
                          >
                            {prod}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono italic">
                      {ent.isVerified ? "✓ Verified B2B" : "Đang cập nhật"}
                    </span>
                    <Link
                      to={detailUrl}
                      className="px-3.5 py-1.5 bg-[#0052cc] hover:bg-[#0041a8] text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center space-x-1 group/btn"
                    >
                      <span>{lang === 'en' ? 'Details' : 'Chi tiết'}</span>
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
