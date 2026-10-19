// A read-only public snapshot from the backend. Never contains Supabase keys.
// Node-side imports remain available to migration scripts and isolated tests.
import { CRAWLED_PREVIEW_24_SUPPLIERS } from './verifiedSuppliersPreview.js';

export const isCloudBrowser = () => typeof window !== 'undefined';
export const cloudData = Object.create(null);
export const suppliers = [...CRAWLED_PREVIEW_24_SUPPLIERS];
export const factories = [];
export const industrialParks = [];
export const associations = [];
const stableArrays = { suppliers, factories, industrialParks, associations };
export function getCloudRecords(collection) { return cloudData[collection] || []; }
export function applyCloudSnapshot(snapshot) {
  for (const [key, records] of Object.entries(snapshot)) {
    if (!Array.isArray(records)) throw new Error('Danh mục Supabase không hợp lệ.');
    if (stableArrays[key]) {
      stableArrays[key].length = 0;
      if (key === 'suppliers') {
        stableArrays[key].push(...CRAWLED_PREVIEW_24_SUPPLIERS);
      }
      for (const record of records) stableArrays[key].push(record);
      cloudData[key] = stableArrays[key];
    } else cloudData[key] = records;
  }
}
export async function initializeCloudData() {
  let response;
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 8000) : null;
    try {
      response = await fetch('/api/bootstrap', {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
        signal: controller?.signal
      });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  } catch (netErr) {
    console.warn('Cảnh báo mạng khi nạp /api/bootstrap:', netErr);
    return;
  }
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch (err) {
    const isAuthRoute = typeof window !== 'undefined' && (
      window.location.pathname.startsWith('/tai-khoan') ||
      window.location.pathname.startsWith('/dang-nhap') ||
      window.location.pathname.startsWith('/cai-dat')
    );
    if (isAuthRoute) return;
    throw new Error('Máy chủ chưa cấu hình API endpoint. Vui lòng kiểm tra file /api/bootstrap trên hosting.');
  }
  if (!response.ok || !body.success || body.source !== 'supabase') {
    const isAuthRoute = typeof window !== 'undefined' && (
      window.location.pathname.startsWith('/tai-khoan') ||
      window.location.pathname.startsWith('/dang-nhap')
    );
    if (isAuthRoute) return;
    throw new Error(body.error?.message || 'Chưa tải được dữ liệu Supabase. Vui lòng thử lại.');
  }
  applyCloudSnapshot(body.data);
}
