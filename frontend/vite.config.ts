import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
 
  server: {
    port: 5173,
    strictPort: false,
    // CSP'yi kaldırdık - development için gerekli değil
  },
  preview: {
    port: 5173,
    strictPort: false,
    // CSP'yi kaldırdık - development için gerekli değil
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
  },
});



