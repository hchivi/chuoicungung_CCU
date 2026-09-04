import React from 'react';
import { Award, TrendingUp, CheckCircle2, Factory, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CaseStudiesSection() {
  const caseStudies = [
    {
      id: 'portalink',
      tag: 'GIAI ĐOẠN 1 • PHA 1.2 & 5.1',
      title: 'Cách Mạng Lưới PORTALINK Tối Ưu 30% Thời Gian Thông Quan Thiết Bị FDI',
      company: 'Mạng Lưới Logistics Quốc Tế PORTALINK',
      client: 'Cụm Nhà Máy Điện Tử KCN Deep C Hải Phòng',
      metric: '-30% Lead-time',
      metricLabel: 'Rút ngắn thời gian thông quan',
      desc: 'Nhờ số hóa trước hồ sơ danh mục máy móc theo chuẩn Pha 1.2 và liên kết hải quan thông minh, toàn bộ 45 dây chuyền SMT nhập khẩu đã được thông quan và lắp đặt sớm hơn 18 ngày so với kế hoạch.',
      badges: ['ISO 28000', 'Chuẩn FIATA', 'Huy Hiệu Kim Cương 💎']
    },
    {
      id: 'uniform',
      tag: 'GIAI ĐOẠN 5 • PHA 5.2',
      title: 'Chuyên Gia Đồng Phục Chuẩn Hóa ESG Cho 5.000 Công Nhân Nhà Máy FDI',
      company: 'Hệ Thống Sản Xuất Chuyên Gia Đồng Phục',
      client: 'Tập Đoàn Sản Xuất Lego Group & Amata KCN',
      metric: '5.000+ Bộ/Tuần',
      metricLabel: 'Đạt chuẩn kiểm toán ESG & OEKO-TEX',
      desc: 'Đáp ứng 100% tiêu chuẩn kiểm định xả thải xanh, sợi tái chế chống tĩnh điện và đồng bộ đơn hàng tự động qua API ERP trực tiếp đến phòng Mua hàng của Chủ đầu tư FDI.',
      badges: ['OEKO-TEX 100', 'ISO 14001', 'Huy Hiệu Vàng 🥇']
    },
    {
      id: 'cnc',
      tag: 'GIAI ĐOẠN 4 • PHA 4.2',
      title: 'Gia Công Chi Tiết Jig Dung Sai ±0.005mm Cho Chuỗi Cung Ứng Bán Dẫn',
      company: 'Công Ty Cơ Khí Chính Xác Tiến Bộ CNC',
      client: 'Tổ Hợp Bán Dẫn Amkor & Samsung SCM',
      metric: '99.8% Pass Rate',
      metricLabel: 'Đạt chuẩn kiểm định CMM micron',
      desc: 'Khớp nối trực tiếp qua thuật toán AI Matchmaking trong vòng 48 giờ, bàn giao 120 bộ Jig gá vi mạch bán dẫn đúng tiến độ khắt khe của đối tác nước ngoài.',
      badges: ['IATF 16949', 'JIS B 0405', 'Huy Hiệu Kim Cương 💎']
    }
  ];

  return (
    <section className="font-sans space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-extrabold uppercase tracking-wider font-heading">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Thực Chứng Năng Lực Khớp Nối</span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#072348] uppercase font-heading tracking-tight mt-1.5">
            Các Điển Hình Hợp Tác Thực Chiến (Case Studies)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md text-left md:text-right font-medium">
          Chứng minh hiệu quả giảm thiểu chi phí và tăng tốc độ bàn giao qua dữ liệu định lượng thực tế.
        </p>
      </div>

      {/* 3 Case Study Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {caseStudies.map((cs) => (
          <div
            key={cs.id}
            className="rounded-3xl bg-white border-2 border-slate-200/90 hover:border-emerald-500 shadow-md hover:shadow-2xl transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between space-y-5 group hover:-translate-y-1"
          >
            <div className="space-y-4">
              
              {/* Tag & Metric */}
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 font-mono">
                  {cs.tag}
                </span>
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                  {cs.metric}
                </span>
              </div>

              {/* Title & Desc */}
              <div className="space-y-2">
                <h3 className="text-base font-black text-[#072348] uppercase font-heading leading-snug group-hover:text-emerald-700 transition-colors">
                  {cs.title}
                </h3>
                <div className="text-xs font-semibold text-slate-500">
                  Đối tác: <strong className="text-slate-800">{cs.client}</strong>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {cs.desc}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cs.badges.map((b, bIdx) => (
                  <span
                    key={bIdx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10.5px] font-semibold"
                  >
                    {b}
                  </span>
                ))}
              </div>

            </div>

            {/* Bottom link */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Đơn vị thực thi: <strong className="text-slate-900">{cs.company}</strong></span>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
