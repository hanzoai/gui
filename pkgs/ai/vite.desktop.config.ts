// @hanzo/ai DESKTOP build. Unlike the web lib build, this does NOT alias
// @tauri-apps → web shims — it EXTERNALIZES @tauri-apps (and react) so the app
// uses the host's REAL native APIs (full window/fs/dialog/updater/node-sidecar).
// A desktop shim consumes this + provides react + @tauri-apps:
//   import HanzoAI, { getBrand } from '@hanzo/ai/desktop'
//   render(<HanzoAI {...getBrand()} />)   // VITE_BRAND selects hanzo/zoo/lux
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const p = (d: string) => resolve(__dirname, `../${d}/src`);
const libAlias = {
  '@hanzo_network/hanzo-ui': p('net-ui'),
  '@hanzo_network/hanzo-node-state': p('net-state'),
  '@hanzo_network/hanzo-i18n': p('net-i18n'),
  '@hanzo_network/hanzo-message-ts': p('net-message-ts'),
  '@hanzo_network/brand-config': p('net-brand-config'),
  '@hanzo_network/hanzo-logo': p('net-logo'),
  '@hanzo_network/hanzo-artifacts': p('net-artifacts'),
};

const REACT = new Set([
  'react', 'react-dom', 'react-dom/client', 'react-dom/server',
  'react/jsx-runtime', 'react/jsx-dev-runtime',
]);
const isExternal = (id: string) =>
  REACT.has(id) || id === '@tauri-apps/api' || id.startsWith('@tauri-apps/');

export default defineConfig({
  plugins: [react()],
  worker: { format: 'es' },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': resolve(__dirname, 'src/app'),
      'libsodium-wrappers-sumo': resolve(__dirname, '../../node_modules/libsodium-wrappers-sumo/dist/modules-sumo/libsodium-wrappers.js'),
      ...libAlias,
    },
  },
  build: {
    outDir: 'dist-desktop',
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      formats: ['es', 'cjs'],
      fileName: (f) => (f === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: { external: isExternal },
  },
});
