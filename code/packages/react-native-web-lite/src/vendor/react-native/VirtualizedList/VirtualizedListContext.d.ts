/**
 * Resets the context. Intended for use by portal-like components (e.g. Modal).
 */
export function VirtualizedListContextResetter({ children }: {
    children: any;
}): React.JSX.Element;
/**
 * Sets the context with memoization. Intended to be used by `VirtualizedList`.
 */
export function VirtualizedListContextProvider({ children, value }: {
    children: any;
    value: any;
}): React.JSX.Element;
/**
 * Sets the `cellKey`. Intended to be used by `VirtualizedList` for each cell.
 */
export function VirtualizedListCellContextProvider({ cellKey, children }: {
    cellKey: any;
    children: any;
}): React.JSX.Element;
export const VirtualizedListContext: React.Context<any>;
import * as React from 'react';
