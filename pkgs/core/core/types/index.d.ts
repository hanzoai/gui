export * from '@hanzogui/web';
import type { StackNonStyleProps, StackStyleBase, TamaDefer, HanzoguiComponent, HanzoguiElement, HanzoguiProviderProps, HanzoguiTextElement, TextNonStyleProps, TextProps, TextStylePropsBase } from '@hanzogui/web';
import { createHanzogui as createHanzoguiWeb } from '@hanzogui/web';
import type { RNTextProps, RNViewProps } from './reactNativeTypes';
export { LayoutMeasurementController, registerLayoutNode, setOnLayoutStrategy, type LayoutEvent, } from '@hanzogui/use-element-layout';
type RNExclusiveViewProps = Omit<RNViewProps, keyof StackNonStyleProps>;
export interface RNViewNonStyleProps extends StackNonStyleProps, RNExclusiveViewProps {
}
type RNViewComponent = HanzoguiComponent<TamaDefer, HanzoguiElement, RNViewNonStyleProps, StackStyleBase, {}>;
type RNExclusiveTextProps = Omit<RNTextProps, keyof TextProps>;
export interface RNTextNonStyleProps extends TextNonStyleProps, RNExclusiveTextProps {
}
type RNTextComponent = HanzoguiComponent<TamaDefer, HanzoguiTextElement, RNTextNonStyleProps, TextStylePropsBase, {}>;
export * from './reactNativeTypes';
export declare const HanzoguiProvider: (props: HanzoguiProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const createHanzogui: typeof createHanzoguiWeb;
export declare const View: RNViewComponent;
export declare const Text: RNTextComponent;
//# sourceMappingURL=index.d.ts.map