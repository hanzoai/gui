import type { SizeTokens, SizeVariantSpreadFunction, ViewProps, VariantSpreadExtras } from '@hanzogui/core';
export declare const getElevation: SizeVariantSpreadFunction<ViewProps>;
export declare const getSizedElevation: (val: SizeTokens | number | boolean, { theme, tokens }: VariantSpreadExtras<any>) => {
    elevationAndroid?: number;
    shadowColor: import("@hanzogui/core").Variable<string> | import("@hanzogui/core").Variable<any>;
    shadowRadius: number;
    shadowOffset: {
        height: number;
        width: number;
    };
};
