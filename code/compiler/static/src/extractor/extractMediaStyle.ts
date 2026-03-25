import type { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import type { GuiInternalConfig } from '@hanzogui/core'
import * as core from '@hanzogui/core'
import type { ViewStyle } from 'react-native'

import { requireGuiCore } from '../helpers/requireGuiCore'
import type { StyleObject, GuiOptionsWithFileInfo, Ternary } from '../types'
import { isPresent, isValidImport } from './extractHelpers'

export function extractMediaStyle(
  props: GuiOptionsWithFileInfo,
  ternary: Ternary,
  jsxPath: NodePath<t.JSXElement>,
  guiConfig: GuiInternalConfig,
  sourcePath: string,
  importance = 0,
  shouldPrintDebug: boolean | 'verbose' = false
) {
  const { getCSSStylesAtomic } = requireGuiCore('web')
  const mt = getMediaQueryTernary(props, ternary, jsxPath, sourcePath)
  if (!mt) {
    return null
  }
  const { key } = mt
  const mq = guiConfig.media[key]
  if (!mq) {
    console.error(`Media query "${key}" not found: ${Object.keys(guiConfig.media)}`)
    return null
  }
  const getStyleObj = (styleObj: ViewStyle | null, negate = false) => {
    return styleObj ? { styleObj, negate } : null
  }
  const styleOpts = [
    getStyleObj(ternary.consequent, false),
    getStyleObj(ternary.alternate, true),
  ].filter(isPresent)
  if (shouldPrintDebug && !styleOpts.length) {
    console.info('  media query, no styles?')
    return null
  }
  // for now order first strongest
  const mediaKeys = Object.keys(guiConfig.media)
  const mediaKeyPrecendence = mediaKeys.reduce((acc, cur, i) => {
    acc[cur] = new Array(importance + 1).fill(':root').join('')
    return acc
  }, {})
  let mediaStyles: StyleObject[] = []

  // TODO this should NOT be here
  // this should be done using the same logic as createMediaStyle

  for (const { styleObj, negate } of styleOpts) {
    const styles = getCSSStylesAtomic(styleObj as any)

    const singleMediaStyles = styles.map((style) => {
      const mediaStyle = core.createMediaStyle(style, key, guiConfig.media, true, negate)
      const className = `.${mediaStyle[core.StyleObjectIdentifier]}`
      return {
        ...mediaStyle,
        className,
      }
    })

    if (shouldPrintDebug === 'verbose') {
      console.info(
        '  media styles:',
        importance,
        styleObj,
        singleMediaStyles.map((x) => x[core.StyleObjectIdentifier]).join(', ')
      )
    }
    // add to output
    mediaStyles = [...mediaStyles, ...singleMediaStyles]
  }
  // filter out
  ternary.remove()
  return { mediaStyles, ternaryWithoutMedia: mt.ternaryWithoutMedia }
}

function getMediaQueryTernary(
  props: GuiOptionsWithFileInfo,
  ternary: Ternary,
  jsxPath: NodePath<t.JSXElement>,
  sourcePath: string
): null | {
  key: string
  bindingName: string
  ternaryWithoutMedia: Ternary | null
} {
  // this handles unwrapping logical && media query ternarys
  // first, unwrap if it has media logicalExpression
  if (t.isLogicalExpression(ternary.test) && ternary.test.operator === '&&') {
    // *should* be normalized to always be on left side
    const mediaLeft = getMediaInfoFromExpression(
      props,
      ternary.test.left,
      jsxPath,
      sourcePath,
      ternary.inlineMediaQuery
    )
    if (mediaLeft) {
      return {
        ...mediaLeft,
        ternaryWithoutMedia: {
          ...ternary,
          test: ternary.test.right,
        },
      }
    }
  }
  // const media = useMedia()
  // ... media.sm
  const result = getMediaInfoFromExpression(
    props,
    ternary.test,
    jsxPath,
    sourcePath,
    ternary.inlineMediaQuery
  )
  if (result) {
    return {
      ...result,
      ternaryWithoutMedia: null,
    }
  }
  return null
}

function getMediaInfoFromExpression(
  props: GuiOptionsWithFileInfo,
  test: t.Expression,
  jsxPath: NodePath<t.JSXElement>,
  sourcePath: string,
  inlineMediaQuery?: string
) {
  if (inlineMediaQuery) {
    return {
      key: inlineMediaQuery,
      bindingName: inlineMediaQuery,
    }
  }
  if (
    t.isMemberExpression(test) &&
    t.isIdentifier(test.object) &&
    t.isIdentifier(test.property)
  ) {
    const name = test.object['name']
    const key = test.property['name']
    const bindings = jsxPath.scope.getAllBindings()
    const binding = bindings[name]
    if (!binding) return false
    const bindingNode = binding.path?.node
    if (!t.isVariableDeclarator(bindingNode) || !bindingNode.init) return false
    if (!isValidMediaCall(props, jsxPath, bindingNode.init, sourcePath)) return false
    return { key, bindingName: name }
  }
  if (t.isIdentifier(test)) {
    const key = test.name
    const node = jsxPath.scope.getBinding(test.name)?.path?.node
    if (!t.isVariableDeclarator(node)) return false
    if (!node.init || !isValidMediaCall(props, jsxPath, node.init, sourcePath))
      return false
    return { key, bindingName: key }
  }
  return null
}

export function isValidMediaCall(
  props: GuiOptionsWithFileInfo,
  jsxPath: NodePath<t.JSXElement>,
  init: t.Expression,
  sourcePath: string
) {
  if (!init || !t.isCallExpression(init)) return false
  if (!t.isIdentifier(init.callee)) return false
  // TODO could support renaming useMedia by looking up import first
  if (init.callee.name !== 'useMedia') return false
  const bindings = jsxPath.scope.getAllBindings()
  const mediaBinding = bindings['useMedia']
  if (!mediaBinding) return false
  const useMediaImport = mediaBinding.path.parent
  if (!t.isImportDeclaration(useMediaImport)) return false
  if (!isValidImport(props, sourcePath)) {
    return false
  }
  return true
}
