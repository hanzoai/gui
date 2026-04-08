/// <reference types="vitest" />

import { createRequire } from 'node:module'
import { join } from 'node:path'
import { type Plugin, defineConfig } from 'vite'

export const requireResolve =
  'url' in import.meta ? createRequire(import.meta.url).resolve : require.resolve

export function getConfig(guiPlugin: any) {
  const isNative =
    !process.env.DISABLE_REACT_NATIVE &&
    !process.env.DISABLE_NATIVE_TEST &&
    process.env.GUI_TARGET !== 'web'

  const nativeExtensions =
    process.env.TEST_NATIVE_PLATFORM === 'ios' ||
    // tvOS uses iOS-specific file extensions (Platform.OS === 'ios' per react-native-tvos)
    process.env.TEST_NATIVE_PLATFORM === 'tvos'
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
      : process.env.TEST_NATIVE_PLATFORM === 'androidtv'
        ? [
            // Android TV uses Android-specific file extensions (Platform.OS === 'android' per react-native-tvos)
            '.android.ts',
            '.android.tsx',
            '.android.js',
            '.android.jsx',
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

      guiPlugin({
        components: ['@hanzo/gui'],
        config: './gui.config.ts',
        disableWatchGuiConfig: true,
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
                  '@hanzogui/core': '@hanzogui/core/native-test',
                  '@hanzogui/web': '@hanzogui/core/native-test',
                },
                extensions: nativeExtensions,
              },

              optimizeDeps: {
                include: ['@hanzogui/constants', '@hanzogui/web', '@hanzogui/core'],
                extensions: nativeExtensions,
                jsx: 'automatic',
              },
            }
          }
        },
      } satisfies Plugin,
    ].filter(Boolean),

    define: {
      'process.env.GUI_TARGET': JSON.stringify(process.env.GUI_TARGET),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      // otherwise react logs Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
      __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
    },

    resolve: {
      alias: isNative
        ? [
            {
              find: /^react-native$/,
              replacement: '@hanzogui/fake-react-native',
            },
            {
              find: /^react-native\//,
              replacement: '@hanzogui/fake-react-native',
            },
          ]
        : {
            'react-native': '@hanzogui/react-native-web-lite',
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
