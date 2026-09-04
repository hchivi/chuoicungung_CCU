import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, Calendar, Download, Building2, 
  Factory, ShoppingBag, DollarSign, Layers, MapPin, 
  AlertTriangle, ArrowUpRight, ChevronRight, Sparkles, Filter
} from 'lucide-react';
import { marketAlertsData, topProvincesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function MarketDashboardPage() {
  const { t, lang } = useLanguage();
  const [timeRange, setTimeRange] = useState('30'); // '7' | '30' | '90' | '365'

  return (
    <div className="space-y-8 pb-20 pt-6 font-sans">
      
      {/* Breadcrumb & Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-xs text-slate-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600 font-medium">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
          <span>&gt;</span>
          <span className="text-blue-600 font-bold font-heading">{lang === 'en' ? 'Market Analytics Dashboard' : 'Dashboard Thị trường'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {lang === 'en' ? 'National Industrial Market Dashboard' : 'Dashboard Phân tích Thị trường'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === 'en' 
                ? 'Real-time data feeds and supply chain intelligence across Vietnam manufacturing ecosystem.' 
                : 'Cập nhật dữ liệu thời gian thực về hệ sinh thái chuỗi cung ứng sản xuất toàn quốc.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 font-heading">
            <select className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700">
              <option>{lang === 'en' ? 'Nationwide' : 'Toàn quốc'}</option>
              <option>{lang === 'en' ? 'Northern Key Zone' : 'Miền Bắc'}</option>
              <option>{lang === 'en' ? 'Southern Key Zone' : 'Miền Nam'}</option>
              <option>{lang === 'en' ? 'Central Key Zone' : 'Miền Trung'}</option>
            </select>

            <button 
              onClick={() => alert(lang === 'en' ? "Exporting market intelligence report PDF/Excel..." : "Xuất báo cáo phân tích thị trường PDF/Excel")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1.5 uppercase"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Export Report' : 'Xuất báo cáo'}</span>
            </button>
          </div>
        </div>

        {/* 6 Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'Industrial Parks' : 'Khu công nghiệp'}</span>
            <div className="text-xl font-black text-slate-900 font-mono">416</div>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> ▲ 12 (2.97%)
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'Factories' : 'Nhà máy'}</span>
            <div className="text-xl font-black text-slate-900 font-mono">10,256</div>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> ▲ 256 (2.56%)
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'Enterprises' : 'Doanh nghiệp'}</span>
            <div className="text-xl font-black text-slate-900 font-mono">128,540</div>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> ▲ 1,245 (0.98%)
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'Active Demands' : 'Nhu cầu đang mở'}</span>
            <div className="text-xl font-black text-slate-900 font-mono">1,256</div>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> ▲ 68 (5.72%)
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'Closed Deals' : 'GD Thành công'}</span>
            <div className="text-xl font-black text-slate-900 font-mono">2,847</div>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> ▲ 342 (13.68%)
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'Total GMV' : 'Tổng giá trị GD'}</span>
            <div className="text-xl font-black text-blue-700 font-mono">8.756B VND</div>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> ▲ 1.256B (16.7%)
            </span>
          </div>
        </div>
      </div>

      {/* Charts Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Row 1: Phân bổ theo khu vực, Xu hướng nhu cầu, Cơ cấu nhu cầu theo ngành */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Phân bổ theo khu vực */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 font-heading">{lang === 'en' ? 'Regional Distribution' : 'Phân bổ theo khu vực'}</h3>
              <Link to="/ban-do-viet-nam" className="text-[11px] text-blue-600 font-semibold hover:underline font-heading">
                {lang === 'en' ? 'View Map →' : 'Xem trên bản đồ →'}
              </Link>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { name: lang === 'en' ? "Northern Region" : "Miền Bắc", count: "4,256", pct: "41.5%", col: "bg-sky-500" },
                { name: lang === 'en' ? "Central Region" : "Miền Trung", count: "1,256", pct: "12.2%", col: "bg-emerald-500" },
                { name: lang === 'en' ? "Southern Region" : "Miền Nam", count: "4,956", pct: "48.3%", col: "bg-amber-500" },
                { name: lang === 'en' ? "Central Highlands" : "Tây Nguyên", count: "456", pct: "4.5%", col: "bg-purple-500" },
                { name: lang === 'en' ? "Mekong Delta" : "Đồng bằng Sông Cửu Long", count: "356", pct: "3.5%", col: "bg-rose-500" }
              ].map(reg => (
                <div key={reg.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-slate-700 flex items-center">
                      <span className={`w-2 h-2 rounded-full ${reg.col} mr-1.5`}></span>
                      {reg.name}
                    </span>
                    <strong className="text-slate-900 font-mono">{reg.count} ({reg.pct})</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: reg.pct }} className={`h-full ${reg.col} rounded-full`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Xu hướng nhu cầu theo thời gian */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 font-heading">{lang === 'en' ? 'Sourcing Trends' : 'Xu hướng nhu cầu'}</h3>
              <div className="flex space-x-1 font-mono">
                {["7", "30", "90"].map(d => (
                  <button 
                    key={d} 
                    onClick={() => setTimeRange(d)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${timeRange === d ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {d} {lang === 'en' ? 'days' : 'ngày'}
                  </button>
                ))}
              </div>
            </div>

            {/* Line chart mock vector */}
            <div className="h-36 flex items-end justify-between px-2 pt-4">
              {[350, 420, 580, 510, 690, 840, 720, 950].map((v, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  <div style={{ height: `${v / 10}px` }} className="w-3 bg-blue-600 rounded-t"></div>
                  <span className="text-[8px] text-slate-400 font-mono">{`0${idx*3+1}`}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100 text-[10px]">
              <div>
                <span className="text-slate-400 block font-heading">{lang === 'en' ? 'Total RFQs' : 'Tổng nhu cầu'}</span>
                <strong className="text-slate-900 text-xs font-mono">1,256</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-heading">{lang === 'en' ? 'New RFQs' : 'Nhu cầu mới'}</span>
                <strong className="text-emerald-600 text-xs font-mono">842</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-heading">{lang === 'en' ? 'Connected' : 'Đã kết nối'}</span>
                <strong className="text-blue-600 text-xs font-mono">414</strong>
              </div>
            </div>
          </div>

          {/* Cơ cấu nhu cầu theo ngành */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-extrabold text-slate-900 font-heading">{lang === 'en' ? 'Demands by Industry' : 'Cơ cấu nhu cầu theo ngành'}</h3>

            <div className="space-y-2 pt-1">
              {[
                { name: lang === 'en' ? "Mechanical & Precision Machining" : "Cơ khí chế tạo", pct: 25, count: 314 },
                { name: lang === 'en' ? "Electrical & Electronics" : "Điện – Điện tử", pct: 20, count: 251 },
                { name: lang === 'en' ? "Industrial Construction & MEP" : "Xây dựng công nghiệp", pct: 15, count: 188 },
                { name: lang === 'en' ? "Plastics & Rubber" : "Nhựa – Cao su", pct: 12, count: 151 },
                { name: lang === 'en' ? "Packaging & Commercial Printing" : "Bao bì – In ấn", pct: 8, count: 101 },
                { name: lang === 'en' ? "Textile, Garment & Footwear" : "Dệt may & Da giày", pct: 7, count: 88 },
                { name: lang === 'en' ? "Food & Beverage Processing" : "Thực phẩm – Đồ uống", pct: 6, count: 75 },
                { name: lang === 'en' ? "Other Logistics & Chemicals" : "Khác", pct: 7, count: 88 }
              ].map(ind => (
                <div key={ind.name} className="flex justify-between items-center text-[11px]">
                  <span className="font-medium text-slate-700">{ind.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 font-mono">{ind.pct}%</span>
                    <span className="text-slate-400 text-[10px] font-mono">({ind.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Row 2: Top tỉnh thành & Cảnh báo thị trường */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Top tỉnh thành theo hoạt động */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 font-heading">{lang === 'en' ? 'Top Industrial Provinces by Volume' : 'Top tỉnh / thành theo hoạt động'}</h3>
              <Link to="/ban-do-viet-nam" className="text-blue-600 hover:underline font-heading">{lang === 'en' ? 'View all →' : 'Xem tất cả →'}</Link>
            </div>

            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold font-heading">
                <tr>
                  <th className="p-2.5">{lang === 'en' ? 'Province / City' : 'Tỉnh / Thành'}</th>
                  <th className="p-2.5 text-center">{lang === 'en' ? 'IPs' : 'KCN'}</th>
                  <th className="p-2.5 text-center">{lang === 'en' ? 'Factories' : 'Nhà máy'}</th>
                  <th className="p-2.5 text-right">{lang === 'en' ? 'Enterprises' : 'Doanh nghiệp'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProvincesData.map(p => (
                  <tr key={p.name} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-800 font-heading">{p.name}</td>
                    <td className="p-2.5 text-center text-blue-600 font-semibold font-mono">{p.kcn}</td>
                    <td className="p-2.5 text-center text-emerald-600 font-semibold font-mono">{p.factories}</td>
                    <td className="p-2.5 text-right font-mono text-slate-700">{p.enterprises.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cảnh báo & Thông tin thị trường */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-extrabold text-slate-900 font-heading">{lang === 'en' ? 'Industrial Market Alerts & Bulletins' : 'Cảnh báo & Thông tin thị trường'}</h3>

            <div className="space-y-3">
              {marketAlertsData.map((alert, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-900 font-bold font-heading">{alert.title}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{alert.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

