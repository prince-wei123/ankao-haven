import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite dev server. In production, Vercel handles the build statically
// and the Express server is replaced by Vercel Serverless Functions (see vercel.json).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
