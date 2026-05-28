import { Slot } from 'one'
import { Theme, YStack } from 'hanzogui'
import { useRecipesTheme } from '~/features/recipes/useRecipesTheme'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function Layout() {
  const { themeName, bgColor } = useRecipesTheme()

  return (
    <Theme name={themeName}>
      <ThemeNameEffect colorKey={bgColor as any} />
      <YStack flexBasis="auto" t={-54} pt={54} z={0} bg={bgColor as any}>
        <Slot />
      </YStack>
      <Footer />
    </Theme>
  )
}
