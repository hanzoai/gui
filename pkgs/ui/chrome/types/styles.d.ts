/**
 * styles — the shared Tamagui `styled()` atoms + hooks every chrome component
 * composes. All styling lives INSIDE `styled()` (the compiler flattens it to
 * atomic CSS); component files pass only variants + content.
 *
 * Tamagui facts this package respects:
 *  - element type is set with `render: 'a' | 'button' | …` (not `tag`);
 *  - only Text carries `color` (Stacks/Views do not), so hover colour-lift on a
 *    row is driven by `useHover()` + an explicit `color` prop on the child Text;
 *  - anchors forward `href`/`target`/`rel` through a `.styleable` wrapper
 *    (`linkable`), the same pattern as the repo's own `Anchor`.
 */
import { type CSSProperties } from 'react';
import { View } from '@hanzogui/web';
import { XStack, YStack } from '@hanzogui/stacks';
/**
 * matchMedia breakpoint. Plain hook (not Tamagui `$lg` media props): this package
 * is built in isolation without the host config augmentation, so media keys are
 * not in the generic config type here — and the chrome is client-side anyway.
 * Defaults wide so SSR/first paint match on desktop.
 */
export declare function useIsWide(min?: number): boolean;
/** Hover state for colour-lift on icon+text rows (Stacks can't cascade `color`). */
export declare function useHover(): {
    hovered: boolean;
    onHoverIn: () => void;
    onHoverOut: () => void;
};
/**
 * CSS-transition-on-mount reveal (returned as a `style` object). Used instead of
 * Tamagui's `animation` prop for the same isolation reason as `useIsWide`.
 */
export declare function useReveal(opts?: {
    delay?: number;
    y?: number;
    duration?: number;
}): CSSProperties;
/** Wrap a `render:'a'` styled frame so it accepts + forwards href/target/rel. */
export declare function linkable<F extends {
    styleable: (fn: (props: any, ref: any) => any) => any;
}>(Frame: F): any;
export { XStack, YStack, View };
/** The one Geist text base; `kind` selects the marketing type scale. */
export declare const Txt: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    kind?: "body" | "nav" | "strong" | "wordmark" | "explore" | "desc" | "kicker" | "dim" | "mobile" | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
/** A footer/mobile text-link — the whole element is the anchor, so its own hover lifts colour. */
export declare const LinkText: any;
/** A raised menu/panel card (login + Try dropdowns). */
export declare const Surface: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
/** A block link row inside a Surface / mega-panel — hover washes the background. */
export declare const LinkRow: any;
/** 1px hairline. */
export declare const Divider: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
/** Round icon button (search / menu / close) — background washes on hover. */
export declare const IconBtn: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, import("@hanzogui/web").StaticConfigPublic>;
//# sourceMappingURL=styles.d.ts.map