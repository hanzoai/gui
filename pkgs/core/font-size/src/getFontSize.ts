import type { FontSizeTokens, FontTokens, Variable } from '@hanzogui/core'
import { getConfig, isVariable } from '@hanzogui/core'

type GetFontSizeOpts = {
  relativeSize?: number
  font?: FontTokens
}

export const getFontSize = (
  inSize: FontSizeTokens | null | undefined,
  opts?: GetFontSizeOpts
): number => {
  const res = getFontSizeVariable(inSize, opts)
  return px(isVariable(res) ? res.val : res) ?? 16
}

// A size on a design ramp reads `var(--text-base, 14px)`; the number a caller
// needs is the fallback it carries.
const px = (val: unknown): number | undefined => {
  const n =
    typeof val === 'number'
      ? val
      : Number.parseFloat(String(val).match(/(\d*\.?\d+)px/)?.[1] ?? String(val))
  return Number.isFinite(n) ? n : undefined
}

export const getFontSizeVariable = (
  inSize: FontSizeTokens | null | undefined,
  opts?: GetFontSizeOpts
): FontSizeTokens | Variable<string> | null | undefined => {
  const token = getFontSizeToken(inSize, opts)
  if (!token) {
    return inSize
  }
  const conf = getConfig()
  const font = conf.fontsParsed[opts?.font || conf.defaultFontToken]
  return font?.size[token] as Variable<string>
}

export const getFontSizeToken = (
  inSize: FontSizeTokens | null | undefined,
  opts?: GetFontSizeOpts
): FontSizeTokens | null => {
  if (typeof inSize === 'number') {
    return null
  }
  // backwards compat
  const relativeSize = opts?.relativeSize || 0
  const conf = getConfig()
  const font = conf.fontsParsed[opts?.font || conf.defaultFontToken]
  const fontSize =
    font?.size ||
    // fallback to size tokens
    conf.tokensParsed.size
  const size =
    (inSize === '$true' && !('$true' in fontSize) ? '$4' : inSize) ??
    ('$true' in fontSize ? '$true' : '$4')

  const sizeTokens = Object.keys(fontSize)

  let foundIndex = sizeTokens.indexOf(size)
  if (foundIndex === -1) {
    if (size.endsWith('.5')) {
      foundIndex = sizeTokens.indexOf(size.replace('.5', ''))
    }
  }
  if (process.env.NODE_ENV === 'development') {
    if (foundIndex === -1) {
      console.warn('No font size found', size, opts, 'in size tokens', sizeTokens)
    }
  }
  const tokenIndex = Math.min(
    Math.max(0, foundIndex + relativeSize),
    sizeTokens.length - 1
  )
  return (sizeTokens[tokenIndex] ?? size) as FontSizeTokens
}
