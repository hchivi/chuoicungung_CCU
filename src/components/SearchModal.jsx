import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Building2, Factory, MapPin, Layers, ArrowRight, ShoppingBag } from 'lucide-react';
import { stagesData, enterprisesData, industrialParksData, factoriesData, demandsMarketplaceData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function SearchModal({ isOpen, onClose }) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredStages = stagesData.flatMap(s => s.phases).filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    p.summary.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEnterprises = enterprisesData.filter(e => 
    e.name.toLowerCase().includes(query.toLowerCase()) || 
    e.industry.toLowerCase().includes(query.toLowerCase())
  );

  const filteredKCN = industrialParksData.filter(k => 
    k.name.toLowerCase().includes(query.toLowerCase()) || 
    k.location.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFactories = factoriesData.filter(f => 
    f.name.toLowerCase().includes(query.toLowerCase()) || 
    f.industry.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDemands = demandsMarketplaceData.filter(d => 
    d.title.toLowerCase().includes(query.toLowerCase()) || 
    d.company.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'en' ? "Search stages, phases, IPs, enterprises, factories, sourcing demands..." : "Tìm kiếm giai đoạn, pha, KCN, doanh nghiệp, nhà máy, nhu cầu..."}
            className="w-full bg-transparent border-none text-slate-800 text-sm focus:outline-none focus:ring-0 placeholder:text-slate-400 font-medium"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          
          {query.trim() === '' ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p>{lang === 'en' ? 'Enter keywords to search across 18 phases, 480+ IPs, 14,000+ factories & suppliers...' : 'Nhập từ khóa để tìm kiếm trong toàn bộ 18 pha, 400+ KCN, 1.000+ doanh nghiệp...'}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <span onClick={() => setQuery(lang === 'en' ? "Legal" : "Pháp lý")} className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-full cursor-pointer text-[11px] font-medium">{lang === 'en' ? "Legal & Permits" : "Pháp lý & Thủ tục"}</span>
                <span onClick={() => setQuery("VSIP")} className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-full cursor-pointer text-[11px] font-medium">VSIP Bac Ninh</span>
                <span onClick={() => setQuery("Samsung")} className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-full cursor-pointer text-[11px] font-medium">Samsung</span>
                <span onClick={() => setQuery(lang === 'en' ? "Packaging" : "Bao bì")} className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-full cursor-pointer text-[11px] font-medium">{lang === 'en' ? "Industrial Packaging" : "Bao bì carton"}</span>
              </div>
            </div>
          ) : (
            <>
              {/* Phases Matches */}
              {filteredStages.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-heading">{lang === 'en' ? 'Phases & Stages' : 'Pha & Giai đoạn'}</h4>
                  <div className="space-y-1">
                    {filteredStages.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelect(`/pha/${p.id}`)}
                        className="flex items-center justify-between p-2 hover:bg-sky-50 rounded-lg cursor-pointer text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sky-600 font-mono">{lang === 'en' ? `Phase ${p.id}` : `Pha ${p.id}`}</span>
                          <span className="font-semibold text-slate-800">{p.title}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* KCN Matches */}
              {filteredKCN.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-heading">{lang === 'en' ? 'Industrial Parks' : 'Khu công nghiệp'}</h4>
                  <div className="space-y-1">
                    {filteredKCN.map(k => (
                      <div
                        key={k.id}
                        onClick={() => handleSelect(`/khu-cong-nghiep/${k.id}`)}
                        className="flex items-center justify-between p-2 hover:bg-emerald-50 rounded-lg cursor-pointer text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-slate-800">{k.name}</span>
                          <span className="text-slate-400 text-[11px]">({k.location})</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enterprise Matches */}
              {filteredEnterprises.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-heading">{lang === 'en' ? 'Suppliers & Enterprises' : 'Doanh nghiệp Cung ứng'}</h4>
                  <div className="space-y-1">
                    {filteredEnterprises.map(e => (
                      <div
                        key={e.id}
                        onClick={() => handleSelect(`/doanh-nghiep/${e.id}`)}
                        className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg cursor-pointer text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-slate-800">{e.name}</span>
                          <span className="text-slate-400 text-[11px]">({e.industry})</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Factories Matches */}
              {filteredFactories.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-heading">{lang === 'en' ? 'Manufacturing Factories' : 'Nhà máy Sản xuất'}</h4>
                  <div className="space-y-1">
                    {filteredFactories.map(f => (
                      <div
                        key={f.id}
                        onClick={() => handleSelect(`/nha-may/${f.id}`)}
                        className="flex items-center justify-between p-2 hover:bg-amber-50 rounded-lg cursor-pointer text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <Factory className="w-4 h-4 text-amber-600" />
                          <span className="font-semibold text-slate-800">{f.name}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Demands Matches */}
              {filteredDemands.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-heading">{lang === 'en' ? 'Open Sourcing Demands' : 'Nhu cầu mở'}</h4>
                  <div className="space-y-1">
                    {filteredDemands.map(d => (
                      <div
                        key={d.id}
                        onClick={() => handleSelect(`/nhu-cau`)}
                        className="flex items-center justify-between p-2 hover:bg-purple-50 rounded-lg cursor-pointer text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <ShoppingBag className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-slate-800">{d.title}</span>
                          <span className="text-slate-400 text-[11px]">({d.company})</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredStages.length === 0 && filteredEnterprises.length === 0 && filteredKCN.length === 0 && filteredFactories.length === 0 && filteredDemands.length === 0 && (
                <div className="py-6 text-center text-slate-400 text-xs">
                  {lang === 'en' ? `No results found matching "${query}".` : `Không tìm thấy kết quả phù hợp với "${query}".`}
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <span>{lang === 'en' ? 'Press ESC to close' : 'Nhấn ESC để đóng'}</span>
          <span className="font-bold text-blue-600 font-heading">ChuoiCungUng.vn Search Engine</span>
        </div>
      </div>
    </div>
  );
}
