import * as StaticWorker from '@hanzogui/static-worker'
import type { GuiOptions } from '@hanzogui/types'
import type { LoaderContext } from 'webpack'
import { requireResolve } from './requireResolve'

const { getPragmaOptions, isExtractable } = StaticWorker

Error.stackTraceLimit = Number.POSITIVE_INFINITY

/**
 * webpack takes the css loader as a PATH, and the same source is emitted next
 * to this file as css.cjs by the CJS build and css.mjs by the ESM build.
 *
 * The candidates used to be .cjs / .esm / .js. No build has ever written a
 * `css.esm` or a `css.js`, so from the ESM build all three missed and the last
 * one threw MODULE_NOT_FOUND while the real file, css.mjs, sat beside it. That
 * is the whole reason `withGui()` could not be loaded from a .mjs next.config:
 * static extraction was unreachable and apps fell back to shipping the atomic
 * sheet inline.
 */
const CSS_LOADER_PATH = ['./css.cjs', './css.mjs'].reduce((found, candidate) => {
  if (found) return found
  try {
    return requireResolve(candidate)
  } catch {
    return ''
  }
}, '')

if (!CSS_LOADER_PATH) {
  throw new Error(
    `@hanzogui/loader: no css.cjs or css.mjs beside the loader — this build of the package is incomplete.`
  )
}

let index = 0

process.env.GUI_TARGET = 'web'

export const loader = async function loader(
  this: LoaderContext<GuiOptions>,
  sourceIn: Buffer | string
) {
  this.cacheable(true)
  const callback = this.async()
  const sourcePath = `${this.resourcePath}`

  const options: GuiOptions = {
    // @ts-ignore
    platform: 'web',
    ...this.getOptions(),
  }

  // the same answer extractToClassNames gives, given here so an unextractable
  // file never costs a worker round-trip
  if (!isExtractable(sourcePath, options.extractPackages)) {
    return callback(null, sourceIn)
  }

  const source = sourceIn.toString()

  try {

    const { shouldDisable, shouldPrintDebug } = await getPragmaOptions({
      source,
      path: sourcePath,
    })

    if (shouldPrintDebug === 'verbose') {
      console.warn(`\n\n --- Incoming source --- \n\n`)
      console.warn(source)
    }

    if (shouldDisable) {
      if (shouldPrintDebug) {
        console.info('Disabling on file via pragma')
      }
      return callback(null, source)
    }

    const cssPath = `${sourcePath}.${index++}.hanzogui.css`

    // Filter out non-serializable properties before passing to worker
    const serializableOptions = { ...options }
    for (const key in serializableOptions) {
      const value = serializableOptions[key as keyof typeof serializableOptions]
      if (typeof value === 'function') {
        delete serializableOptions[key as keyof typeof serializableOptions]
      }
    }

    const extracted = await StaticWorker.extractToClassNames({
      source,
      sourcePath,
      options: serializableOptions,
      shouldPrintDebug,
    })

    if (!extracted) {
      return callback(null, source)
    }

    // add import to css
    if (extracted.styles) {
      const cssQuery = `cssData=${Buffer.from(extracted.styles).toString('base64')}`
      const remReq = this.remainingRequest
      const importPath = `${cssPath}!=!${CSS_LOADER_PATH}?${cssQuery}!${remReq}`
      extracted.js = `${extracted.js}\n\nrequire(${JSON.stringify(importPath)})`
    }

    callback(null, extracted.js, extracted.map)
  } catch (err) {
    const message = err instanceof Error ? `${err.message}\n${err.stack}` : String(err)

    console.error('Gui Webpack Loader Error:\n', `  ${message}\n`)

    if (message.includes('Cannot create proxy')) {
      console.info(
        'This is usually due to components not loading at build-time. Check for logs just below the line above:'
      )
    }

    callback(null, source)
  }
}
