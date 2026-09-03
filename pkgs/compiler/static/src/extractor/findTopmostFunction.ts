import type { NodePath } from '@babel/traverse'
import type * as t from '@babel/types'

export function findTopmostFunction(jsxPath: NodePath<t.JSXElement>): NodePath | null {
  const isFunction = (path: NodePath) =>
    path.isArrowFunctionExpression() ||
    path.isFunctionDeclaration() ||
    path.isFunctionExpression()
  let compFn = jsxPath.findParent(isFunction)
  while (compFn) {
    const parent = compFn.findParent(isFunction)
    if (!parent) break
    compFn = parent
  }
  return compFn
}
