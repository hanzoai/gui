/**
 * @hanzogui/static-sync
 *
 * Synchronous API for Hanzogui static extraction using synckit.
 * Wraps @hanzogui/static's worker implementation to provide sync APIs
 * required by Babel plugins which cannot use async functions.
 *
 * This package uses synckit to convert async worker calls into synchronous ones.
 */
import type { BabelFileResult } from '@babel/core';
import type { HanzoguiOptions } from '@hanzogui/types';
export type { ExtractedResponse, HanzoguiProjectInfo } from '@hanzogui/static';
export type { HanzoguiOptions } from '@hanzogui/types';
export declare const getPragmaOptions: (props: {
    source: string;
    path: string;
}) => any;
/**
 * Extract Hanzogui components to className-based CSS for web (synchronous)
 */
export declare function extractToClassNamesSync(params: {
    source: string | Buffer;
    sourcePath?: string;
    options: HanzoguiOptions;
    shouldPrintDebug?: boolean | 'verbose';
}): any;
/**
 * Extract Hanzogui components to React Native StyleSheet format (synchronous)
 */
export declare function extractToNativeSync(sourceFileName: string, sourceCode: string, options: HanzoguiOptions): BabelFileResult;
/**
 * Get babel plugin that uses synchronous extraction
 */
export declare function getBabelPlugin(): any;
//# sourceMappingURL=index.d.ts.map