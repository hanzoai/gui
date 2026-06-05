import * as Helpers from '@hanzogui/helpers';
export declare const Gui: {
    Helpers: typeof Helpers;
    get mediaState(): {
        [x: string]: boolean;
        [x: number]: boolean;
    };
    get config(): import("./types").GuiInternalConfig;
    get insertedRules(): string[];
    get allSelectors(): Record<string, string>;
    get identifierToValue(): Map<string, any>;
} | undefined;
export declare const getValueFromIdentifier: (identifier: string) => any;
export declare const setIdentifierValue: (identifier: string, value: any) => void;
//# sourceMappingURL=Gui.d.ts.map