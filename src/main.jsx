import React from 'react'
import ReactDOM from 'react-dom/client'
import { initializeCloudData } from './data/cloudData.js'
import { loadPrivateSubmissions } from './services/submissionService.js'
import { restoreAuthSession } from './services/authSession.js'
import './index.css'
import 'leaflet/dist/leaflet.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
async function start() {
  const isPortfolio = typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/todzung') ||
    window.location.pathname.startsWith('/to-ngoc-dung') ||
    window.location.pathname.startsWith('/ong-to-ngoc-dung') ||
    window.location.pathname.startsWith('/giam-doc') ||
    window.location.pathname.startsWith('/tonydong') ||
    window.location.pathname.startsWith('/jennytrinh') ||
    window.location.pathname.startsWith('/mstrinh')
  );

  root.render(
    <main
      role="status"
      aria-label="Đang tải"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}
    >
      {!isPortfolio && (
        <>
          <img
            src="/logo_only.png"
            alt="Loading"
            style={{
              width: '90px',
              height: '90px',
              objectFit: 'contain',
              animation: 'spin 2s linear infinite',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          />
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </main>
  );
  try {
    try {
      await initializeCloudData();
      try { await restoreAuthSession(); await loadPrivateSubmissions(); } catch { /* Auth UI displays a retryable error. */ }
    } catch (dataErr) {
      console.warn('Cảnh báo tải dữ liệu cloud bootstrap:', dataErr);
      const isAuthOrAccount = typeof window !== 'undefined' && (
        window.location.pathname.startsWith('/tai-khoan') ||
        window.location.pathname.startsWith('/dang-nhap') ||
        window.location.pathname.startsWith('/dang-ky') ||
        window.location.pathname.startsWith('/cai-dat')
      );
      if (!isPortfolio && !isAuthOrAccount) throw dataErr;
    }
    // Load modules after the snapshot, so existing memoized enrichers see DB data.
    const { default: App } = await import('./App.jsx');
    root.render(<React.StrictMode><App /></React.StrictMode>);
  } catch (error) {
    root.render(<main role="alert" style={{ maxWidth: 600, margin: '15vh auto', padding: 24, color: '#183e30' }}><h1>Chưa kết nối được dữ liệu</h1><p>{error.message}</p><p>Không sử dụng dữ liệu mẫu thay cho database.</p><button onClick={start}>Kết nối lại</button></main>);
  }
}
start();
