import React from 'react';
import { X, Sparkles, MessageSquare, Compass, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ProgramSuppiGuideModal({ onClose, onSelectTopic }) {
  const guideTopics = [
    {
      id: 'which_program',
      title: 'Tôi nên tham gia chương trình nào?',
      desc: 'Hướng dẫn lựa chọn giữa Ngày Hội Chuỗi Cung Ứng, Sourcing Day 1:1, Gian hàng chung hay Hội thảo chuyên đề theo quy mô nhà xưởng.',
      prompt: 'Nhà máy tôi sản xuất cơ khí chính xác tại Đồng Nai, nên tham gia chương trình nào để gặp được phòng mua hàng FDI?'
    },
    {
      id: 'how_to_prepare',
      title: 'Doanh nghiệp cần chuẩn bị những gì?',
      desc: 'Checklist tài liệu: Hồ sơ năng lực (Company Profile), E-Catalogue, Bảng thông số sản phẩm mẫu, Chứng nhận ISO và danh thiếp công vụ.',
      prompt: 'Để tham gia phiên kết nối cung ứng B2B hiệu quả, tôi cần chuẩn bị những tài liệu và mẫu vật gì?'
    },
    {
      id: 'chainy_followup',
      title: 'Quy trình theo dõi sau kết nối với CHAINY',
      desc: 'Sau khi kết nối hoặc gặp tại sự kiện, trợ lý CHAINY sẽ hỗ trợ nhắc hẹn báo giá, gửi mẫu kiểm tra và cập nhật kết quả giao thương.',
      prompt: 'CHAINY sẽ theo dõi việc gửi báo giá và tiến độ làm mẫu sau sự kiện như thế nào?'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <img 
              src="/public/mascots/SUPPI_2.png" 
              alt="SUPPI Assistant" 
              className="w-12 h-12 object-contain bg-white/10 rounded-2xl p-1"
              onError={(e) => { e.target.src = '/logo_only.png'; }}
            />
            <div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Trợ Lý Điều Phối Vận Hành B2B</span>
              </div>
              <h3 className="text-base sm:text-lg font-black font-heading text-white">
                Hỏi SUPPI & CHAINY Về Chương Trình
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <p className="text-slate-600 leading-relaxed">
            SUPPI hỗ trợ giải đáp quy chuẩn tham gia, gợi ý sự kiện phù hợp và hướng dẫn chuẩn bị hồ sơ năng lực. 
            Sau phiên gặp mặt, CHAINY sẽ tự động đồng hành điều phối công việc và cập nhật kết quả.
          </p>

          <div className="space-y-3">
            {guideTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => onSelectTopic && onSelectTopic(topic)}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/30 transition cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{topic.title}</span>
                  </h4>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {topic.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-1">
            <div className="font-bold flex items-center space-x-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Nguyên Tắc Trách Nhiệm Vận Hành (Section 37)</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Trợ lý AI hỗ trợ tư vấn và tổng hợp thông tin dự thảo. SUPPI/CHAINY không tự ý duyệt hồ sơ nhà cung cấp, không tự động thu phí hay cam kết kết quả thương mại ngoài thẩm quyền điều phối viên.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 text-xs transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
