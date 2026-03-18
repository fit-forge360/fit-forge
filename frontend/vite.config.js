import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Dev: route each /api/<service>/ prefix directly to the backend service.
      // Strips the /api prefix so the service receives the path it expects.
      '/api/auth':      { target: 'http://localhost:5001', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
      '/api/users':     { target: 'http://localhost:5002', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
      '/api/workout':   { target: 'http://localhost:5003', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
      '/api/nutrition': { target: 'http://localhost:5004', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
      '/api/progress':  { target: 'http://localhost:5005', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
    },
  },
});
