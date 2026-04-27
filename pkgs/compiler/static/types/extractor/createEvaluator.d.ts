import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { HanzoguiOptionsWithFileInfo } from '../types';
export declare function createEvaluator({ props, staticNamespace, sourcePath, traversePath, shouldPrintDebug, }: {
    props: HanzoguiOptionsWithFileInfo;
    staticNamespace: Record<string, any>;
    sourcePath?: string;
    traversePath?: NodePath<t.JSXElement>;
    shouldPrintDebug: boolean | 'verbose';
}): (n: t.Node) => any;
export declare function createSafeEvaluator(attemptEval: (n: t.Node) => any): (n: t.Node) => any;
//# sourceMappingURL=createEvaluator.d.ts.map