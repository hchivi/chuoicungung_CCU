import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, ChevronDown, Search, X } from 'lucide-react';
import { slugify } from '../../pages/IndustryCategoryPage';
import { findDirectoryCategories } from './supplierDirectoryModel';

export default function SupplierDirectoryExplorer({ phases, categories, letters, keywords, selectedLetter, effectivePhase, effectiveStage, selectedCategory, selectedKeyword, letterCounts, onAllPhases, onStage, onPhase, onLetter, onCategory, onKeyword, lang }) {
  const [expanded, setExpanded] = useState(true);
  // Floating-panel visibility must not remove in-flow content and shift result controls.
  const [stickyExpanded, setStickyExpanded] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [navHeight, setNavHeight] = useState(106);
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const anchorRef = useRef(null);
  const pinnedRef = useRef(null);
  const wasStickyRef = useRef(false);

  const categoryMatches = useMemo(() => findDirectoryCategories(categories, query), [categories, query]);
  const visibleCategories = query || showAll ? categoryMatches : categoryMatches.slice(0, 60);
  const english = lang === 'en';

  useEffect(() => {
    const updateNavHeight = () => {
      const header = document.querySelector('header.sticky') || document.querySelector('header');
      if (header) {
        setNavHeight(header.offsetHeight);
      }
    };
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);

    const handleScroll = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      const header = document.querySelector('header.sticky') || document.querySelector('header');
      const currentNavH = header ? header.offsetHeight : 106;

      // When the top of block image 4 scrolls past the bottom of the sticky navbar:
      if (rect.top <= currentNavH + 10) {
        if (!wasStickyRef.current) {
          wasStickyRef.current = true;
          setIsSticky(true);
          setStickyExpanded(false);
        }
      } else if (rect.top > currentNavH + 30) {
        // When the user scrolls back up and reaches block image 4:
        if (wasStickyRef.current) {
          wasStickyRef.current = false;
          setIsSticky(false);
          setStickyExpanded(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('resize', updateNavHeight);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Keep the filter frame below the actual header + A–Z bar, including expansion.
  useEffect(() => {
    const root = anchorRef.current?.closest('.sd-directory');
    if (!root) return;
    const update = () => root.style.setProperty('--sd-sidebar-top', `${navHeight + (pinnedRef.current?.offsetHeight || 0) + 12}px`);
    update();
    const observer = new ResizeObserver(update);
    if (pinnedRef.current) observer.observe(pinnedRef.current);
    return () => { observer.disconnect(); root.style.removeProperty('--sd-sidebar-top'); };
  }, [isSticky, navHeight]);

  const renderColumns = () => (
    <div className="sd-catalogue-columns">
      <div className="sd-industry-panel">
        <div className="sd-panel-head"><h3>{english ? 'Industries' : 'Nhóm ngành'}{selectedLetter !== 'TẤT CẢ' && <span> / {selectedLetter}</span>}</h3><span>{categoryMatches.length.toLocaleString('vi-VN')} {english ? 'categories' : 'danh mục'}</span></div>
        <label className="sd-category-search"><span className="sr-only">Tìm trong danh mục ngành</span><Search size={18} aria-hidden="true" /><input aria-label="Tìm trong danh mục ngành" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={english ? 'E.g. packaging, CNC' : 'Ví dụ: bao bì, cơ khí, đồng phục'} /></label>
        {selectedCategory !== 'all' && <button className="sd-clear-filter" onClick={() => onCategory?.('all')}>{selectedCategory}<X size={16} aria-hidden="true" /></button>}
        <div className="sd-industry-list" aria-label="Danh sách nhóm ngành" tabIndex={0}>
          {visibleCategories.map((category, index) => <Link key={`${category.name}-${index}`} to={`/nganh-nghe/${slugify(category.name)}?name=${encodeURIComponent(category.name)}`} title={category.name}>
            <span>{category.name}</span><span className="sd-category-count">{Number(category.count || 0).toLocaleString('vi-VN')}<ArrowUpRight size={14} aria-hidden="true" /></span>
          </Link>)}
          {visibleCategories.length === 0 && <div className="sd-small-empty"><p>{english ? 'No matching industry. Try a different name.' : 'Chưa có ngành khớp với tên này. Thử tên khác hoặc đổi chữ cái.'}</p><button className="sd-text-button" onClick={() => { setQuery(''); onLetter?.('TẤT CẢ'); }}>{english ? 'Reset category search' : 'Xoá tìm kiếm danh mục'}</button></div>}
        </div>
        {!query && !showAll && categoryMatches.length > 60 && <button className="sd-text-button sd-more" onClick={() => setShowAll(true)}>{english ? 'Show all industries' : `Xem đủ ${categoryMatches.length.toLocaleString('vi-VN')} danh mục`}<ChevronDown size={16} /></button>}
      </div>
      <div className="sd-keyword-panel">
        <div className="sd-panel-head"><h3>{english ? 'Related keywords' : 'Từ khoá liên quan'}</h3></div>
        <p>{effectivePhase !== 'all' ? `${english ? 'For phase' : 'Theo pha'} ${effectivePhase}` : (english ? 'Product & service suggestions' : 'Gợi ý sản phẩm & dịch vụ')}</p>
        {selectedKeyword && <button className="sd-clear-filter" onClick={() => onKeyword?.('')}>{selectedKeyword}<X size={16} /></button>}
        <div className="sd-keyword-list" tabIndex={0} aria-label="Danh sách từ khoá liên quan">{keywords.map((keyword, index) => {
          const value = keyword.query || keyword.labelVi;
          return <Link key={index} to={`/tu-khoa/${slugify(value)}?q=${encodeURIComponent(value)}`}><Search size={15} aria-hidden="true" /><span>{english ? keyword.labelEn || keyword.labelVi : keyword.labelVi}</span><ArrowUpRight size={15} aria-hidden="true" /></Link>;
        })}</div>
      </div>
    </div>
  );

  return <div className="sd-explorer relative" data-supplier-explorer>
    <section className="sd-phase-section" aria-labelledby="sd-phase-title">
      <div className="sd-section-head">
        <div><h2 id="sd-phase-title">{english ? 'Find suppliers for your lifecycle phase' : 'Tìm nguồn đúng pha vòng đời'}</h2><p>{english ? '6 stages · 18 phases. Select the work you need.' : '6 giai đoạn · 18 pha. Chọn công việc doanh nghiệp đang cần.'}</p></div>
        <button className="sd-button sd-button-outline" onClick={onAllPhases} aria-pressed={effectiveStage === 'all' && effectivePhase === 'all'}>{english ? 'All 18 phases' : 'Tất cả 18 pha'}</button>
      </div>
      <div className="sd-stage-grid">
        {[1, 2, 3, 4, 5, 6].map(stage => {
          const group = phases.filter(phase => phase.stage === stage);
          return <div className="sd-stage" data-stage={stage} key={stage} data-selected={effectiveStage === String(stage)}>
            <button className="sd-stage-heading" onClick={() => onStage?.(String(stage))} aria-pressed={effectiveStage === String(stage)}>
              <span className="sd-stage-number">{String(stage).padStart(2, '0')}</span>
              <strong>{english ? ['Preparation & Investment', 'Design & Construction', 'Installation & Completion', 'Production & Operations', 'People & Welfare', 'Expansion & Transformation'][stage - 1] : group[0]?.stageName}</strong>
            </button>
            <div className="sd-phase-options">{group.map(phase => <button key={phase.id} data-phase={phase.id} aria-pressed={effectivePhase === phase.id} onClick={() => onPhase?.(phase.id, String(stage))} title={english ? phase.enTitle : phase.title}>
              <span className="sd-phase-id">{phase.id}</span><span>{(english ? phase.enTitle || phase.title : phase.title).replace(/^\d\.\d\s*/, '')}</span>
              {effectivePhase === phase.id && <Check size={14} aria-hidden="true" />}
            </button>)}</div>
          </div>;
        })}
      </div>
    </section>

    {/* Anchor sentinel positioned right before Section 2 (Block Image 4) */}
    <div ref={anchorRef} id="block-image-4-anchor" className="h-0 w-full" />

    {/* In-flow Section 2 (Block Image 4) */}
    <section className="sd-catalogue" aria-labelledby="sd-catalogue-title">
      <div className="sd-section-head">
        <div><h2 id="sd-catalogue-title">{english ? 'Industry directory, A–Z' : 'Danh mục ngành nghề A–Z'}</h2><p>{english ? 'Browse by industry or explore related keywords.' : 'Tra cứu theo tên ngành. Đi sâu bằng từ khoá sản phẩm, dịch vụ.'}</p></div>
        <button className="sd-text-button" aria-expanded={expanded} aria-controls="sd-catalogue-content" onClick={() => setExpanded(value => !value)}>{expanded ? (english ? 'Collapse' : 'Thu gọn A–Z') : (english ? 'Expand' : 'Mở danh mục')}<ChevronDown size={16} className={expanded ? 'sd-chevron-open' : ''} /></button>
      </div>
      {expanded && <div id="sd-catalogue-content">
        <div className="sd-alphabet" aria-label="Bảng chữ cái ngành nghề">
          <button aria-pressed={selectedLetter === 'TẤT CẢ'} onClick={() => { onLetter?.('TẤT CẢ'); setQuery(''); }}>{english ? 'All' : 'Tất cả'}</button>
          {letters.map(letter => <button key={letter} aria-pressed={selectedLetter === letter} onClick={() => { onLetter?.(letter); setQuery(''); setShowAll(false); }} title={`${letter}: ${(letterCounts[letter] || 0).toLocaleString('vi-VN')} lượt trong danh mục`}>{letter}</button>)}
        </div>
        {renderColumns()}
      </div>}
    </section>

    {/* Pinned Sticky Bar for Block Image 4 (Appears when scrolled down, collapsed by default, expandable on demand) */}
    {isSticky && (
      <div
        ref={pinnedRef}
        data-expanded={stickyExpanded}
        className="sd-catalogue-pinned fixed left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-md transition-all duration-200"
        style={{ top: `${navHeight}px` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-slate-900 font-heading whitespace-nowrap">
                {english ? 'A–Z Directory' : 'Danh mục A–Z'}
              </span>
              {selectedLetter && selectedLetter !== 'TẤT CẢ' && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold">
                  {selectedLetter}
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-medium max-w-[140px] truncate">
                  {selectedCategory}
                </span>
              )}
            </div>

            <div className="sd-alphabet !p-0 !border-0 flex-1 max-w-3xl overflow-x-auto no-scrollbar py-0.5">
              <button
                aria-pressed={selectedLetter === 'TẤT CẢ'}
                onClick={() => { onLetter?.('TẤT CẢ'); setQuery(''); }}
                className="!min-w-[42px] !h-8 !p-1 text-xs"
              >
                {english ? 'All' : 'Tất cả'}
              </button>
              {letters.map(letter => (
                <button
                  key={letter}
                  aria-pressed={selectedLetter === letter}
                  onClick={() => { onLetter?.(letter); setQuery(''); setShowAll(false); }}
                  title={`${letter}: ${(letterCounts[letter] || 0).toLocaleString('vi-VN')} lượt`}
                  className="!min-w-[30px] !h-8 !p-1 text-xs"
                >
                  {letter}
                </button>
              ))}
            </div>

            <button
              className="sd-text-button !min-h-8 !py-1 !px-2.5 text-xs shrink-0 whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              onClick={() => setStickyExpanded(value => !value)}
              aria-expanded={stickyExpanded}
              aria-controls="sd-pinned-catalogue-content"
              title={stickyExpanded ? (english ? 'Collapse' : 'Thu gọn') : (english ? 'Expand' : 'Mở danh mục')}
            >
              <span>{stickyExpanded ? (english ? 'Collapse' : 'Thu gọn') : (english ? 'Expand' : 'Mở rộng')}</span>
              <ChevronDown size={14} className={stickyExpanded ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
          </div>

          {stickyExpanded && (
            <div id="sd-pinned-catalogue-content" className="mt-3 pt-3 border-t border-slate-200/80 max-h-[55vh] overflow-y-auto bg-white rounded-2xl p-4 shadow-xl border border-slate-200 animate-in fade-in duration-200">
              {renderColumns()}
            </div>
          )}
        </div>
      </div>
    )}
  </div>;
}
