import { Text as HanzoguiText, styled } from '@hanzogui/core'

export const Text = styled(HanzoguiText, {
  variants: {
    unstyled: {
      false: {
        color: '$color',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.HANZOGUI_HEADLESS === '1',
  },
})
