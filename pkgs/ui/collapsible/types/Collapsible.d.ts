import type { AnimatePresenceProps } from '@hanzogui/animate-presence';
import type { YStackProps } from '@hanzogui/stacks';
import type { GetProps, ViewProps, HanzoguiElement } from '@hanzogui/web';
import { View } from '@hanzogui/web';
import * as React from 'react';
interface CollapsibleProps extends ViewProps {
    defaultOpen?: boolean;
    open?: boolean;
    disabled?: boolean;
    onOpenChange?(open: boolean): void;
}
type CollapsibleTriggerProps = GetProps<typeof View>;
declare const CollapsibleTriggerFrame: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
declare const CollapsibleTrigger: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & void, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
export interface CollapsibleContentExtraProps extends AnimatePresenceProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}
interface CollapsibleContentProps extends CollapsibleContentExtraProps, YStackProps {
}
declare const CollapsibleContentFrame: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
declare const CollapsibleContent: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, keyof CollapsibleContentExtraProps> & CollapsibleContentExtraProps, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & CollapsibleContentExtraProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
declare const Collapsible: React.ForwardRefExoticComponent<CollapsibleProps & {
    __scopeCollapsible?: string;
} & React.RefAttributes<HanzoguiElement>> & {
    Trigger: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & void, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
    Content: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}>, keyof CollapsibleContentExtraProps> & CollapsibleContentExtraProps, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & CollapsibleContentExtraProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
};
export { Collapsible, CollapsibleContent, CollapsibleContentFrame, CollapsibleTrigger, CollapsibleTriggerFrame, };
export type { CollapsibleContentProps, CollapsibleProps, CollapsibleTriggerProps };
//# sourceMappingURL=Collapsible.d.ts.map