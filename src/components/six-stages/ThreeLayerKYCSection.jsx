import React from 'react';
import { 
  ShieldCheck, Award, CheckCircle2, FileCheck2, 
  Cpu, Building2, Landmark, Sparkles, ArrowRight, ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ThreeLayerKYCSection() {
  const kycLayers = [
    {
      level: 'LỚP 1',
      badgeTitle: 'Huy hiệu Bạc 🥈',
      badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
      title: 'Xác Thực Danh Tính & Pháp Lý',
      subtitle: 'Đảm bảo doanh nghiệp có thật, hoạt động hợp pháp và người đại diện đúng thẩm quyền.',
      requirements: [
        'Giấy phép Đăng ký Kinh doanh (GPKD) mới nhất',
        'CCCD gắn chip của Người đại diện pháp luật',
        'Mẫu chữ ký số (Token / CA) xác thực e-Sign',
        'Đối chiếu tự động trạng thái thuế & Đăng ký KD'
      ],
      connectedGateways: 'Cổng ĐKKD Quốc Gia • Tổng Cục Thuế • VNPT/Viettel CA',
      icon: FileCheck2,
      accentColor: 'from-slate-600 to-slate-800',
      borderHover: 'hover:border-slate-400'
    },
    {
      level: 'LỚP 2',
      badgeTitle: 'Huy hiệu Vàng 🥇',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      title: 'Xác Thực Năng Lực & Quản Trị',
      subtitle: 'Chứng minh đủ năng lực sản xuất quy mô công nghiệp, có hệ thống quản trị hiện đại.',
      requirements: [
        'Chứng chỉ Tiêu chuẩn Quốc tế (ISO 9001/14001, HACCP...)',
        'Hồ sơ năng lực chuẩn hóa phân rã theo 18 Pha',
        'Kết nối API với hệ thống ERP quản trị (SAP, Oracle, Base...)',
        'Minh chứng hợp đồng B2B / FDI đã từng cung ứng'
      ],
      connectedGateways: 'Cổng API ERP/SAP • BoA • SGS / TÜV / BSI ISO Database',
      icon: Cpu,
      accentColor: 'from-amber-500 to-amber-700',
      borderHover: 'hover:border-amber-400'
    },
    {
      level: 'LỚP 3',
      badgeTitle: 'Huy hiệu Kim Cương 💎',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      title: 'Bảo Chứng Thực Địa & Hiệp Hội',
      subtitle: 'Đẳng cấp bảo chứng kép cao nhất từ thực địa nhà máy và tổ chức liên ngành.',
      requirements: [
        'Chứng nhận hội viên chính thức từ VCCI, HUBA, BNI...',
        'Báo cáo Đánh giá Thực địa (Factory Audit Report) trực tiếp',
        'Thư giới thiệu & đánh giá từ ít nhất 1 nhà máy FDI đối tác',
        'Xác nhận hạn mức tín dụng tài chính sản xuất'
      ],
      connectedGateways: 'VCCI Member Directory • Hệ thống Kiểm toán Độc Lập • BNI Connect',
      icon: Landmark,
      accentColor: 'from-blue-600 to-indigo-800',
      borderHover: 'hover:border-blue-500'
    }
  ];

  return (
    <section className="font-sans space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#072348] text-[11px] font-extrabold uppercase tracking-wider font-heading">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Chuẩn Mực Đánh Giá FDI Quốc Tế</span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#072348] uppercase font-heading tracking-tight mt-1.5">
            Quy Trình Xác Thực 3 Lớp (KYC B2B)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md text-left md:text-right font-medium">
          Mỗi doanh nghiệp trên bản đồ đều được thẩm định qua 3 màng lọc khắt khe trước khi cấp quyền khớp lệnh FDI.
        </p>
      </div>

      {/* 3 KYC Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {kycLayers.map((layer, idx) => {
          const IconComponent = layer.icon;
          return (
            <div
              key={idx}
              className={`rounded-3xl bg-white border-2 border-slate-200/90 ${layer.borderHover} shadow-md hover:shadow-2xl transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between space-y-5 relative overflow-hidden group hover:-translate-y-1`}
            >
              <div className="space-y-4">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-white uppercase">
                    {layer.level}
                  </span>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${layer.badgeColor} font-heading`}>
                    {layer.badgeTitle}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${layer.accentColor} text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform flex-shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#072348] uppercase font-heading leading-snug">
                      {layer.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {layer.subtitle}
                  </p>
                </div>

                {/* Requirements checklist */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider font-heading">
                    Tiêu Chí & Giấy Tờ Yêu Cầu:
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {layer.requirements.map((req, rIdx) => (
                      <li key={rIdx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Gateway connections note */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="text-[10.5px] text-slate-400 font-semibold">
                  Cổng kết nối: <span className="text-slate-600 font-bold">{layer.connectedGateways}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
