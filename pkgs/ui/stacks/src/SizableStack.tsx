import { styled } from '@hanzogui/core'
import { getButtonSized } from '@hanzogui/get-button-sized'
import type { GetProps } from '@hanzogui/web'
import { ThemeableStack } from './ThemeableStack.tsx'
import { bordered, circular, elevate } from './variants.tsx'

export const SizableStack = styled(ThemeableStack, {
  name: 'SizableStack',

  variants: {
    unstyled: {
      true: {
        elevate: false,
        bordered: false,
      },
    },

    circular,
    elevate,

    bordered: {
      true: bordered,
    },

    size: {
      '...size': (val, extras) => {
        return getButtonSized(val, extras)
      },
    },
  } as const,
})

export type SizableStackProps = GetProps<typeof SizableStack>
