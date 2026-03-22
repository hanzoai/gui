import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { ExtractedAttr, GuiOptionsWithFileInfo, Ternary } from '../types';
export declare function isPresent<T extends object>(input: null | void | undefined | T): input is T;
export declare function isSimpleSpread(node: t.JSXSpreadAttribute): boolean;
export declare const attrStr: (attr?: ExtractedAttr) => string | t.JSXIdentifier;
export declare const objToStr: (obj: any, spacer?: string) => any;
export declare const ternaryStr: (x: Ternary) => string;
export declare function findComponentName(scope: any): string | undefined;
export declare function isValidThemeHook(props: GuiOptionsWithFileInfo, jsxPath: NodePath<t.JSXElement>, n: t.MemberExpression, sourcePath?: string): boolean;
export declare const isInsideComponentPackage: (props: GuiOptionsWithFileInfo, moduleName: string) => any;
export declare const isComponentPackage: (props: GuiOptionsWithFileInfo, srcName: string) => any;
export declare function getValidComponent(props: GuiOptionsWithFileInfo, moduleName: string, componentName: string): false | {
    staticConfig: import("@hanzo/gui-web").StaticConfig;
} | null;
export declare const isValidModule: (props: GuiOptionsWithFileInfo, moduleName: string) => {
    isLocal: boolean;
    isValid: any;
};
export declare const getValidImport: (props: GuiOptionsWithFileInfo, moduleName: string, componentName?: string) => {
    staticConfig: import("@hanzo/gui-web").StaticConfig;
} | null;
export declare const isValidImport: (props: GuiOptionsWithFileInfo, moduleName: string, componentName?: string) => any;
export declare const getValidComponentsPaths: {
    (...args: any[]): any;
    cache: Map<any, any>;
};
//# sourceMappingURL=extractHelpers.d.ts.map