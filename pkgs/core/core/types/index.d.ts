export * from '@hanzogui/web';
import type { StackNonStyleProps, StackStyleBase, TamaDefer, HanzoguiComponent, HanzoguiElement, HanzoguiProviderProps, HanzoguiTextElement, TextNonStyleProps, TextProps, TextStylePropsBase } from '@hanzogui/web';
import { createHanzogui as createHanzoguiWeb } from '@hanzogui/web';
import type { RNTextProps, RNViewProps } from './reactNativeTypes';
export { LayoutMeasurementController, registerLayoutNode, setOnLayoutStrategy, type LayoutEvent, } from '@hanzogui/use-element-layout';
type RNExclusiveViewProps = Omit<RNViewProps, keyof StackNonStyleProps>;
export interface RNHanzoguiViewNonStyleProps extends StackNonStyleProps, RNExclusiveViewProps {
}
type RNHanzoguiView = HanzoguiComponent<TamaDefer, HanzoguiElement, RNHanzoguiViewNonStyleProps, StackStyleBase, {}>;
type RNExclusiveTextProps = Omit<RNTextProps, keyof TextProps>;
export interface RNHanzoguiTextNonStyleProps extends TextNonStyleProps, RNExclusiveTextProps {
}
type RNHanzoguiText = HanzoguiComponent<TamaDefer, HanzoguiTextElement, RNHanzoguiTextNonStyleProps, TextStylePropsBase, {}>;
export * from './reactNativeTypes';
export declare const HanzoguiProvider: (props: HanzoguiProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const createHanzogui: typeof createHanzoguiWeb;
export declare const View: RNHanzoguiView;
export declare const Text: RNHanzoguiText;
//# sourceMappingURL=index.d.ts.map