import { Collapsible } from '@hanzogui/collapsible';
import type { GetProps, HanzoguiElement } from '@hanzogui/core';
import { View } from '@hanzogui/core';
import { H1 } from '@hanzogui/text';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    __scopeAccordion?: string;
};
type AccordionElement = AccordionImplMultipleElement | AccordionImplSingleElement;
interface AccordionSingleProps extends AccordionImplSingleProps {
    type: 'single';
}
interface AccordionMultipleProps extends AccordionImplMultipleProps {
    type: 'multiple';
}
type AccordionImplSingleElement = AccordionImplElement;
interface AccordionImplSingleProps extends AccordionImplProps {
    /**
     * The controlled stateful value of the accordion item whose content is expanded.
     */
    value?: string;
    /**
     * The value of the item whose content is expanded when the accordion is initially rendered. Use
     * `defaultValue` if you do not need to control the state of an accordion.
     */
    defaultValue?: string;
    /**
     * The callback that fires when the state of the accordion changes.
     */
    onValueChange?(value: string): void;
    /**
     * Whether an accordion item can be collapsed after it has been opened.
     * @default false
     */
    collapsible?: boolean;
}
type AccordionImplMultipleElement = AccordionImplElement;
interface AccordionImplMultipleProps extends AccordionImplProps {
    /**
     * The controlled stateful value of the accordion items whose contents are expanded.
     */
    value?: string[];
    /**
     * The value of the items whose contents are expanded when the accordion is initially rendered. Use
     * `defaultValue` if you do not need to control the state of an accordion.
     */
    defaultValue?: string[];
    /**
     * The callback that fires when the state of the accordion changes.
     */
    onValueChange?(value: string[]): void;
}
type AccordionImplElement = HanzoguiElement;
type PrimitiveDivProps = GetProps<typeof View>;
interface AccordionImplProps extends PrimitiveDivProps {
    /**
     * Whether or not an accordion is disabled from user interaction.
     *
     * @defaultValue false
     */
    disabled?: boolean;
    /**
     * The layout in which the Accordion operates.
     * @default vertical
     */
    orientation?: React.AriaAttributes['aria-orientation'];
    /**
     * The language read direction.
     */
    dir?: Direction;
    /**
     *  The callback that fires when the state of the accordion changes. for use with `useAccordion`
     * @param selected - The values of the accordion items whose contents are expanded.
     */
    control?(selected: string[]): void;
}
type CollapsibleProps = React.ComponentPropsWithoutRef<typeof Collapsible>;
interface AccordionItemProps extends Omit<CollapsibleProps, 'open' | 'defaultOpen' | 'onOpenChange'> {
    /**
     * Whether or not an accordion item is disabled from user interaction.
     *
     * @defaultValue false
     */
    disabled?: boolean;
    /**
     * A string value for the accordion item. All items within an accordion should use a unique value.
     */
    value: string;
}
type PrimitiveHeading3Props = React.ComponentPropsWithoutRef<typeof H1>;
type AccordionHeaderProps = PrimitiveHeading3Props;
declare const AccordionTriggerFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").StackNonStyleProps & void, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
type AccordionTriggerProps = GetProps<typeof AccordionTriggerFrame>;
declare const AccordionContentFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, HanzoguiElement, import("@hanzogui/core").StackNonStyleProps & import("@hanzogui/collapsible").CollapsibleContentExtraProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
type AccordionContentProps = GetProps<typeof AccordionContentFrame>;
declare const Accordion: React.ForwardRefExoticComponent<ScopedProps<AccordionSingleProps | AccordionMultipleProps> & React.RefAttributes<AccordionElement>> & {
    Trigger: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").StackNonStyleProps & void, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, HanzoguiElement, import("@hanzogui/core").StackNonStyleProps & void, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    Header: React.ForwardRefExoticComponent<Omit<Omit<import("@hanzogui/core").TextNonStyleProps, "unstyled" | "size" | keyof import("@hanzogui/core").TextStylePropsBase> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").TextStylePropsBase> & {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/core").FontSizeTokens | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").TextStylePropsBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").TextStylePropsBase> & {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/core").FontSizeTokens | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").TextStylePropsBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/core").FontSizeTokens | undefined;
    }>> & React.RefAttributes<import("@hanzogui/core").HanzoguiTextElement>, "ref"> & React.RefAttributes<(HTMLElement & import("@hanzogui/core").HanzoguiElementMethods) | import("react-native").Text>>;
    Content: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").StackNonStyleProps & import("@hanzogui/collapsible").CollapsibleContentExtraProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, HanzoguiElement, import("@hanzogui/core").StackNonStyleProps & import("@hanzogui/collapsible").CollapsibleContentExtraProps & void, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
    Item: React.ForwardRefExoticComponent<AccordionItemProps & React.RefAttributes<(HTMLElement & import("@hanzogui/core").HanzoguiElementMethods) | import("react-native").View>>;
    HeightAnimator: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {}>, HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps & void, import("@hanzogui/core").StackStyleBase, {}, {}>;
};
export { Accordion };
export type { AccordionContentProps, AccordionHeaderProps, AccordionItemProps, AccordionMultipleProps, AccordionSingleProps, AccordionTriggerProps, };
//# sourceMappingURL=Accordion.d.ts.map