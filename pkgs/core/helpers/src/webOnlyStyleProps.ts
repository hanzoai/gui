// Web-only style props that need to be skipped on native
// NOTE: backgroundColor is NOT web-only - it works on React Native too!
// NOTE: RN 0.76+ added: boxShadow, filter (cross-platform, with some Android 12+ only filters)
// NOTE: RN 0.77+ added: boxSizing, mixBlendMode, isolation, outline* props

// Track SIZES. A bare number here is a CSS length and must be given a unit:
// `gridAutoRows={100}` means 100px, and `grid-auto-rows: 100` is a declaration
// the browser drops for want of one.
const gridTracks = {
  gridAutoColumns: true,
  gridAutoRows: true,
  gridTemplateColumns: true,
  gridTemplateRows: true,
}

// The rest of grid, where a bare number is never a length. On the placement
// properties it is a LINE — `gridRow={2}` is line 2, and `grid-row: 2px` is
// nonsense — and the remainder take keywords or strings only.
export const gridUnitless = {
  grid: true,
  gridArea: true,
  gridAutoFlow: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnStart: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowStart: true,
  gridTemplate: true,
  gridTemplateAreas: true,
  // grid's own alignment. alignContent/alignItems/alignSelf and justifyContent
  // are shared with flex and stay in the cross-platform table; these five have
  // no flex meaning at all.
  justifyItems: true,
  justifySelf: true,
  placeContent: true,
  placeItems: true,
  placeSelf: true,
}

// CSS grid, entire — and it CROSSES. This used to be the list of properties
// stripped on native, on the grounds that Yoga's Display enum carried Flex,
// None and Contents and nothing else, so every one of them would reach a layout
// pass that could not read it.
//
// That is no longer the substrate. hanzoai/yoga carries a grid implementation:
// `Display::Grid` is in the enum, `yoga/algorithm/grid/` is the algorithm, and
// the JS bindings expose the track setters (setGridTemplateColumns and the
// rest). So the properties reach an engine that reads them, and stripping them
// would be throwing away a layout the platform can now do.
//
// Like every other capability note in this package (RN 0.76+ for boxShadow and
// filter, 0.77+ for boxSizing and outline), this states a BUILD TARGET rather
// than testing at runtime: a native app has to link that Yoga. Against stock
// Yoga these properties are unknown and ignored, which is the same outcome
// stripping them produced — so the floor does not move, only the ceiling.
export const gridProps = {
  ...gridTracks,
  ...gridUnitless,
}

// web-only discrete (non-animatable) view props.
//
// gridProps is NOT here any more — it is cross-platform now (see above), and an
// entry in this table is dropped on native.
export const nonAnimatableWebViewProps = {
  backgroundAttachment: true,
  backgroundBlendMode: true,
  backgroundClip: true,
  backgroundOrigin: true,
  backgroundRepeat: true,
  borderBottomStyle: true,
  borderLeftStyle: true,
  borderRightStyle: true,
  borderTopStyle: true,
  contain: true,
  containerType: true,
  content: true,
  float: true,
  maskBorderMode: true,
  maskBorderRepeat: true,
  maskClip: true,
  maskComposite: true,
  maskMode: true,
  maskOrigin: true,
  maskRepeat: true,
  maskType: true,
  objectFit: true,
  overflowBlock: true,
  overflowInline: true,
  overflowX: true,
  overflowY: true,
  // NOTE: pointerEvents is NOT web-only - it's a core React Native View prop (not a style)
  pointerEvents: true,
  scrollbarWidth: true,
  textWrap: true,
  touchAction: true,
  transformStyle: true,
  willChange: true,
}

// web-only discrete (non-animatable) text props
export const nonAnimatableWebTextProps = {
  whiteSpace: true,
  wordWrap: true,
  textOverflow: true,
  WebkitBoxOrient: true,
}

export const webOnlyStylePropsView = {
  ...nonAnimatableWebViewProps,
  transition: true,
  backdropFilter: true,
  WebkitBackdropFilter: true,
  background: true,
  borderTop: true,
  borderRight: true,
  borderBottom: true,
  borderLeft: true,
  backgroundPosition: true,
  backgroundSize: true,
  borderImage: true,
  caretColor: true,
  clipPath: true,
  mask: true,
  maskBorder: true,
  maskBorderOutset: true,
  maskBorderSlice: true,
  maskBorderSource: true,
  maskBorderWidth: true,
  maskImage: true,
  maskPosition: true,
  maskSize: true,
  objectPosition: true,
  textEmphasis: true,
  userSelect: true,
}

export const webOnlyStylePropsText = {
  ...nonAnimatableWebTextProps,
  textDecorationDistance: true,
  // cursor: now cross-platform - in stylePropsView
  WebkitLineClamp: true,
}
