export default VirtualizedSectionList;
export class VirtualizedSectionList extends React.PureComponent<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    scrollToLocation(params: any): void;
    getListRef(): any;
    render(): React.JSX.Element;
    _getItem(props: any, sections: any, index: any): any;
    _keyExtractor: (item: any, index: any) => any;
    _defaultKeyExtractor: (item: any, index: any) => any;
    _captureRef: (ref: any) => void;
    _listRef: any;
    _renderItem: (itemCount: any) => ({ item, index }: {
        item: any;
        index: any;
    }) => any;
    _defaultRenderItem: ({ item }: {
        item: any;
    }) => any;
    _onViewableItemsChanged: (info: any) => void;
}
export namespace VirtualizedSectionList {
    export { defaultProps };
}
import * as React from 'react';
declare namespace defaultProps {
    let data: any[];
    let key: any;
    let renderItem: any;
    let ItemSeparatorComponent: any;
    let keyExtractor: any;
}
