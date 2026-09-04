import { createRequire } from 'node:module'
import { resolve as pathResolve } from 'node:path'
import { one } from 'one/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import type { UserConfig } from 'vite'

Error.stackTraceLimit = Number.POSITIVE_INFINITY

// @ts-ignore
if (!import.meta.dirname) {
  throw new Error(`Not on Node 22`)
}


// use createRequire instead of import.meta.resolve for bun compatibility in vite config
const require = createRequire(import.meta.url)
const resolve = (path: string) => {
  return require.resolve(path)
}

const include = [
  // pre-bundle common web deps to avoid mid-navigation optimization in dev mode
  'react-native',
  'react-dom',
  'zod',
  'swr/mutation',
  '@vxrn/mdx-rust/client',
  // core hanzogui packages must be pre-bundled together to avoid duplicate instances
  '@hanzo/gui',
  '@hanzogui/core',
  '@hanzogui/web',
  // existing
  'secure-json-parse',
  'ai',
  '@docsearch/react',
  '@leeoniya/ufuzzy',
  'react-hook-form',
  '@github/mini-throttle',
  'swr',
  'is-buffer',
  'extend',
  'minimatch',
  'gray-matter',
  'execa',
  'jiti',
  'hsluv',
  'rehype-parse',
  'refractor',
  'glob',
  'reading-time',
  'unified',
  '@hanzogui/get-font-sized',
  '@hanzogui/linear-gradient',
  '@rehookify/datepicker',
  '@hanzogui/get-token',
  '@hanzogui/roving-focus',
  'react-native-safe-area-context',
  '@hookform/resolvers/zod',
  '@hanzogui/react-native-svg',
  'react-native-gesture-handler',
  '@tanstack/react-table',
  '@hanzogui/focus-scope',
  'react-dropzone',
]

export default {
  // the runtime asks process.env.GUI_TARGET which platform it is on; a browser
  // bundle has no process, so the answer is written in here
  define: { 'process.env.GUI_TARGET': JSON.stringify('web') },
  envPrefix: 'NEXT_PUBLIC_',

  server: {
    fs: {
      allow: ['..'],
    },
  },

  build: {
    cssCodeSplit: false,
    rolldownOptions: {
      output: {
        // fix non-deterministic __esm init ordering bug
        // https://github.com/rolldown/rolldown/issues/3143
        strictExecutionOrder: true,
      },
    },
  },

  resolve: {
    preserveSymlinks: false,

    alias: [
      // `~` is app source, and the only specifier here that is not a package.
      // Everything else resolves through node_modules, where each workspace
      // package is linked at its one real path.
      {
        find: '~',
        replacement: pathResolve(import.meta.dirname, '.'),
      },


      // Standard string-based aliases
      {
        find: 'react-native-svg',
        replacement: '@hanzogui/react-native-svg',
      },

      {
        find: 'react-native/Libraries/Core/ReactNativeVersion',
        replacement: resolve('@hanzogui/proxy-worm'),
      },
    ],

    dedupe: [
      'react',
      'react-dom',
      'react-hook-form',
      'react-native',
      'react-native-web',
      'react-native-svg',
      ...include,
    ],
  },

  optimizeDeps: {
    include,
  },

  ssr: {
    external: [
      '@vxrn/mdx-rust',
      'satteri',
      'satteri-expressive-code',
      'ws',
      'postmark',
    ],
    noExternal: true,
  },

  plugins: [
    // the published site names the source each chunk came from. one's build
    // states sourcemap: false inline for both bundles; a plugin's config hook
    // merges after that, so this is where the answer holds.
    { name: 'hanzo:sourcemap', config: () => ({ build: { sourcemap: true } }) },

    one({
      // tsconfig `paths` answers "where does the source live" for the type
      // checker, which tries every entry of a fallback list. One's resolver
      // reads the first entry only, so `@hanzogui/*` -> pkgs/core/* was applied
      // to all 88 packages that live elsewhere. Packages resolve through
      // node_modules instead; `~` is a vite alias above.
      config: {
        tsConfigPaths: false,
      },

      setupFile: {
        server: './setup.server.ts',
      },

      server: {
        cacheControl: {
          'fonts/**': 'public, max-age=604800, stale-while-revalidate=86400',
          '*.svg': 'public, max-age=86400',
          '*.png': 'public, max-age=86400',
          '*.jpg': 'public, max-age=86400',
          '*.woff2': 'public, max-age=604800',
        },
      },


      ssr: {
        dedupeSymlinkedModules: true,
        autoDepsOptimization: {
          include: /.*/,
        },
      },

      patches: {
        '@react-navigation/core': {
          version: '^7',
          'lib/module/useOnGetState.js': (contents) => {
            return contents?.replace(
              'if (route.state === childState)',
              'if (!childState || route.state === childState)'
            )
          },
        },
      },

      build: {
        api: {
          config: {
            build: {
              rollupOptions: {
                external: [
                  '@discordjs/rest',
                  '@discordjs/ws',
                  '@vercel/og',
                  'zlib-sync',
                ],
              },
            },
          },
        },
      },

      web: {
        skewProtection: 'proactive',
        experimental_scriptLoading: 'after-lcp-aggressive',
        redirects: [
          // llms.txt, llms-full.txt, docs.txt are handled by middleware directly
          {
            source: '/docs',
            destination: '/docs/intro/introduction',
            permanent: true,
          },
          {
            source: '/vite',
            destination: 'https://vxrn.dev',
            permanent: true,
          },
          {
            source: '/docs/components/:slug/:version',
            destination: '/ui/:slug/:version',
            permanent: true,
          },
          {
            source: '/docs/components/:slug',
            destination: '/ui/:slug',
            permanent: true,
          },
        ],
      },
    }),

    // removeReactNativeWebAnimatedPlugin(),

    ...(process.env.ANALYZE
      ? [
          visualizer({
            filename: 'bundle_stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
            emitFile: true,
          }),
          visualizer({
            filename: 'bundle_stats.json',
            template: 'raw-data',
            gzipSize: true,
            brotliSize: true,
            emitFile: true,
          }),
        ]
      : []),
  ],
} satisfies UserConfig
