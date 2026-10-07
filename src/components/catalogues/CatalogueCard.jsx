import React from 'react';
import { Link } from 'react-router-dom';
import { CATALOGUE_TYPES, CATALOGUE_STATUSES } from '../../data/cataloguesData';
import './CatalogueDiscovery.css';

export default function CatalogueCard({ catalogue, onQuickViewOnline, onDownloadPdf }) {
  if (!catalogue) return null;
  const edition = (catalogue.editions || []).find(item => item.id === catalogue.currentEditionId) || catalogue.editions?.[0];
  const type = CATALOGUE_TYPES[catalogue.catalogueType];
  const status = CATALOGUE_STATUSES[catalogue.status];
  const approvedEntries = (edition?.entries || []).filter(entry => entry.approvalStatus === 'APPROVED');
  const approvedCount = approvedEntries.length || edition?.entriesCount || 0;
  const formats = { ONLINE_ONLY: 'Bản số trực tuyến', PRINT_CONFIRMED: 'Bản in phát tay', BOTH: 'Số & bản in' };
  const date = edition?.publicationDate ? new Date(edition.publicationDate + (edition.publicationDate.length === 10 ? 'T00:00:00' : '')) : null;
  const publicationDate = date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('vi-VN') : 'Chưa cập nhật';
  const fallbackCover = '/images/ecosystem/catalogue.jpg';
  const handleCoverError = event => {
    if (event.currentTarget.getAttribute('src') !== fallbackCover) event.currentTarget.src = fallbackCover;
  };

  return (
    <article className="cl-card" data-catalogue-card={catalogue.id} data-type={catalogue.catalogueType}>
      <div className="cl-card__display">
        <div className="cl-book" aria-label={'Bìa giới thiệu: ' + catalogue.title}>
          <img src={catalogue.coverUrl || fallbackCover} alt={catalogue.title}
            width="320" height="240" loading="lazy" decoding="async" onError={handleCoverError} />
          <div className="cl-book__label">
            <strong>{catalogue.categoryName || 'Catalogue nhà cung ứng'}</strong>
          </div>
        </div>
        <dl className="cl-card__edition">
          <dt>Ấn bản</dt><dd>{edition?.editionCode || 'Chưa cập nhật'}</dd>
          <dt>Phát hành</dt><dd>{publicationDate}</dd>
          <dt>Định dạng</dt><dd>{formats[edition?.format] || 'Chưa cập nhật'}</dd>
        </dl>
      </div>
      <div className="cl-card__body">
        <div className="cl-card__classification">
          <span className="cl-card__type">{type?.shortName || 'Ấn phẩm'}</span>
          <span className="cl-card__status">{status?.label || 'Chưa cập nhật'}</span>
        </div>
        <h2 className="font-heading"><Link to={'/catalogue/' + catalogue.slug}>{catalogue.title}</Link></h2>
        {(catalogue.industrialParkName || catalogue.provinceName) &&
          <p className="cl-card__location">{catalogue.industrialParkName || catalogue.provinceName}</p>}
        <div className="cl-card__facts">
          <span><strong>{approvedCount.toLocaleString('vi-VN')}</strong> hồ sơ đã duyệt</span>
          {edition?.confirmedPrintQuantity > 0 &&
            <span><strong>{edition.confirmedPrintQuantity.toLocaleString('vi-VN')}</strong> bản in xác nhận
              {edition.distributedQuantity > 0 && <small> · đã giao {edition.distributedQuantity.toLocaleString('vi-VN')}</small>}
            </span>}
        </div>
        <details className="cl-card__information">
          <summary>Thông tin ấn phẩm</summary>
          <p>{catalogue.shortDescription}</p>
          {catalogue.programTitle && <p><strong>Chương trình liên kết: </strong>{catalogue.programTitle}</p>}
          <p><strong>Chủ trì: </strong>{catalogue.publisherName || 'Chưa cập nhật'}</p>
        </details>
        <div className="cl-card__actions">
          <Link className="cl-card__primary" to={'/catalogue/' + catalogue.slug}>
            <span>Xem catalogue</span><span aria-hidden="true">↗</span>
          </Link>
          <div className="cl-card__secondary">
            <button type="button" disabled={!onQuickViewOnline}
              onClick={() => onQuickViewOnline?.(catalogue)} aria-label={'Xem bản số: ' + catalogue.title}>
              Xem bản số
            </button>
            {edition?.fileUrl && <button type="button" disabled={!onDownloadPdf}
              onClick={() => onDownloadPdf?.(catalogue, edition)}
              aria-label={'Tải PDF: ' + catalogue.title + ' (' + (edition.fileSize || 'PDF') + ')'}>
              Tải PDF{edition.fileSize ? ' · ' + edition.fileSize : ''}
            </button>}
          </div>
        </div>
      </div>
    </article>
  );
}
