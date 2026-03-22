import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { GuiInternalConfig } from '@gui/core';
import * as core from '@gui/core';
import type { GuiOptionsWithFileInfo, Ternary } from '../types';
export declare function extractMediaStyle(props: GuiOptionsWithFileInfo, ternary: Ternary, jsxPath: NodePath<t.JSXElement>, guiConfig: GuiInternalConfig, sourcePath: string, importance?: number, shouldPrintDebug?: boolean | 'verbose'): {
    mediaStyles: core.StyleObject[];
    ternaryWithoutMedia: Ternary | null;
} | null;
export declare function isValidMediaCall(props: GuiOptionsWithFileInfo, jsxPath: NodePath<t.JSXElement>, init: t.Expression, sourcePath: string): boolean;
//# sourceMappingURL=extractMediaStyle.d.ts.map