import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 部署到 GitHub Pages：仓库地址 https://prince-wei123.github.io/ankao-haven/
// 所以生产构建要用子路径 /ankao-haven/，本地开发仍然用根路径。
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/ankao-haven/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
}));
