import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../../../src/contexts/LanguageContext.jsx';
import AuthModal from '../../../src/components/auth/AuthModal.jsx';
import '../../../src/index.css';

function Preview() {
  const [open, setOpen] = useState(true);
  return <main className="ccu-auth-page"><div className="ccu-auth-page-panel ccu-auth">
    <h1>Kiểm thử giao diện đăng nhập khách hàng</h1>
    <p>Component thật. Không gửi biểu mẫu hoặc nhập thông tin tài khoản trong trang kiểm thử.</p>
    <button className="ccu-auth-submit" onClick={() => setOpen(true)}>Mở form đăng nhập</button>
    <h2>8 trạng thái giao diện — mẫu minh họa, không phải kết quả xác thực</h2>
    <div className="ccu-auth-form">
      <button className="ccu-auth-secondary">Mặc định / di chuột / bàn phím / nhấn</button>
      <button disabled className="ccu-auth-submit">Không khả dụng</button>
      <button disabled className="ccu-auth-submit" aria-busy="true">Đang xử lý…</button>
      <p className="ccu-auth-notice ccu-auth-notice--error">Mẫu lỗi: chưa kết nối dịch vụ. Dùng email hoặc thử lại.</p>
      <p className="ccu-auth-notice ccu-auth-notice--success">Mẫu xác nhận: hãy kiểm tra email để tiếp tục.</p>
    </div>
    <AuthModal isOpen={open} onClose={() => setOpen(false)} />
  </div></main>;
}
createRoot(document.getElementById('root')).render(<BrowserRouter><LanguageProvider><Preview /></LanguageProvider></BrowserRouter>);
