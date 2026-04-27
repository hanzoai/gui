import { GetBaseStyles, GetVariantProps, styled } from '@hanzogui/web'

const SomeNonHanzoguiTextComponent = (props: {}) => {
  return null
}

export const SomeTextComponent = styled(
  SomeNonHanzoguiTextComponent,
  {
    color: '$background',

    variants: {
      foo: {
        true: {
          // making sure this has color
          color: '$background',
        },
      },
    } as const,
  },

  { isText: true }
)
