import type { HanzoguiElement } from '@hanzogui/core';
import type { ListItemProps } from '@hanzogui/list-item';
import * as React from 'react';
import type { SelectScopedProps } from './types';
export type SelectTriggerProps = SelectScopedProps<ListItemProps>;
export declare const SelectTrigger: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").StackNonStyleProps, "disabled" | "size" | "unstyled" | keyof import("@hanzogui/core").StackStyleBase | "variant" | "active"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    size?: import("@hanzogui/core").SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & {
    size?: import("@hanzogui/core").SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
} & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {
    size?: import("@hanzogui/core").SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}>> & import("@hanzogui/list-item").ListItemExtraProps & {
    scope?: import("./types").SelectScopes;
} & React.RefAttributes<HanzoguiElement>>;
//# sourceMappingURL=SelectTrigger.d.ts.map