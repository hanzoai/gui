import type { SizeTokens, VariantSpreadExtras } from '@hanzogui/web';
export declare const getButtonSized: (val: SizeTokens | number, { tokens, props }: VariantSpreadExtras<any>) => {
    paddingHorizontal: number;
    height: number | import("@hanzogui/web").UnionableNumber;
    borderRadius: number;
} | {
    paddingHorizontal: import("@hanzogui/web").Variable<number>;
    height: `$${string}` | `$${string}.${string}` | `$${string}.${number}` | import("@hanzogui/web").UnionableString | `$${number}`;
    borderRadius: import("@hanzogui/web").VariableVal;
};
