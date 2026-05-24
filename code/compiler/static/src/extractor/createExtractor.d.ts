import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import type { ExtractorOptions, ExtractorParseProps, HanzoguiOptions } from '../types';
import type { HanzoguiProjectInfo } from './bundleConfig';
import { cleanupBeforeExit } from './getStaticBindingsForScope';
export type Extractor = ReturnType<typeof createExtractor>;
type FileOrPath = NodePath<t.Program> | t.File;
export declare function createExtractor({ logger, platform }?: ExtractorOptions): {
    options: {
        logger: import("../types").Logger;
    };
    cleanupBeforeExit: typeof cleanupBeforeExit;
    loadHanzogui: (props: HanzoguiOptions) => Promise<HanzoguiProjectInfo>;
    loadHanzoguiSync: (props: HanzoguiOptions) => HanzoguiProjectInfo;
    getHanzogui(): import("@hanzogui/web").HanzoguiInternalConfig;
    parseSync: (f: FileOrPath, props: ExtractorParseProps) => {
        styled: number;
        flattened: number;
        optimized: number;
        modified: number;
        found: number;
    };
    parse: (f: FileOrPath, props: ExtractorParseProps) => Promise<{
        styled: number;
        flattened: number;
        optimized: number;
        modified: number;
        found: number;
    }>;
};
export {};
