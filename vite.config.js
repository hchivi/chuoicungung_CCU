import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function forcePdfDownloadPlugin() {
  return {
    name: 'force-pdf-download',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.includes('/catalogues/') || req.url.includes('.pdf') || req.url.includes('.vcf'))) {
          const filename = req.url.split('/').pop().split('?')[0];
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
          res.setHeader('Content-Type', 'application/octet-stream');
        }
        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), forcePdfDownloadPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet')) {
              return 'vendor-leaflet';
            }
            return 'vendor';
          }
          if (id.includes('enterprisesFull.json')) {
            return 'data-enterprises';
          }
          if (id.includes('factoriesFull.json')) {
            return 'data-factories';
          }
          if (id.includes('industrialParksFull.json')) {
            return 'data-industrial-parks';
          }
          if (id.includes('categoriesAlphabetical.json') || id.includes('industryCategories69Pages.json')) {
            return 'data-categories';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
