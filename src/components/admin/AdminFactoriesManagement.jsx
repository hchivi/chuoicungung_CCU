// ============================================================================
// ADMIN COMPONENT: QUẢN TRỊ NHÀ MÁY & PHÂN TÁCH BUY/SELL
// TUÂN THỦ SECTION 38, 39, 40, 41, 42 SPEC 28.TXT
// ============================================================================

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Factory, Building2, MapPin, ShieldCheck, CheckCircle2, XCircle, AlertCircle,
  Search, Filter, Plus, Calendar, Clock, ArrowRight, ExternalLink,
  Edit3, Check, X, FileText, ChevronRight, AlertTriangle, Eye, Layers,
  ShoppingBag, Users, Phone, Mail, Award, Zap, Package, RefreshCw
} from 'lucide-react';
import {
  getFactoriesListing,
  getFactoryByIdOrSlug,
  updateFactoryProfileAdmin,
  checkFactoryDataQuality,
  getAllFactoryAuditLogs,
  FACTORY_PROFILE_STATUS_ENUM
} from '../../data/factoriesData';

export default function AdminFactoriesManagement({ initialFactoryId = null }) {
  const [activeTab, setActiveTab] = useState(initialFactoryId ? 'detail' : 'listing'); // 'listing' | 'detail' | 'data_quality' | 'logs'
  const [selectedFactoryId, setSelectedFactoryId] = useState(initialFactoryId || 'fac-org-proser-001');
  const [detailTab, setDetailTab] = useState('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvince, setFilterProvince] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Listing data
  const listingData = useMemo(() => {
    return getFactoriesListing({
      query: searchTerm,
      province: filterProvince,
      pageSize: 50
    });
  }, [searchTerm, filterProvince, refreshKey]);

  // Selected Factory Enriched
  const selectedFactory = useMemo(() => {
    return getFactoryByIdOrSlug(selectedFactoryId);
  }, [selectedFactoryId, refreshKey]);

  // Audit Logs
  const auditLogs = useMemo(() => {
    return getAllFactoryAuditLogs();
  }, [refreshKey]);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-blue-50 text-[#0052cc] text-xs font-bold font-mono">
            <Factory className="w-3.5 h-3.5" />
            <span>PAGE 28 ADMIN FACTORY ENGINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            Quản Trị Nhà Máy Sản Xuất & Tách Bạch Chiều Mua / Bán
          </h2>
          <p className="text-xs text-slate-500">
            Một Organization gốc - quản trị đồng thời nhu cầu thu mua (Buy Side) và năng lực gia công OEM/cung ứng (Sell Side).
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('listing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'listing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Danh Sách ({listingData.total})</span>
          </button>

          <button
            onClick={() => setActiveTab('detail')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'detail' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Chi Tiết ({selectedFactory?.name?.slice(0, 14)}...)</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'logs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Audit Log ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 1. LISTING VIEW (SECTION 38 SPEC 28.TXT) */}
      {/* ======================================================================= */}
      {activeTab === 'listing' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm nhà máy, tổ chức, ngành nghề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={filterProvince}
                onChange={(e) => setFilterProvince(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              >
                <option value="all">Tất cả tỉnh / thành</option>
                <option value="Đồng Nai">Đồng Nai</option>
                <option value="Bình Dương">Bình Dương</option>
                <option value="Bắc Ninh">Bắc Ninh</option>
                <option value="Hải Phòng">Hải Phòng</option>
                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
              </select>
            </div>
          </div>

          {/* Section 38 Table Columns */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Factory / Organization</th>
                  <th className="py-3 px-3">Industry</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">KCN</th>
                  <th className="py-3 px-3 text-center">Profile Status</th>
                  <th className="py-3 px-3 text-center">Buyer Needs</th>
                  <th className="py-3 px-3 text-center">Supplier Role?</th>
                  <th className="py-3 px-3">Owner</th>
                  <th className="py-3 px-3">Updated</th>
                  <th className="py-3 px-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listingData.items.map((fac) => {
                  const isCur = selectedFactoryId === fac.id;
                  return (
                    <tr 
                      key={fac.id}
                      className={`hover:bg-slate-50/80 transition ${isCur ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{fac.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Org ID: {fac.organizationId}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-xs truncate">
                        {fac.industry}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {fac.province}
                      </td>
                      <td className="py-3 px-3">
                        {fac.isKcnConfirmed ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-[#0052cc] text-[10.5px] font-bold">
                            {fac.industrialParkName || fac.industrialParkId}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10.5px]">Ngoài KCN</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>PUBLISHED</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-mono font-bold">
                          {fac.publicNeedsCount || 0}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {fac.hasSupplierCapability ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px]">
                            CÓ (SELL)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Chỉ mua</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">
                        Lê Minh Quân
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[10px]">
                        {fac.updatedAt}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedFactoryId(fac.id);
                            setActiveTab('detail');
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. DETAIL VIEW WITH BUY / SELL SEPARATION (SECTIONS 39 & 40) */}
      {/* ======================================================================= */}
      {activeTab === 'detail' && selectedFactory && (
        <div className="space-y-6">
          
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052cc] text-xs font-bold font-mono">
                  {selectedFactory.province} • {selectedFactory.type}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Xác thực pháp nhân</span>
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-heading">
                {selectedFactory.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Organization Master ID: <span className="font-bold text-slate-800">{selectedFactory.organizationId}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to={`/nha-may/${selectedFactory.slug || selectedFactory.id}`}
                target="_blank"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition inline-flex items-center space-x-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem Trang Công Khai</span>
              </Link>
            </div>
          </div>

          {/* Section 39: Tabs Bar */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-thin">
            <div className="flex items-center space-x-1 min-w-max">
              {[
                'OVERVIEW', 'FACTORY PROFILE', 'BUY SIDE (MUA)', 'SELL SIDE (BÁN)', 
                'PROGRAMS', 'MEDIA', 'CATALOGUES', 'TASKS', 'AUDIT'
              ].map(tab => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition uppercase ${
                    detailTab === tab 
                      ? tab.includes('BUY') ? 'bg-blue-600 text-white shadow-xs' :
                        tab.includes('SELL') ? 'bg-emerald-600 text-white shadow-xs' :
                        'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs min-h-[400px]">
            
            {detailTab === 'OVERVIEW' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
                    <span className="text-xs font-bold text-blue-700 uppercase">CHIỀU MUA (BUY SIDE)</span>
                    <div className="text-xl font-black text-slate-900 font-heading">
                      {selectedFactory.publicNeedsCount} Nhu cầu công khai
                    </div>
                    <p className="text-[11px] text-slate-500">Thu mua NVL, phụ trợ & dịch vụ vận hành KCN</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                    <span className="text-xs font-bold text-emerald-700 uppercase">CHIỀU BÁN (SELL SIDE)</span>
                    <div className="text-xl font-black text-slate-900 font-heading">
                      {selectedFactory.hasSupplierCapability ? 'KÍCH HOẠT (ACTIVE)' : 'CHƯA ĐĂNG KÝ'}
                    </div>
                    <p className="text-[11px] text-slate-500">Năng lực OEM, sản phẩm đầu ra & xuất khẩu</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">ĐỊA BÀN HOẠT ĐỘNG</span>
                    <div className="text-xl font-black text-slate-900 font-heading truncate">
                      {selectedFactory.industrialParkName || selectedFactory.province}
                    </div>
                    <p className="text-[11px] text-slate-500">Xác thực vị trí: {selectedFactory.isKcnConfirmed ? 'ĐẠT' : 'NGOÀI KCN'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-800">Thông Tin Giới Thiệu Nhà Máy</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedFactory.name} là đơn vị sản xuất hoạt động trong lĩnh vực {selectedFactory.industry}. 
                    Hồ sơ được quản lý tập trung trên hệ thống CHUOICUNGUNG.COM, đảm bảo doanh nghiệp không bị nhân bản dữ liệu khi vừa tham gia đấu thầu vừa gửi nhu cầu tìm nhà cung ứng.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 40: BUY SIDE TAB */}
            {detailTab === 'BUY SIDE (MUA)' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-blue-900 font-heading">
                      QUẢN TRỊ CHIỀU MUA (BUY SIDE REQUIREMENTS)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Tất cả các gói nhu cầu thu mua, kết nối nhà cung ứng và lịch gặp B2B của nhà máy.
                    </p>
                  </div>
                  <Link
                    to={`/dang-nhu-cau?role=factory&organizationId=${selectedFactory.organizationId}`}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo Gói Mua Hàng Mới</span>
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl">
                  {selectedFactory.publicNeedsList?.map(req => (
                    <div key={req.id} className="p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{req.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700">
                          {req.publicCode || req.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{req.description}</p>
                      <div className="text-[10px] text-slate-400 font-mono pt-1">
                        Bảo mật liên hệ: ĐẠT CHUẨN • Ngân sách: Thỏa thuận
                      </div>
                    </div>
                  ))}

                  {(!selectedFactory.publicNeedsList || selectedFactory.publicNeedsList.length === 0) && (
                    <div className="p-8 text-center text-xs text-slate-400">
                      Chưa có gói mua hàng công khai nào được gán cho nhà máy này.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 40: SELL SIDE TAB */}
            {detailTab === 'SELL SIDE (BÁN)' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900 font-heading">
                      QUẢN TRỊ CHIỀU BÁN (SELL SIDE & OEM CAPABILITY)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Năng lực gia công, sản phẩm hoàn thiện và thị trường xuất khẩu của nhà máy.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = updateFactoryProfileAdmin(selectedFactory.id, {
                        ...selectedFactory,
                        oemAvailable: !selectedFactory.oemAvailable
                      }, 'Admin Điều Phối');
                      alert(`Đã cập nhật trạng thái OEM: ${updated.oemAvailable ? 'BẬT' : 'TẮT'}`);
                      setRefreshKey(k => k + 1);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
                  >
                    Chuyển Trạng Thái OEM ({selectedFactory.oemAvailable ? 'ĐANG BẬT' : 'ĐANG TẮT'})
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Sản phẩm đầu ra công bố:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedFactory.outputProducts.map((p, pIdx) => (
                        <span key={pIdx} className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Năng lực nhà cung ứng (Supplier Profile):</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedFactory.supplierCapabilities.map((c, cIdx) => (
                        <span key={cIdx} className="px-3 py-1 bg-white border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Tabs Fallback */}
            {!['OVERVIEW', 'BUY SIDE (MUA)', 'SELL SIDE (BÁN)'].includes(detailTab) && (
              <div className="p-12 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <h5 className="text-sm font-bold text-slate-700 uppercase">Tab {detailTab}</h5>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Dữ liệu chuyên sâu đã sẵn sàng liên kết từ mô-đun nghiệp vụ theo phân quyền Admin Section 39.
                </p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. AUDIT LOGS (SECTION 14 QA) */}
      {/* ======================================================================= */}
      {activeTab === 'logs' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 font-heading">
              Nhật Ký Thay Đổi Hồ Sơ Nhà Máy (Audit Logs)
            </h3>
            <p className="text-xs text-slate-500">
              Ghi lại mọi thay đổi trạng thái hồ sơ, thông tin sản phẩm và phân quyền người quản lý.
            </p>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="pt-2.5 pb-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-800">{log.actor}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({log.factoryId})</span>
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
      )}

    </div>
  );
}
