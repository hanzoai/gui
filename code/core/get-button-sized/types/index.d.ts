import type { SizeTokens, VariantSpreadExtras } from '@gui/web';
export declare const getButtonSized: (val: SizeTokens | number, { tokens, props }: VariantSpreadExtras<any>) => {
    paddingHorizontal: number;
    height: number | import("@gui/web").UnionableNumber;
    borderRadius: number;
} | {
    paddingHorizontal: import("@gui/web").Variable<number>;
    height: `$${string}.${string}` | `$${string}.${number}` | import("@gui/web").UnionableString;
    borderRadius: any;
} | undefined;
//# sourceMappingURL=index.d.ts.map