import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Printer, 
  Globe, 
  Download, 
  ArrowRight, 
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { CATALOGUE_TYPES, CATALOGUE_STATUSES } from '../../data/cataloguesData';

export default function CatalogueCard({ 
  catalogue, 
  onQuickViewOnline,
  onDownloadPdf 
}) {
  if (!catalogue) return null;

  const currentEdition = (catalogue.editions || []).find(e => e.id === catalogue.currentEditionId) || catalogue.editions?.[0];
  const typeConfig = CATALOGUE_TYPES[catalogue.catalogueType] || CATALOGUE_TYPES.CATEGORY_CATALOGUE;
  const statusConfig = CATALOGUE_STATUSES[catalogue.status] || CATALOGUE_STATUSES.PUBLISHED_DIGITAL;

  // Filter approved entries only (Section 14)
  const approvedEntries = (currentEdition?.entries || []).filter(e => e.approvalStatus === 'APPROVED');
  const totalApprovedCount = approvedEntries.length > 0 ? approvedEntries.length : (currentEdition?.entriesCount || 0);

  // Format label
  const formatLabel = currentEdition?.format === 'ONLINE_ONLY' 
    ? 'Bản Số Trực Tuyến' 
    : currentEdition?.format === 'PRINT_CONFIRMED' 
      ? 'Bản In Phát Tay' 
      : 'Song Hành (Số & Bản In)';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* 1. Cover Image & Badges (Consistent Ratio per Section 53) */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full bg-slate-900 overflow-hidden">
        <img 
          src={catalogue.coverUrl || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80'} 
          alt={catalogue.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {/* Catalogue Type */}
          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider border shadow-sm ${typeConfig.badgeClass}`}>
            {typeConfig.shortName}
          </span>

          {/* Status Badge */}
          <span className="px-2.5 py-1 rounded-xl text-[10.5px] font-bold bg-white/95 text-slate-800 border border-slate-200 shadow-sm flex items-center space-x-1 backdrop-blur-xs">
            <span className={`w-2 h-2 rounded-full ${
              catalogue.status === 'DISTRIBUTING' ? 'bg-sky-500 animate-pulse' :
              catalogue.status === 'PRINTED' ? 'bg-teal-500' :
              catalogue.status === 'PUBLISHED_DIGITAL' ? 'bg-emerald-500' : 'bg-amber-500'
            }`} />
            <span>{statusConfig.label}</span>
          </span>
        </div>

        {/* Bottom Cover Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-sky-400" />
              <span>Phát hành: {currentEdition?.publicationDate ? new Date(currentEdition.publicationDate).toLocaleDateString('vi-VN') : '2026'}</span>
            </div>
            <div className="text-xs font-black text-amber-300 font-mono mt-0.5">
              {currentEdition?.editionCode || 'ED-2026-V1'}
            </div>
          </div>

          <div className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/20 text-[10px] font-bold text-white flex items-center space-x-1">
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>{formatLabel}</span>
          </div>
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2.5">
          {/* Topic / Program Tag */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-100">
              {catalogue.categoryName || 'Chuyên mục công nghiệp'}
            </span>
            {catalogue.industrialParkName && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-100 flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{catalogue.industrialParkName}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#0052cc] transition-colors line-clamp-2 leading-snug font-heading">
            <Link to={`/catalogue/${catalogue.slug}`}>
              {catalogue.title}
            </Link>
          </h2>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {catalogue.shortDescription}
          </p>

          {/* Related Program if any (Section 9 & 23) */}
          {catalogue.programTitle && (
            <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <div className="truncate">
                <span className="font-bold">Chương trình liên kết: </span>
                <span>{catalogue.programTitle}</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Verified Statistics Strip (Section 9 & 10) */}
        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
          
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Hồ sơ đã duyệt:</span>
            </span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
              {totalApprovedCount} doanh nghiệp
            </span>
          </div>

          {/* Section 10 Rule: ONLY show confirmed print quantity, never planned as actual! */}
          {currentEdition?.confirmedPrintQuantity > 0 && (
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center space-x-1.5">
                <Printer className="w-3.5 h-3.5 text-purple-600" />
                <span>Số bản in xác nhận:</span>
              </span>
              <span className="font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md font-mono">
                {currentEdition.confirmedPrintQuantity.toLocaleString()} cuốn
                {currentEdition.distributedQuantity > 0 && (
                  <span className="text-[10px] text-slate-500 font-normal ml-1">
                    (đã giao {currentEdition.distributedQuantity.toLocaleString()})
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Publisher */}
          <div className="text-[11px] text-slate-500 truncate pt-1">
            <span className="text-slate-400">Chủ trì: </span>
            <span className="font-medium text-slate-700">{catalogue.publisherName}</span>
          </div>
        </div>

        {/* 4. Action Buttons (Section 9 & 41) */}
        <div className="pt-2 flex items-center space-x-2">
          
          {/* Main CTA: View Catalogue (Page 31 Detail) */}
          <Link
            to={`/catalogue/${catalogue.slug}`}
            className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm group/btn"
          >
            <span>Xem Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>

          {/* Secondary CTA: Quick Online View (Section 11) */}
          <button
            onClick={() => onQuickViewOnline && onQuickViewOnline(catalogue)}
            type="button"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center"
            title="Xem nhanh bản số tương tác (Digital Preview)"
          >
            <Globe className="w-4 h-4 text-slate-600" />
          </button>

          {/* Secondary CTA: Download PDF if available (Section 42) */}
          {currentEdition?.fileUrl && (
            <button
              onClick={() => onDownloadPdf && onDownloadPdf(catalogue, currentEdition)}
              type="button"
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition flex items-center justify-center border border-emerald-200"
              title={`Tải bản PDF (${currentEdition.fileSize || 'PDF'})`}
            >
              <Download className="w-4 h-4 text-emerald-600" />
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
