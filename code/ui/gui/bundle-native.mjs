#!/usr/bin/env node

import { bundleNative } from '@hanzo/gui-native-bundle'

// Bundle for production (native.cjs)
await bundleNative({
  entry: 'src/index.ts',
  outDir: 'dist',
  fileName: 'native.cjs',
})

// Bundle for tests (test.cjs)
await bundleNative({
  entry: 'src/index.ts',
  outDir: 'dist',
  fileName: 'test.cjs',
  define: {
    'process.env.NODE_ENV': JSON.stringify('test'),
  },
})
