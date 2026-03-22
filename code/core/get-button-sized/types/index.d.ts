import type { SizeTokens, VariantSpreadExtras } from '@hanzo/gui-web';
export declare const getButtonSized: (val: SizeTokens | number, { tokens, props }: VariantSpreadExtras<any>) => {
    paddingHorizontal: number;
    height: number | import("@hanzo/gui-web").UnionableNumber;
    borderRadius: number;
} | {
    paddingHorizontal: import("@hanzo/gui-web").Variable<number>;
    height: `$${string}.${string}` | `$${string}.${number}` | import("@hanzo/gui-web").UnionableString;
    borderRadius: any;
} | undefined;
//# sourceMappingURL=index.d.ts.map