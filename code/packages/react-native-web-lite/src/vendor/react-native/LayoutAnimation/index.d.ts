export default LayoutAnimation;
export namespace LayoutAnimation {
    export { configureNext };
    export { create };
    export let Types: Readonly<{
        spring: "spring";
        linear: "linear";
        easeInEaseOut: "easeInEaseOut";
        easeIn: "easeIn";
        easeOut: "easeOut";
        keyboard: "keyboard";
    }>;
    export let Properties: Readonly<{
        opacity: "opacity";
        scaleX: "scaleX";
        scaleY: "scaleY";
        scaleXY: "scaleXY";
    }>;
    export function checkConfig(...args: any[]): void;
    export { Presets };
    export let easeInEaseOut: any;
    export let linear: any;
    export let spring: any;
}
declare function configureNext(config: any, onAnimationDidEnd: any): void;
declare function create(duration: any, type: any, property: any): {
    duration: any;
    create: {
        type: any;
        property: any;
    };
    update: {
        type: any;
    };
    delete: {
        type: any;
        property: any;
    };
};
declare namespace Presets {
    export namespace easeInEaseOut_1 {
        export { duration };
        export namespace create_1 {
            export { type };
            export { property };
        }
        export { create_1 as create };
        export namespace update {
            export { type };
        }
        export namespace _delete {
            export { type };
            export { property };
        }
        export { _delete as delete };
    }
    export { easeInEaseOut_1 as easeInEaseOut };
    export namespace linear_1 { }
    export { linear_1 as linear };
    export namespace spring_1 {
        export let duration: number;
        export namespace create_2 {
            let type: string;
            let property: string;
        }
        export { create_2 as create };
        export namespace update_1 {
            let type_1: string;
            export { type_1 as type };
            export let springDamping: number;
        }
        export { update_1 as update };
        export namespace _delete_1 {
            let type_2: string;
            export { type_2 as type };
            let property_1: string;
            export { property_1 as property };
        }
        export { _delete_1 as delete };
    }
    export { spring_1 as spring };
}
