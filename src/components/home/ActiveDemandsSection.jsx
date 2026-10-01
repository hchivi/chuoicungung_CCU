import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Clock, ArrowRight, ShieldAlert, Cpu, Sparkles, CheckCircle2, Building2 } from 'lucide-react';

// B2B Demand Card Item Component
function DemandCardItem({ demand }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl hover:border-blue-400 transition-all duration-200 flex flex-col justify-between space-y-4 group relative w-full">
      <div className="space-y-3.5">
        
        {/* Mã & Trạng thái đang tìm nguồn */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/70">
            {demand.code}
          </span>
          
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{demand.status}</span>
          </span>
        </div>

        {/* Sản phẩm hoặc dịch vụ cần tìm */}
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Sản phẩm / Dịch vụ cần tìm:
          </span>
          <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-[#0052cc] font-heading leading-snug line-clamp-2 transition-colors">
            {demand.productName}
          </h3>
        </div>

        {/* Chi tiết: Quy mô, Địa bàn, Thời hạn */}
        <div className="space-y-2 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100">
          
          {/* Số lượng hoặc quy mô */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-500">Số lượng / Quy mô:</span>
            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded text-xs sm:text-sm">
              {demand.quantity}
            </span>
          </div>

          {/* Địa bàn giao hàng */}
          <div className="flex items-start gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1"><strong>Giao tại:</strong> {demand.location}</span>
          </div>

          {/* Thời hạn phản hồi */}
          <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-[13px]">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong>Hạn phản hồi:</strong> {demand.deadline}</span>
          </div>

          {/* Yêu cầu kỹ thuật nổi bật */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700 space-y-1">
            <span className="font-bold text-slate-800 font-mono block text-[11px] uppercase text-blue-700">
              Yêu cầu kỹ thuật nổi bật:
            </span>
            <p className="line-clamp-2 leading-relaxed">
              {demand.technicalHighlight}
            </p>
          </div>

        </div>

      </div>

      {/* CTA Xem nhu cầu */}
      <div className="pt-2 border-t border-slate-100">
        <Link
          to={demand.detailUrl}
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-[#0052cc] hover:text-white text-slate-900 rounded-xl text-xs sm:text-sm font-bold font-heading transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-2xs group-hover:bg-[#0052cc] group-hover:text-white"
        >
          <span>Xem nhu cầu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

// Single Infinite Scrolling Column
export const DemandsColumn = ({ className = '', demands = [], duration = 20 }) => {
  return (
    <div className={`w-full max-w-sm flex-1 ${className}`}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {demands.map((demand, i) => (
                <DemandCardItem demand={demand} key={`${index}-${i}`} />
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export default function ActiveDemandsSection() {
  // Dữ liệu nhu cầu thực tế phân bổ thành 3 cột chạy mượt mà
  const column1Demands = [
    {
      code: "NC-2026-00125",
      productName: "Đồng phục công nhân & Áo polo kỹ thuật",
      quantity: "500 bộ",
      location: "Đồng Nai (KCN Amata, TP. Biên Hòa)",
      deadline: "Trước 15/11/2026",
      technicalHighlight: "Vải Kaki 65/35 chống nhăn, may 2 kim bền chắc, cung cấp mẫu thử đối chứng",
      status: "Đang tìm nguồn",
      detailUrl: "/san-nhu-cau/NC-2026-00125"
    },
    {
      code: "NC-2026-00135",
      productName: "Khảo sát & Lắp đặt hệ thống lọc bụi túi vải",
      quantity: "Nhà xưởng 3.000 m²",
      location: "Bình Phước (KCN Minh Hưng)",
      deadline: "Trước 20/11/2026",
      technicalHighlight: "Hiệu suất lọc bụi ≥ 99.5%, nồng độ khí thải sau lọc đạt chuẩn QCVN",
      status: "Đang tìm nguồn",
      detailUrl: "/san-nhu-cau/NC-2026-00135"
    },
    {
      code: "NC-2026-00148",
      productName: "Hiệu chuẩn cân điện tử & thiết bị đo phòng Lab",
      quantity: "45 thiết bị",
      location: "TP. Hồ Chí Minh (KCN Tân Bình)",
      deadline: "Trước 10/11/2026",
      technicalHighlight: "Chứng nhận ISO/IEC 17025, cấp tem & biên bản hiệu chuẩn đầy đủ",
      status: "Đang tìm nguồn",
      detailUrl: "/san-nhu-cau"
    }
  ];

  const column2Demands = [
    {
      code: "NC-2026-00128",
      productName: "Gia công chi tiết máy CNC & Nhôm Anode",
      quantity: "10.000 chi tiết",
      location: "Bình Dương (KCN VSIP 1)",
      deadline: "Trước 30/10/2026",
      technicalHighlight: "Dung sai cơ khí ±0.01mm, bề mặt xi mạ Anode đạt tiêu chuẩn xuất khẩu",
      status: "Đang tìm nguồn",
      detailUrl: "/san-nhu-cau/NC-2026-00128"
    },
    {
      code: "NC-2026-00140",
      productName: "Hộp quà tết công nhân viên cao cấp",
      quantity: "300 suất",
      location: "TP. Hồ Chí Minh",
      deadline: "Trước 12/11/2026",
      technicalHighlight: "Bao bì ép kim logo doanh nghiệp, cam kết hạn sử dụng trên 12 tháng",
      status: "Đang tìm nguồn",
      detailUrl: "/san-nhu-cau"
    },
    {
      code: "NC-2026-00152",
      productName: "Gia công khuôn ép nhựa khay linh kiện điện tử",
      quantity: "2 bộ khuôn",
      location: "Bắc Ninh (KCN Quế Võ)",
      deadline: "Trước 25/11/2026",
      technicalHighlight: "Thép NAK80 chống mài mòn, chu kỳ ép đạt chuẩn tự động hóa",
      status: "Đang tìm nguồn",
      detailUrl: "/san-nhu-cau"
    }
  ];

  const column3Demands = [
    {
      code: "NC-2026-00132",
      productName: "Thùng carton 5 lớp sóng BC in Flexo",
      quantity: "20.000 thùng/tháng",
      location: "Long An (KCN Long Hậu)",
      deadline: "Trước 05/11/2026",
      technicalHighlight: "Độ bục chịu lực cao >14 kgf/cm², in Flexo 2 màu, giao định kỳ hàng tuần",
      status: "Đang tìm nguồn",
      detailUrl: "/san-nhu-cau/NC-2026-00132"
    },
    {
      code: "NC-2026-00145",
      productName: "Pallet gỗ tràm khử trùng ISPM 15",
      quantity: "1.500 pallet/tháng",
      location: "Bình Dương (KCN Sóng Thần)",
      deadline: "Trước 18/11/2026",
      technicalHighlight: "Hun trùng nhiệt HT đạt chuẩn xuất khẩu đi Châu Âu và Bắc Mỹ",
      status: "Đang tìm nguồn",
      detailUrl: "/san-nhu-cau"
    },
    {
      code: "NC-2026-00156",
      productName: "Dịch vụ suất ăn công nghiệp tiêu chuẩn HACCP",
      quantity: "1.200 suất/ngày",
      location: "Đồng Nai (KCN Nhơn Trạch)",
      deadline: "Trước 01/12/2026",
      technicalHighlight: "Kiểm nghiệm vi sinh định kỳ, lưu mẫu thực phẩm 24h theo quy định",
      status: "Đang tìm nguồn",
      detailUrl: "/san-nhu-cau"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Section Header (Centered, Strictly 1 Line Title) */}
      <div className="text-center max-w-5xl mx-auto space-y-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-4xl font-black text-slate-950 uppercase font-heading tracking-tight text-center leading-tight whitespace-normal md:whitespace-nowrap">
          Nhu cầu doanh nghiệp đang tìm nguồn
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto text-center leading-relaxed font-normal">
          Các nhu cầu mua hàng và tìm đối tác đã được xác thực công khai trên CHUOICUNGUNG.COM.
        </p>

        <div className="pt-1">
          <Link
            to="/san-nhu-cau"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0052cc] hover:text-[#0041a8] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition font-heading shadow-2xs"
          >
            <span>Xem tất cả nhu cầu đang mở</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Demand Cards Infinite Scrolling Columns (Mẫu Testimonials Column) */}
      <div 
        className="flex justify-center gap-5 sm:gap-6 pt-2 max-h-[640px] sm:max-h-[680px] overflow-hidden relative"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)'
        }}
      >
        <DemandsColumn demands={column1Demands} duration={26} />
        <DemandsColumn demands={column2Demands} className="hidden md:block" duration={32} />
        <DemandsColumn demands={column3Demands} className="hidden lg:block" duration={28} />
      </div>

    </section>
  );
}
