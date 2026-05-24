type ModuleFormat = 'cjs' | 'esm';
export declare function detectModuleFormat(filePath: string): ModuleFormat;
export declare function clearFormatCache(): void;
export {};
