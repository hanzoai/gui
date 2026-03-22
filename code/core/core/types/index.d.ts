export * from '@hanzo/gui-web';
import type { StackNonStyleProps, StackStyleBase, TamaDefer, GuiComponent, GuiElement, GuiProviderProps, GuiTextElement, TextNonStyleProps, TextProps, TextStylePropsBase } from '@hanzo/gui-web';
import { createGui as createGuiWeb } from '@hanzo/gui-web';
import type { RNTextProps, RNViewProps } from './reactNativeTypes';
export { LayoutMeasurementController, registerLayoutNode, setOnLayoutStrategy, type LayoutEvent, } from '@hanzo/gui-use-element-layout';
type RNExclusiveViewProps = Omit<RNViewProps, keyof StackNonStyleProps>;
export interface RNGuiViewNonStyleProps extends StackNonStyleProps, RNExclusiveViewProps {
}
type RNGuiView = GuiComponent<TamaDefer, GuiElement, RNGuiViewNonStyleProps, StackStyleBase, {}>;
type RNExclusiveTextProps = Omit<RNTextProps, keyof TextProps>;
export interface RNGuiTextNonStyleProps extends TextNonStyleProps, RNExclusiveTextProps {
}
type RNGuiText = GuiComponent<TamaDefer, GuiTextElement, RNGuiTextNonStyleProps, TextStylePropsBase, {}>;
export * from './reactNativeTypes';
export declare const GuiProvider: (props: GuiProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const createGui: typeof createGuiWeb;
export declare const View: RNGuiView;
export declare const Text: RNGuiText;
//# sourceMappingURL=index.d.ts.map