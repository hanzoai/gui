export * from './media';
export * from './createGenericFont';
export * from './animations.reanimated';
export declare const config: {
    animations: import("@hanzogui/web").AnimationDriver<{
        '100ms': {
            type: string;
            duration: number;
        };
        bouncy: {
            type: string;
            damping: number;
            mass: number;
            stiffness: number;
        };
        lazy: {
            type: string;
            damping: number;
            stiffness: number;
        };
        medium: {
            damping: number;
            stiffness: number;
            mass: number;
        };
        slow: {
            type: string;
            damping: number;
            stiffness: number;
        };
        quick: {
            type: string;
            damping: number;
            mass: number;
            stiffness: number;
        };
        tooltip: {
            type: string;
            damping: number;
            mass: number;
            stiffness: number;
        };
    }>;
    themes: import("@hanzogui/themes/types/generated-new").Themes;
    media: {
        xl: {
            maxWidth: number;
        };
        lg: {
            maxWidth: number;
        };
        md: {
            maxWidth: number;
        };
        sm: {
            maxWidth: number;
        };
        xs: {
            maxWidth: number;
        };
        xxs: {
            maxWidth: number;
        };
        gtXs: {
            minWidth: number;
        };
        gtSm: {
            minWidth: number;
        };
        gtMd: {
            minWidth: number;
        };
        gtLg: {
            minWidth: number;
        };
        gtXl: {
            minWidth: number;
        };
    };
    shorthands: {
        readonly ussel: "userSelect";
        readonly cur: "cursor";
        readonly pe: "pointerEvents";
        readonly col: "color";
        readonly ff: "fontFamily";
        readonly fos: "fontSize";
        readonly fost: "fontStyle";
        readonly fow: "fontWeight";
        readonly ls: "letterSpacing";
        readonly lh: "lineHeight";
        readonly ta: "textAlign";
        readonly tt: "textTransform";
        readonly ww: "wordWrap";
        readonly ac: "alignContent";
        readonly ai: "alignItems";
        readonly als: "alignSelf";
        readonly b: "bottom";
        readonly bc: "backgroundColor";
        readonly bg: "backgroundColor";
        readonly bbc: "borderBottomColor";
        readonly bblr: "borderBottomLeftRadius";
        readonly bbrr: "borderBottomRightRadius";
        readonly bbw: "borderBottomWidth";
        readonly blc: "borderLeftColor";
        readonly blw: "borderLeftWidth";
        readonly boc: "borderColor";
        readonly br: "borderRadius";
        readonly bs: "borderStyle";
        readonly brw: "borderRightWidth";
        readonly brc: "borderRightColor";
        readonly btc: "borderTopColor";
        readonly btlr: "borderTopLeftRadius";
        readonly btrr: "borderTopRightRadius";
        readonly btw: "borderTopWidth";
        readonly bw: "borderWidth";
        readonly dsp: "display";
        readonly f: "flex";
        readonly fb: "flexBasis";
        readonly fd: "flexDirection";
        readonly fg: "flexGrow";
        readonly fs: "flexShrink";
        readonly fw: "flexWrap";
        readonly h: "height";
        readonly jc: "justifyContent";
        readonly l: "left";
        readonly m: "margin";
        readonly mah: "maxHeight";
        readonly maw: "maxWidth";
        readonly mb: "marginBottom";
        readonly mih: "minHeight";
        readonly miw: "minWidth";
        readonly ml: "marginLeft";
        readonly mr: "marginRight";
        readonly mt: "marginTop";
        readonly mx: "marginHorizontal";
        readonly my: "marginVertical";
        readonly o: "opacity";
        readonly ov: "overflow";
        readonly p: "padding";
        readonly pb: "paddingBottom";
        readonly pl: "paddingLeft";
        readonly pos: "position";
        readonly pr: "paddingRight";
        readonly pt: "paddingTop";
        readonly px: "paddingHorizontal";
        readonly py: "paddingVertical";
        readonly r: "right";
        readonly shac: "shadowColor";
        readonly shar: "shadowRadius";
        readonly shof: "shadowOffset";
        readonly shop: "shadowOpacity";
        readonly t: "top";
        readonly w: "width";
        readonly zi: "zIndex";
    };
    tokens: {
        color: {};
        space: {
            $0: import("@hanzogui/web").Variable<number>;
            "$0.25": import("@hanzogui/web").Variable<number>;
            "$0.5": import("@hanzogui/web").Variable<number>;
            "$0.75": import("@hanzogui/web").Variable<number>;
            $1: import("@hanzogui/web").Variable<number>;
            "$1.5": import("@hanzogui/web").Variable<number>;
            $2: import("@hanzogui/web").Variable<number>;
            "$2.5": import("@hanzogui/web").Variable<number>;
            $3: import("@hanzogui/web").Variable<number>;
            "$3.5": import("@hanzogui/web").Variable<number>;
            $4: import("@hanzogui/web").Variable<number>;
            $true: import("@hanzogui/web").Variable<number>;
            "$4.5": import("@hanzogui/web").Variable<number>;
            $5: import("@hanzogui/web").Variable<number>;
            $6: import("@hanzogui/web").Variable<number>;
            $7: import("@hanzogui/web").Variable<number>;
            $8: import("@hanzogui/web").Variable<number>;
            $9: import("@hanzogui/web").Variable<number>;
            $10: import("@hanzogui/web").Variable<number>;
            $11: import("@hanzogui/web").Variable<number>;
            $12: import("@hanzogui/web").Variable<number>;
            $13: import("@hanzogui/web").Variable<number>;
            $14: import("@hanzogui/web").Variable<number>;
            $15: import("@hanzogui/web").Variable<number>;
            $16: import("@hanzogui/web").Variable<number>;
            $17: import("@hanzogui/web").Variable<number>;
            $18: import("@hanzogui/web").Variable<number>;
            $19: import("@hanzogui/web").Variable<number>;
            $20: import("@hanzogui/web").Variable<number>;
            "$-0.25": import("@hanzogui/web").Variable<number>;
            "$-0.5": import("@hanzogui/web").Variable<number>;
            "$-0.75": import("@hanzogui/web").Variable<number>;
            "$-1": import("@hanzogui/web").Variable<number>;
            "$-1.5": import("@hanzogui/web").Variable<number>;
            "$-2": import("@hanzogui/web").Variable<number>;
            "$-2.5": import("@hanzogui/web").Variable<number>;
            "$-3": import("@hanzogui/web").Variable<number>;
            "$-3.5": import("@hanzogui/web").Variable<number>;
            "$-4": import("@hanzogui/web").Variable<number>;
            "$-true": import("@hanzogui/web").Variable<number>;
            "$-4.5": import("@hanzogui/web").Variable<number>;
            "$-5": import("@hanzogui/web").Variable<number>;
            "$-6": import("@hanzogui/web").Variable<number>;
            "$-7": import("@hanzogui/web").Variable<number>;
            "$-8": import("@hanzogui/web").Variable<number>;
            "$-9": import("@hanzogui/web").Variable<number>;
            "$-10": import("@hanzogui/web").Variable<number>;
            "$-11": import("@hanzogui/web").Variable<number>;
            "$-12": import("@hanzogui/web").Variable<number>;
            "$-13": import("@hanzogui/web").Variable<number>;
            "$-14": import("@hanzogui/web").Variable<number>;
            "$-15": import("@hanzogui/web").Variable<number>;
            "$-16": import("@hanzogui/web").Variable<number>;
            "$-17": import("@hanzogui/web").Variable<number>;
            "$-18": import("@hanzogui/web").Variable<number>;
            "$-19": import("@hanzogui/web").Variable<number>;
            "$-20": import("@hanzogui/web").Variable<number>;
        };
        size: {
            $0: import("@hanzogui/web").Variable<number>;
            "$0.25": import("@hanzogui/web").Variable<number>;
            "$0.5": import("@hanzogui/web").Variable<number>;
            "$0.75": import("@hanzogui/web").Variable<number>;
            $1: import("@hanzogui/web").Variable<number>;
            "$1.5": import("@hanzogui/web").Variable<number>;
            $2: import("@hanzogui/web").Variable<number>;
            "$2.5": import("@hanzogui/web").Variable<number>;
            $3: import("@hanzogui/web").Variable<number>;
            "$3.5": import("@hanzogui/web").Variable<number>;
            $4: import("@hanzogui/web").Variable<number>;
            $true: import("@hanzogui/web").Variable<number>;
            "$4.5": import("@hanzogui/web").Variable<number>;
            $5: import("@hanzogui/web").Variable<number>;
            $6: import("@hanzogui/web").Variable<number>;
            $7: import("@hanzogui/web").Variable<number>;
            $8: import("@hanzogui/web").Variable<number>;
            $9: import("@hanzogui/web").Variable<number>;
            $10: import("@hanzogui/web").Variable<number>;
            $11: import("@hanzogui/web").Variable<number>;
            $12: import("@hanzogui/web").Variable<number>;
            $13: import("@hanzogui/web").Variable<number>;
            $14: import("@hanzogui/web").Variable<number>;
            $15: import("@hanzogui/web").Variable<number>;
            $16: import("@hanzogui/web").Variable<number>;
            $17: import("@hanzogui/web").Variable<number>;
            $18: import("@hanzogui/web").Variable<number>;
            $19: import("@hanzogui/web").Variable<number>;
            $20: import("@hanzogui/web").Variable<number>;
        };
        radius: {
            0: import("@hanzogui/web").Variable<number>;
            1: import("@hanzogui/web").Variable<number>;
            2: import("@hanzogui/web").Variable<number>;
            3: import("@hanzogui/web").Variable<number>;
            4: import("@hanzogui/web").Variable<number>;
            true: import("@hanzogui/web").Variable<number>;
            5: import("@hanzogui/web").Variable<number>;
            6: import("@hanzogui/web").Variable<number>;
            7: import("@hanzogui/web").Variable<number>;
            8: import("@hanzogui/web").Variable<number>;
            9: import("@hanzogui/web").Variable<number>;
            10: import("@hanzogui/web").Variable<number>;
            11: import("@hanzogui/web").Variable<number>;
            12: import("@hanzogui/web").Variable<number>;
        };
        zIndex: {
            0: import("@hanzogui/web").Variable<number>;
            1: import("@hanzogui/web").Variable<number>;
            2: import("@hanzogui/web").Variable<number>;
            3: import("@hanzogui/web").Variable<number>;
            4: import("@hanzogui/web").Variable<number>;
            5: import("@hanzogui/web").Variable<number>;
        };
    } & Omit<{
        color: {};
        radius: {
            0: import("@hanzogui/web").Variable<number>;
            1: import("@hanzogui/web").Variable<number>;
            2: import("@hanzogui/web").Variable<number>;
            3: import("@hanzogui/web").Variable<number>;
            4: import("@hanzogui/web").Variable<number>;
            true: import("@hanzogui/web").Variable<number>;
            5: import("@hanzogui/web").Variable<number>;
            6: import("@hanzogui/web").Variable<number>;
            7: import("@hanzogui/web").Variable<number>;
            8: import("@hanzogui/web").Variable<number>;
            9: import("@hanzogui/web").Variable<number>;
            10: import("@hanzogui/web").Variable<number>;
            11: import("@hanzogui/web").Variable<number>;
            12: import("@hanzogui/web").Variable<number>;
        };
        zIndex: {
            0: import("@hanzogui/web").Variable<number>;
            1: import("@hanzogui/web").Variable<number>;
            2: import("@hanzogui/web").Variable<number>;
            3: import("@hanzogui/web").Variable<number>;
            4: import("@hanzogui/web").Variable<number>;
            5: import("@hanzogui/web").Variable<number>;
        };
        space: {
            $0: import("@hanzogui/web").Variable<number>;
            "$0.25": import("@hanzogui/web").Variable<number>;
            "$0.5": import("@hanzogui/web").Variable<number>;
            "$0.75": import("@hanzogui/web").Variable<number>;
            $1: import("@hanzogui/web").Variable<number>;
            "$1.5": import("@hanzogui/web").Variable<number>;
            $2: import("@hanzogui/web").Variable<number>;
            "$2.5": import("@hanzogui/web").Variable<number>;
            $3: import("@hanzogui/web").Variable<number>;
            "$3.5": import("@hanzogui/web").Variable<number>;
            $4: import("@hanzogui/web").Variable<number>;
            $true: import("@hanzogui/web").Variable<number>;
            "$4.5": import("@hanzogui/web").Variable<number>;
            $5: import("@hanzogui/web").Variable<number>;
            $6: import("@hanzogui/web").Variable<number>;
            $7: import("@hanzogui/web").Variable<number>;
            $8: import("@hanzogui/web").Variable<number>;
            $9: import("@hanzogui/web").Variable<number>;
            $10: import("@hanzogui/web").Variable<number>;
            $11: import("@hanzogui/web").Variable<number>;
            $12: import("@hanzogui/web").Variable<number>;
            $13: import("@hanzogui/web").Variable<number>;
            $14: import("@hanzogui/web").Variable<number>;
            $15: import("@hanzogui/web").Variable<number>;
            $16: import("@hanzogui/web").Variable<number>;
            $17: import("@hanzogui/web").Variable<number>;
            $18: import("@hanzogui/web").Variable<number>;
            $19: import("@hanzogui/web").Variable<number>;
            $20: import("@hanzogui/web").Variable<number>;
            "$-0.25": import("@hanzogui/web").Variable<number>;
            "$-0.5": import("@hanzogui/web").Variable<number>;
            "$-0.75": import("@hanzogui/web").Variable<number>;
            "$-1": import("@hanzogui/web").Variable<number>;
            "$-1.5": import("@hanzogui/web").Variable<number>;
            "$-2": import("@hanzogui/web").Variable<number>;
            "$-2.5": import("@hanzogui/web").Variable<number>;
            "$-3": import("@hanzogui/web").Variable<number>;
            "$-3.5": import("@hanzogui/web").Variable<number>;
            "$-4": import("@hanzogui/web").Variable<number>;
            "$-true": import("@hanzogui/web").Variable<number>;
            "$-4.5": import("@hanzogui/web").Variable<number>;
            "$-5": import("@hanzogui/web").Variable<number>;
            "$-6": import("@hanzogui/web").Variable<number>;
            "$-7": import("@hanzogui/web").Variable<number>;
            "$-8": import("@hanzogui/web").Variable<number>;
            "$-9": import("@hanzogui/web").Variable<number>;
            "$-10": import("@hanzogui/web").Variable<number>;
            "$-11": import("@hanzogui/web").Variable<number>;
            "$-12": import("@hanzogui/web").Variable<number>;
            "$-13": import("@hanzogui/web").Variable<number>;
            "$-14": import("@hanzogui/web").Variable<number>;
            "$-15": import("@hanzogui/web").Variable<number>;
            "$-16": import("@hanzogui/web").Variable<number>;
            "$-17": import("@hanzogui/web").Variable<number>;
            "$-18": import("@hanzogui/web").Variable<number>;
            "$-19": import("@hanzogui/web").Variable<number>;
            "$-20": import("@hanzogui/web").Variable<number>;
        };
        size: {
            $0: import("@hanzogui/web").Variable<number>;
            "$0.25": import("@hanzogui/web").Variable<number>;
            "$0.5": import("@hanzogui/web").Variable<number>;
            "$0.75": import("@hanzogui/web").Variable<number>;
            $1: import("@hanzogui/web").Variable<number>;
            "$1.5": import("@hanzogui/web").Variable<number>;
            $2: import("@hanzogui/web").Variable<number>;
            "$2.5": import("@hanzogui/web").Variable<number>;
            $3: import("@hanzogui/web").Variable<number>;
            "$3.5": import("@hanzogui/web").Variable<number>;
            $4: import("@hanzogui/web").Variable<number>;
            $true: import("@hanzogui/web").Variable<number>;
            "$4.5": import("@hanzogui/web").Variable<number>;
            $5: import("@hanzogui/web").Variable<number>;
            $6: import("@hanzogui/web").Variable<number>;
            $7: import("@hanzogui/web").Variable<number>;
            $8: import("@hanzogui/web").Variable<number>;
            $9: import("@hanzogui/web").Variable<number>;
            $10: import("@hanzogui/web").Variable<number>;
            $11: import("@hanzogui/web").Variable<number>;
            $12: import("@hanzogui/web").Variable<number>;
            $13: import("@hanzogui/web").Variable<number>;
            $14: import("@hanzogui/web").Variable<number>;
            $15: import("@hanzogui/web").Variable<number>;
            $16: import("@hanzogui/web").Variable<number>;
            $17: import("@hanzogui/web").Variable<number>;
            $18: import("@hanzogui/web").Variable<number>;
            $19: import("@hanzogui/web").Variable<number>;
            $20: import("@hanzogui/web").Variable<number>;
        };
    }, "size" | "color" | "space" | "radius" | "zIndex">;
    fonts: {
        heading: import("@hanzogui/web").FillInFont<{
            size: {
                5: number;
                6: number;
                9: number;
                10: number;
            };
            transform: {
                6: "uppercase";
                7: "none";
            };
            weight: {
                6: string;
                7: string;
            };
            color: {
                6: string;
                7: string;
            };
            letterSpacing: {
                5: number;
                6: number;
                7: number;
                8: number;
                9: number;
                10: number;
                12: number;
                14: number;
                15: number;
            };
            face: {
                700: {
                    normal: string;
                };
                800: {
                    normal: string;
                };
                900: {
                    normal: string;
                };
            };
        }, 9 | 15 | 1 | 10 | 3 | 2 | 5 | 6 | 16 | 11 | 12 | 14 | 4 | 7 | 8 | 13 | "true">;
        body: import("@hanzogui/web").FillInFont<import("@hanzogui/web").GenericFont, 9 | 15 | 1 | 10 | 3 | 2 | 5 | 6 | 16 | 11 | 12 | 14 | 4 | 7 | 8 | 13 | "true">;
        mono: {
            weight: {
                1: string;
            };
            size: {
                1: number;
                2: number;
                3: number;
                4: number;
                5: number;
                6: number;
                7: number;
                8: number;
                9: number;
                10: number;
                11: number;
                12: number;
                13: number;
                14: number;
                15: number;
                16: number;
            };
        };
        silkscreen: import("@hanzogui/web").FillInFont<import("@hanzogui/web").GenericFont, 9 | 15 | 1 | 10 | 3 | 2 | 5 | 6 | 16 | 11 | 12 | 14 | 4 | 7 | 8 | 13>;
    };
    selectionStyles: (theme: Record<string, string>) => {
        backgroundColor: string;
        color: string;
    } | null;
    settings: {
        defaultFont: string;
        shouldAddPrefersColorThemes: true;
        mediaQueryDefaultActive: {
            xl: boolean;
            lg: boolean;
            md: boolean;
            sm: boolean;
            xs: boolean;
            xxs: boolean;
        };
    };
};
//# sourceMappingURL=index.reanimated.d.ts.map