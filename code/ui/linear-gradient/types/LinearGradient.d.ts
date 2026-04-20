import type { ColorTokens, GetProps, ThemeTokens } from '@hanzogui/core';
import type { LinearGradientPoint } from './linear-gradient';
export type LinearGradientExtraProps = {
    colors?: (ColorTokens | ThemeTokens | (string & {}))[];
    locations?: number[] | null;
    start?: LinearGradientPoint | null;
    end?: LinearGradientPoint | null;
};
export declare const LinearGradient: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof LinearGradientExtraProps> & LinearGradientExtraProps, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & LinearGradientExtraProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export type LinearGradientProps = GetProps<typeof LinearGradient>;
//# sourceMappingURL=LinearGradient.d.ts.map