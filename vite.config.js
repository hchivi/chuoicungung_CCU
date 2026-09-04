import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
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
