import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, MapPin, Building2, Sparkles } from 'lucide-react';

export default function KcnBrochureModal({ isOpen, onClose, kcn, logisticsInfo }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen || !kcn) return null;

  const handleDownload = (fileType) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-blue-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold font-mono uppercase mb-2 border border-blue-400/30">
            <FileText className="w-3.5 h-3.5" />
            <span>HỒ SƠ PHÁP LÝ & QUY HOẠCH 1/2000 CHÍNH THỨC</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
            Tải Hồ Sơ Quy Hoạch: {kcn.name}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            📍 {kcn.location || kcn.province} • Phê duyệt bởi Bộ Kế Hoạch & Đầu Tư
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Quy chuẩn hồ sơ tải về:</span>
              <span className="text-[#0052cc] font-mono">PDF + CAD File (Vector GIS)</span>
            </div>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li>Bản đồ quy hoạch phân khu 1/2000 & phân lô mặt bằng chi tiết.</li>
              <li>Bảng giá thuê đất, phí hạ tầng & biểu giá điện trung thế/nước sạch.</li>
              <li>Quyết định phê duyệt ĐTM môi trường & Nghiệm thu thẩm duyệt PCCC.</li>
              <li>Chính sách ưu đãi thuế TNDN (Miễn 2 năm, giảm 50% trong 4 năm tiếp theo).</li>
            </ul>
          </div>

          {downloaded ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <strong className="block text-sm font-bold">Hồ sơ đã được khởi tạo thành công!</strong>
              <p className="text-slate-600 text-[11px]">
                File brochure quy hoạch đã được tải về máy của bạn. Đội ngũ tư vấn đầu tư CCU luôn sẵn sàng hỗ trợ các thủ tục IRC/ERC tiếp theo.
              </p>
            </div>
          ) : null}

          {/* Download Action Options */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => handleDownload('masterplan')}
              disabled={downloading}
              className="w-full p-3.5 bg-gradient-to-r from-[#003d8f] to-[#0052cc] hover:from-[#002f70] hover:to-[#0041a3] text-white rounded-2xl font-bold text-xs flex items-center justify-between transition shadow-md cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center space-x-2.5 text-left">
                <Download className="w-4 h-4 text-amber-300 shrink-0" />
                <div>
                  <div className="font-heading uppercase font-bold">Tải Trọn Bộ Brochure & Bản Đồ Quy Hoạch (PDF - 18.5 MB)</div>
                  <div className="text-[10px] text-blue-200 font-normal">Cập nhật Q3/2026 • Đầy đủ chỉ giới xây dựng & cao độ</div>
                </div>
              </div>
              <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded-md font-bold shrink-0">
                {downloading ? 'Đang tạo...' : 'Tải ngay'}
              </span>
            </button>

            <button
              onClick={() => handleDownload('cad')}
              disabled={downloading}
              className="w-full p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-xs flex items-center justify-between transition border border-slate-200 cursor-pointer"
            >
              <div className="flex items-center space-x-2 text-left">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Tải File Bản Vẽ Hạ Tầng Kỹ Thuật (AutoCAD .DWG / GIS Shapefile)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">6.2 MB</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium underline"
            >
              Đóng cửa sổ
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
