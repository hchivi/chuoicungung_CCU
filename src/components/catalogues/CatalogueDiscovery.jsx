import React, { useState } from 'react';
import { CATALOGUE_TYPES } from '../../data/cataloguesData';
import './CatalogueDiscovery.css';

export default function CatalogueDiscovery({ catalogues, resultCount, filters, categories, provinces, onFilterChange, onReset }) {
  const [expandedFilters, setExpandedFilters] = useState(false);
  const types = [{ id: 'ALL', shortName: 'Tất cả' }, ...Object.values(CATALOGUE_TYPES)];
  const advancedCount = ['category', 'province', 'format'].filter(key => filters[key] !== 'ALL').length;
  const hasFilters = filters.search || filters.type !== 'ALL' || filters.category !== 'ALL'
    || filters.province !== 'ALL' || filters.format !== 'ALL' || filters.archived;
  return (
    <section className="cl-discovery" aria-labelledby="cl-discovery-title">
      <div className="cl-heading">
        <h2 id="cl-discovery-title" className="font-heading">Thư viện ấn phẩm</h2>
        <p>Tra cứu theo ngành, địa bàn và chương trình kết nối.</p>
      </div>
      <nav className="cl-types" aria-label="Loại ấn phẩm">
        {types.map(type => (
          <button type="button" key={type.id} data-catalogue-type={type.id}
            aria-pressed={filters.type === type.id} aria-controls="cl-results"
            onClick={() => onFilterChange('type', type.id)}>
            <span>{type.shortName}</span>
            <span className="cl-type-count">{type.id === 'ALL' ? catalogues.length : catalogues.filter(c => c.catalogueType === type.id).length}</span>
          </button>
        ))}
      </nav>
      <div className="cl-field cl-type-mobile">
        <label htmlFor="cl-type">Loại ấn phẩm</label>
        <select id="cl-type" value={filters.type} onChange={event => onFilterChange('type', event.target.value)}>
          {types.map(type => <option key={type.id} value={type.id}>{type.shortName} ({type.id === 'ALL' ? catalogues.length : catalogues.filter(c => c.catalogueType === type.id).length})</option>)}
        </select>
      </div>
      <div className="cl-filter-panel">
        <div className="cl-search-row">
          <div className="cl-field cl-search">
            <label htmlFor="cl-search">Bạn muốn tìm ấn phẩm nào?</label>
            <div className="cl-search-input">
              <input id="cl-search" type="search" value={filters.search}
                placeholder="Tên ấn phẩm, KCN, ngành hoặc doanh nghiệp…"
                onChange={event => onFilterChange('search', event.target.value)} />
              {filters.search && <button type="button" aria-label="Xoá từ khoá tìm kiếm" onClick={() => onFilterChange('search', '')}>×</button>}
            </div>
          </div>
          <button type="button" className="cl-archive" aria-pressed={filters.archived}
            onClick={() => onFilterChange('archived', !filters.archived)}>
            {filters.archived ? 'Đang xem lưu trữ' : 'Ấn phẩm lưu trữ'}
          </button>
        </div>
        <button type="button" className="cl-more-filters" aria-expanded={expandedFilters} aria-controls="cl-advanced-filters"
          onClick={() => setExpandedFilters(value => !value)}>
          <span>{expandedFilters ? 'Thu gọn bộ lọc' : 'Lọc theo ngành, địa bàn'}{advancedCount > 0 ? ' (' + advancedCount + ')' : ''}</span>
          <span aria-hidden="true">{expandedFilters ? '−' : '+'}</span>
        </button>
        <div id="cl-advanced-filters" className={'cl-filters' + (expandedFilters ? ' is-expanded' : '')}>
          <div className="cl-field">
            <label htmlFor="cl-category">Chuyên mục ngành</label>
            <select id="cl-category" value={filters.category} onChange={event => onFilterChange('category', event.target.value)}>
              <option value="ALL">Tất cả chuyên mục</option>
              {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </div>
          <div className="cl-field">
            <label htmlFor="cl-province">Địa bàn / KCN</label>
            <select id="cl-province" value={filters.province} onChange={event => onFilterChange('province', event.target.value)}>
              <option value="ALL">Tất cả địa bàn</option>
              {provinces.map(province => <option key={province.id} value={province.id}>{province.name}</option>)}
            </select>
          </div>
          <div className="cl-field">
            <label htmlFor="cl-format">Định dạng</label>
            <select id="cl-format" value={filters.format} onChange={event => onFilterChange('format', event.target.value)}>
              <option value="ALL">Tất cả định dạng</option>
              <option value="ONLINE_ONLY">Bản số trực tuyến</option>
              <option value="PRINT_CONFIRMED">Bản in phát tay</option>
              <option value="BOTH">Song hành (Số &amp; Bản in)</option>
            </select>
          </div>
        </div>
        <div className="cl-filter-summary">
          <p role="status" aria-live="polite"><strong>{resultCount}</strong> ấn phẩm{filters.archived ? ' lưu trữ' : ' trong thư viện'}</p>
          <button type="button" className="cl-reset" disabled={!hasFilters} onClick={onReset}>Đặt lại</button>
        </div>
      </div>
    </section>
  );
}
