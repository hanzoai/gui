import type { generateThemes } from './generate-themes';
export declare function writeGeneratedThemes(hanzoguiDotDir: string, outPath: string, generatedOutput: Awaited<ReturnType<typeof generateThemes>>): Promise<void>;
