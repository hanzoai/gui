// @hanzogui/admin — composable admin shell, primitives, and data
// hooks for Hanzo admin surfaces. Pure Hanzo GUI via the hanzogui
// umbrella package. One way to build admin UI across tasks, kms,
// commerce, console.
//
// No `patterns/` layer. Lists differ in shape (Workflows has a
// filter band, Namespaces has Active + retention badges, TaskQueues
// has running counts) — one abstraction can't fit them without
// becoming a god-component. Pages compose primitives directly.

export * from './shell'
export * from './primitives'
export * from './data'
export * from './iam'
