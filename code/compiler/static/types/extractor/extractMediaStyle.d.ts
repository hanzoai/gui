import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { HanzoguiInternalConfig } from '@hanzogui/core';
import * as core from '@hanzogui/core';
import type { HanzoguiOptionsWithFileInfo, Ternary } from '../types';
export declare function extractMediaStyle(props: HanzoguiOptionsWithFileInfo, ternary: Ternary, jsxPath: NodePath<t.JSXElement>, hanzoguiConfig: HanzoguiInternalConfig, sourcePath: string, importance?: number, shouldPrintDebug?: boolean | 'verbose'): {
    mediaStyles: core.StyleObject[];
    ternaryWithoutMedia: Ternary | null;
} | null;
export declare function isValidMediaCall(props: HanzoguiOptionsWithFileInfo, jsxPath: NodePath<t.JSXElement>, init: t.Expression, sourcePath: string): boolean;
//# sourceMappingURL=extractMediaStyle.d.ts.map