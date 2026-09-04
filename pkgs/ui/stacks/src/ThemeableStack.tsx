import type { GetProps } from '@hanzogui/core'
import { styled } from '@hanzogui/core'

import { YStack } from './Stacks.tsx'

import { bordered, circular, elevate } from './variants.tsx'

const chromelessStyle = {
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  shadowColor: 'transparent',

  hoverStyle: {
    borderColor: 'transparent',
  },
}

export const themeableVariants = {
  circular,
  elevate,

  bordered: {
    true: bordered,
  },

  transparent: {
    true: {
      backgroundColor: 'transparent',
    },
  },

  chromeless: {
    true: chromelessStyle,
    all: {
      ...chromelessStyle,
      hoverStyle: chromelessStyle,
      pressStyle: chromelessStyle,
      focusStyle: chromelessStyle,
    },
  },
} as const

export const ThemeableStack = styled(YStack, {
  variants: themeableVariants,
})

export type ThemeableStackProps = GetProps<typeof ThemeableStack>
