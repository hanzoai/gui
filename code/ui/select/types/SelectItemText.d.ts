import type { GetProps, HanzoguiTextElement } from '@hanzogui/core';
import type { SelectScopedProps } from './types';
export declare const ITEM_TEXT_NAME = "SelectItemText";
export declare const SelectItemTextFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiTextElement, import("@hanzogui/core").TextNonStyleProps, import("@hanzogui/core").TextStylePropsBase, {
    size?: import("@hanzogui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
type SelectItemTextExtraProps = SelectScopedProps<{}>;
export type SelectItemTextProps = GetProps<typeof SelectItemTextFrame> & SelectItemTextExtraProps;
export declare const SelectItemText: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").TextNonStyleProps, import("@hanzogui/core").TextStylePropsBase, {
    size?: import("@hanzogui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}>, "scope"> & {
    scope?: import("./types").SelectScopes;
}, HanzoguiTextElement, import("@hanzogui/core").TextNonStyleProps & {
    scope?: import("./types").SelectScopes;
}, import("@hanzogui/core").TextStylePropsBase, {
    size?: import("@hanzogui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export {};
//# sourceMappingURL=SelectItemText.d.ts.map