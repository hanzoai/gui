import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export declare function cleanupBeforeExit(): void;
export declare function getStaticBindingsForScope(scope: NodePath<t.JSXElement>['scope'], whitelist: string[], sourcePath: string, bindingCache: Record<string, string | null>, shouldPrintDebug: boolean | 'verbose'): Promise<Record<string, any>>;
