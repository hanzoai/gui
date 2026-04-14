import './setup'

// Core styling engine
export * from '@hanzogui/core'

// Stack components
export * from '@hanzogui/stacks'

// Shape primitives (Square, Circle)
export * from '@hanzogui/shapes'

// UI Components
export * from '@hanzogui/spacer'
export * from '@hanzogui/animate-presence'
export * from '@hanzogui/button'
export * from '@hanzogui/popover'
export * from '@hanzogui/radio-group'
export * from '@hanzogui/tooltip'
export * from '@hanzogui/switch'
export * from '@hanzogui/checkbox'
export * from '@hanzogui/dialog'
export * from '@hanzogui/sheet'
export * from '@hanzogui/adapt'
export * from '@hanzogui/label'
export * from '@hanzogui/input'
export * from '@hanzogui/select'
export * from '@hanzogui/separator'
export * from '@hanzogui/slider'
export * from '@hanzogui/tabs'
export * from '@hanzogui/toggle-group'
export * from '@hanzogui/accordion'
export * from '@hanzogui/avatar'
export * from '@hanzogui/card'
export * from '@hanzogui/form'
export * from '@hanzogui/group'
export * from '@hanzogui/image'
export * from '@hanzogui/list-item'
export * from '@hanzogui/portal'
export * from '@hanzogui/progress'
export * from '@hanzogui/scroll-view'
export * from '@hanzogui/spinner'
export * from '@hanzogui/text'
export * from '@hanzogui/toast'
export * from '@hanzogui/visually-hidden'
export * from '@hanzogui/focusable'
export * from '@hanzogui/elements'

// Config utilities — needed by consumer brand configs
export { createThemes, createThemeBuilder } from '@hanzogui/theme-builder'
export { shorthands } from '@hanzogui/shorthands'
export { getDefaultGuiConfig } from '@hanzogui/config-default'

// Explicit re-exports that get lost in the export * chain through
// @hanzogui/core → @hanzogui/web in some tsc resolution contexts.
export { Theme, useTheme } from '@hanzogui/web'
export type { ThemeName } from '@hanzogui/web'

// Additional exports (ported from tamagui, missing in earlier builds)
export { Anchor, type AnchorProps } from './views/Anchor'
