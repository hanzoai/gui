import { type BabelFileResult } from '@babel/core';
import type { GuiOptions } from '../types';
export declare function extractToNative(sourceFileName: string, sourceCode: string, options: GuiOptions): BabelFileResult;
export declare function getBabelPlugin(): any;
export declare function getBabelParseDefinition(options: GuiOptions): {
    name: string;
    visitor: {
        Program: {
            enter(this: any, root: any): void;
        };
    };
};
//# sourceMappingURL=extractToNative.d.ts.map