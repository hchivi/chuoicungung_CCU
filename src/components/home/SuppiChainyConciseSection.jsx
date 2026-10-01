import React from 'react';
import { Link } from 'react-router-dom';
import { Search, GitMerge, ArrowRight, CheckCircle2, Sparkles, Bot } from 'lucide-react';
import DualMascotInteractive from '../DualMascotInteractive';

export default function SuppiChainyConciseSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#060D1A] rounded-[32px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 text-white border border-slate-800/80 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)] relative overflow-hidden space-y-8">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[250px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-violet-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Section Header (Centered, Synchronized, No Eyebrow, Max 2 Lines) */}
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight uppercase text-white leading-tight text-center">
            SUPPI & CHAINY ĐỒNG HÀNH
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal text-center">
            Không phải một AI chung chung. Mỗi trợ lý đảm nhiệm một giai đoạn then chốt để đơn hàng đi đến kết quả cuối cùng.
          </p>
        </div>

        {/* Mascot Visual Display */}
        <div className="relative z-10 flex justify-center">
          <DualMascotInteractive size={120} showSpeechBubbles={false} />
        </div>

        {/* 2 Focused Cards: SUPPI vs CHAINY (Rút gọn sắc nét theo đúng yêu cầu) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          
          {/* SUPPI CARD */}
          <div className="bg-slate-900/70 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between space-y-5 group relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black font-heading uppercase text-white tracking-wide">
                      SUPPI — Tìm đúng nguồn
                    </h3>
                    <span className="text-[11px] text-blue-400 font-mono">Sourcing Intelligence</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-mono font-bold uppercase">
                  Bước 1 · Tìm nguồn
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Hiểu nhu cầu tự nhiên, làm rõ tiêu chí và tìm dữ liệu phù hợp trong hệ thống CHUOICUNGUNG.COM.
              </p>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Bóc tách quy cách kỹ thuật, vật liệu, dung sai và điều kiện nhận đơn</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Đối chiếu năng lực thực tế từ kho dữ liệu hơn 21.680 doanh nghiệp</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <Link
                to="/tro-ly-ai?assistant=suppi"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/20"
              >
                <span>Hỏi SUPPI tìm nguồn</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CHAINY CARD */}
          <div className="bg-slate-900/70 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-800 hover:border-violet-500/50 transition-all duration-300 flex flex-col justify-between space-y-5 group relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center font-bold">
                    <GitMerge className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black font-heading uppercase text-white tracking-wide">
                      CHAINY — Theo việc đến kết quả
                    </h3>
                    <span className="text-[11px] text-violet-400 font-mono">Coordination Engine</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-mono font-bold uppercase">
                  Bước 2 · Theo việc
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Hỗ trợ kết nối hai bên, theo dõi lịch gặp, mẫu thử, khảo sát, báo giá và bước tiếp theo.
              </p>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>Sắp xếp lịch gặp mặt, khảo sát nhà máy hoặc KCN trực tiếp</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>Theo dõi các mốc gửi mẫu đối chứng, báo giá và nghiệm thu bàn giao</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <Link
                to="/tro-ly-ai?assistant=chainy"
                className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition flex items-center justify-center space-x-1.5 shadow-md shadow-violet-600/20"
              >
                <span>Hỏi CHAINY theo việc</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Thông điệp kết (Đúng từng chữ yêu cầu của user) */}
        <div className="relative z-10 pt-2">
          <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-violet-950/60 rounded-2xl p-4 sm:p-5 border border-slate-800 text-center space-y-1">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Thông điệp phối hợp:
            </span>
            <p className="text-sm sm:text-base font-bold font-heading text-white">
              “SUPPI giúp tìm đúng đối tượng. CHAINY giúp kết nối không bị bỏ dở.”
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
