export default PanResponder;
export namespace PanResponder {
    function _initializeGestureState(gestureState: any): void;
    function _updateGestureStateOnMove(gestureState: any, touchHistory: any): void;
    function create(config: any): {
        panHandlers: {
            onStartShouldSetResponder(event: any): any;
            onMoveShouldSetResponder(event: any): any;
            onStartShouldSetResponderCapture(event: any): any;
            onMoveShouldSetResponderCapture(event: any): any;
            onResponderGrant(event: any): any;
            onResponderReject(event: any): void;
            onResponderRelease(event: any): void;
            onResponderStart(event: any): void;
            onResponderMove(event: any): void;
            onResponderEnd(event: any): void;
            onResponderTerminate(event: any): void;
            onResponderTerminationRequest(event: any): any;
            onClickCapture: (event: any) => void;
        };
        getInteractionHandle(): any;
    };
}
