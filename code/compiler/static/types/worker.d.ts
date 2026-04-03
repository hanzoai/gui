/**
 * Worker thread implementation for GUI extraction
 * Used by both piscina (async) and synckit (sync for babel)
 */
import type { BabelFileResult } from '@babel/core';
import type { ExtractedResponse } from './extractor/extractToClassNames';
import type { GuiOptions } from './types';
export interface ExtractToClassNamesTask {
    type: 'extractToClassNames';
    source: string;
    sourcePath: string;
    options: GuiOptions;
    shouldPrintDebug: boolean | 'verbose';
}
export interface ExtractToNativeTask {
    type: 'extractToNative';
    sourceFileName: string;
    sourceCode: string;
    options: GuiOptions;
}
export interface ClearCacheTask {
    type: 'clearCache';
}
export type WorkerTask = ExtractToClassNamesTask | ExtractToNativeTask | ClearCacheTask;
export type WorkerResult = {
    success: true;
    data: ExtractedResponse | null;
} | {
    success: true;
    data: BabelFileResult;
} | {
    success: false;
    error: string;
    stack?: string;
};
/**
 * Main worker function that handles both extraction types
 * This is called by piscina for async usage
 */
export declare function runTask(task: WorkerTask): Promise<WorkerResult>;
/**
 * For synckit compatibility - exports the runTask as default
 * Synckit will call this function synchronously using worker threads
 */
export default runTask;
//# sourceMappingURL=worker.d.ts.map