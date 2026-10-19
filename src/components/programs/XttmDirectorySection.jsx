import React, { useState, useMemo } from 'react';
import {
  BookOpen, Building2, UserCheck, Phone, Mail, Globe,
  Handshake, ExternalLink, Search, Filter, CheckCircle2,
  Users, Layers, ArrowRight, ShieldCheck, Sparkles, MapPin
} from 'lucide-react';
import {
  XTTM_GROUPS_META,
  XTTM_DIRECTORY_ITEMS,
  XTTM_STATS
} from '../../data/xttmDirectoryData';
import XttmConnectModal from './XttmConnectModal';

export default function XttmDirectorySection({ programTitle = '' }) {
  const [activeGroup, setActiveGroup] = useState('all'); // 'all', 'group-a', 'group-b', 'group-c', 'group-d'
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('all');
  
  // Modal state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedCompanyForConnect, setSelectedCompanyForConnect] = useState(null);

  // Filtered list
  const filteredItems = useMemo(() => {
    return XTTM_DIRECTORY_ITEMS.filter((item) => {
      // Group filter
      if (activeGroup !== 'all' && item.groupId !== activeGroup) {
        return false;
      }
      // Org filter
      if (selectedOrg !== 'all' && !item.org.toLowerCase().includes(selectedOrg.toLowerCase())) {
        return false;
      }
      // Search keyword
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchCompany = item.company.toLowerCase().includes(kw);
        const matchField = item.field.toLowerCase().includes(kw);
        const matchAttendee = item.attendee.toLowerCase().includes(kw);
        const matchBadge = item.badge.toLowerCase().includes(kw);
        const matchVsic = item.vsicDesc.toLowerCase().includes(kw);
        if (!matchCompany && !matchField && !matchAttendee && !matchBadge && !matchVsic) {
          return false;
        }
      }
      return true;
    });
  }, [activeGroup, selectedOrg, searchKeyword]);

  const handleOpenConnect = (company = null) => {
    setSelectedCompanyForConnect(company);
    setIsConnectModalOpen(true);
  };

  const getGroupBadgeClass = (groupId) => {
    switch (groupId) {
      case 'group-a':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'group-b':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'group-c':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'group-d':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const getOrgBadgeClass = (org) => {
    if (org.includes('THIP')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (org.includes('TeamKCN')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (org.includes('GEM')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <section id="danh-ba-xttm" className="space-y-6 scroll-mt-24">
      {/* Section Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#004d2e] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Xúc Tiến Thương Mại (XTTM) 2026</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-mono font-bold">
                Mã VSIC 2026
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white leading-tight">
              Danh Bạ Xúc Tiến Thương Mại & Đại Diện Kết Nối Kinh Doanh
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Thông tin chi tiết <strong>42 Doanh nghiệp</strong> và đại diện kết nối phân theo 4 Nhóm Mục tiêu kinh doanh (Cross-Tenant Sourcing, Mua chung, Dịch vụ kỹ thuật, Vận hành dùng chung) tại sự kiện.
            </p>
          </div>

          {/* Action Buttons on Header */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenConnect(null)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#006039] hover:from-emerald-400 hover:to-[#004d2e] text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Handshake className="w-4 h-4" />
              <span>Kết Nối Với Danh Bạ</span>
            </button>

            <a
              href="https://docs.google.com/spreadsheets/d/1TwLGGOaPU2Yq7nKzDKyeq3Pm5GKX-Upw/edit?gid=370501853#gid=370501853"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 backdrop-blur-xs"
            >
              <ExternalLink className="w-4 h-4 text-emerald-300" />
              <span>Google Sheets Gốc</span>
            </a>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-400">42</div>
            <div className="text-[11px] text-slate-300 font-medium">Doanh nghiệp thành viên</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl sm:text-3xl font-heading font-black text-sky-400">4</div>
            <div className="text-[11px] text-slate-300 font-medium">Nhóm mục tiêu XTTM</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl sm:text-3xl font-heading font-black text-amber-400">100%</div>
            <div className="text-[11px] text-slate-300 font-medium">Đại diện & Hotline xác thực</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl sm:text-3xl font-heading font-black text-purple-400">1:1</div>
            <div className="text-[11px] text-slate-300 font-medium">Khung giờ bàn họp B2B</div>
          </div>
        </div>
      </div>

      {/* Group Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-2 sm:p-3 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <button
            onClick={() => setActiveGroup('all')}
            className={`px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeGroup === 'all'
                ? 'bg-[#006039] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Tất cả</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeGroup === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {XTTM_DIRECTORY_ITEMS.length}
            </span>
          </button>

          {Object.entries(XTTM_GROUPS_META).map(([key, meta]) => {
            const count = XTTM_DIRECTORY_ITEMS.filter((i) => i.groupId === meta.id).length;
            const isCurrent = activeGroup === meta.id;
            return (
              <button
                key={meta.id}
                onClick={() => setActiveGroup(meta.id)}
                className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center cursor-pointer text-center ${
                  isCurrent
                    ? 'bg-[#006039] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>{meta.code}: {meta.name}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </div>
                <span className={`text-[9.5px] truncate max-w-[160px] ${isCurrent ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {meta.englishName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slogan Banner of Selected Group */}
      {activeGroup !== 'all' && (
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#006039] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-heading font-black text-emerald-950 text-xs sm:text-sm uppercase tracking-wide">
              {XTTM_GROUPS_META[Object.keys(XTTM_GROUPS_META).find(k => XTTM_GROUPS_META[k].id === activeGroup)]?.targetSlogan}
            </h4>
            <p className="text-xs text-emerald-800">
              {XTTM_GROUPS_META[Object.keys(XTTM_GROUPS_META).find(k => XTTM_GROUPS_META[k].id === activeGroup)]?.description}
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên doanh nghiệp, ngành nghề, người đại diện hoặc mã badge..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#006039] focus:ring-1 focus:ring-[#006039]"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Filter by Organization */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white font-medium focus:outline-hidden focus:border-[#006039]"
          >
            <option value="all">Tất cả tổ chức</option>
            <option value="THIP">THIP Members (Tân Thuận - Hiệp Phước)</option>
            <option value="TeamKCN">TeamKCN Members (Cung ứng KCN)</option>
            <option value="GEM">GEM Members (Doanh nghiệp Quốc tế)</option>
          </select>
        </div>
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-emerald-300"
          >
            <div className="space-y-3">
              {/* Top Row: Badge, Org, VSIC */}
              <div className="flex items-center justify-between flex-wrap gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-white font-mono font-black text-[11px] shadow-2xs">
                    {item.badge}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold border ${getOrgBadgeClass(item.org)}`}>
                    {item.org}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getGroupBadgeClass(item.groupId)}`}>
                  {item.groupCode}
                </span>
              </div>

              {/* Company Name & Sector */}
              <div className="space-y-1">
                <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg leading-snug">
                  {item.company}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="font-semibold text-[#006039]">{item.field}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 text-[11px] truncate">{item.vsicDesc}</span>
                </div>
              </div>

              {/* Attendee / Representative Box */}
              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#006039] flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {item.attendee}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {item.role || 'Đại diện kết nối'}
                    </div>
                  </div>
                </div>

                {/* Contact items */}
                <div className="pt-2 border-t border-slate-200/60 space-y-1 text-xs text-slate-600">
                  {item.phone && (
                    <div className="flex items-center gap-2 font-mono text-[11.5px]">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <a href={`tel:${item.phone.replace(/[^0-9]/g, '')}`} className="hover:text-emerald-700 hover:underline">
                        {item.phone}
                      </a>
                    </div>
                  )}

                  {item.email && (
                    <div className="flex items-center gap-2 text-[11px] truncate">
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <a href={`mailto:${item.email}`} className="hover:text-blue-700 hover:underline truncate">
                        {item.email}
                      </a>
                    </div>
                  )}

                  {item.website && (
                    <div className="flex items-center gap-2 text-[11px] truncate">
                      <Globe className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-700 hover:underline truncate flex items-center gap-1"
                      >
                        <span>{item.rawWebsite}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Connect Button */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => handleOpenConnect(item)}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-[#006039] text-[#006039] hover:text-white border border-emerald-300 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <Handshake className="w-4 h-4 text-[#006039] group-hover:text-white transition-colors" />
                <span>Kết Nối Với Doanh Nghiệp</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#006039] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-heading font-black text-slate-700 text-base">
            Không tìm thấy doanh nghiệp phù hợp
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Không có kết quả nào khớp với từ khóa "{searchKeyword}". Vui lòng thử từ khóa khác hoặc chuyển nhóm mục tiêu.
          </p>
          <button
            onClick={() => {
              setSearchKeyword('');
              setActiveGroup('all');
              setSelectedOrg('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {/* Connect Modal */}
      <XttmConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        targetItem={selectedCompanyForConnect}
        allItems={XTTM_DIRECTORY_ITEMS}
      />
    </section>
  );
}
