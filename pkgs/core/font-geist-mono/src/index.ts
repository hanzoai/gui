/**
 * The Geist mono face, under the name it has always published as.
 *
 * Geist is described once, in `@hanzogui/font-geist`, because the sans and the
 * mono share a version and an origin and must not be able to disagree about
 * either. This package is that module's mono half, kept so existing imports
 * keep resolving.
 */
export { createGeistMonoFont, geistMono, geistMonoFamily } from '@hanzogui/font-geist'
export type { FillInFont, GenericFont } from '@hanzogui/core'
