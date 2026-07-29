import type { GuiElement } from '@hanzogui/core';
import type { ListItemProps } from '@hanzogui/list-item';
import * as React from 'react';
import type { SelectScopedProps } from './types';
export type SelectTriggerProps = SelectScopedProps<ListItemProps>;
export declare const SelectTrigger: React.ForwardRefExoticComponent<Omit<import("@hanzogui/web").StackNonStyleProps, "disabled" | "size" | "unstyled" | keyof import("@hanzogui/web").StackStyleBase | "variant" | "active"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}>> & import("@hanzogui/list-item").ListItemExtraProps & {
    scope?: import("./types").SelectScopes;
} & React.RefAttributes<GuiElement>>;
//# sourceMappingURL=SelectTrigger.d.ts.map