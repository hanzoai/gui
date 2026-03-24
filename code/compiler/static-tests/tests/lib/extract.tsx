import * as babel from '@babel/core'
import type { ExtractToClassNamesProps } from '@hanzogui/static'
import { createExtractor, extractToClassNames } from '@hanzogui/static'

export async function extractForNative(code: string) {
  const out = await babel.transformAsync(code, {
    configFile: './babel-config-test.cjs',
    filename: 'test.tsx',
  })

  return out
}

// cache extractor to avoid OOM in CI from repeated config loading
let cachedExtractor: ReturnType<typeof createExtractor> | null = null

function getExtractor() {
  if (!cachedExtractor) {
    cachedExtractor = createExtractor()
  }
  return cachedExtractor
}

export async function extractForWeb(
  source: string,
  opts?: Partial<ExtractToClassNamesProps>
) {
  return await extractToClassNames({
    extractor: getExtractor(),
    shouldPrintDebug: source.startsWith('// debug'),
    source,
    sourcePath: `/test.tsx`,
    ...opts,
    options: {
      platform: 'web',
      components: ['@hanzo/gui', '@hanzogui/core', '@hanzogui/test-design-system'],
      config: './tests/lib/gui.config.cjs',
      ...opts?.options,
    },
  })
}
