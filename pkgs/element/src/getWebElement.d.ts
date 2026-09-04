import type { GuiElement } from './types.ts';
/**
 * Narrows a GuiElement to an HTMLElement, with optional generic for further casting.
 * Throws if the element is not an instanceof HTMLElement.
 *
 * @example
 * ```tsx
 * const el = getWebElement(ref.current) // HTMLElement
 * const input = getWebElement<HTMLInputElement>(ref.current) // HTMLInputElement
 * ```
 */
export declare function getWebElement<T extends HTMLElement = HTMLElement>(element: GuiElement | null | undefined): T;
//# sourceMappingURL=getWebElement.d.ts.map