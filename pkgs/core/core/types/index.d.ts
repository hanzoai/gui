export * from '@hanzogui/web';
import type { StackNonStyleProps, StackStyleBase, TamaDefer, GuiComponent, GuiElement, GuiProviderProps, GuiTextElement, TextNonStyleProps, TextProps, TextStylePropsBase } from '@hanzogui/web';
import { createGui as createGuiWeb } from '@hanzogui/web';
import type { RNTextProps, RNViewProps } from './reactNativeTypes';
export { LayoutMeasurementController, registerLayoutNode, setOnLayoutStrategy, type LayoutEvent, } from '@hanzogui/use-element-layout';
type RNExclusiveViewProps = Omit<RNViewProps, keyof StackNonStyleProps>;
export interface RNViewNonStyleProps extends StackNonStyleProps, RNExclusiveViewProps {
}
type RNViewComponent = GuiComponent<TamaDefer, GuiElement, RNViewNonStyleProps, StackStyleBase, {}>;
type RNExclusiveTextProps = Omit<RNTextProps, keyof TextProps>;
export interface RNTextNonStyleProps extends TextNonStyleProps, RNExclusiveTextProps {
}
type RNTextComponent = GuiComponent<TamaDefer, GuiTextElement, RNTextNonStyleProps, TextStylePropsBase, {}>;
export * from './reactNativeTypes';
export declare const GuiProvider: (props: GuiProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const createGui: typeof createGuiWeb;
export declare const View: RNViewComponent;
export declare const Text: RNTextComponent;
//# sourceMappingURL=index.d.ts.map