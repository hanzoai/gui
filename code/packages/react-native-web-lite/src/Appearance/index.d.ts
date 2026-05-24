export type ColorSchemeName = 'light' | 'dark';
export type AppearancePreferences = {
    colorScheme: ColorSchemeName;
};
type AppearanceListener = (preferences: AppearancePreferences) => void;
export declare const Appearance: {
    getColorScheme(): ColorSchemeName;
    addChangeListener(listener: AppearanceListener): {
        remove: () => void;
    };
};
export {};
