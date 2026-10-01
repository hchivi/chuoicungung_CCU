/**
 * SEO Endpoints: robots.txt and sitemap.xml
 * Standardized according to codex_fixed.txt Section VII.
 */

import mongoose from 'mongoose';
import Enterprise from '../models/Enterprise.js';
import IndustrialPark from '../models/IndustrialPark.js';
import Factory from '../models/Factory.js';

let sitemapCache = null;
let sitemapCacheExpiry = 0;

const STATIC_CANONICAL_ROUTES = [
  '/',
  '/he-sinh-thai',
  '/nha-cung-ung',
  '/nha-may',
  '/khu-cong-nghiep',
  '/hiep-hoi',
  '/san-nhu-cau',
  '/chuong-trinh',
  '/dich-vu',
  '/ban-do-6-giai-doan',
  '/giai-doan/giai-doan-1-chuan-bi-dau-tu',
  '/giai-doan/giai-doan-2-thiet-ke-xay-dung',
  '/giai-doan/giai-doan-3-lap-dat-hoan-thien',
  '/giai-doan/giai-doan-4-van-hanh-san-xuat',
  '/giai-doan/giai-doan-5-nhan-su-hau-can',
  '/giai-doan/giai-doan-6-mo-rong-toi-uu'
];

export function handleRobotsTxt(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /api/',
    'Disallow: /tai-khoan/',
    'Disallow: /ban-nhap/',
    '',
    'Sitemap: https://chuoicungung.com/sitemap.xml'
  ].join('\n');
  res.send(robots);
}

export async function handleSitemapXml(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  const now = Date.now();
  if (sitemapCache && now < sitemapCacheExpiry) {
    return res.send(sitemapCache);
  }

  const baseUrl = process.env.CANONICAL_ORIGIN || 'https://chuoicungung.com';
  const urls = [];

  // 1. Static canonical routes
  const todayStr = new Date().toISOString().split('T')[0];
  for (const path of STATIC_CANONICAL_ROUTES) {
    urls.push(`  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${todayStr}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`);
  }

  // 2. Published database entities (if MongoDB is connected)
  if (mongoose.connection.readyState === 1) {
    try {
      // Enterprises (Suppliers)
      const enterprises = await Enterprise.find({ slug: { $exists: true, $ne: '' } })
        .select('slug updatedAt')
        .limit(2000)
        .lean();
      for (const ent of enterprises) {
        if (ent.slug) {
          const lastmod = (ent.updatedAt ? new Date(ent.updatedAt) : new Date()).toISOString().split('T')[0];
          urls.push(`  <url>\n    <loc>${baseUrl}/nha-cung-ung/${ent.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
        }
      }

      // Industrial Parks
      const iparks = await IndustrialPark.find({ slug: { $exists: true, $ne: '' } })
        .select('slug updatedAt')
        .limit(600)
        .lean();
      for (const ip of iparks) {
        if (ip.slug) {
          const lastmod = (ip.updatedAt ? new Date(ip.updatedAt) : new Date()).toISOString().split('T')[0];
          urls.push(`  <url>\n    <loc>${baseUrl}/khu-cong-nghiep/${ip.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
        }
      }

      // Factories
      const factories = await Factory.find({ slug: { $exists: true, $ne: '' } })
        .select('slug updatedAt')
        .limit(2000)
        .lean();
      for (const fac of factories) {
        if (fac.slug) {
          const lastmod = (fac.updatedAt ? new Date(fac.updatedAt) : new Date()).toISOString().split('T')[0];
          urls.push(`  <url>\n    <loc>${baseUrl}/nha-may/${fac.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`);
        }
      }
    } catch (e) {
      console.warn('⚠️ Lỗi khi nạp dữ liệu động cho sitemap:', e.message);
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  sitemapCache = sitemapXml;
  sitemapCacheExpiry = now + 3600 * 1000; // Cache 1 hour

  res.send(sitemapXml);
}
