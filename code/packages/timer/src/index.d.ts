export declare function timer(): {
    start(opts?: {
        quiet?: boolean;
    }): {
        (strings: TemplateStringsArray, ...vars: any[]): void;
        print: () => string;
    };
    profile(): {
        timings: Record<string, number>;
        runs: number;
    };
    print: () => string;
};
