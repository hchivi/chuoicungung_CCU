import React from 'react';
import { ShieldCheck, Database, Bot, Award, CheckCircle2, Lock, EyeOff, FileCheck } from 'lucide-react';

export default function TrustAndPrinciplesSection() {
  const principles = [
    {
      num: "01",
      title: "Database CHUOICUNGUNG.COM là nguồn dữ liệu chính",
      desc: "Toàn bộ thông tin nhà cung ứng, nhà máy, khu công nghiệp và hiệp hội được lưu trữ và truy vấn từ nguồn cơ sở dữ liệu đã chuẩn hóa, không crawl tự do hay dùng dữ liệu không rõ xuất xứ.",
      icon: Database,
      col: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      num: "02",
      title: "SUPPI không tự tạo doanh nghiệp hoặc năng lực không có trong hệ thống",
      desc: "Trợ lý AI chỉ bóc tách tiêu chí kỹ thuật và tìm kiếm đối tượng tương thích có thật. Khi database không có dữ liệu phù hợp, hệ thống báo trung thực, tuyệt đối không bịa đặt kết quả ảo.",
      icon: Bot,
      col: "text-cyan-600 bg-cyan-50 border-cyan-200"
    },
    {
      num: "03",
      title: "Kết quả matching không chịu ảnh hưởng bởi tài trợ",
      desc: "Thứ tự sắp xếp nhà cung ứng hoàn toàn căn cứ vào độ tương thích kỹ thuật, địa bàn, năng lực máy và quy mô đơn hàng của bên mua. Tài trợ chỉ mang tính ưu tiên truyền thông, không can thiệp thuật toán.",
      icon: Award,
      col: "text-amber-600 bg-amber-50 border-amber-200"
    },
    {
      num: "04",
      title: "Trạng thái xác minh được hiển thị rõ ràng",
      desc: "Phân định minh bạch giữa các hồ sơ: 'Đã đối chiếu', 'Tự khai báo' hoặc 'Cần cập nhật'. Nền tảng tuyệt đối không dùng từ 'bảo chứng' nếu chưa có căn cứ pháp lý hoặc biên bản kiểm định thực tế.",
      icon: CheckCircle2,
      col: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
      num: "05",
      title: "Nhu cầu chỉ được công khai sau khi người dùng xác nhận",
      desc: "Mọi gói mua hàng hoặc tìm đối tác gửi lên đều trải qua khâu kiểm tra và phải được sự đồng ý xác nhận công khai của chính chủ tài khoản mới được xuất hiện trên sàn B2B.",
      icon: FileCheck,
      col: "text-violet-600 bg-violet-50 border-violet-200"
    },
    {
      num: "06",
      title: "Thông tin liên hệ và dữ liệu riêng tư được giới hạn quyền truy cập",
      desc: "Số điện thoại, email cá nhân và thông tin nhạy cảm của người phụ trách mua hàng được bảo mật nghiêm ngặt theo chính sách PII, chỉ mở kênh trao đổi khi cả hai bên xác nhận phù hợp.",
      icon: Lock,
      col: "text-rose-600 bg-rose-50 border-rose-200"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header (Centered, Synchronized, No Eyebrow, Max 2 Lines) */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 uppercase font-heading tracking-tight text-center leading-tight">
          Dữ liệu minh bạch, kết nối có nguyên tắc
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto text-center leading-relaxed font-normal">
          Xây dựng niềm tin bền vững bằng sự chính xác của dữ liệu, quy trình bảo vệ quyền riêng tư và thuật toán matching công bằng.
        </p>
      </div>

      {/* 6 Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {principles.map((pr, idx) => {
          const Icon = pr.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${pr.col}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {pr.num}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-[15px] font-black text-slate-900 font-heading leading-snug">
                    {pr.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {pr.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center space-x-1.5 text-[11px] font-mono font-semibold text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Quy chuẩn hệ thống cam kết</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
