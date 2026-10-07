import React, { useState } from 'react';
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { PROGRAM_TYPES, PROGRAM_STATUSES, PROGRAM_ZONES, PROGRAM_INDUSTRIES, PROGRAM_ROLES, PROGRAM_FORMATS } from '../../data/programsData';
import './ProgramDiscovery.css';

const types = {
  all: ['Tất cả', 'Khám phá các cơ hội kết nối'],
  'ngay-hoi-chuoi-cung-ung': ['Ngày hội', 'Gặp nhà máy và nhà cung ứng'],
  'gap-nha-cung-ung': ['Kết nối 1:1', 'Trao đổi trực tiếp theo nhu cầu'],
  'gian-hang-hoi-cho': ['Triển lãm', 'Gian hàng tại hội chợ, triển lãm'],
  'hoi-thao-pitching': ['Hội thảo', 'Chia sẻ chuyên môn, trình bày năng lực'],
  'phuc-loi-cong-dong': ['Phúc lợi', 'Hoạt động dành cho cộng đồng'],
};

export default function ProgramDiscoveryMenu({ programs, resultCount, activeType, filters, onTypeChange, onFilterChange, onReset, hasActiveFilters }) {
  const [extraOpen, setExtraOpen] = useState(false);
  const extraCount = ['role', 'format', 'time'].filter(key => filters[key] && filters[key] !== 'all').length;
  const select = (key, label, options, fallback = 'all') => <label className="pd-filter" htmlFor={`pd-${key}`}><span>{label}</span><select id={`pd-${key}`} value={filters[key] || fallback} onChange={event => onFilterChange(key, event.target.value)}>{options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}</select></label>;
  return <div className="pd-menu">
    <header className="pd-section-heading"><h2>Cuộc gặp tiếp theo của doanh nghiệp.</h2><p>Chọn đúng nhu cầu. Tìm chương trình đáng dành thời gian.</p></header>
    <nav className="pd-type-nav" aria-label="Loại chương trình">
      {PROGRAM_TYPES.map(type => { const [label, caption] = types[type.id]; const count = type.id === 'all' ? programs.length : programs.filter(program => program.type === type.id).length;
        return <button key={type.id} data-program-type={type.id} aria-label={`${type.name}, ${count} chương trình`} aria-pressed={activeType === type.id} onClick={() => onTypeChange(type.id)}><span className="pd-type-top"><strong>{label}</strong><b>{count}</b></span><small>{caption}</small></button>;
      })}
    </nav>
    <div className="pd-filter-panel">
      <div className="pd-main-filters">
        <label className="pd-search" htmlFor="pd-search"><span>Tìm chương trình hoặc nhu cầu</span><div><Search size={19} aria-hidden="true" /><input id="pd-search" type="search" placeholder="Tên chương trình, KCN, CNC…" value={filters.search || ''} onChange={event => onFilterChange('search', event.target.value)} />{filters.search && <button aria-label="Xoá từ khoá tìm kiếm" onClick={() => onFilterChange('search', '')}><X size={17} /></button>}</div></label>
        {select('zone', 'Địa bàn / KCN', PROGRAM_ZONES)}
        {select('industry', 'Ngành hàng / nhu cầu', PROGRAM_INDUSTRIES.map(name => ({ id: name, name })), 'Tất cả ngành hàng')}
        {select('status', 'Trạng thái', [{ id: 'all', name: 'Tất cả trạng thái' }, ...PROGRAM_STATUSES])}
      </div>
      <div className="pd-filter-summary"><p aria-live="polite" aria-atomic="true"><strong>{resultCount}</strong> / {programs.length} chương trình</p><div><button className="pd-text-button" aria-expanded={extraOpen} aria-controls="pd-extra-filters" onClick={() => setExtraOpen(!extraOpen)}><SlidersHorizontal size={16} aria-hidden="true" />Lọc thêm{extraCount > 0 && <b>{extraCount}</b>}</button>{hasActiveFilters && <button className="pd-text-button" onClick={onReset}><RotateCcw size={15} aria-hidden="true" />Đặt lại</button>}</div></div>
      <div id="pd-extra-filters" className="pd-extra-filters" hidden={!extraOpen}>
        {select('role', 'Vai trò tham gia', PROGRAM_ROLES)}
        {select('format', 'Hình thức tổ chức', PROGRAM_FORMATS)}
        {select('time', 'Thời gian', [{ id: 'all', name: 'Tất cả thời gian' }, { id: 'upcoming', name: 'Sắp diễn ra' }, { id: 'past', name: 'Đã diễn ra' }])}
      </div>
    </div>
  </div>;
}
