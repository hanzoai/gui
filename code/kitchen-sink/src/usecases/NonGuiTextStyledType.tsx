import { GetBaseStyles, GetVariantProps, styled } from '@hanzo/gui-web'

const SomeNonGuiTextComponent = (props: {}) => {
  return null
}

export const SomeTextComponent = styled(
  SomeNonGuiTextComponent,
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
