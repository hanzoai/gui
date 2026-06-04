import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
const a = resolve(__dirname, '..');           // pkgs/ai
const h = (m: string) => `${a}/src/host/${m}`;
const p = (d: string) => resolve(__dirname, `../../${d}/src`);
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  worker: { format: 'es' },
  server: { port: 1500, strictPort: true, host: '0.0.0.0' },
  build: { outDir: 'dist', chunkSizeWarningLimit: 8000, rollupOptions: { onwarn(w,d){ if(w.code==='MODULE_LEVEL_DIRECTIVE')return; d(w);} } },
  optimizeDeps: { include: ['react','react-dom','react-dom/client','react/jsx-runtime','libsodium-wrappers-sumo','@tanstack/react-query','lucide-react','zustand'], exclude: ['pyodide'], esbuildOptions: { jsx: 'automatic' } },
  resolve: { dedupe: ['react','react-dom'], alias: {
    'libsodium-wrappers-sumo': '/home/z/work/hanzo/gui/node_modules/libsodium-wrappers-sumo/dist/modules-sumo/libsodium-wrappers.js',
    '@': `${a}/src/app`,
    '@tauri-apps/api/core': h('core'), '@tauri-apps/api/event': h('event'),
    '@tauri-apps/api/window': h('window'), '@tauri-apps/api/app': h('app'), '@tauri-apps/api': h('index'),
    '@tauri-apps/plugin-fs': h('fs'), '@tauri-apps/plugin-log': h('log'), '@tauri-apps/plugin-dialog': h('dialog'),
    '@tauri-apps/plugin-shell': h('shell'), '@tauri-apps/plugin-process': h('process'), '@tauri-apps/plugin-os': h('os'),
    '@tauri-apps/plugin-opener': h('opener'), '@tauri-apps/plugin-updater': h('updater'),
    '@tauri-apps/plugin-notification': h('notification'), '@tauri-apps/plugin-http': h('http'),
    '@hanzo_network/hanzo-ui': p('net-ui'), '@hanzo_network/hanzo-node-state': p('net-state'),
    '@hanzo_network/hanzo-i18n': p('net-i18n'), '@hanzo_network/hanzo-message-ts': p('net-message-ts'),
    '@hanzo_network/brand-config': p('net-brand-config'), '@hanzo_network/hanzo-logo': p('net-logo'),
    '@hanzo_network/hanzo-artifacts': p('net-artifacts'),
  }},
});
