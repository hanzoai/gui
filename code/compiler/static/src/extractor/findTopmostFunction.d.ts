import type { NodePath } from '@babel/traverse';
import type * as t from '@babel/types';
export declare function findTopmostFunction(jsxPath: NodePath<t.JSXElement>): NodePath<any>;
