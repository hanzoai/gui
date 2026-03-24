/**
 * @hanzogui/static-sync
 *
 * Synchronous API for Hanzo GUI static extraction using synckit.
 * Wraps @hanzogui/static's worker implementation to provide sync APIs
 * required by Babel plugins which cannot use async functions.
 *
 * This package uses synckit to convert async worker calls into synchronous ones.
 */
import type { BabelFileResult } from '@babel/core';
import type { GuiOptions } from '@hanzogui/types';
export type { ExtractedResponse, GuiProjectInfo } from '@hanzogui/static';
export type { GuiOptions } from '@hanzogui/types';
export declare const getPragmaOptions: (props: {
    source: string;
    path: string;
}) => any;
/**
 * Extract Hanzo GUI components to className-based CSS for web (synchronous)
 */
export declare function extractToClassNamesSync(params: {
    source: string | Buffer;
    sourcePath?: string;
    options: GuiOptions;
    shouldPrintDebug?: boolean | 'verbose';
}): any;
/**
 * Extract Hanzo GUI components to React Native StyleSheet format (synchronous)
 */
export declare function extractToNativeSync(sourceFileName: string, sourceCode: string, options: GuiOptions): BabelFileResult;
/**
 * Get babel plugin that uses synchronous extraction
 */
export declare function getBabelPlugin(): any;
//# sourceMappingURL=index.d.ts.map