import { Text as GuiText, styled } from '@hanzogui/core'

export const Text = styled(GuiText, {
  variants: {
    unstyled: {
      false: {
        color: '$color',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.HANZO_GUI_HEADLESS === '1',
  },
})
