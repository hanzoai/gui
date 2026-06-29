/**
 * Cloud-console primitives — shared, brand-agnostic building blocks for
 * Hanzo-style admin/data UIs (console2 and any cloud surface). Generic by
 * construction: no app/client coupling. Composed on the Gui sibling primitives.
 */
export { PageHeader } from './PageHeader'
export { StatusTag } from './StatusTag'
export { Loader } from './Loader'
export { DataTable, type Column } from './DataTable'
export {
  FieldRow,
  FieldText,
  FieldTextArea,
  FieldSwitch,
  FieldSelect,
  FieldSlider,
} from './Field'
export {
  ErrorState,
  honestError,
  type HonestCopy,
  type HonestErrorLike,
} from './States'
