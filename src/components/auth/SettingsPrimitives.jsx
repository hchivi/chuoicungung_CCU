import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ACCOUNT_ROLE_GROUPS, normalizeBusinessRole } from '../../data/accountRoles.js';
export const roleLabel = role => ACCOUNT_ROLE_GROUPS.find(group => group.id === normalizeBusinessRole(role))?.label || role;
export function SettingsBlock({ title, description, children }) { return <section className="us-block"><header><h2>{title}</h2>{description && <p>{description}</p>}</header>{children}</section>; }
export function ToggleRow({ label, description, checked, onChange, disabled = false }) { return <label className="us-toggle-row"><span><strong>{label}</strong>{description && <small>{description}</small>}</span><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} disabled={disabled} /></label>; }
export function RoleChoices({ value, onChange, disabled = false }) { return <fieldset className="us-roles" disabled={disabled}><legend className="sr-only">Vai trò kinh doanh tự khai báo</legend>{ACCOUNT_ROLE_GROUPS.map(role => <label key={role.id}><input type="checkbox" checked={value.includes(role.id)} onChange={() => onChange(value.includes(role.id) ? value.filter(id => id !== role.id) : [...value, role.id])} /><span>{role.label}</span></label>)}</fieldset>; }
export function SelectRow({ label, value, onChange, options, description, disabled }) { return <label className="us-select-row"><span><strong>{label}</strong>{description && <small>{description}</small>}</span><select value={value} disabled={disabled} onChange={event => onChange(event.target.value)}>{Object.entries(options).map(([id, text]) => <option key={id} value={id}>{text}</option>)}</select></label>; }
export function ConfirmDialog({ value, onClose, onConfirm, busy }) {
  const ref = useRef(null);
  useEffect(() => { if (value && !ref.current.open) ref.current.showModal(); else if (!value && ref.current.open) ref.current.close(); }, [value]);
  return <dialog className="us-dialog" ref={ref} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}><div><button type="button" className="us-dialog-close" aria-label="Đóng xác nhận" disabled={busy} onClick={onClose}><X /></button><h2>{value?.title}</h2><p>{value?.message}</p><div className="us-dialog-actions"><button type="button" disabled={busy} onClick={onClose}>Hủy</button><button type="button" className="us-primary" disabled={busy} onClick={onConfirm}>{busy ? 'Đang xử lý…' : 'Xác nhận'}</button></div></div></dialog>;
}
