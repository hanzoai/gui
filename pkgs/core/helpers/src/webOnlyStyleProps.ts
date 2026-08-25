// Web-only style props that need to be skipped on native
// NOTE: backgroundColor is NOT web-only - it works on React Native too!
// NOTE: RN 0.76+ added: boxShadow, filter (cross-platform, with some Android 12+ only filters)
// NOTE: RN 0.77+ added: boxSizing, mixBlendMode, isolation, outline* props

// CSS grid. React Native has no grid engine: RN 0.83 types `display` as
// 'none' | 'flex' | 'contents' and Yoga's Display enum carries Flex, None and
// Contents and nothing else, so every property here would reach a layout pass
// that cannot read it. They are stripped on native, which is what the
// "Will be omitted on native" note each one carries in types.tsx says.
//
// gridAutoFlow is deliberately NOT here. It is the one grid property flexbox
// reproduces exactly, so it crosses to flexDirection instead (expandStyle.ts).
//
// Unitless as a set: no property here takes a bare CSS length. Track sizes are
// written inside a string ('240px', '1fr', 'repeat(3, 1fr)'), and a number
// means a grid LINE — `gridRow={2}` is line 2, and `grid-row: 2px` is a
// declaration the browser drops.
export const gridProps = {
  grid: true,
  gridArea: true,
  gridAutoColumns: true,
  gridAutoRows: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnStart: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowStart: true,
  gridTemplate: true,
  gridTemplateAreas: true,
  gridTemplateColumns: true,
  gridTemplateRows: true,
  // grid's own alignment. alignContent/alignItems/alignSelf and justifyContent
  // are shared with flex and stay in the cross-platform table; these five have
  // no flex meaning at all.
  justifyItems: true,
  justifySelf: true,
  placeContent: true,
  placeItems: true,
  placeSelf: true,
}

// web-only discrete (non-animatable) view props
export const nonAnimatableWebViewProps = {
  ...gridProps,
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
