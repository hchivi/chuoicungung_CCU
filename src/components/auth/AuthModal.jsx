import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm.jsx';
export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const panel = useRef(null), navigate = useNavigate();
  const close = useRef(onClose); close.current = onClose;
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement, overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; panel.current?.querySelector('input,button')?.focus();
    const onKey = event => {
      if (event.key === 'Escape') close.current();
      if (event.key !== 'Tab') return;
      const controls = [...panel.current.querySelectorAll('button:not(:disabled),input:not(:disabled),a[href]')];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [isOpen]);
  if (!isOpen) return null;
  return createPortal(<div className="ccu-auth-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div ref={panel} role="dialog" aria-modal="true" aria-label="Đăng nhập hoặc đăng ký" className="ccu-auth-panel relative">
      <button aria-label="Đóng đăng nhập" onClick={onClose} className="absolute z-20 right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-lg transition">×</button>
      <AuthForm initialTab={initialTab} onSuccess={identity => { onClose(); if (identity?.role) navigate('/admin'); }} />
    </div>
  </div>, document.body);
}
