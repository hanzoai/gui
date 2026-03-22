import type { GetProps } from '@hanzo/gui-core'
import { styled } from '@hanzo/gui-core'
import { YStack } from '@hanzo/gui-stacks'

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
