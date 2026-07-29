import type { SizeTokens, SizeVariantSpreadFunction, ViewProps, VariantSpreadExtras } from '@hanzogui/core';
export declare const getElevation: SizeVariantSpreadFunction<ViewProps>;
export declare const getSizedElevation: (val: SizeTokens | number | boolean, { theme, tokens }: VariantSpreadExtras<any>) => {
    elevationAndroid?: number | undefined;
    shadowColor: import("@hanzogui/web").Variable<string> | import("@hanzogui/web").Variable<any> | import("@hanzogui/web").Variable<undefined> | undefined;
    shadowRadius: number;
    shadowOffset: {
        height: number;
        width: number;
    };
} | undefined;
//# sourceMappingURL=getElevation.d.ts.map