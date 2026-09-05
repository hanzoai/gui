/**
 * @hanzogui/static-sync
 *
 * Synchronous API for Gui static extraction using synckit.
 * Wraps @hanzogui/static's worker implementation to provide sync APIs
 * required by Babel plugins which cannot use async functions.
 *
 * This package uses synckit to convert async worker calls into synchronous ones.
 */

import type { FileResult } from '@babel/core'
import type { GuiOptions } from '@hanzogui/types'
import { createSyncFn } from 'synckit'
import { createRequire } from 'node:module'
import { url } from './here.ts'

const need = createRequire(url)

export type { ExtractedResponse, GuiProjectInfo } from '@hanzogui/static'
export type { GuiOptions } from '@hanzogui/types'

// The worker file, by this package's own resolution of it.
const getWorkerPath = () => need.resolve('@hanzogui/static/worker')

// Create sync function that calls the worker's runTask function
const runTaskSync = createSyncFn(getWorkerPath(), {
  timeout: 60000, // 60s timeout for sync operations
})

export const getPragmaOptions = (props: { source: string; path: string }) => {
  // This doesn't need worker, just use static directly
  const { default: Static } = need('@hanzogui/static')
  return Static.getPragmaOptions(props)
}

/**
 * Extract Gui components to className-based CSS for web (synchronous)
 */
export function extractToClassNamesSync(params: {
  source: string | Buffer
  sourcePath?: string
  options: GuiOptions
  shouldPrintDebug?: boolean | 'verbose'
}): any {
  const { source, sourcePath = '', options, shouldPrintDebug = false } = params

  if (typeof source !== 'string') {
    throw new Error('`source` must be a string of javascript')
  }

  const task = {
    type: 'extractToClassNames',
    source,
    sourcePath,
    options,
    shouldPrintDebug,
  }

  const result = runTaskSync(task) as any

  if (!result.success) {
    const errorMessage = [
      `[hanzogui-extract] Error processing file: ${sourcePath || '(unknown)'}`,
      ``,
      result.error,
      result.stack ? `\n${result.stack}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    throw new Error(errorMessage)
  }

  return result.data
}

/**
 * Extract Gui components to React Native StyleSheet format (synchronous)
 */
export function extractToNativeSync(
  sourceFileName: string,
  sourceCode: string,
  options: GuiOptions
): FileResult {
  const task = {
    type: 'extractToNative',
    sourceFileName,
    sourceCode,
    options,
  }

  const result = runTaskSync(task) as any

  if (!result.success) {
    const errorMessage = [
      `[hanzogui-extract] Error processing file: ${sourceFileName || '(unknown)'}`,
      ``,
      result.error,
      result.stack ? `\n${result.stack}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    throw new Error(errorMessage)
  }

  return result.data
}

/**
 * Get babel plugin that uses synchronous extraction
 */
export function getBabelPlugin() {
  // We need to wrap the babel plugin to use sync extraction
  const { default: Static } = need('@hanzogui/static')
  return Static.getBabelPlugin()
}
