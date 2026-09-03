import { ToastViewport } from '@hanzogui/toast'
import { lazy, Suspense } from 'react'
import { LoadProgressBar, Slot, usePathname } from 'one'
import { Theme, YStack } from '@hanzo/gui'
import { Footer } from '~/features/site/Footer'
import { Header } from '~/features/site/header/Header'
import { useSiteTheme } from '~/features/site/theme/useSiteTheme'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function SiteLayout() {
  const path = usePathname()
  const isStudio = path.startsWith('/studio')
  const isBlog = path.startsWith('/blog')
  const isDocs =
    path.startsWith('/docs') || path.startsWith('/ui') || path.startsWith('/demo')

  const disableNew = isBlog || isStudio
  const hideFooter = isDocs

  const { themeName, enabled } = useSiteTheme()

  const customThemeActive = enabled && Boolean(themeName)
  const customThemeName = customThemeActive ? themeName : null

  return (
    <YStack minHeight="100vh">
      {/* stats */}
      <script defer src="https://assets.onedollarstats.com/stonks.js" />

      <Header disableNew={disableNew} />
      <LoadProgressBar />
      <Theme name={customThemeName}>
        <YStack inset={0} position="absolute" bg="$color1" z={-1} pointerEvents="none" />
        <ThemeNameEffect colorKey="$color1" disableTint={customThemeActive} />
        <Slot />
      </Theme>
      {!hideFooter && <Footer />}
      <ToastViewport flexDirection="column-reverse" top="$2" left={0} right={0} />
      <ToastViewport
        multipleToasts
        name="viewport-multiple"
        flexDirection="column-reverse"
        top="$2"
        left={0}
        right={0}
      />
    </YStack>
  )
}
