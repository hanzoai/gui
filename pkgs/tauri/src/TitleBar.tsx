import { Text, XStack, styled } from '@hanzo/gui'
import { useWindowControls } from './window.ts'

// A frameless-window titlebar built entirely from hanzogui primitives + tokens
// (true-black `$background`, hairline `$borderColor`). It is the proof that a
// hanzogui component drives the real Tauri OS window through the bridge. The bar
// is draggable via Tauri's `data-tauri-drag-region`; the buttons call the
// window controls. Renders harmlessly on the web (controls no-op off-Tauri).
//
// Aligned with shared Zen Dark contract:
// - Near-black / true-black neutral shell ($background, $borderColor)
// - Native chrome does not duplicate app header when hideTitle / integratedHeader is set
// - Full WCAG keyboard and accessibility annotations on window controls

const Control = styled(XStack, {
  width: 46,
  height: 32,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  hoverStyle: { backgroundColor: '$color4' },
  pressStyle: { backgroundColor: '$color5' },
  focusVisibleStyle: {
    outlineWidth: 2,
    outlineColor: '$outlineColor',
    outlineStyle: 'solid',
  },
})

const Glyph = styled(Text, {
  fontFamily: '$mono',
  fontSize: 13,
  lineHeight: 13,
  color: '$color11',
})

export type TitleBarProps = {
  title?: string
  hideTitle?: boolean
  integratedHeader?: boolean
}

export function TitleBar({ title = '', hideTitle = false, integratedHeader = false }: TitleBarProps) {
  const { minimize, toggleMaximize, close } = useWindowControls()
  const showTitle = !hideTitle && !integratedHeader && Boolean(title)

  return (
    <XStack
      role="banner"
      aria-label="Window Title Bar"
      data-tauri-drag-region
      height={40}
      alignItems="center"
      backgroundColor="$background"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      userSelect="none"
    >
      {showTitle ? (
        <Text
          flex={1}
          paddingLeft="$3"
          fontFamily="$body"
          fontSize={13}
          color="$color11"
          data-tauri-drag-region
        >
          {title}
        </Text>
      ) : (
        <XStack flex={1} data-tauri-drag-region />
      )}

      <XStack role="toolbar" aria-label="Window Controls">
        <Control
          role="button"
          tabIndex={0}
          aria-label="Minimize Window"
          onPress={() => minimize()}
          onKeyDown={(e: any) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              minimize()
            }
          }}
        >
          <Glyph>—</Glyph>
        </Control>
        <Control
          role="button"
          tabIndex={0}
          aria-label="Toggle Maximize Window"
          onPress={() => toggleMaximize()}
          onKeyDown={(e: any) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleMaximize()
            }
          }}
        >
          <Glyph>▢</Glyph>
        </Control>
        <Control
          role="button"
          tabIndex={0}
          aria-label="Close Window"
          onPress={() => close()}
          hoverStyle={{ backgroundColor: '$red9' }}
          onKeyDown={(e: any) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              close()
            }
          }}
        >
          <Glyph>✕</Glyph>
        </Control>
      </XStack>
    </XStack>
  )
}
