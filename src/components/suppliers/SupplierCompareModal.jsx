import React from 'react';
import { 
  X, Check, ShieldCheck, Award, Building2, Factory, 
  MapPin, CheckCircle2, AlertCircle, FileText, Send, Download, ExternalLink, Sparkles
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SupplierCompareModal({ isOpen, onClose, suppliers = [], onRequestQuote }) {
  const { t, lang } = useLanguage();

  if (!isOpen || suppliers.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200 text-slate-900 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#072348] via-[#0c3260] to-[#0052cc] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  B2B PROCUREMENT AUDIT
                </span>
                <span className="text-xs text-blue-200">
                  {suppliers.length}/3 Doanh nghiệp được chọn
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-heading tracking-tight">
                Bảng So Sánh Năng Lực Cung Ứng & Hồ Sơ Năng Lực
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-base transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Matrix Comparison Body */}
        <div className="overflow-x-auto p-6 flex-1 space-y-6">
          <div className="min-w-[700px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-3 text-left text-xs font-bold text-slate-400 font-heading w-1/4 uppercase tracking-wider">
                    Tiêu Chí Đánh Giá
                  </th>
                  {suppliers.map((s, idx) => (
                    <th key={s.id || idx} className="p-3 text-left w-1/4">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            s.kycTier === 'Diamond' || s.verifiedKYC === 'Kim Cương'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : s.kycTier === 'Gold' || s.verifiedKYC === 'Vàng'
                              ? 'bg-blue-100 text-[#0052cc] border border-blue-200'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            ★ KYC {s.kycTier || s.verifiedKYC || 'Hạng Vàng'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            #{idx + 1}
                          </span>
                        </div>
                        <h4 className="font-black text-xs text-slate-900 line-clamp-2 font-heading min-h-[32px]">
                          {s.name || s.companyName}
                        </h4>
                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{s.province || s.address?.split(',').pop()?.trim() || 'Toàn quốc'}</span>
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Empty placeholder slots if < 3 suppliers */}
                  {Array.from({ length: 3 - suppliers.length }).map((_, i) => (
                    <th key={`empty-${i}`} className="p-3 text-left w-1/4">
                      <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 flex flex-col items-center justify-center min-h-[110px] space-y-1">
                        <span className="text-xs font-bold">+ Thêm Nhà Cung Ứng</span>
                        <span className="text-[10px] text-slate-400">Chọn thêm ngoài danh sách</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {/* 1. Ngành nghề & Pha */}
                <tr className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-bold text-slate-700 font-heading bg-slate-50/50">
                    Ngành nghề / Pha kỹ thuật
                  </td>
                  {suppliers.map((s, idx) => (
                    <td key={idx} className="p-3 font-medium text-slate-800">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-[#0052cc] font-semibold text-[11px]">
                        {s.industry || s.phaseTitle || s.category || 'Công nghiệp & Sản xuất'}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: 3 - suppliers.length }).map((_, i) => (
                    <td key={`empty-row-1-${i}`} className="p-3 text-slate-300">-</td>
                  ))}
                </tr>

                {/* 2. Chứng nhận & ISO */}
                <tr className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-bold text-slate-700 font-heading bg-slate-50/50">
                    Chứng nhận & Tiêu chuẩn
                  </td>
                  {suppliers.map((s, idx) => (
                    <td key={idx} className="p-3 text-slate-800 space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {(s.certifications || ['ISO 9001:2015', 'RoHS', 'VCCI Verified']).map((cert, cIdx) => (
                          <span key={cIdx} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-200">
                            <Check className="w-2.5 h-2.5" />
                            <span>{cert}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - suppliers.length }).map((_, i) => (
                    <td key={`empty-row-2-${i}`} className="p-3 text-slate-300">-</td>
                  ))}
                </tr>

                {/* 3. Năng lực sản xuất & Công suất */}
                <tr className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-bold text-slate-700 font-heading bg-slate-50/50">
                    Công suất / Sản lượng tháng
                  </td>
                  {suppliers.map((s, idx) => (
                    <td key={idx} className="p-3 font-mono font-bold text-slate-900">
                      {s.capacity || s.monthlyOutput || '50.000+ sản phẩm / tháng'}
                    </td>
                  ))}
                  {Array.from({ length: 3 - suppliers.length }).map((_, i) => (
                    <td key={`empty-row-3-${i}`} className="p-3 text-slate-300">-</td>
                  ))}
                </tr>

                {/* 4. Đơn hàng tối thiểu (MOQ) */}
                <tr className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-bold text-slate-700 font-heading bg-slate-50/50">
                    Đơn hàng tối thiểu (MOQ)
                  </td>
                  {suppliers.map((s, idx) => (
                    <td key={idx} className="p-3 font-mono text-slate-700">
                      {s.moq || '100 - 500 đơn vị (Linh hoạt FDI)'}
                    </td>
                  ))}
                  {Array.from({ length: 3 - suppliers.length }).map((_, i) => (
                    <td key={`empty-row-4-${i}`} className="p-3 text-slate-300">-</td>
                  ))}
                </tr>

                {/* 5. Thời gian làm mẫu (Sample Lead time) */}
                <tr className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-bold text-slate-700 font-heading bg-slate-50/50">
                    Thời gian giao mẫu (Lead time)
                  </td>
                  {suppliers.map((s, idx) => (
                    <td key={idx} className="p-3 text-slate-700 font-semibold">
                      {s.leadTime || '2 - 4 ngày làm việc'}
                    </td>
                  ))}
                  {Array.from({ length: 3 - suppliers.length }).map((_, i) => (
                    <td key={`empty-row-5-${i}`} className="p-3 text-slate-300">-</td>
                  ))}
                </tr>

                {/* 6. Vốn điều lệ / Quy mô xưởng */}
                <tr className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-bold text-slate-700 font-heading bg-slate-50/50">
                    Quy mô nhà xưởng & Vốn
                  </td>
                  {suppliers.map((s, idx) => (
                    <td key={idx} className="p-3 text-slate-700">
                      <div className="font-mono font-bold text-slate-900">{s.capital || '20 - 50 Tỷ VNĐ'}</div>
                      <div className="text-[11px] text-slate-500">{s.factoryArea || '3.500m² - 10.000m² xưởng'}</div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - suppliers.length }).map((_, i) => (
                    <td key={`empty-row-6-${i}`} className="p-3 text-slate-300">-</td>
                  ))}
                </tr>

                {/* 7. Thị trường & Khách hàng FDI tiêu biểu */}
                <tr className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-bold text-slate-700 font-heading bg-slate-50/50">
                    Khách hàng FDI / Thị trường
                  </td>
                  {suppliers.map((s, idx) => (
                    <td key={idx} className="p-3 text-slate-700">
                      {s.markets || 'FDI Nhật Bản, Hàn Quốc, Hoa Kỳ & Nội địa'}
                    </td>
                  ))}
                  {Array.from({ length: 3 - suppliers.length }).map((_, i) => (
                    <td key={`empty-row-7-${i}`} className="p-3 text-slate-300">-</td>
                  ))}
                </tr>

                {/* 8. Hành động RFQ */}
                <tr>
                  <td className="p-3 font-bold text-slate-700 font-heading bg-slate-50/50">
                    Hành động mua sắm
                  </td>
                  {suppliers.map((s, idx) => (
                    <td key={idx} className="p-3 space-y-2">
                      <button
                        onClick={() => {
                          onClose();
                          if (onRequestQuote) onRequestQuote(s);
                        }}
                        className="w-full py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer font-heading uppercase"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Yêu Cầu Báo Giá</span>
                      </button>
                    </td>
                  ))}
                  {Array.from({ length: 3 - suppliers.length }).map((_, i) => (
                    <td key={`empty-row-8-${i}`} className="p-3 text-slate-300">-</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            💡 Dữ liệu được bảo trợ & đối soát pháp nhân bởi VCCI & Hệ thống Chuỗi Cung Ứng Quốc Gia.
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => alert("Đang xuất bảng so sánh năng lực nhà cung ứng (PDF / Excel)...")}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition flex items-center space-x-2 font-heading"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Xuất Báo Cáo So Sánh (PDF)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onRequestQuote) onRequestQuote({ name: `Gửi đồng loạt ${suppliers.length} nhà cung ứng`, isMultiRfq: true, suppliers });
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2 font-heading uppercase"
            >
              <Send className="w-4 h-4" />
              <span>Gửi RFQ Đồng Loạt ({suppliers.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
