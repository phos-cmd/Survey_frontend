import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  build: {
    // Build output to Django static files directory
    outDir: '../staticfiles/frontend',
    emptyOutDir: true,
    // Assets are served from /static/ in Django
    base: '/static/',
  }
})
