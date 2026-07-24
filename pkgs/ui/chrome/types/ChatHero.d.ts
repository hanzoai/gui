/**
 * ChatHero — the "What can I help with?" composer hero: a radial-gradient glow, a
 * big headline, the rounded ask-composer that forwards its value to a chat
 * target, and optional quick-action pills. Host owns submit + analytics.
 */
import { type ReactNode, type ComponentType } from 'react';
/** An icon component compatible with @hanzogui/lucide-icons-2 (size + color props). */
export type HeroIcon = ComponentType<{
    size?: number;
    color?: string;
}>;
export interface HeroPill {
    label: string;
    icon: HeroIcon;
    /** Submit the current composer value (carries the input into the chat target). */
    submit?: boolean;
    /** Or link out to a surface. */
    href?: string;
}
export interface ChatHeroProps {
    /**
     * Called with the trimmed composer value on submit. The host owns navigation +
     * analytics. If omitted, submit navigates to `href` with the value appended as `?q=`.
     */
    onSubmit?: (value: string) => void;
    /** Fallback submit target when `onSubmit` is not provided. */
    href?: string;
    /** Big headline. Defaults to "What can I help with?". */
    heading?: string;
    /** Composer placeholder. Defaults to "Ask Hanzo anything". */
    placeholder?: string;
    /** Quick-action pills under the composer (omit to hide). */
    pills?: HeroPill[];
    /** Called when a pill is pressed — host wires analytics. */
    onPill?: (pill: HeroPill) => void;
    /** Small print under the pills. */
    footnote?: ReactNode;
}
export declare function ChatHero({ onSubmit, href, heading, placeholder, pills, onPill, footnote, }: ChatHeroProps): import("react").JSX.Element;
//# sourceMappingURL=ChatHero.d.ts.map