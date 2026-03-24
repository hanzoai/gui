import type { StackStyle } from '../types'

export const THEME_NAME_SEPARATOR = '_'
export const THEME_CLASSNAME_PREFIX = 't_'
export const FONT_DATA_ATTRIBUTE_NAME = 'data-gui-font'

export const MISSING_THEME_MESSAGE =
  process.env.NODE_ENV === 'development'
    ? `Can't find Hanzo GUI configuration.
    
Most of the time this is due to having mis-matched versions of Hanzo GUI dependencies, or bundlers somehow duplicating them.
First step is to ensure every "@hanzo/gui" and "@hanzogui/*" dependency is on the same version, we have a CLI tool to help: 

  npx @hanzogui/cli check
`
    : `Missing theme.`
