import type { ColorTokens, GetProps, ThemeTokens } from '@hanzogui/core';
import type { LinearGradientPoint } from './linear-gradient';
export type LinearGradientExtraProps = {
    colors?: (ColorTokens | ThemeTokens | (string & {}))[];
    locations?: number[] | null;
    start?: LinearGradientPoint | null;
    end?: LinearGradientPoint | null;
};
export declare const LinearGradient: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof LinearGradientExtraProps> & LinearGradientExtraProps, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & LinearGradientExtraProps, import("@hanzogui/web").StackStyleBase, {
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export type LinearGradientProps = GetProps<typeof LinearGradient>;
//# sourceMappingURL=LinearGradient.d.ts.map