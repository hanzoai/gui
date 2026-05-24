export default VirtualizedList;
export class VirtualizedList extends StateSafePureComponent {
    static contextType: import("react").Context<any>;
    _nestedChildLists: ChildListCollection;
    _viewabilityTuples: {
        viewabilityHelper: ViewabilityHelper;
        onViewableItemsChanged: any;
    }[];
    _scrollMetrics: {
        contentLength: number;
        dOffset: number;
        dt: number;
        offset: number;
        timestamp: number;
        velocity: number;
        visibleLength: number;
    };
    _highestMeasuredFrameIndex: number;
    _headerLength: number;
    _footerLength: number;
    _averageCellLength: number;
    _hasWarned: {};
    _fillRateHelper: FillRateHelper;
    _updateCellsToRenderBatcher: Batchinator;
    scrollToEnd(params: any): void;
    scrollToIndex(params: any): void;
    scrollToItem(params: any): void;
    scrollToOffset(params: any): void;
    recordInteraction(): void;
    flashScrollIndicators(): void;
    getScrollResponder(): any;
    getScrollableNode(): any;
    getScrollRef(): any;
    setNativeProps(props: any): void;
    render(): import("react").JSX.Element;
    _renderChildren(): import("react").JSX.Element[];
    _captureRef: (ref: any) => void;
    _scrollRef: any;
    _onContentSizeChange: (width: any, height: any) => void;
    _onLayout: (event: any) => void;
    _onScroll: (event: any) => void;
    __getFrameMetricsApprox(index: any, props: any): {
        length: number;
        offset: number;
    };
    _getOffsetApprox(index: any, props: any): number;
}
import { StateSafePureComponent } from './StateSafePureComponent';
import { ChildListCollection } from './ChildListCollection';
import { ViewabilityHelper } from '../ViewabilityHelper';
import { FillRateHelper } from '../FillRateHelper';
import { Batchinator } from '../Batchinator';
