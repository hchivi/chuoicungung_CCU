import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Globe, 
  QrCode, 
  ExternalLink, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Download, 
  Layers, 
  Sparkles,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { trackCatalogueQrScan } from '../../data/cataloguesData';

export default function CatalogueOnlineViewerModal({ 
  isOpen, 
  onClose, 
  catalogue 
}) {
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(0);

  if (!isOpen || !catalogue) return null;

  const currentEdition = (catalogue.editions || []).find(e => e.id === catalogue.currentEditionId) || catalogue.editions?.[0];
  const approvedEntries = (currentEdition?.entries || []).filter(e => e.approvalStatus === 'APPROVED');
  const activeEntry = approvedEntries[selectedEntryIndex] || approvedEntries[0];

  const handleSimulatedScan = (entry) => {
    trackCatalogueQrScan(catalogue.id, currentEdition?.id, entry?.id);
    alert(`[MÔ PHỎNG QUÉT MÃ QR]\n\nĐã ghi nhận sự kiện quét QR với ngữ cảnh:\n• Catalogue: ${catalogue.title}\n• Ấn bản: ${currentEdition?.editionCode}\n• Doanh nghiệp: ${entry.organizationName}\n\nQuy tắc hệ thống: "Quét mã QR chỉ dẫn về hồ sơ số đang cập nhật, KHÔNG tự động coi là Nhu cầu Mua hàng (Buyer Need)."`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* 1. Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.2 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold font-mono uppercase">
                  {currentEdition?.editionCode || 'DIGITAL EDITION'}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Bản số xem trước trực tuyến
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate font-heading">
                {catalogue.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {currentEdition?.fileUrl && (
              <a
                href={currentEdition.fileUrl}
                download
                className="hidden sm:inline-flex items-center space-x-1.5 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải PDF</span>
              </a>
            )}
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Educational Philosophy Bar (Section 16 & 40) */}
        <div className="p-3 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900 px-4 sm:px-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="font-bold">Quy tắc Chuỗi Cung Ứng: </span>
            <span className="text-[11.5px] text-blue-800">
              Catalogue là cầu nối từ ấn phẩm tĩnh về hồ sơ số đang cập nhật. Quét QR luôn dẫn tới hồ sơ trực tuyến mới nhất.
            </span>
          </div>
          <span className="hidden md:inline text-[10.5px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-blue-200">
            QR Scan ≠ Buyer Need
          </span>
        </div>

        {/* 3. Modal Body: 2 Columns */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Approved Companies List */}
          <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-3 sm:p-4 overflow-y-auto max-h-[300px] md:max-h-none space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 flex items-center justify-between">
              <span>Hồ sơ đã duyệt ({approvedEntries.length})</span>
              <span className="text-emerald-700 font-bold">100% KYC</span>
            </div>

            <div className="space-y-1.5">
              {approvedEntries.map((entry, idx) => (
                <button
                  key={entry.id || idx}
                  onClick={() => setSelectedEntryIndex(idx)}
                  className={`w-full p-3 rounded-2xl text-left transition border cursor-pointer flex items-start space-x-2.5 ${
                    selectedEntryIndex === idx
                      ? 'bg-white border-[#0052cc] shadow-md ring-2 ring-blue-100'
                      : 'bg-white/60 hover:bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    selectedEntryIndex === idx ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {entry.position || idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {entry.organizationName}
                    </div>
                    {entry.sponsorLabel && (
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9.5px] font-black uppercase">
                        {entry.sponsorLabel}
                      </span>
                    )}
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {entry.contentSnapshot?.address || 'Việt Nam'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Digital Profile Snapshot (Section 16) */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">
            {activeEntry ? (
              <div className="space-y-4">
                
                {/* Header of Active Entry */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
                        Vị trí trang #{activeEntry.position || selectedEntryIndex + 1}
                      </span>
                      {activeEntry.sponsorLabel && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10.5px] font-bold uppercase tracking-wider">
                          {activeEntry.sponsorLabel}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                      {activeEntry.organizationName}
                    </h3>
                  </div>

                  {/* Section 16 Dates Comparison */}
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                    <div>
                      <Calendar className="w-3 h-3 inline mr-1 text-slate-400" />
                      <span>Ngày in ấn: <strong>{currentEdition?.publicationDate}</strong></span>
                    </div>
                    <div>
                      <Clock className="w-3 h-3 inline mr-1 text-emerald-600" />
                      <span>Hồ sơ trực tuyến cập nhật: <strong>{activeEntry.profileLastUpdatedAt ? new Date(activeEntry.profileLastUpdatedAt).toLocaleDateString('vi-VN') : 'Mới nhất'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Entry Title & Summary */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-800">
                    {activeEntry.contentSnapshot?.title || activeEntry.organizationName}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    {activeEntry.contentSnapshot?.summary || 'Hồ sơ năng lực nhà cung ứng đã được thẩm định và đối chiếu dữ liệu xưởng sản xuất thực tế.'}
                  </p>
                </div>

                {/* Key Capabilities */}
                {activeEntry.contentSnapshot?.keyCapabilities?.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700">Năng lực sản xuất & Quy chuẩn tiêu biểu:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeEntry.contentSnapshot.keyCapabilities.map((cap, cIdx) => (
                        <span key={cIdx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                          ✓ {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Simulated QR Code & Direct Link Box (Section 17 & 18) */}
                <div className="p-4 bg-gradient-to-r from-slate-900 to-[#072847] rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-16 h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md">
                      <QrCode className="w-full h-full text-slate-900" />
                    </div>
                    <div className="space-y-0.5 text-center sm:text-left">
                      <div className="text-xs font-bold text-amber-300 uppercase tracking-wider font-heading">
                        Mã QR Định Danh Ổn Định
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Quét mã trên bản in để mở hồ sơ số có chứng thực trực tiếp
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">
                        tracking: {catalogue.id} / {currentEdition?.editionCode}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleSimulatedScan(activeEntry)}
                      type="button"
                      className="flex-1 sm:flex-initial py-2 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Thử quét mã</span>
                    </button>
                    
                    <Link
                      to={activeEntry.canonicalUrl || `/doanh-nghiep/${activeEntry.organizationId}`}
                      className="flex-1 sm:flex-initial py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <span>Mở Hồ Sơ Số</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Chưa có dữ liệu chi tiết cho ấn bản này.
              </div>
            )}
          </div>

        </div>

        {/* 4. Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 px-4 sm:px-6">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-[11px]">
              Dữ liệu hiển thị dựa trên hồ sơ đã duyệt của ấn phẩm. Truy cập hồ sơ số để cập nhật năng lực, báo giá và kiểm tra chứng chỉ còn hiệu lực.
            </span>
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
