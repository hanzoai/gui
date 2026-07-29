export * from './FocusScope'
export * from './FocusScopeController'
// ScopedProps reaches a consumer's public API through FocusScopeController, so it
// has to be nameable from this package's one entry — otherwise declaration emit in
// a dependent (Popover) can only cite it by a deep relative path (TS2742).
export * from './types'
