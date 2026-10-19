/**
 * Chuẩn hóa và chuyển đổi toàn bộ URL hình ảnh/logo từ các máy chủ media bên ngoài
 * sang đường dẫn nội bộ qua API Media Proxy của chuỗi cung ứng: chuoicungung.com
 *
 * Ví dụ:
 *  https://products.[external-media-host]/395738848/vch7 lg.jpg
 *  -> /api/media/products/395738848/vch7 lg.jpg
 *  hoặc https://chuoicungung.com/api/media/products/395738848/vch7 lg.jpg
 */

export function maskMediaUrl(url, { baseUrl = '' } = {}) {
  if (!url || typeof url !== 'string') return url || '';

  // Base64-encoded upstream media host to prevent keyword leakage in client bundles
  const host = typeof atob === 'function' ? atob('dHJhbmd2YW5ndmlldG5hbS5jb20=') : 'external-media.ccu';
  const pattern = new RegExp(`^https?:\\/\\/(products|pic|logo|img)\\.${host.replace('.', '\\.')}\\/(.+)$`, 'i');
  const match = url.trim().match(pattern);
  if (!match) return url;

  const subdomain = match[1].toLowerCase();
  const rawPath = match[2];

  const prefix = baseUrl ? `${baseUrl.replace(/\/+$/, '')}/api/media` : '/api/media';
  return `${prefix}/${subdomain}/${rawPath}`;
}

export function maskMediaList(urls, options = {}) {
  if (!Array.isArray(urls)) return [];
  return urls.map(u => maskMediaUrl(u, options));
}

export function maskSupplierMedia(supplier, options = {}) {
  if (!supplier || typeof supplier !== 'object') return supplier;
  const copy = { ...supplier };
  if (copy.logo) copy.logo = maskMediaUrl(copy.logo, options);
  if (Array.isArray(copy.images)) copy.images = maskMediaList(copy.images, options);
  return copy;
}
