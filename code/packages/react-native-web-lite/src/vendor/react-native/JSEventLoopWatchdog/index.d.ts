export default JSEventLoopWatchdog;
export namespace JSEventLoopWatchdog {
    function getStats(): {
        stallCount: number;
        totalStallTime: number;
        longestStall: number;
        acceptableBusyTime: number;
    };
    function reset(): void;
    function addHandler(handler: any): void;
    function install({ thresholdMS }: {
        thresholdMS: any;
    }): void;
}
