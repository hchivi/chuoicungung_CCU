/**
 * Server-side Redirect Registry & Canonical URL Management
 * Standardized according to codex_fixed.txt Section VI.
 */

// 301 Permanent Redirects for Duplicate Content
export const CANONICAL_REDIRECT_MAP = {
  '/tam-nhin-ha-tang-quoc-gia': '/he-sinh-thai',
  '/tam-nhin-chien-luoc-quoc-gia': '/he-sinh-thai',
  '/san-pham-dich-vu': '/nha-cung-ung',
  '/tim-hieu-hinh-thuc-tham-gia': '/chuong-trinh/vsip-binh-duong/dang-ky',
  '/dang-ky-ngay-hoi': '/chuong-trinh/vsip-binh-duong/dang-ky',
  // Verified Legacy Entity Redirects
  '/san-pham-dich-vu/dong-phuc-cong-nhan-may-ky': '/san-pham-dich-vu/dong-phuc-cong-nhan-nha-may-chong-tinh-dien',
  '/san-pham-dich-vu/gia-cong-co-khi-chinh-xac-cnc': '/san-pham-dich-vu/gia-cong-chi-tiet-may-cnc-chinh-xac-jig-ga',
  '/san-pham-dich-vu/thung-carton-xuat-khau-in-offset': '/san-pham-dich-vu/thung-carton-5-lop-song-bc-in-flexo-xuat-khau',
  '/nha-may/FAC-SAMSUNG-SEVT': '/nha-may/samsung-electronics-vietnam-bac-ninh',
  '/khu-cong-nghiep/KCN-AMATA-DONG-NAI': '/khu-cong-nghiep/khu-cong-nghiep-amata-dong-nai',
  '/khu-cong-nghiep/KCN-VSIP-1-BINH-DUONG': '/khu-cong-nghiep/khu-cong-nghiep-vsip-1-binh-duong',
  '/khu-cong-nghiep/KCN-HIEP-PHUOC-TPHCM': '/khu-cong-nghiep/khu-cong-nghiep-hiep-phuoc-ho-chi-minh',
  '/hiep-hoi/VLA-LOGISTICS': '/hiep-hoi/hiep-hoi-doanh-nghiep-dich-vu-logistics-viet-nam-vla',
};

// 308 Permanent Aliases for Private / Admin routes
export const ADMIN_ALIAS_MAP = {
  '/admin/yeu-cau-dich-vu': '/admin/dich-vu',
  '/admin/doi-tac-sang-lap': '/admin/founding-partner',
  '/admin/matching': '/admin/connections',
  '/admin/an-pham': '/admin/catalogue',
};

// Explicit 404 / 410 Unmapped entities that must NEVER be soft-redirected to homepage
export const GHOST_ENTITIES_404 = new Set([
  '/nha-cung-ung/ORG-PROSER-001',
  '/nha-may/FAC-PROSER-FACTORY-1',
  '/hiep-hoi/VAMI-MECHANICAL',
  '/hiep-hoi/HAWA-WOOD',
  '/chuong-trinh/hoi-nghi-giao-thuong-fdi-2026'
]);

/**
 * Express middleware to handle verified redirects
 */
export function handleCanonicalRedirects(req, res, next) {
  const urlPath = req.path.replace(/\/+$/, '') || '/';

  // Check 404 ghost entities
  if (GHOST_ENTITIES_404.has(urlPath)) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'ENTITY_NOT_FOUND',
        message: 'Thực thể này không tồn tại hoặc chưa được xuất bản',
        request_id: req.id || null
      }
    });
  }

  // Check 301 Public canonical redirects
  if (CANONICAL_REDIRECT_MAP[urlPath]) {
    const target = CANONICAL_REDIRECT_MAP[urlPath];
    const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    return res.redirect(301, `${target}${query}`);
  }

  // Check 308 Admin alias redirects
  if (ADMIN_ALIAS_MAP[urlPath]) {
    const target = ADMIN_ALIAS_MAP[urlPath];
    const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    return res.redirect(308, `${target}${query}`);
  }

  next();
}
