import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Building2, MapPin, Zap, CheckCircle2, Factory, ShieldCheck, ArrowRight, Info, Award, Calendar 
} from 'lucide-react';

function SupplierCardItem({ supp }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl hover:border-blue-400 transition-all duration-200 flex flex-col justify-between space-y-4 group relative w-full">
      <div className="space-y-3.5">
        
        {/* Mã NCC & Trạng thái đã đối chiếu */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/70">
            {supp.code || `NCC-2026-${supp.id.replace('ncc-', '00')}`}
          </span>
          
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{supp.status}</span>
          </span>
        </div>

        {/* Tên doanh nghiệp & Năng lực */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Doanh nghiệp sản xuất / Cung ứng:
          </span>
          <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-[#0052cc] font-heading leading-snug line-clamp-2 transition-colors">
            {supp.name}
          </h3>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {supp.capabilities.map((cap, cIdx) => (
              <span key={cIdx} className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-100">
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* Chi tiết: Quy mô, Địa bàn, Nhà máy */}
        <div className="space-y-2 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100">
          
          {/* Quy mô đơn hàng phù hợp */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-500">Quy mô tiếp nhận:</span>
            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded text-xs sm:text-sm text-right">
              {supp.orderScale}
            </span>
          </div>

          {/* Địa bàn phục vụ */}
          <div className="flex items-start gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1"><strong>Địa bàn:</strong> {supp.serviceArea}</span>
          </div>

          {/* Nhà máy & Thiết bị */}
          {supp.factoryEquipment && (
            <div className="flex items-start gap-2 text-slate-600">
              <Factory className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2"><strong>Cơ sở & Thiết bị:</strong> {supp.factoryEquipment}</span>
            </div>
          )}

          {/* Chứng nhận và nguồn xác minh */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700 space-y-1.5 mt-1">
            <span className="font-bold text-slate-800 font-mono block text-[11px] uppercase text-blue-700">
              Chứng nhận & Kiểm định xác minh:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {supp.certifications.map((cert, certIdx) => (
                <span key={certIdx} className="px-2 py-0.5 rounded bg-white text-slate-700 text-xs font-mono font-bold border border-slate-200 shadow-2xs">
                  {cert}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* CTA Xem năng lực */}
      <div className="pt-2 border-t border-slate-100">
        <Link
          to="/nha-cung-ung"
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-[#0052cc] hover:text-white text-slate-900 rounded-xl text-xs sm:text-sm font-bold font-heading transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-2xs group-hover:bg-[#0052cc] group-hover:text-white"
        >
          <span>Xem năng lực chi tiết</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

function SuppliersColumn({ className = '', suppliers = [], duration = 28 }) {
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
              {suppliers.map((supp, i) => (
                <SupplierCardItem supp={supp} key={`${index}-${i}`} />
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
}

export default function VerifiedSuppliersSection() {
  const column1Suppliers = [
    {
      id: "ncc-01",
      name: "Công ty May Mặc & Bảo Hộ Lao Động Tân Bình Minh",
      capabilities: ["Đồng phục công nhân", "Áo thun polo kỹ thuật", "PPE phòng sạch ESD"],
      serviceArea: "TP.HCM · Đồng Nai · Bình Dương",
      orderScale: "300 – 5.000 bộ/đơn hàng",
      factoryEquipment: "Xưởng may 1.800m², 120 máy may điện tử tự động Juki & Brother",
      certifications: ["ISO 9001:2015", "OEKO-TEX Standard 100", "Kiểm định Trung tâm 3"],
      updatedAt: "25/09/2026",
      status: "Đã đối chiếu",
      logo: "/images/icons/zalo-icon.png"
    },
    {
      id: "ncc-04",
      name: "Công ty TNHH Nhựa Kỹ Thuật Cao VinaPoly",
      capabilities: ["Khay nhựa chống tĩnh điện", "Gia công ép nhựa kỹ thuật", "Hộp blister định hình"],
      serviceArea: "Bình Dương · Đồng Nai · Long An",
      orderScale: "5.000 – 100.000 sản phẩm / tháng",
      factoryEquipment: "18 máy ép nhựa tự động Sumitomo & Fanuc từ 80T đến 350T",
      certifications: ["ISO 9001:2015", "RoHS", "REACH Compliant"],
      updatedAt: "28/09/2026",
      status: "Đã đối chiếu",
      logo: "/logo_only.png"
    },
    {
      id: "ncc-07",
      name: "Doanh nghiệp Xi Mạ & Xử Lý Bề Mặt Anode Thăng Long",
      capabilities: ["Anodizing nhôm cứng", "Mạ Niken hóa học", "Thụ động hóa bề mặt Inox"],
      serviceArea: "Hà Nội · Bắc Ninh · Hưng Yên",
      orderScale: "10.000 – 200.000 chi tiết / lô",
      factoryEquipment: "Dây chuyền mạ tự động khép kín theo tiêu chuẩn nước thải KCN",
      certifications: ["ISO 14001:2015", "Chứng nhận xuất khẩu FDI"],
      updatedAt: "24/09/2026",
      status: "Đã đối chiếu",
      logo: "/logo_only.png"
    }
  ];

  const column2Suppliers = [
    {
      id: "ncc-02",
      name: "Bao Bì Công Nghiệp Toàn Thắng",
      capabilities: ["Thùng carton 3-5-7 lớp sóng BC", "Pallet giấy", "Màng PE quấn hàng"],
      serviceArea: "Bình Dương · Đồng Nai · Long An",
      orderScale: "1.000 – 50.000 thùng/tháng",
      factoryEquipment: "Dây chuyền tạo sóng 1.8m, máy in Flexo 4 màu khổ lớn tại KCN VSIP 1",
      certifications: ["ISO 9001:2015", "FSC CoC Chain of Custody", "RoHS"],
      updatedAt: "22/09/2026",
      status: "Đã đối chiếu",
      logo: "/logo_only.png"
    },
    {
      id: "ncc-05",
      name: "Công ty TNHH Hóa Chất Công Nghiệp Nam Phát",
      capabilities: ["Dung môi tẩy rửa công nghiệp", "Dầu cắt gọt kim loại CNC", "Hóa chất xử lý nước thải"],
      serviceArea: "Đồng Nai · TP.HCM · Bà Rịa Vũng Tàu",
      orderScale: "500 lít – 20 tấn / đơn hàng",
      factoryEquipment: "Kho bồn chứa đạt chuẩn PCCC hóa chất và xe bồn chuyên dụng",
      certifications: ["ISO 9001:2015", "Giấy phép hóa chất công nghiệp"],
      updatedAt: "26/09/2026",
      status: "Đã đối chiếu",
      logo: "/logo_only.png"
    },
    {
      id: "ncc-08",
      name: "Trung Tâm Thử Nghiệm & Hiệu Chuẩn Quatest Tech",
      capabilities: ["Hiệu chuẩn thiết bị đo phòng Lab", "Thử nghiệm cơ lý vật liệu", "Kiểm định an toàn nồi hơi"],
      serviceArea: "TP.HCM · Bình Dương · Đồng Nai",
      orderScale: "Theo gói dự án hoặc hợp đồng định kỳ",
      factoryEquipment: "Phòng đo chuẩn cấp 2, máy kéo nén đa năng 100 tấn Shimadzu",
      certifications: ["ISO/IEC 17025", "Bộ KH&CN chỉ định"],
      updatedAt: "21/09/2026",
      status: "Đã đối chiếu",
      logo: "/logo_only.png"
    }
  ];

  const column3Suppliers = [
    {
      id: "ncc-03",
      name: "Cơ Khí Chính Xác & Khuôn Mẫu An Phát",
      capabilities: ["Gia công phay tiện CNC", "Đồ gá Jig hàn", "Dập uốn chi tiết kim loại"],
      serviceArea: "Bắc Ninh · Hà Nội · Hải Phòng",
      orderScale: "50 – 5.000 chi tiết / đợt",
      factoryEquipment: "14 trung tâm phay CNC Mazak & DMG Mori, phòng đo quang học CMM Mitutoyo",
      certifications: ["ISO 9001:2015", "Cam kết bảo mật NDA FDI", "Đạt chuẩn CMM"],
      updatedAt: "20/09/2026",
      status: "Đã đối chiếu",
      logo: "/logo_only.png"
    },
    {
      id: "ncc-06",
      name: "Xưởng Pallet Gỗ & Thùng Kiện Xuất Khẩu Đông Á",
      capabilities: ["Pallet gỗ tràm khử trùng HT", "Kiện gỗ máy móc công nghiệp", "Thùng gỗ dán ép"],
      serviceArea: "Bình Dương · Đồng Nai · Tây Ninh",
      orderScale: "500 – 10.000 pallet / tháng",
      factoryEquipment: "Lò sấy nhiệt đạt chuẩn ISPM 15, máy cắt ghép nan tự động",
      certifications: ["Chứng chỉ khử trùng ISPM 15", "ISO 9001:2015"],
      updatedAt: "27/09/2026",
      status: "Đã đối chiếu",
      logo: "/logo_only.png"
    },
    {
      id: "ncc-09",
      name: "Công ty Thiết Bị & Tự Động Hóa Dây Chuyền Tân Tiến",
      capabilities: ["Lắp ráp băng tải công nghiệp", "Tủ điện điều khiển PLC", "Robot gắp sản phẩm tự động"],
      serviceArea: "Hải Phòng · Bắc Ninh · Quảng Ninh",
      orderScale: "Từng module đơn lẻ hoặc hệ thống trọn gói",
      factoryEquipment: "Xưởng lắp ráp cơ điện tử 2.500m², bàn test tải tự động",
      certifications: ["CE Marking", "ISO 9001:2015"],
      updatedAt: "23/09/2026",
      status: "Đã đối chiếu",
      logo: "/logo_only.png"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Section Header (Centered, Strictly 1 Line Title) */}
      <div className="text-center max-w-5xl mx-auto space-y-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-4xl font-black text-slate-950 uppercase font-heading tracking-tight text-center leading-tight whitespace-normal md:whitespace-nowrap">
          Khám phá nguồn cung theo năng lực thực tế
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto text-center leading-relaxed font-normal">
          Tìm doanh nghiệp theo sản phẩm, năng lực sản xuất, địa bàn phục vụ, quy mô tiếp nhận, chứng nhận và tình trạng hồ sơ.
        </p>

        <div className="pt-1">
          <Link
            to="/nha-cung-ung"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0052cc] hover:text-[#0041a8] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition font-heading shadow-2xs"
          >
            <span>Tìm tất cả nhà cung ứng đã đối chiếu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Infinite Scrolling Supplier Columns */}
      <div 
        className="flex justify-center gap-5 sm:gap-6 pt-2 max-h-[640px] sm:max-h-[680px] overflow-hidden relative"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)'
        }}
      >
        <SuppliersColumn suppliers={column1Suppliers} duration={28} />
        <SuppliersColumn suppliers={column2Suppliers} className="hidden md:block" duration={34} />
        <SuppliersColumn suppliers={column3Suppliers} className="hidden lg:block" duration={30} />
      </div>

    </section>
  );
}
