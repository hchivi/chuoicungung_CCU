import React, { useState } from 'react';
import { Check, ChevronDown, Filter, RotateCcw } from 'lucide-react';

export default function SupplierDirectoryFilters({ selectedKyc, selectedProvince, selectedPhase, selectedStage, phases, provinces, quickProvinces, filters, onChange, onToggle, onReset, activeCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="sd-filters" data-supplier-filters>
    <div className="sd-filter-heading"><h2><Filter size={18} />Bộ lọc{activeCount > 0 && <span>{activeCount}</span>}</h2><button className="sd-text-button" onClick={onReset} aria-label="Đặt lại tất cả bộ lọc"><RotateCcw size={15} />Đặt lại</button></div>
    <button className="sd-mobile-filter-toggle" aria-expanded={mobileOpen} aria-controls="sd-filter-body" onClick={() => setMobileOpen(value => !value)}>{mobileOpen ? 'Thu gọn bộ lọc' : 'Mở bộ lọc chi tiết'}<ChevronDown size={16} /></button>
    <div id="sd-filter-body" className="sd-filter-body" data-mobile-open={mobileOpen}>
      <fieldset><legend>Cấp độ xác thực KYC</legend>
        {[['all', 'Tất cả cấp độ', 'Không giới hạn cấp độ'], ['diamond', 'Kim cương', 'Hiệp hội / BNI'], ['gold', 'Vàng', 'Nhà xưởng / thực địa'], ['silver', 'Bạc', 'Pháp nhân & mã số thuế']].map(([id, label, note]) => <label className="sd-radio-row" key={id}>
          <input type="radio" name="supplier-kyc" value={id} checked={selectedKyc === id} onChange={() => onChange({ kyc: id })} /><span><strong>{label}</strong>{id !== 'all' && <small>{note}</small>}</span>{selectedKyc === id && <Check size={15} aria-hidden="true" />}
        </label>)}
      </fieldset>
      <fieldset><legend>Hạ tầng & tiêu chuẩn</legend>
        {[['api', 'filter-api-ready', 'Sẵn sàng kết nối API / ERP'], ['fast', 'filter-fast-quote', 'Báo giá nhanh 24h'], ['iso', 'filter-iso-certified', 'Chứng nhận ISO / ESG']].map(([key, id, label]) => <label className="sd-checkbox-row" htmlFor={id} key={id}><input id={id} type="checkbox" checked={filters[key]} onChange={event => onToggle(key, event.target.checked)} /><span>{label}</span></label>)}
      </fieldset>
      <fieldset><legend>Khu vực địa lý</legend><div className="sd-provinces">{quickProvinces.map(province => <button key={province} aria-pressed={selectedProvince === province} onClick={() => onChange({ province })}>{province === 'Toàn quốc' ? 'Tất cả' : province}</button>)}</div>
        <label className="sd-field-label" htmlFor="filter-province-select">Chọn tỉnh / thành</label><select id="filter-province-select" value={selectedProvince} onChange={event => onChange({ province: event.target.value })}>{provinces.map(province => <option key={province} value={province}>{province}</option>)}</select>
      </fieldset>
      <fieldset><legend>Pha vòng đời</legend><label className="sr-only" htmlFor="sd-filter-phase">Chọn pha vòng đời</label><select id="sd-filter-phase" value={selectedPhase} onChange={event => { const phase = phases.find(item => item.id === event.target.value); onChange({ phase: phase?.id || 'all', stage: phase ? String(phase.stage) : 'all' }); }}><option value="all">{selectedStage !== 'all' && selectedStage ? `Các pha giai đoạn ${selectedStage}` : 'Toàn bộ 18 pha'}</option>{phases.map(phase => <option key={phase.id} value={phase.id}>{phase.title}</option>)}</select></fieldset>
    </div>
  </div>;
}
