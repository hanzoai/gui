export default SectionList;
export class SectionList extends React.PureComponent<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    scrollToLocation(params: any): void;
    recordInteraction(): void;
    flashScrollIndicators(): void;
    getScrollResponder(): any;
    getScrollableNode(): any;
    setNativeProps(props: any): void;
    render(): React.JSX.Element;
    _captureRef: (ref: any) => void;
    _wrapperListRef: any;
    _getItem: (sections: any, index: any) => any;
    _getItemCount: (sections: any) => any;
    _keyExtractor: (item: any, index: any) => any;
    _defaultKeyExtractor: (item: any, index: any) => any;
    _renderItem: ({ item, index, section }: {
        item: any;
        index: any;
        section: any;
    }) => any;
    _defaultRenderItem: ({ item }: {
        item: any;
    }) => any;
}
import * as React from 'react';
