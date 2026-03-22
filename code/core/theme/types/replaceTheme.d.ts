import type { ThemeDefinition } from '@gui/web';
export declare function replaceTheme({ name, theme, }: {
    name: string;
    theme: Partial<Record<keyof ThemeDefinition, any>>;
}): {
    themeRaw: import("@gui/web").ThemeParsed;
    theme: {};
    cssRules: string[];
} | undefined;
//# sourceMappingURL=replaceTheme.d.ts.map