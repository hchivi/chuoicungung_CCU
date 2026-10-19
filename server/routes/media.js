import express from 'express';
import { Readable } from 'node:stream';

const ALLOWED_SUBDOMAINS = new Set(['products', 'pic', 'logo', 'img']);

export function createMediaProxyRouter() {
  const router = express.Router();

  router.use('/:subdomain', async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    const { subdomain } = req.params;
    // req.url contains the path after /:subdomain, e.g. /395738848/vch7%20lg.jpg
    const rawPath = (req.url || '').split('?')[0].replace(/^\/+/, '');

    if (!ALLOWED_SUBDOMAINS.has(subdomain) || !rawPath || rawPath.includes('..')) {
      return res.status(400).json({ success: false, error: 'Invalid media target' });
    }

    try {
      const decodedPath = decodeURIComponent(rawPath);
      const encodedPath = decodedPath.split('/').map(encodeURIComponent).join('/');
      const UPSTREAM_MEDIA_HOST = process.env.UPSTREAM_MEDIA_HOST || Buffer.from('dHJhbmd2YW5ndmlldG5hbS5jb20=', 'base64').toString('utf8');
      const targetUrl = `https://${subdomain}.${UPSTREAM_MEDIA_HOST}/${encodedPath}`;

      const upstream = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Referer': `https://${UPSTREAM_MEDIA_HOST}/`,
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });

      if (!upstream.ok) {
        return res.status(upstream.status).json({ success: false, error: 'Image not found' });
      }

      const contentType = upstream.headers.get('content-type') || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=2592000, s-maxage=2592000, immutable');
      res.setHeader('X-Content-Type-Options', 'nosniff');

      if (req.method === 'HEAD') {
        return res.status(200).end();
      }

      if (upstream.body) {
        Readable.fromWeb(upstream.body).pipe(res);
      } else {
        res.end();
      }
    } catch {
      if (!res.headersSent) {
        res.status(502).json({ success: false, error: 'Failed to fetch media' });
      }
    }
  });

  return router;
}
