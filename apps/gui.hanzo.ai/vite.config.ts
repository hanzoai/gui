import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { resolve as pathResolve } from 'node:path'
import { guiPlugin } from '@hanzogui/vite-plugin'
import { one } from 'one/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import type { UserConfig } from 'vite'
import { generateRecipesProxy } from './scripts/generate-recipes-proxy.mjs'

Error.stackTraceLimit = Number.POSITIVE_INFINITY

// @ts-ignore
if (!import.meta.dirname) {
  throw new Error(`Not on Node 22`)
}

// Check if required build artifacts exist, auto-build if missing
const vitePluginDist = pathResolve(
  import.meta.dirname,
  '../compiler/vite-plugin/dist/esm/index.mjs'
)
const staticDist = pathResolve(import.meta.dirname, '../compiler/static/dist/index.cjs')

if (!existsSync(vitePluginDist) || !existsSync(staticDist)) {
  console.info('')
  console.info('Building hanzo-gui packages (dist not found)...')
  try {
    execSync('bun run build:js', {
      cwd: pathResolve(import.meta.dirname, '../..'),
      stdio: 'inherit',
    })
    console.info('Build complete!')
  } catch (e) {
    console.error('Build failed. You may need to run `bun run build` from the repo root.')
    throw e
  }
}

// Generate recipes proxy files (creates stubs if recipes repo not found).
// When recipes is absent, subpathStubs maps each deep
// `@hanzogui/recipes/component/*` import to a concrete generated stub module.
const { hasRecipes, subpathStubs } = generateRecipesProxy({
  basePath: pathResolve(import.meta.dirname, 'scripts'),
  silent: false,
})

if (hasRecipes) {
  console.info('Using ../recipes')
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
  'mdx-bundler/client',
  // core hanzo-gui packages must be pre-bundled together to avoid duplicate instances
  'hanzogui',
  '@hanzogui/core',
  '@hanzogui/web',
  // existing
  '@ai-sdk/deepseek',
  'secure-json-parse',
  '@hanzo/base',
  '@hanzo/iam',
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
  '@hanzogui/lucide-icons-2',
  '@rehookify/datepicker',
  '@hanzogui/get-token',
  '@hanzogui/roving-focus',
  'react-native-safe-area-context',
  '@hookform/resolvers/zod',
  'react-native-reanimated',
  '@hanzogui/react-native-svg',
  'react-native-gesture-handler',
  '@tanstack/react-table',
  '@hanzogui/focus-scope',
  'react-dropzone',
]

export default {
  envPrefix: 'NEXT_PUBLIC_',

  server: {
    fs: {
      allow: ['..', '../../../recipes'],
    },
  },

  build: {
    cssCodeSplit: false,
  },

  resolve: {
    preserveSymlinks: false,
    alias: [
      // When recipes is absent, map each deep @hanzogui/recipes/component/*
      // import to its concrete generated stub. These MUST precede the catch-all
      // '@hanzogui/recipes' alias below, otherwise that alias swallows the
      // subpath (resolving to recipes-proxy/component/...) and the build fails
      // with UNLOADABLE_DEPENDENCY. Stubs carry the exact named exports the
      // showcase tree imports/re-exports, which rolldown validates statically.
      ...(!hasRecipes
        ? Object.entries(subpathStubs)
            // longest subpath first: vite matches `id === find || id.startsWith(find + '/')`,
            // so a parent like `.../user/preferences` must not shadow its child
            // `.../user/preferences/LocationNotification`.
            .sort(([a], [b]) => b.length - a.length)
            .map(([find, replacement]) => ({ find, replacement }))
        : []),
      // Standard string-based aliases
      {
        find: 'react-native-svg',
        replacement: '@hanzogui/react-native-svg',
      },
      // {
      //   find: 'react-native-web',
      //   replacement: resolve('@hanzogui/react-native-web-lite'),
      // },
      // bugfix docsearch/react, weird
      {
        find: '@docsearch/react',
        replacement: resolve('@docsearch/react'),
      },
      {
        find: 'react-native/Libraries/Core/ReactNativeVersion',
        replacement: resolve('@hanzogui/proxy-worm'),
      },
      // Recipes paths (conditional based on recipes availability)
      ...(hasRecipes
        ? [
            {
              find: '@hanzogui/recipes/raw',
              replacement: pathResolve(import.meta.dirname, '../../../recipes/src/index'),
            },
            {
              find: '@hanzogui/recipes/provider',
              replacement: pathResolve(
                import.meta.dirname,
                '../../../recipes/src/components/provider/CurrentRouteProvider'
              ),
            },
            {
              find: '@hanzogui/recipes/component',
              replacement: pathResolve(
                import.meta.dirname,
                '../../../recipes/src/components'
              ),
            },
          ]
        : []),
      // Always provide these aliases - they point to proxy files that work with or without recipes
      {
        find: '@hanzogui/recipes/data',
        replacement: pathResolve(import.meta.dirname, './helpers/dist/recipes-proxy-data'),
      },
      {
        find: '@hanzogui/recipes',
        replacement: pathResolve(import.meta.dirname, './helpers/dist/recipes-proxy'),
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
    external: ['@vxrn/mdx', 'ws'],
    noExternal: true,
  },

  plugins: [
    guiPlugin({
      // see gui.build.ts
      disable: process.env.NODE_ENV !== 'production',
    }),

    one({
      react: {
        compiler: process.env.NODE_ENV === 'production',
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
        'react-native-reanimated': {
          'lib/module/createAnimatedComponent/createAnimatedComponent.js': (contents) => {
            // if not using layout animations, this saves a super expensive repaint that happens often
            return contents?.replace(
              `return this._componentDOMRef.getBoundingClientRect();`,
              'return null;'
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
            source: '/account/subscriptions',
            destination: '/account',
            permanent: false,
          },
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
