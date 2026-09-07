import { setTintIndex } from '@hanzogui/logo'
import { useLoader } from 'one'
import { lazy, useEffect } from 'react'
import { YStack } from '@hanzo/gui'
import { HeadInfo } from '~/components/HeadInfo'
import { HomeGlow } from '~/features/site/home/HomeGlow'
import { Hero } from '~/features/site/home/HomeHero'
import { HomeHeroBelow } from '~/features/site/home/HomeHeroBelow'
import { Near } from '~/features/site/home/Near'
import { HomeSection, SectionTinted, TintSection } from '~/features/site/home/TintSection'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

// Below the fold every section is its own chunk, so the first bundle carries
// the hero alone. Each is mounted by <Near /> as it approaches.
const HomeExamples = lazy(() =>
  import('~/features/site/home/HomeExamples').then((m) => ({ default: m.HomeExamples }))
)
const HomeThemes = lazy(() =>
  import('~/features/site/home/HomeThemes').then((m) => ({ default: m.HomeThemes }))
)
const HomeResponsive = lazy(() =>
  import('~/features/site/home/HomeResponsive').then((m) => ({
    default: m.HomeResponsive,
  }))
)
const HomePerformance = lazy(() =>
  import('~/features/site/home/HomePerformance').then((m) => ({
    default: m.HomePerformance,
  }))
)
const HomeAnimations = lazy(() =>
  import('~/features/site/home/HomeAnimations').then((m) => ({
    default: m.HomeAnimations,
  }))
)
const HomeFeaturesGrid = lazy(() =>
  import('~/features/site/home/HomeFeaturesGrid').then((m) => ({
    default: m.HomeFeaturesGrid,
  }))
)
const HomeTypography = lazy(() =>
  import('~/features/site/home/HomeTypography').then((m) => ({
    default: m.HomeTypography,
  }))
)
const HomeExampleProps = lazy(() =>
  import('~/features/site/home/HomeExampleProps').then((m) => ({
    default: m.HomeExampleProps,
  }))
)
const HomeCommunity = lazy(() =>
  import('~/features/site/home/HomeCommunity').then((m) => ({
    default: m.HomeCommunity,
  }))
)

// Sections that neither overflow their box nor hold anything fixed are
// painted and laid out in isolation, and skipped entirely while off screen.
// The size is what each measures at 1360px, so the scrollbar holds still.
const isolated = (height: number) =>
  ({
    contain: 'paint layout',
    style: { contentVisibility: 'auto', containIntrinsicSize: `auto ${height}px` },
  }) as const

const dotGrid = (
  <YStack
    pointerEvents="none"
    z={0}
    fullscreen
    className="bg-dot-grid"
    style={{
      maskImage: `linear-gradient(transparent, #000, transparent)`,
    }}
  />
)

export async function loader() {
  const { getCompilationExamples } = await import('~/features/mdx/getMDXBySlug')
  return getCompilationExamples()
}

export default function GuiHomePage() {
  const { compilationExamples, animationCode } = useLoader(loader)

  useEffect(() => {
    setTintIndex(3)
  }, [])

  if (!compilationExamples) {
    return null
  }

  return (
    <>
      <HeadInfo
        title="Gui"
        description="React Native style library and UI kit with the best web performance"
      />

      <ThemeNameEffect colorKey="$color3" />

      <HomeGlow />

      <YStack
        fullscreen
        className="grain"
        opacity={0.2}
        style={{
          maskImage: `linear-gradient(transparent, rgba(0, 0, 0, 1) 100px)`,
        }}
      />

      <TintSection index={0} p={0}>
        <Hero />
      </TintSection>
      <HomeHeroBelow />
      <TintSection index={2} z={1000} {...isolated(898)}>
        {dotGrid}
        <Near height={670}>
          <HomeExamples examples={compilationExamples} />
        </Near>
      </TintSection>
      <TintSection index={3} my={-50} position="relative" z={100} {...isolated(858)}>
        {dotGrid}
        <Near height={630}>
          <HomeThemes />
        </Near>
      </TintSection>
      <TintSection index={4} mb={-120} z={100}>
        <Near height={650}>
          <HomeResponsive />
        </Near>
      </TintSection>
      <TintSection index={5} p={0} z={0} {...isolated(566)}>
        <SectionTinted gradient bubble>
          <Near height={340}>
            <HomePerformance />
          </Near>
        </SectionTinted>
      </TintSection>
      <TintSection index={6} z={100} {...isolated(997)}>
        <YStack
          fullscreen
          className="bg-grid"
          style={{
            maskImage: `linear-gradient(transparent, #000, transparent)`,
          }}
        />
        <Near height={770}>
          <HomeAnimations animationCode={animationCode} />
        </Near>
      </TintSection>
      <TintSection index={7} z={1} {...isolated(585)}>
        <Near height={355}>
          <HomeFeaturesGrid />
        </Near>
        <YStack
          pointerEvents="none"
          z={2}
          fullscreen
          className="bg-dot-grid"
          style={{
            maskImage: `linear-gradient(transparent, #000, transparent)`,
          }}
        />
      </TintSection>
      <TintSection index={8} my="$-4" p={0} z={100} {...isolated(695)}>
        <SectionTinted z={1000} bubble gradient>
          <Near height={465}>
            <HomeTypography />
          </Near>
        </SectionTinted>
      </TintSection>
      <HomeSection z={10} {...isolated(697)}>
        {dotGrid}
        <Near height={470}>
          <HomeExampleProps />
        </Near>
      </HomeSection>
      <HomeSection z={0} {...isolated(390)}>
        <Near height={160}>
          <HomeCommunity />
        </Near>
      </HomeSection>
    </>
  )
}
