/* High-End Visual Design: Vanguard UI Architect Tier
 * Archetype: Soft Structuralism (Luminous White, Titanium Hairlines, Porcelain Depth)
 * Architecture: Double-Bezel (Doppelrand concentric hardware framing)
 * Motion: Custom cubic-bezier spring interpolation [0.32, 0.72, 0, 1]
 * Components: Nested Button-in-Button trailing icons, magnetic interactive stepper
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ArrowLeft, Check, Search, FileText, 
  GitMerge, ShieldCheck, CheckCircle2, Cpu, Activity, Sparkles,
  MapPin, Clock, Calendar, CheckSquare, Layers, Award, ChevronRight
} from 'lucide-react';

export default function HowItWorksWorkflow() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      idx: 0,
      num: "01",
      code: "STEP_01",
      shortTitle: "Nêu nhu cầu",
      engine: "SUPPI",
      engineRole: "Khởi tạo & Tiếp nhận",
      engineBadge: "bg-sky-50 text-sky-800 border-sky-200/80",
      fullTitle: "Bước 01: Nêu nhu cầu bằng ngôn ngữ tự nhiên",
      headline: "Không cần điền biểu mẫu cứng nhắc",
      desc: "Người dùng mô tả yêu cầu sản xuất, số lượng, địa bàn nhà máy, thời hạn bàn giao và tiêu chí kỹ thuật đặc thù bằng tiếng Việt tự nhiên. Hệ thống tự động bóc tách và phân loại tiêu chí.",
      metrics: [
        { label: "Hình thức", val: "Ngôn ngữ tự nhiên" },
        { label: "Bảo mật", val: "Kiểm soát quyền chia sẻ" },
        { label: "Xử lý", val: "Tự động chuẩn hóa" }
      ],
      specimenType: "input"
    },
    {
      idx: 1,
      num: "02",
      code: "STEP_02",
      shortTitle: "SUPPI tìm nguồn",
      engine: "SUPPI",
      engineRole: "Bóc tách & Khớp lệnh",
      engineBadge: "bg-sky-50 text-sky-800 border-sky-200/80",
      fullTitle: "Bước 02: SUPPI bóc tách và khớp lệnh dữ liệu",
      headline: "Đối chiếu kho dữ liệu thực tế đã kiểm định",
      desc: "SUPPI quét kho dữ liệu doanh nghiệp trong hệ sinh thái CHUOICUNGUNG.COM, bóc tách công suất máy móc, bán kính vận chuyển và lọc ra các nhà cung ứng có năng lực thực tế phù hợp nhất.",
      metrics: [
        { label: "Phương thức", val: "Khớp lệnh đa tiêu chí" },
        { label: "Căn cứ", val: "Năng lực xưởng thực tế" },
        { label: "Nguyên tắc", val: "Xếp hạng khách quan" }
      ],
      specimenType: "matching"
    },
    {
      idx: 2,
      num: "03",
      code: "STEP_03",
      shortTitle: "Lý do phù hợp",
      engine: "SUPPI",
      engineRole: "Thẩm định minh bạch",
      engineBadge: "bg-sky-50 text-sky-800 border-sky-200/80",
      fullTitle: "Bước 03: Minh bạch tiêu chí và lý do đề xuất",
      headline: "Báo cáo tương thích rõ ràng, khách quan",
      desc: "Mỗi đề xuất đều đi kèm báo cáo giải trình chi tiết: vì sao nhà cung ứng này được chọn, máy móc thiết bị có đáp ứng không, chứng chỉ ISO/ESG nào đã được đối chiếu thực địa.",
      metrics: [
        { label: "Căn cứ", val: "Báo cáo tương thích" },
        { label: "Tính minh bạch", val: "Giải trình từng tiêu chí" },
        { label: "Mục tiêu", val: "Hỗ trợ ra quyết định" }
      ],
      specimenType: "audit"
    },
    {
      idx: 3,
      num: "04",
      code: "STEP_04",
      shortTitle: "CHAINY kết nối",
      engine: "CHAINY",
      engineRole: "Điều phối & Mẫu thử",
      engineBadge: "bg-indigo-50 text-indigo-800 border-indigo-200/80",
      fullTitle: "Bước 04: CHAINY hỗ trợ mở luồng kết nối 1:1",
      headline: "Điều phối làm việc, mẫu thử và báo giá",
      desc: "CHAINY đồng hành giúp hai bên mở kênh trao đổi trực tiếp, lên lịch hẹn khảo sát thực tế tại xưởng/KCN, điều phối gửi mẫu thử nghiệm và nhận báo giá cạnh tranh.",
      metrics: [
        { label: "Hình thức", val: "Làm việc trực tiếp 1:1" },
        { label: "Điều phối", val: "Lịch hẹn & mẫu thử" },
        { label: "Báo giá", val: "Tiếp nhận bảo mật" }
      ],
      specimenType: "connect"
    },
    {
      idx: 4,
      num: "05",
      code: "STEP_05",
      shortTitle: "Theo dõi kết quả",
      engine: "CHAINY",
      engineRole: "Giám sát & Bàn giao",
      engineBadge: "bg-indigo-50 text-indigo-800 border-indigo-200/80",
      fullTitle: "Bước 05: Theo dõi tiến độ đến kết quả bàn giao",
      headline: "Ghi nhận tiến độ, không để việc bị bỏ dở",
      desc: "Hệ thống lưu trữ toàn bộ nhật ký trao đổi, nhắc việc theo từng mốc thời gian và ghi nhận kết quả cuối cùng: ký kết hợp đồng, giao nhận hàng hoặc đánh giá nhà cung ứng.",
      metrics: [
        { label: "Theo dõi", val: "Bám sát từng mốc tiến độ" },
        { label: "Lưu trữ", val: "Hồ sơ tái đặt hàng" },
        { label: "Đánh giá", val: "Phản hồi 2 chiều" }
      ],
      specimenType: "delivery"
    }
  ];

  const current = steps[activeStep];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* =========================================================================
          DOUBLE-BEZEL (DOPPELRAND) HARDWARE ARCHITECTURE
          Outer Shell: Machined titanium/porcelain tray with hairline ring
         ========================================================================= */}
      <div className="bg-slate-100/80 p-2 sm:p-3 rounded-[2.5rem] ring-1 ring-slate-900/[0.05] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
        
        {/* =========================================================================
            INNER CORE 1: SECTION HEADER & STEPPER TRACK (Porcelain White Surface)
           ========================================================================= */}
        <div className="bg-white rounded-[calc(2.5rem-0.75rem)] p-7 sm:p-10 lg:p-12 border border-slate-200/80 shadow-[inset_0_1px_1px_rgba(255,255,255,1)] space-y-8">
          
          {/* Header Typography Block */}
          <div className="text-center max-w-3xl mx-auto space-y-3.5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-800 font-mono text-[10px] font-bold tracking-[0.25em] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse" />
              <span>B2B SOURCING PIPELINE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight uppercase text-slate-950 leading-[1.12]">
              Từ một nhu cầu đến một kết quả có thể theo dõi
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Không phải một hệ thống quảng cáo chung chung. SUPPI và CHAINY cùng phối hợp từ khâu làm rõ yêu cầu kỹ thuật đến khi giao dịch được bàn giao.
            </p>
          </div>

          {/* Dual Engine Architectural Segment Bar */}
          <div className="max-w-3xl mx-auto flex items-center justify-between p-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-mono">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-slate-800 font-bold">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>SUPPI: Tiếp nhận & Khớp lệnh (B.01 → 03)</span>
            </div>
            <span className="text-slate-400 font-mono hidden sm:inline">⇄</span>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-slate-800 font-bold">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>CHAINY: Kết nối & Bám sát (B.04 → 05)</span>
            </div>
          </div>

          {/* Precision 5-Segmented Control Stepper (Hardware Tab Strip) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
            {steps.map((st) => {
              const isActive = activeStep === st.idx;
              const isSuppi = st.engine === "SUPPI";
              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setActiveStep(st.idx)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] relative cursor-pointer active:scale-[0.98] ${
                    isActive 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/15 ring-2 ring-slate-900/10 -translate-y-1' 
                      : 'bg-slate-50/70 border-slate-200/80 text-slate-800 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-black transition-colors ${
                      isActive 
                        ? 'bg-white text-slate-950 shadow-xs' 
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}>
                      {st.num}
                    </span>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                      isActive
                        ? 'bg-white/10 text-white border-white/20'
                        : isSuppi
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {st.engine}
                    </span>
                  </div>

                  <span className={`block font-heading font-black text-xs sm:text-[13px] tracking-wide truncate ${
                    isActive ? 'text-white' : 'text-slate-900'
                  }`}>
                    {st.shortTitle}
                  </span>

                  <span className={`block text-[11px] font-normal truncate mt-0.5 ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {st.engineRole}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* =========================================================================
            INNER CORE 2: ASYMMETRICAL WORKSPACE & LIVE SPECIMEN
           ========================================================================= */}
        <div className="bg-white rounded-[calc(2.5rem-0.75rem)] p-7 sm:p-10 lg:p-12 border border-slate-200/80 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* =========================================================================
                LEFT COLUMN (5 / 12) — Narrative, Concrete Metrics & Nested Button-in-Button
               ========================================================================= */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="space-y-3.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#0052cc] bg-blue-50 px-3 py-1 rounded-md border border-blue-200/80">
                    TIẾN TRÌNH {current.num} / 05
                  </span>
                  <span className={`font-mono text-xs sm:text-sm font-bold px-3 py-1 rounded-md border ${current.engineBadge}`}>
                    {current.engine} · {current.engineRole}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-950 leading-snug">
                  {current.fullTitle}
                </h3>

                <p className="text-sm sm:text-base font-bold text-slate-900">
                  {current.headline}
                </p>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {current.desc}
                </p>
              </div>

              {/* 3 Concrete Operational Metrics */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {current.metrics.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm">
                    <span className="text-slate-600 font-medium">{m.label}:</span>
                    <strong className="text-slate-950 font-heading font-black text-sm sm:text-base">{m.val}</strong>
                  </div>
                ))}
              </div>

              {/* Stepper Navigation + NESTED BUTTON-IN-BUTTON CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Prev / Next Node Controllers */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                    disabled={activeStep === 0}
                    className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer active:scale-95"
                    title="Bước trước"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                    disabled={activeStep === steps.length - 1}
                    className="px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Bước tiếp theo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Nested Button-in-Button Trailing Icon CTA (High-End Directive) */}
                <Link
                  to="/dang-nhu-cau"
                  className="px-6 py-3 rounded-full bg-[#0052cc] text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-between shadow-lg shadow-blue-600/20 hover:bg-[#0041a8] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] group"
                >
                  <span>Bắt đầu ngay</span>
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center ml-3 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </span>
                </Link>

              </div>

            </div>

            {/* =========================================================================
                RIGHT COLUMN (7 / 12) — Live Software Specimen Terminal
               ========================================================================= */}
            {/* =========================================================================
                RIGHT COLUMN (7 / 12) — Khái niệm & Giải thích bản chất tiến trình (Rút gọn 3-5 dòng, font lớn)
               ========================================================================= */}
            {/* =========================================================================
                RIGHT FLANK: CONCISE SPECIMEN CARD (Strictly 3-4 lines)
               ========================================================================= */}
            <div className="lg:col-span-7 bg-[#fbfcfd] rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-center">
              
              {/* Tiến trình 01: Nêu nhu cầu */}
              {current.specimenType === "input" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 uppercase flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0052cc]" />
                      Bản chất tiến trình khởi tạo
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      Tiếp nhận & Chuẩn hóa
                    </span>
                  </div>

                  <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-snug">
                    Chuyển đổi nhu cầu từ ngôn ngữ tự nhiên thành bộ tiêu chí kỹ thuật chuẩn mực, tự động phân loại quy cách, sản lượng và chứng chỉ ngành mà không cần điền form phức tạp.
                  </p>

                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 text-xs sm:text-sm text-blue-950 font-medium flex items-center justify-between">
                    <span><strong>Đầu ra:</strong> Bản mô tả kỹ thuật chuẩn hóa, sẵn sàng khớp lệnh tức thì.</span>
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                  </div>
                </div>
              )}

              {/* Tiến trình 02: SUPPI tìm nguồn */}
              {current.specimenType === "matching" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 uppercase flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-sky-600" />
                      Bản chất tiến trình so khớp
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono text-sky-700 font-bold bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                      Khớp lệnh tự động
                    </span>
                  </div>

                  <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-snug">
                    SUPPI rà soát dữ liệu, đối chiếu tiêu chuẩn kỹ thuật với năng lực máy móc thực tế, công suất xưởng và bán kính giao nhận để tối ưu chi phí vận chuyển.
                  </p>

                  <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-200/80 text-xs sm:text-sm text-sky-950 font-medium flex items-center justify-between">
                    <span><strong>Đầu ra:</strong> Danh sách nhà cung ứng có năng lực đáp ứng chuẩn xác nhất.</span>
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 ml-2" />
                  </div>
                </div>
              )}

              {/* Tiến trình 03: Lý do phù hợp */}
              {current.specimenType === "audit" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 uppercase flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      Bản chất tiến trình thẩm định
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      Minh bạch căn cứ
                    </span>
                  </div>

                  <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-snug">
                    Minh bạch toàn bộ căn cứ đề xuất dựa trên năng lực sản xuất thực tế và chứng nhận đã kiểm định, cam kết không có yếu tố tài trợ hay quảng cáo can thiệp.
                  </p>

                  <div className="p-3 bg-teal-50/80 rounded-xl border border-teal-200/80 text-xs sm:text-sm text-teal-950 font-medium flex items-center justify-between">
                    <span><strong>Đầu ra:</strong> Báo cáo căn cứ tương thích rõ ràng, tạo niềm tin cho đàm phán.</span>
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 ml-2" />
                  </div>
                </div>
              )}

              {/* Tiến trình 04: CHAINY kết nối */}
              {current.specimenType === "connect" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 uppercase flex items-center gap-2">
                      <GitMerge className="w-4 h-4 text-indigo-600" />
                      Bản chất tiến trình kết nối
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono text-indigo-700 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      Điều phối 1:1
                    </span>
                  </div>

                  <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-snug">
                    CHAINY mở luồng liên hệ trực tiếp giữa hai bên, điều phối lịch hẹn khảo sát thực địa nhà xưởng, gửi duyệt mẫu thử và tiếp nhận bảng chào giá thương mại.
                  </p>

                  <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200/80 text-xs sm:text-sm text-indigo-950 font-medium flex items-center justify-between">
                    <span><strong>Đầu ra:</strong> Kênh làm việc 1:1 thông suốt, có nhắc việc theo mốc thời gian.</span>
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />
                  </div>
                </div>
              )}

              {/* Tiến trình 05: Theo dõi kết quả */}
              {current.specimenType === "delivery" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 uppercase flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      Bản chất tiến trình theo dõi & bàn giao
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Khép kín chu trình
                    </span>
                  </div>

                  <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-snug">
                    Bám sát tiến độ giao nhận đến khi hoàn tất đơn hàng, ghi nhận đánh giá 2 chiều về chất lượng và lưu trữ hồ sơ doanh nghiệp phục vụ tái đặt hàng lâu dài.
                  </p>

                  <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 font-medium flex items-center justify-between">
                    <span><strong>Đầu ra:</strong> Giao dịch hoàn tất trọn vẹn, xây dựng quan hệ cung ứng bền vững.</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

    </section>
  );
}




