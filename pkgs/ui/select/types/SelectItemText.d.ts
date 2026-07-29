import type { GetProps, GuiTextElement } from '@hanzogui/core';
import type { SelectScopedProps } from './types';
export declare const ITEM_TEXT_NAME = "SelectItemText";
export declare const SelectItemTextFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, GuiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
type SelectItemTextExtraProps = SelectScopedProps<{}>;
export type SelectItemTextProps = GetProps<typeof SelectItemTextFrame> & SelectItemTextExtraProps;
export declare const SelectItemText: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}>, "scope"> & {
    scope?: import("./types").SelectScopes;
}, GuiTextElement, import("@hanzogui/web").TextNonStyleProps & {
    scope?: import("./types").SelectScopes;
}, import("@hanzogui/web").TextStylePropsBase, {
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export {};
//# sourceMappingURL=SelectItemText.d.ts.map