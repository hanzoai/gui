import { type BabelFileResult } from '@babel/core';
import type { HanzoguiOptions } from '../types';
export declare function extractToNative(sourceFileName: string, sourceCode: string, options: HanzoguiOptions): BabelFileResult;
export declare function getBabelPlugin(): any;
export declare function getBabelParseDefinition(options: HanzoguiOptions): {
    name: string;
    visitor: {
        Program: {
            enter(this: any, root: any): void;
        };
    };
};
//# sourceMappingURL=extractToNative.d.ts.map