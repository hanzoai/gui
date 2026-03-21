/// <reference types="vitest" />

import { createRequire } from 'node:module'
import { join } from 'node:path'
import { type Plugin, defineConfig } from 'vite'

export const requireResolve =
  'url' in import.meta ? createRequire(import.meta.url).resolve : require.resolve

export function getConfig(tamaguiPlugin: any) {
  const isNative =
    !process.env.DISABLE_REACT_NATIVE &&
    !process.env.DISABLE_NATIVE_TEST &&
    process.env.HANZO_GUI_TARGET !== 'web'

  const nativeExtensions =
    process.env.TEST_NATIVE_PLATFORM === 'ios'
      ? [
          '.ios.ts',
          '.ios.tsx',
          '.ios.js',
          '.ios.jsx',
          '.native.tsx',
          '.native.ts',
          '.native.js',
          '.native.jsx',
          '.cjs',
          '.js',
          '.ts',
          '.jsx',
          '.tsx',
          '.json',
        ]
      : [
          '.native.tsx',
          '.native.ts',
          '.native.js',
          '.native.jsx',
          '.ios.ts',
          '.ios.tsx',
          '.ios.js',
          '.ios.jsx',
          '.cjs',
          '.js',
          '.ts',
          '.jsx',
          '.tsx',
          '.json',
        ]

  return defineConfig({
    plugins: [
      // isNative ? null : reactNative(),
      // react({}),

      tamaguiPlugin({
        components: ['@hanzo/gui'],
        config: './tamagui.config.ts',
        disableWatchTamaguiConfig: true,
        disable: true,
      }),

      {
        name: 'native-test',
        async config() {
          if (isNative) {
            return {
              resolve: {
                // 'react-native', breaks because vitest isnt doing .native.js :/
                conditions: ['react-native', 'require', 'default'],
                alias: {
                  '@hanzo/gui-core': '@hanzo/gui-core/native-test',
                  '@hanzo/gui-web': '@hanzo/gui-core/native-test',
                },
                extensions: nativeExtensions,
              },

              optimizeDeps: {
                include: ['@hanzo/gui-constants', '@hanzo/gui-web', '@hanzo/gui-core'],
                extensions: nativeExtensions,
                jsx: 'automatic',
              },
            }
          }
        },
      } satisfies Plugin,
    ].filter(Boolean),

    define: {
      'process.env.HANZO_GUI_TARGET': JSON.stringify(process.env.HANZO_GUI_TARGET),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      // otherwise react logs Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
      __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
    },

    resolve: {
      alias: isNative
        ? [
            {
              find: /^react-native$/,
              replacement: '@hanzo/gui-fake-react-native',
            },
            {
              find: /^react-native\//,
              replacement: '@hanzo/gui-fake-react-native',
            },
          ]
        : {
            'react-native': '@hanzo/gui-react-native-web-lite',
          },
    },

    // @ts-ignore
    test: {
      // for compat with some jest libs (like @testing-library/jest-dom)
      globals: true,
      setupFiles: [
        join(__dirname, 'test-setup.ts'),
        ...(isNative ? [join(__dirname, 'test-setup-native.cjs')] : []),
      ],
      // happy-dom has issues with components-test
      environment: process.env.TEST_ENVIRONMENT || 'happy-dom',
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      // increase teardown timeout to avoid worker cleanup issues
      teardownTimeout: 10000,
    },
  })
}
