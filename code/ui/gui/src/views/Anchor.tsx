import { styled } from '@hanzogui/core'
import { SizableText } from '@hanzogui/text'

export const Anchor = styled(SizableText, {
  name: 'Anchor',
  tag: 'a',
  accessibilityRole: 'link',
})

export type AnchorProps = React.ComponentProps<typeof Anchor>
