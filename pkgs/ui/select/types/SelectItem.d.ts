import type { ListItemProps } from '@hanzogui/list-item';
import * as React from 'react';
type SelectItemContextValue = {
    value: string;
    textId: string;
    isSelected: boolean;
};
export declare const SelectItemContextProvider: React.Provider<SelectItemContextValue> & React.ProviderExoticComponent<Partial<SelectItemContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>, useSelectItemContext: (scope?: string) => SelectItemContextValue;
export interface SelectItemExtraProps {
    value: string;
    index: number;
    disabled?: boolean;
    textValue?: string;
}
export interface SelectItemProps extends Omit<ListItemProps, keyof SelectItemExtraProps>, SelectItemExtraProps {
}
export declare const SelectItem: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}>, keyof SelectItemExtraProps> & SelectItemExtraProps, import("@hanzogui/web").GuiElement, import("@hanzogui/web").StackNonStyleProps & SelectItemExtraProps, import("@hanzogui/web").StackStyleBase, {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export {};
//# sourceMappingURL=SelectItem.d.ts.map