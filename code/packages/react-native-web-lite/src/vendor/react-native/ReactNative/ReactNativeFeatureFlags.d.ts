export default ReactNativeFeatureFlags;
export namespace ReactNativeFeatureFlags {
    function isLayoutAnimationEnabled(): boolean;
    function shouldEmitW3CPointerEvents(): boolean;
    function shouldPressibilityUseW3CPointerEventsForHover(): boolean;
    function animatedShouldDebounceQueueFlush(): boolean;
    function animatedShouldUseSingleOp(): boolean;
}
