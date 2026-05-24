export default SpringConfig;
export namespace SpringConfig {
    export { fromOrigamiTensionAndFriction };
    export { fromBouncinessAndSpeed };
}
declare function fromOrigamiTensionAndFriction(tension: any, friction: any): {
    stiffness: number;
    damping: number;
};
declare function fromBouncinessAndSpeed(bounciness: any, speed: any): {
    stiffness: number;
    damping: number;
};
