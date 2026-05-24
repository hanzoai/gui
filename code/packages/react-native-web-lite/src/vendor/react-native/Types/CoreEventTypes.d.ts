export namespace NativeUIEvent {
    let detail: number;
}
export namespace NativeMouseEvent {
    let screenX: number;
    let screenY: number;
    let pageX: number;
    let pageY: number;
    let clientX: number;
    let clientY: number;
    let x: number;
    let y: number;
    let ctrlKey: boolean;
    let shiftKey: boolean;
    let altKey: boolean;
    let metaKey: boolean;
    let button: number;
    let buttons: number;
    let relatedTarget: any;
    let offsetX: number;
    let offsetY: number;
}
export namespace NativePointerEvent {
    let pointerId: number;
    let width: number;
    let height: number;
    let pressure: number;
    let tangentialPressure: number;
    let tiltX: number;
    let tiltY: number;
    let twist: number;
    let pointerType: string;
    let isPrimary: boolean;
}
export namespace NativeTouchEvent {
    export let changedTouches: any[];
    export let identifier: number;
    export let locationX: number;
    export let locationY: number;
    let pageX_1: number;
    export { pageX_1 as pageX };
    let pageY_1: number;
    export { pageY_1 as pageY };
    export let target: any;
    export let timestamp: number;
    export let touches: any[];
}
export namespace NativeKeyboardEvent {
    export let key: string;
    export let code: string;
    let ctrlKey_1: boolean;
    export { ctrlKey_1 as ctrlKey };
    let shiftKey_1: boolean;
    export { shiftKey_1 as shiftKey };
    let altKey_1: boolean;
    export { altKey_1 as altKey };
    let metaKey_1: boolean;
    export { metaKey_1 as metaKey };
    export let repeat: boolean;
    export let location: number;
    export let keyCode: number;
    export let charCode: number;
    export let which: number;
}
export namespace ScrollEvent {
    export namespace contentInset {
        let top: number;
        let left: number;
        let bottom: number;
        let right: number;
    }
    export namespace contentOffset {
        let x_1: number;
        export { x_1 as x };
        let y_1: number;
        export { y_1 as y };
    }
    export namespace contentSize {
        let width_1: number;
        export { width_1 as width };
        let height_1: number;
        export { height_1 as height };
    }
    export namespace layoutMeasurement {
        let width_2: number;
        export { width_2 as width };
        let height_2: number;
        export { height_2 as height };
    }
    export namespace velocity {
        let x_2: number;
        export { x_2 as x };
        let y_2: number;
        export { y_2 as y };
    }
    export let zoomScale: number;
    export let responderIgnoreScroll: boolean;
    let target_1: any;
    export { target_1 as target };
    export let responder: any;
    export let bubbles: any;
    export let cancelable: any;
    export let currentTarget: any;
    export let defaultPrevented: any;
    export let dispatchConfig: any;
    export let eventPhase: any;
    export function preventDefault(): void;
    export function isDefaultPrevented(): boolean;
    export function stopPropagation(): void;
    export function isPropagationStopped(): boolean;
    export let isTrusted: any;
    export let nativeEvent: any;
    export function persist(): void;
    export let timeStamp: number;
    export let type: any;
}
