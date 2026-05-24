export function attachNativeEvent(viewRef: any, eventName: any, argMapping: any): {
    detach(): void;
};
export class AnimatedEvent {
    constructor(argMapping: any, config: any);
    _argMapping: any;
    _listeners: any[];
    _attachedEvent: any;
    __isNative: any;
    _callListeners(...args: any[]): void;
    __addListener(callback: any): void;
    __removeListener(callback: any): void;
    __attach(viewRef: any, eventName: any): void;
    __detach(viewTag: any, eventName: any): void;
    __getHandler(): (...args: any[]) => void;
}
