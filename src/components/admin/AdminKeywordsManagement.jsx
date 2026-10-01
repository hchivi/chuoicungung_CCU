import React, { useState, useMemo } from 'react';
import { 
  Key, Search, Plus, Edit, Trash2, Eye, EyeOff, Check, X,
  Layers, Tag, Building2, Package, Calendar, FileText, Crown, Globe,
  History, ArrowRight, ShieldCheck, AlertCircle, Save, RotateCcw,
  Sparkles, CheckCircle2, ChevronRight, Filter, Play, HelpCircle,
  FolderCheck, SlidersHorizontal
} from 'lucide-react';
import { 
  getAdminKeywords, 
  saveAdminKeyword, 
  CURATED_KEYWORD_CLUSTERS,
  getKeywordProducts,
  getKeywordFoundingPartner,
  getKeywordPrograms,
  slugify 
} from '../../data/keywordClustersData';
import enterprisesFullList from '../../data/enterprisesFull.json';
import { getAdminAuditLogs } from '../../data/categoryHubData';

export default function AdminKeywordsManagement() {
  const [keywords, setKeywords] = useState(() => getAdminKeywords());
  const [auditLogs, setAuditLogs] = useState(() => getAdminAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Form edit state
  const [editForm, setEditForm] = useState(null);

  // Filtered list
  const filteredKeywords = useMemo(() => {
    return keywords.filter(k => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = (k.name || '').toLowerCase().includes(q) || (k.slug || '').toLowerCase().includes(q);
      const matchesCat = selectedCategoryFilter === 'all' || k.categoryId === selectedCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [keywords, searchQuery, selectedCategoryFilter]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = keywords.length;
    const active = keywords.filter(k => k.status === 'ACTIVE' && k.publishable).length;
    const totalSynonyms = keywords.reduce((sum, k) => sum + (k.synonyms ? k.synonyms.length : 0), 0);
    return { total, active, totalSynonyms };
  }, [keywords]);

  const handleSelectKeyword = (k) => {
    setSelectedKeyword(k);
    setEditForm({ ...k });
    setActiveTab('overview');
    setIsEditing(false);
    setSaveSuccessMsg('');
  };

  const handleCreateNew = () => {
    const newKw = {
      id: `cluster-${Date.now()}`,
      slug: `tu-khoa-moi-${Date.now()}`,
      name: "Nhu Cầu Mới",
      synonyms: ["nhu-cau-tuong-duong-1"],
      categoryId: "cat-dong-phuc-bao-ho",
      categorySlug: "dong-phuc-bao-ho",
      categoryName: "Đồng Phục & Bảo Hộ Lao Động (PPE)",
      stageId: 5,
      stageName: "Nhân sự & Hậu cần",
      phaseId: "5.3",
      phaseName: "5.3 Đồng phục & Bảo hộ (PPE)",
      buyerIntent: "Mô tả ý định mua hàng / tìm nguồn cụ thể của Buyer...",
      shortDescription: "Mô tả ngắn giải pháp...",
      status: "DRAFT",
      publishable: false,
      bannerImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85",
      seoTitle: "Nhu Cầu Mới | Tìm Nhà Cung Ứng | CHUOICUNGUNG.COM",
      seoDescription: "Tìm nhà cung ứng uy tín theo năng lực và địa bàn.",
      filterSchema: [
        {
          id: "orderScale",
          label: "Quy mô nhu cầu",
          type: "select",
          options: [
            { value: "all", label: "Tất cả quy mô" },
            { value: "small", label: "Đơn hàng mẫu / Số lượng nhỏ" },
            { value: "large", label: "Quy mô công nghiệp" }
          ]
        }
      ],
      buyerGuide: {
        title: "TRƯỚC KHI TÌM NGUỒN, DOANH NGHIỆP CẦN CHUẨN BỊ:",
        items: [
          { label: "1. Thông số kỹ thuật", desc: "Kích thước, quy cách và bản vẽ." }
        ]
      },
      sourcingDossier: null,
      faqs: [
        { q: "Thời gian nhận đơn là bao lâu?", a: "Tùy thuộc quy mô đơn hàng." }
      ],
      video: null,
      catalogues: []
    };
    setSelectedKeyword(newKw);
    setEditForm(newKw);
    setIsEditing(true);
    setActiveTab('overview');
  };

  const handleSave = () => {
    if (!editForm.name || !editForm.slug) {
      alert("Vui lòng nhập Tên và Slug từ khóa.");
      return;
    }

    const updated = {
      ...editForm,
      slug: slugify(editForm.slug)
    };

    const success = saveAdminKeyword(updated, editForm.id === selectedKeyword?.id ? 'UPDATE' : 'CREATE');
    if (success) {
      setKeywords(getAdminKeywords());
      setSelectedKeyword(updated);
      setIsEditing(false);
      setSaveSuccessMsg('Đã lưu từ khóa & cluster thành công và cập nhật Audit Log!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  const handleArchive = (k) => {
    if (!confirm(`Bạn có chắc muốn chuyển từ khóa "${k.name}" sang trạng thái ARCHIVED? Không xóa cứng để bảo vệ liên kết lịch sử.`)) {
      return;
    }
    const updated = { ...k, status: 'ARCHIVED', publishable: false };
    saveAdminKeyword(updated, 'ARCHIVE');
    setKeywords(getAdminKeywords());
    if (selectedKeyword?.id === k.id) {
      setSelectedKeyword(updated);
      setEditForm(updated);
    }
  };

  // Mapped relations
  const mappedSuppliers = useMemo(() => {
    if (!selectedKeyword) return [];
    const qTokens = (selectedKeyword.name || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .split(/\s+/).filter(t => t.length > 2);

    return enterprisesFullList.filter(e => {
      const tokens = `${e.name || ''} ${e.category || ''} ${e.industry || ''} ${(e.products || []).join(' ')}`
        .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
      return qTokens.some(t => tokens.includes(t));
    }).slice(0, 15);
  }, [selectedKeyword]);

  const mappedPartner = useMemo(() => {
    return selectedKeyword ? getKeywordFoundingPartner(selectedKeyword) : null;
  }, [selectedKeyword]);

  const mappedPrograms = useMemo(() => {
    return selectedKeyword ? getKeywordPrograms(selectedKeyword) : [];
  }, [selectedKeyword]);

  return (
    <div className="space-y-6">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 font-mono uppercase">
            <Key className="w-4 h-4" />
            <span>QUẢN LÝ TỪ KHÓA BUYER INTENT & KEYWORD CLUSTER (PAGE 09)</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 font-heading">
            Quản Lý Landing Page Nhu Cầu / Từ Khóa
          </h1>
          <p className="text-xs text-slate-500">
            Quản trị URL /tu-khoa/[slug], bộ lọc động (Filter Schema), hướng dẫn chuẩn bị (Buyer Guide) và quyền lợi Founding Partner.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Nhu Cầu Mới</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">TỔNG KEYWORD CLUSTER</span>
          <div className="text-xl font-black text-slate-900 font-mono">{stats.total}</div>
          <span className="text-[11px] text-blue-600 font-medium">Canonical Buyer Intents</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">ĐANG XUẤT BẢN (ACTIVE)</span>
          <div className="text-xl font-black text-emerald-600 font-mono">{stats.active}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Hiển thị công khai</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">TỔNG TỪ ĐỒNG NGHĨA (SYNONYMS)</span>
          <div className="text-xl font-black text-purple-600 font-mono">{stats.totalSynonyms}</div>
          <span className="text-[11px] text-purple-700 font-medium">Ngăn chặn tạo trang rác</span>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm từ khóa, slug..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredKeywords.map(k => {
              const isSelected = selectedKeyword?.id === k.id;
              return (
                <div
                  key={k.id}
                  onClick={() => handleSelectKeyword(k)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition space-y-1.5 ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400/30' 
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      Pha {k.phaseId}
                    </span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      k.status === 'ACTIVE' && k.publishable
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {k.status === 'ACTIVE' && k.publishable ? 'PUBLIC' : k.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 font-heading">
                    {k.name}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span className="truncate max-w-[180px] font-mono text-[10px] text-slate-400">/{k.slug}</span>
                    <span className="font-mono text-[10px]">{k.synonyms?.length || 0} syn</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 12 Tabs (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedKeyword ? (
            <div className="space-y-6">
              
              {/* Header Info & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">
                      {selectedKeyword.categoryName} • Pha {selectedKeyword.phaseId}
                    </span>
                    <a
                      href={`/tu-khoa/${selectedKeyword.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Xem trang live</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 font-heading pt-1">
                    {editForm?.name || selectedKeyword.name}
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
                        onClick={() => { setIsEditing(false); setEditForm({ ...selectedKeyword }); }}
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
                        onClick={() => handleArchive(selectedKeyword)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-xl border border-amber-200"
                        title="Chuyển sang ARCHIVED"
                      >
                        Archive
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 12 Navigation Tabs */}
              <div className="flex items-center space-x-1 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'overview', label: '1. Tổng quan' },
                  { id: 'cluster', label: `2. Cluster (${selectedKeyword.synonyms?.length || 0})` },
                  { id: 'filters', label: '3. Filter Schema' },
                  { id: 'buyerGuide', label: '4. Buyer Guide' },
                  { id: 'suppliers', label: `5. NCC (${mappedSuppliers.length})` },
                  { id: 'partner', label: '6. Founding Partner' },
                  { id: 'dossier', label: '7. Bộ hồ sơ' },
                  { id: 'programs', label: `8. Chương trình (${mappedPrograms.length})` },
                  { id: 'catalogue', label: `9. Catalogue (${selectedKeyword.catalogues?.length || 0})` },
                  { id: 'media', label: '10. Video' },
                  { id: 'faq', label: `11. FAQ (${selectedKeyword.faqs?.length || 0})` },
                  { id: 'seo', label: '12. SEO' }
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tên Từ Khóa / Nhu Cầu</label>
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ý định tìm nguồn (Buyer Intent)</label>
                    <textarea
                      rows={2}
                      disabled={!isEditing}
                      value={editForm?.buyerIntent || ''}
                      onChange={(e) => setEditForm({ ...editForm, buyerIntent: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white disabled:bg-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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
                  </div>
                </div>
              )}

              {/* Tab 2: Keyword Cluster & Synonyms */}
              {activeTab === 'cluster' && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl">
                    <strong>Quy tắc Cluster:</strong> Các từ đồng nghĩa trỏ về cùng một landing page duy nhất để tránh tạo nội dung trùng lặp (duplicate content / thin content).
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Danh sách từ đồng nghĩa (Synonyms) map về trang này:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(editForm?.synonyms || []).map((syn, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-mono rounded-lg border border-slate-200 flex items-center space-x-1.5">
                          <span>/{syn}</span>
                          {isEditing && (
                            <button
                              onClick={() => {
                                const newSyns = editForm.synonyms.filter((_, i) => i !== idx);
                                setEditForm({ ...editForm, synonyms: newSyns });
                              }}
                              className="text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => {
                          const s = prompt("Nhập slug từ đồng nghĩa (ví dụ: dien-mat-troi-nha-xuong):");
                          if (s) {
                            setEditForm({ ...editForm, synonyms: [...(editForm.synonyms || []), slugify(s)] });
                          }
                        }}
                        className="mt-3 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        + Thêm từ đồng nghĩa
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Filters Schema */}
              {activeTab === 'filters' && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700">Bộ lọc đặc thù được cấu hình theo ngành:</span>
                  <div className="space-y-3">
                    {(editForm?.filterSchema || []).map((f, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                          <span>{f.label} ({f.id})</span>
                          <span className="font-mono text-[10px] text-slate-400">{f.options?.length || 0} tùy chọn</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(f.options || []).map((opt, oIdx) => (
                            <span key={oIdx} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 text-[10px] rounded font-medium">
                              {opt.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Buyer Guide */}
              {activeTab === 'buyerGuide' && (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-700">{editForm?.buyerGuide?.title}</div>
                  <div className="space-y-2">
                    {(editForm?.buyerGuide?.items || []).map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-slate-900">{item.label}</div>
                        <div className="text-slate-600 text-[11px]">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Suppliers */}
              {activeTab === 'suppliers' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700">Nhà cung ứng khớp năng lực ({mappedSuppliers.length}):</span>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {mappedSuppliers.map(s => (
                      <div key={s.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-[11px] text-slate-500">📍 {s.province} • {s.category || s.industry}</div>
                        </div>
                        <a href={`/doanh-nghiep/${s.id}`} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">
                          Xem hồ sơ
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 6: Founding Partner */}
              {activeTab === 'partner' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700">Đối tác tài trợ theo chuyên mục/từ khóa:</span>
                  {mappedPartner ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs">
                      <div className="font-black text-slate-900">{mappedPartner.name}</div>
                      <div className="text-amber-800 font-semibold">{mappedPartner.brandTitle}</div>
                      <p className="text-slate-600">{mappedPartner.description}</p>
                      <span className="text-[10px] text-emerald-700 font-bold">✓ Hợp đồng Active • Quyền lợi hiển thị tài trợ độc lập</span>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                      Chưa có đối tác tài trợ cho nhóm từ khóa này.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 7: Dossier */}
              {activeTab === 'dossier' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700">Bộ hồ sơ đề xuất nguồn cung (Sourcing Dossier):</span>
                  {selectedKeyword.sourcingDossier ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                      <div className="font-bold text-slate-900">{selectedKeyword.sourcingDossier.title}</div>
                      <p className="text-slate-600">{selectedKeyword.sourcingDossier.purpose}</p>
                      <div className="text-[10px] font-mono text-emerald-700">Trạng thái: PUBLIC</div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                      Chưa có bộ hồ sơ đề xuất cho từ khóa này (khối sẽ tự động ẩn ngoài giao diện).
                    </div>
                  )}
                </div>
              )}

              {/* Tab 8: Programs */}
              {activeTab === 'programs' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700">Chương trình xúc tiến liên quan:</span>
                  {mappedPrograms.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                      Không có chương trình riêng cho từ khóa này.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {mappedPrograms.map(p => (
                        <div key={p.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-900">{p.title}</div>
                            <div className="text-[11px] text-slate-500">{p.time} • {p.location}</div>
                          </div>
                          <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">{p.format}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 9: Catalogue */}
              {activeTab === 'catalogue' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700">Tài liệu catalogue:</span>
                  {(selectedKeyword.catalogues || []).length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                      Chưa có tài liệu catalogue cho từ khóa này.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedKeyword.catalogues.map(c => (
                        <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-900">{c.title}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{c.format} • {c.size}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 10: Video */}
              {activeTab === 'media' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700">Video khảo sát / năng lực:</span>
                  {selectedKeyword.video ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                      <div className="font-bold text-slate-900">{selectedKeyword.video.title}</div>
                      <div className="font-mono text-[11px] text-blue-600">{selectedKeyword.video.embedUrl}</div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                      Chưa gắn video cho từ khóa này (khối sẽ tự động ẩn ngoài giao diện).
                    </div>
                  )}
                </div>
              )}

              {/* Tab 11: FAQ */}
              {activeTab === 'faq' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700">Danh sách câu hỏi thường gặp (FAQ):</span>
                  <div className="space-y-2">
                    {(selectedKeyword.faqs || []).map((faq, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-slate-900">Q: {faq.q}</div>
                        <div className="text-slate-600">A: {faq.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 12: SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SEO Title</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={editForm?.seoTitle || ''}
                      onChange={(e) => setEditForm({ ...editForm, seoTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SEO Meta Description</label>
                    <textarea
                      rows={2}
                      disabled={!isEditing}
                      value={editForm?.seoDescription || ''}
                      onChange={(e) => setEditForm({ ...editForm, seoDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-blue-600">
                    Canonical: https://chuoicungung.com/tu-khoa/{selectedKeyword.slug}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Key className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">Vui lòng chọn một từ khóa từ danh sách bên trái để xem và quản lý.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
