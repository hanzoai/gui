import { View, ThemeableStack, YStack, styled } from '@hanzo/gui'

export * from '@hanzo/gui'
export * from '@hanzogui/toast'
export * from './SandboxHeading.tsx'
export * from './views.tsx'

// test breaking exports
// export * from './TestExpoVectorIcons'
// export { Image as ExpoImage } from 'expo-image'
// export * from 'expo-constants'

export const SimpleTest = styled(View, {
  width: 100,
  height: 100,
  backgroundColor: 'blue',

  pressStyle: {
    backgroundColor: 'red',
  },
})

export const Test14Component = styled(YStack, {
  name: 'MyComponent',

  variants: {
    fullbleed: {
      true: {},
      false: {
        padding: '$4',
      },
    },
  } as const,

  defaultVariants: {
    fullbleed: false,
  },
})

export const TestBorderExtraction = styled(ThemeableStack, {
  theme: 'contentContainer',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderWidth: 1,
  borderRadius: '$10',
  height: '$10',
  width: '$10',
})
