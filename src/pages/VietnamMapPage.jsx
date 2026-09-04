import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, Factory, ExternalLink, ChevronRight, Globe, Layers, MapPin, 
  Users, ShoppingBag, Check, ShieldCheck, Ship, Plane, Navigation, 
  SlidersHorizontal, Sparkles, Send, ArrowRight, Zap, Award
} from 'lucide-react';
import InteractiveVietnamMap from '../components/InteractiveVietnamMap';
import { vietnamMapRegions, topProvincesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function VietnamMapPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [activeSelection, setActiveSelection] = useState({ type: 'region', name: 'Toàn quốc' });
  const [flyToTarget, setFlyToTarget] = useState(null);
  const [activeMacroTab, setActiveMacroTab] = useState('all');

  const handleSelectRegion = (regName) => {
    setActiveSelection({ type: 'region', name: regName });
    setFlyToTarget({ type: 'region', name: regName, timestamp: Date.now() });
  };

  const handleSelectProvince = (provName) => {
    setActiveSelection({ type: 'province', name: provName });
    setFlyToTarget({ type: 'province', name: provName, timestamp: Date.now() });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased pb-16">
      
      {/* 1. High-Tech Dark Command Center Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 px-4 sm:px-6 lg:px-8 pt-5 pb-5">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Breadcrumb */}
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <Link to="/" className="hover:text-cyan-400 font-medium transition">Trang chủ</Link>
            <span>&gt;</span>
            <span className="text-cyan-400 font-bold font-heading uppercase tracking-wide">
              Sa Bàn Số GIS & Hạ Tầng KCN Việt Nam
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>HỆ THỐNG THÔNG TIN ĐỊA LÝ (GIS) B2B & FDI QUỐC GIA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white uppercase">
                Bản Đồ Hệ Sinh Thái Sản Xuất & KCN Việt Nam
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sa bàn số tương tác toàn cảnh phục vụ quyết định rót vốn của giới FDI. Tích hợp dữ liệu 480+ KCN, Cảng biển nước sâu, Sân bay quốc tế, mạng lưới Cao tốc và 32.000+ Nhà cung ứng 18 pha kỹ thuật.
              </p>
            </div>

            {/* 4 Macro FDI Stats Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center shrink-0">
              <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-inner">
                <span className="text-base sm:text-xl font-black text-cyan-400 font-mono block">480+</span>
                <span className="text-[10.5px] font-semibold text-slate-400 block">Khu Công Nghiệp</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-inner">
                <span className="text-base sm:text-xl font-black text-emerald-400 font-mono block">14.237</span>
                <span className="text-[10.5px] font-semibold text-slate-400 block">Nhà Máy FDI</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-inner">
                <span className="text-base sm:text-xl font-black text-purple-400 font-mono block">32.000+</span>
                <span className="text-[10.5px] font-semibold text-slate-400 block">NCC Đã KYC</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-inner">
                <span className="text-base sm:text-xl font-black text-amber-400 font-mono block">6 Cảng</span>
                <span className="text-[10.5px] font-semibold text-slate-400 block">Cảng Nước Sâu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Edge-to-Edge High-Tech GIS Command Center Workspace */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* Main Interactive Leaflet Map with Float Control & Slide-out Data Drawer */}
        <div className="w-full">
          <InteractiveVietnamMap 
            externalFlyTo={flyToTarget}
          />
        </div>

        {/* 3. Regional Investment Hubs & Logistics Corridors Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Hub 1: Miền Bắc */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
                HÀNH LANG MIỀN BẮC
              </span>
              <span className="text-xs text-slate-400 font-mono">165 KCN</span>
            </div>
            <h3 className="text-base font-black font-heading text-white group-hover:text-cyan-300 transition">
              Tam Giác Điện Tử & Bán Dẫn (Hà Nội - Bắc Ninh - Hải Phòng)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trọng điểm sản xuất điện thoại, chip bán dẫn và xe điện toàn cầu với Cảng nước sâu Lạch Huyện và Sân bay Nội Bài.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-300">
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-mono">Samsung SEV</span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-mono">Amkor</span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-mono">Foxconn</span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-mono">LG Tràng Duệ</span>
            </div>
            <button
              onClick={() => handleSelectRegion('Miền Bắc')}
              className="w-full pt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-between font-heading uppercase cursor-pointer"
            >
              <span>Phóng to Vùng Miền Bắc</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hub 2: Miền Nam */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-purple-500/40 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-800/60">
                ĐÔNG NAM BỘ & MEKONG
              </span>
              <span className="text-xs text-slate-400 font-mono">220 KCN</span>
            </div>
            <h3 className="text-base font-black font-heading text-white group-hover:text-purple-300 transition">
              Thủ Phủ Công Nghiệp & Mega Cargo Hub (Đồng Nai - Bình Dương - BRVT)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cửa ngõ kết nối Cảng Quốc Tế Cái Mép - Thị Vải và Đại Dự Án Sân Bay Quốc Tế Long Thành 5 triệu tấn hàng hóa.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-300">
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-mono">Becamex VSIP</span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-mono">Lego</span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-mono">Bosch</span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-mono">Cảng Cái Mép</span>
            </div>
            <button
              onClick={() => handleSelectRegion('Miền Nam')}
              className="w-full pt-2 text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center justify-between font-heading uppercase cursor-pointer"
            >
              <span>Phóng to Vùng Miền Nam</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hub 3: Miền Trung */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-emerald-500/40 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                DUYÊN HẢI MIỀN TRUNG
              </span>
              <span className="text-xs text-slate-400 font-mono">95 KCN</span>
            </div>
            <h3 className="text-base font-black font-heading text-white group-hover:text-emerald-300 transition">
              Hành Lang Kinh Tế Đông Tây & Lọc Hóa Dầu (Đà Nẵng - Quảng Ngãi - Nghệ An)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Đầu mối cảng biển Tiên Sa, Dung Quất, KCN VSIP Nghệ An và quỹ đất sạch dồi dào thu hút làn sóng FDI thế hệ mới.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-300">
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-mono">VSIP Nghệ An</span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-mono">Hòa Phát Dung Quất</span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-mono">Luxshare-ICT</span>
            </div>
            <button
              onClick={() => handleSelectRegion('Miền Trung')}
              className="w-full pt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-between font-heading uppercase cursor-pointer"
            >
              <span>Phóng to Vùng Miền Trung</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* 4. Bottom Strategic Call To Action */}
        <div className="bg-gradient-to-r from-slate-900 via-[#072847] to-cyan-950 rounded-3xl p-8 sm:p-10 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
              Cần Khảo Sát Vị Trí Đặt Nhà Máy Hoặc Thuê Đất KCN?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kết nối trực tiếp Ban Quản lý 480+ Khu Công Nghiệp và các Tổng thầu Xây dựng, MEP trong quy trình 18 Pha kỹ thuật.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/dang-nhu-cau"
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition font-heading uppercase"
            >
              Đăng Nhu Cầu Thuê Đất (Pha 1.3) →
            </Link>

            <Link
              to="/khu-cong-nghiep"
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition font-heading"
            >
              Xem Danh Sách 480+ KCN
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
