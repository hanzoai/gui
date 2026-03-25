import { createRequire as __cr } from 'module'
const require = __cr(import.meta.url)
var __defProp = Object.defineProperty
var __name = (target, value) => __defProp(target, 'name', { value, configurable: true })

// ../core/compose-refs/dist/esm/compose-refs.mjs
import * as React from 'react'
function setRef(ref, value) {
  typeof ref == 'function' ? ref(value) : ref && (ref.current = value)
}
__name(setRef, 'setRef')
function composeRefs(...refs) {
  return (node) => refs.forEach((ref) => setRef(ref, node))
}
__name(composeRefs, 'composeRefs')
function useComposedRefs(...refs) {
  return React.useCallback(composeRefs(...refs), refs)
}
__name(useComposedRefs, 'useComposedRefs')

// ../core/create-context/dist/esm/create-context.mjs
import * as React2 from 'react'
import { jsx } from 'react/jsx-runtime'
function createContext2(rootComponentName, defaultContext) {
  const Context = React2.createContext(defaultContext)
  function Provider(props) {
    const { children, ...context } = props,
      value = React2.useMemo(() => context, Object.values(context))
    return /* @__PURE__ */ jsx(Context.Provider, {
      value,
      children,
    })
  }
  __name(Provider, 'Provider')
  function useContext2(consumerName) {
    const context = React2.useContext(Context)
    if (context) return context
    if (defaultContext !== void 0) return defaultContext
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``)
  }
  __name(useContext2, 'useContext')
  return [Provider, useContext2]
}
__name(createContext2, 'createContext')
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = []
  function createContext22(rootComponentName, defaultContext) {
    const BaseContext = React2.createContext(defaultContext),
      index = defaultContexts.length
    defaultContexts = [...defaultContexts, defaultContext]
    function Provider(props) {
      const { scope, children, ...context } = props,
        Context = scope?.[scopeName]?.[index] || BaseContext,
        value = React2.useMemo(() => context, Object.values(context))
      return /* @__PURE__ */ jsx(Context.Provider, {
        value,
        children,
      })
    }
    __name(Provider, 'Provider')
    function useContext2(consumerName, scope, options) {
      const Context = scope?.[scopeName]?.[index] || BaseContext,
        context = React2.useContext(Context)
      if (context) return context
      if (defaultContext !== void 0) return defaultContext
      const missingContextMessage = `\`${consumerName}\` must be used within \`${rootComponentName}\``
      if (options?.fallback)
        return (
          options?.warn !== false && console.warn(missingContextMessage), options.fallback
        )
      throw new Error(missingContextMessage)
    }
    __name(useContext2, 'useContext')
    return [Provider, useContext2]
  }
  __name(createContext22, 'createContext2')
  const createScope = /* @__PURE__ */ __name(() => {
    const scopeContexts = defaultContexts.map((defaultContext) =>
      React2.createContext(defaultContext)
    )
    return function (scope) {
      const contexts = scope?.[scopeName] || scopeContexts
      return React2.useMemo(
        () => ({
          [`__scope${scopeName}`]: {
            ...scope,
            [scopeName]: contexts,
          },
        }),
        [scope, contexts]
      )
    }
  }, 'createScope')
  return (
    (createScope.scopeName = scopeName),
    [createContext22, composeContextScopes(createScope, ...createContextScopeDeps)]
  )
}
__name(createContextScope, 'createContextScope')
function composeContextScopes(...scopes) {
  const baseScope = scopes[0]
  if (scopes.length === 1) return baseScope
  const createScope = /* @__PURE__ */ __name(() => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName,
    }))
    return function (overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const currentScope = useScope(overrideScopes)[`__scope${scopeName}`]
        return {
          ...nextScopes2,
          ...currentScope,
        }
      }, {})
      return React2.useMemo(
        () => ({
          [`__scope${baseScope.scopeName}`]: nextScopes,
        }),
        [nextScopes]
      )
    }
  }, 'createScope')
  return ((createScope.scopeName = baseScope.scopeName), createScope)
}
__name(composeContextScopes, 'composeContextScopes')

// ../core/font-size/dist/esm/getFontSize.mjs
import { getConfig, isVariable } from '@hanzogui/core'
var getFontSize = /* @__PURE__ */ __name((inSize, opts) => {
  const res = getFontSizeVariable(inSize, opts)
  return isVariable(res) ? +res.val : res ? +res : 16
}, 'getFontSize')
var getFontSizeVariable = /* @__PURE__ */ __name((inSize, opts) => {
  const token = getFontSizeToken(inSize, opts)
  if (!token) return inSize
  const conf = getConfig()
  return conf.fontsParsed[opts?.font || conf.defaultFontToken]?.size[token]
}, 'getFontSizeVariable')
var getFontSizeToken = /* @__PURE__ */ __name((inSize, opts) => {
  if (typeof inSize == 'number') return null
  const relativeSize = opts?.relativeSize || 0,
    conf = getConfig(),
    fontSize =
      conf.fontsParsed[opts?.font || conf.defaultFontToken]?.size || // fallback to size tokens
      conf.tokensParsed.size,
    size =
      (inSize === '$true' && !('$true' in fontSize) ? '$4' : inSize) ??
      ('$true' in fontSize ? '$true' : '$4'),
    sizeTokens = Object.keys(fontSize)
  let foundIndex = sizeTokens.indexOf(size)
  ;(foundIndex === -1 &&
    size.endsWith('.5') &&
    (foundIndex = sizeTokens.indexOf(size.replace('.5', ''))),
    process.env.NODE_ENV === 'development' &&
      foundIndex === -1 &&
      console.warn('No font size found', size, opts, 'in size tokens', sizeTokens))
  const tokenIndex = Math.min(
    Math.max(0, foundIndex + relativeSize),
    sizeTokens.length - 1
  )
  return sizeTokens[tokenIndex] ?? size
}, 'getFontSizeToken')

// ../core/react-native-media-driver/dist/esm/createMedia.mjs
import { setupMatchMedia } from '@hanzogui/web'

// ../core/react-native-media-driver/dist/esm/matchMedia.mjs
var matchMedia = globalThis.matchMedia

// ../core/react-native-media-driver/dist/esm/createMedia.mjs
function createMedia(media) {
  return (setupMatchMedia(matchMedia), media)
}
__name(createMedia, 'createMedia')

// ../core/simple-hash/dist/esm/index.mjs
var cache = /* @__PURE__ */ new Map()
var cacheSize = 0
var simpleHash = /* @__PURE__ */ __name((strIn, hashMin = 10) => {
  if (cache.has(strIn)) return cache.get(strIn)
  let str = strIn
  str[0] === 'v' && str.startsWith('var(') && (str = str.slice(6, str.length - 1))
  let hash = 0,
    valids = '',
    added = 0
  const len = str.length
  for (let i = 0; i < len; i++) {
    if (hashMin !== 'strict' && added <= hashMin) {
      const char = str.charCodeAt(i)
      if (char === 46) {
        valids += '--'
        continue
      }
      if (isValidCSSCharCode(char)) {
        ;(added++, (valids += str[i]))
        continue
      }
    }
    hash = hashChar(hash, str[i])
  }
  const res = valids + (hash ? Math.abs(hash) : '')
  return (
    cacheSize > 1e4 && (cache.clear(), (cacheSize = 0)),
    cache.set(strIn, res),
    cacheSize++,
    res
  )
}, 'simpleHash')
var hashChar = /* @__PURE__ */ __name(
  (hash, c) => (Math.imul(31, hash) + c.charCodeAt(0)) | 0,
  'hashChar'
)
function isValidCSSCharCode(code) {
  return (
    // A-Z
    (code >= 65 && code <= 90) || // a-z
    (code >= 97 && code <= 122) || // _
    code === 95 || // -
    code === 45 || // 0-9
    (code >= 48 && code <= 57)
  )
}
__name(isValidCSSCharCode, 'isValidCSSCharCode')

// ../core/helpers/dist/esm/clamp.mjs
function clamp(value, [min, max]) {
  return Math.min(max, Math.max(min, value))
}
__name(clamp, 'clamp')

// ../core/helpers/dist/esm/composeEventHandlers.mjs
function composeEventHandlers(og, next, { checkDefaultPrevented = true } = {}) {
  return !og || !next
    ? next || og || void 0
    : (event) => {
        if (
          (og?.(event),
          !event ||
            !(
              checkDefaultPrevented &&
              typeof event == 'object' &&
              'defaultPrevented' in event
            ) || // @ts-ignore
            ('defaultPrevented' in event && !event.defaultPrevented))
        )
          return next?.(event)
      }
}
__name(composeEventHandlers, 'composeEventHandlers')

// ../core/helpers/dist/esm/types.mjs
var StyleObjectProperty = 0
var StyleObjectValue = 1
var StyleObjectIdentifier = 2
var StyleObjectPseudo = 3
var StyleObjectRules = 4

// ../core/constants/dist/esm/constants.mjs
import { useEffect, useLayoutEffect } from 'react'
var isWeb = true
var isBrowser = typeof window < 'u'
var isServer = isWeb && !isBrowser
var isClient = isWeb && isBrowser
var isChrome = typeof navigator < 'u' && /Chrome/.test(navigator.userAgent || '')
var isWebTouchable =
  isClient && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
var isAndroid = false
var isIos = process.env.TEST_NATIVE_PLATFORM === 'ios'
var currentPlatform = 'web'

// ../core/helpers/dist/esm/shouldRenderNativePlatform.mjs
var ALL_PLATFORMS = ['web', 'android', 'ios']
function shouldRenderNativePlatform(nativeProp) {
  if (!nativeProp) return null
  const userRequestedPlatforms = resolvePlatformNames(nativeProp)
  for (const platform of ALL_PLATFORMS)
    if (platform === currentPlatform && userRequestedPlatforms.has(platform))
      return platform
  return null
}
__name(shouldRenderNativePlatform, 'shouldRenderNativePlatform')
function resolvePlatformNames(nativeProp) {
  const platforms =
      nativeProp === true
        ? ALL_PLATFORMS
        : nativeProp === false
          ? []
          : Array.isArray(nativeProp)
            ? nativeProp
            : [nativeProp],
    set = new Set(platforms)
  return (
    set.has('mobile') && (set.add('android'), set.add('ios'), set.delete('mobile')), set
  )
}
__name(resolvePlatformNames, 'resolvePlatformNames')

// ../core/helpers/dist/esm/webOnlyStyleProps.mjs
var nonAnimatableWebViewProps = {
  backgroundAttachment: true,
  backgroundBlendMode: true,
  backgroundClip: true,
  backgroundOrigin: true,
  backgroundRepeat: true,
  borderBottomStyle: true,
  borderLeftStyle: true,
  borderRightStyle: true,
  borderTopStyle: true,
  contain: true,
  containerType: true,
  content: true,
  float: true,
  maskBorderMode: true,
  maskBorderRepeat: true,
  maskClip: true,
  maskComposite: true,
  maskMode: true,
  maskOrigin: true,
  maskRepeat: true,
  maskType: true,
  objectFit: true,
  overflowBlock: true,
  overflowInline: true,
  overflowX: true,
  overflowY: true,
  // NOTE: pointerEvents is NOT web-only - it's a core React Native View prop (not a style)
  pointerEvents: true,
  scrollbarWidth: true,
  textWrap: true,
  touchAction: true,
  transformStyle: true,
  willChange: true,
}
var nonAnimatableWebTextProps = {
  whiteSpace: true,
  wordWrap: true,
  textOverflow: true,
  WebkitBoxOrient: true,
}
var webOnlyStylePropsView = {
  ...nonAnimatableWebViewProps,
  transition: true,
  backdropFilter: true,
  WebkitBackdropFilter: true,
  background: true,
  borderTop: true,
  borderRight: true,
  borderBottom: true,
  borderLeft: true,
  backgroundPosition: true,
  backgroundSize: true,
  borderImage: true,
  caretColor: true,
  clipPath: true,
  mask: true,
  maskBorder: true,
  maskBorderOutset: true,
  maskBorderSlice: true,
  maskBorderSource: true,
  maskBorderWidth: true,
  maskImage: true,
  maskPosition: true,
  maskSize: true,
  objectPosition: true,
  textEmphasis: true,
  userSelect: true,
}
var webOnlyStylePropsText = {
  ...nonAnimatableWebTextProps,
  textDecorationDistance: true,
  // cursor: now cross-platform - in stylePropsView
  WebkitLineClamp: true,
}

// ../core/helpers/dist/esm/validStyleProps.mjs
var cssShorthandLonghands = {
  // border longhands
  borderWidth: true,
  borderStyle: true,
  borderColor: true,
  borderTopWidth: true,
  borderTopStyle: true,
  borderTopColor: true,
  borderRightWidth: true,
  borderRightStyle: true,
  borderRightColor: true,
  borderBottomWidth: true,
  borderBottomStyle: true,
  borderBottomColor: true,
  borderLeftWidth: true,
  borderLeftStyle: true,
  borderLeftColor: true,
  // outline longhands
  outlineWidth: true,
  outlineStyle: true,
  outlineColor: true,
  outlineOffset: true,
}
var textColors = {
  color: true,
  textDecorationColor: true,
  textShadowColor: true,
}
var tokenCategories = {
  radius: {
    borderRadius: true,
    borderTopLeftRadius: true,
    borderTopRightRadius: true,
    borderBottomLeftRadius: true,
    borderBottomRightRadius: true,
    // logical
    borderStartStartRadius: true,
    borderStartEndRadius: true,
    borderEndStartRadius: true,
    borderEndEndRadius: true,
  },
  size: {
    width: true,
    height: true,
    minWidth: true,
    minHeight: true,
    maxWidth: true,
    maxHeight: true,
    blockSize: true,
    minBlockSize: true,
    maxBlockSize: true,
    inlineSize: true,
    minInlineSize: true,
    maxInlineSize: true,
  },
  zIndex: {
    zIndex: true,
  },
  color: {
    backgroundColor: true,
    borderColor: true,
    borderBlockStartColor: true,
    borderBlockEndColor: true,
    borderBlockColor: true,
    borderBottomColor: true,
    borderInlineColor: true,
    borderInlineStartColor: true,
    borderInlineEndColor: true,
    borderTopColor: true,
    borderLeftColor: true,
    borderRightColor: true,
    borderEndColor: true,
    borderStartColor: true,
    shadowColor: true,
    ...textColors,
    // outlineColor is supported on RN 0.77+ (New Architecture)
    outlineColor: true,
    caretColor: true,
  },
}
var nonAnimatableViewProps = {
  alignContent: true,
  alignItems: true,
  alignSelf: true,
  backfaceVisibility: true,
  borderCurve: true,
  borderStyle: true,
  borderBlockStyle: true,
  borderBlockEndStyle: true,
  borderBlockStartStyle: true,
  borderInlineStyle: true,
  borderInlineEndStyle: true,
  borderInlineStartStyle: true,
  boxSizing: true,
  cursor: true,
  direction: true,
  display: true,
  flexDirection: true,
  flexWrap: true,
  isolation: true,
  justifyContent: true,
  mixBlendMode: true,
  outlineStyle: true,
  overflow: true,
  position: true,
}
var nonAnimatableFontProps = {
  fontFamily: true,
  fontStyle: true,
  fontVariant: true,
  textTransform: true,
}
var nonAnimatableTextOnlyProps = {
  textAlign: true,
  textDecorationLine: true,
  textDecorationStyle: true,
  userSelect: true,
}
var nonAnimatableUnitlessProps = {
  WebkitLineClamp: true,
  lineClamp: true,
  gridTemplateColumns: true,
  gridTemplateAreas: true,
}
var nonAnimatableStyleProps = {
  ...nonAnimatableViewProps,
  ...nonAnimatableFontProps,
  ...nonAnimatableTextOnlyProps,
  ...nonAnimatableUnitlessProps,
  ...nonAnimatableWebViewProps,
  ...nonAnimatableWebTextProps,
}
var stylePropsUnitless = {
  ...nonAnimatableUnitlessProps,
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexOrder: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  fontWeight: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowGap: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnGap: true,
  gridColumnStart: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  scale: true,
  scaleX: true,
  scaleY: true,
  scaleZ: true,
  shadowOpacity: true,
}
var stylePropsTransform = {
  x: true,
  y: true,
  scale: true,
  perspective: true,
  scaleX: true,
  scaleY: true,
  skewX: true,
  skewY: true,
  matrix: true,
  rotate: true,
  rotateY: true,
  rotateX: true,
  rotateZ: true,
}
var stylePropsView = {
  ...nonAnimatableViewProps,
  borderBottomEndRadius: true,
  borderBottomStartRadius: true,
  borderBottomWidth: true,
  borderLeftWidth: true,
  borderRightWidth: true,
  borderBlockWidth: true,
  borderBlockEndWidth: true,
  borderBlockStartWidth: true,
  borderInlineWidth: true,
  borderInlineEndWidth: true,
  borderInlineStartWidth: true,
  borderTopEndRadius: true,
  borderTopStartRadius: true,
  borderTopWidth: true,
  borderWidth: true,
  transform: true,
  transformOrigin: true,
  borderEndWidth: true,
  borderStartWidth: true,
  bottom: true,
  end: true,
  flexBasis: true,
  gap: true,
  columnGap: true,
  rowGap: true,
  left: true,
  margin: true,
  marginBlock: true,
  marginBlockEnd: true,
  marginBlockStart: true,
  marginInline: true,
  marginInlineStart: true,
  marginInlineEnd: true,
  marginBottom: true,
  marginEnd: true,
  marginHorizontal: true,
  marginLeft: true,
  marginRight: true,
  marginStart: true,
  marginTop: true,
  marginVertical: true,
  padding: true,
  paddingBottom: true,
  paddingInline: true,
  paddingBlock: true,
  paddingBlockStart: true,
  paddingInlineEnd: true,
  paddingInlineStart: true,
  paddingEnd: true,
  paddingHorizontal: true,
  paddingLeft: true,
  paddingRight: true,
  paddingStart: true,
  paddingTop: true,
  paddingVertical: true,
  right: true,
  start: true,
  top: true,
  inset: true,
  insetBlock: true,
  insetBlockEnd: true,
  insetBlockStart: true,
  insetInline: true,
  insetInlineEnd: true,
  insetInlineStart: true,
  shadowOffset: true,
  shadowRadius: true,
  ...tokenCategories.color,
  ...tokenCategories.radius,
  ...tokenCategories.size,
  ...stylePropsTransform,
  ...stylePropsUnitless,
  ...(isAndroid
    ? {
        elevationAndroid: true,
      }
    : {}),
  boxShadow: true,
  border: true,
  filter: true,
  // RN 0.76+ supports linear-gradient via backgroundImage
  backgroundImage: true,
  // the actual RN 0.76+ prop name (backgroundImage expands to this on native)
  experimental_backgroundImage: true,
  // RN 0.76/0.77+ style props (New Architecture)
  outline: true,
  outlineColor: true,
  outlineOffset: true,
  outlineWidth: true,
  // web-only for convenience - tree-shaken on native
  ...webOnlyStylePropsView,
}
var stylePropsFont = {
  ...nonAnimatableFontProps,
  fontSize: true,
  fontWeight: true,
  letterSpacing: true,
  lineHeight: true,
}
var stylePropsTextOnly = {
  ...stylePropsFont,
  ...nonAnimatableTextOnlyProps,
  ...textColors,
  textShadow: true,
  textShadowOffset: true,
  textShadowRadius: true,
  verticalAlign: true,
  // web-only text props - tree-shaken on native
  ...webOnlyStylePropsText,
}
var stylePropsText = {
  ...stylePropsView,
  ...stylePropsTextOnly,
}
var stylePropsAll = stylePropsText
var validPseudoKeys = {
  enterStyle: true,
  exitStyle: true,
  hoverStyle: true,
  pressStyle: true,
  focusStyle: true,
  disabledStyle: true,
  focusWithinStyle: true,
  focusVisibleStyle: true,
}
var validStyles = stylePropsView

// ../core/start-transition/dist/esm/index.mjs
import { startTransition as reactStartTransition } from 'react'
var startTransition = /* @__PURE__ */ __name((callback) => {
  reactStartTransition(callback)
}, 'startTransition')

// ../core/theme/dist/esm/_mutateTheme.mjs
import {
  ensureThemeVariable,
  forceUpdateThemes,
  getConfig as getConfig2,
  getThemeCSSRules,
  mutatedAutoVariables,
  proxyThemeToParents,
  simpleHash as simpleHash2,
  updateConfig,
} from '@hanzogui/web'
function mutateThemes({ themes, batch, insertCSS = true, ...props }) {
  const allThemesProxied = {},
    allThemesRaw = {}
  for (const { name, theme } of themes) {
    const res = _mutateTheme({
      ...props,
      name,
      theme,
      // we'll do one update at the end
      avoidUpdate: true,
      // always add which also replaces but doesnt fail first time
      mutationType: 'add',
    })
    res && ((allThemesProxied[name] = res.theme), (allThemesRaw[name] = res.themeRaw))
  }
  const cssRules = insertCSS ? insertThemeCSS(allThemesRaw, batch) : []
  return (
    startTransition(() => {
      for (const themeName in allThemesProxied) {
        const theme = allThemesProxied[themeName]
        updateThemeConfig(themeName, theme)
      }
      updateThemeStates()
    }),
    {
      themes: allThemesProxied,
      themesRaw: allThemesRaw,
      cssRules,
    }
  )
}
__name(mutateThemes, 'mutateThemes')
function _mutateTheme(props) {
  if (isServer) {
    process.env.NODE_ENV === 'development' &&
      console.warn('Theme mutation is not supported on server side')
    return
  }
  const config = getConfig2(),
    { name: themeName, theme: themeIn, insertCSS, mutationType } = props
  if (process.env.NODE_ENV === 'development') {
    if (!config) throw new Error('No config')
    const theme2 = config.themes[props.name]
    if (mutationType !== 'add' && !theme2)
      throw new Error(
        `${mutationType === 'replace' ? 'Replace' : 'Update'} theme failed! Theme ${props.name} does not exist`
      )
  }
  const theme = {
    ...(mutationType === 'update' ? (config.themes[themeName] ?? {}) : {}),
    ...themeIn,
  }
  for (const key in theme) ensureThemeVariable(theme, key)
  const themeProxied = proxyThemeToParents(themeName, theme),
    response = {
      themeRaw: theme,
      theme: themeProxied,
      cssRules: [],
    }
  return (
    props.avoidUpdate ||
      (insertCSS &&
        (response.cssRules = insertThemeCSS({
          [themeName]: theme,
        })),
      updateThemeConfig(themeName, themeProxied),
      updateThemeStates()),
    response
  )
}
__name(_mutateTheme, '_mutateTheme')
function updateThemeConfig(themeName, theme) {
  const config = getConfig2()
  ;((config.themes[themeName] = theme), updateConfig('themes', config.themes))
}
__name(updateThemeConfig, 'updateThemeConfig')
function updateThemeStates() {
  forceUpdateThemes()
}
__name(updateThemeStates, 'updateThemeStates')
function insertThemeCSS(themes, batch = false) {
  const config = getConfig2()
  let cssRules = []
  for (const themeName in themes) {
    const theme = themes[themeName],
      rules = getThemeCSSRules({
        config,
        themeName,
        names: [themeName],
        hasDarkLight: true,
        theme,
        // Use mutated variable creator which starts from high index to avoid conflicts
        useMutatedVariables: true,
      })
    ;((cssRules = [...cssRules, ...rules]),
      batch || updateStyle(`t_theme_style_${themeName}`, rules))
  }
  if (mutatedAutoVariables.length > 0) {
    const autoVarCSS = `:root{${mutatedAutoVariables.map((v) => `--${v.name}:${v.val}`).join(';')}}`
    updateStyle('t_mutate_vars', [autoVarCSS])
  }
  if (batch) {
    const id =
      typeof batch == 'string' ? batch : simpleHash2(Object.keys(themes).join(''))
    updateStyle(`t_theme_style_${id}`, cssRules)
  }
  return cssRules
}
__name(insertThemeCSS, 'insertThemeCSS')
function updateStyle(id, rules) {
  const existing = document.querySelector(`#${id}`),
    style = document.createElement('style')
  ;((style.id = id),
    style.appendChild(
      document.createTextNode(
        rules.join(`
`)
      )
    ),
    document.head.appendChild(style),
    existing && existing.parentElement?.removeChild(existing))
}
__name(updateStyle, 'updateStyle')

// ../core/theme/dist/esm/addTheme.mjs
function addTheme(props) {
  return _mutateTheme({
    ...props,
    insertCSS: true,
    mutationType: 'add',
  })
}
__name(addTheme, 'addTheme')

// ../core/theme/dist/esm/updateTheme.mjs
function updateTheme({ name, theme }) {
  return _mutateTheme({
    name,
    theme,
    insertCSS: true,
    mutationType: 'update',
  })
}
__name(updateTheme, 'updateTheme')

// ../core/theme/dist/esm/replaceTheme.mjs
function replaceTheme({ name, theme }) {
  return _mutateTheme({
    name,
    theme,
    insertCSS: true,
    mutationType: 'replace',
  })
}
__name(replaceTheme, 'replaceTheme')

// ../core/use-event/dist/esm/useGet.mjs
import * as React3 from 'react'
var isServer2 = typeof window > 'u'
var useIsomorphicInsertionEffect = isServer2
  ? React3.useEffect
  : React3.useInsertionEffect || React3.useLayoutEffect
function useGet(currentValue, initialValue2, forwardToFunction) {
  const curRef = React3.useRef(initialValue2 ?? currentValue)
  return (
    useIsomorphicInsertionEffect(() => {
      curRef.current = currentValue
    }),
    React3.useCallback(
      forwardToFunction
        ? (...args) => curRef.current?.apply(null, args)
        : () => curRef.current,
      []
    )
  )
}
__name(useGet, 'useGet')

// ../core/use-event/dist/esm/useEvent.mjs
function useEvent(callback) {
  return useGet(callback, defaultValue, true)
}
__name(useEvent, 'useEvent')
var defaultValue = /* @__PURE__ */ __name(() => {
  throw new Error('Cannot call an event handler while rendering.')
}, 'defaultValue')

// ../core/use-controllable-state/dist/esm/useControllableState.mjs
import * as React4 from 'react'
var emptyCallbackFn = /* @__PURE__ */ __name((_) => _(), 'emptyCallbackFn')
function useControllableState({
  prop,
  defaultProp,
  onChange,
  strategy = 'prop-wins',
  preventUpdate,
  transition,
}) {
  const [state, setState] = React4.useState(prop ?? defaultProp),
    previous = React4.useRef(state),
    propWins = strategy === 'prop-wins' && prop !== void 0,
    value = propWins ? prop : state,
    onChangeCb = useEvent(onChange || idFn),
    transitionFn = transition ? startTransition : emptyCallbackFn
  ;(React4.useEffect(() => {
    prop !== void 0 &&
      ((previous.current = prop),
      transitionFn(() => {
        setState(prop)
      }))
  }, [prop]),
    React4.useEffect(() => {
      propWins ||
        (state !== previous.current && ((previous.current = state), onChangeCb(state)))
    }, [onChangeCb, state, propWins]))
  const setter = useEvent((next) => {
    if (!preventUpdate)
      if (propWins) {
        const nextValue = typeof next == 'function' ? next(previous.current) : next
        onChangeCb(nextValue)
      } else
        transitionFn(() => {
          setState(next)
        })
  })
  return [value, setter]
}
__name(useControllableState, 'useControllableState')
var idFn = /* @__PURE__ */ __name(() => {}, 'idFn')

// ../core/use-debounce/dist/esm/index.mjs
import * as React5 from 'react'
function debounce(func, wait, leading) {
  let timeout,
    isCancelled = false
  function debounced() {
    isCancelled = false
    const args = arguments
    ;(leading && !timeout && func.apply(this, args),
      clearTimeout(timeout),
      (timeout = setTimeout(() => {
        ;((timeout = null),
          leading || isCancelled || func.apply(this, args),
          (isCancelled = false))
      }, wait)))
  }
  __name(debounced, 'debounced')
  return (
    (debounced.cancel = () => {
      isCancelled = true
    }),
    debounced
  )
}
__name(debounce, 'debounce')
var defaultOpts = {
  leading: false,
}
function useDebounce(fn, wait, options = defaultOpts, mountArgs = [fn]) {
  const dbEffect = React5.useRef(null)
  return (
    React5.useEffect(
      () => () => {
        dbEffect.current?.cancel()
      },
      []
    ),
    React5.useMemo(
      () => ((dbEffect.current = debounce(fn, wait, options.leading)), dbEffect.current),
      [options.leading, ...mountArgs]
    )
  )
}
__name(useDebounce, 'useDebounce')
function useDebounceValue(val, amt = 0) {
  const [state, setState] = React5.useState(val)
  return (
    React5.useEffect(() => {
      const tm = setTimeout(() => {
        setState((prev) => (prev === val ? prev : val))
      }, amt)
      return () => {
        clearTimeout(tm)
      }
    }, [val]),
    state
  )
}
__name(useDebounceValue, 'useDebounceValue')

// ../core/use-force-update/dist/esm/index.mjs
import React6 from 'react'
var isServerSide = typeof window > 'u'
var idFn2 = /* @__PURE__ */ __name(() => {}, 'idFn')
function useForceUpdate() {
  return isServerSide ? idFn2 : React6.useReducer((x) => Math.random(), 0)[1]
}
__name(useForceUpdate, 'useForceUpdate')

// ../packages/element/dist/esm/useWebRef.mjs
import * as React7 from 'react'
function useWebRef(forwardedRef) {
  const ref = React7.useRef(null),
    composedRef = useComposedRefs(ref, forwardedRef)
  return {
    ref,
    composedRef,
  }
}
__name(useWebRef, 'useWebRef')

// ../packages/element/dist/esm/useNativeRef.mjs
import * as React8 from 'react'
function useNativeRef(forwardedRef) {
  const ref = React8.useRef(null),
    composedRef = useComposedRefs(ref, forwardedRef)
  return {
    ref,
    composedRef,
  }
}
__name(useNativeRef, 'useNativeRef')
function useNativeInputRef(forwardedRef) {
  const ref = React8.useRef(null),
    composedRef = useComposedRefs(ref, forwardedRef)
  return {
    ref,
    composedRef,
  }
}
__name(useNativeInputRef, 'useNativeInputRef')

// ../packages/element/dist/esm/getWebElement.mjs
function getWebElement(element) {
  if (!element) throw new Error('Element is null or undefined')
  if (!(element instanceof HTMLElement)) throw new Error('Element is not an HTMLElement')
  return element
}
__name(getWebElement, 'getWebElement')

// ../core/use-window-dimensions/dist/esm/index.mjs
import React9 from 'react'

// ../core/use-window-dimensions/dist/esm/initialValue.mjs
var initialValue = {
  width: 800,
  height: 600,
  scale: 1,
  fontScale: 1,
}
function configureInitialWindowDimensions(next) {
  Object.assign(initialValue, next)
}
__name(configureInitialWindowDimensions, 'configureInitialWindowDimensions')

// ../core/use-window-dimensions/dist/esm/helpers.mjs
var lastSize = initialValue
var docEl = null
function getWindowSize() {
  docEl ||= window.document.documentElement
  const nextSize = {
    fontScale: 1,
    height: docEl.clientHeight,
    scale: window.devicePixelRatio || 1,
    width: docEl.clientWidth,
  }
  return nextSize.height !== lastSize.height ||
    nextSize.width !== lastSize.width ||
    nextSize.scale !== lastSize.scale
    ? ((lastSize = nextSize), nextSize)
    : lastSize
}
__name(getWindowSize, 'getWindowSize')
var cbs = /* @__PURE__ */ new Set()
if (isClient) {
  let flushUpdate = /* @__PURE__ */ __name(function () {
      ;((lastUpdate = Date.now()), cbs.forEach((cb) => cb(getWindowSize())))
    }, 'flushUpdate'),
    lastUpdate = Date.now(),
    tm
  const USER_MAX_MS = process.env.HANZO_GUI_USE_WINDOW_DIMENSIONS_MAX_UPDATE_MS,
    updateMaxMs = USER_MAX_MS ? +USER_MAX_MS : 100,
    onResize = /* @__PURE__ */ __name(() => {
      clearTimeout(tm)
      const timeSinceLast = Date.now() - lastUpdate
      timeSinceLast < updateMaxMs
        ? (tm = setTimeout(() => {
            flushUpdate()
          }, updateMaxMs - timeSinceLast))
        : flushUpdate()
    }, 'onResize')
  window.addEventListener('resize', onResize)
}
function subscribe(cb) {
  return (cbs.add(cb), () => cbs.delete(cb))
}
__name(subscribe, 'subscribe')

// ../core/use-window-dimensions/dist/esm/index.mjs
function useWindowDimensions({ serverValue = initialValue } = {}) {
  return React9.useSyncExternalStore(subscribe, getWindowSize, () =>
    isWeb ? serverValue : getWindowSize()
  )
}
__name(useWindowDimensions, 'useWindowDimensions')

// ../ui/gui/dist/esm/createGui.mjs
import { createGui as createGuiCore } from '@hanzogui/core'
var createGui =
  process.env.NODE_ENV !== 'development'
    ? createGuiCore
    : (conf) => {
        const sizeTokenKeys = ['$true'],
          hasKeys = /* @__PURE__ */ __name(
            (expectedKeys, obj) => expectedKeys.every((k) => typeof obj[k] < 'u'),
            'hasKeys'
          ),
          guiConfig = createGuiCore(conf)
        for (const name of ['size', 'space']) {
          const tokenSet = guiConfig.tokensParsed[name]
          if (!tokenSet)
            throw new Error(
              `Expected tokens for "${name}" in ${Object.keys(guiConfig.tokensParsed).join(', ')}`
            )
          if (!hasKeys(sizeTokenKeys, tokenSet))
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
        const expected = Object.keys(guiConfig.tokensParsed.size)
        for (const name of ['radius', 'zIndex']) {
          const tokenSet = guiConfig.tokensParsed[name],
            received = Object.keys(tokenSet)
          if (!received.some((rk) => expected.includes(rk)))
            throw new Error(`
createGui() invalid tokens.${name}:

Received: ${received.join(', ')}

Expected a subset of: ${expected.join(', ')}

`)
        }
        return guiConfig
      }

// ../ui/gui/dist/esm/views/GuiProvider.mjs
import { GuiProvider as CoreGuiProvider } from '@hanzogui/core'
var GuiProvider = CoreGuiProvider

// ../ui/gui/dist/esm/views/EnsureFlexed.mjs
import { Text, styled } from '@hanzogui/core'
var EnsureFlexed = styled(Text, {
  opacity: 0,
  lineHeight: 0,
  height: 0,
  display: 'flex',
  fontSize: 200,
  children: 'wwwwwwwwwwwwwwwwwww',
  pointerEvents: 'none',
})
EnsureFlexed.isVisuallyHidden = true

// ../ui/gui/dist/esm/views/Text.mjs
import { Text as GuiText, styled as styled2 } from '@hanzogui/core'
var Text2 = styled2(GuiText, {
  variants: {
    unstyled: {
      false: {
        color: '$color',
      },
    },
  },
  defaultVariants: {
    unstyled: process.env.HANZO_GUI_HEADLESS === '1',
  },
})

// ../ui/gui/dist/esm/index.mjs
import {
  ClientOnly,
  Configuration,
  ComponentContext,
  GroupContext,
  FontLanguage,
  Theme,
  View,
  createComponent,
  createFont,
  createShorthands,
  createStyledContext,
  createTokens,
  createVariable,
  getConfig as getConfig3,
  getMedia,
  getCSSStylesAtomic,
  getThemes,
  getToken,
  getTokenValue,
  getTokens,
  getVariable,
  getVariableName,
  getVariableValue,
  insertFont,
  setConfig,
  setupDev,
  _withStableStyle,
  isBrowser as isBrowser2,
  isChrome as isChrome2,
  isClient as isClient2,
  isServer as isServer3,
  isGuiComponent,
  isGuiElement,
  isTouchable,
  isVariable as isVariable2,
  isWeb as isWeb2,
  isWebTouchable as isWebTouchable2,
  matchMedia as matchMedia2,
  mediaObjectToString,
  mediaQueryConfig,
  mediaState,
  setOnLayoutStrategy,
  styled as styled3,
  themeable,
  useClientValue,
  useDidFinishSSR,
  useEvent as useEvent2,
  useGet as useGet2,
  useIsTouchDevice,
  useIsomorphicLayoutEffect,
  useMedia,
  useProps,
  usePropsAndStyle,
  useStyle,
  useConfiguration,
  useTheme,
  useThemeName,
  variableToString,
  withStaticProperties,
} from '@hanzogui/core'
export {
  ClientOnly,
  ComponentContext,
  Configuration,
  EnsureFlexed,
  FontLanguage,
  GroupContext,
  GuiProvider,
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectPseudo,
  StyleObjectRules,
  StyleObjectValue,
  Text2 as Text,
  Theme,
  View,
  _withStableStyle,
  addTheme,
  clamp,
  composeEventHandlers,
  composeRefs,
  configureInitialWindowDimensions,
  createComponent,
  createContext2 as createContext,
  createContextScope,
  createFont,
  createGui,
  createMedia,
  createShorthands,
  createStyledContext,
  createTokens,
  createVariable,
  cssShorthandLonghands,
  debounce,
  getCSSStylesAtomic,
  getConfig3 as getConfig,
  getFontSize,
  getFontSizeToken,
  getFontSizeVariable,
  getMedia,
  getThemes,
  getToken,
  getTokenValue,
  getTokens,
  getVariable,
  getVariableName,
  getVariableValue,
  getWebElement,
  insertFont,
  isBrowser2 as isBrowser,
  isChrome2 as isChrome,
  isClient2 as isClient,
  isGuiComponent,
  isGuiElement,
  isServer3 as isServer,
  isServerSide,
  isTouchable,
  isVariable2 as isVariable,
  isWeb2 as isWeb,
  isWebTouchable2 as isWebTouchable,
  matchMedia2 as matchMedia,
  mediaObjectToString,
  mediaQueryConfig,
  mediaState,
  mutateThemes,
  nonAnimatableStyleProps,
  nonAnimatableWebTextProps,
  nonAnimatableWebViewProps,
  replaceTheme,
  setConfig,
  setOnLayoutStrategy,
  setRef,
  setupDev,
  shouldRenderNativePlatform,
  simpleHash,
  stylePropsAll,
  stylePropsText,
  stylePropsTextOnly,
  stylePropsTransform,
  stylePropsUnitless,
  stylePropsView,
  styled3 as styled,
  themeable,
  tokenCategories,
  updateTheme,
  useClientValue,
  useComposedRefs,
  useConfiguration,
  useControllableState,
  useDebounce,
  useDebounceValue,
  useDidFinishSSR,
  useEvent2 as useEvent,
  useForceUpdate,
  useGet2 as useGet,
  useIsTouchDevice,
  useIsomorphicLayoutEffect,
  useMedia,
  useNativeInputRef,
  useNativeRef,
  useProps,
  usePropsAndStyle,
  useStyle,
  useTheme,
  useThemeName,
  useWebRef,
  useWindowDimensions,
  validPseudoKeys,
  validStyles,
  variableToString,
  webOnlyStylePropsText,
  webOnlyStylePropsView,
  withStaticProperties,
}
