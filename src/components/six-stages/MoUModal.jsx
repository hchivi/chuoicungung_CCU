import React from 'react';
import { X, ShieldCheck, Landmark, FileText, CheckCircle2, Award, Download } from 'lucide-react';

export default function MoUModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#072348] via-[#0b3b70] to-[#072348] text-white p-5 sm:p-6 flex items-center justify-between border-b border-blue-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md flex-shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10.5px] font-black uppercase tracking-wider text-amber-400 font-heading">
                VĂN BẢN ĐỊNH HƯỚNG & THỎA THUẬN BẢO TRỢ CHUYÊN MÔN
              </div>
              <h3 className="text-base sm:text-lg font-black font-heading leading-tight">
                Biên Bản Ghi Nhớ Hợp Tác Đề Án Quốc Gia (MoU)
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Simulated Legal Scan */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-slate-800 text-xs sm:text-sm leading-relaxed">
          
          {/* Header of the Official Document */}
          <div className="text-center space-y-1 border-b border-slate-200 pb-4">
            <div className="font-extrabold uppercase text-xs text-slate-900 font-heading">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </div>
            <div className="text-[11px] font-semibold text-slate-600">
              Độc lập – Tự do – Hạnh phúc
            </div>
            <div className="text-[11px] text-slate-400 italic pt-1">
              Hà Nội, ngày 15 tháng 01 năm 2026
            </div>
            <div className="text-base sm:text-lg font-black uppercase text-[#072348] font-heading pt-2">
              THỎA THUẬN NGUYÊN TẮC VỀ BẢO TRỢ & ĐỊNH HƯỚNG CHUYÊN MÔN
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Đề án: "Chuỗi Cung Ứng Công Nghiệp Hỗ Trợ Quốc Gia – ChuoiCungUng.com"
            </div>
          </div>

          {/* Key Signatories & Endorsement clauses */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-2">
              <div className="font-extrabold text-[#072348] uppercase font-heading flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Các Bên Ký Kết & Bảo Trợ:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                <li><strong>VCCI:</strong> Liên đoàn Thương mại và Công nghiệp Việt Nam – Ban Chỉ đạo Hỗ trợ Doanh nghiệp.</li>
                <li><strong>VIDE:</strong> Viện Phát triển Kinh tế & Số hóa Doanh nghiệp.</li>
                <li><strong>VAMI & VASI:</strong> Hiệp hội Cơ khí & Hiệp hội Công nghiệp Hỗ trợ Việt Nam.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-900">Mục đích & Nội dung Định hướng:</div>
              <p className="text-slate-600">
                1. Thống nhất áp dụng hệ thống phân tầng <strong>6 Giai đoạn và 18 Pha kỹ thuật</strong> làm tiêu chuẩn định vị chuỗi cung ứng công nghiệp hỗ trợ tại các Khu công nghiệp Việt Nam.
              </p>
              <p className="text-slate-600">
                2. Thiết lập quy trình <strong>Xác thực 3 Lớp (KYC B2B)</strong> nhằm phân loại minh bạch hồ sơ năng lực doanh nghiệp, tạo cầu nối tin cậy cho dòng vốn đầu tư FDI.
              </p>
              <p className="text-slate-600">
                3. Cam kết đồng hành tổ chức các phiên xúc tiến thương mại, kết nối dữ liệu nhà cung ứng trên toàn bộ 34 tỉnh thành.
              </p>
            </div>
          </div>

          {/* Simulated Red Stamp & Signatures */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-6 text-center">
            <div className="space-y-1">
              <div className="font-extrabold text-slate-800 uppercase text-[11px] font-heading">
                ĐẠI DIỆN HỘI ĐỒNG BẢO TRỢ
              </div>
              <div className="text-[11px] text-slate-500 italic">(Đã ký & đóng dấu mộc đỏ)</div>
              <div className="h-16 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-red-500/80 text-red-600 flex items-center justify-center font-bold text-[9px] uppercase rotate-[-12deg] shadow-xs">
                  VCCI CERTIFIED
                </div>
              </div>
              <div className="font-bold text-slate-900 text-xs">VCCI / VIDE Council</div>
            </div>

            <div className="space-y-1">
              <div className="font-extrabold text-slate-800 uppercase text-[11px] font-heading">
                BAN ĐIỀU HÀNH ĐỀ ÁN
              </div>
              <div className="text-[11px] text-slate-500 italic">(Đã ký & đóng dấu)</div>
              <div className="h-16 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-600/80 text-blue-700 flex items-center justify-center font-bold text-[9px] uppercase rotate-[8deg] shadow-xs">
                  CHUOICUNGUNG.COM
                </div>
              </div>
              <div className="font-bold text-slate-900 text-xs">ChuoiCungUng.vn</div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Văn bản lưu chiểu số: <strong className="font-mono text-slate-700">MoU-VCCI-VIDE-2026/01</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#072348] hover:bg-blue-800 text-white font-bold text-xs font-heading uppercase transition"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
}
