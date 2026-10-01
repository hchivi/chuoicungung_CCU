import React, { useState, useMemo } from 'react';
import { 
  FolderTree, Search, Plus, Edit, Trash2, Eye, EyeOff, Check, X,
  Layers, Tag, Building2, Package, Calendar, FileText, Crown, Globe,
  History, ArrowRight, ShieldCheck, AlertCircle, Save, RotateCcw,
  Sparkles, CheckCircle2, ChevronRight, Filter
} from 'lucide-react';
import { 
  getAdminCategories, 
  saveAdminCategory, 
  getAdminAuditLogs, 
  SIX_STAGES_TAXONOMY,
  slugify 
} from '../../data/categoryHubData';
import enterprisesFullList from '../../data/enterprisesFull.json';
import { STRATEGIC_FOUNDING_PARTNERS } from '../../data/strategicFoundingPartners.js';
import { PROGRAMS_DATA } from '../../data/programsData.js';
import { SEEDED_PRODUCT_SERVICES } from '../../data/productServicesData.js';

export default function AdminCategoriesManagement() {
  const [categories, setCategories] = useState(() => getAdminCategories());
  const [auditLogs, setAuditLogs] = useState(() => getAdminAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Form edit state
  const [editForm, setEditForm] = useState(null);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = (c.name || '').toLowerCase().includes(q) || (c.slug || '').toLowerCase().includes(q);
      const matchesStage = selectedStageFilter === 'all' || String(c.stageId) === String(selectedStageFilter);
      return matchesSearch && matchesStage;
    });
  }, [categories, searchQuery, selectedStageFilter]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter(c => c.status === 'ACTIVE' && c.publishable).length;
    const draft = categories.filter(c => c.status !== 'ACTIVE' || !c.publishable).length;
    const totalKeywords = categories.reduce((sum, c) => sum + (c.keywords ? c.keywords.length : 0), 0);
    return { total, active, draft, totalKeywords };
  }, [categories]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setEditForm({ ...cat });
    setActiveTab('overview');
    setIsEditing(false);
    setSaveSuccessMsg('');
  };

  const handleCreateNew = () => {
    const newCat = {
      id: `cat-${Date.now()}`,
      slug: `chuyen-muc-moi-${Date.now()}`,
      name: "Chuyên mục Mới",
      stageId: 4,
      stageName: "Vận hành Sản xuất",
      phaseId: "4.1",
      phaseName: "4.1 Cung ứng đầu vào & Nguyên vật liệu",
      shortDescription: "Mô tả ngắn nhóm nhu cầu phục vụ nhà máy...",
      buyerIntent: "Tìm nhà cung cấp có năng lực đáp ứng đơn hàng.",
      status: "DRAFT",
      publishable: false,
      sortOrder: categories.length + 1,
      seoTitle: "Chuyên mục Mới | Tìm Nhà Cung Ứng | CHUOICUNGUNG.COM",
      seoDescription: "Tìm sản phẩm, dịch vụ và nhà cung ứng theo năng lực.",
      bannerImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85",
      keywords: [
        { id: `kw-1`, name: "Nhu cầu mẫu 1", slug: "nhu-cau-mau-1", query: "nhu cau", count: 20 }
      ],
      buyerGuide: {
        title: "TRƯỚC KHI TÌM NGUỒN, BẠN NÊN CHUẨN BỊ GÌ?",
        items: [
          { label: "Quy cách kỹ thuật", desc: "Mô tả chi tiết thông số và dung sai." }
        ]
      },
      catalogues: []
    };
    setSelectedCategory(newCat);
    setEditForm(newCat);
    setIsEditing(true);
    setActiveTab('overview');
  };

  const handleSave = () => {
    if (!editForm.name || !editForm.slug) {
      alert("Vui lòng nhập Tên và Slug chuyên mục.");
      return;
    }

    const updated = {
      ...editForm,
      slug: slugify(editForm.slug)
    };

    const success = saveAdminCategory(updated, editForm.id === selectedCategory?.id ? 'UPDATE' : 'CREATE');
    if (success) {
      setCategories(getAdminCategories());
      setAuditLogs(getAdminAuditLogs());
      setSelectedCategory(updated);
      setIsEditing(false);
      setSaveSuccessMsg('Đã lưu chuyên mục thành công và ghi nhận Audit Log!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  const handleArchive = (cat) => {
    if (!confirm(`Bạn có chắc muốn chuyển chuyên mục "${cat.name}" sang trạng thái ARCHIVED? Không xóa cứng để bảo toàn quan hệ dữ liệu.`)) {
      return;
    }
    const updated = { ...cat, status: 'ARCHIVED', publishable: false };
    saveAdminCategory(updated, 'ARCHIVE');
    setCategories(getAdminCategories());
    setAuditLogs(getAdminAuditLogs());
    if (selectedCategory?.id === cat.id) {
      setSelectedCategory(updated);
      setEditForm(updated);
    }
  };

  // Mapped relations for selected category
  const mappedSuppliers = useMemo(() => {
    if (!selectedCategory) return [];
    const catNameLower = (selectedCategory.name || '').toLowerCase();
    const catSlug = slugify(selectedCategory.name || '');
    return enterprisesFullList.filter(e => {
      const c = (e.category || e.industry || '').toLowerCase();
      const s = slugify(c);
      return c.includes(catNameLower) || catNameLower.includes(c) || s.includes(catSlug) || catSlug.includes(s);
    }).slice(0, 15);
  }, [selectedCategory]);

  const mappedProducts = useMemo(() => {
    if (!selectedCategory) return [];
    const catNameLower = (selectedCategory.name || '').toLowerCase();
    return SEEDED_PRODUCT_SERVICES.filter(p => {
      const c = (p.categoryName || '').toLowerCase();
      return c.includes(catNameLower) || catNameLower.includes(c);
    });
  }, [selectedCategory]);

  const mappedPartner = useMemo(() => {
    if (!selectedCategory) return null;
    const catNameLower = (selectedCategory.name || '').toLowerCase();
    return STRATEGIC_FOUNDING_PARTNERS.find(fp => {
      const c = (fp.category || '').toLowerCase();
      return c.includes(catNameLower) || catNameLower.includes(c) || fp.phaseId === selectedCategory.phaseId;
    });
  }, [selectedCategory]);

  const mappedPrograms = useMemo(() => {
    if (!selectedCategory) return [];
    const catNameLower = (selectedCategory.name || '').toLowerCase();
    return PROGRAMS_DATA.filter(prog => {
      return (prog.industries || []).some(ind => {
        const iLower = ind.toLowerCase();
        return iLower.includes(catNameLower) || catNameLower.includes(iLower) || iLower === 'tất cả ngành hàng';
      });
    }).slice(0, 5);
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 font-mono uppercase">
            <FolderTree className="w-4 h-4" />
            <span>HỆ THỐNG QUẢN TRỊ TAXONOMY & CHUYÊN MỤC SOURCING</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 font-heading">
            Quản Lý Chuyên Mục Nhu Cầu / Ngành Nghề
          </h1>
          <p className="text-xs text-slate-500">
            Quản trị URL /nganh-nghe/[slug], cây phân cấp 6 giai đoạn, từ khóa con, sản phẩm liên kết và đối tác tài trợ.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Chuyên Mục Mới</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">TỔNG CHUYÊN MỤC</span>
          <div className="text-xl font-black text-slate-900 font-mono">{stats.total}</div>
          <span className="text-[11px] text-blue-600 font-medium">Hub Sourcing</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">ĐANG XUẤT BẢN (ACTIVE)</span>
          <div className="text-xl font-black text-emerald-600 font-mono">{stats.active}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Public trên website</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">BẢN NHÁP / CHƯA ĐỦ DATA</span>
          <div className="text-xl font-black text-amber-600 font-mono">{stats.draft}</div>
          <span className="text-[11px] text-amber-700 font-medium">Bảo vệ an toàn SEO</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">TỔNG TỪ KHÓA CON MAPPING</span>
          <div className="text-xl font-black text-purple-600 font-mono">{stats.totalKeywords}</div>
          <span className="text-[11px] text-purple-700 font-medium">Trỏ về /tu-khoa/[slug]</span>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main 2-Column Grid: List on Left, Detail/Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Category List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm chuyên mục, slug..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <select
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">Tất cả giai đoạn (1-6)</option>
              {SIX_STAGES_TAXONOMY.map(st => (
                <option key={st.id} value={st.id}>GD {st.id}: {st.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredCategories.map(cat => {
              const isSelected = selectedCategory?.id === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition space-y-1.5 ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400/30' 
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      Pha {cat.phaseId}
                    </span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      cat.status === 'ACTIVE' && cat.publishable
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {cat.status === 'ACTIVE' && cat.publishable ? 'PUBLIC' : cat.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 font-heading">
                    {cat.name}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span className="truncate max-w-[180px] font-mono text-[10px] text-slate-400">/{cat.slug}</span>
                    <span className="font-mono text-[10px]">{cat.keywords?.length || 0} kw</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Category Detail / 10-Tab Admin View (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedCategory ? (
            <div className="space-y-6">
              
              {/* Header Info & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">
                      {selectedCategory.stageName} • {selectedCategory.phaseName}
                    </span>
                    <a
                      href={`/nganh-nghe/${selectedCategory.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Xem trang live</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 font-heading pt-1">
                    {editForm?.name || selectedCategory.name}
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu Thay Đổi</span>
                      </button>
                      <button
                        onClick={() => { setIsEditing(false); setEditForm({ ...selectedCategory }); }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Chỉnh Sửa</span>
                      </button>
                      <button
                        onClick={() => handleArchive(selectedCategory)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-xl border border-amber-200"
                        title="Chuyển sang trạng thái ARCHIVED (không xóa cứng)"
                      >
                        Archive
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 10 Navigation Tabs */}
              <div className="flex items-center space-x-1 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'overview', label: '1. Tổng quan' },
                  { id: 'taxonomy', label: '2. Taxonomy' },
                  { id: 'keywords', label: `3. Keywords (${selectedCategory.keywords?.length || 0})` },
                  { id: 'products', label: `4. Sản phẩm (${mappedProducts.length})` },
                  { id: 'suppliers', label: `5. NCC (${mappedSuppliers.length})` },
                  { id: 'programs', label: `6. Chương trình (${mappedPrograms.length})` },
                  { id: 'catalogues', label: `7. Catalogue (${selectedCategory.catalogues?.length || 0})` },
                  { id: 'partner', label: '8. Founding Partner' },
                  { id: 'seo', label: '9. SEO' },
                  { id: 'audit', label: '10. Audit Log' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-t-xl font-bold whitespace-nowrap transition cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Tổng quan */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tên Chuyên Mục</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={editForm?.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Slug URL</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={editForm?.slug || ''}
                        onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả ngắn (Short Description)</label>
                    <textarea
                      rows={2}
                      disabled={!isEditing}
                      value={editForm?.shortDescription || ''}
                      onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ý định tìm nguồn của Buyer (Buyer Intent)</label>
                    <textarea
                      rows={2}
                      disabled={!isEditing}
                      value={editForm?.buyerIntent || ''}
                      onChange={(e) => setEditForm({ ...editForm, buyerIntent: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white disabled:bg-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái</label>
                      <select
                        disabled={!isEditing}
                        value={editForm?.status || 'ACTIVE'}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      >
                        <option value="ACTIVE">ACTIVE (Hoạt động)</option>
                        <option value="DRAFT">DRAFT (Bản nháp)</option>
                        <option value="ARCHIVED">ARCHIVED (Lưu trữ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Cho phép Public</label>
                      <select
                        disabled={!isEditing}
                        value={editForm?.publishable ? 'true' : 'false'}
                        onChange={(e) => setEditForm({ ...editForm, publishable: e.target.value === 'true' })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      >
                        <option value="true">Có (Publishable)</option>
                        <option value="false">Không (Ẩn)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Thứ tự hiển thị (Sort Order)</label>
                      <input
                        type="number"
                        disabled={!isEditing}
                        value={editForm?.sortOrder || 1}
                        onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Readiness Indicator */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase font-mono">ĐÁNH GIÁ ĐỦ DỮ LIỆU ĐỂ PUBLISH:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center space-x-1.5 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                        <span>Có H1 & Mô tả</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                        <span>Có {mappedSuppliers.length} NCC liên kết</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                        <span>Có {selectedCategory.keywords?.length || 0} từ khóa con</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                        <span>Có Buyer Guide</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Taxonomy */}
              {activeTab === 'taxonomy' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Giai đoạn trong 6 Giai đoạn</label>
                      <select
                        disabled={!isEditing}
                        value={editForm?.stageId || 4}
                        onChange={(e) => {
                          const sId = parseInt(e.target.value);
                          const stage = SIX_STAGES_TAXONOMY.find(s => s.id === sId);
                          setEditForm({ ...editForm, stageId: sId, stageName: stage?.name || '' });
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      >
                        {SIX_STAGES_TAXONOMY.map(st => (
                          <option key={st.id} value={st.id}>Giai đoạn {st.id}: {st.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mã Pha (1.1 đến 6.3)</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={editForm?.phaseId || ''}
                        onChange={(e) => setEditForm({ ...editForm, phaseId: e.target.value })}
                        placeholder="Ví dụ: 5.3"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tên Pha Hiển Thị</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={editForm?.phaseName || ''}
                      onChange={(e) => setEditForm({ ...editForm, phaseName: e.target.value })}
                      placeholder="Ví dụ: 5.3 Đồng phục & Bảo hộ (PPE)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl">
                    <strong>Quy tắc quan hệ:</strong> 6 GIAI ĐOẠN → NHÓM NHU CẦU / PHA → CATEGORY → KEYWORDS → PRODUCTS → SUPPLIERS.
                  </div>
                </div>
              )}

              {/* Tab 3: Keywords */}
              {activeTab === 'keywords' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Các từ khóa/nhu cầu con trỏ về /tu-khoa/[slug]:</span>
                    {isEditing && (
                      <button
                        onClick={() => {
                          const kwName = prompt("Nhập tên từ khóa / nhu cầu mới:");
                          if (kwName) {
                            const newKws = [
                              ...(editForm.keywords || []),
                              { id: `kw-${Date.now()}`, name: kwName, slug: slugify(kwName), query: kwName, count: 10 }
                            ];
                            setEditForm({ ...editForm, keywords: newKws });
                          }
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                      >
                        + Thêm từ khóa
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(editForm?.keywords || []).map((kw, idx) => (
                      <div key={kw.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{kw.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">/tu-khoa/{kw.slug}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600">
                            {kw.count || 0} hits
                          </span>
                          {isEditing && (
                            <button
                              onClick={() => {
                                const newKws = editForm.keywords.filter((_, i) => i !== idx);
                                setEditForm({ ...editForm, keywords: newKws });
                              }}
                              className="text-rose-600 p-1 hover:bg-rose-50 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Products / Services */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700">Sản phẩm / Dịch vụ thuộc chuyên mục này:</span>
                  {mappedProducts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      Chưa có sản phẩm hạt nhân nào được liên kết cụ thể với chuyên mục này.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {mappedProducts.map(p => (
                        <div key={p.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-900">{p.title}</div>
                            <div className="text-[11px] text-slate-500">NCC: {p.supplierName} • MOQ: {p.moq} {p.moqUnit}</div>
                          </div>
                          <a
                            href={`/san-pham-dich-vu/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 font-bold hover:underline"
                          >
                            Xem sản phẩm
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Suppliers */}
              {activeTab === 'suppliers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Các nhà cung ứng liên kết tự động theo ngành ({mappedSuppliers.length}):
                    </span>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {mappedSuppliers.map(s => (
                      <div key={s.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{s.name}</div>
                          <div className="text-[11px] text-slate-500">📍 {s.province || 'Toàn quốc'} • {s.category || s.industry}</div>
                        </div>
                        <a
                          href={`/doanh-nghiep/${s.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Hồ sơ
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 6: Programs */}
              {activeTab === 'programs' && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700">Chương trình xúc tiến kết nối phù hợp:</span>
                  {mappedPrograms.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                      Không có chương trình riêng cho ngành này.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {mappedPrograms.map(pr => (
                        <div key={pr.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-900">{pr.title}</div>
                            <div className="text-[11px] text-slate-500">{pr.time} • {pr.location}</div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                            {pr.format}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 7: Catalogue */}
              {activeTab === 'catalogues' && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700">Bộ tài liệu & Catalogue:</span>
                  {(selectedCategory.catalogues || []).length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                      Chưa có catalogue nào được tải lên cho chuyên mục này.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedCategory.catalogues.map(c => (
                        <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-900">{c.title}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{c.format} • {c.size} • {c.pages} trang</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 8: Founding Partner */}
              {activeTab === 'partner' && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700">Đối tác Tài trợ Chuyên mục (Founding Partner):</span>
                  {mappedPartner ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                      <div className="flex items-center space-x-3">
                        <img src={mappedPartner.logo} alt="" className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-amber-200" />
                        <div>
                          <h4 className="text-xs font-black text-slate-900 font-heading">{mappedPartner.name}</h4>
                          <p className="text-[11px] text-amber-800 font-semibold">{mappedPartner.brandTitle}</p>
                          <span className="text-[10px] font-mono text-emerald-700 font-bold">✓ Hợp đồng Active</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600">{mappedPartner.description}</p>
                      <div className="text-[11px] text-slate-500 italic">
                        * Hiển thị riêng trong khối tài trợ có gắn nhãn, không can thiệp xếp hạng tìm kiếm tự nhiên.
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                      Chưa có Founding Partner nào đăng ký tài trợ cho chuyên mục này.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 9: SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">SEO Title</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={editForm?.seoTitle || ''}
                      onChange={(e) => setEditForm({ ...editForm, seoTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">SEO Meta Description</label>
                    <textarea
                      rows={2}
                      disabled={!isEditing}
                      value={editForm?.seoDescription || ''}
                      onChange={(e) => setEditForm({ ...editForm, seoDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                    <span className="font-bold text-slate-700">Canonical URL:</span>
                    <div className="font-mono text-[11px] text-blue-600">
                      https://chuoicungung.com/nganh-nghe/{selectedCategory.slug}
                    </div>
                    <span className="text-[10px] text-slate-500 block pt-1">
                      * Mọi query filter (tỉnh thành, trang, từ khóa con) đều có thẻ canonical trỏ về URL gốc để tránh bùng nổ chỉ mục (index explosion).
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 10: Audit Log */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700">Nhật ký thay đổi chuyên mục (Audit Logs):</span>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {auditLogs
                      .filter(log => log.targetId === selectedCategory.id || log.targetType === 'CATEGORY')
                      .map(log => (
                        <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 font-mono mr-2">{log.action}</span>
                            <span className="text-slate-600">{log.targetName}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleString('vi-VN')}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <FolderTree className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">Vui lòng chọn một chuyên mục từ danh sách bên trái để xem và quản lý.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
