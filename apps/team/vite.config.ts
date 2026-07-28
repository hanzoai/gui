import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwind from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import type { UserConfig } from 'vite'

// React owns the shell; Svelte views mount inside it through components/Svelte.tsx.
// One compiler each, one plugin each, no second path.
//
// `vitePreprocess` is what lets the Huly view corpus through: Svelte 5 strips
// plain TS natively, but not `<style lang="scss">` (10+ files) and not TS `enum`
// (2 files). Both go through the preprocessor.
export default {
  clearScreen: false,

  plugins: [
    react(),
    svelte({ preprocess: vitePreprocess() }),
    tailwind(),
  ],

  // `~` is the app root, matching tsconfig `paths`. Vite does not read tsconfig
  // paths, so the two have to be stated once each and agree.
  resolve: {
    alias: { '~': fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '') },
    // React and Svelte must each be a single instance; two copies of either
    // produce hooks-order and lifecycle faults that look like seam bugs.
    dedupe: ['react', 'react-dom', 'svelte'],
  },

  server: {
    port: 3000,
    // The hosts this app is served on. Brand is a function of hostname, so the
    // dev server has to answer to each of them for that to be testable at all.
    allowedHosts: ['hanzo.team', 'team.hanzo.ai', 'tracker.hanzo.ai', 'team.lux.network'],
    // The Go backend is unchanged and owns every /v1 route.
    proxy: {
      '/v1': { target: process.env.TEAM_API ?? 'https://api.hanzo.ai', changeOrigin: true },
    },
  },

  build: { outDir: 'dist', emptyOutDir: true },
} satisfies UserConfig
