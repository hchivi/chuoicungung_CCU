import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ImageOff, LockKeyhole, MapPin, MessageCircle, Phone, Mail, Globe, Plus, Send, Tag } from 'lucide-react';
import { slugify } from '../../pages/IndustryCategoryPage';
import { getSupplierPhases } from './supplierDirectoryModel';
import { getCompanyMonogram, getMonogramGradient, getCategoryBannerImage } from '../../utils/companyUtils';

export default function SupplierDirectoryCard({ supplier, phases, selectedPhase, images = [], avatar, maskedPhone, detailUrl, onQuote, onAdd, requirement, added, viewMode }) {
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const supplierPhases = getSupplierPhases(supplier, phases, selectedPhase);
  
  const allKeywords = [...new Set([
    ...(Array.isArray(supplier.products) ? supplier.products : []),
    ...(Array.isArray(supplier.productGroups) ? supplier.productGroups.flatMap(group => group.items || (typeof group === 'string' ? [group] : [])) : []),
    ...(Array.isArray(supplier.keywords) ? supplier.keywords : []),
    supplier.category,
    supplier.industry
  ].filter(value => typeof value === 'string' && value.trim()))];

  const displayedKeywords = showAllKeywords ? allKeywords : allKeywords.slice(0, 6);
  const hasMoreKeywords = allKeywords.length > 6;

  return (
    <article className="sd-supplier-card" data-supplier-card data-view={viewMode} data-stage={supplierPhases[0]?.stage || 0}>
      <header className="sd-capability-head">
        <div className="sd-capability-line">
          <span title={supplier.category || supplier.industry || 'Chưa cập nhật ngành nghề'}>
            {supplier.category || supplier.industry || 'Chưa cập nhật ngành nghề'}
          </span>
          <span className="sd-card-location">
            <MapPin size={13} aria-hidden="true" />
            {supplier.province || 'Toàn quốc'}
          </span>
        </div>
        <div className="sd-company-heading">
          {avatar && !avatarFailed ? (
            <img 
              className="sd-company-avatar" 
              src={avatar} 
              alt="" 
              loading="lazy" 
              referrerPolicy="no-referrer" 
              onError={() => setAvatarFailed(true)} 
            />
          ) : (
            <div 
              className={`w-11 h-11 rounded-lg shrink-0 flex items-center justify-center font-bold text-white text-xs bg-gradient-to-br ${getMonogramGradient(supplier.name)} shadow-2xs select-none`}
              title={supplier.name}
            >
              {getCompanyMonogram(supplier.name)}
            </div>
          )}
          <h3>
            <Link to={detailUrl} title={supplier.name}>
              {supplier.name}
            </Link>
          </h3>
        </div>
      </header>

      <div className="sd-card-gallery" aria-label={`Hình ảnh ${supplier.name}`}>
        {images.slice(0, 3).map((src, index) => (
          <Link to={detailUrl} key={index} aria-label={`Xem hình ảnh và hồ sơ ${supplier.name}`} className="sd-card-photo">
            <img 
              src={src} 
              alt="" 
              loading="lazy" 
              referrerPolicy="no-referrer" 
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.hasFallback) {
                  img.dataset.hasFallback = 'true';
                  const fallback = getCategoryBannerImage(supplier.category || supplier.industry);
                  if (fallback && fallback !== img.src) {
                    img.src = fallback;
                    return;
                  }
                }
                img.style.display = 'none';
              }} 
            />
            <ImageOff size={18} aria-hidden="true" />
          </Link>
        ))}
        {images.length === 0 && (
          <div className="sd-photo-empty">
            <ImageOff size={20} />
            <span>Chưa có hình ảnh</span>
          </div>
        )}
      </div>

      <div className="sd-card-body">
        <div className="sd-card-phases">
          <span className="sd-field-label">Pha cung ứng</span>
          <div className="sd-card-phases-chips">
            {supplierPhases.length ? supplierPhases.map(phase => (
              <Link 
                data-supplier-phase={phase.id} 
                data-stage={phase.stage} 
                key={phase.id} 
                to={`/giai-doan-cung-ung/pha/${phase.id}`} 
                title={phase.title}
              >
                <b>Pha {phase.id}</b>
              </Link>
            )) : <p className="sd-phase-empty">Chưa phân loại pha</p>}
          </div>
        </div>

        {(supplier.moq || supplier.leadTime) && (
          <dl className="sd-card-specs">
            {supplier.moq && <div><dt>MOQ</dt><dd>{supplier.moq}</dd></div>}
            {supplier.leadTime && <div><dt>Thời gian</dt><dd>{supplier.leadTime}</dd></div>}
          </dl>
        )}

        {supplier.needsConfirmation && (
          <p className="sd-confirmation"><strong>Cần xác nhận: </strong>{supplier.needsConfirmation}</p>
        )}

        {allKeywords.length > 0 && (
          <div className="sd-card-keywords">
            <div className="sd-keywords-head">
              <span className="sd-keywords-title">
                <Tag size={13} aria-hidden="true" />
                <span>Từ khoá chuyên môn</span>
                <b>{allKeywords.length}</b>
              </span>
              {hasMoreKeywords && (
                <button 
                  type="button" 
                  className="sd-keywords-toggle" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAllKeywords(!showAllKeywords);
                  }}
                >
                  {showAllKeywords ? 'Thu gọn' : `+${allKeywords.length - 6} Xem thêm`}
                </button>
              )}
            </div>
            <div className="sd-keywords-chips" aria-label="Từ khoá nhà cung ứng">
              {displayedKeywords.map(keyword => (
                <Link key={keyword} to={`/tu-khoa/${slugify(keyword)}?q=${encodeURIComponent(keyword)}`} title={keyword}>
                  <span>{keyword}</span>
                  <ArrowRight size={11} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sd-card-bottom">
        <div className="sd-contact-row">
          <div>
            <span className="sd-contact-label">
              <LockKeyhole size={13} aria-hidden="true" />
              Liên hệ được ẩn
            </span>
            {maskedPhone && <span className="sd-masked-phone">{maskedPhone}</span>}
          </div>
          <div className="sd-contact-actions">
            {[[Phone, 'Yêu cầu kết nối điện thoại'], [MessageCircle, 'Yêu cầu kết nối tin nhắn'], [Mail, 'Yêu cầu kết nối email'], [Globe, 'Yêu cầu thông tin website']].map(([Icon, label]) => (
              <button key={label} aria-label={label} title={label} onClick={() => onQuote(supplier)}>
                <Icon size={15} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        {requirement && (
          <button className="sd-button sd-button-outline sd-add-requirement" disabled={added} onClick={() => onAdd(supplier)}>
            {added ? <Check size={15} /> : <Plus size={15} />}
            {added ? 'Đã thêm vào nhu cầu' : `Thêm vào nhu cầu #${requirement.id}`}
          </button>
        )}
        <div className="sd-card-cta">
          <button className="sd-button sd-button-primary" onClick={() => onQuote(supplier)}>
            <Send size={14} aria-hidden="true" />
            Mô tả nhu cầu
          </button>
          <Link className="sd-button sd-button-outline" to={detailUrl}>
            Xem hồ sơ
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

