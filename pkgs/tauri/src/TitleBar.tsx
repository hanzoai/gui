import { Text, XStack, styled } from 'hanzogui'
import { useWindowControls } from './window'

// A frameless-window titlebar built entirely from hanzogui primitives + tokens
// (true-black `$background`, hairline `$borderColor`). It is the proof that a
// hanzogui component drives the real Tauri OS window through the bridge. The bar
// is draggable via Tauri's `data-tauri-drag-region`; the buttons call the
// window controls. Renders harmlessly on the web (controls no-op off-Tauri).

const Control = styled(XStack, {
  width: 46,
  height: 32,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  hoverStyle: { backgroundColor: '$color4' },
  pressStyle: { backgroundColor: '$color5' },
  animation: 'quick',
})

const Glyph = styled(Text, {
  fontFamily: '$mono',
  fontSize: 13,
  lineHeight: 13,
  color: '$color11',
})

export type TitleBarProps = {
  title?: string
}

export function TitleBar({ title = '' }: TitleBarProps) {
  const { minimize, toggleMaximize, close } = useWindowControls()

  return (
    <XStack
      // @ts-expect-error — Tauri drag region is a raw DOM attribute (web/webview)
      data-tauri-drag-region
      height={40}
      alignItems="center"
      backgroundColor="$background"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      userSelect="none"
    >
      <Text
        flex={1}
        paddingLeft="$3"
        fontFamily="$body"
        fontSize={13}
        color="$color11"
        // @ts-expect-error — raw DOM attribute so clicks on the title still drag
        data-tauri-drag-region
      >
        {title}
      </Text>

      <XStack>
        <Control onPress={() => minimize()}>
          <Glyph>—</Glyph>
        </Control>
        <Control onPress={() => toggleMaximize()}>
          <Glyph>▢</Glyph>
        </Control>
        <Control onPress={() => close()} hoverStyle={{ backgroundColor: '$red9' }}>
          <Glyph>✕</Glyph>
        </Control>
      </XStack>
    </XStack>
  )
}
