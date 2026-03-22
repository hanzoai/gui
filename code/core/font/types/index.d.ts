import type { CreateGuiProps } from '@gui/web';
export declare function addFont(props: {
    fontFamilyName: string;
    fontFamily: CreateGuiProps['fonts'][keyof CreateGuiProps['fonts']];
    insertCSS?: boolean;
    update?: boolean;
}): {
    fontFamily: import("@gui/web").GenericFont<string | number | symbol>;
    fontFamilyToken?: undefined;
    fontDeclaration?: undefined;
} | {
    fontFamilyToken: never;
    fontDeclaration: {
        [x: string]: {
            name: string;
            declarations: string[];
            language: string;
        };
    };
    fontFamily?: undefined;
} | undefined;
//# sourceMappingURL=index.d.ts.map