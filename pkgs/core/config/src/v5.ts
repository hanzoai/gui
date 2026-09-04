// v5 base - no animations bundled, users import from specific paths:
//   @hanzogui/config/v5-css
//   @hanzogui/config/v5-native
//   @hanzogui/config/v5-reanimated

// NAMED, not starred. ./v5-base re-exports a dozen names it takes from
// @hanzogui/themes/v5 — createThemes, tokens, the palette helpers, the theme
// types — so starring both modules binds each of those names twice. ESM calls a
// doubly-starred name ambiguous and omits it rather than picking, which is a
// silent one: `import { tokens } from '@hanzogui/config/v5'` compiles, resolves
// to undefined, and the app renders with no tokens.
//
// So this names exactly what themes/v5 carries and v5-base does not. Anything
// they share arrives through v5-base, which is the module that already curates
// it.
export {
  parseColor,
  parseHex,
  themes,
  V5_BG_OFFSET,
  v5ComponentThemes,
  v5ComponentThemesWithInverses,
  v5GrandchildrenThemes,
  v5Templates,
  type CreateV5ThemeOptions,
} from '@hanzogui/themes/v5'
export * from './v5-base.ts'
