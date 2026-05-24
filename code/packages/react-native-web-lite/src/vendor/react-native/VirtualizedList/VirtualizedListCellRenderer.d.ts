export default CellRenderer;
export class CellRenderer extends React.Component<any, any, any> {
    static getDerivedStateFromProps(props: any, prevState: any): {
        separatorProps: any;
    };
    constructor(props: any);
    constructor(props: any, context: any);
    state: {
        separatorProps: {
            highlighted: boolean;
            leadingItem: any;
        };
    };
    _separators: {
        highlight: () => void;
        unhighlight: () => void;
        updateProps: (select: any, newProps: any) => void;
    };
    updateSeparatorProps(newProps: any): void;
    componentWillUnmount(): void;
    _onLayout: (nativeEvent: any) => void;
    _renderElement(renderItem: any, ListItemComponent: any, item: any, index: any): any;
    render(): React.JSX.Element;
}
import * as React from 'react';
