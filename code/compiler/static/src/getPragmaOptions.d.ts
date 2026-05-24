export declare function getPragmaOptions({ source, path }: {
    source: string;
    path: string;
}): {
    shouldPrintDebug: boolean | "verbose";
    shouldDisable: boolean;
};
