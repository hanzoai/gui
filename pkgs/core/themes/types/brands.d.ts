export type BrandName = 'hanzo' | 'lux' | 'zoo' | 'pars';
/**
 * Solid accent hue per brand. Components read this for focus rings, links and
 * the sparingly-used CTA — they never hardcode a hex.
 */
export declare const brandAccent: {
    readonly hanzo: "#ffffff";
    readonly lux: "#3b82f6";
    readonly zoo: "#facc15";
    readonly pars: "#d4af37";
};
export type BrandRamp = {
    dark: string[];
    light: string[];
};
/** 12-step accent ramp per brand, consumed by the theme builder as a child theme. */
export declare const brandRamps: {
    hanzo: {
        dark: string[];
        light: string[];
    };
    lux: {
        dark: string[];
        light: string[];
    };
    zoo: {
        dark: string[];
        light: string[];
    };
    pars: {
        dark: string[];
        light: string[];
    };
};
//# sourceMappingURL=brands.d.ts.map