type Worm = ((...args: unknown[]) => Worm) & { [key: string]: unknown }

function worm(root = false): Worm {
  const obj = function () {
    if (
      !root &&
      process.env.NODE_ENV === 'development' &&
      process.env.DEBUG?.startsWith('hanzogui')
    ) {
      console.warn(`

This has been excluded via Gui!
Check "excludeReactNativeWebExports" setting and include it to fix.

${new Error().stack}

`)
    }
    return worm()
  } as Worm
  if (root) Object.defineProperty(obj, 'default', { get: () => worm() })
  obj.displayName = 'ProxyWorm - Check excludeReactNativeWebExports'
  obj._isProxyWorm = true
  // reanimated tries to find component like things
  const prototype = (obj.prototype ?? {}) as Record<string, unknown>
  prototype.isReactComponent = true
  obj.prototype = prototype
  return new Proxy(obj, {
    get(_, key) {
      return Reflect.has(obj, key) ? Reflect.get(obj, key) : worm()
    },
    apply() {
      return worm()
    },
  })
}

export default worm(true)
