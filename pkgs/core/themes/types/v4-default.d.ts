declare const generatedThemes: Record<"light_blue" | "light_green" | "light_red" | "light_yellow" | "dark_blue" | "dark_green" | "dark_red" | "dark_yellow" | "light_hanzo" | "light_lux" | "light_zoo" | "light_pars" | "dark_hanzo" | "dark_lux" | "dark_zoo" | "dark_pars" | "light" | "dark" | "light_accent" | "dark_accent" | "light_black" | "light_white" | "light_blue_accent" | "light_green_accent" | "light_red_accent" | "light_yellow_accent" | "light_black_accent" | "light_white_accent" | "dark_black" | "dark_white" | "dark_blue_accent" | "dark_green_accent" | "dark_red_accent" | "dark_yellow_accent" | "dark_black_accent" | "dark_white_accent" | "light_hanzo_accent" | "light_lux_accent" | "light_zoo_accent" | "light_pars_accent" | "dark_hanzo_accent" | "dark_lux_accent" | "dark_zoo_accent" | "dark_pars_accent", {
    [x: string]: string;
    [x: number]: string;
    [x: symbol]: string;
} & Record<string, string>>;
export type GuiThemes = typeof generatedThemes;
export declare const themes: Record<"light_blue" | "light_green" | "light_red" | "light_yellow" | "dark_blue" | "dark_green" | "dark_red" | "dark_yellow" | "light_hanzo" | "light_lux" | "light_zoo" | "light_pars" | "dark_hanzo" | "dark_lux" | "dark_zoo" | "dark_pars" | "light" | "dark" | "light_accent" | "dark_accent" | "light_black" | "light_white" | "light_blue_accent" | "light_green_accent" | "light_red_accent" | "light_yellow_accent" | "light_black_accent" | "light_white_accent" | "dark_black" | "dark_white" | "dark_blue_accent" | "dark_green_accent" | "dark_red_accent" | "dark_yellow_accent" | "dark_black_accent" | "dark_white_accent" | "light_hanzo_accent" | "light_lux_accent" | "light_zoo_accent" | "light_pars_accent" | "dark_hanzo_accent" | "dark_lux_accent" | "dark_zoo_accent" | "dark_pars_accent", {
    [x: string]: string;
    [x: number]: string;
    [x: symbol]: string;
} & Record<string, string>>;
export {};
/**
 * This is an optional production optimization: themes JS can get to 20Kb or more.
 * Gui has ~1Kb of logic to hydrate themes from CSS, so you can remove the JS.
 * So long as you server render your Gui CSS, this will save you bundle size:
 */
//# sourceMappingURL=v4-default.d.ts.map