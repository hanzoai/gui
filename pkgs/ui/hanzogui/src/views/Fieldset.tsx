import type { GetProps } from '@hanzogui/core'
import { styled } from '@hanzogui/core'
import { YStack } from '@hanzogui/stacks'

export const Fieldset = styled(YStack, {
  name: 'Fieldset',
  render: 'fieldset',

  // remove browser default styling
  borderWidth: 0,

  variants: {
    horizontal: {
      true: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
  } as const,
})

export type FieldsetProps = GetProps<typeof Fieldset>
