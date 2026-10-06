import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, X } from 'lucide-react';
import '../../pages/EcosystemServicePages.css';

export function PageIntro({ label, title, description, children, className = '' }) {
  return <div className={`ec-intro ${className}`}>
    <span className="ec-service-label">{label}</span>
    <h1>{title}</h1>
    <p className="ec-lede">{description}</p>
    <div className="ec-actions">{children}</div>
  </div>;
}

export function Action({ to, href, onClick, children, secondary = false, ...props }) {
  const className = secondary ? 'ec-text-link' : 'ec-button';
  const content = <>{children}<span className="ec-button-icon"><ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" /></span></>;
  if (to) return <Link to={to} className={className} {...props}>{content}</Link>;
  if (href) return <a href={href} className={className} {...props}>{content}</a>;
  return <button type="button" onClick={onClick} className={className} {...props}>{content}</button>;
}

export function Photo({ src, alt, priority = false, className = '' }) {
  return <figure className={`ec-photo ${className}`}>
    <img src={src} alt={alt} width="1536" height="1024" loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : 'auto'} decoding="async" />
  </figure>;
}

export function SectionHeading({ title, children }) {
  return <div className="ec-section-heading"><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}

export function ProcessStrip({ steps }) {
  return <ol className="ec-process">{steps.map(([title, description], index) => <li key={title}>
    <span className="ec-process-marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    <div><h3>{title}</h3><p>{description}</p></div>
    {index < steps.length - 1 && <ArrowRight className="ec-process-arrow" size={20} strokeWidth={1.5} aria-hidden="true" />}
  </li>)}</ol>;
}

export function ClosingNote({ title, description, children }) {
  return <section className="ec-closing ec-container"><div><h2>{title}</h2><p>{description}</p></div><div className="ec-actions">{children}</div></section>;
}

export function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previouslyFocused = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); previouslyFocused?.focus?.({ preventScroll: true }); };
  }, []);
  return <dialog ref={ref} className="ec-modal" aria-label={title} onCancel={onClose} onClick={event => {
    if (event.target === ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }
  }}>
    <div className="ec-modal-heading"><h2>{title}</h2><button type="button" onClick={onClose} className="ec-icon-button" aria-label="Đóng"><X size={24} strokeWidth={1.5} aria-hidden="true" /></button></div>
    {children}
  </dialog>;
}
