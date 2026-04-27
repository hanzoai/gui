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
    loadHanzogui: (props: HanzoguiOptions) => Promise<HanzoguiProjectInfo | null>;
    loadHanzoguiSync: (props: HanzoguiOptions) => HanzoguiProjectInfo | null;
    getHanzogui(): import("@hanzogui/web").HanzoguiInternalConfig | null | undefined;
    parseSync: (f: FileOrPath, props: ExtractorParseProps) => {
        styled: number;
        flattened: number;
        optimized: number;
        modified: number;
        found: number;
    } | null;
    parse: (f: FileOrPath, props: ExtractorParseProps) => Promise<{
        styled: number;
        flattened: number;
        optimized: number;
        modified: number;
        found: number;
    } | null>;
};
export {};
//# sourceMappingURL=createExtractor.d.ts.map