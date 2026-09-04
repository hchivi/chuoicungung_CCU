import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, ArrowRight, CheckCircle2, ChevronRight, Sparkles, 
  Building2, Factory, Users, ShieldCheck, MapPin, Search, Compass,
  FolderOpen, Zap
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import HeroLifecycleWheel from '../components/HeroLifecycleWheel';
import InteractiveExplodedFlower3D from '../components/InteractiveExplodedFlower3D';
import ClickUpBrainMatrixSection from '../components/ClickUpBrainMatrixSection';
import { useLanguage } from '../contexts/LanguageContext';

export default function SixStagesMapPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-16 pb-24 bg-slate-50/60 font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION FOR BẢN ĐỒ 6 GIAI ĐOẠN (Luxury B2B Standard with 6-Petal Flower & Illustration) */}
      <section className="relative overflow-hidden pt-8 pb-14 md:py-16 bg-gradient-to-b from-white via-[#f4f8fe] to-[#eaf2fd] border-b border-slate-200">
        
        {/* Luxury Background Image Illustration Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: `url('/hero_luxury_bg.jpg')` }}
        ></div>

        {/* Ambient Glows */}
        <div className="absolute -top-10 left-1/4 w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-indigo-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          {/* Breadcrumb */}
          <div className="text-xs sm:text-sm text-slate-500 flex items-center space-x-2">
            <Link to="/" className="hover:text-blue-600 font-medium">{t('sixStagesPage.breadcrumbHome')}</Link>
            <span>&gt;</span>
            <span className="text-blue-600 font-bold font-heading uppercase">{t('sixStagesPage.breadcrumbTitle')}</span>
          </div>

          <div className="text-center max-w-7xl mx-auto space-y-3">
            {/* PROMINENT & LUXURY 1-LINE HEADLINE WITH 6-COLOR GRADIENT (NO DIACRITIC CLIPPING) */}
            <div className="w-full py-2">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[23px] 2xl:text-[25px] font-black text-[#072348] tracking-normal uppercase font-heading whitespace-nowrap text-center leading-[1.35]">
                <span className="inline-block py-0.5">{t('sixStagesPage.titlePart1')}</span>{' '}
                <span className="text-rainbow-gradient">{t('sixStagesPage.titlePart2')}</span>
              </h1>
            </div>

            {/* STRICTLY 1-LINE SUBTITLE */}
            <div className="w-full overflow-hidden">
              <p className="text-xs sm:text-sm md:text-[14.5px] text-slate-600 font-medium whitespace-nowrap text-center mx-auto tracking-normal">
                {t('sixStagesPage.subtitle')}
              </p>
            </div>
          </div>

          {/* 1. MONDAY.COM STYLE: 3D EXPLODED & ASSEMBLED FLOWER BLOSSOM VIEW */}
          <div className="pt-4">
            <InteractiveExplodedFlower3D />
          </div>

        </div>
      </section>

      {/* 2. CLICKUP BRAIN STYLE: 6-CARD INTERACTIVE MATRIX SECTION */}
      <ClickUpBrainMatrixSection />

      {/* 3. BOTTOM ACTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4">
        <div className="bg-gradient-to-r from-[#072847] to-blue-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-2">
            <h3 className="text-xl sm:text-2xl font-black uppercase font-heading">
              {lang === 'en' ? 'Unsure which phase your enterprise belongs to?' : 'Bạn chưa rõ doanh nghiệp mình thuộc pha nào?'}
            </h3>
            <p className="text-xs sm:text-sm text-blue-200">
              {lang === 'en' ? 'Use our 1-minute diagnostic wizard to accurately pinpoint your position in the supply chain.' : 'Sử dụng công cụ trắc nghiệm định vị 1 phút để xác định chính xác vai trò trong chuỗi cung ứng.'}
            </p>
          </div>
          <Link
            to="/dinh-vi-doanh-nghiep"
            className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold shadow-md transition font-heading uppercase whitespace-nowrap"
          >
            {lang === 'en' ? 'Start Free Diagnostic →' : 'Định vị ngay miễn phí →'}
          </Link>
        </div>
      </div>

    </div>
  );
}

