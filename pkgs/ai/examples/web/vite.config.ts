// External-style consumption proof: this shim imports @hanzo/app from its built
// dist and provides ONLY react/react-dom. Everything else (the app, net-* libs,
// @tauri-apps host shims, 3rd-party deps) is bundled inside dist. This is what
// luxfi/app, zooai/app, hanzoai/desktop and hanzo.app become — a ~10-line shim.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  server: { port: 1503, strictPort: true, host: '0.0.0.0' },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: { '@hanzo/app': resolve(__dirname, '../../dist/index.js') },
  },
  optimizeDeps: { include: ['react', 'react-dom', 'react-dom/client'] },
  build: { outDir: 'dist-shim', minify: 'esbuild', chunkSizeWarningLimit: 9000 },
});
