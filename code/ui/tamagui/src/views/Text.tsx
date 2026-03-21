import { Text as TamaguiText, styled } from '@hanzo/gui-core'

export const Text = styled(TamaguiText, {
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
