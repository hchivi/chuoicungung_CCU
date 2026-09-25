import React, { useState } from 'react';
import { 
  Layers, ArrowRight, ChevronRight, Sparkles, Filter, 
  ShoppingBag, Flame, DollarSign, CheckCircle2, RotateCcw, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InteractiveTreemap({ lang = 'vi', onOpenDiamondModal }) {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedSubNiche, setSelectedSubNiche] = useState(null);

  // High-level Industry Categories with realistic Treemap weights
  const industriesData = [
    {
      id: 'mechanical',
      name: lang === 'en' ? 'Mechanical & Precision Machining' : 'Cơ Khí Chế Tạo & Khuôn Mẫu',
      pct: 25,
      rfqCount: 314,
      gmvEst: '2.180B VNĐ',
      color: 'from-blue-600 to-indigo-700',
      bgLight: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-900 border-blue-200',
      tagColor: 'bg-blue-600 text-white',
      trend: '+18.4%',
      niches: [
        { name: 'Khuôn dập liên hoàn CNC 5 trục', weight: 35, rfqs: 110, avgPrice: '450 - 950 Triệu', hot: true, note: 'Khát cung ứng tại Bắc Ninh & Hải Phòng' },
        { name: 'Đồ gá JIG kiểm tra QA/QC linh kiện', weight: 25, rfqs: 82, avgPrice: '120 - 350 Triệu', hot: false, note: 'Đơn hàng Foxconn, Samsung' },
        { name: 'Gia công tiện phay CNC chính xác cao', weight: 22, rfqs: 68, avgPrice: '200 - 600 Triệu', hot: true, note: 'Chuỗi cung ứng KCN Bình Dương' },
        { name: 'Cắt laser kim loại tấm & Chấn uốn', weight: 18, rfqs: 54, avgPrice: '80 - 250 Triệu', hot: false, note: 'Thép SKD11, SS400' }
      ]
    },
    {
      id: 'electronics',
      name: lang === 'en' ? 'Electronics & Semiconductors' : 'Điện – Điện Tử & Bán Dẫn',
      pct: 20,
      rfqCount: 251,
      gmvEst: '1.920B VNĐ',
      color: 'from-sky-600 to-cyan-700',
      bgLight: 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-900 border-sky-200',
      tagColor: 'bg-sky-600 text-white',
      trend: '+22.1%',
      niches: [
        { name: 'Gia công SMT PCB đa lớp & Gắn chip', weight: 40, rfqs: 98, avgPrice: '800M - 2.5B', hot: true, note: 'Nhu cầu cao tại KCNC TP.HCM & Bắc Ninh' },
        { name: 'Linh kiện thụ động SMD & Dây cáp', weight: 28, rfqs: 72, avgPrice: '150 - 500 Triệu', hot: true, note: 'Cảnh báo thiếu hụt nguồn cung 18%' },
        { name: 'Cảm biến công nghiệp IoT & PLC', weight: 20, rfqs: 48, avgPrice: '300 - 850 Triệu', hot: false, note: 'Nâng cấp Smart Factory' },
        { name: 'Khay nhựa định hình ESD chống tĩnh điện', weight: 12, rfqs: 33, avgPrice: '90 - 200 Triệu', hot: false, note: 'Phục vụ xưởng phòng sạch' }
      ]
    },
    {
      id: 'mep_construction',
      name: lang === 'en' ? 'Industrial Construction & MEP' : 'Xây Dựng Công Nghiệp & MEP',
      pct: 15,
      rfqCount: 188,
      gmvEst: '1.450B VNĐ',
      color: 'from-amber-600 to-orange-700',
      bgLight: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border-amber-200',
      tagColor: 'bg-amber-600 text-white',
      trend: '+11.5%',
      niches: [
        { name: 'Panel EPS/PU phòng sạch Cleanroom', weight: 38, rfqs: 72, avgPrice: '1.2B - 4.5B', hot: true, note: 'Dự án mở rộng nhà máy Dược & Bán dẫn' },
        { name: 'Hệ thống điều hòa trung tâm HVAC & Ống gió', weight: 32, rfqs: 60, avgPrice: '800M - 3.2B', hot: false, note: 'KCN VSIP Hải Dương & Long An' },
        { name: 'Kết cấu thép tiền chế & Sàn Epoxy chịu lực', weight: 30, rfqs: 56, avgPrice: '1.5B - 6.0B', hot: false, note: 'Xây xưởng mới' }
      ]
    },
    {
      id: 'plastics_rubber',
      name: lang === 'en' ? 'Plastics & Precision Rubber' : 'Nhựa & Cao Su Kỹ Thuật',
      pct: 12,
      rfqCount: 151,
      gmvEst: '980M VNĐ',
      color: 'from-emerald-600 to-teal-700',
      bgLight: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-900 border-emerald-200',
      tagColor: 'bg-emerald-600 text-white',
      trend: '+14.2%',
      niches: [
        { name: 'Ép phun linh kiện nhựa kỹ thuật PP/ABS', weight: 45, rfqs: 68, avgPrice: '300 - 800 Triệu', hot: true, note: 'Vỏ thiết bị gia dụng & ô tô' },
        { name: 'Gioăng & Chi tiết cao su kỹ thuật chịu dầu', weight: 30, rfqs: 46, avgPrice: '120 - 350 Triệu', hot: false, note: 'Tiêu chuẩn xuất khẩu Châu Âu' },
        { name: 'Hạt nhựa tái sinh & Nhựa sinh học ESG', weight: 25, rfqs: 37, avgPrice: '500M - 1.8B', hot: true, note: 'Chuyển đổi xanh cho KCN' }
      ]
    },
    {
      id: 'packaging_printing',
      name: lang === 'en' ? 'Packaging & Gift Boxes' : 'Bao Bì & Hộp Quà Tặng 9:16',
      pct: 8,
      rfqCount: 101,
      gmvEst: '820M VNĐ',
      color: 'from-purple-600 to-fuchsia-700',
      bgLight: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-900 border-purple-200',
      tagColor: 'bg-purple-600 text-white',
      trend: '+29.6%',
      niches: [
        { name: 'Hộp quà dọc tỷ lệ 9:16 Ép kim (Khối Ngân Hàng HDBank, VietinBank)', weight: 42, rfqs: 44, avgPrice: '600M - 2.2B', hot: true, note: 'Đang cực kỳ khát hàng Q3-Q4' },
        { name: 'Túi canvas thời trang & Giỏ màng co bọc quà', weight: 30, rfqs: 31, avgPrice: '150 - 450 Triệu', hot: true, note: 'Dự kiến tăng giá 10% quý sau' },
        { name: 'Thùng carton 5 lớp chống ẩm xuất khẩu', weight: 28, rfqs: 26, avgPrice: '200 - 700 Triệu', hot: false, note: 'Phục vụ xuất khẩu Nông sản' }
      ]
    },
    {
      id: 'food_beverage',
      name: lang === 'en' ? 'Food & Beverage Processing' : 'Thực Phẩm & Nông Sản Chế Biến',
      pct: 6,
      rfqCount: 75,
      gmvEst: '650M VNĐ',
      color: 'from-rose-600 to-pink-700',
      bgLight: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-900 border-rose-200',
      tagColor: 'bg-rose-600 text-white',
      trend: '+31.8%',
      niches: [
        { name: 'Nguồn cung Trà ô long Cozy & Cà phê G7 chuỗi siêu thị', weight: 38, rfqs: 30, avgPrice: '800M - 3.0B', hot: true, note: 'Khát hàng cung ứng cho TAHOMART & Bán lẻ' },
        { name: 'Thập cẩm sấy Nut Farm & Mít sấy Nam Huy xuất khẩu', weight: 34, rfqs: 26, avgPrice: '500M - 1.8B', hot: true, note: 'Đơn hàng đóng set quà Tết' },
        { name: 'Hạt điều rang muối & Macca Đắk Lắk chế biến sâu', weight: 28, rfqs: 19, avgPrice: '400M - 1.2B', hot: false, note: 'Nguồn nông sản Tây Nguyên' }
      ]
    },
    {
      id: 'textile_footwear',
      name: lang === 'en' ? 'Textile, Garment & Footwear' : 'Dệt May & Da Giày',
      pct: 7,
      rfqCount: 88,
      gmvEst: '520M VNĐ',
      color: 'from-teal-600 to-emerald-800',
      bgLight: 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-900 border-teal-200',
      tagColor: 'bg-teal-600 text-white',
      trend: '+8.3%',
      niches: [
        { name: 'Vải dệt kim kỹ thuật & Vải kháng khuẩn', weight: 45, rfqs: 40, avgPrice: '400M - 1.5B', hot: false, note: 'Chuỗi dệt may Nam Định & Đồng Nai' },
        { name: 'Phụ liệu may mặc (Cúc, Dây kéo YKK, Nhãn dệt)', weight: 32, rfqs: 28, avgPrice: '80 - 250 Triệu', hot: true, note: 'Đơn giao nhanh 48h' },
        { name: 'Gia công may mẫu & Cắt rập tự động CAD/CAM', weight: 23, rfqs: 20, avgPrice: '100 - 300 Triệu', hot: false, note: 'Xưởng vệ tinh KCN Bình Dương' }
      ]
    },
    {
      id: 'logistics_chemicals',
      name: lang === 'en' ? 'Logistics & Specialty Chemicals' : 'Logistics Cảng & Hóa Chất',
      pct: 7,
      rfqCount: 88,
      gmvEst: '620M VNĐ',
      color: 'from-slate-600 to-zinc-800',
      bgLight: 'bg-slate-500/10 hover:bg-slate-500/20 text-slate-900 border-slate-200',
      tagColor: 'bg-slate-700 text-white',
      trend: '+12.7%',
      niches: [
        { name: 'Kho lạnh bảo quản Nông sản & Dược phẩm', weight: 42, rfqs: 38, avgPrice: '600M - 2.0B', hot: true, note: 'Khu vực Cảng Cái Mép & Hải Phòng' },
        { name: 'Hóa chất xử lý bề mặt kim loại & Mạ kẽm', weight: 32, rfqs: 28, avgPrice: '150 - 450 Triệu', hot: false, note: 'Đạt chuẩn RoHs' },
        { name: 'Dịch vụ vận tải container siêu trường siêu trọng', weight: 26, rfqs: 22, avgPrice: '300 - 900 Triệu', hot: false, note: 'Lắp đặt nhà máy mới' }
      ]
    }
  ];

  const currentIndustry = industriesData.find(i => i.id === selectedIndustry);

  return (
    <div className="bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      
      {/* Header with Breadcrumb & Interactive Tip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-extrabold text-slate-900 text-sm sm:text-base font-heading flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#0052cc]" />
              {lang === 'en' ? 'Interactive Treemap: Industrial Demands & Supply Matrix' : 'Interactive Treemap: Cơ Cấu & Xu Hướng Nhu Cầu Chuỗi Cung Ứng'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {lang === 'en' 
              ? 'Click on any industry block to drill-down into hot procurement niches and sourcing bottlenecks.'
              : 'Nhấp trực tiếp vào khối ngành để chẻ nhỏ các ngách hàng đang "khát" cung ứng (Cozy, G7, Hộp 9:16, SMT, Nut Farm...).'}
          </p>
        </div>

        {/* Breadcrumb / Reset Button */}
        <div className="flex items-center space-x-2 shrink-0 font-heading">
          {selectedIndustry ? (
            <button
              onClick={() => {
                setSelectedIndustry(null);
                setSelectedSubNiche(null);
              }}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0052cc] rounded-xl text-xs font-bold transition flex items-center space-x-1 border border-blue-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Back to All Sectors' : 'Quay Lại Tất Cả Ngành'}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded-lg">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>CHẠM ĐỂ CHẺ NHỎ NGÁCH (DRILL-DOWN)</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: TOP LEVEL TREEMAP BLOCKS (If no industry selected) */}
      {/* ========================================================================= */}
      {!selectedIndustry ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {industriesData.map((ind) => (
              <div
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-lg relative overflow-hidden flex flex-col justify-between ${ind.bgLight}`}
                style={{ minHeight: '140px' }}
              >
                {/* Background decorative gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${ind.color}`}></div>

                {/* Top Row */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                      {ind.pct}%
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${ind.tagColor}`}>
                      {ind.trend}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 font-heading leading-tight group-hover:text-[#0052cc] transition">
                    {ind.name}
                  </h4>
                </div>

                {/* Bottom Row */}
                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-600 font-medium">
                    {ind.rfqCount} RFQs • {ind.gmvEst}
                  </span>
                  <span className="text-[#0052cc] font-bold flex items-center group-hover:translate-x-0.5 transition">
                    Chẻ nhỏ <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Interactive Notice */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
            <div className="flex items-center space-x-2 text-slate-700">
              <Flame className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>Gợi ý dữ liệu:</strong> Ngành <strong>Bao bì (8%)</strong> và <strong>Thực phẩm - Nông sản (6%)</strong> đang có tỷ lệ tăng trưởng RFQ cao nhất (+29% - +31%) cho mùa cao điểm.
              </span>
            </div>
            <button
              onClick={() => setSelectedIndustry('food_beverage')}
              className="text-[#0052cc] font-bold hover:underline shrink-0 text-[11px] font-heading cursor-pointer"
            >
              Xem ngách Thực phẩm & Đồ uống →
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: DRILL-DOWN NICHE BREAKDOWN (When an industry is clicked) */
        /* ========================================================================= */
        <div className="space-y-4 animate-fadeIn">
          
          {/* Active Industry Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold font-mono">
                  TỶ TRỌNG {currentIndustry.pct}% TOÀN QUỐC
                </span>
                <span className="text-emerald-400 text-xs font-mono font-bold">
                  ▲ {currentIndustry.trend} so với tháng trước
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black font-heading text-white">
                {currentIndustry.name}
              </h3>
              <p className="text-xs text-slate-300">
                Tổng {currentIndustry.rfqCount} nhu cầu đang mở • Quy mô ước tính: {currentIndustry.gmvEst}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/nhu-cau')}
                className="px-4 py-2 bg-gradient-to-r from-[#0052cc] to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center space-x-1.5 font-heading cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Xem Tất Cả {currentIndustry.rfqCount} RFQs</span>
              </button>
            </div>
          </div>

          {/* Sub-niche Interactive Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 font-heading">
              Các ngách cung ứng đang "khát" hàng & Điểm nghẽn sản xuất:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentIndustry.niches.map((niche, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedSubNiche(niche)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    selectedSubNiche?.name === niche.name
                      ? 'border-[#0052cc] bg-blue-50/60 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {niche.hot && (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-md flex items-center gap-1 font-mono">
                            <Flame className="w-3 h-3 text-rose-600" />
                            CỰC KỲ KHÁT HÀNG
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          Tỷ trọng ngách: {niche.weight}%
                        </span>
                      </div>

                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm font-heading leading-snug">
                        {niche.name}
                      </h5>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-[#0052cc] font-mono block">
                        {niche.rfqs} RFQs
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {niche.avgPrice}
                      </span>
                    </div>
                  </div>

                  {/* Note & Market Insight */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">
                      📌 {niche.note}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/nhu-cau?search=${encodeURIComponent(niche.name)}`);
                      }}
                      className="text-[#0052cc] font-bold hover:underline flex items-center text-[10px] font-heading cursor-pointer"
                    >
                      Khớp lệnh ngay <ArrowRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Freemium Blur Paywall for deep competitor pricing */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-4">
            <div className="filter blur-[3px] select-none pointer-events-none space-y-2 opacity-60">
              <div className="h-4 bg-slate-300 rounded w-3/4"></div>
              <div className="h-4 bg-slate-300 rounded w-1/2"></div>
              <div className="h-4 bg-slate-300 rounded w-5/6"></div>
              <div className="grid grid-cols-4 gap-2 pt-2">
                <div className="h-8 bg-slate-200 rounded"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            </div>

            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-10">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-1.5 shadow-sm">
                <Lock className="w-4 h-4" />
              </div>
              <h5 className="font-black text-slate-900 text-xs sm:text-sm font-heading">
                Báo Cáo Biên Độ Giá Thầu & Tình Báo Đối Thủ Chuyên Sâu ({currentIndustry.name})
              </h5>
              <p className="text-[11px] text-slate-500 max-w-md mt-0.5 mb-2.5">
                Dữ liệu phân tích mức giá trúng thầu trung bình, thời gian giao hàng và đánh giá năng lực nhà cung cấp chỉ mở cho Đối tác Kim Cương.
              </p>
              <button
                onClick={onOpenDiamondModal}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition font-heading flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Nâng Cấp Đối Tác Kim Cương Để Xem Báo Cáo Ngách</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
