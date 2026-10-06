import React from 'react';
import { ArrowUpRight, ChevronRight, Compass, HardHat, Wrench, Factory, Users, Leaf } from 'lucide-react';
import { mapStageStyle } from './sixStagesMapUi';

const ICONS = [Compass, HardHat, Wrench, Factory, Users, Leaf];
const POSITIONS = [[50, 17, 0], [82, 34, 3], [82, 70, -3], [50, 84, 0], [18, 70, 3], [18, 34, -3]];

export default function SixStagesLifecycleBoard({ stages, lang, selection, onSelect }) {
  const copy = (vi, en) => lang === 'en' ? en : vi;
  return (
    <div className="sm-floating-board" role="group" aria-label={copy('Chọn giai đoạn vòng đời doanh nghiệp', 'Select a business lifecycle stage')}>
      <button type="button" className="sm-map-center" data-stage-overview aria-pressed={selection.stageId === 'all'} aria-controls="sm-phase-list" onClick={() => onSelect('all')}>
        <img src="/logo_only.png" width="200" height="200" alt="" className="animate-logo-spin" style={{ willChange: 'transform' }} />
        <strong>{copy('VÒNG ĐỜI DOANH NGHIỆP', 'BUSINESS LIFECYCLE')}</strong>
        <small>{copy('Xem đủ 18 pha', 'View all 18 phases')}<ArrowUpRight size={16} aria-hidden="true" /></small>
      </button>
      {stages.map((stage, index) => {
        const Icon = ICONS[index];
        const [x, y, tilt] = POSITIONS[index];
        return (
          <button type="button" key={stage.id} data-stage-select={stage.id} className="sm-stage-card"
            style={{ ...mapStageStyle(stage.id), '--node-x': x + '%', '--node-y': y + '%', '--card-tilt': tilt + 'deg' }}
            aria-pressed={selection.stageId === stage.id} aria-controls="sm-stage-panel sm-phase-list" onClick={() => onSelect(stage.id)}>
            <span className="sm-card-heading"><span className="sm-card-number">{String(stage.id).padStart(2, '0')}</span><span>{copy('GIAI ĐOẠN', 'STAGE')} {String(stage.id).padStart(2, '0')}</span><Icon size={18} aria-hidden="true" /></span>
            <span className="sm-card-title">{lang === 'en' ? stage.titleEn : stage.title}</span>
            <span className="sm-card-phases">{stage.phases.map(phase => <span key={phase.id}><ChevronRight size={14} aria-hidden="true" /><span>{lang === 'en' ? phase.titleEn : phase.title}</span></span>)}</span>
            <span className="sm-card-footer">{copy('Khám phá 3 pha', 'Explore 3 phases')}<ArrowUpRight size={16} aria-hidden="true" /></span>
          </button>
        );
      })}
    </div>
  );
}
