export type {
  AlignedPlacement,
  Alignment,
  ArrowOptions,
  AutoPlacementOptions,
  AutoUpdateOptions,
  Axis,
  Boundary,
  ClientRectObject,
  ComputePositionConfig,
  ComputePositionReturn,
  Coords,
  DetectOverflowOptions,
  Dimensions,
  ElementContext,
  ElementRects,
  Elements,
  FlipOptions,
  FloatingElement,
  HideOptions,
  InlineOptions,
  Length,
  Middleware,
  MiddlewareData,
  MiddlewareReturn,
  MiddlewareState,
  NodeScroll,
  OffsetOptions,
  Padding,
  Placement,
  Platform,
  Rect,
  ReferenceElement,
  ReferenceType,
  RootBoundary,
  ShiftOptions,
  Side,
  SideObject,
  SizeOptions,
  Strategy,
  UseFloatingData,
  UseFloatingOptions,
  VirtualElement,
} from './Floating.tsx'

export {
  arrow,
  autoPlacement,
  autoUpdate,
  detectOverflow,
  flip,
  getOverflowAncestors,
  hide,
  inline,
  limitShift,
  offset,
  platform,
  shift,
  size,
} from './Floating.tsx'

export {
  useFloating,
  FloatingOverrideContext,
  type UseFloatingReturn,
  type UseFloatingProps,
  type UseFloatingFn,
  type UseFloatingOverrideFn,
} from './useFloating.tsx'

// raw useFloating without FloatingOverrideContext — use when building
// override context factories to avoid infinite recursion
export { useFloating as useFloatingRaw } from './Floating.tsx'

// event emitter for hook coordination
export { createFloatingEvents } from './interactions/createFloatingEvents.ts'

// multi-trigger coordination
export { PopupTriggerMap } from './interactions/PopupTriggerMap.ts'

// interaction hooks
export { useInteractions } from './interactions/useInteractions.ts'
export { useHover } from './interactions/useHover.ts'
export { safePolygon } from './interactions/safePolygon.ts'
export { useFocus } from './interactions/useFocus.ts'
export { useRole } from './interactions/useRole.ts'
export { useClick } from './interactions/useClick.ts'
export { useListNavigation } from './interactions/useListNavigation.ts'
export { useTypeahead } from './interactions/useTypeahead.ts'
export { useInnerOffset } from './interactions/useInnerOffset.ts'
export {
  FloatingDelayGroup,
  useDelayGroup,
  useDelayGroupContext,
} from './interactions/useDelayGroup.ts'

// middleware
export { inner } from './middleware/inner.ts'

// types
export type {
  ElementProps,
  FloatingEvents,
  FloatingInteractionContext,
  OpenChangeReason,
  UseHoverProps,
  HandleCloseFn,
  SafePolygonOptions,
  UseFocusProps,
  UseRoleProps,
  UseClickProps,
  UseListNavigationProps,
  UseTypeaheadProps,
  UseInnerOffsetProps,
  Delay,
} from './interactions/types.ts'
