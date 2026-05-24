/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import type { ViewabilityConfigCallbackPair } from './vendor/react-native/ViewabilityHelper';
import type { RenderItemType } from './vendor/react-native/VirtualizedList';
import { VirtualizedList } from './vendor/react-native/VirtualizedList';
import type { ViewProps } from './View';
type ViewStyleProp = ViewProps['style'];
type RequiredProps<ItemT> = {
    /**
     * An array (or array-like list) of items to render. Other data types can be
     * used by targeting VirtualizedList directly.
     */
    data?: ArrayLike<ItemT> | null;
};
type OptionalProps<ItemT> = {
    /**
     * Takes an item from `data` and renders it into the list.
     */
    renderItem?: RenderItemType<ItemT> | null;
    /**
     * Optional custom style for multi-item rows generated when numColumns > 1.
     */
    columnWrapperStyle?: ViewStyleProp;
    extraData?: any;
    getItemLayout?: (data: ArrayLike<ItemT> | null, index: number) => {
        length: number;
        offset: number;
        index: number;
    };
    horizontal?: boolean | null;
    initialNumToRender?: number | null;
    initialScrollIndex?: number | null;
    inverted?: boolean | null;
    keyExtractor?: (item: ItemT, index: number) => string | null;
    numColumns?: number;
    removeClippedSubviews?: boolean;
    fadingEdgeLength?: number | null;
    strictMode?: boolean;
};
type FlatListProps<ItemT> = RequiredProps<ItemT> & OptionalProps<ItemT>;
type VirtualizedListProps = React.ComponentProps<typeof VirtualizedList>;
export type Props<ItemT> = Omit<VirtualizedListProps, 'getItem' | 'getItemCount' | 'getItemLayout' | 'renderItem' | 'keyExtractor'> & FlatListProps<ItemT>;
/**
 * A performant interface for rendering simple, flat lists, supporting the most handy features.
 */
declare class FlatList<ItemT> extends React.PureComponent<Props<ItemT>> {
    props: Props<ItemT>;
    _listRef: React.RefObject<VirtualizedList> | null;
    _virtualizedListPairs: Array<ViewabilityConfigCallbackPair>;
    constructor(props: Props<ItemT>);
    componentDidUpdate(prevProps: Props<ItemT>): void;
    _captureRef: (ref: React.RefObject<VirtualizedList> | null) => void;
    _checkProps(props: Props<ItemT>): void;
    _getItem: (data: ArrayLike<ItemT>, index: number) => ItemT | ItemT[] | null;
    _getItemCount: (data: ArrayLike<ItemT> | null) => number;
    _keyExtractor: (items: ItemT | ItemT[], index: number) => string;
    _pushMultiColumnViewable(arr: Array<ViewToken>, v: ViewToken): void;
    _createOnViewableItemsChanged(onViewableItemsChanged: ((info: {
        viewableItems: ViewToken[];
        changed: ViewToken[];
    }) => void) | null): (info: {
        viewableItems: ViewToken[];
        changed: ViewToken[];
    }) => void;
    _renderer: (ListItemComponent: React.ComponentType<any> | React.ReactElement<any> | null, renderItem: RenderItemType<ItemT> | null, columnWrapperStyle: ViewStyleProp | null, numColumns: number | null, extraData: any) => {
        ListItemComponent: (info: RenderItemProps<ItemT>) => any;
        renderItem?: undefined;
    } | {
        renderItem: (info: RenderItemProps<ItemT>) => any;
        ListItemComponent?: undefined;
    };
    _memoizedRenderer: import("memoize-one").MemoizedFn<(ListItemComponent: React.ComponentType<any> | React.ReactElement<any> | null, renderItem: RenderItemType<ItemT> | null, columnWrapperStyle: ViewStyleProp | null, numColumns: number | null, extraData: any) => {
        ListItemComponent: (info: RenderItemProps<ItemT>) => any;
        renderItem?: undefined;
    } | {
        renderItem: (info: RenderItemProps<ItemT>) => any;
        ListItemComponent?: undefined;
    }>;
    render(): React.ReactNode;
}
export { FlatList };
export default FlatList;
