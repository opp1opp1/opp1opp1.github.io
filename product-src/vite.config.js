import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 輸出成單一 index.html,放進 ../product/ 由 GitHub Pages 直接發佈
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: { outDir: '../product', emptyOutDir: true },
});
