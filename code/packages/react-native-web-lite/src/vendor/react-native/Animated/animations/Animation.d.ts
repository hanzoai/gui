export default Animation;
export class Animation {
    __active: any;
    __isInteraction: any;
    __nativeId: any;
    __onEnd: any;
    __iterations: any;
    start(fromValue: any, onUpdate: any, onEnd: any, previousAnimation: any, animatedValue: any): void;
    stop(): void;
    __getNativeAnimationConfig(): void;
    __debouncedOnEnd(result: any): void;
    __startNativeAnimation(animatedValue: any): void;
}
