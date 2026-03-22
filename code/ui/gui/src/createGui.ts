import { createGui as createGuiCore } from '@hanzo/gui-core'

/**
 * Adds some helpful validation at dev time only for `gui` specifically
 **/

export const createGui: typeof createGuiCore =
  process.env.NODE_ENV !== 'development'
    ? createGuiCore
    : (conf) => {
        const sizeTokenKeys = ['$true']

        const hasKeys = (expectedKeys: string[], obj: Record<any, any>) => {
          return expectedKeys.every((k) => typeof obj[k] !== 'undefined')
        }

        const guiConfig = createGuiCore(conf)

        // size and space should be fully defined
        for (const name of ['size', 'space'] as const) {
          const tokenSet = guiConfig.tokensParsed[name]
          if (!tokenSet) {
            throw new Error(
              `Expected tokens for "${name}" in ${Object.keys(
                guiConfig.tokensParsed
              ).join(', ')}`
            )
          }
          if (!hasKeys(sizeTokenKeys, tokenSet)) {
            throw new Error(`
createGui() missing expected tokens.${name}:

Received: ${Object.keys(tokenSet).join(', ')}

Expected: ${sizeTokenKeys.join(', ')}

Hanzo GUI expects a "true" key that is the same value as your default size. This is so 
it can size things up or down from the defaults without assuming which keys you use.

Please define a "true" or "$true" key on your size and space tokens like so (example):

size: {
  sm: 2,
  md: 10,
  true: 10, // this means "md" is your default size
  lg: 20,
}

`)
          }
        }

        // others must define subset of size tokens
        const expected = Object.keys(guiConfig.tokensParsed.size)
        for (const name of ['radius', 'zIndex'] as const) {
          const tokenSet = guiConfig.tokensParsed[name]
          const received = Object.keys(tokenSet)
          const hasSomeOverlap = received.some((rk) => expected.includes(rk))
          if (!hasSomeOverlap) {
            throw new Error(`
createGui() invalid tokens.${name}:

Received: ${received.join(', ')}

Expected a subset of: ${expected.join(', ')}

`)
          }
        }

        return guiConfig
      }
