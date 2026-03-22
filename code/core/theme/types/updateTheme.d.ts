import type { ThemeDefinition, ThemeName } from '@hanzo/gui-web';
export declare function updateTheme({ name, theme, }: {
    name: ThemeName | (string & {});
    theme: Partial<Record<keyof ThemeDefinition, any>>;
}): {
    themeRaw: import("@hanzo/gui-web").ThemeParsed;
    theme: {};
    cssRules: string[];
} | undefined;
//# sourceMappingURL=updateTheme.d.ts.map